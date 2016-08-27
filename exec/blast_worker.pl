#!/usr/bin/env perl

use strict;
use warnings;
use autodie;

use v5.10;
no warnings 'experimental::smartmatch';

use Data::Dumper;
use Data::UUID;
use TryCatch;
use Capture::Tiny ':all';
use Path::Tiny;
use JSON;
use List::Util qw(max min);
use List::MoreUtils qw(uniq);

use Redis::JobQueue;
use Redis::JobQueue::Job qw(
    STATUS_CREATED
    STATUS_WORKING
    STATUS_COMPLETED
    STATUS_FAILED
);

use Bio::Tools::Run::StandAloneBlastPlus;

try {
    my $jq = Redis::JobQueue->new(
        redis   => 'db:6379',
        timeout => 0,   # DEFAULT_TIMEOUT = 0 for an unlimited timeout
    );

    while (my $job = $jq->get_next_job(queue => ['blast.submit','blast.format'], blocking => 1)) {
        my $id = $job->id;
        say STDERR "Got job ID " . $job->id;
        for ($job->queue) {
            when (/^blast.submit$/) {
                $job->status(STATUS_WORKING);
                $jq->update_job($job);

                make_blastdb($jq,$job);
                run_blast($jq,$job);
                my $json = format_results($jq,$job);
                #prepare_jbrowse($jq,$job,$json);

                $job->status(STATUS_COMPLETED);
                $jq->update_job($job);
            }
            when (/^blast.format$/) {
                format_results($jq,$job);
            }
            default {
                say STDERR "No action matched for queue $_.";
            }
        }
    }
}
catch($err) {
    say STDERR "Caught an error while processing blast job: $err";
}

sub make_blastdb {
    my $jq = shift;
    my $job = shift;
    say STDERR "Making temp BLAST DB";
}

sub run_blast {
    my $jq = shift;
    my $job = shift;

    my $blast_job = $job->workload;
    say STDERR "Received BLAST job";
    say STDERR Dumper($job);

    my $fac = Bio::Tools::Run::StandAloneBlastPlus->new(
        -DB_NAME => '/indices/7227/scaffold'
    );

    say STDERR "Running BLAST";
    try {
        my $query = $blast_job->{query};
        my $result = $fac->run(
            -method => $blast_job->{tool},
            -query => $blast_job->{query},
            -outfile => $blast_job->{output},
            -outformat => 11
        );
    }
    catch ($err) {
        $job->status(STATUS_FAILED);
        $jq->update_job($job);
        die "Failed to run BLAST job: $err";
    }

    #say STDERR "BLAST job failed." unless (defined $result);
    #say STDERR "BLAST finished, output in: " .  $blast_job->output;
    say STDERR "BLAST finished.";
}


sub format_results {
    my $jq     = shift;
    my $job    = shift;
    my $format = shift // 15;
    my $file_ext = shift // '.json';

    my $blast_job = $job->workload;
    my $input  = $blast_job->{output};
    my $output = $blast_job->{output};
    $output =~ s/\.\w+$/$file_ext/;
    my $error = $output . '.err';
    open(my $out_fh, '>', $output);
    open(my $err_fh, '>', $error);

    say STDERR "Processing BLAST results.";
    try {
        my $cmd = "blast_formatter";
        my @args = ();
        push(@args,'-archive',$input,'-outfmt',$format);
        capture {
            system($cmd, @args);
        } stdout => $out_fh, stderr => $err_fh;
    }
    catch ($err) {
        say $err_fh "Caught an error while running blast_formatter: $err";
    }
    close($out_fh);
    close($err_fh);

    say STDERR "Processing finished.";
    return $output;
}

sub prepare_jbrowse {
    my $jq = shift;
    my $job = shift;
    my $json_file = shift;

    my $blast_job = $job->workload;
    my $fasta     = $blast_job->{query};
    try {
        # Make the JBrowse directory.
        my $dir = path("/jbrowse","data",$job->id);
        $dir->mkpath;

        # Read in the BLAST JSON output
        my $json_txt = path($json_file)->slurp_utf8;

        system('/jbrowse/bin/prepare-refseqs.pl','--fasta',$fasta,'--out',$dir);
        my $blast_json = decode_json $json_txt;
        my $gff = $json_file;
        $gff =~ s/\.json$/\.gff/;
        create_gff($blast_json,$gff);
        system('/jbrowse/bin/flatfile-to-json.pl','--gff',$gff,'--out',$dir,'--trackLabel','Query','--trackType','CanvasFeatures','--type','region');
        system('/jbrowse/bin/flatfile-to-json.pl','--gff',$gff,'--out',$dir,'--trackLabel','BLAST hits','--trackType','CanvasFeatures','--type','match','--config','{ "glyph": "JBrowse/View/FeatureGlyph/Segments" }');
        system('/jbrowse/bin/generate-names.pl','-i','--out',$dir);
    }
    catch ($err) {
        say STDERR "Error during JBrowse preparation: " . $err;
    }
}

sub create_gff {
    my $json = shift;
    my $gff  = shift;

    open (my $fh, '>', $gff);

    say $fh "##gff-version 3.2.1";


    for my $blast_output (@{$json->{BlastOutput2}}) {
        my $report = $blast_output->{report};
        my $seqid = $report->{results}{search}{query_id};

        my $length = $report->{results}{search}{query_len};
        say $fh "##sequence-region $seqid 1 " . $length;

        say $fh "$seqid\tQuery\tregion\t1\t$length\t.\t+\t.\tID=" . $seqid;

        for my $hit (@{$report->{results}{search}{hits}}) {
            #my $ug = Data::UUID->new;
            my $hit_id = ${$hit->{description}}[0]->{id}; # Can we always assume 1 description / hit?
            my @hsps = @{$hit->{hsps}};
            my $min = min(map { $_->{query_from} } @hsps);
            my $max = max(map { $_->{query_to} } @hsps);
            my @strands = map { $_->{query_strand} } @hsps;
            my @frames  = map { $_->{query_frame} } @hsps;
            my $score = $hsps[0]->{evalue};
            my $strand = get_strand(@strands);

            say $fh "$seqid\tBLAST\tmatch\t$min\t$max\t$score\t$strand\t.\tID=" . $hit_id;

            for my $hsp (@hsps) {
                my $start = $hsp->{query_from};
                my $end  = $hsp->{query_to};
                my $score = $hsp->{evalue} // '.';
                my $strand = get_strand($hsp->{query_strand});
                say $fh "$seqid\tBLAST\tmatch_part\t$start\t$end\t$score\t$strand\t.\tParent=$hit_id";
            }

            #say STDERR "$min $max " . join(' ',@strand);
            

        }

    }
    close($fh);
}


sub get_strand {
    my @strands = uniq(@_);
    my $strand = '.';

    if (@strands && scalar @strands == 1) {
        $strand = '+' if ($strands[0] eq 'Plus');
        $strand = '-' if ($strands[0] eq 'Minus');
    }

    return $strand;
}

#!/usr/bin/env perl

use strict;
use warnings;
use autodie;

use v5.10;
no warnings 'experimental::smartmatch';

use Data::Dumper;
use TryCatch;
use Capture::Tiny ':all';

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
                format_results($jq,$job);

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

#$r->psubscribe(
#    qw/blast.*/,
#    my $cb = sub {
#        my ($msg, $topic, $sub_topic) = @_;
#        $decoder->decode($msg, my $job);
#
#        for ($sub_topic) {
#            when (/^blast.submit$/) {
#                make_blastdb($job);
#                run_blast($job);
#                format_results($job);
#            }
#            when (/^blast.format$/) {
#                format_results($job);
#            }
#            default {
#                say STDERR "No action matched for $sub_topic.";
#            }
#        }
#    }
#);
#
##Endless loop to wait for messages.
#my $timeout = 0;
#$r->wait_for_messages($timeout) while (1); 

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
    my $jq   = shift;
    my $job  = shift;
#
#        my $blast_job = $job->decode;
#        my $input  = $blast_job->{output};
#        my $output = $blast_job->{output};
#        $output =~ s/\.\w+$/\.json/;
#        my $error = $output . '.err';
#        open(my $out_fh, '>', $output);
#        open(my $err_fh, '>', $error);
#
    say STDERR "Processing BLAST results.";
#        try {
#            my $cmd = "blast_formatter";
#            my @args = ();
#            push(@args,'-archive',$input,'-outfmt',0);
#            capture {
#                system($cmd, @args);
#            } stdout => $out_fh, stderr => $err_fh;
#        }
#        catch ($err) {
#            say $err_fh "Caught an error while running blast_formatter: $err";
#        }
#        close($out_fh);
#        close($err_fh);
#
    say STDERR "Processing finished.";
}

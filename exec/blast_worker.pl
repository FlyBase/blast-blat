#!/usr/bin/env perl

use strict;
use warnings;
use autodie;

use 5.010;

use AnyEvent;
use AnyEvent::Beanstalk::Worker;
use Data::Dumper;
use TryCatch;
use Capture::Tiny ':all';

use Bio::Tools::Run::StandAloneBlastPlus;


my $worker = AnyEvent::Beanstalk::Worker->new(
    concurrency => $ENV{'BLAST_THREADS'},
    max_stop_tries => 1,
    initial_state => 'make_blastdb',
    beanstalk_watch => $ENV{'BLAST_QUEUE'}
);

$worker->beanstalk->use($ENV{'BLAST_QUEUE'})->recv;

$worker->on(make_blastdb => sub {
        my $self = shift;
        my $job  = shift;
        my $resp = shift // {};

        say STDERR "Making temp BLAST DB";

        $self->emit(run_blast => $job, $resp, @_);
    });

$worker->on(run_blast => sub {
        my $self = shift;
        my $job  = shift;
        my $resp = shift // {};

        my $blast_job = $job->decode;

        say STDERR "Received BLAST job";
        say STDERR Dumper($blast_job);

        my $fac = Bio::Tools::Run::StandAloneBlastPlus->new(
            -DB_NAME => '/indices/7227/scaffold'
        );

        open(my $err_fh, '>', $blast_job->{output} . '.err');
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
            $self->finish(delete => $job->id);
            say $err_fh "Failed to run BLAST job: " . $err;
        }
        close($err_fh);

        
        #say STDERR "BLAST job failed." unless (defined $result);
        #say STDERR "BLAST finished, output in: " .  $blast_job->output;
        say STDERR "BLAST finished.";

        $self->emit(process_results => $job, $resp, @_);
    });

$worker->on(process_results => sub {
        my $self = shift;
        my $job  = shift;
        my $resp = shift // {};

        my $blast_job = $job->decode;
        my $input  = $blast_job->{output};
        my $output = $blast_job->{output};
        $output =~ s/\.\w+$/\.json/;
        my $error = $output . '.err';
        open(my $out_fh, '>', $output);
        open(my $err_fh, '>', $error);

        say STDERR "Processing BLAST results.";
        try {
            my $cmd = "blast_formatter";
            my @args = ();
            push(@args,'-archive',$input,'-outfmt',0);
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
        return $self->finish(delete => $job->id);
    });


$worker->start;
AnyEvent->condvar->recv;

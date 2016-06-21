#!/usr/bin/env perl

use strict;
use warnings;

use 5.010;

use AnyEvent;
use AnyEvent::Beanstalk::Worker;
use Data::Dumper;
use TryCatch;

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

        say STDERR "Running BLAST";
        try {
            my $query = $blast_job->{query};
            my $result = $fac->run(
                -method => $blast_job->{tool},
                -query => $blast_job->{query},
                -outfile => $blast_job->{output}
            );
        }
        catch ($err) {
            $self->finish(delete => $job->id);
            say STDERR "Failed to run BLAST job: " . $err;
        }

        
        #say STDERR "BLAST job failed." unless (defined $result);
        #say STDERR "BLAST finished, output in: " .  $blast_job->output;
        say STDERR "BLAST finished.";

        $self->emit(process_results => $job, $resp, @_);
    });

$worker->on(process_results => sub {
        my $self = shift;
        my $job  = shift;
        my $resp = shift // {};

        say STDERR "Processing BLAST results.";

        say STDERR "Processing finished.";
        return $self->finish(delete => $job->id);
    });


$worker->start;
AnyEvent->condvar->recv;

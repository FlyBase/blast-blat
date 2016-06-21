#!/usr/bin/env perl

use strict;
use warnings;

use 5.010;

use Data::Dumper;
use Bio::Seq;
use Bio::SeqIO;
use Bio::Tools::Run::StandAloneBlastPlus;


say STDERR "Received BLAST job";
my $fac = Bio::Tools::Run::StandAloneBlastPlus->new(
    -DB_NAME => '/indices/7227/scaffold'
);

say STDERR "Running BLAST";
my $result = $fac->blastn(
    -query => Bio::PrimarySeq->new( -seq => 'AGTTTGAATCGAAACGCGAGGCGGTAAACATGTTTTGAGAAAACGAGCTCTCGCCGAACGAAACGAAGTCGAACACCCTG')
);

say STDERR "BLAST job failed." unless (defined $result);
say STDERR "BLAST finished";

say STDERR Dumper($result);


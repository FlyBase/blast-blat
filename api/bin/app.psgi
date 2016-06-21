#!/usr/bin/env perl

use strict;
use warnings;
use FindBin;
use lib "$FindBin::Bin/../lib";

use Bio::FlyBase::Alignment;
Bio::FlyBase::Alignment->to_app;

package Bio::FlyBase::Alignment;
use Dancer2;

use Bio::FlyBase::Alignment::Blast;

our $VERSION = '0.1';

get '/' => sub {
    template 'index';
};

1;

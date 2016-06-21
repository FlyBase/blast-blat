package Bio::FlyBase::Api::Response;

use Moo;
use DateTime;

=head1 NAME

Bio::FlyBase::Api::Response - A helper class for returning properly formed API responses.

=head1 SYNOPSIS

    my $resp = Bio::FlyBase::Api::Response->new(api_version => '1.0');
    $resp->add_result({ message => "Hi there" });
    $resp->add_result({ message => "Hi again" });
    my $api_hashref_resp = $resp->get;

=head1 DESCRIPTION

This is a helper class for building responses to RESTful API services.
You populate this with various parameters for the API version, data provider,
and service result(s).  Then you can get a hashref that can be serialized
into many different formats.

=head2 Methods

=over 12

=item C<new>

The only required parameter to new is the api_version.

   Bio::FlyBase::Api::Response->new(api_version => "1.0");

=item C<api_version>

Returns the current api_version.

=item C<data_provider>

Sets/Gets the data_provider attribute.  Defaults to 'FlyBase'.
The data provider is the name of the owner of the service.

=item C<data_version>

Sets/Gets the data_version attribute.

=item C<query_time>

Returns the time at which the response object was materialized via L<get>.
Multiple calls to get will not modify the query_time.

=item C<query_url>

Sets/Gets the query_url attribute.

=item C<add_result>

Add a hash reference(s) to the result set.
Takes one or more hash referencees to return as an array of 
results.

=item C<result_count>

Returns the number of results in the current object.

=item C<clear_result>

Clears all stored results.

=item C<get>

Materializes the API response object into a hashref
that can then be serialized into JSON, XML, etc.

=back

=cut

has 'api_version' => (
    is => 'ro',
    required => 1
);

has 'data_provider' => (
    is => 'rw',
    default => 'FlyBase'
);

has 'data_version' => (
    is => 'rw'
);

has 'query_time' => (
    is => 'ro',
    isa => sub { die "Not a timestamp" unless $_[0]->isa("DateTime") },
    init_arg => undef,
    lazy => 1,
    builder => '_query_time'
);

sub _query_time {
    return DateTime->now;
}

has 'query_url' => (
    is => 'rw'
);

has '_result' => (
    is => 'ro',
    default => sub { [] },
    clearer => 'clear_result',
    init_arg => undef
);

sub add_result {
    my $self = shift;
    my @valid_results = grep { ref($_) eq 'HASH' } @_;
    push(@{$self->_result},@valid_results);
}

sub result_count {
    my $self = shift;
    return scalar @{$self->_result};
}

sub get {
    my $self = shift;
    my $response = {};

    $response->{resultset} = {};
    $response->{resultset}{api_version} = $self->api_version if defined $self->api_version;
    $response->{resultset}{data_provider} = $self->data_provider if defined $self->data_provider; 
    $response->{resultset}{data_version} = $self->data_version if defined $self->data_version;
    $response->{resultset}{query_time} = $self->query_time->iso8601() if defined $self->query_time;
    $response->{resultset}{query_url} = $self->query_url if defined $self->query_url;
    $response->{resultset}{result} = $self->_result;

    return $response;
}

1;

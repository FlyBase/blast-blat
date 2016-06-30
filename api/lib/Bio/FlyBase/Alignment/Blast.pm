package Bio::FlyBase::Alignment::Blast;

use Dancer2 appname => 'Bio::FlyBase::Alignment';

use Path::Tiny qw(tempfile path);
use AnyEvent::Beanstalk;
use Data::Dumper;
use JSON::Schema;
use Digest::SHA qw(sha256_hex);
use Bio::FlyBase::Api::Response;

prefix '/blast';

my $result_base_dir = $ENV{'BLAST_RESULT_BASE_DIR'};
my $fasta_tmp_dir   = "/fasta/tmp";

path($fasta_tmp_dir)->mkpath unless -e -r $fasta_tmp_dir;

my $bs = AnyEvent::Beanstalk->new(server => 'exec', debug => 1);

post qr{/submit/(blastn|blastp|blastx|tblastn|tblastx)} => sub {
    my ($tool) = splat;
    my $json   = request->body;
    my $resp   = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    #Get the BLAST queue name from Docker
    $bs->use($ENV{'BLAST_QUEUE'})->recv;

    content_type 'application/json';

    #Describe the shape of the JSON request using JSON Schema http://json-schema.org
    my $schema = {
        type => 'object',
        properties => {
            db => {
                type => 'array',
                minItems => 1,
                required => 1,
                items => { type => 'string'}
            },
            query => {
                type => 'array',
                minItems => 1,
                required => 1,
                items => { type => 'string'}
            },
            tool => { type => 'string' },
            species => { type => 'number'},
            args => { type => 'object' },
            evalue => { type => 'string' }
        },
        additionalProperties => 0
    };

    my $validator = JSON::Schema->new($schema);
    my $result = $validator->validate($json);

    if ($result) {
        my $h  = from_json $json;
        my $jobs = session('jobs') // [];

        my $blast_result = tempfile(
            TEMPLATE => 'blast_result_XXXXXXXXXXXXXXX',
            DIR      => $result_base_dir,
            SUFFIX   => '.asn',
            UNLINK   => 0,
            EXLOCK   => 0
        );
        my $fasta = tempfile(
            TEMPLATE => 'query_XXXXXXXXXXXXXXX',
            DIR      => $fasta_tmp_dir,
            SUFFIX   => '.fa',
            UNLINK   => 0,
            EXLOCK   => 0
        );
        my $fasta_fh = $fasta->filehandle('>');

        my $i=0;
        for my $seq (@{$h->{query}}) {
            say $fasta_fh '>no query name specified' unless $seq =~ /^>/;
            say $fasta_fh $seq;
        }

        close $fasta_fh;

        my $blast = {
            type    => 'BLAST',
            started => DateTime->now->iso8601,
            tool    => $tool,
            db      => $h->{db},
            species => $h->{species},
            query   => $fasta->stringify,
            args    => $h->{args},
            evalue  => $h->{evalue},
            output  => $blast_result->stringify
        };

        my $job = $bs->put({
                priority => 100,
                ttr => 600,
                delay => 1,
                encode => $blast
            })->recv;

        $blast->{jobid} = sha256_hex($job->id . int(rand(100000)));

        push(@{$jobs},$blast);
        session jobs => $jobs;

        $resp->add_result({ jobid => $blast->{jobid} });
        return $resp->get;
    }
    else {
        status 400;
        for my $err ($result->errors) {
            $resp->add_result({
                    error => sprintf("%s",$err)
                });
        }
        return $resp->get;
    }

    return undef;
};

any '/job/list' => sub {
    my $jobs = session('jobs');
    my $resp = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));
    my @ids  = map { $_->{jobid} } @{$jobs};

    for my $id ( @ids ) {
        $resp->add_result({
                status => 'status here',
                jobid  => $id
            });
    }

    content_type 'application/json';
    return $resp->get;
};

#TODO - Need to modify this so that it returns a JSON representation
#of the BLAST report for viewing.
#For now, we are just sending the raw pairwise text back.
any '/job/results/:jobid' => sub {
    my $jobid = params->{jobid};
    my $resp  = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    my $jobs = session('jobs');
    for my $job (@{$jobs}) {
        next unless $job->{jobid} eq $jobid;
        my $file = path($job->{output});
        $file =~ s/\.asn$/\.json/;
        my $data = path($file)->slurp_utf8;
        $resp->add_result({
                jobid => $jobid,
                blast => $data
            });
    }

    content_type 'application/json';
    return $resp->get;
};

any '/job/info/:jobid' => sub {
    my $jobid = params->{jobid};
    my $resp  = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    my $jobs = session('jobs');
    for my $job (@{$jobs}) {
        if ($job->{jobid} eq $jobid) {
            delete $job->{output};
            $resp->add_result({job =>$job});
        }
    }
    content_type 'application/json';
    return $resp->get;
};

any '/job/delete/:jobid' => sub {
    my $jobid = params->{jobid};
    my $resp  = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    my $jobs = session('jobs');
    for (my $i=0; $i < scalar @{$jobs}; $i++) {
        if ($jobs->[$i]->{jobid} eq $jobid) {
            splice(@{$jobs},$i,1);
            $resp->add_result({ job => { jobid => $jobid, deleted => 1} });
        }
    }

    session jobs => $jobs;
    content_type 'application/json';
    return $resp->get;
};

any qr{.*} => sub {
    status 'not_found';
    return { error => "Service not found" };
};

sub check_status {
    my $job = shift;

}

1;

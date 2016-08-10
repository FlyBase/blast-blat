package Bio::FlyBase::Alignment::Blast;

use Dancer2 appname => 'Bio::FlyBase::Alignment';

use Path::Tiny qw(tempfile path);
use Data::Dumper;
use JSON::Schema;
use Digest::SHA qw(sha256_hex);
use TryCatch;
use Bio::FlyBase::Api::Response;

use Redis::JobQueue;
use Redis::JobQueue::Job qw(
    STATUS_CREATED
    STATUS_WORKING
    STATUS_COMPLETED
);

prefix '/blast';

my $result_base_dir = $ENV{'BLAST_RESULT_BASE_DIR'};
my $fasta_tmp_dir   = "/fasta/tmp";

path($fasta_tmp_dir)->mkpath unless -e -r $fasta_tmp_dir;

my $jq;
 
try {
    $jq = Redis::JobQueue->new(
        redis   => 'db:6379',
        timeout => 0,   # DEFAULT_TIMEOUT = 0 for an unlimited timeout
    );
}
catch($err) {
    error("Can't connect to job queue.");
}

post qr{/submit/(blastn|blastp|blastx|tblastn|tblastx)} => sub {
    my ($tool) = splat;
    my $json   = request->body;
    my $resp   = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    try {
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
                name => { type => 'string'},
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
            my $jobids = session('jobids') // {};

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
                queue   => 'blast.submit',
                expire => 0,
                workload => {
                    name    => $h->{name} // 'N/A',
                    tool    => $tool,
                    db      => $h->{db},
                    species => $h->{species},
                    query   => $fasta->stringify,
                    args    => $h->{args},
                    evalue  => $h->{evalue},
                    output  => $blast_result->stringify
                }
            };

            my $job = $jq->add_job($blast);
            $jobids->{$job->id} = undef;
            session jobids => $jobids;

            $resp->add_result({ jobid => $job->id  });
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
    }
    catch ($err) {
        status 500;
    }

    return undef;
};

any '/job/list' => sub {
    my $jobids = session('jobids');
    my $resp = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    for my $id ( keys %{$jobids} ) {
        my $data = $jq->get_job_data($id);
        next unless $data;
        $resp->add_result({
                status => $data->{status},
                jobid  => $id,
                created => $data->{created},
                started => $data->{started},
                completed => $data->{completed},
                name   => $data->{workload}{name},
                tool => $data->{workload}{tool},
                db => $data->{workload}{db}
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

    my $jobids = session('jobids');
    if (exists $jobids->{$jobid}) {
        my $job_data = $jq->get_job_data($jobid,'workload');
        my $file = path($job_data->{output});
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

    my $jobids = session('jobids');
    if (exists $jobids->{$jobid}) {
        my $job_data = $jq->get_job_data($jobid,'workload');
        delete $job_data->{output};
        $job_data->{query}  = path($job_data->{query})->slurp_utf8;
        $job_data->{status} = $jq->get_job_data($jobid,'status');
        $job_data->{jobid}  = $jobid;
        $resp->add_result({job => $job_data});
    }
    content_type 'application/json';
    return $resp->get;
};

any '/job/delete/:jobid' => sub {
    my $jobid = params->{jobid};
    my $resp  = Bio::FlyBase::Api::Response->new( api_version => '1.0', query_url => (request->uri_base . request->uri));

    my $jobids = session('jobids');
    if (exists $jobids->{$jobid}) {
        #Delete from session hash.
        delete $jobids->{$jobid};
        #Delete from Job queue.
        $jq->delete_job($jobid);
        $resp->add_result({ job => { jobid => $jobid, deleted => 1} });
    }

    session jobids => $jobids;
    content_type 'application/json';
    return $resp->get;
};

any qr{.*} => sub {
    status 'not_found';
    return { error => "Service not found" };
};


1;

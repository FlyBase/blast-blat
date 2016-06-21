FROM debian:jessie

MAINTAINER Josh Goodman <jogoodma@indiana.edu>

RUN apt-get update && apt-get install -y \
        curl \
        perl \
        perl-doc \
        cpanminus \
        make \
        gcc \
        beanstalkd \
        libbio-perl-perl \
        libtrycatch-perl

RUN cpanm AnyEvent::Beanstalk AnyEvent::Beanstalk::Worker

RUN curl -s -o ncbi-blast.tar.gz ftp://ftp.ncbi.nlm.nih.gov/blast/executables/LATEST/ncbi-blast-2.4.0+-x64-linux.tar.gz
RUN tar zxvf ncbi-blast.tar.gz
RUN mv ncbi-blast-2.4.0+/bin/* /usr/bin/

COPY docker-entrypoint.sh blast_worker.pl /

RUN mkdir -p /data
VOLUME /data

EXPOSE 11300

ENTRYPOINT ["/docker-entrypoint.sh"]

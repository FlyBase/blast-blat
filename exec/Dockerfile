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
        libtrycatch-perl \
        libsereal-decoder-perl \
        libsereal-encoder-perl \
        libcapture-tiny-perl \
        libredis-perl

RUN cpanm Redis::JobQueue
RUN curl -s -o ncbi-blast.tar.gz ftp://ftp.ncbi.nlm.nih.gov/blast/executables/LATEST/ncbi-blast-2.4.0+-x64-linux.tar.gz
RUN tar zxvf ncbi-blast.tar.gz
RUN mv ncbi-blast-2.4.0+/bin/* /usr/bin/

RUN mkdir -p /app

COPY docker-entrypoint.sh /
COPY . /app

RUN mkdir -p /data
VOLUME /data

EXPOSE 11300

ENTRYPOINT ["/docker-entrypoint.sh"]

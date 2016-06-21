FROM debian:jessie

MAINTAINER Josh Goodman <jogoodma@indiana.edu>

#postgresql-client \
#libdbd-pg-perl \
RUN apt-get update && apt-get install -y \
        curl \
        perl \
        perl-doc \
        libdancer2-perl \
        libjson-perl \
        libbio-perl-perl \
        libtest-sharedfork-perl \
        libsereal-decoder-perl \
        libsereal-encoder-perl \
        libdatetime-perl \
        libtrycatch-perl \
        cpanminus \
        gcc \
        make \
        gzip \
        pigz

RUN cpanm AnyEvent::Beanstalk JSON::Schema
RUN cpanm -n Dancer2::Session::Sereal

RUN mkdir -p /opt
RUN mkdir -p /app
RUN mkdir -p /db

WORKDIR /opt
RUN curl -s -o ncbi-blast.tar.gz ftp://ftp.ncbi.nlm.nih.gov/blast/executables/LATEST/ncbi-blast-2.4.0+-x64-linux.tar.gz
RUN tar zxvf ncbi-blast.tar.gz
RUN mv ncbi-blast-2.4.0+/bin/* /usr/bin/

WORKDIR /

COPY . /app
COPY docker-entrypoint.sh /

VOLUME /app
VOLUME /db

WORKDIR /app

EXPOSE 5000
ENTRYPOINT ["/docker-entrypoint.sh"]

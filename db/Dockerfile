FROM postgres:9.5

MAINTAINER Josh Goodman <jogoodma@indiana.edu>

RUN mkdir -p /docker-entrypoint-initdb.d
COPY init.sh /docker-entrypoint-initdb.d/
RUN chmod +x /docker-entrypoint-initdb.d/*.sh

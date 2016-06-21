#!/bin/sh
beanstalkd -b /data -p 11300 &
/blast_worker.pl

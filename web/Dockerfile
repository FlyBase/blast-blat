FROM node:latest

MAINTAINER Josh Goodman <jogoodma@indiana.edu>

RUN mkdir -p /app
COPY . /app
VOLUME /app

EXPOSE 3000

WORKDIR /app

ENTRYPOINT ["npm"]
CMD ["run","start"]

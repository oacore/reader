# BUILD IMAGE
#   docker build --rm -t core-reader .
#
# RUN CONTAINER
#   docker run --name core-reader-dev -ti -p 9000:9000 core-reader:latest


FROM node:12.8.0-alpine
MAINTAINER core.ac.uk

ENV NODE_ENV development

WORKDIR /app
ADD . /app
RUN yarn install

EXPOSE 9000

# default command runs dev server
CMD yarn run start --host 0.0.0.0

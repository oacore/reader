# BUILD IMAGE
#   docker build --rm -t core-reader .
#
# RUN CONTAINER
#   docker run --name core-reader-dev -ti -p 3000:3000 core-reader:latest


FROM node:12.8.0-alpine
MAINTAINER core.ac.uk

ENV NODE_ENV development

WORKDIR /app
ADD . /app
RUN npm run install
RUN npm run build

EXPOSE 3000

# default command runs dev server
CMD npm run start --host 0.0.0.0

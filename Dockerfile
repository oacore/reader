FROM node:18-alpine

ARG BUILD_TARGET=azure
ARG SENTRY_DSN
ARG NODE_ENV=production
ARG NPM_TOKEN
ARG GA_TRACKING_CODE
ARG ICONS_PUBLIC_PATH=/reader/static/design

ENV SENTRY_DSN=$SENTRY_DSN \
    NPM_TOKEN=$NPM_TOKEN \
    GA_TRACKING_CODE=$GA_TRACKING_CODE \
    ICONS_PUBLIC_PATH=$ICONS_PUBLIC_PATH \
    BUILD_TARGET=$BUILD_TARGET


WORKDIR /app

COPY . .

# RUN npm install sharp --ignore-scripts

# RUN npm ci --include=dev

# RUN NODE_ENV=$NODE_ENV npm run build

RUN npm install --no-save --legacy-peer-deps postcss@8.5.6

RUN rm -rf /app/node_modules/next/node_modules/postcss \
 && cp -a /app/node_modules/postcss /app/node_modules/next/node_modules/postcss

RUN NODE_OPTIONS=--openssl-legacy-provider NODE_ENV=$NODE_ENV npm run build

EXPOSE 8080
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]



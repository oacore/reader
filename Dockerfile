# Stage 1: Build stage
FROM node:16 AS builder

# Accept tokens as build args
ARG NPM_TOKEN
ARG API_TOKEN

ARG GA_TRACKING_CODE
ENV GA_TRACKING_CODE=$GA_TRACKING_CODE
ENV NEXT_PUBLIC_GA_MEASUREMENT_ID=$GA_TRACKING_CODE

ARG ICONS_PUBLIC_PATH
ENV ICONS_PUBLIC_PATH=$ICONS_PUBLIC_PATH
ENV NEXT_PUBLIC_ICONS_PATH=$ICONS_PUBLIC_PATH

# Set working directory
WORKDIR /app

# Configure GitHub Packages auth (do NOT commit this)
RUN echo "//npm.pkg.github.com/:_authToken=${NPM_TOKEN}" > .npmrc

# Install dependencies
COPY package*.json .npmrc ./
RUN npm ci --legacy-peer-deps

# Copy full source (including env.config)
COPY . .

# Build the Next.js app
RUN npm run build

# Stage 2: Runtime stage
FROM node:16-alpine

# Add dumb-init for signal handling
RUN apk add --no-cache dumb-init

WORKDIR /app

# Copy everything from builder
COPY --from=builder /app /app

# Expose app port
EXPOSE 8080

# Use dumb-init to handle signals properly
ENTRYPOINT ["dumb-init", "--"]

# Default command
CMD ["node_modules/next/dist/bin/next", "start", "-p", "8080"]

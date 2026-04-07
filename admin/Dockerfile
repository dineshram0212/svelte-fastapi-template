# Stage 1: Build the Admin React app
FROM node:20-slim AS build-stage

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy only dependency files first to leverage caching
COPY admin/package.json ./admin/
# In a monorepo, you might need to copy pnpm-lock.yaml from root if it exists
# COPY pnpm-lock.yaml ./ 

WORKDIR /app/admin

RUN pnpm install

# Copy source and build
COPY admin/ ./
ARG VITE_API_URL

RUN pnpm build


# Stage 2: Serve with Nginx
FROM nginx:1

COPY --from=build-stage /app/admin/dist/ /usr/share/nginx/html

COPY admin/nginx.conf /etc/nginx/conf.d/default.conf
COPY admin/nginx-backend-not-found.conf /etc/nginx/extra-conf.d/backend-not-found.conf

# Build stage
FROM node:20-slim AS build

WORKDIR /app

# Install pnpm
RUN npm install -g pnpm

# Copy root lockfile and the app's package.json
COPY pnpm-lock.yaml package.json ./
COPY frontend/package.json ./frontend/

# Install dependencies (this might be slow if it installs everything, but it's safer for workspaces)
RUN pnpm install

# Copy source and build
COPY frontend/ ./frontend/
WORKDIR /app/frontend
RUN pnpm build

# Runtime stage
FROM node:20-slim

WORKDIR /app/frontend

# Since it's a SvelteKit adapter-node build, we just need the build output
COPY --from=build /app/frontend/package.json ./
COPY --from=build /app/frontend/node_modules ./node_modules
COPY --from=build /app/frontend/build ./build

EXPOSE 3000

CMD ["node", "build"]

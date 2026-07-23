---
status: pending
---

# Add a Dockerfile for Deployment

## Overview

The car rental app currently has no way to be deployed as a container. This plan adds a production-ready Docker setup: a multi-stage build that compiles the app inside a Node.js container and serves the resulting static files with nginx. Because the app uses browser-history routing with real paths (/vehicles, /bookings, etc.), the web server must fall back to the main page for unknown routes so refreshes and deep links keep working.

## Steps

### 1. Add an nginx configuration with SPA fallback
Create a small nginx server config at the project root that serves static files from the app build output and routes any unknown path back to the main index page (so client-side routes like /vehicles survive a refresh). It should also enable gzip compression and add sensible cache headers for static assets.

**Expected outcome:** A config file exists that any nginx container can use to serve the app correctly, including deep-linked routes.

### 2. Create a multi-stage Dockerfile
Create a Dockerfile at the project root with two stages:
- **Build stage:** Use an official Node.js LTS (Alpine) image, copy the dependency manifests first, install dependencies with a clean, lockfile-based install for reproducibility, then copy the source and run the production build (which type-checks and bundles the app into static files).
- **Serve stage:** Use a lightweight nginx Alpine image, copy only the built static files from the build stage, copy in the nginx config from step 1, expose port 80, and start nginx.

**Expected outcome:** A single Dockerfile that builds and runs the app with `docker build` / `docker run`, producing a small final image containing only static assets and nginx.

### 3. Add a .dockerignore file
Create a .dockerignore at the project root excluding node_modules, the build output directory, git metadata, editor files, and local env files. This keeps the build context small, speeds up builds, and prevents stale local artifacts from leaking into the image.

**Expected outcome:** Docker builds use a clean, minimal context.

### 4. Verify the production build locally
Run the app's production build command in the project to confirm it compiles and bundles without errors before relying on it inside Docker.

**Expected outcome:** The build completes successfully and produces the static output directory, giving confidence the Docker build stage will succeed.

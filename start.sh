#!/bin/bash

# Install pnpm
npm install -g pnpm

# Install dependencies
pnpm install --frozen-lockfile

# Build the application
pnpm run build:prod

# Start the application
pnpm run preview

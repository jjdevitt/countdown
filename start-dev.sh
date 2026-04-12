#!/bin/bash

# Clean up previous builds
echo "Cleaning up previous builds..."
./cleanup.sh

# Build the application
echo "Building the application..."
./build.sh

# Start the backend server (which serves the built frontend)
echo "Starting the application..."
cd backend && node server.js
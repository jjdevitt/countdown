#!/bin/bash

echo "Cleaning up build artifacts..."

# Remove frontend node_modules
if [ -d "frontend/node_modules" ]; then
    echo "Removing frontend/node_modules..."
    rm -rf frontend/node_modules
fi

# Remove backend node_modules
if [ -d "backend/node_modules" ]; then
    echo "Removing backend/node_modules..."
    rm -rf backend/node_modules
fi

# Remove backend build folder
if [ -d "backend/build" ]; then
    echo "Removing backend/build..."
    rm -rf backend/build
fi

# Remove frontend dist folder (if it exists)
if [ -d "frontend/dist" ]; then
    echo "Removing frontend/dist..."
    rm -rf frontend/dist
fi

echo "Cleanup complete."
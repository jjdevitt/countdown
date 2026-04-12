#!/bin/bash

# Install frontend dependencies
echo "Installing frontend dependencies..."
cd frontend
npm install
cd ..

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install
cd ..

# Build frontend to backend build folder
echo "Building frontend to backend/build..."
cd frontend
npm run build -- --outDir ../backend/build --emptyOutDir
cd ..

echo "Build completed Successfully."
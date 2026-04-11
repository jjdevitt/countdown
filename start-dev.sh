#!/bin/bash

# Start both frontend and backend in development mode
npx concurrently "cd backend && npm start" "cd frontend && npm run dev"
#!/usr/bin/env bash
# Double-click this file to start backend and frontend and open the app

# Ensure script runs in project root
cd "$(dirname "$0")"

echo "Starting backend (npm run serve)..."
npm run serve &

echo "Starting frontend (npm run dev)..."
npm run dev &

# Wait for servers to initialize (adjust if needed)
sleep 5

echo "Opening browser at http://localhost:8080"
open http://localhost:8080

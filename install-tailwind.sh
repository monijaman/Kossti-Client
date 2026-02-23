#!/bin/bash
# Install Tailwind CSS dependencies
echo "Installing Tailwind CSS and dependencies..."
npm install -D tailwindcss postcss autoprefixer
echo "Dependencies installed. Building project..."
npm run build
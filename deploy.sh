#!/bin/bash

# Exit script on error
set -e

# Path to your project directory
PROJECT_PATH=/home/username/public_html

# Navigate to the project directory
cd $PROJECT_PATH

# Pull the latest code from your repository
git pull origin main

# Install dependencies
npm install

# Build the Next.js application
npm run build

# Restart the application (using pm2 if installed)
pm2 restart code || pm2 start npm --name "code" -- start

# Optionally, you can also clear cache or perform other maintenance tasks here

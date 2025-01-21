#!/bin/bash

# Variables
APP_REPO_URL='git@github.com:dhisai-technologies/samjna-analytics-llp-v2.git'
APP_DIR='/tmp/app-v2'
CONFIG_REPO_URL='git@github.com:dhisai-technologies/config.git'
CONFIG_DIR='/tmp/config-dir'
CONFIG_FILE_PATH='samjna-analytics-llp/docker-compose.v2-stress.yml'


# Clone the application repository
git clone $APP_REPO_URL $APP_DIR

# Clone the configuration repository
git clone $CONFIG_REPO_URL $CONFIG_DIR

# Copy models 
cp -r ~/models $APP_DIR/services/analytics/app

# Copy the docker-compose.yml from the config repo to the app repo
cp $CONFIG_DIR/$CONFIG_FILE_PATH $APP_DIR/docker-compose.yml

# Navigate to the app directory
cd $APP_DIR

# Remove existing containers
if ! docker compose down; then
  echo "Failed to stop and remove existing containers"
  exit 1
fi

if ! DOCKER_BUILDKIT=1 docker compose up --build -d; then
  echo "❌ Failed to build and start Docker containers"
  exit 1
fi

# Clean up
rm -rf $CONFIG_DIR
rm -rf $APP_DIR

# Remove dangling images
docker images -f "dangling=true" -q | xargs docker rmi

echo "🎉 Deployment completed successfully."
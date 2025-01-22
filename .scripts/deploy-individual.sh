#!/bin/bash

# Variables
APP_REPO_URL='git@github.com:dhisai-technologies/samjna-analytics-llp-v2.git'
APP_DIR='/tmp/app-v2'
IMAGE_NAME='samjna-services/analytics'
CONTAINER_NAME='analytics'
# ENV variables
PORT=8001


# Clone the application repository
git clone $APP_REPO_URL $APP_DIR

# Copy models 
cp -r ~/models $APP_DIR/services/analytics/app

cd $APP_DIR

# Build the Docker image
./.docker/build.sh --name services/analytics

docker tag services/analytics $IMAGE_NAME

# Run the Docker container
docker run -d \
  --name $CONTAINER_NAME \
  --restart always \
  -e PORT=$PORT \
  -p $PORT:$PORT \
  $IMAGE_NAME

rm -rf $APP_DIR

# Remove dangling images
docker images -f "dangling=true" -q | xargs docker rmi

echo "🎉 Deployment completed successfully."
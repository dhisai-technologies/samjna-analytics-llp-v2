#!/bin/bash

# Variables
CONTAINER_NAME="samjna-analytics-llp-v1.1-postgres"
POSTGRES_IMAGE="postgres:15"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="db"
VOLUME_NAME="samjna-analytics-llp-v1.1-volume"
HOST_PORT=5432
CONTAINER_PORT=5432

# Function to create the container and volume
create_container() {
  echo "Creating volume: $VOLUME_NAME"
  docker volume create $VOLUME_NAME

  echo "Creating container: $CONTAINER_NAME"
  docker run -d \
    --name $CONTAINER_NAME \
    --restart always \
    -e POSTGRES_USER=$POSTGRES_USER \
    -e POSTGRES_PASSWORD=$POSTGRES_PASSWORD \
    -e POSTGRES_DB=$POSTGRES_DB \
    -v $VOLUME_NAME:/var/lib/postgresql/data \
    -p $HOST_PORT:$CONTAINER_PORT \
    --health-cmd="pg_isready -p 5432" \
    --health-interval=1s \
    --health-timeout=5s \
    --health-retries=10 \
    $POSTGRES_IMAGE
}

# Function to delete the container and volume
delete_container() {
  echo "Stopping and removing container: $CONTAINER_NAME"
  docker rm -f $CONTAINER_NAME

  echo "Removing volume: $VOLUME_NAME"
  docker volume rm $VOLUME_NAME
}

# Main script logic
if [ "$1" == "--create" ]; then
  create_container
elif [ "$1" == "--delete" ]; then
  delete_container
else
  echo "Usage: $0 --create | --delete"
  exit 1
fi

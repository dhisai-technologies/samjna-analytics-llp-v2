#!/bin/bash

CONTAINER_NAME="samjna-analytics-llp-v1.1-postgres"
POSTGRES_IMAGE="postgres:15"
POSTGRES_USER="user"
POSTGRES_PASSWORD="password"
POSTGRES_DB="db"
VOLUME_NAME="samjna-analytics-llp-v1.1-volume"
HOST_PORT=5432
CONTAINER_PORT=5432

docker volume create $VOLUME_NAME

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

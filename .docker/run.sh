#!/bin/bash

# Exit immediately if a command exits with a non-zero status
set -e

# Source the common configuration
source "$(dirname "$0")/config.sh"

current_service_name=""
while [[ "$#" -gt 0 ]]; do
  case $1 in
    --name)
      current_service_name="$2"
      shift 2
      ;;
    *)
      echo "Unknown parameter: $1"
      exit 1
      ;;
  esac
done


# Function to create Docker network if it doesn't exist
create_network() {
  if docker network ls --filter name=^"${network_name}"$ --format '{{.Name}}' | grep -w "${network_name}" > /dev/null; then
    echo "✅ Docker network '${network_name}' already exists. Using it."
  else
    echo "🔧 Creating Docker network '${network_name}'..."
    docker network create "${network_name}"
    echo "✅ Docker network '${network_name}' created successfully."
  fi
}

# Function to run a Docker container for a service
run_image() {
  local service_name=$1
  local port=$2
  local removed_service_name=${service_name//\//}
  local container_name="${prefix}${removed_service_name}"
  local image_name="${prefix}${service_name}:latest"

  if [[ -n "$current_service_name" && "$current_service_name" != "$service_name" ]]; then
    return
  fi

  echo "========================================"
  echo "Running container for service: $service_name"
  echo "Port: $port"
  echo "Container Name: $container_name"
  echo "========================================"

  # Remove existing container if it exists
  if docker ps -aq -f name=^"${container_name}"$ > /dev/null; then
    echo "🗑️  Removing existing container '${container_name}'..."
    docker rm -f "${container_name}"
    echo "✅ Removed existing container '${container_name}'."
  fi

	docker run -d \
    --name $container_name \
    --network $network_name \
    --env-file=${service_name}/.env.prod.local \
    -p ${port}:${port} \
    ${image_name}

  if [ $? -ne 0 ]; then
    echo "❌ Failed to run container for $container_name"
    exit 1
  else
    echo "✅ Successfully started container for $container_name"
  fi

  echo ""
}

# Function to run the Nginx container
run_nginx() {
  local container_name="${prefix}nginx"

  if [[ -n "$current_service_name" ]]; then
    return
  fi

  echo "========================================"
  echo "Running container for Nginx"
  echo "Container Name: $container_name"
  echo "========================================"

  # Remove existing container if it exists
  if docker ps -aq -f name=^"${container_name}"$ > /dev/null; then
    echo "🗑️  Removing existing container '${container_name}'..."
    docker rm -f "${container_name}"
    echo "✅ Removed existing container '${container_name}'."
  fi

  docker run -d \
    --name $container_name \
    --network $network_name \
    -p 80:80 \
    ${container_name}:latest

  if [ $? -ne 0 ]; then
    echo "❌ Failed to run container for $container_name"
    exit 1
  else
    echo "✅ Successfully started container for $container_name"
  fi

  echo ""
}

# Create Docker network if necessary
create_network

for i in "${!services[@]}"; do
  run_image "${services[$i]}" "${ports[$i]}"
done

run_nginx

echo "🎉 All Docker containers are up and running successfully!"

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

# Function to build a Docker image for a service
build_image() {
  local service_name=$1
  local port=$2
  local container_name="${prefix}${service_name}"

  if [[ -n "$current_service_name" && "$current_service_name" != "$service_name" ]]; then
    return
  fi

  echo "========================================"
  echo "Building image for service: $service_name"
  echo "Port: $port"
  echo "Container Name: $container_name"
  echo "========================================"

  docker build \
    --build-arg PORT=$port \
    -f ${service_name}/Dockerfile \
    -t ${container_name}:latest \
    .

  if [ $? -ne 0 ]; then
    echo "❌ Failed to build image for $service_name"
    exit 1
  else
    echo "✅ Successfully built image for $service_name"
  fi

  echo ""
}

for i in "${!services[@]}"; do
  build_image "${services[$i]}" "${ports[$i]}"
done


echo "🎉 All Docker images have been built successfully!"

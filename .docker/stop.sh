#!/bin/bash

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

# Function to stop and remove a Docker container for a service
stop_container() {
  local service_name=$1
  local container_name="${prefix}${service_name}"

  if [[ -n "$current_service_name" && "$current_service_name" != "$service_name" ]]; then
    return
  fi

  echo "========================================"
  echo "Stopping and removing container for service: $service_name"
  echo "Container Name: $container_name"
  echo "========================================"

  if docker ps -aq -f name=^"${container_name}"$ > /dev/null; then
    echo "🗑️  Stopping container '${container_name}'..."
    docker stop "${container_name}"
    echo "✅ Stopped container '${container_name}'."
    echo "🗑️  Removing container '${container_name}'..."
    docker rm "${container_name}"
    echo "✅ Removed container '${container_name}'."
  else
    echo "⚠️  No running container found for '${container_name}'."
  fi

  echo ""
}

# Function to stop and remove the Nginx container
stop_nginx() {
  local container_name="${prefix}nginx"

  if [[ -n "$current_service_name" ]]; then
    return
  fi

  echo "========================================"
  echo "Stopping and removing Nginx container"
  echo "Container Name: $container_name"
  echo "========================================"

  if docker ps -aq -f name=^"${container_name}"$ > /dev/null; then
    echo "🗑️  Stopping container '${container_name}'..."
    docker stop "${container_name}"
    echo "✅ Stopped container '${container_name}'."
    echo "🗑️  Removing container '${container_name}'..."
    docker rm "${container_name}"
    echo "✅ Removed container '${container_name}'."
  else
    echo "⚠️  No running Nginx container found."
  fi

  echo ""
}

# Stop and remove all service containers
for i in "${!services[@]}"; do
  stop_container "${services[$i]}"
done

# Stop and remove the Nginx container
stop_nginx


if ! docker ps -q --filter "network=${network_name}" | grep -q .; then
  echo "🔧 Removing Docker network '${network_name}'..."
  docker network rm "${network_name}"
  echo "✅ Removed Docker network '${network_name}'."
fi

echo "🎉 All specified Docker containers have been stopped and removed successfully!"

#!/bin/bash

# Define services and their corresponding ports using indexed arrays
services=("services/core" "services/analytics" "apps/admin" "apps/interview" "apps/nursing")
ports=(5001 5002 3001 3002 3003)
network_name="samjna-analytics-llp-v1.1"
prefix="samjna-"

# Ensure both arrays have the same length
if [ "${#services[@]}" -ne "${#ports[@]}" ]; then
  echo "❌ The number of services and ports must match."
  exit 1
fi

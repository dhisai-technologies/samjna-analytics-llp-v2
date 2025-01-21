#!/bin/bash

# Define services and their corresponding ports using indexed arrays
services=("services/core" "services/analytics" "apps/site" "apps/admin" "apps/stress" "apps/nursing" "apps/interview")
ports=(8000 8001 3000 3001 3002 3003 3004)
network_name="samjna-analytics-llp-v1.1"
prefix="samjna-"

# Ensure both arrays have the same length
if [ "${#services[@]}" -ne "${#ports[@]}" ]; then
  echo "❌ The number of services and ports must match."
  exit 1
fi

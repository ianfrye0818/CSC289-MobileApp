#!/usr/bin/env bash

DOCKER_REPO="ianfrye/csc289mobile:latest"

# If error exit
set -e

#  Go do the server dir
cd ../server

# Make sure docker and builx are installed
if ! command -v docker &>/dev/null; then
  echo "Docker could not be found"
  exit 1
fi

# docker buildx version
if ! docker buildx version &>/dev/null; then
  echo "Buildx could not be found"
  exit 1
fi

# Build the server
docker buildx build --platform linux/amd64 -t $DOCKER_REPO . --no-cache

# Verify the image was built
if ! docker image inspect $DOCKER_REPO &>/dev/null; then
  echo "Image $DOCKER_REPO was not built"
  exit 1
fi

# Push the image to the repository
docker push $DOCKER_REPO

# Verify the image was pushed
if ! docker images | grep -q $DOCKER_REPO; then
    echo "Image $DOCKER_REPO was not pushed"
    exit 1
fi

# Clean up buildx
docker buildx prune -af
echo "Buildx cleaned up"

# Clean up images
docker image rm $DOCKER_REPO
echo "Images cleaned up"
echo "Server built and pushed to $DOCKER_REPO"

exit 0

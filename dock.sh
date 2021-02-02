#!/bin/bash

TAG=jtwenl-reviews-service
ECRTAG=893701756055.dkr.ecr.us-west-2.amazonaws.com/jtwenl-proxy:latest
REGION=us-west-2

build() {
  docker build . \
  --build-arg BUILD_SERVER_URL=http://52.13.103.43 \
    -t "$ECRTAG"
}

run() {
  docker run -p 80:8082 "$(get_latest)"
}

get_latest() {
  docker images | tail -n+2 | head -n 1 | tr -s ' ' | cut -d ' ' -f 3
}

push() {
  build
  docker tag jtwenl-proxy "$(get_latest)"
  docker push "$ECRTAG"
}

login() {
  aws ecr get-login-password --region "$REGION" \
   | docker login --username AWS --password-stdin "$ECRTAG"
}

case "$1" in
  "-b")
    build
    ;;
  "-r")
    run
    ;;
  "-p")
    push
    ;;
  "-l")
    login
    ;;
  *) 
    echo "No argument found. -b: build, -r: run, -p: push"
    exit 1
    ;;
esac

#!/bin/bash
if [ "$1" == "debug" ]; then
  rizla ./debug.go
#  go run ./cmd/main.go -c ./configs/server.yml
else
  go build -o bin/server cmd/main.go
  if [ $? == 0 ]; then
  ./bin/server ${@:2}
  fi;
fi;
#!/bin/bash

case "$1" in
  "start"|"up")
    docker-compose -f docker-compose.yml -p sikong-ren up -d;;
  "stop"|"down")
    docker-compose -f docker-compose.yml -p sikong-ren down;;
  "restart")
    docker-compose -f docker-compose.yml -p sikong-ren down
    docker-compose -f docker-compose.yml -p sikong-ren up -d
   ;;
  "ps")
    docker-compose -f docker-compose.yml -p sikong-ren ps;; 
  "logs")
    docker-compose -f docker-compose.yml -p sikong-ren logs ${@:2};;
  "exec")
    docker-compose -f docker-compose.yml -p sikong-ren exec ${2} ${@:3};;
  "bash")
    docker-compose -f docker-compose.yml -p sikong-ren exec ${2} bash;;
  "default")
    echo "不支持的命令";;
esac 

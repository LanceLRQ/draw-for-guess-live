#!/bin/bash

case "$1" in
  "start"|"up")
    docker-compose -f docker-compose.yml -p dag_server up -d;;
  "stop"|"down")
    docker-compose -f docker-compose.yml -p dag_server down;;
  "restart")
    docker-compose -f docker-compose.yml -p dag_server down
    docker-compose -f docker-compose.yml -p dag_server up -d
   ;;
  "ps")
    docker-compose -f docker-compose.yml -p dag_server ps;; 
  "logs")
    docker-compose -f docker-compose.yml -p dag_server logs ${@:2};;
  "exec")
    docker-compose -f docker-compose.yml -p dag_server exec ${2} ${@:3};;
  "bash")
    docker-compose -f docker-compose.yml -p dag_server exec ${2} bash;;
  "default")
    echo "不支持的命令";;
esac 

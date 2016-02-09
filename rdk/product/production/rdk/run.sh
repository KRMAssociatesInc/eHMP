#!/bin/sh
node resource-server.js "$@" | node_modules/bunyan/bin/bunyan 

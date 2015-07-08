#!/bin/sh
node resource-server.js "$@" | node_modules/.bin/bunyan

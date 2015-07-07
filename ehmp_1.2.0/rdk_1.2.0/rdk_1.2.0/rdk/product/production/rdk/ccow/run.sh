#!/bin/sh
node ccow-server.js "$@" | node_modules/.bin/bunyan

#!/bin/sh
node mock-server.js "$@" | node_modules/.bin/bunyan

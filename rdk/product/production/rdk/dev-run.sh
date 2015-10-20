#!/bin/sh
node --debug bin/rdk-fetch-server.js "$@" | node_modules/.bin/bunyan

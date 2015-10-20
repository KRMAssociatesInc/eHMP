#!/bin/sh
node bin/rdk-fetch-server.js "$@" | node_modules/.bin/bunyan

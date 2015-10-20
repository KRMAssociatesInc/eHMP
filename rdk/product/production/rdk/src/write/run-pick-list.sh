#!/bin/sh
node ../../bin/rdk-pick-list-server.js "$@" | ../../node_modules/.bin/bunyan

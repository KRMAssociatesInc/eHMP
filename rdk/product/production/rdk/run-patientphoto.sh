#!/bin/sh
node bin/rdk-patient-photo-server.js "$@" | node_modules/.bin/bunyan

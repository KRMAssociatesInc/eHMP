#!/bin/sh
node patientphoto-server.js "$@" | node_modules/.bin/bunyan

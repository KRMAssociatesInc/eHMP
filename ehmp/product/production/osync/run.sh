#!/usr/bin/env bash
beanstalkd -p 5000 -V -z 2000000 > ./logs/beanstalkd.log &
OSYNC_LOG_SUFFIX=subscriberHost-primary node subscriberHost.js --profile primary &
node endpoints/opportunistic-sync-endpoint/opportunistic-sync-endpoint.js --port 8090 | node_modules/.bin/bunyan -o short > ./logs/api.log &

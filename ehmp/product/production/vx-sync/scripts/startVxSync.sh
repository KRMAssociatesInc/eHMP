pushd ~/Projects/vistacore/ehmp/product/production/vx-sync
beanstalkd -p 5000 -V -z 2000000 > ./logs/beanstalkd.log &
node pollerHost.js --site 9E7A --site C877 | node_modules/.bin/bunyan -o short > ./logs/vista-poller.log &
node endpoints/writeback/writeback-endpoint.js --port 9090 | node_modules/.bin/bunyan -o short > ./logs/writeback.log &

node tools/beanstalk/admin-endpoint.js --port 9999 > ./logs/admin-endpoint.log &

# The following line runs multiple processes
# Note: it uses node clustering so it should not go to production
node subscriberHost.js | node_modules/.bin/bunyan -o short > ./logs/subscriber-host.log &

node endpoints/sync-request/sync-request-endpoint.js --port 8080 | node_modules/.bin/bunyan -o short > ./logs/api.log &
node endpoints/operational/operational-sync-endpoint.js --port 8088 | node_modules/.bin/bunyan -o short > ./logs/op-api.log &
node endpoints/documents/document-retrieval-endpoint.js --port 8089 | node_modules/.bin/bunyan -o short > ./logs/doc-ret.log &
popd

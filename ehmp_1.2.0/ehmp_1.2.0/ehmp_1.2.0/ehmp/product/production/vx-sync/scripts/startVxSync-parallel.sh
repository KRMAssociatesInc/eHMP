pushd ~/Projects/vistacore/ehmp/product/production/vx-sync
beanstalkd -p 5000 -V -z 2000000 > ./logs/beanstalkd.log &
VXSYNC_LOG_SUFFIX=pollerHost node pollerHost.js &
VXSYNC_LOG_SUFFIX=admin-endpoint node tools/beanstalk/admin-endpoint.js --port 9999 &
VXSYNC_LOG_SUFFIX=writebackEndpoint node endpoints/writeback/writeback-endpoint.js --port 9090 &
VXSYNC_LOG_SUFFIX=subscriberHost-primary node subscriberHost.js --profile primary &
VXSYNC_LOG_SUFFIX=subscriberHost-jmeadows node subscriberHost.js --profile jmeadows &
VXSYNC_LOG_SUFFIX=subscriberHost-hdr node subscriberHost.js --profile hdr &
VXSYNC_LOG_SUFFIX=subscriberHost-vler node subscriberHost.js --profile vler &
VXSYNC_LOG_SUFFIX=subscriberHost-pgd node subscriberHost.js --profile pgd &
VXSYNC_LOG_SUFFIX=subscriberHost-document node subscriberHost.js --profile document &
VXSYNC_LOG_SUFFIX=subscriberHost-storage-1 node subscriberHost.js --profile storage &
VXSYNC_LOG_SUFFIX=subscriberHost-storage-2 node subscriberHost.js --profile storage &
VXSYNC_LOG_SUFFIX=subscriberHost-storage-3 node subscriberHost.js --profile storage &
VXSYNC_LOG_SUFFIX=subscriberHost-storage-4 node subscriberHost.js --profile storage &
VXSYNC_LOG_SUFFIX=subscriberHost-post-1 node subscriberHost.js --profile post &
VXSYNC_LOG_SUFFIX=subscriberHost-post-2 node subscriberHost.js --profile post &
VXSYNC_LOG_SUFFIX=subscriberHost-post-3 node subscriberHost.js --profile post &
VXSYNC_LOG_SUFFIX=syncRequestEndpoint node endpoints/sync-request/sync-request-endpoint.js --port 8080 &
VXSYNC_LOG_SUFFIX=operationalSyncEndpoint node endpoints/operational/operational-sync-endpoint.js --port 8088 &
VXSYNC_LOG_SUFFIX=documentRetrievalEndpoint node endpoints/documents/document-retrieval-endpoint.js --port 8089 &
popd

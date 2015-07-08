pushd ~/Projects/vistacore/ehmp/product/production/vx-sync
node tools/rpc/rpc-unsubscribe-all.js --host "10.2.2.101" --port 9210
node tools/rpc/rpc-unsubscribe-all.js --host "10.2.2.102" --port 9210
popd
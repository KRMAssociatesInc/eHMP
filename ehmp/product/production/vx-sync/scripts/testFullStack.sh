#!/bin/bash
#
#
# --nodeploy will not deploy any of the VMs but will just reset Vista and JDS
# --full     will deploy the whole eHMP stack (Vista, JDS, SOLR, Mocks, and VXSync)
# --destroy  will destroy and deploy the whole eHMP stack
#
# Will at minimum reset the Vista and JDS before running all tests for eHMP, RDK, and eHMP-UI
# The test files will be logged to the current directory. VMs will only be updated if git changes
# are found unless --nodeploy is specified
#
#

pushd .

#Cleanup
rm -Rf ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs

#Setup eHMP
cd ~/Projects/vistacore/ehmp/product
#./update.cookbooks.sh
ehmpUpdated=$(git pull | grep 'up-to-date')

#Deploy VX Sync
if [[ ( $* != *--nodeploy* ) || ( -n "$ehmpUpdated" ) ]]; then
	if [[ $* == *--destroy* ]]; then
		gradle destroyVXSync destroyJDS destroyPanorama destroyKodak destroymocks destroysolr deploypanorama deployKodak deploysolr deployjds deploymocksdev deployvxsyncdev
		reset
	elif [[ $* == *--full* ]]; then
		gradle deploypanorama deployKodak deploysolr deployjds deploymocksdev deployvxsyncdev
		reset
	else
		pushd .
		cd ./production/vx-sync
		./scripts/vmKick.sh
		popd
		curl -s "http://10.3.3.6:8080/data/doLoad?sites=9E7A,C877"
		gradle deployvxsyncdev
	fi
else
	pushd .
	cd ./production/vx-sync
	./scripts/vmKick.sh
	curl -s "http://10.3.3.6:8080/data/doLoad?sites=9E7A,C877"
	popd
fi
mkdir ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs
pushd ~/Projects/vistacore/ehmp/product/production/vx-sync
date "+%T Running VX Sync Unit Tests"
npm test > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/vxSyncUnitTests.log
popd

url="http://10.2.2.110:9080/statusod/9E7A"
timeout=0
curl -f -v -s $url --raw &> ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/source.html
teststring=$(awk '/inProgress|404/' ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/source.html)
date "+%T Waiting for Operational Data"
until [ -z "$teststring" -o $timeout -gt 600 ] ; do
    printf "."
    let "timeout += 20"
    sleep 20
	curl -f -v -s $url --raw &> ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/source.html
	teststring=$(awk '/inProgress|404/' ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/source.html)
done
if [ $timeout -gt 600 ]; then
	printf "Operational Data load timed out\n"
	exit 1
fi
rm -f ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/source.html

date "+%T Running VX Sync Integration Tests"
gradle vxsyncIntTests > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/vxSyncIntTests.log
date "+%T Running VX Sync Acceptance Tests"
gradle acceptanceTest > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/vxSyncAcceptanceTests.log
date "+%T Running Sync Cache"
gradle syncCache > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/syncCache.log

#Setup RDK
cd ~/Projects/vistacore/rdk/product
./update.cookbooks.sh
rdkUpdated=$(git pull | grep 'up-to-date')

#Deploy RDK
if [[ ( $* != *--nodeploy* ) && ( -n "$rdkUpdated" ) ]]; then
	date "+%T deploying RDK"
	gradle deployrdkdev
fi
date "+%T Running RDK Unit Tests"
gradle test > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/rdkUnitTests.log
date "+%T Running RDK Acceptance Tests"
gradle acceptanceTestStable > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/rdkAcceptanceTests.log

#Setup ADK
cd ~/Projects/vistacore/adk/product
./update.cookbooks.sh
adkUpdated=$(git pull | grep 'up-to-date')

#Build ADK
if [[ ( $* != *--nodeploy* ) && ( -n "$adkUpdated" ) ]]; then
	gradle build
fi

#Setup eHMP-UI
cd ~/Projects/vistacore/ehmp-ui/product
./update.cookbooks.sh
ehmpuiUpdated=$(git pull | grep 'up-to-date')

#Deploy eHMP-UI
if [[ ( $* != *--nodeploy* ) && ( -n "$ehmpuiUpdated" ) ]]; then
	gradle build
	date "+%T deploying eHMP-UI"
	gradle deployehmp-uilocaldev
fi
date "+%T Running eHMP-UI Acceptance Tests"
gradle acceptanceTest > ~/Projects/vistacore/ehmp/product/production/vx-sync/scripts/testLogs/ehmp-uiAccTests.log

popd
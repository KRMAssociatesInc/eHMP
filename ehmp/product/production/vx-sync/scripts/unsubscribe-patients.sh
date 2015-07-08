#!/bin/bash
# Patient Unsubscribe Utility
#
# Author: J.Vega
#
# Usage: ./unsubscribe-patients.sh -p <string> -f <string> -l
#
# Options:
#	-p or --patient <string> : a comma-separated list of one or more PID's or ICN's to unsubscribe.
#	-f or --file <string> : a path to a plaintext file containing a comma or newline separated list of one or more PID's or ICN's to unsubscribe.
#	-l or --local : include this option if you are running VX-Sync locally (rather than on a VM)
#	Required: at least one of -p or -f.
pushd ~/Projects/vistacore/ehmp/product/production/vx-sync
node utils/unsubscribe-patients.js $@ | node_modules/.bin/bunyan -o short
popd
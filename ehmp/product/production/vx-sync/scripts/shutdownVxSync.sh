#!/bin/bash
#
# shutdownVxSync.sh
#
# Usage:
#       To gracefully shut down VX-Sync:
#       ./shutdownVxSync.sh

# Kill endpoints
ps -efa | grep -v 'grep' | grep "node endpoint\|node tools/beanstalk/admin-endpoint" | awk '{print $2}' | xargs kill

ps -efa | grep -v 'grep' | grep 'node subscriberHost.js\|node pollerHost.js'

PNUM="$(ps -efa | grep -v 'grep' | grep 'node subscriberHost.js\|node pollerHost.js' | awk '{print $2}')"

if [ ${#PNUM} -eq 0 ] ; then
        echo 'shutdonwVxSync.sh: No processes to shut down!'
        exit
fi

# Gather process numbers for pollerHost and subscriberHost processes and send SIGURG
echo $PNUM | xargs kill -SIGURG

#wait for processes to finish
waittime=0
waitlimit=31

echo shutdownVxsync.sh: waiting for node processes to shut down: $PNUM

while echo $PNUM | xargs ps -p > /dev/null
do
        sleep 1
        if [ $waittime -lt $waitlimit ] ; then
                let waittime=waittime+1
                echo shutdownVxSync.sh: Elapsed time in seconds: $waittime
                echo shutdownVxSync.sh: Remaining processes:
                ps -efa | grep -v 'grep' | grep 'node subscriberHost.js\|node pollerHost.js' | awk '{print $2}'
        else
                echo 'shutdownVxSync.sh: Waited too long for processes to stop! Exiting...'
                break
        fi
done;

echo 'shutdownVxSync.sh: Script complete!'

ps -ef | grep "node " | awk '{print $2}' | xargs kill
ps -ef | grep "beanstalkd " | awk '{print $2}' | xargs kill
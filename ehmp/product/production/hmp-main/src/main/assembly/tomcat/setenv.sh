# Edit this file to CATALINA_BASE/bin/setenv.sh to set custom options
# Tomcat accepts two parameters JAVA_OPTS and CATALINA_OPTS
# JAVA_OPTS are used during START/STOP/RUN
# CATALINA_OPTS are used during START/RUN

# JVM memory settings - general
GENERAL_JVM_OPTS="-server -Xmx8192m -Xss192k -Djava.awt.headless=true"

# JVM Sun specific settings
# For a complete list http://blogs.sun.com/watt/resource/jvm-options-list.html
SUN_JVM_OPTS="-XX:MaxPermSize=256m \
              -XX:MaxGCPauseMillis=500 \
              -XX:-UseGCLogFileRotation \
              -Xloggc:$CATALINA_HOME/logs/gc.log \
              -XX:+PrintHeapAtGC \
              -XX:+PrintGCDetails \
              -XX:+PrintGCTimeStamps \
              -XX:NumberOfGCLogFiles=10 \
              -XX:GCLogFileSize=20M \
              -XX:-HeapDumpOnOutOfMemoryError"

# Set any custom application options here
APPLICATION_OPTS="-Dlogback.configurationFile=$CATALINA_BASE/conf/logback.xml \
    -Dsolr.solr.home=$CATALINA_BASE/solr-home/ \
    -Dsolr.data.dir=$CATALINA_BASE/hmp-home/solr/data \
	-Dhmp.home=$CATALINA_BASE/hmp-home"

JVM_OPTS="$GENERAL_JVM_OPTS $SUN_JVM_OPTS"

CATALINA_OPTS="$JVM_OPTS $APPLICATION_OPTS"

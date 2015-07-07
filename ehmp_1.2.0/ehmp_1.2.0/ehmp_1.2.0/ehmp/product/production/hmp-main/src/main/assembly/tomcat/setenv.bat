rem Edit this file to CATALINA_BASE\bin\setenv.bat to set custom options
rem Tomcat accepts two parameters JAVA_OPTS and CATALINA_OPTS
rem JAVA_OPTS are used during START/STOP/RUN
rem CATALINA_OPTS are used during START/RUN

rem JVM memory settings - general
set GENERAL_JVM_OPTS=-server -Xmx1024m -Xss192k

rem JVM Sun specific settings
rem For a complete list http://blogs.sun.com/watt/resource/jvm-options-list.html
set SUN_JVM_OPTS=-XX:MaxPermSize=256m -XX:MaxGCPauseMillis=500 XX:-UseGCLogFileRotation -Xloggc:%CATALINA_HOME%\logs\gc.log -XX:+PrintHeapAtGC -XX:+PrintGCDetails -XX:+PrintGCTimeStamps -XX:-HeapDumpOnOutOfMemoryError -XX:NumberOfGClogFiles=10 -XX:GCLogFileSize=20M

rem Set any custom application options here
rem set APPLICATION_OPTS=-Dlogs.dir=%CATALINA_BASE%\logs -Dsolr.solr.home=%CATALINA_BASE%\solr-home\ -Dsolr.data.dir=%CATALINA_BASE%\hmp-home\solr\data\ -Dhmp.home=%CATALINA_BASE%\hmp-home
set APPLICATION_OPTS=%CATALINA_BASE%\conf\logback.xml -Dsolr.solr.home=%CATALINA_BASE%\solr-home\ -Dsolr.data.dir=%CATALINA_BASE%\hmp-home\solr\data\ -Dhmp.home=%CATALINA_BASE%\hmp-home

set JVM_OPTS=%GENERAL_JVM_OPTS% %SUN_JVM_OPTS%

set CATALINA_OPTS=%JVM_OPTS% %APPLICATION_OPTS%

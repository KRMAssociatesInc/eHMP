MockDoD service
===============
1)
```
mvn compile
```
2) Then:

```
mvn package
```
3) Deploy MockDoDAdaptor-2.0.3.war to Tomcat

Resources
========
V3 and V2.
For loinc codes checkout ClinicalDomainLoincCode.java

v3
==
Query:
```
http://192.168.250.24:8080/MockDoDAdaptor-2.0.3/bda/api/v3/query/?patientid={patientid}&loinc={loinc}
```
Poller:
The query ID returned from the Query Resource above should be used below.
The query ID can only be used once before it expires

```
http://192.168.250.24:8080/MockDoDAdaptor-2.0.3/bda/api/v3/poller/?queryid={queryid}
```

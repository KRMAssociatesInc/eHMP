@radiologyreport_vpr @vpr
Feature: F100 Return of Radiology Reports in VPR format 

#This feature item returns Radiology Reports in VPR format. Also includes cases where no Radiology Reports exist.

	
@f100_1_radiologyreport_vpr @vpr
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10107V395912" has been synced through Admin API
When the client requests radiology report results for the patient "10107V395912" in VPR format
Then a successful response is returned
#Then the client receives 2 VPR "VistA" result(s)
#Then the client receives 1 VPR "panorama" result(s)
#Count changed due to Cache.dat upgrade
Then the client receives 88 VPR "VistA" result(s)
Then the client receives 44 VPR "panorama" result(s)
And the VPR results contain "radiology report results"                                                      
      | field                     | panorama_value                         |
      | uid                       | urn:va:image:9E7A:253:7059382.8387-1   |
      | summary                   | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS |
      | pid                       | CONTAINS ;253                                  |
      | kind                      | Imaging                                |
      | localId                   | 7059382.8387-1                         |
      | facilityCode              | 500                                    |
      | facilityName              | CAMP MASTER                            |
      | typeName                  | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS |
      | dateTime                  | 199406171612                           |
      | category                  | RA                                     |
      | imagingTypeUid            | urn:va:imaging-Type:GENERAL RADIOLOGY  |
      | locationUid               | urn:va:location:9E7A:40                |
      | hasImages                 | false                                  |
      | imageLocation             | RADIOLOGY MAIN FLOOR                   |
      | statusName                | COMPLETE                               |
      | name                      | ANKLE 2 VIEWS                          |
      | locationName              | RADIOLOGY MAIN FLOOR                   |
      | case                      | 101                                    |
      | providers.summary         | ProcedureProvider{uid='null'}          |
      | providers.providerName    | PROVIDER,FIFTY                         |
      | providers.providerDisplayName | Provider,Fifty                     |
      | providers.providerUid     | urn:va:user:9E7A:1595                  |
      | results.uid               | urn:va:document:9E7A:253:7059382.8387-1|
      | results.summary           | ProcedureResult{uid='urn:va:document:9E7A:253:7059382.8387-1'}|
      | results.localTitle        | ANKLE 2 VIEWS                          |
      | verified                  | true                                   |
      | diagnosis.code            | NORMAL                                 |
      | diagnosis.primary         | true                                   |
      
      

#orderName and interpretation mapping data were not available for the above patient.  
#so this test is created to test those field mappings.
    
@f100_2_radiologyreport_vpr @vpr
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests radiology report results for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 26 VPR "VistA" result(s)
Then the client receives 13 VPR "panorama" result(s)
And the VPR results contain "radiology report results"
      | field                     | panorama_value                         |
      | orderUid                  | urn:va:order:9E7A:301:9717             |
      | orderName                 | ARTHROGRAM ELBOW S&I                   |      
And the VPR results contain "radiology report results"
      | field                     | panorama_value                         |
      | interpretation            | ABNORMAL                               |
      | encounterUid              | urn:va:visit:9E7A:301:395              |
      | encounterName             | RADIOLOGY MAIN FLOOR Apr 08, 1997      |
      
@f100_3_radiologyreport_vpr @vpr
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10107V395912" has been synced through Admin API
When the client requests radiology report results for the patient "10107V395912" in VPR format
Then a successful response is returned
#Then the client receives 2 VPR "VistA" result(s)
#Then the client receives 1 VPR "kodak" result(s)
#Count changed due to Cache.dat upgrade
Then the client receives 88 VPR "VistA" result(s)
Then the client receives 44 VPR "kodak" result(s)
And the VPR results contain "radiology report results"                                                      
      | field                     | kodak_value                            |
      | uid                       | urn:va:image:C877:253:7059382.8387-1   |
      | summary                   | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS |
      | pid                       | CONTAINS ;253                          |
      | kind                      | Imaging                                |
      | localId                   | 7059382.8387-1                         |
      | facilityCode              | 500                                    |
      | facilityName              | CAMP BEE	                           |
      | typeName                  | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS |
      | dateTime                  | 199406171612                           |
      | category                  | RA                                     |
      | imagingTypeUid            | urn:va:imaging-Type:GENERAL RADIOLOGY  |
      | locationUid               | urn:va:location:C877:40                |
      | hasImages                 | false                                  |
      | imageLocation             | RADIOLOGY MAIN FLOOR                   |
      | statusName                | COMPLETE                               |
      | name                      | ANKLE 2 VIEWS                          |
      | locationName              | RADIOLOGY MAIN FLOOR                   |
      | case                      | 101                                    |
      | providers.summary         | ProcedureProvider{uid='null'}          |
      | providers.providerName    | PROVIDER,FIFTY                         |
      | providers.providerDisplayName | Provider,Fifty                     |
      | providers.providerUid     | urn:va:user:C877:1595                  |
      | results.uid               | urn:va:document:C877:253:7059382.8387-1|
      | results.summary           | ProcedureResult{uid='urn:va:document:C877:253:7059382.8387-1'}|
      | results.localTitle        | ANKLE 2 VIEWS                          |
      | verified                  | true                                   |
      | diagnosis.code            | NORMAL                                 |
      | diagnosis.primary         | true                                   |
      
      

#orderName and interpretation mapping data were not available for the above patient.  
#so this test is created to test those field mappings.
    
@f100_4_radiologyreport_vpr @vpr
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests radiology report results for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 26 VPR "VistA" result(s)
Then the client receives 13 VPR "kodak" result(s)
And the VPR results contain "radiology report results"
      | field                     | kodak_value                            |
      | orderUid                  | urn:va:order:C877:301:9717             |
      | orderName                 | ARTHROGRAM ELBOW S&I                   |      
And the VPR results contain "radiology report results"
      | field                     | panorama_value                         |
      | interpretation            | ABNORMAL                               |
      | encounterUid              | urn:va:visit:C877:301:395              |
      | encounterName             | RADIOLOGY MAIN FLOOR Apr 08, 1997      |

# following 2 scenarios are checking for another patient for return of radiology results.
# only few fields are checked to validate data integrity.

@f100_5_radiologyreport_vpr @vpr
Scenario: Client can request radiology report results in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "9E7A;1" has been synced through Admin API
When the client requests radiology report results for the patient "9E7A;1" in VPR format
Then a successful response is returned
Then the client receives 70 VPR "VistA" result(s)
Then the client receives 70 VPR "panorama" result(s)
And the VPR results contain "radiology report results"

	| field							| value									|
	| pid							| 9E7A;1								|
	| summary						| RADIOLOGIC EXAMINATION, WRIST; 2 VIEWS|
	| name							| WRIST 2 VIEWS							|
	| statusName					| COMPLETE								|
	| kind							| Imaging								|
	| facilityCode					| 500									|
	| facilityName					| CAMP MASTER							|
	| dateTime						| 199605081123							|
	| category						| RA									|
	| imageLocation					| RADIOLOGY MAIN FLOOR					|
	| locationUid					| urn:va:location:9E7A:40				|
	| hasImages						| false									|
	| providers.providerName		| PROVIDER,FIFTY						|
	| diagnosis.code				| NORMAL								|
	| case							| 37									|

@f100_6_radiologyreport_vpr @vpr
Scenario: Client can request radiology report results in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "C877;1" has been synced through Admin API
When the client requests radiology report results for the patient "C877;1" in VPR format
Then a successful response is returned
Then the client receives 70 VPR "VistA" result(s)
Then the client receives 70 VPR "kodak" result(s)
And the VPR results contain "radiology report results"

	| field							| value									|
	| pid							| C877;1								|
	| summary						| RADIOLOGIC EXAMINATION, WRIST; 2 VIEWS|
	| name							| WRIST 2 VIEWS							|
	| statusName					| COMPLETE								|
	| kind							| Imaging								|
	| facilityCode					| 500									|
	| facilityName					| CAMP BEE								|
	| dateTime						| 199605081123							|
	| category						| RA									|
	| imageLocation					| RADIOLOGY MAIN FLOOR					|
	| locationUid					| urn:va:location:C877:40				|
	| hasImages						| false									|
	| providers.providerName		| PROVIDER,FIFTY						|
	| diagnosis.code				| NORMAL								|
	| case							| 37									|

# negative test case.

@f100_7_radiologyreport_neg_vpr
Scenario: Negative scenario.  Client can request radiology results in VPR format
Given a patient with "No radiology report results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests radiology report results for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed


      
@f100_8_radiologyreport_vpr @vpr @teststatustranscribed 
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests radiology report results for the patient "10146V393772" in VPR format
Then a successful response is returned
And the VPR results contain "radiology report results"                                                      
      | field        | kodak_value                                                                            |
      | uid          | urn:va:image:C877:301:7019787.9197-1                                                   |
      | summary      | RADIOLOGIC EXAMINATION, ABDOMEN; ANTEROPOSTERIOR AND ADDITIONAL OBLIQUE AND CONE VIEWS |
      | pid          | C877;301                                                                               |
      | kind         | Imaging                                                                                |
      | localId      | 7019787.9197-1                                                                         |
      | facilityCode | 500                                                                                    |
      | facilityName | CAMP BEE                                                                               |
      | typeName     | RADIOLOGIC EXAMINATION, ABDOMEN; ANTEROPOSTERIOR AND ADDITIONAL OBLIQUE AND CONE VIEWS |
      | dateTime     | 199802120802                                                                           |
      | category     | RA                                                                                     |
      | hasImages    | false                                                                                  |
      | statusName   | TRANSCRIBED                                                                            |


@f100_9_radiologyreport_vpr @vpr @teststatuswaitingforexam
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "10110V004877" has been synced through Admin API
When the client requests radiology report results for the patient "10110V004877" in VPR format
Then a successful response is returned
And the VPR results contain "radiology report results"                                                      
      | field        | kodak_value                                |
      | uid          | urn:va:image:9E7A:8:7008783.8579-1         |
      | summary      | RADIOLOGIC EXAMINATION, KNEE; 1 OR 2 VIEWS |
      | pid          | 9E7A;8                                     |
      | kind         | Imaging                                    |
      | localId      | 7008783.8579-1                             |
      | facilityCode | 500                                        |
      | facilityName | CAMP MASTER                                |
      | typeName     | RADIOLOGIC EXAMINATION, KNEE; 1 OR 2 VIEWS |
      | dateTime     | 199912161420                               |
      | category     | RA                                         |
      | hasImages    | false                                      |
      | statusName   | WAITING FOR EXAM                           |


@f100_10_radiologyreport_vpr @vpr @teststatusexamined
Scenario: Client can request Radiology Reports in VPR format
Given a patient with "radiology report results" in multiple VistAs
Given a patient with pid "9E7A;91" has been synced through Admin API
When the client requests radiology report results for the patient "9E7A;91" in VPR format
Then a successful response is returned
And the VPR results contain "radiology report results"                                                      
      | field        | kodak_value                                                    |
      | uid          | urn:va:image:9E7A:91:7018790.8865-1                            |
      | summary      | DUPLEX SCAN OF EXTRACRANIAL ARTERIES; COMPLETE BILATERAL STUDY |
      | pid          | 9E7A;91                                                        |
      | kind         | Imaging                                                        |
      | localId      | 7018790.8865-1                                                 |
      | facilityCode | 998                                                            |
      | facilityName | ABILENE (CAA)                                                  |
      | typeName     | DUPLEX SCAN OF EXTRACRANIAL ARTERIES; COMPLETE BILATERAL STUDY |
      | dateTime     | 199812091134                                                   |
      | category     | RA                                                             |
      | hasImages    | false                                                          |
      | statusName   | EXAMINED                                                       |
 
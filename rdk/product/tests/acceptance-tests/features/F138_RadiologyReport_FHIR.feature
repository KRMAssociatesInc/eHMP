 @radiologyreport_fhir @fhir @vxsync @patient
 Feature: F138 Return of Radiology Reports in FHIR format

 #This feature item returns Radiology Reports in FHIR format. Also includes cases where no Radiology Reports exist.

 @F138_1_radiologyreport_fhir @fhir @10107V395912
 Scenario: Client can request Radiology Reports in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
  # And a patient with pid "10107V395912" has been synced through the RDK API
   When the client requests radiology report results for the patient "10107V395912" in FHIR format
   Then a successful response is returned
   Then the client receives 88 FHIR "VistA" result(s)
   And the client receives 44 FHIR "panorama" result(s)
   And the FHIR results contain "radiology report results"
       | field                                 | panorama_value                                          |
       | resource.extension.url    	            | http://vistacore.us/fhir/extensions/rad#statusName      |
       | resource.extension.valueString         | COMPLETE                                                |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#imagingTypeUid  |
       | resource.extension.valueString         | urn:va:imaging-Type:GENERAL RADIOLOGY                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#hasImages       |
       | resource.extension.valueString         | false                                                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#providerUid     |
       | resource.extension.valueString         | urn:va:user:9E7A:1595                                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#providerName    |
       | resource.extension.valueString         | PROVIDER,FIFTY                                          |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#locationUid     |
       | resource.extension.valueString         | urn:va:location:9E7A:40                                 |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#locationName    |
       | resource.extension.valueString         | RADIOLOGY MAIN FLOOR                                |
       | resource.text.status                   | generated                                           |
       | resource.contained.identifier.system   | urn:oid:2.16.840.1.113883.6.233                     |
       | resource.contained.identifier.value    | 500                                                 |
       | resource.contained.name                | CAMP MASTER                                         |
       | resource.name.text                     | ANKLE 2 VIEWS                                       |
       | resource.status                        | final                                               |
       | resource.issued                        | 1994-06-17T16:12:00                                 |
       | resource.subject.reference             | Patient/10107V395912                                |
       | resource.performer.reference           | IS_SET                                              |
       | resource.identifier.system             | urn:oid:2.16.840.1.113883.6.233                     |
       | resource.identifier.value              | urn:va:image:9E7A:253:7059382.8387-1                |
       | resource.serviceCategory.coding.code   | RAD                                                 |
       | resource.serviceCategory.coding.display| Radiology                                           |
       | resource.serviceCategory.coding.system | http://hl7.org/fhir/v2/0074                         |
       | resource.serviceCategory.text          | Radiology                                           |
       | resource.diagnosticDateTime            | 1994-06-17T16:12:00                                 |
       | resource.codedDiagnosis.text           | NORMAL                                              |
     # | resource.presentedForm                 | #74:200, #74:300                                    |

 #orderName and interpretation mapping data were not available for the above patient.
 #so this test is created to test those field mappings.

 @F138_2_radiologyreport_fhir @fhir @10146V393772
 Scenario: Client can request Radiology Reports in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
 #  And a patient with pid "10146V393772" has been synced through the RDK API
   When the client requests radiology report results for the patient "10146V393772" in FHIR format
   Then a successful response is returned
   Then the client receives 26 FHIR "VistA" result(s)
   And the client receives 13 FHIR "panorama" result(s)
   And the FHIR results contain "radiology report results"
       | field                                         | panorama_value                              |
       | resource.requestDetail.reference               | IS_SET                                      |

 @F138_3_radiologyreport_fhir @fhir @10107V395912
 Scenario: Client can request Radiology Reports in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
  # And a patient with pid "10107V395912" has been synced through the RDK API
   When the client requests radiology report results for the patient "10107V395912" in FHIR format
   Then a successful response is returned
   Then the client receives 88 FHIR "VistA" result(s)
   And the client receives 44 FHIR "kodak" result(s)
   And the FHIR results contain "radiology report results"
       | field                                 | kodak_value                                             |
       | resource.extension.url    	            | http://vistacore.us/fhir/extensions/rad#statusName      |
       | resource.extension.valueString         | COMPLETE                                                |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#imagingTypeUid  |
       | resource.extension.valueString         | urn:va:imaging-Type:GENERAL RADIOLOGY                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#hasImages       |
       | resource.extension.valueString         | false                                                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#providerUid     |
       | resource.extension.valueString         | urn:va:user:C877:1595                                   |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#providerName    |
       | resource.extension.valueString         | PROVIDER,FIFTY                                          |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#locationUid     |
       | resource.extension.valueString         | urn:va:location:C877:40                                 |
       | resource.extension.url                 | http://vistacore.us/fhir/extensions/rad#locationName    |
       | resource.extension.valueString         | RADIOLOGY MAIN FLOOR                                |
       | resource.text.status                   | generated                                           |
       | resource.contained.identifier.system   | urn:oid:2.16.840.1.113883.6.233                     |
       | resource.contained.identifier.value    | 500                                                 |
       | resource.contained.name                | CAMP BEE                                      	    |
       | resource.name.text                     | ANKLE 2 VIEWS                                       |
       | resource.status                        | final                                               |
       | resource.issued                        | 1994-06-17T16:12:00                                 |
       | resource.subject.reference             | Patient/10107V395912                                |
       | resource.performer.reference           | IS_SET                                              |
       | resource.identifier.system             | urn:oid:2.16.840.1.113883.6.233                     |
       | resource.identifier.value              | urn:va:image:C877:253:7059382.8387-1                |
       | resource.serviceCategory.coding.code   | RAD                                                 |
       | resource.serviceCategory.coding.display| Radiology                                           |
       | resource.serviceCategory.coding.system | http://hl7.org/fhir/v2/0074                         |
       | resource.serviceCategory.text          | Radiology                                           |
       | resource.diagnosticDateTime            | 1994-06-17T16:12:00                                 |
       | resource.codedDiagnosis.text           | NORMAL                                              |
     # | resource.presentedForm                 | #74:200, #74:300                                    |

 #orderName and interpretation mapping data were not available for the above patient.
 #so this test is created to test those field mappings.

 @F138_4_radiologyreport_fhir @fhir @10146V393772
 Scenario: Client can request Radiology Reports in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
 #  And a patient with pid "10146V393772" has been synced through the RDK API
   When the client requests radiology report results for the patient "10146V393772" in FHIR format
   Then a successful response is returned
   Then the client receives 26 FHIR "VistA" result(s)
   And the client receives 13 FHIR "kodak" result(s)
   And the FHIR results contain "radiology report results"
       | field                                         | kodak_value                                 |
       | resource.requestDetail.reference               | IS_SET                                      |



 # following 2 scenarios are checking for another patient for return of radiology results.
 # only few fields are checked to validate data integrity.

 @F138_5_radiologyreport_fhir @fhir @9E7A1
 Scenario: Client can request radiology report results in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
  # And a patient with pid "9E7A;1" has been synced through the RDK API
   When the client requests radiology report results for the patient "9E7A;1" in FHIR format
   Then a successful response is returned
   Then the client receives 70 FHIR "VistA" result(s)
   And the client receives 70 FHIR "panorama" result(s)
   And the FHIR results contain "radiology report results"
 		    | field											                | value							                          			    |
 		    | resource.identifier.value						      | CONTAINS urn:va:image:9E7A:1:7039491	          	    |
 	      | resource.subject.reference             		| Patient/9E7A;1                                        |
        	| resource.codedDiagnosis.text           		| NORMAL                                                |
       	| resource.name.text                     		| WRIST 2 VIEWS                                         |
       	| resource.extension.url						        	| http://vistacore.us/fhir/extensions/rad#caseId        |
       	| resource.extension.valueString					    | 37										                                |
        	| resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#hasImages     |
       	| resource.extension.valueString         		| false                                                 |
        	| resource.contained.identifier.value    		| 500                                                   |
       	| resource.contained.name                		| CAMP MASTER                                           |
        	| resource.status                        		| final	                                  	            |
         | resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#locationUid   |
       	| resource.extension.valueString         		| urn:va:location:9E7A:40                 	            |
         | resource.issued                       			| 1996-05-08T11:23:00                                   |
         | resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#providerName  |
       	| resource.extension.valueString         		| PROVIDER,FIFTY                                        |
       	| resource.extension.url						        	| http://vistacore.us/fhir/extensions/rad#imageLocation |
       	| resource.extension.valueString					    | RADIOLOGY MAIN FLOOR					                      	|

 @F138_6_radiologyreport_fhir @fhir @C8771
 Scenario: Client can request radiology report results in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
  # And a patient with pid "C877;1" has been synced through the RDK API
   When the client requests radiology report results for the patient "C877;1" in FHIR format
   Then a successful response is returned
   Then the client receives 70 FHIR "VistA" result(s)
   And the client receives 70 FHIR "kodak" result(s)
   And the FHIR results contain "radiology report results"

 		    | field										                	| value										                              |
 		    | resource.identifier.value					      	| CONTAINS urn:va:image:C877:1:7039491		              |
 	      | resource.subject.reference             		| Patient/C877;1                                        |
        	| resource.codedDiagnosis.text           		| NORMAL                                                |
       	| resource.name.text                     		| WRIST 2 VIEWS                                         |
       	| resource.extension.url							        | http://vistacore.us/fhir/extensions/rad#caseId        |
       	| resource.extension.valueString				    	| 37									                                	|
        	| resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#hasImages     |
       	| resource.extension.valueString         		| false                                                 |
        	| resource.contained.identifier.value    		| 500                                                   |
        	| resource.status                        		| final	                                              	|
         | resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#locationUid   |
       	| resource.extension.valueString         		| urn:va:location:C877:40                              	|
         | resource.issued                       			| 1996-05-08T11:23:00                                   |
         | resource.extension.url                 		| http://vistacore.us/fhir/extensions/rad#providerName  |
       	| resource.extension.valueString         		| PROVIDER,FIFTY                                        |
       	| resource.extension.url						        	| http://vistacore.us/fhir/extensions/rad#imageLocation |
       	| resource.extension.valueString					    | RADIOLOGY MAIN FLOOR					                      	|

 # negative test case.

 @F138_7_radiologyreport_neg_fhir @fhir @9E7A100184
 Scenario: Negative scenario.  Client can request radiology results in FHIR format
   Given a patient with "No radiology report results" in multiple VistAs
   When the client requests radiology report results for the patient "9E7A;100184" in FHIR format
   Then a successful response is returned
   Then corresponding matching FHIR records totaling "0" are displayed

 @F138_8_radiologyreport_fhir @fhir @10107V395912 @DE974
 Scenario: Client can request Radiology Reports in FHIR format
   Given a patient with "radiology report results" in multiple VistAs
   #And a patient with pid "10107V395912" has been synced through the RDK API
   When the client requests radiology report results for the patient "10107V395912" in FHIR format
   Then a successful response is returned
   And the results contain
       | name         | value     |
       | total        | 89        |
   When the client requests radiology report results for the patient "10107V395912" in FHIR format with no domain param
   Then a successful response is returned
   And the results contain
       | name         | value     |
       | total        | 428       |

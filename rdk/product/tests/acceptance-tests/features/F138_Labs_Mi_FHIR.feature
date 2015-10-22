 @labs_fhir  @vxsync @patient

 Feature: F138 Return of Lab (MI) Results in FHIR format

 #This feature item returns an lab result in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
 #Patients used: 11016V630869, 10104V248233, 10110V004877, 10117V810068, 10146V393772, 5123456789V027402

 @F138_1_labs_mi_fhir @fhir @11016V630869
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
   #And a patient with pid "11016V630869" has been synced through the RDK API
 	When the client requests labs for the patient "11016V630869" in FHIR format
 	Then a successful response is returned
 	Then the client receives 92 FHIR "VistA" result(s)
 	And the client receives 46 FHIR "panorama" result(s)
 	And the results contain lab "(MI)" results
       | field                 | panorama_value      |
       | resource.name.text	| AFB CULTURE & SMEAR |
       | resource.issued	 	| 1995-10-26T15:16:00 |
       And the results contain lab "(MI)" results
       | field                                 | values                     |
       | resource.contained.code.text		    | ASPERGILLUS FUMIGATUS (15,000/ML ) : DRUG=CLINDAM INTERP=S RESULT=S |
       | resource.contained.code.coding.display | Culture and Susceptibility |
       | resource.contained.code.coding.code    | 252390002                  |
       | resource.contained.code.coding.system  | http://snomed.org/sct      |
       | resource.contained.status              | final                      |
       | resource.contained.reliability         | ok                         |
       And the results contain lab "(MI)" results
       | field                                          | values                                                     |
       | resource.text.div                               | CONTAINS Test: AFB CULTURE                                 |
       | resource.contained.text.status                  | generated                                                  |
       | resource.contained.identifier.type.text         | facility-code                            			  |
       | resource.contained.identifier.value             | 500                     						  |
       | resource.contained.text.div                     | CONTAINS CAMP MASTER                                       |
       | resource.contained.name                         | CAMP MASTER                                                |
       | resource.contained.type.text                    | URINE                                                      |
       | resource.contained.subject.reference            | Patient/11016V630869                                       |
       | resource.contained.collection.collectedDateTime | 1995-10-16T15:19:00                                        |
       | resource.text.status                            | generated                                                  |
       | resource.name.text                              | AFB CULTURE & SMEAR                                        |
       | resource.status                                 | final                                                      |
       | resource.issued                                 | 1995-10-26T15:16:00                                        |
       | resource.subject.reference                      | Patient/11016V630869                                       |
       | resource.performer.display                      | CAMP MASTER                                                |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                            |
       | resource.identifier.value                       | urn:va:lab:9E7A:227:MI;7048982.848075                      |
       | resource.serviceCategory.text                   | Microbiology                                               |
       | resource.diagnosticDateTime                     | 1995-10-16T15:19:00                                        |
       | resource.specimen.display                       | URINE                                                      |
       | resource.result.display                         | AFB CULTURE & SMEAR |
       And the results contain lab "(MI)" results
       | field                                     | values                                                 |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName      |
       | resource.extension.valueString             | MI 95 27                                               |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid       |
       | resource.extension.valueString             | urn:va:accession:9E7A:227:MI;7048982.848075            |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#report         |
       | resource.extension.valueResource.reference | Composition/urn:va:document:9E7A:227:MI;7048982.848075 |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId        |
       | resource.extension.valueString             | MI;7048982.848075                                      |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen    |
       | resource.extension.valueString             | Positive                                               |

 @F138_2_labs_mi_fhir @fhir @10104V248233
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
  #And a patient with pid "10104V248233" has been synced through the RDK API
 	When the client requests labs for the patient "10104V248233" in FHIR format
 	Then a successful response is returned
 	Then the client receives 370 FHIR "VistA" result(s)
 	And the client receives 185 FHIR "panorama" result(s)
       And the results contain lab "(MI)" results
       | field                                          | values                       |
       | resource.contained.resourceType                 | Specimen                     |
       | resource.contained.type.text                    | SERUM                        |
       | resource.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
       | resource.specimen.display                       | SERUM                        |
       | resource.result.display                         | HDL                          |
       | resource.text.status                            | generated                    |
       | resource.text.div                               | CONTAINS <div>Collected: 2010-03-05T12:00:00 |
       And the results contain lab "(MI)" results
       | field                                          | values                       |
       | resource.contained.resourceType                 | Specimen                     |
       | resource.contained.type.text                    | SERUM                        |
       | resource.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
       | resource.specimen.display                       | SERUM                        |
       | resource.result.display                         | TRIGLYCERIDE                 |
       | resource.text.status                            | generated                    |
       | resource.text.div                               | CONTAINS Test: TRIGLYCERIDE  |

 @F138_3_labs_mi_fhir @fhir @11016V630869
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
  #And a patient with pid "11016V630869" has been synced through the RDK API
 	When the client requests labs for the patient "11016V630869" in FHIR format
 	Then a successful response is returned
 	Then the client receives 92 FHIR "VistA" result(s)
 	And the client receives 46 FHIR "kodak" result(s)
 	And the results contain lab "(MI)" results
       | field               | kodak_value         |
       | resource.name.text	| AFB CULTURE & SMEAR |
       | resource.issued	 	| 1995-10-26T15:16:00 |
       And the results contain lab "(MI)" results
       | field                                 | values                 	   |
       | resource.contained.code.coding.display | Culture and Susceptibility |
       | resource.contained.code.coding.code    | 252390002                  |
       | resource.contained.code.coding.system  | http://snomed.org/sct      |
       | resource.contained.code.text		    | ASPERGILLUS FUMIGATUS (15,000/ML ) : DRUG=CLINDAM INTERP=S RESULT=S |
       | resource.contained.status              | final                      |
       | resource.contained.reliability         | ok                         |
       And the results contain lab "(MI)" results
       | field                                          | values                                                     |
       | resource.text.div                               | CONTAINS Test: AFB CULTURE                                 |
       | resource.contained.text.status                  | generated                                                  |
       | resource.contained.identifier.type.text         | facility-code                            			  |
       | resource.contained.identifier.value             | 500                     						  |
       | resource.contained.text.div                     | CONTAINS CAMP MASTER                                       |
       | resource.contained.name                         | CAMP MASTER                                                |
       | resource.contained.type.text                    | URINE                                                      |
       | resource.contained.subject.reference            | Patient/11016V630869                                       |
       | resource.contained.collection.collectedDateTime | 1995-10-16T15:19:00                                        |
       | resource.text.status                            | generated                                                  |
       | resource.name.text                              | AFB CULTURE & SMEAR                                        |
       | resource.name.coding.display                    | AFB CULTURE & SMEAR                                        |
       | resource.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                       |
       | resource.status                                 | final                                                      |
       | resource.issued                                 | 1995-10-26T15:16:00                                        |
       | resource.subject.reference                      | Patient/11016V630869                                       |
       | resource.performer.display                      | CAMP MASTER                                                |
       | resource.serviceCategory.text                   | Microbiology                                               |
       | resource.diagnosticDateTime                     | 1995-10-16T15:19:00                                        |
       | resource.specimen.display                       | URINE                                                      |
       | resource.result.display                         | AFB CULTURE & SMEAR |
       And the results contain lab "(MI)" results
       | field                                     | values                                                 |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName      |
       | resource.extension.valueString             | MI 95 27                                               |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid       |
       | resource.extension.valueString             | urn:va:accession:C877:227:MI;7048982.848075            |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#report         |
       | resource.extension.valueResource.reference | Composition/urn:va:document:C877:227:MI;7048982.848075 |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId        |
       | resource.extension.valueString             | MI;7048982.848075                                      |
       | resource.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen    |
       | resource.extension.valueString             | Positive                                               |
       And the results contain lab "(MI)" results
    	  | resource.identifier.system                 | urn:oid:2.16.840.1.113883.6.233                            |
 	      | resource.identifier.value                  | urn:va:lab:C877:227:MI;7048982.848075                      |

 @F138_4_labs_mi_fhir @fhir @10110V004877
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
  #And a patient with pid "10110V004877" has been synced through the RDK API
 	When the client requests lab "(MI)" results for that patient "10110V004877"
 	Then a successful response is returned
 	Then the client receives 660 FHIR "VistA" result(s)
 	And the client receives 330 FHIR "kodak" result(s)
       And the results contain lab "(MI)" results
       | field                                          | values                       |
       | resource.contained.resourceType                 | Specimen                     |
       | resource.contained.type.text                    | SERUM                        |
       | resource.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
       | resource.specimen.display                       | SERUM                        |
       | resource.result.display                         | HDL                          |
       | resource.text.status                            | generated                    |
       | resource.text.div                               | CONTAINS <div>Collected: 2010-03-05T12:00:00 |
       And the results contain lab "(MI)" results
       | field                                          | values                       |
       | resource.contained.resourceType                 | Specimen                     |
       | resource.contained.type.text                    | SERUM                        |
       | resource.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
       | resource.specimen.display                       | SERUM                        |
       | resource.result.display                         | TRIGLYCERIDE                 |
       | resource.text.status                            | generated                    |
       | resource.text.div                               | CONTAINS Test: TRIGLYCERIDE  |

 @F138_5_labs_mi_fhir @fhir @9E7A1
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
  #And a patient with pid "9E7A;1" has been synced through the RDK API
 	When the client requests labs for the patient "9E7A;1" in FHIR format
 	Then a successful response is returned
 	Then the client receives 131 FHIR "VistA" result(s)
 	And the client receives 131 FHIR "panorama" result(s)
       And the results contain lab "(MI)" results
       | field                               | values                                    |
       | resource.identifier.value		  | CONTAINS urn:va:lab:9E7A:1:MI		    |
       | resource.text.div			  | CONTAINS urn:va:accession:9E7A:1:MI;	    |
       | resource.subject.reference           | Patient/9E7A;1		                |
       | resource.contained.identifier.type.text  | facility-code                             |
       | resource.contained.identifier.value  | 500						    |
       | resource.performer.display           | CAMP MASTER                               |
       | resource.contained.type.text 	  | BLOOD                                     |
       | resource.name.text			  | BLOOD CULTURE SET #1       		    |
       | resource.contained.valueString	  | CONTAINS NEGATIVE				    |
       | resource.contained.status		  | final						    |

 @F138_6_labs_mi_fhir @fhir @C8771
 Scenario: Client can request lab (MI) results in FHIR format
 	Given a patient with "lab (MI) results" in multiple VistAs
       #And a patient with pid "C877;1" has been synced through the RDK API
 	When the client requests labs for the patient "C877;1" in FHIR format
 	Then a successful response is returned
 	Then the client receives 131 FHIR "VistA" result(s)
 	And the client receives 131 FHIR "kodak" result(s)
       And the results contain lab "(MI)" results
       | field                               | values                                    |
       | resource.identifier.value		  | CONTAINS urn:va:lab:C877:1:MI		    |
       | resource.text.div			  | CONTAINS urn:va:accession:C877:1:MI;	    |
       | resource.subject.reference           | Patient/C877;1		                |
       | resource.contained.identifier.type.text  | facility-code                             |
       | resource.contained.identifier.value  | 500						    |
       | resource.performer.display           | CAMP BEE		                      |
       | resource.contained.type.text 	  | BLOOD                                     |
       | resource.name.text	      	  | BLOOD CULTURE SET #1       		    |
       | resource.contained.valueString	  | CONTAINS NEGATIVE				    |
       | resource.contained.status		  | final						    |

 @F138_7_labs_mi_neg_fhir @fhir @5000000009V082878
 Scenario: Negative scenario.  Client can request lab (MI) results in FHIR format
       Given a patient with "No lab results" in multiple VistAs
       When the client requests labs for the patient "5000000009V082878" in FHIR format
       Then a successful response is returned
       Then corresponding matching FHIR records totaling "1" are displayed

 @F138_8_labs_mi_fhir @fhir @11016V630869 @DE974
 Scenario: Client can request lab (MI) results in FHIR format
       Given a patient with "lab (MI) results" in multiple VistAs
      # And a patient with pid "11016V630869" has been synced through the RDK API
       When the client requests "10" labs for the patient "11016V630869" in FHIR format
       Then a successful response is returned
       And total returned resources are "10"
       And the results contain
       | name         | value     |
       | total | 107        |

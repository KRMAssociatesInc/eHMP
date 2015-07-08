@labs_fhir  @vxsync @patient

Feature: F138 Return of Lab (MI) Results in FHIR format

#This feature item returns an lab result in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 11016V630869, 10104V248233, 10110V004877, 10117V810068, 10146V393772, 5123456789V027402

@F138_1_labs_mi_fhir @fhir @11016V630869
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests labs for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "panorama" result(s)
	And the results contain lab "(MI)" results
      | field                 | panorama_value      |
      | content.name.text	| AFB CULTURE & SMEAR |
      | content.issued	 	| 1995-10-26T15:16:00 |
      And the results contain lab "(MI)" results
      | field                                 | values                     |
      | content.contained._id                 | IS_SET                     |
      | content.contained.name.coding.display | Culture and Susceptibility |
      | content.contained.name.coding.code    | 252390002                  |
      | content.contained.name.coding.system  | http://snomed.org/sct      |
      | content.contained.name.text		    | ASPERGILLUS FUMIGATUS (15,000/ML ) : DRUG=CLINDAM INTERP=S RESULT=S |
      | content.contained.status              | final                      |
      | content.contained.reliability         | ok                         |
      And the results contain lab "(MI)" results
      | field                                          | values                                                     |
      | content.text.div                               | CONTAINS Test: AFB CULTURE                                 |
      | content.contained._id                          | IS_SET                                                     |
      | content.contained.text.status                  | generated                                                  |
      | content.contained.identifier.label             | facility-code                            			  |
      | content.contained.identifier.value             | 500                     						  |
      | content.contained.text.div                     | CONTAINS CAMP MASTER                                       |
      | content.contained.name                         | CAMP MASTER                                                |
      | content.contained.type.text                    | URINE                                                      |
      | content.contained.subject.reference            | Patient/11016V630869                                       |
      | content.contained.collection.collectedDateTime | 1995-10-16T15:19:00                                        |
      | content.text.status                            | generated                                                  |
      | content.name.text                              | AFB CULTURE & SMEAR                                        |
      | content.status                                 | final                                                      |
      | content.issued                                 | 1995-10-26T15:16:00                                        |
      | content.subject.reference                      | Patient/11016V630869                                       |
      | content.performer.display                      | CAMP MASTER                                                |
      | content.performer.reference                    | IS_SET                                                     |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                            |
      | content.identifier.value                       | urn:va:lab:9E7A:227:MI;7048982.848075                      |
      | content.serviceCategory.text                   | Microbiology                                               |
      | content.diagnosticDateTime                     | 1995-10-16T15:19:00                                        |
      | content.specimen.reference                     | IS_SET                                                     |
      | content.specimen.display                       | URINE                                                      |
      | content.result.reference                       | IS_SET                                                     |
      | content.result.display                         | Microscopic observation [Identifier] in Unspecified specimen by Gram stain |
      And the results contain lab "(MI)" results
      | field                                     | values                                                 |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName      |
      | content.extension.valueString             | MI 95 27                                               |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid       |
      | content.extension.valueString             | urn:va:accession:9E7A:227:MI;7048982.848075            |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#report         |
      | content.extension.valueResource.reference | Composition/urn:va:document:9E7A:227:MI;7048982.848075 |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId        |
      | content.extension.valueString             | MI;7048982.848075                                      |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen    |
      | content.extension.valueString             | Positive                                               |

@F138_2_labs_mi_fhir @fhir @10104V248233
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "10104V248233" has been synced through the RDK API
	When the client requests labs for the patient "10104V248233" in FHIR format
	Then a successful response is returned
	Then the client receives 370 FHIR "VistA" result(s)
	And the client receives 185 FHIR "panorama" result(s)
      And the results contain lab "(MI)" results
      | field                                          | values                       |
      | content.contained._id                          | IS_SET                       |
      | content.contained.resourceType                 | Specimen                     |
      | content.contained.type.text                    | SERUM                        |
      | content.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
      | content.specimen.display                       | SERUM                        |
      | content.result.display                         | HDL                          |
      | content.text.status                            | generated                    |
      | content.text.div                               | CONTAINS <div>Collected: 2010-03-05T12:00:00 |
      And the results contain lab "(MI)" results
      | field                                          | values                       |
      | content.contained._id                          | IS_SET                       |
      | content.contained.resourceType                 | Specimen                     |
      | content.contained.type.text                    | SERUM                        |
      | content.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
      | content.specimen.display                       | SERUM                        |
      | content.result.display                         | TRIGLYCERIDE                 |
      | content.text.status                            | generated                    |
      | content.text.div                               | CONTAINS Test: TRIGLYCERIDE  |

@F138_3_labs_mi_fhir @fhir @11016V630869
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests labs for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "kodak" result(s)
	And the results contain lab "(MI)" results
      | field               | kodak_value         |
      | content.name.text	| AFB CULTURE & SMEAR |
      | content.issued	 	| 1995-10-26T15:16:00 |
      And the results contain lab "(MI)" results
      | field                                 | values                 	   |
      | content.contained._id                 | IS_SET                     |
      | content.contained.name.coding.display | Culture and Susceptibility |
      | content.contained.name.coding.code    | 252390002                  |
      | content.contained.name.coding.system  | http://snomed.org/sct      |
      | content.contained.name.text		    | ASPERGILLUS FUMIGATUS (15,000/ML ) : DRUG=CLINDAM INTERP=S RESULT=S |
      | content.contained.status              | final                      |
      | content.contained.reliability         | ok                         |
      And the results contain lab "(MI)" results
      | field                                          | values                                                     |
      | content.text.div                               | CONTAINS Test: AFB CULTURE                                 |
      | content.contained._id                          | IS_SET                                                     |
      | content.contained.text.status                  | generated                                                  |
      | content.contained.identifier.label             | facility-code                            			  |
      | content.contained.identifier.value             | 500                     						  |
      | content.contained.text.div                     | CONTAINS CAMP MASTER                                       |
      | content.contained.name                         | CAMP MASTER                                                |
      | content.contained.type.text                    | URINE                                                      |
      | content.contained.subject.reference            | Patient/11016V630869                                       |
      | content.contained.collection.collectedDateTime | 1995-10-16T15:19:00                                        |
      | content.text.status                            | generated                                                  |
      | content.name.text                              | AFB CULTURE & SMEAR                                        |
      | content.name.coding.display                    | AFB CULTURE & SMEAR                                        |
      | content.name.coding.display                    | AFB CULTURE & SMEAR                                        |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                       |
      | content.status                                 | final                                                      |
      | content.issued                                 | 1995-10-26T15:16:00                                        |
      | content.subject.reference                      | Patient/11016V630869                                       |
      | content.performer.display                      | CAMP MASTER                                                |
      | content.performer.reference                    | IS_SET                                                     |
      | content.serviceCategory.text                   | Microbiology                                               |
      | content.diagnosticDateTime                     | 1995-10-16T15:19:00                                        |
      | content.specimen.reference                     | IS_SET                                                     |
      | content.specimen.display                       | URINE                                                      |
      | content.result.reference                       | IS_SET                                                     |
      | content.result.display                         | Microscopic observation [Identifier] in Unspecified specimen by Gram stain |
      And the results contain lab "(MI)" results
      | field                                     | values                                                 |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName      |
      | content.extension.valueString             | MI 95 27                                               |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid       |
      | content.extension.valueString             | urn:va:accession:C877:227:MI;7048982.848075            |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#report         |
      | content.extension.valueResource.reference | Composition/urn:va:document:C877:227:MI;7048982.848075 |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId        |
      | content.extension.valueString             | MI;7048982.848075                                      |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen    |
      | content.extension.valueString             | Positive                                               |
      And the results contain lab "(MI)" results
   	| content.identifier.system                 | urn:oid:2.16.840.1.113883.6.233                            |
	| content.identifier.value                  | urn:va:lab:C877:227:MI;7048982.848075                      |

@F138_4_labs_mi_fhir @fhir @10110V004877
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests lab "(MI)" results for that patient "10110V004877"
	Then a successful response is returned
	Then the client receives 660 FHIR "VistA" result(s)
	And the client receives 330 FHIR "kodak" result(s)
      And the results contain lab "(MI)" results
      | field                                          | values                       |
      | content.contained._id                          | IS_SET                       |
      | content.contained.resourceType                 | Specimen                     |
      | content.contained.type.text                    | SERUM                        |
      | content.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
      | content.specimen.display                       | SERUM                        |
      | content.result.display                         | HDL                          |
      | content.text.status                            | generated                    |
      | content.text.div                               | CONTAINS <div>Collected: 2010-03-05T12:00:00 |
      And the results contain lab "(MI)" results
      | field                                          | values                       |
      | content.contained._id                          | IS_SET                       |
      | content.contained.resourceType                 | Specimen                     |
      | content.contained.type.text                    | SERUM                        |
      | content.contained.collection.collectedDateTime | 2010-03-05T12:00:00          |
      | content.specimen.display                       | SERUM                        |
      | content.result.display                         | TRIGLYCERIDE                 |
      | content.text.status                            | generated                    |
      | content.text.div                               | CONTAINS Test: TRIGLYCERIDE  |

@F138_5_labs_mi_fhir @fhir @9E7A1
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "9E7A;1" has been synced through the RDK API
	When the client requests labs for the patient "9E7A;1" in FHIR format
	Then a successful response is returned
	Then the client receives 133 FHIR "VistA" result(s)
	And the client receives 133 FHIR "panorama" result(s)
      And the results contain lab "(MI)" results
      | field                               | values                                    |
      | content.identifier.value		  | CONTAINS urn:va:lab:9E7A:1:MI		    |
      | content.text.div			  | CONTAINS urn:va:accession:9E7A:1:MI;	    |
      | content.subject.reference           | Patient/9E7A;1		                |
      | content.contained.identifier.label  | facility-code                             |
      | content.contained.identifier.value  | 500						    |
      | content.performer.display           | CAMP MASTER                               |
      | content.contained.type.text 	  | BLOOD                                     |
      | content.name.text			  | BLOOD CULTURE SET #1       		    |
      | content.contained.valueString	  | CONTAINS NEGATIVE				    |
      | content.contained.status		  | final						    |

@F138_6_labs_mi_fhir @fhir @C8771
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "C877;1" has been synced through the RDK API
	When the client requests labs for the patient "C877;1" in FHIR format
	Then a successful response is returned
	Then the client receives 133 FHIR "VistA" result(s)
	And the client receives 133 FHIR "kodak" result(s)
      And the results contain lab "(MI)" results
      | field                               | values                                    |
      | content.identifier.value		  | CONTAINS urn:va:lab:C877:1:MI		    |
      | content.text.div			  | CONTAINS urn:va:accession:C877:1:MI;	    |
      | content.subject.reference           | Patient/C877;1		                |
      | content.contained.identifier.label  | facility-code                             |
      | content.contained.identifier.value  | 500						    |
      | content.performer.display           | CAMP BEE		                      |
      | content.contained.type.text 	  | BLOOD                                     |
      | content.name.text	      	  | BLOOD CULTURE SET #1       		    |
      | content.contained.valueString	  | CONTAINS NEGATIVE				    |
      | content.contained.status		  | final						    |

@F138_7_labs_mi_neg_fhir @fhir @5000000009V082878
Scenario: Negative scenario.  Client can request lab (MI) results in FHIR format
      Given a patient with "No lab results" in multiple VistAs
      When the client requests labs for the patient "5000000009V082878" in FHIR format
      Then a successful response is returned
      Then corresponding matching FHIR records totaling "1" are displayed

@F138_7_labs_mi_fhir @fhir @11016V630869 @DE974
Scenario: Client can request lab (MI) results in FHIR format
      Given a patient with "lab (MI) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
      When the client requests "10" labs for the patient "11016V630869" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 10        |

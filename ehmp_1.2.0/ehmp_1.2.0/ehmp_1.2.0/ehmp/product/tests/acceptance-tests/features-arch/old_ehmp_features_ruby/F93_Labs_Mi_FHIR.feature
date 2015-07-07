@labs_fhir 

Feature: F93 Return of Lab (MI) Results in FHIR format 


@f93_1_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "panorama" result(s)
	And the results contain lab "(MI)" results                                                      
      | field               | panorama_value      |
      | content.name.text	| AFB CULTURE & SMEAR |
      | content.issued	 	| 1995-10-26T15:16:00 |

    And the results contain lab "(MI)" results
      | field                                     | values                 |
      | content.contained._id                 | IS_SET                     |
      | content.contained.name.coding.display | Culture and Susceptibility |
      | content.contained.name.coding.code    | 252390002                  |
      | content.contained.name.coding.system  | http://snomed.org/sct      |
      | content.contained.name.text		      | ASPERGILLUS FUMIGATUS (15,000/ML ) DRUG=CLINDAM INTERP=S RESULT=S |
      | content.contained.status              | final                      |
      | content.contained.reliability         | ok                         |
      

    And the results contain lab "(MI)" results                                                       
      | field                                          | values                                                     |
      | content.text.div                               | CONTAINS Test: AFB CULTURE                                 |
      | content.contained._id                          | IS_SET                                                     |
      | content.contained.text.status                  | generated                                                  |
      | content.contained.identifier.label             | facility-code                            					|
      | content.contained.identifier.value             | 500                     									|
      | content.contained.text.div                     | CONTAINS CAMP MASTER                                       |
      | content.contained.name                         | CAMP MASTER                                                |
      | content.contained.type.text                    | URINE                                                      |
      | content.contained.subject.reference            | Patient/11016V630869                                              |
      | content.contained.collection.collectedDateTime | 1995-10-16T15:19:00                                        |
      | content.text.status                            | generated                                                  |
      | content.name.text                              | AFB CULTURE & SMEAR                                        |
      | content.name.coding.display                    | AFB CULTURE & SMEAR                                        |
      | content.name.coding.display                    | AFB CULTURE & SMEAR                                        |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                       |
      | content.status                                 | final                                                      |
      | content.issued                                 | 1995-10-26T15:16:00                                        |
      | content.subject.reference                      | Patient/11016V630869                                              |
      | content.performer.display                      | CAMP MASTER                                                |
      | content.performer.reference                    | IS_SET                                                     |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                            |
      | content.identifier.value                       | urn:va:lab:9E7A:227:MI;7048982.848075                      |
      | content.serviceCategory.coding.code            | MB                                                         |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                |
      | content.serviceCategory.coding.display         | Microbiology                                               |
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
      
 
@f93_2_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "9E7A;737" has been synced through Admin API
	When the client requests labs for the patient "9E7A;737" in FHIR format
	Then a successful response is returned
	Then the client receives 40 FHIR "VistA" result(s)
	And the client receives 40 FHIR "panorama" result(s)	
    And the results contain lab "(MI)" results                                                       
      | field                                 | values                                                                     |
      | content.contained._id                 | IS_SET                                                                     |
      | content.contained.name.coding.display | CONTAINS Microscopic observation [Identifier] in Unspecified specimen by Gram stain |
      | content.contained.name.coding.code    | 664-3                                                                      |
      | content.contained.name.coding.system  | http://loinc.org                                                           |
      | content.contained.name.text			  | ESCHERICHIA COLI (>15,000/ML ) DRUG=CHLORAMPHENICOL INTERP=R RESULT=R	   |
      | content.contained.status              | final                                                                      |
      | content.contained.reliability         | ok                                                                         |
      
    And the results contain lab "(MI)" results
      | field                                     | values                                                                    |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName                         |
      | content.extension.valueString             | MI 99 2                                                                   |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid                          |
      | content.extension.valueString             | urn:va:accession:9E7A:737:MI;7009789.889352                               |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#report                            |
      | content.extension.valueResource.reference | Composition/urn:va:document:9E7A:737:MI;7009789.889352 					  |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId                           |
      | content.extension.valueString             | MI;7009789.889352                                                         |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen                       |
      | content.extension.valueString             | Positive                                                                  |
      
         
    And the results contain lab "(MI)" results
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#bactRemarks                       |
      | content.extension.valueString             | CONTAINS NO GROWTH AFTER 2 DAYS                                           |
      
    And the lab field(s) just contain "Patient/9E7A;737"
      | field                         		|
	  | content.subject.reference     		| 
      | content.contained.subject.reference	|  
         
   
#   And the results contain lab "(MI)" results
#	  urn:va:<sitehash>:<dfn>:<ien> 
#     | content.name								           | | Waiting on terminology data      
#     | requesrDetail.reference                                | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | requestDetail.display                                  | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | imagingStudy.reference                                 | Data doesn't exist in the lab results |
#     | imagingStudy.display                                   | Data doesn't exist in the lab results |
#     | conclusion                                             | Data doesn't exist in the lab results |
#     | codedDiagnosis                                         | Data doesn't exist in the lab results |
#     | presentedForm                                          | Data doesn't exist in the lab results |

@f93_3_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
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
      | content.contained.name.text		      | ASPERGILLUS FUMIGATUS (15,000/ML ) DRUG=CLINDAM INTERP=S RESULT=S |
      | content.contained.status              | final                      |
      | content.contained.reliability         | ok                         |
      

    And the results contain lab "(MI)" results                                                       
      | field                                          | values                                                     |
      | content.text.div                               | CONTAINS Test: AFB CULTURE                                 |
      | content.contained._id                          | IS_SET                                                     |
      | content.contained.text.status                  | generated                                                  |
      | content.contained.identifier.label             | facility-code                            					|
      | content.contained.identifier.value             | 500                     									|
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
#      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                           |
#      | content.identifier.value                       | urn:va:lab:C877:227:MI;7048982.848075                     |
      | content.serviceCategory.coding.code            | MB                                                         |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                |
      | content.serviceCategory.coding.display         | Microbiology                                               |
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
   		| content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                            |
		| content.identifier.value                       | urn:va:lab:C877:227:MI;7048982.848075                      |
      
 
@f93_4_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "C877;737" has been synced through Admin API
	When the client requests lab "(MI)" results for that patient "C877;737"
	Then a successful response is returned
	Then the client receives 40 FHIR "VistA" result(s)
	And the client receives 40 FHIR "kodak" result(s)	
    And the results contain lab "(MI)" results                                                       
      | field                                 | values                                                                     |
      | content.contained._id                 | IS_SET                                                                     |
      | content.contained.name.coding.display | CONTAINS Microscopic observation [Identifier] in Unspecified specimen by Gram stain |
      | content.contained.name.coding.code    | 664-3                                                                      |
      | content.contained.name.coding.system  | http://loinc.org                                                           |
      | content.contained.name.text			  | ESCHERICHIA COLI (>15,000/ML ) DRUG=CHLORAMPHENICOL INTERP=R RESULT=R	   |
      | content.contained.status              | final                                                                      |
      | content.contained.reliability         | ok                                                                         |
      
    And the results contain lab "(MI)" results
      | field                                     | values                                                                    |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupName                         |
      | content.extension.valueString             | MI 99 2                                                                   |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#groupUid                          |
      | content.extension.valueString             | urn:va:accession:C877:737:MI;7009789.889352                               |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#report                            |
      | content.extension.valueResource.reference | Composition/urn:va:document:C877:737:MI;7009789.889352 					  |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#localId                           |
      | content.extension.valueString             | MI;7009789.889352                                                         |
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#urineScreen                       |
      | content.extension.valueString             | Positive                                                                  |
      
         
    And the results contain lab "(MI)" results
      | content.extension.url                     | http://vistacore.us/fhir/extensions/lab#bactRemarks                       |
      | content.extension.valueString             | CONTAINS NO GROWTH AFTER 2 DAYS                                           |
      
    And the lab field(s) just contain "Patient/C877;737"
      | field                         		|
	  | content.subject.reference     		| 
      | content.contained.subject.reference	|  
         
   
#   And the results contain lab "(MI)" results
#	  urn:va:<sitehash>:<dfn>:<ien> 
#     | content.name								           | | Waiting on terminology data      
#     | requesrDetail.reference                                | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | requestDetail.display                                  | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | imagingStudy.reference                                 | Data doesn't exist in the lab results |
#     | imagingStudy.display                                   | Data doesn't exist in the lab results |
#     | conclusion                                             | Data doesn't exist in the lab results |
#     | codedDiagnosis                                         | Data doesn't exist in the lab results |
#     | presentedForm                                          | Data doesn't exist in the lab results |

# following 2 scenarios are checking for another patient for return of labs results.
# only few fields are checked to validate data integrity.

@f93_5_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "9E7A;1" has been synced through Admin API
	When the client requests labs for the patient "9E7A;1" in FHIR format
	Then a successful response is returned
	Then the client receives 119 FHIR "VistA" result(s)
	And the client receives 119 FHIR "panorama" result(s)	
    And the results contain lab "(MI)" results                                                       
      | field                               | values                                    |
      | content.identifier.value			| CONTAINS urn:va:lab:9E7A:1:MI				|
      | content.text.div					| CONTAINS urn:va:accession:9E7A:1:MI;		|
      | content.subject.reference           | Patient/9E7A;1		                    |
      | content.contained.identifier.label  | facility-code                             |
      | content.contained.identifier.value  | 500						 				|
      | content.performer.display           | CAMP MASTER                               |
      | content.contained.type.text 		| BLOOD                                     |
      | content.name.text					| BLOOD CULTURE SET #1       				|
      | content.contained.valueString		| CONTAINS NEGATIVE							|
      | content.contained.status			| final										|
      
@f93_6_labs_mi_fhir @fhir
Scenario: Client can request lab (MI) results in FHIR format
	Given a patient with "lab (MI) results" in multiple VistAs
      Given a patient with pid "C877;1" has been synced through Admin API
	When the client requests labs for the patient "C877;1" in FHIR format
	Then a successful response is returned
	Then the client receives 119 FHIR "VistA" result(s)
	And the client receives 119 FHIR "kodak" result(s)	
    And the results contain lab "(MI)" results                                                       
      | field                               | values                                    |
      | content.identifier.value			| CONTAINS urn:va:lab:C877:1:MI				|
      | content.text.div					| CONTAINS urn:va:accession:C877:1:MI;		|
      | content.subject.reference           | Patient/C877;1		                    |
      | content.contained.identifier.label  | facility-code                             |
      | content.contained.identifier.value  | 500						 				|
      | content.performer.display           | CAMP BEE		                            |
      | content.contained.type.text 		| BLOOD                                     |
      | content.name.text					| BLOOD CULTURE SET #1       				|
      | content.contained.valueString		| CONTAINS NEGATIVE							|
      | content.contained.status			| final										|

# negative test case
# already checked as part of labs-chem
		
@f93_7_labs_mi_neg_fhir
Scenario: Negative scenario.  Client can request lab (MI) results in FHIR format
	Given a patient with "No lab results" in multiple VistAs
	Given a patient with pid "1006184063V088473" has been synced through Admin API
	When the client requests labs for the patient "1006184063V088473" in FHIR format
	Then a successful response is returned
	Then corresponding matching FHIR records totaling "0" are displayed
 
    
 
    

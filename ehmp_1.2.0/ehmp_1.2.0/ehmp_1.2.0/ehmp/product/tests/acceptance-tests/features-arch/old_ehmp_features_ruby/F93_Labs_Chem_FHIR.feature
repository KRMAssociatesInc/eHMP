@labs_fhir  
Feature: F93 Return of Lab (Chem/Hem) Results in FHIR format 


#This feature item covers the return of Chemistry and Hematology Lab results in FHIR format. Also includes cases when no results exist. 


@f93_1_labs_ch_fhir @fhir
Scenario: Client can request lab (Chem/Hem) results in FHIR format
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "panorama" result(s)
	And the results contain lab "(Chem/Hem)" results                                                      
      | field                                 | panorama_value      |
      | content.contained.valueQuantity.value | 17.5                |
      | content.issued                        | 2005-03-17T03:36:00 |
      | content.contained.name.text           | PROTIME             |
      
	
	And the results contain lab "(Chem/Hem)" results 
	  | field                                          | values                                                          |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.name.text                    | SODIUM                                                          |      
      #With release S65 VUID doesn't exist
      #| content.contained.name.coding.code             | urn:va:vuid:4671867                                             |
      #| content.contained.name.coding.display          | SODIUM                                                          |
      #| content.contained.name.coding.system           | urn:oid:2.16.840.1.113883.6.233                                 |
      #With release S65 LOINC was replaced by IEN because the typecode changed to an IEN
      #| content.contained.name.coding.code             | urn:lnc:2947-0                                                  |
      | content.contained.name.coding.code             | urn:va:ien:60:176:72                                                  |
      | content.contained.name.coding.display          | SODIUM                                                          |
      | content.contained.name.coding.system           | urn:oid:2.16.840.1.113883.4.642.2.58                            |
	  | content.contained.valueQuantity.value          | 144                                                             |
      | content.contained.valueQuantity.units          | meq/L                                                           |	   
      | content.contained.interpretation.coding.system | http://hl7.org/fhir/vs/observation-interpretation 			     |
      | content.contained.interpretation.coding.code   | N                                                       		 |
      | content.contained.interpretation.coding.display| Normal                                                          |
      | content.contained.referenceRange.high.value    | 145                                                             |
      | content.contained.referenceRange.high.units    | meq/L                                                           |
      | content.contained.referenceRange.low.value     | 135                                                             |
      | content.contained.referenceRange.low.units     | meq/L                                                           |
      | content.contained.status                       | final                                                           |
      | content.contained.reliability                  | ok 															 |
      | content.contained.specimen.reference           | IS_SET                                                          |     
      | content.contained.specimen.display             | SERUM                                                           |
      
      
 	And the results contain lab "(Chem/Hem)" results     
      | field                                          | values                                          				 |
      | content.text.div                               | CONTAINS Accession: urn:va:accession:9E7A:227:CH;6949681.966383 |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.text.status                  | generated                                                       |
      | content.contained.identifier.label             | facility-code                               					 |
      | content.contained.identifier.value             | 500						 									 |
      | content.contained.text.div                     | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
      | content.contained.name                         | ALBANY VA MEDICAL CENTER                                        |
      | content.contained.address.text                 | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
      | content.contained.address.line                 | VA MEDICAL CENTER 1 3RD sT.                                     |
      | content.contained.address.city                 | ALBANY                                                          |
      | content.contained.address.state                | NY                                                              |
      | content.contained.address.zip                  | 12180-0097                                                      |
      | content.contained.type.text                    | SERUM                                                           |
      | content.contained.subject.reference            | Patient/11016V630869                                            |
      | content.contained.collection.collectedDateTime | 2005-03-17T03:36:00                                             |
      | content.text.status                            | generated                                                       |
      | content.name.text                    		   | SODIUM                                                          |
      #With release S65 VUID doesn't exist
	#| content.name.coding.code                       | urn:va:vuid:4671867                                             |
      #| content.name.coding.display                    | SODIUM                                                          |
      #| content.name.coding.system                     | urn:oid:2.16.840.1.113883.6.233                                 |
      #With release S65 LOINC was replaced by IEN because the typecode changed to an IEN
      #| content.contained.name.coding.code             | urn:lnc:2947-0                                                  |
      | content.contained.name.coding.code             | urn:va:ien:60:176:72                                                  |
      | content.name.coding.display                    | SODIUM                                                          |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
      | content.status                                 | final                                                           |
	  | content.issued                                 | 2005-03-17T03:36:00                                             |
	  | content.subject.reference                      | Patient/11016V630869                                                   |
	  | content.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
      | content.performer.reference                    | IS_SET                                                          |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                                 |
      | content.identifier.value                       | urn:va:lab:9E7A:227:CH;6949681.966383;5						 |
      | content.serviceCategory.coding.code            | CH                                                              |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
      | content.serviceCategory.coding.display         | Chemistry                                                       |
      | content.serviceCategory.text                   | Chemistry                                                       |
	  | content.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
      | content.specimen.reference                     | IS_SET                                                          |
      | content.specimen.display               		   | SERUM                                   						 |
      | content.result.reference                       | IS_SET                                                          |
      | content.result.display                         | SODIUM                                                          |
      
    And the results contain lab "(Chem/Hem)" results 
	  | field                         | values                                             |
      | content.subject.reference     | Patient/11016V630869                                      |
      | content.contained.type.text   | PLASMA                                             |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#groupName  |
      | content.extension.valueString | COAG 0317 119                                      |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#groupUid   |
      | content.extension.valueString | urn:va:accession:9E7A:227:CH;6949681.966382        |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#labOrderId |
      | content.extension.valueString | 2790                                               |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#localId    |
      | content.extension.valueString | CH;6949681.966382;430                              |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#orderUid   |
      | content.extension.valueString | urn:va:order:9E7A:227:16688                        |
      
    And the lab field(s) just contain "Patient/11016V630869"
      | field                         		|
	  | content.subject.reference     		| 
      | content.contained.subject.reference	| 
       
	
    
     
@f93_2_labs_ch_fhir @fhir
Scenario Outline: Client can request lab (Chem/Hem) results in FHIR format ( Testing result flag Low/ High/ High alert )
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "panorama" result(s)
	And the results contain lab "(Chem/Hem)" results                                                      
      | field                                       	| value                |
      | content.serviceCategory.text                	| Chemistry            |
      | content.diagnosticDateTime                  	| <diagnosticDateTime> |
      | content.contained.type.text                 	| SERUM                |
      | content.contained.name.text                		| <test>               |
      | content.contained.valueQuantity.value       	| <resultValue>        |
      | content.contained.valueQuantity.units       	| <unit>               |
      | content.contained.referenceRange.high.value 	| <rangeHighValue>     |
      | content.contained.referenceRange.high.units 	| <unit>               |
      | content.contained.referenceRange.low.value  	| <rangeLowValue>      |
      | content.contained.referenceRange.low.units  	| <unit>               |
      | content.contained.interpretation.coding.display | <flagValue>          |
      | content.contained.interpretation.coding.system  | <flagUrl>            |
      
    Examples: 
      | diagnosticDateTime  | test          | resultValue | unit       | rangeHighValue | rangeLowValue | flagValue  				| flagUrl                                           |
      | 2004-03-28T23:49:00 | SODIUM        | 135         | meq/L      | 145            | 135           | Normal     				| http://hl7.org/fhir/vs/observation-interpretation |
      | 1995-04-18T08:44:00 | SODIUM        | 134         | meq/L      | 145            | 135           | Below low normal  		| http://hl7.org/fhir/vs/observation-interpretation |
      | 2005-03-17T03:36:00 | CK-MB PERCENT | 7           | CONTAINS % | 6              | 0             | Above high normal 		| http://hl7.org/fhir/vs/observation-interpretation |
      | 1995-10-16T10:36:00 | SODIUM        | 160         | meq/L      | 145            | 135           | Above upper panic limits 	| http://hl7.org/fhir/vs/observation-interpretation |
      
           
#   And the results contain lab "(Chem/Hem)" results    
#     | content.name								           | | Waiting on terminology data      
#     | requesrDetail.reference                                | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | requestDetail.display                                  | | Might be populated in the future, but right now we do not have DiagnosticReports mapped from VPR/JDS, nor have we identified how we would connect the records in JDS.
#     | imagingStudy.reference                                 | Data doesn't exist in the lab results |
#     | imagingStudy.display                                   | Data doesn't exist in the lab results |
#     | conclusion                                             | Data doesn't exist in the lab results |
#     | codedDiagnosis                                         | Data doesn't exist in the lab results |
#     | presentedForm                                          | Data doesn't exist in the lab results |

@f93_3_labs_ch_fhir @fhir
Scenario: Client can request lab (Chem/Hem) results in FHIR format
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "kodak" result(s)
	And the results contain lab "(Chem/Hem)" results                                                      
      | field                                 | kodak_value         |
      | content.contained.valueQuantity.value | 17.5                |
      | content.issued                        | 2005-03-17T03:36:00 |
      | content.contained.name.text           | PROTIME             |
      
	
	And the results contain lab "(Chem/Hem)" results 
	  | field                                          | values                                                          |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.name.text                    | SODIUM                                                          |      
      #With release S65 VUID doesn't exist
      #| content.contained.name.coding.code             | urn:va:vuid:4671867                                             |
      #| content.contained.name.coding.display          | SODIUM                                                          |
      #| content.contained.name.coding.system           | urn:oid:2.16.840.1.113883.6.233                                 |
      #With release S65 LOINC was replaced by IEN because the typecode changed to an IEN
      #| content.contained.name.coding.code             | urn:lnc:2947-0                                                  |
      | content.contained.name.coding.code             | urn:va:ien:60:176:72                                                  |
      | content.contained.name.coding.display          | SODIUM                                                          |
      | content.contained.name.coding.system           | urn:oid:2.16.840.1.113883.4.642.2.58                            |
	  | content.contained.valueQuantity.value          | 144                                                             |
      | content.contained.valueQuantity.units          | meq/L                                                           |	   
      | content.contained.interpretation.coding.system | http://hl7.org/fhir/vs/observation-interpretation 			     |
      | content.contained.interpretation.coding.code   | N                                                       		 |
      | content.contained.interpretation.coding.display| Normal                                                          |
      | content.contained.referenceRange.high.value    | 145                                                             |
      | content.contained.referenceRange.high.units    | meq/L                                                           |
      | content.contained.referenceRange.low.value     | 135                                                             |
      | content.contained.referenceRange.low.units     | meq/L                                                           |
      | content.contained.status                       | final                                                           |
      | content.contained.reliability                  | ok 															 |
      | content.contained.specimen.reference           | IS_SET                                                          |     
      | content.contained.specimen.display             | SERUM                                                           |
      
      
 	And the results contain lab "(Chem/Hem)" results     
      | field                                          | values                                          				 |
      | content.text.div                               | CONTAINS Accession: urn:va:accession:C877:227:CH;6949681.966383 |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.text.status                  | generated                                                       |
      | content.contained.identifier.label             | facility-code                               					 |
      | content.contained.identifier.value             | 500						 									 |
      | content.contained.text.div                     | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
      | content.contained.name                         | ALBANY VA MEDICAL CENTER                                        |
      | content.contained.address.text                 | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
      | content.contained.address.line                 | VA MEDICAL CENTER 1 3RD sT.                                     |
      | content.contained.address.city                 | ALBANY                                                          |
      | content.contained.address.state                | NY                                                              |
      | content.contained.address.zip                  | 12180-0097                                                      |
      | content.contained.type.text                    | SERUM                                                           |
      | content.contained.subject.reference            | Patient/11016V630869                                                   |
      | content.contained.collection.collectedDateTime | 2005-03-17T03:36:00                                             |
      | content.text.status                            | generated                                                       |
      | content.name.text                    		   | SODIUM                                                          |
      #With release S65 VUID doesn't exist
	#| content.name.coding.code                       | urn:va:vuid:4671867                                             |
      #| content.name.coding.display                    | SODIUM                                                          |
      #| content.name.coding.system                     | urn:oid:2.16.840.1.113883.6.233                                 |
      #With release S65 LOINC was replaced by IEN because the typecode changed to an IEN
      #| content.name.coding.code                       | urn:lnc:2947-0                                                  |
      | content.name.coding.code                       | urn:va:ien:60:176:72                                                  |
      | content.name.coding.display                    | SODIUM                                                          |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
      | content.status                                 | final                                                           |
	  | content.issued                                 | 2005-03-17T03:36:00                                             |
	  | content.subject.reference                      | Patient/11016V630869                                                   |
	  | content.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
      | content.performer.reference                    | IS_SET                                                          |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                                 |
      | content.identifier.value                       | urn:va:lab:C877:227:CH;6949681.966383;5						 |
      | content.serviceCategory.coding.code            | CH                                                              |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
      | content.serviceCategory.coding.display         | Chemistry                                                       |
      | content.serviceCategory.text                   | Chemistry                                                       |
	  | content.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
      | content.specimen.reference                     | IS_SET                                                          |
      | content.specimen.display               		   | SERUM                                   						 |
      | content.result.reference                       | IS_SET                                                          |
      | content.result.display                         | SODIUM                                                          |
      
    And the results contain lab "(Chem/Hem)" results 
	  | field                         | values                                             |
      | content.subject.reference     | Patient/11016V630869                               |
      | content.contained.type.text   | PLASMA                                             |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#groupName  |
      | content.extension.valueString | COAG 0317 119                                      |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#groupUid   |
      | content.extension.valueString | urn:va:accession:C877:227:CH;6949681.966382        |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#labOrderId |
      | content.extension.valueString | 2790                                               |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#localId    |
      | content.extension.valueString | CH;6949681.966382;430                              |
      | content.extension.url         | http://vistacore.us/fhir/extensions/lab#orderUid   |
      | content.extension.valueString | urn:va:order:C877:227:16688                        |
      
    And the lab field(s) just contain "Patient/11016V630869"
      | field                         		|
	  | content.subject.reference     		| 
      | content.contained.subject.reference	| 
      
@f93_4_labs_ch_fhir @fhir
Scenario: Client can request lab (Chem/Hem) results in FHIR format
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      Given a patient with pid "9E7A;100184" has been synced through Admin API
	When the client requests lab "(Chem/Hem)" results for that patient "9E7A;100184"
	Then a successful response is returned
	Then the client receives 7 FHIR "VistA" result(s)
	And the client receives 7 FHIR "panorama" result(s)
	And the results contain lab "(Chem/Hem)" results                                                      
     	| field                                 		| value         									|
     	| content.contained.subject.reference           | Patient/9E7A;100184	                        	|
     	| content.extension.url							| http://vistacore.us/fhir/extensions/lab#groupName	|
     	| content.extension.valueString					| CH 0429 152										|
       	| content.contained.identifier.label            | facility-code                               		|
      	| content.contained.identifier.value            | 500						 						|
 #     	| content.contained.collection.collectedTime	| 2003-04-29:16:15									|
      	| content.contained.name.coding.display         | GLUCOSE             								|
      	| content.contained.valueQuantity.value			| 321												|
      	| content.contained.specimen.display            | SERUM                                             |
      	| content.contained.referenceRange.high.value   | 123                                              	|
      	| content.contained.referenceRange.high.units   | mg/dL                                            	|
      	| content.contained.referenceRange.low.value    | 60                                              	|
      	| content.contained.referenceRange.low.units    | mg/dL                                            	|
		| content.text.div                              | CONTAINS urn:va:accession:9E7A:100184:CH;6969569.838468 	|
		
# following 2 scenarios are checking for another patient for return of labs results.
# only few fields are checked to validate data integrity.

# negative test case
            
@f93_6_labs_ch_neg_fhir
Scenario: Negative scenario.  Client can request lab (Chem/Hem) results in FHIR format
Given a patient with "No lab results" in multiple VistAs
Given a patient with pid "1006184063V088473" has been synced through Admin API
When the client requests lab "(Chem/Hem)" results for that patient "1006184063V088473"
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed

@f93_5_labs_ch_fhir @fhir
Scenario: Client can request lab (Chem/Hem) results in FHIR format
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      Given a patient with pid "C877;737" has been synced through Admin API
	When the client requests lab "(Chem/Hem)" results for that patient "C877;737"
	Then a successful response is returned
	Then the client receives 40 FHIR "VistA" result(s)
	And the client receives 40 FHIR "kodak" result(s)
	And the results contain lab "(Chem/Hem)" results                                                      
     	| field                                 		| value         									|
     	| content.contained.subject.reference           | Patient/C877;737		                        	|
     	| content.extension.url							| http://vistacore.us/fhir/extensions/lab#groupName	|
     	| content.extension.valueString					| COAG 0131 7											|
       	| content.contained.identifier.label            | facility-code                               		|
      	| content.contained.identifier.value            | 500						 						|
 #     	| content.contained.collection.collectedTime	| 2003-04-29:16:15									|
      	| content.contained.name.coding.display         | PROTIME            								|
      	| content.contained.valueQuantity.value			| 15.4												|
      	| content.contained.specimen.display            | PLASMA                                            |
      	| content.contained.referenceRange.high.value   | 15                                              	|
      	| content.contained.referenceRange.high.units   | SEC.                                            	|
      	| content.contained.referenceRange.low.value    | 10                                              	|
      	| content.contained.referenceRange.low.units    | SEC.                                            	|
		| content.text.div                              | CONTAINS urn:va:accession:C877:737                |

       

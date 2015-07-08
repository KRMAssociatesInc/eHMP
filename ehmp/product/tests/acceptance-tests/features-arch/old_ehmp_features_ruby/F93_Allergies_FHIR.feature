@Allergies_FHIR
Feature: F93 Return of Allergies in FHIR format

#This feature item covers return of free text, observed, and historical allergies in FHIR format.

	
@US949_fhir_freetext
Scenario: Client can request free text allergies in FHIR format
	Given a patient with "allergies" in multiple VistAs
      Given a patient with pid "9E7A;1" has been synced through Admin API
	When the client requests allergies for the patient "9E7A;1" in FHIR format
	Then a successful response is returned
	And the client receives 8 FHIR VistA result(s)
    And the FHIR results contain                                                       
      | allergies_field_list | allergies_values                                   |
      | title                | AdverseReaction with subject.identifier '9E7A;1' |
    And the FHIR results contain allergy                                               
      | allergies_field_list | panorama_allergies_values         |
      | content.text.div     | <div>DOG HAIR ( FREE TEXT )</div> |
      | content.text.status  | generated                         |



@US949_fhir_observed
Scenario: Client can request observed allergies in FHIR format
	Given a patient with "allergies" in multiple VistAs
      Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests allergies for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	And the FHIR results contain
      | allergies_field_list | allergies_values                                                          |
      | title                | AdverseReaction with subject.identifier '5000000341V359724'                   |
	And the FHIR results contain allergy
      | allergies_field_list                | panorama_allergies_values       |
      | content.contained.type.text         | ERYTHROMYCIN                    |
      | content.date                        | 2013-12-19                      |
      | content.symptom.severity            | moderate                        |
      | content.symptom.code.text           | ANOREXIA                        |
      | content.symptom.code.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.symptom.code.coding.code    | urn:va:vuid:4637051             |
      | content.symptom.code.coding.display | ANOREXIA                        |
      
@US949_fhir_historical
Scenario: Client can request historical allergies in FHIR format
	Given a patient with "allergies" in multiple VistAs
      Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the client requests allergies for the patient "5000000217V519385" in FHIR format
	Then a successful response is returned
	And the client receives 3 FHIR VistA result(s)
	And the FHIR results contain
      | allergies_field_list | allergies_values                                                                 |
      | resourceType         | Bundle                                                                           |
      | title                | AdverseReaction with subject.identifier '5000000217V519385'                      |
      | id                   | IS_SET                                                                           |
      | link.rel             | self                                                                             |
      | link.href            | CONTAINS /fhir/AdverseReaction?subject.identifier=5000000217V519385&_format=json |
      | updated              | IS_FORMATTED_DATE                                                                |
      | author.name          | eHMP                                                                             |
	And the FHIR results contain allergy
      | allergies_field_list                  | panorama_allergies_values                                                   |
      | content.text.div                      | <div>CHOCOLATE</div>                                                        |
      | content.text.status                   | generated                                                                   |
      | content.extension.url                 | http://vistacore.us/fhir/profiles/@main#entered-datetime                    |
      | content.extension.valueDateTime       | 2014-01-07T17:06:00                                                         |
      #contained[substance.x]
      | content.contained._id                 | IS_SET                                                                      |
      | content.contained.text.status         | generated                                                                   |
      | content.contained.text.div            | <div>CHOCOLATE</div>                                                        |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233                                             |
      | content.contained.type.coding.code    | urn:va:vuid:4636681                                                         |
      | content.contained.type.coding.display | CHOCOLATE                                                                   |
      | content.contained.type.text           | CHOCOLATE                                                                   |
      | content.identifier.use                | official                                                                    |
      | content.identifier.system             | urn:oid:2.16.840.1.113883.6.233                                             |
      | content.identifier.value              | urn:va:allergy:9E7A:100716:973                                              |
      | content.subject.reference             | Patient/100716                                                              |
      | content.didNotOccurFlag               | false                                                                       |
      | content.exposure.substance.reference  | IS_SET                                                                      |
      | content.extension.url      			  | http://vistacore.us/fhir/profiles/@main#reaction-nature 					|
      | content.extension.valueString         | allergy                                                                     |
      # contained[practitioner]
      | content.contained._id                 | IS_SET                                                                      |
      | content.contained.name.text           | DOCWITH,POWER                                                                  |
      | content.recorder.reference			  | IS_SET									    								|
	# in json, but not defined on wiki
      | content.contained.resourceType        | Substance                                                                   |
      | author.name                           | eHMP                                                                        |
      | author.uri                            | https://ehmp.vistacore.us                                                   |
      | content.resourceType                  | AdverseReaction                                                             |
      | updated                               | IS_FORMATTED_DATE                                                           |
      | published                             | IS_FORMATTED_DATE                                                           |
      | link.rel                              | self                                                                        |
      | title                                 | adversereaction for patient [5000000217V519385]                             |
     And expected fields match
      | field1                               | field2                |
      | content.exposure.substance.reference | content.contained._id |
      | content.recorder.reference           | content.contained._id |

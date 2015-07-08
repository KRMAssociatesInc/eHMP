@AllergiesDoD
Feature: F107 Return of DoD Allergies

#This feature item returns DoD Allergies in VPR and FHIR formats.


@AllergiesDoD_FHIR @single
Scenario: Client can request DoD allergies in FHIR format
	Given a patient with "allergies" in multiple VistAs and in DoD
  Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the client requests allergies for the patient "5000000217V519385" in FHIR format
	Then a successful response is returned
	And the client receives 4 FHIR DoD result(s)
	And the FHIR results contain allergy
      | allergies_field_list                  | dod_allergies_values                                                   |
      | content.text.div                      | <div>PEANUT BUTTER FLAVOR (FLAVORING AGENT)</div>                                                        |
      | content.text.status                   | generated                                                                   |
      #contained[substance.x]
      | content.contained._id                 | IS_SET                                                                      |
      | content.contained.text.status         | generated                                                                   |
      | content.contained.text.div            | <div>PEANUT BUTTER FLAVOR (FLAVORING AGENT)</div>                                                       |
      | content.contained.type.coding.system  | DOD_ALLERGY_IEN                                             |
      | content.contained.type.coding.code    | 14665636                                                         |
      #| content.contained.type.coding.display | PEANUT BUTTER FLAVOR (FLAVORING AGENT)                                                                   |
      | content.contained.type.text           | PEANUT BUTTER FLAVOR (FLAVORING AGENT)                                                                   |
      | content.identifier.use                | official                                                                    |
      | content.identifier.system             | urn:oid:2.16.840.1.113883.6.233                                             |
      | content.identifier.value              | urn:va:allergy:DOD:0000000001:1000000002                                              |
      | content.subject.reference             | Patient/0000000001                                                              |
      | content.didNotOccurFlag               | false                                                                       |
      | content.exposure.substance.reference  | IS_SET                                                                      |

  @AllergiesDoD_jds @US980 @single
  Scenario: Allergy data is transformed correctly from multiple VistAs and in DoD to JDS
    Given a patient with "allergies" in multiple VistAs and in DoD
    Given a patient with pid "5000000217V519385" has been synced through Admin API
    When the client requests allergies for the patient "5000000217V519385" in VPR format
    Then the VPR results contain
      | field             | panorama_value                 |
      | summary           | CHOCOLATE                      |
      | uid               | urn:va:allergy:9E7A:100716:972 |
      | pid               | CONTAINS ;100716               |
      | facilityCode      | 500                            |
      | facilityName      | CAMP MASTER                    |
      | localId           | 972                            |
      | entered           | 201401071706                   |
      #| verified          | 20140516154757                 |
      | historical        | true                           |
      | kind              | Allergy/Adverse Reaction       |
      | reference         | 3;GMRD(120.82,                 |
      | products.summary  | AllergyProduct{uid='null'}     |
      | products.name     | CHOCOLATE                      |
      | products.vuid     | urn:va:vuid:4636681            |
      | reactions.summary | AllergyReaction{uid='null'}    |
      | reactions.name    | ANXIETY                        |
      | reactions.vuid    | urn:va:vuid:4637050            |
      | originatorName    | LORD,BRIAN                     |
      | verifierName      | <auto-verified>                |
      | mechanism         | ALLERGY                        |
      | typeName          | DRUG, FOOD                     |
    And the VPR results contain
      | field             | panorama_value                          |
      | summary           | PEANUT BUTTER FLAVOR (FLAVORING AGENT)  |
      | uid               | urn:va:allergy:DOD:0000000001:1000000002|
      | pid               | CONTAINS ;100716                        |
      | facilityCode      | DOD                                     |
      | facilityName      | DOD                                     |
      | kind              | Allergy/Adverse Reaction                |
      | products.summary  | AllergyProduct{uid='null'}              |
      | products.name     | PEANUT BUTTER FLAVOR (FLAVORING AGENT)  |
      | comments.summary  | AllergyComment{uid='null'}              |
      | comments.comment  | Nausea                                  |
      | codes.code        | 14665636                                |
      | codes.system      | DOD_ALLERGY_IEN                         |
    And the VPR results contain
      | field             | panorama_value                                |
      | summary           | NUT TX IMP.DIG.FXN,SOY LACFREE {Ingredient}   |
      | uid               | urn:va:allergy:DOD:0000000001:1000000001      |
      | pid               | CONTAINS ;100716                              |
      | facilityCode      | DOD                                           |
      | facilityName      | DOD                                           |
      | kind              | Allergy/Adverse Reaction                      |
      | products.summary  | AllergyProduct{uid='null'}                    |
      | products.name     | NUT TX IMP.DIG.FXN,SOY LACFREE {Ingredient}   |
      | comments.summary  | AllergyComment{uid='null'}                    |
      | comments.comment  | Skin irritation\nSkin Lesion                  |
      | codes.code        | 33608000                                      |
      | codes.system      | DOD_ALLERGY_IEN                               |
    And the VPR results contain
      | field             | panorama_value                          |
      | summary           | Iodine Containing Agents                |
      | uid               | urn:va:allergy:DOD:0000000001:1000000003|
      | pid               | CONTAINS ;100716                        |
      | facilityCode      | DOD                                     |
      | facilityName      | DOD                                     |
      | kind              | Allergy/Adverse Reaction                |
      | products.summary  | AllergyProduct{uid='null'}              |
      | products.name     | Iodine Containing Agents                |
      | comments.summary  | AllergyComment{uid='null'}              |
      | comments.comment  | Rash                                    |
      | codes.code        | 29000                                   |
      | codes.system      | DOD_ALLERGY_IEN                         |
    And the VPR results contain
      | field             | panorama_value                                |
      | summary           | Aspirin                                       |
      | uid               | urn:va:allergy:DOD:0000000001:1000000004      |
      | pid               | CONTAINS ;100716                              |
      | facilityCode      | DOD                                           |
      | facilityName      | DOD                                           |
      | kind              | Allergy/Adverse Reaction                      |
      | products.summary  | AllergyProduct{uid='null'}                    |
      | products.name     | Aspirin                                       |
      | comments.summary  | AllergyComment{uid='null'}                    |
      | comments.comment  | Cough after exercise\nCough\nCough at rest    |
      | codes.code        | 3008                                          |
      | codes.system      | DOD_ALLERGY_IEN                               |
  #And the results contain allergy results
  #   | field             | kodak_value                 |
  #   | summary           | PENICILLIN                  |
  #   | uid               | ???                         |
  #   | pid               | 5000000217                  |
  #   | facilityCode      | 500                         |
  #   | facilityName      | CAMP MASTER                 |
  #   | localId           | ???                         |
  #   | entered           | 201312051608                |
  #   | verified          | ???                         |
  #   | historical        | FALSE                       |
  #   | kind              | Allergy/Adverse Reaction    |
  #   | reference         | 3;GMRD(120.82,              |
  #   | products.summary  | AllergyProduct{uid='null'}  |
  #   | products.name     | PENICILLIN                  |
  #   | products.vuid     | urn:va:vuid:4636681         |
  #   | reactions.summary | AllergyReaction{uid='null'} |
  #   | reactions.name    | ANXIETY                     |
  #   | reactions.vuid    | urn:va:vuid:4637050         |
  #   | reactions.summary | AllergyReaction{uid='null'} |
  #   | reactions.name    | DRY MOUTH                   |
  #   | reactions.vuid    | ???                         |
  #   | originatorName    | LORD,BRIAN                  |
  #   | verifierName      | NO                          |
  #   | mechanism         | ALLERGY                     |
  #   | typeName          | DRUG, FOOD                  |

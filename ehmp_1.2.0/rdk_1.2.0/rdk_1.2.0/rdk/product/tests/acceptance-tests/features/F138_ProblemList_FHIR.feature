@F138_ProblemList_FHIR @vxsync @patient
Feature: F138 - Return of Problem List in FHIR format

#This feature item returns a problem list in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 10107V395912, 5000000116V912836, 10104V248233, 5000000009V082878

@F138_1_fhir_problemlist @fhir @10107V395912
Scenario: Client can request problem list results in FHIR format
  Given a patient with "problem list" in multiple VistAs
      And a patient with pid "10107V395912" has been synced through the RDK API
	When the client requests problem list for the patient "10107V395912" in FHIR format
  Then a successful response is returned
  And the results contain
      | name         | value     |
      | totalResults | 11       |
	And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:9E7A         |
      | content.status					 | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | content.subject.reference                | 9E7A;253                             |
      | content.text                             | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | content.code.coding.code                 | urn:icd:250.00                       |
      | content.code.coding.display              | DIABETES MELLI W/O COMP TYP II       |
      | content.asserter.display                 | VEHU,SEVEN                           |
      | content.dateAsserted                     | 2000-05-08                           |
      | content.onsetDate                        | 2000-04-04                           |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient 9E7A;253</div> |
      | content.contained.location.resourceType      | Location                                   |
      | content.contained.location.identifier.value  | 500                                        |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233            |
      | content.contained.location.Name              | CAMP MASTER                                |
      | content.contained.location._id               | urn:va:location:9E7A:32                    |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.value      | urn:va:user:9E7A:20008                          |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | VEHU,SEVEN                                      |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 2004-03-31                                                       |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
      | content.extension.valueString           | urn:sct:55561003                                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | ACTIVE                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |
      | content.provider.reference 			| #urn:va:location:9E7A:32                                         |
  And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:9E7A         |
      | content.status                           | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | Chronic Systolic Heart failure (ICD-9-CM 428.22) |
      | content.subject.reference                | 9E7A;253                             |
      | content.text                             | Chronic Systolic Heart failure (ICD-9-CM 428.22) |
      | content.code.coding.code                 | urn:icd:428.22                       |
      | content.code.coding.display              | CHRONIC SYSTOLIC HEART FAILURE       |
      | content.asserter.display                 | LABTECH,SPECIAL                      |
      | content.dateAsserted                     | 2004-03-09                           |
      | content.onsetDate                        | 2004-03-09                           |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient 9E7A;253</div> |
      | content.contained.location.resourceType      | Location                                   |
      | content.contained.location.identifier.value  | 500                                        |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233            |
      | content.contained.location.Name              | CAMP MASTER                                |
      | content.contained.location._id               | urn:va:location:9E7A:23                    |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.value      | urn:va:user:9E7A:11745                          |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | LABTECH,SPECIAL                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 2004-03-09                                                       |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
      | content.extension.valueString           | urn:sct:55561003                                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | ACTIVE                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |
      | content.provider.reference              | #urn:va:location:9E7A:23                                         |

@F138_2_fhir_problemlist @fhir @5000000116V912836
Scenario: Client can request problem list results in FHIR format
	Given a patient with "problem list" in multiple VistAs
      And a patient with pid "5000000116V912836" has been synced through the RDK API
  When the client requests problem list for the patient "5000000116V912836" in FHIR format
  Then a successful response is returned
  And the results contain
      | name         | value     |
      | totalResults | 14        |
  And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:ABCD:17:58   |
      | content.status                           | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.subject.reference                | HDR;5000000116V912836                        |
      | content.text                             | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.code.coding.code                 | urn:icd:411.1                        |
      | content.code.coding.display              | INTERMED CORONARY SYND               |
      | content.asserter.display                 | PROGRAMMER,TWENTY                    |
      | content.dateAsserted                     | 1996-05-14                           |
      | content.onsetDate                        | 1996-03-15                           |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient HDR;5000000116V912836</div> |
      | content.contained.location.resourceType      | Location                                      |
      | content.contained.location.identifier.value  | 561                                           |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233               |
      | content.contained.location.Name              | New Jersey HCS                                      |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.value      | urn:va:user:ABCD:755                            |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | PROGRAMMER,TWENTY                               |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#service            |
      | content.extension.valueString           | MEDICINE                                                         |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 1996-05-14                                                       |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
      | content.extension.valueString           | urn:sct:55561003                                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | ACTIVE                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#comments           |
      | content.extension.valueString           | <div><ul><li>comment:SHERIDAN PROBLEM</li><li>entered:19960514</li><li>enteredByCode:urn:va:user:ABCD:755</li><li>enteredByName:PROGRAMMER,TWENTY</li><li>summary:ProblemComment{uid=''}</li></ul></div>|
  And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:DOD:         |
      | content.resourceType                     | Condition                            |
      | content.status                           | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | redness under eyelid                 |
      | content.subject.reference                | DOD;0000000002                          |
      | content.text                             | redness under eyelid                 |
      | content.asserter.display                 | BHIE, USERONE                        |
      | content.dateAsserted                     | 2013-11-19T17:26:53                  |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient DOD;0000000002</div> |
      | content.contained.location.resourceType      | Location                                      |
      | content.contained.location.identifier.value  | DOD                                           |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233               |
      | content.contained.location.Name              | DOD                                           |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | BHIE, USERONE                                   |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 2013-11-19T17:26:53                                              |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |

@F138_3_fhir_problemlist @fhir @10104V248233
Scenario: Client can request problem list results in FHIR format
	Given a patient with "problem list" in multiple VistAs
      And a patient with pid "10104V248233" has been synced through the RDK API
      When the client requests problem list for the patient "10104V248233" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 17        |
      And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:ABCD         |
      | content.resourceType                     | Condition                            |
      | content.status                           | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.subject.reference                | HDR;10104V248233                    |
      | content.text                             | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.code.coding.code                 | urn:icd:411.1                        |
      | content.code.coding.display              | INTERMED CORONARY SYND               |
      | content.asserter.display                 | PROGRAMMER,TWENTY                    |
      | content.dateAsserted                     | 1996-05-14                           |
      | content.onsetDate                        | 1996-03-15                           |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient HDR;10104V248233</div> |
      | content.contained.location.resourceType      | Location                                   |
      | content.contained.location.identifier.value  | 561                                        |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233            |
      | content.contained.location.Name              | New Jersey HCS                                   |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.value      | urn:va:user:ABCD:755                            |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | PROGRAMMER,TWENTY                               |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 1996-05-14                                                       |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
      | content.extension.valueString           | urn:sct:55561003                                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | ACTIVE                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |

@F138_4_fhir_problemlist @fhir @5000000009V082878
Scenario: Client can request problem list results in FHIR format
	Given a patient with "problem list" in multiple VistAs
      And a patient with pid "5000000009V082878" has been synced through the RDK API
  When the client requests problem list for the patient "5000000009V082878" in FHIR format
  Then a successful response is returned
  And the results contain
      | name         | value     |
      | totalResults | 1         |
  And the FHIR results contain "problems"
      | name                                     | value                                |
      | content._id                              | CONTAINS urn:va:problem:ABCD         |
      | content.resourceType                     | Condition                            |
      | content.status                           | confirmed                            |
      | content.category.coding.code             | diagnosis                            |
      | content.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
      | content.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.subject.reference                | HDR;5000000009V082878                          |
      | content.text                             | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | content.code.coding.code                 | urn:icd:411.1                        |
      | content.code.coding.display              | INTERMED CORONARY SYND               |
      | content.code.coding.code                 | 25106000                             |
      | content.code.coding.system               | http://snomed.info/sct               |
      | content.code.coding.display              | Impending infarction (disorder)      |
      | content.asserter.display                 | PROGRAMMER,TWENTY                    |
      | content.dateAsserted                     | 1996-05-14                           |
      | content.onsetDate                        | 1996-03-15                           |
      | content.contained.resourceType               | Encounter                        |
      | content.contained.text.status                | generated                        |
      | content.contained.text.div                   | <div>Encounter with patient HDR;5000000009V082878</div> |
      | content.contained.location.resourceType      | Location                                   |
      | content.contained.location.identifier.value  | 561                                        |
      | content.contained.location.identifier.system | urn:oid:2.16.840.1.113883.6.233            |
      | content.contained.location.Name              | New Jersey HCS                                   |
      | content.contained.resourceType          | Practitioner                                    |
      | content.contained.identifier.value      | urn:va:user:ABCD:755                            |
      | content.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
      | content.contained.name                  | PROGRAMMER,TWENTY                               |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#service            |
      | content.extension.valueString           | MEDICINE                                                         |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
      | content.extension.valueDateTime         | 1996-05-14                                                       |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
      | content.extension.valueString           | urn:sct:55561003                                                 |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
      | content.extension.valueString           | ACTIVE                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
      | content.extension.valueString           | Active                                                           |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
      | content.extension.valueBoolean          | false                                                            |
      | content.extension.url                   | http://vistacore.us/fhir/extensions/condition#comments           |
      | content.extension.valueString           | <div><ul><li>comment:SHERIDAN PROBLEM</li><li>entered:19960514</li><li>enteredByCode:urn:va:user:ABCD:755</li><li>enteredByName:PROGRAMMER,TWENTY</li><li>summary:ProblemComment{uid=''}</li></ul></div> |

@F138_5_fhir_problemlist @fhir @9E7A167
Scenario: Client can break the glass when requesting problem list in FHIR format for a sensitive patient
	Given a patient with "problem list" in multiple VistAs
      And a patient with pid "9E7A;167" has been synced through the RDK API
    When the client requests problem list for that sensitive patient "9E7A;167"
    Then a permanent redirect response is returned
    When the client requests orders for that sensitive patient "9E7A;167"
    Then a permanent redirect response is returned
    When the client breaks glass and repeats a request for orders for that patient "9E7A;167"
    Then a successful response is returned
    And the results contain
      | name                          | value                                    |
      | resourceType                  | Bundle                                   |
      | title                         | Order with subject.identifier '9E7A;167' |
      | totalResults                  | 3                                        |

@F138_6_fhir_problemlist @fhir @9E7A230
Scenario: Negativ scenario. Client can request problem list results in FHIR format
    Given a patient with "no problem list" in multiple VistAs
    When the client requests orders for the patient "9E7A;230" in FHIR format
    Then a successful response is returned
    And the results contain
      | name          | value   |
      | totalResults  | 0       |

@F138_7_fhir_problemlist @fhir @5000000116V912836 @DE974
Scenario: Client can request problem list results in FHIR format
  Given a patient with "problem list" in multiple VistAs
  And a patient with pid "5000000116V912836" has been synced through the RDK API
  When the client requests "10" problem list for the patient "5000000116V912836" in FHIR format
  Then a successful response is returned
  And the results contain
      | name         | value     |
      | totalResults | 10        |

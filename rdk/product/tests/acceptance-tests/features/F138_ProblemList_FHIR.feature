 @F138_ProblemList_FHIR @vxsync @patient
 Feature: F138 - Return of Problem List in FHIR format

 #This feature item returns a problem list in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
 #Patients used: 10107V395912, 5000000116V912836, 10104V248233, 5000000009V082878

 @F138_1_fhir_problemlist @fhir @10107V395912
 Scenario: Client can request problem list results in FHIR format
   Given a patient with "problem list" in multiple VistAs
      # And a patient with pid "10107V395912" has been synced through the RDK API
 	When the client requests problem list for the patient "10107V395912" in FHIR format
   Then a successful response is returned
   And the results contain
       | name         | value     |
       | total        | 11       |
 	And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.clinicalStatus					 | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
       | resource.patient.reference                | 9E7A;253                             |
       | resource.code.coding.code                 | urn:icd:250.00                       |
       | resource.code.coding.display              | DIABETES MELLI W/O COMP TYP II       |
       | resource.asserter.display                 | VEHU,SEVEN                           |
       | resource.dateAsserted                     | 2000-05-08                           |
       | resource.onsetDateTime                        | 2000-04-04                           |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient 9E7A;253</div> |
       | resource.contained.location.resourceType      | Location                                   |
       | resource.contained.location._id               | urn:va:location:9E7A:32                    |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.identifier.value      | urn:va:user:9E7A:20008                          |
       | resource.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.contained.name                  | VEHU,SEVEN                                      |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 2004-03-31                                                       |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
       | resource.extension.valueString           | urn:sct:55561003                                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | ACTIVE                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |
     And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.clinicalStatus                           | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | Chronic Systolic Heart failure (ICD-9-CM 428.22) |
       | resource.patient.reference                | 9E7A;253                             |
       | resource.code.coding.code                 | urn:icd:428.22                       |
       | resource.code.coding.display              | CHRONIC SYSTOLIC HEART FAILURE       |
       | resource.asserter.display                 | LABTECH,SPECIAL                      |
       | resource.dateAsserted                     | 2004-03-09                           |
       | resource.onsetDateTime                        | 2004-03-09                           |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient 9E7A;253</div> |
       | resource.contained.location.resourceType      | Location                                   |
       | resource.contained.location._id               | urn:va:location:9E7A:23                    |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.name                  | LABTECH,SPECIAL                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 2004-03-09                                                       |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
       | resource.extension.valueString           | urn:sct:55561003                                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | ACTIVE                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |

 @F138_2_fhir_problemlist @fhir @5000000116V912836
 Scenario: Client can request problem list results in FHIR format
 	Given a patient with "problem list" in multiple VistAs
    #   And a patient with pid "5000000116V912836" has been synced through the RDK API
   When the client requests problem list for the patient "5000000116V912836" in FHIR format
   Then a successful response is returned
   And the results contain
       | name         | value     |
       | total        | 14        |
   And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.clinicalStatus                           | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
       | resource.patient.reference                | HDR;5000000116V912836                        |
       | resource.code.coding.code                 | urn:icd:411.1                        |
       | resource.code.coding.display              | INTERMED CORONARY SYND               |
       | resource.asserter.display                 | PROGRAMMER,TWENTY                    |
       | resource.dateAsserted                     | 1996-05-14                           |
       | resource.onsetDateTime                        | 1996-03-15                           |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient HDR;5000000116V912836</div> |
       | resource.contained.location.resourceType      | Location                                      |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.identifier.value      | urn:va:user:ABCD:755                            |
       | resource.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.contained.name                  | PROGRAMMER,TWENTY                               |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#service            |
       | resource.extension.valueString           | MEDICINE                                                         |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 1996-05-14                                                       |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
       | resource.extension.valueString           | urn:sct:55561003                                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | ACTIVE                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#comments           |
       | resource.extension.valueString           | <div><ul><li>comment:SHERIDAN PROBLEM</li><li>entered:19960514</li><li>enteredByCode:urn:va:user:ABCD:755</li><li>enteredByName:PROGRAMMER,TWENTY</li><li>summary:ProblemComment{uid=''}</li></ul></div>|
   And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.resourceType                     | Condition                            |
       | resource.clinicalStatus                           | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | redness under eyelid                 |
       | resource.patient.reference                | DOD;0000000002                          |
       | resource.asserter.display                 | BHIE, USERONE                        |
       | resource.dateAsserted                     | 2013-11-19T17:26:53                  |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient DOD;0000000002</div> |
       | resource.contained.location.resourceType      | Location                                      |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.contained.name                  | BHIE, USERONE                                   |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 2013-11-19T17:26:53                                              |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |

 @F138_3_fhir_problemlist @fhir @10104V248233
 Scenario: Client can request problem list results in FHIR format
 	Given a patient with "problem list" in multiple VistAs
     #  And a patient with pid "10104V248233" has been synced through the RDK API
       When the client requests problem list for the patient "10104V248233" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 17        |
       And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.resourceType                     | Condition                            |
       | resource.clinicalStatus                           | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
       | resource.patient.reference                | HDR;10104V248233                    |
       | resource.code.coding.code                 | urn:icd:411.1                        |
       | resource.code.coding.display              | INTERMED CORONARY SYND               |
       | resource.asserter.display                 | PROGRAMMER,TWENTY                    |
       | resource.dateAsserted                     | 1996-05-14                           |
       | resource.onsetDateTime                        | 1996-03-15                           |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient HDR;10104V248233</div> |
       | resource.contained.location.resourceType      | Location                                   |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.identifier.value      | urn:va:user:ABCD:755                            |
       | resource.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.contained.name                  | PROGRAMMER,TWENTY                               |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 1996-05-14                                                       |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
       | resource.extension.valueString           | urn:sct:55561003                                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | ACTIVE                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |

 @F138_4_fhir_problemlist @fhir @5000000009V082878
 Scenario: Client can request problem list results in FHIR format
 	Given a patient with "problem list" in multiple VistAs
       #And a patient with pid "5000000009V082878" has been synced through the RDK API
   When the client requests problem list for the patient "5000000009V082878" in FHIR format
   Then a successful response is returned
   And the results contain
       | name         | value     |
       | total        | 1         |
   And the FHIR results contain "problems"
       | name                                     | value                                |
       | resource.resourceType                     | Condition                            |
       | resource.clinicalStatus                           | confirmed                            |
       | resource.category.coding.code             | diagnosis                            |
       | resource.category.coding.system           | 2.16.840.1.113883.4.642.2.224        |
       | resource.stage.summary                    | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
       | resource.patient.reference                | HDR;5000000009V082878                          |
       | resource.code.coding.code                 | urn:icd:411.1                        |
       | resource.code.coding.display              | INTERMED CORONARY SYND               |
       | resource.code.coding.code                 | 25106000                             |
       | resource.code.coding.system               | http://snomed.info/sct               |
       | resource.code.coding.display              | Impending infarction (disorder)      |
       | resource.asserter.display                 | PROGRAMMER,TWENTY                    |
       | resource.dateAsserted                     | 1996-05-14                           |
       | resource.onsetDateTime                        | 1996-03-15                           |
       | resource.contained.resourceType               | Encounter                        |
       | resource.contained.text.status                | generated                        |
       | resource.contained.text.div                   | <div>Encounter with patient HDR;5000000009V082878</div> |
       | resource.contained.location.resourceType      | Location                                   |
       | resource.contained.resourceType          | Practitioner                                    |
       | resource.contained.identifier.value      | urn:va:user:ABCD:755                            |
       | resource.contained.identifier.system     | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.contained.name                  | PROGRAMMER,TWENTY                               |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#service            |
       | resource.extension.valueString           | MEDICINE                                                         |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#updated            |
       | resource.extension.valueDateTime         | 1996-05-14                                                       |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusCode         |
       | resource.extension.valueString           | urn:sct:55561003                                                 |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusName         |
       | resource.extension.valueString           | ACTIVE                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#statusDisplayName  |
       | resource.extension.valueString           | Active                                                           |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#serviceConnected   |
       | resource.extension.valueBoolean          | false                                                            |
       | resource.extension.url                   | http://vistacore.us/fhir/extensions/condition#comments           |
       | resource.extension.valueString           | <div><ul><li>comment:SHERIDAN PROBLEM</li><li>entered:19960514</li><li>enteredByCode:urn:va:user:ABCD:755</li><li>enteredByName:PROGRAMMER,TWENTY</li><li>summary:ProblemComment{uid=''}</li></ul></div> |

# Commeting below test scenario: Not a valid test for problem list
# @F138_5_fhir_problemlist @fhir @9E7A167
# Scenario: Client can break the glass when requesting problem list in FHIR format for a sensitive patient
# 	Given a patient with "problem list" in multiple VistAs
#      # And a patient with pid "9E7A;167" has been synced through the RDK API
#     When the client requests problem list for that sensitive patient "9E7A;167"
#     Then a permanent redirect response is returned
#     When the client requests orders for that sensitive patient "9E7A;167"
#     Then a permanent redirect response is returned
#     When the client breaks glass and repeats a request for orders for that patient "9E7A;167"
#     Then a successful response is returned
#     And the results contain
#       | name                          | value                                    |
#       | resourceType                  | Bundle                                   |
#       | title                         | Order with subject.identifier '9E7A;167' |
#       | total                         | 3                                        |

 @F138_6_fhir_problemlist @fhir @9E7A230
 Scenario: Negativ scenario. Client can request problem list results in FHIR format
     Given a patient with "no problem list" in multiple VistAs
     When the client requests problem list for the patient "9E7A;230" in FHIR format
     Then a successful response is returned
     And the results contain
       | name          | value   |
       | total         | 0       |

 @F138_7_fhir_problemlist @fhir @5000000116V912836 @DE974
 Scenario: Client can request problem list results in FHIR format
   Given a patient with "problem list" in multiple VistAs
   #And a patient with pid "5000000116V912836" has been synced through the RDK API
   When the client requests "10" problem list for the patient "5000000116V912836" in FHIR format
   Then a successful response is returned
   And total returned resources are "10"
   And the results contain
       | name         | value     |
       | total        | 14        |

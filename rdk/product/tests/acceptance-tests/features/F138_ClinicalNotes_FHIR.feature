@F138_fhir_clinicalnote @vxsync @patient
Feature: F138 - Return of clinical notes in FHIR format

#This feature item returns clinical notes in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 5000000116V912836, 5000000217V519385, 10107V395912

@F138_1_fhir_clinicalnote @fhir @10107V395912 @US8574
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      #And a patient with pid "10107V395912" has been synced through the RDK API
      When the client requests clinical notes for the patient "10107V395912" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | total | 123   |
      And the FHIR results contain "clinical notes"
      | name                            | value                                     |
      | resource.resourceType            | Composition                               |
      | resource.title                   | ADVANCE DIRECTIVE COMPLETED    |
      | resource.status                  | final                                 |
      | resource.subject.reference       | Patient/10107V395912                      |
      | resource.identifier.value        | urn:va:document:9E7A:253:3852             |
      | resource.date                    | 2007-05-16T09:47:00                       |
      | resource.type.coding.system      | urn:oid:2.16.840.1.113883.6.233                         |
      | resource.type.coding.code        | D                                   |
      | resource.type.text               | Advance Directive                         |
      | resource.class.text              | PROGRESS NOTES                            |
      | resource.title                   | ADVANCE DIRECTIVE COMPLETED               |
      | resource.confidentiality         | N                                         |
      | resource.author.reference          | Provider/urn:va:user:9E7A:10000000049                         |
      | resource.attester.party.reference  | Provider/urn:va:user:9E7A:10000000049                        |
      | resource.attester.time           | 2007-05-16T09:45:54                       |
      | resource.attester.mode           | professional                              |
      | resource.encounter.display       | 20 MINUTE May 16, 2007                    |
      | resource.encounter.reference     | Encounter/urn:va:visit:9E7A:253:5669                       |
      | resource.section.code.coding.code       | urn:va:document:9E7A:253:3852                                      |
      #Organization
      | resource.contained.resourceType     | Organization           |
      | resource.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233         |
      | resource.contained.identifier.value | 500                    |
      | resource.contained.name             | CAMP MASTER           |
      | resource.contained.text.status      | generated              |
      #Extensions
      | resource.extension.url           | http://vistacore.us/fhir/extensions/composition#author            |
      | resource.extension.valueString   | LABTECH,FIFTYNINE                                        |
      | resource.extension.url           | http://vistacore.us/fhir/extensions/composition#authorDisplayName |
      | resource.extension.valueString   | Labtech,Fiftynine                                                         |
      #List
      | resource.contained.resourceType | List                               |
      | resource.contained.text.status  | generated                                 |
      | resource.contained.status       | current                                     |
      | resource.contained.mode  | working                                        |

@F138_2_fhir_clinicalnote @fhir @5000000116V912836 @DE1367 @US8574
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      #And a patient with pid "5000000116V912836" has been synced through the RDK API
      When the client requests clinical notes for the patient "5000000116V912836" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | total | 12    |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | resource.identifier.system            | urn:oid:2.16.840.1.113883.6.233                                  |
      | resource.identifier.value          | urn:va:document:DOD:0000000002:1000000444 |
      | resource.type.coding.system        | urn:oid:2.16.840.1.113883.6.233                         |
      | resource.type.text                 | Progress Note                             |
      | resource.title                     | Progress Note                             |
      | resource.confidentiality      | N                                         |
      | resource.subject.reference         | Patient/5000000116V912836                    |
      #Organization
      | resource.contained.resourceType     | Organization   |
      | resource.contained.identifier.value | DOD            |
      | resource.contained.name             | DOD            |
      | resource.contained.text.div         | <div>-Placeholder for a DOD Patient Document- Unfortunately this document is corrupted and cannot be displayed.  Please report it so the problem can be rectified.</div> |
      | resource.contained.text.status      | generated      |
      #Observation
      | resource.contained.resourceType | List                             |
      | resource.contained.text.status  | generated                               |
      | resource.contained.text.div     | CONTAINS DOD                            |
      | resource.contained.status       | current                                   |
      | resource.contained.mode  | working                                      |
      #Author
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#documentTypeName  |
      | resource.extension.valueString  | Progress Note                                               |
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#author       |
      | resource.extension.valueString  | BHIE, USERONE                                                       |
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#dodComplexNoteUri |
      | resource.extension.valueString  | CONTAINS 444f443b30303030303030303032/1000000444            |

@F138_3_fhir_clinicalnote @fhir @5000000217V519385 @US8574
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
   #   And a patient with pid "5000000217V519385" has been synced through the RDK API
      When the client requests clinical notes for the patient "5000000217V519385" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | total | 14    |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | resource.resourceType              | Composition                               |
      | resource.status               | final                                 |
      | resource.identifier.system            | urn:oid:2.16.840.1.113883.6.233                                  |
      | resource.identifier.value          | urn:va:document:ABCD:3:3853               |
      | resource.type.coding.system        | urn:oid:2.16.840.1.113883.6.233                          |
      | resource.type.coding.code          | D                                   |
      | resource.type.text                 | Advance Directive                         |
      | resource.class.text                | PROGRESS NOTES                            |
      | resource.title                     | ADVANCE DIRECTIVE COMPLETED               |
      | resource.confidentiality     | N                                         |
      | resource.subject.reference         | Patient/5000000217V519385             |
      | resource.author.reference          | Provider/urn:va:user:ABCD:10000000049 |
      | resource.attester.mode             | professional                              |
      | resource.attester.party.reference  | Provider/urn:va:user:ABCD:10000000049 | 
      | resource.encounter.reference       | CONTAINS Encounter/                       |
      | resource.encounter.display         | 20 MINUTE May 16, 2007                    |
      | resource.section.code.coding.system | urn:oid:2.16.840.1.113883.6.233  |
      | resource.section.code.coding.code | urn:va:document:ABCD:3:3853 |
      #Organization
      | resource.contained.resourceType     | Organization              |
      | resource.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233             |
      | resource.contained.identifier.value | 561                       |
      | resource.contained.name             | New Jersey HCS            |
      #List
      | resource.contained.resourceType | List                               |
      | resource.contained.text.status  | generated                                 |
      | resource.contained.text.div     | CONTAINS VistA Imaging - Scanned Document |
      | resource.contained.status       | current                                     |
      | resource.contained.mode         | working                                        |
      #Extensions
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#documentTypeCode |
      | resource.extension.valueString  | D                                                          |
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#documentTypeName |
      | resource.extension.valueString  | Advance Directive                                          |
      | resource.extension.url          | http://vistacore.us/fhir/extensions/composition#isInterdisciplinary      |
      | resource.extension.valueBoolean | false                                                      |

@F138_4_fhir_clinicalnote @fhir @5123456789V027402 @US8574
Scenario: Client can break the glass when requesting clinical notes in FHIR format for a sensitive patient
      Given a patient with "clinical notes" in multiple VistAs
      #And a patient with pid "5123456789V027402" has been synced through the RDK API
      When the client requests clinical notes for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for clinical notes for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name         | value |
      | total | 7     |

@F138_5_fhir_clinicalnote @fhir @9E7A100184 @US8574
Scenario: Negativ scenario. Client can request clinical notes results in FHIR format
      Given a patient with "no clinical notes" in multiple VistAs
      #And a patient with pid "9E7A;100184" has been synced through the RDK API
      When the client requests clinical notes for the patient "9E7A;100184" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | total | 0     |

@F138_6_fhir_clinicalnote @fhir @10146V393772 @DE974 @US8574
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      #And a patient with pid "10146V393772" has been synced through the RDK API
      When the client requests "10" clinical notes for the patient "10146V393772" in FHIR format
      Then a successful response is returned
      And total returned resources are "10"
      And the results contain
      | name         | value |
      | total | 129    |

@F138_fhir_clinicalnote @vxsync @patient
Feature: F138 - Return of clinical notes in FHIR format

#This feature item returns clinical notes in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 5000000116V912836, 5000000217V519385, 10107V395912

@F138_1_fhir_clinicalnote @fhir @10107V395912
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "10107V395912" has been synced through the RDK API
      When the client requests clinical notes for the patient "10107V395912" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 123   |
      And the FHIR results contain "clinical notes"
      | name                            | value                                     |
      | content.resourceType            | Composition                               |
      | content.text.div                | <div>ADVANCE DIRECTIVE COMPLETED</div>    |
      | content.text.status             | generated                                 |
      | content.subject.reference       | Patient/9E7A;253                          |
      | content.identifier.use          | official                                  |
      | content.identifier.value        | urn:va:document:9E7A:253:3852             |
      | content.date                    | 2007-05-16T09:47:00                       |
      | content.type.coding.system      | http://loinc.org                          |
      | content.type.coding.code        | 34765-8                                   |
      | content.type.coding.display     | General medicine Note                     |
      | content.type.text               | Advance Directive                         |
      | content.class.text              | PROGRESS NOTES                            |
      | content.title                   | ADVANCE DIRECTIVE COMPLETED               |
      | content.status                  | FINAL                                     |
      | content.confidentiality.system  | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code    | N                                         |
      | content.confidentiality.display | normal                                    |
      | content.author.display          | Labtech,Fiftynine                         |
      | content.attester.party.display  | Labtech,Fiftynine                         |
      | content.attester.time           | 2007-05-16T09:45:54                       |
      | content.attester.mode           | professional                              |
      | content.encounter.display       | 20 MINUTE May 16, 2007                    |
      | content.encounter.reference     | CONTAINS Encounter/                       |
      | content.section.code.text       | 3852                                      |
      | content.section.title           | ADVANCE DIRECTIVE COMPLETED               |
      #Organization
      | content.contained.resourceType     | Organization           |
      | content.contained.identifier.label | facility-code          |
      | content.contained.identifier.value | 500                    |
      | content.contained.name             | CAMP MASTER            |
      | content.contained.text.div         | <div>CAMP MASTER</div> |
      | content.contained.text.status      | generated              |
      #Extensions
      | content.extension.url           | http://vistacore.us/fhir/profiles/@main#entered            |
      | content.extension.valueDateTime | 2007-05-16T09:45:54                                        |
      | content.extension.url           | http://vistacore.us/fhir/profiles/@main#document-type-code |
      | content.extension.valueString   | D                                                          |
      | content.extension.url           | http://vistacore.us/fhir/profiles/@main#document-type-name |
      | content.extension.valueString   | Advance Directive                                          |
      | content.extension.url           | http://vistacore.us/fhir/profiles#isInterdisciplinary      |
      | content.extension.valueBoolean  | false                                                      |
      #Encounter
      | content.contained.resourceType     | Encounter                         |
      | content.contained.text.div         | <div>20 MINUTE May 16, 2007</div> |
      | content.contained.identifier.label | uid                               |
      #Observation
      | content.contained.resourceType | Observation                               |
      | content.contained.text.status  | generated                                 |
      | content.contained.text.div     | CONTAINS VistA Imaging                    |
      | content.contained.name.text    | Advance Directive                         |
      | content.contained.valueString  | CONTAINS VistA Imaging - Scanned Document |
      | content.contained.status       | final                                     |
      | content.contained.reliability  | ok                                        |

@F138_2_fhir_clinicalnote @fhir @5000000116V912836
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "5000000116V912836" has been synced through the RDK API
      When the client requests clinical notes for the patient "5000000116V912836" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 12    |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | content.text.div                  | <div>Progress Note</div>                  |
      | content.text.status               | generated                                 |
      | content.identifier.use            | official                                  |
      | content.identifier.value          | urn:va:document:DOD:0000000002:1000000444 |
      | content.date                      | 2013-12-12T21:25:08                       |
      | content.type.coding.system        | http://loinc.org                          |
      | content.type.coding.code          | 34765-8                                   |
      | content.type.coding.display       | General medicine Note                     |
      | content.type.text                 | Progress Note                             |
      | content.class.text                | Clinical Note                             |
      | content.title                     | Progress Note                             |
      | content.confidentiality.system    | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code      | N                                         |
      | content.confidentiality.display   | normal                                    |
      | content.subject.reference         | Patient/DOD;0000000002                    |
      | content.attester.mode             | professional                              |
      | content.section.content.reference | CONTAINS Observation/                     |
      | content.section.title             | Progress Note                             |
      #Organization
      | content.contained.resourceType     | Organization   |
      | content.contained.identifier.label | facility-code  |
      | content.contained.identifier.value | DOD            |
      | content.contained.name             | DOD            |
      | content.contained.text.div         | <div>DOD</div> |
      | content.contained.text.status      | generated      |
      #Observation
      | content.contained.resourceType | Observation                             |
      | content.contained.text.status  | generated                               |
      | content.contained.text.div     | CONTAINS Patient: DANIELS, PEDRO ROBERT |
      | content.contained.name.text    | Progress Note                           |
      | content.contained.valueString  | CONTAINS Patient: DANIELS, PEDRO ROBERT |
      | content.contained.status       | final                                   |
      | content.contained.reliability  | ok                                      |
      #Author
      | content.extension.url          | http://vistacore.us/fhir/profiles/@main#document-type-name  |
      | content.extension.valueString  | Progress Note                                               |
      | content.extension.url          | http://vistacore.us/fhir/profiles#isInterdisciplinary       |
      | content.extension.valueBoolean | false                                                       |
      | content.extension.url          | http://vistacore.us/fhir/extensions/notes#dodComplexNoteUri |
      | content.extension.valueString  | CONTAINS 444f443b30303030303030303032/1000000444            |

@F138_3_fhir_clinicalnote @fhir @5000000217V519385
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "5000000217V519385" has been synced through the RDK API
      When the client requests clinical notes for the patient "5000000217V519385" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 14    |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | content.resourceType              | Composition                               |
      | content.text.div                  | <div>ADVANCE DIRECTIVE COMPLETED</div>    |
      | content.text.status               | generated                                 |
      | content.identifier.use            | official                                  |
      | content.identifier.value          | urn:va:document:ABCD:3:3853               |
      | content.type.coding.system        | http://loinc.org                          |
      | content.type.coding.code          | 34765-8                                   |
      | content.type.coding.display       | General medicine Note                     |
      | content.type.text                 | Advance Directive                         |
      | content.class.text                | PROGRESS NOTES                            |
      | content.title                     | ADVANCE DIRECTIVE COMPLETED               |
      | content.confidentiality.system    | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code      | N                                         |
      | content.confidentiality.display   | normal                                    |
      | content.subject.reference         | Patient/HDR;5000000217V519385             |
      | content.attester.mode             | professional                              |
      | content.encounter.reference       | CONTAINS Encounter/                       |
      | content.encounter.display         | 20 MINUTE May 16, 2007                    |
      | content.section.code.text         | 3853                                      |
      | content.section.title             | ADVANCE DIRECTIVE COMPLETED               |
      | content.section.content.reference | CONTAINS Observation/                     |
      #Organization
      | content.contained.resourceType     | Organization              |
      | content.contained._id              | IS_SET                    |
      | content.contained.identifier.label | facility-code             |
      | content.contained.identifier.value | 561                       |
      | content.contained.name             | New Jersey HCS            |
      | content.contained.text.div         | <div>New Jersey HCS</div> |
      | content.contained.text.status      | generated                 |
      #Observation
      | content.contained.resourceType | Observation                               |
      | content.contained.text.status  | generated                                 |
      | content.contained.text.div     | CONTAINS VistA Imaging - Scanned Document |
      | content.contained.name.text    | Advance Directive                         |
      | content.contained.valueString  | CONTAINS VistA Imaging - Scanned Document |
      | content.contained.status       | final                                     |
      | content.contained.reliability  | ok                                        |
      #Encounter
      | content.contained.resourceType     | Encounter                         |
      | content.contained.text.div         | <div>20 MINUTE May 16, 2007</div> |
      | content.contained.text.status      | generated                         |
      | content.contained.identifier.label | uid                               |
      | content.contained.identifier.value | urn:va:visit:ABCD:3:5670          |
      #Author
      | content.author.reference | CONTAINS Practitioner/ |
      | content.author.display   | Labtech,Fiftynine      |
      | content.author.display   | Mg                     |
      #Extensions
      | content.extension.url          | http://vistacore.us/fhir/profiles/@main#document-type-code |
      | content.extension.valueString  | D                                                          |
      | content.extension.url          | http://vistacore.us/fhir/profiles/@main#document-type-name |
      | content.extension.valueString  | Advance Directive                                          |
      | content.extension.url          | http://vistacore.us/fhir/profiles#isInterdisciplinary      |
      | content.extension.valueBoolean | false                                                      |
      And the FHIR results contain "clinical notes"
      #Practitioner
      | name                             | value             |
      | content.contained.role.code.text | AU                |
      | content.contained.resourceType   | Practitioner      |
      | content.contained.name.text      | Labtech,Fiftynine |
      #Practitioner
      | content.contained.role.code.text | ES                |
      | content.contained.resourceType   | Practitioner      |
      | content.contained.name.text      | Labtech,Fiftynine |
      #Practitioner
      | content.contained.role.code.text | E            |
      | content.contained.resourceType   | Practitioner |
      | content.contained.name.text      | Mg           |

@F138_4_fhir_clinicalnote @fhir @10146V393772
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "10146V393772" has been synced through the RDK API
      When the client requests clinical notes for the patient "10146V393772" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 129   |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | content.resourceType              | Composition                               |
      | content.text.div                  | <div>ADVANCE DIRECTIVE COMPLETED</div>    |
      | content.text.status               | generated                                 |
      | content.identifier.use            | official                                  |
      | content.identifier.value          | urn:va:document:9E7A:301:3890             |
      | content.date                      | 2007-05-16T15:48:00                       |
      | content.title                     | ADVANCE DIRECTIVE COMPLETED               |
      | content.status                    | FINAL                                     |
      | content.type.coding.system        | http://loinc.org                          |
      | content.type.coding.code          | 34765-8                                   |
      | content.type.coding.display       | General medicine Note                     |
      | content.type.text                 | Advance Directive                         |
      | content.class.text                | PROGRESS NOTES                            |
      | content.confidentiality.system    | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code      | N                                         |
      | content.confidentiality.display   | normal                                    |
      | content.subject.reference         | Patient/9E7A;301                          |
      | content.attester.mode             | professional                              |
      | content.attester.time             | 2007-05-16T15:47:31                       |
      | content.attester.party.reference  | CONTAINS Practitioner/                    |
      | content.attester.party.display    | Labtech,Fiftynine                         |
      | content.encounter.reference       | CONTAINS Encounter/                       |
      | content.encounter.display         | 20 MINUTE May 16, 2007                    |
      | content.section.code.text         | 3890                                      |
      | content.section.title             | ADVANCE DIRECTIVE COMPLETED               |
      | content.section.content.reference | CONTAINS Observation/                     |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | content.resourceType              | Composition                               |
      | content.text.div                  | <div>ADVANCE DIRECTIVE COMPLETED</div>    |
      | content.text.status               | generated                                 |
      | content.identifier.use            | official                                  |
      | content.identifier.value          | urn:va:document:9E7A:301:3890             |
      | content.date                      | 2007-05-16T15:48:00                       |
      | content.title                     | ADVANCE DIRECTIVE COMPLETED               |
      | content.status                    | FINAL                                     |
      | content.type.coding.system        | http://loinc.org                          |
      | content.type.coding.code          | 34765-8                                   |
      | content.type.coding.display       | General medicine Note                     |
      | content.type.text                 | Advance Directive                         |
      | content.class.text                | PROGRESS NOTES                            |
      | content.confidentiality.system    | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code      | N                                         |
      | content.confidentiality.display   | normal                                    |
      | content.subject.reference         | Patient/9E7A;301                          |
      | content.attester.mode             | professional                              |
      | content.attester.time             | 2007-05-16T15:47:31                       |
      | content.attester.party.reference  | CONTAINS Practitioner/                    |
      | content.attester.party.display    | Labtech,Fiftynine                         |
      | content.encounter.reference       | CONTAINS Encounter/                       |
      | content.encounter.display         | 20 MINUTE May 16, 2007                    |
      | content.section.code.text         | 3890                                      |
      | content.section.title             | ADVANCE DIRECTIVE COMPLETED               |
      | content.section.content.reference | CONTAINS Observation/                     |
      And the FHIR results contain "clinical notes"
      | name                              | value                                     |
      | content.resourceType              | Composition                               |
      | content.text.div                  | <div>FOOT 2 VIEWS</div>                   |
      | content.text.status               | generated                                 |
      | content.identifier.use            | official                                  |
      | content.identifier.value          | urn:va:document:C877:301:7029892.8654-3   |
      | content.date                      | 1997-01-07T13:45:00                       |
      | content.title                     | FOOT 2 VIEWS                              |
      | content.type.coding.system        | http://loinc.org                          |
      | content.type.coding.code          | 34765-8                                   |
      | content.type.coding.display       | General medicine Note                     |
      | content.type.text                 | Radiology Report                          |
      | content.class.text                | RADIOLOGY REPORTS                         |
      | content.confidentiality.system    | http://hl7.org/fhir/v3/vs/Confidentiality |
      | content.confidentiality.code      | N                                         |
      | content.confidentiality.display   | normal                                    |
      | content.subject.reference         | Patient/C877;301                          |
      | content.attester.mode             | professional                              |
      | content.attester.time             | 1997-01-07T13:59:00                       |
      | content.attester.party.reference  | CONTAINS Practitioner/                    |
      | content.attester.party.display    | Provider,Thirtynine                       |
      | content.encounter.reference       | CONTAINS Encounter/                       |
      | content.encounter.display         | RADIOLOGY MAIN FLOOR Jan 07, 1997         |
      | content.section.code.text         | 7029892.8654-3                            |
      | content.section.title             | FOOT 2 VIEWS                              |
      | content.section.content.reference | CONTAINS Observation/                     |

@F138_5_fhir_clinicalnote @fhir @5123456789V027402
Scenario: Client can break the glass when requesting clinical notes in FHIR format for a sensitive patient
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "5123456789V027402" has been synced through the RDK API
      When the client requests clinical notes for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for clinical notes for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 7     |

@F138_6_fhir_clinicalnote @fhir @9E7A100184
Scenario: Negativ scenario. Client can request clinical notes results in FHIR format
      Given a patient with "no clinical notes" in multiple VistAs
      And a patient with pid "9E7A;100184" has been synced through the RDK API
      When the client requests clinical notes for the patient "9E7A;100184" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 0     |

@F138_7_fhir_clinicalnote @fhir @10146V393772 @DE974
Scenario: Client can request clinical notes results in FHIR format
      Given a patient with "clinical notes" in multiple VistAs
      And a patient with pid "10146V393772" has been synced through the RDK API
      When the client requests "10" clinical notes for the patient "10146V393772" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 10    |

@F138_fhir_consult @vxsync @patient
Feature: F138 - Return of consult in FHIR format

#This feature item returns consult in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 5000000116V912836, 5000000217V519385, 10107V395912, 10104V248233

@F138_1_fhir_consult @fhir @10107V395912
Scenario: Client can request consult results in FHIR format
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "10107V395912" has been synced through the RDK API
      When the client requests consult for the patient "10107V395912" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 7     |
      And the FHIR results contain "consult"
      | name                          | value                                                 |
      | content.resourceType          | ReferralRequest                                       |
      | content._id                   | urn:va:consult:9E7A:253:379                           |
      | content.status                | completed                                             |
      | content.subject.reference     | Patient/9E7A;253                                      |
      | content.requester.reference   | Patient/9E7A;253                                      |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233                       |
      | content.identifier.value      | urn:va:consult:9E7A:253:379                           |
      | content.type.text             | Consult                                               |
      | content.speciality.text       | AUDIOLOGY OUTPATIENT                                  |
      | content.priority.text         | Routine                                               |
      | content.serviceRequested.text | AUDIOLOGY OUTPATIENT                                  |
      | content.dateSent              | 2004-04-01T22:54:17                                   |
      | content.reason.text           | 90 year old MALE referred for suspected hearing loss. |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.name              | PATHOLOGY,ONE                   |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | urn:va:user:9E7A:11748          |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | CAMP MASTER                     |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 500                             |
      #encounter
      | content.contained.resourceType | Encounter                                  |
      | content.contained.text.status  | generated                                  |
      | content.contained.text.div     | <div>Encounter with patient 9E7A;253</div> |
      | content.contained.status       | finished                                   |
      | content.contained.class        | ambulatory                                 |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderName          |
      | content.extension.valueString | AUDIOLOGY OUTPATIENT                                           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#patientClassName   |
      | content.extension.valueString | Ambulatory                                                     |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId            |
      | content.extension.valueString | 379                                                            |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid           |
      | content.extension.valueString | urn:va:order:9E7A:253:15477                                    |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_summary    |
      | content.extension.valueString | ProcedureResult{uid='urn:va:document:9E7A:253:3111'}           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_uid        |
      | content.extension.valueString | urn:va:document:9E7A:253:3111                                  |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_localTitle |
      | content.extension.valueString | AUDIOLOGY - HEARING LOSS CONSULT                               |
      And the FHIR results contain "consult"
      | name                          | value                                                  |
      | content.resourceType          | ReferralRequest                                        |
      | content._id                   | urn:va:consult:9E7A:253:380                            |
      | content.status                | draft                                                  |
      | content.text                  | HEMATOLOGY CONSULT Cons                                |
      | content.subject.reference     | Patient/9E7A;253                                       |
      | content.requester.reference   | Patient/9E7A;253                                       |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233                        |
      | content.identifier.value      | urn:va:consult:9E7A:253:380                            |
      | content.type.text             | Consult                                                |
      | content.speciality.text       | HEMATOLOGY CONSULT                                     |
      | content.priority.text         | Routine                                                |
      | content.serviceRequested.text | HEMATOLOGY CONSULT                                     |
      | content.dateSent              | 2004-04-01T22:54:17                                    |
      | content.reason.text           | Decreased WBC - less than 1.0 for a period of 8 weeks. |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.name              | PATHOLOGY,ONE                   |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | urn:va:user:9E7A:11748          |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | CAMP MASTER                     |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 500                             |
      #encounter
      | content.contained.resourceType | Encounter                                  |
      | content.contained.text.status  | generated                                  |
      | content.contained.text.div     | <div>Encounter with patient 9E7A;253</div> |
      | content.contained.status       | cancelled                                  |
      | content.contained.class        | ambulatory                                 |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderName        |
      | content.extension.valueString | HEMATOLOGY CONSULT                                           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#patientClassName |
      | content.extension.valueString | Ambulatory                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId          |
      | content.extension.valueString | 380                                                          |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid         |
      | content.extension.valueString | urn:va:order:9E7A:253:15478                                  |

@F138_2_fhir_consult @fhir @5000000116V912836
Scenario: Client can request consult results in FHIR format
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "5000000116V912836" has been synced through the RDK API
      When the client requests consult for the patient "5000000116V912836" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 1     |
      And the FHIR results contain "consult"
      | name                          | value                             |
      | content.resourceType          | ReferralRequest                   |
      | content._id                   | urn:va:consult:ABCD:12:82         |
      | content.status                | active                            |
      | content.text                  | COLONOSCOPY GASTROENTEROLOGY Proc |
      | content.subject.reference     | Patient/HDR;5000000116V912836     |
      | content.requester.reference   | Patient/HDR;5000000116V912836     |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233   |
      | content.identifier.value      | urn:va:consult:ABCD:12:82         |
      | content.type.text             | COLONOSCOPY                       |
      | content.speciality.text       | GASTROENTEROLOGY                  |
      | content.serviceRequested.text | GASTROENTEROLOGY                  |
      | content.dateSent              | 1996-03-18T13:18:00               |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | New Jersey HCS                  |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 561                             |
      #encounter
      | content.contained.resourceType | Encounter                                               |
      | content.contained.text.status  | generated                                               |
      | content.contained.text.div     | <div>Encounter with patient HDR;5000000116V912836</div> |
      | content.contained.status       | planned                                                 |
      | content.contained.class        | ambulatory                                              |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId  |
      | content.extension.valueString | 82                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid |
      | content.extension.valueString | urn:va:order:ABCD:12:5389.1                          |

@F138_3_fhir_consult @fhir @5000000217V519385
Scenario: Client can request consult results in FHIR format
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "5000000217V519385" has been synced through the RDK API
      When the client requests consult for the patient "5000000217V519385" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 1     |
      And the FHIR results contain "consult"
      | name                          | value                             |
      | content.resourceType          | ReferralRequest                   |
      | content._id                   | urn:va:consult:ABCD:12:82         |
      | content.status                | active                            |
      | content.text                  | COLONOSCOPY GASTROENTEROLOGY Proc |
      | content.subject.reference     | Patient/HDR;5000000217V519385     |
      | content.requester.reference   | Patient/HDR;5000000217V519385     |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233   |
      | content.identifier.value      | urn:va:consult:ABCD:12:82         |
      | content.type.text             | COLONOSCOPY                       |
      | content.speciality.text       | GASTROENTEROLOGY                  |
      | content.serviceRequested.text | GASTROENTEROLOGY                  |
      | content.dateSent              | 1996-03-18T13:18:00               |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | New Jersey HCS                  |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 561                             |
      #encounter
      | content.contained.resourceType | Encounter                                               |
      | content.contained.text.status  | generated                                               |
      | content.contained.text.div     | <div>Encounter with patient HDR;5000000217V519385</div> |
      | content.contained.status       | planned                                                 |
      | content.contained.class        | ambulatory                                              |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId  |
      | content.extension.valueString | 82                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid |
      | content.extension.valueString | urn:va:order:ABCD:12:5389.1                          |

@F138_4_fhir_consult @fhir @10104V248233
Scenario: Client can request consult results in FHIR format
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "10104V248233" has been synced through the RDK API
      When the client requests consult for the patient "10104V248233" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 9     |
      And the FHIR results contain "consult"
      | name                          | value                                                 |
      | content.resourceType          | ReferralRequest                                       |
      | content._id                   | urn:va:consult:9E7A:229:373                           |
      | content.status                | completed                                             |
      | content.text                  | AUDIOLOGY OUTPATIENT Cons                             |
      | content.subject.reference     | Patient/9E7A;229                                      |
      | content.requester.reference   | Patient/9E7A;229                                      |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233                       |
      | content.identifier.value      | urn:va:consult:9E7A:229:373                           |
      | content.type.text             | Consult                                               |
      | content.speciality.text       | AUDIOLOGY OUTPATIENT                                  |
      | content.serviceRequested.text | AUDIOLOGY OUTPATIENT                                  |
      | content.priority.text         | Routine                                               |
      | content.reason.text           | 79 year old MALE referred for suspected hearing loss. |
      | content.dateSent              | 2004-04-01T22:35:29                                   |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.name              | PATHOLOGY,ONE                   |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | CAMP MASTER                     |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 500                             |
      #encounter
      | content.contained.resourceType | Encounter                                  |
      | content.contained.text.status  | generated                                  |
      | content.contained.text.div     | <div>Encounter with patient 9E7A;229</div> |
      | content.contained.status       | finished                                   |
      | content.contained.class        | ambulatory                                 |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderName          |
      | content.extension.valueString | AUDIOLOGY OUTPATIENT                                           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#patientClassName   |
      | content.extension.valueString | Ambulatory                                                     |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId            |
      | content.extension.valueString | 373                                                            |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid           |
      | content.extension.valueString | urn:va:order:9E7A:229:15471                                    |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_summary    |
      | content.extension.valueString | ProcedureResult{uid='urn:va:document:9E7A:229:3108'}           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_uid        |
      | content.extension.valueString | urn:va:document:9E7A:229:3108                                  |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#results_localTitle |
      | content.extension.valueString | AUDIOLOGY - HEARING LOSS CONSULT                               |

      And the FHIR results contain "consult"
      | name                          | value                                                  |
      | content.resourceType          | ReferralRequest                                        |
      | content._id                   | urn:va:consult:9E7A:229:374                            |
      | content.status                | draft                                                  |
      | content.text                  | HEMATOLOGY CONSULT Cons                                |
      | content.subject.reference     | Patient/9E7A;229                                       |
      | content.requester.reference   | Patient/9E7A;229                                       |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233                        |
      | content.identifier.value      | urn:va:consult:9E7A:229:374                            |
      | content.type.text             | Consult                                                |
      | content.speciality.text       | HEMATOLOGY CONSULT                                     |
      | content.serviceRequested.text | HEMATOLOGY CONSULT                                     |
      | content.priority.text         | Routine                                                |
      | content.reason.text           | Decreased WBC - less than 1.0 for a period of 8 weeks. |
      | content.dateSent              | 2004-04-01T22:35:29                                    |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.name              | PATHOLOGY,ONE                   |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | CAMP MASTER                     |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 500                             |
      #encounter
      | content.contained.resourceType | Encounter                                  |
      | content.contained.text.status  | generated                                  |
      | content.contained.text.div     | <div>Encounter with patient 9E7A;229</div> |
      | content.contained.status       | cancelled                                  |
      | content.contained.class        | ambulatory                                 |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderName        |
      | content.extension.valueString | HEMATOLOGY CONSULT                                           |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#patientClassName |
      | content.extension.valueString | Ambulatory                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId          |
      | content.extension.valueString | 374                                                          |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid         |
      | content.extension.valueString | urn:va:order:9E7A:229:15472                                  |

      And the FHIR results contain "consult"
      | name                          | value                           |
      | content.resourceType          | ReferralRequest                 |
      | content._id                   | urn:va:consult:9E7A:229:283     |
      | content.status                | completed                       |
      | content.text                  | CARDIOLOGY Cons                 |
      | content.subject.reference     | Patient/9E7A;229                |
      | content.requester.reference   | Patient/9E7A;229                |
      | content.identifier.system     | urn:oid:2.16.840.1.113883.6.233 |
      | content.identifier.value      | urn:va:consult:9E7A:229:283     |
      | content.type.text             | Consult                         |
      | content.speciality.text       | CARDIOLOGY                      |
      | content.serviceRequested.text | CARDIOLOGY                      |
      | content.priority.text         | Routine                         |
      | content.reason.text           | heart palpitations              |
      | content.dateSent              | 2000-05-21T09:49:41             |
      #practitioner
      | content.contained.resourceType      | Practitioner                    |
      | content.contained.name              | VEHU,SIXTYONE                   |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      #location
      | content.contained.resourceType      | Location                        |
      | content.contained.Name              | CAMP MASTER                     |
      | content.contained.identifier.system | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.identifier.value  | 500                             |
      #encounter
      | content.contained.resourceType | Encounter                                  |
      | content.contained.text.status  | generated                                  |
      | content.contained.text.div     | <div>Encounter with patient 9E7A;229</div> |
      | content.contained.status       | finished                                   |
      | content.contained.class        | ambulatory                                 |
      #extension
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderName        |
      | content.extension.valueString | CARDIOLOGY                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#patientClassName |
      | content.extension.valueString | Ambulatory                                                   |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#localId          |
      | content.extension.valueString | 283                                                          |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#orderUid         |
      | content.extension.valueString | urn:va:order:9E7A:229:12280                                  |
      | content.extension.url         | http://vistacore.us/fhir/extensions/consult#provisionalDx    |
      | content.extension.valueString | chest pain                                                   |

@F138_5_fhir_consult @fhir @5123456789V027402
Scenario: Client can break the glass when requesting consult in FHIR format for a sensitive patient
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "5123456789V027402" has been synced through the RDK API
    When the client requests consult for that sensitive patient "5123456789V027402"
    Then a permanent redirect response is returned
    When the client breaks glass and repeats a request for consult for that patient "5123456789V027402"
    Then a successful response is returned
    And the results contain
      | name         | value |
      | totalResults | 5     |

@F138_6_fhir_consult @fhir @9E7A100184
Scenario: Negativ scenario. Client can request consult results in FHIR format
  Given a patient with "no consult" in multiple VistAs
  When the client requests consult for the patient "9E7A;100184" in FHIR format
  Then a successful response is returned
  And the results contain
      | name         | value |
      | totalResults | 0     |

@F138_7_fhir_consult @fhir @10110V004877 @DE974
Scenario: Client can request consult results in FHIR format
      Given a patient with "consult" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
      When the client requests "10" consult for the patient "10110V004877" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 10    |

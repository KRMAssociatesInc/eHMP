# @F138_fhir_consult @vxsync @patient
 Feature: F138 - Return of consult in FHIR format

 #This feature item returns consult in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
 #Patients used: 5000000116V912836, 5000000217V519385, 10107V395912, 10104V248233

 @F138_1_fhir_consult @fhir @10107V395912 @US8577 @F202-21
 Scenario: Client can request consult results in FHIR format
       Given a patient with "consult" in multiple VistAs
      # And a patient with pid "10107V395912" has been synced through the RDK API
       When the client requests consult for the patient "10107V395912" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 7     |
       And the FHIR results contain "consult"
       | name                          | value                                                 |
       | resource.resourceType          | ReferralRequest                                       |
       | resource.status                | completed                                             |
       | resource.patient.reference     | Patient/10107V395912                                     |
       | resource.requester.reference   | Provider/urn:va:user:9E7A:11748                                     |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233                       |
       | resource.identifier.value      | urn:va:consult:9E7A:253:379                           |
       | resource.type.text             | Consult                                               |
       | resource.specialty.text       | AUDIOLOGY OUTPATIENT                                  |
       | resource.priority.text         | Routine                                               |
       | resource.serviceRequested.text | AUDIOLOGY OUTPATIENT                                  |
       | resource.dateSent              | 2004-04-01T22:54:17                                   |
       | resource.reason.text           | 90 year old MALE referred for suspected hearing loss. |

       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderName          |
       | resource.extension.valueString | AUDIOLOGY OUTPATIENT                                           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#patientClassName   |
       | resource.extension.valueString | Ambulatory                                                     |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId            |
       | resource.extension.valueString | 379                                                            |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid           |
       | resource.extension.valueString | urn:va:order:9E7A:253:15477                                    |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#results[0].summary |
       | resource.extension.valueString | ProcedureResult{uid='urn:va:document:9E7A:253:3111'}           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#activity[1].resultUid      |
       | resource.extension.valueString | urn:va:document:9E7A:253:3111                                  |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#results[0].localTitle |
       | resource.extension.valueString | AUDIOLOGY - HEARING LOSS CONSULT                               |
       And the FHIR results contain "consult"
       | name                          | value                                                  |
       | resource.resourceType          | ReferralRequest                                        |
       | resource.status                | draft                                                  |
       | resource.type.text             | Consult                                |
       | resource.patient.reference     | Patient/10107V395912                                       |
       | resource.requester.reference   | Provider/urn:va:user:9E7A:11748                                      |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233                        |
       | resource.identifier.value      | urn:va:consult:9E7A:253:380                            |
       | resource.type.text             | Consult                                                |
       | resource.specialty.text       | HEMATOLOGY CONSULT                                     |
       | resource.priority.text         | Routine                                                |
       | resource.serviceRequested.text | HEMATOLOGY CONSULT                                     |
       | resource.dateSent              | 2004-04-01T22:54:17                                    |
       | resource.reason.text           | Decreased WBC - less than 1.0 for a period of 8 weeks. |
       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderName        |
       | resource.extension.valueString | HEMATOLOGY CONSULT                                           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#patientClassName |
       | resource.extension.valueString | Ambulatory                                                   |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId          |
       | resource.extension.valueString | 380                                                          |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid         |
       | resource.extension.valueString | urn:va:order:9E7A:253:15478                                  |

 @F138_2_fhir_consult @fhir @5000000116V912836 @US8577 @F202-21
 Scenario: Client can request consult results in FHIR format
       Given a patient with "consult" in multiple VistAs
     #  And a patient with pid "5000000116V912836" has been synced through the RDK API
       When the client requests consult for the patient "5000000116V912836" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 1     |
       And the FHIR results contain "consult"
       | name                          | value                             |
       | resource.resourceType          | ReferralRequest                   |
       | resource.status                | active                            |
       | resource.patient.reference     | Patient/5000000116V912836     |
       | resource.requester.reference   | Provider/undefined     |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233   |
       | resource.identifier.value      | urn:va:consult:ABCD:12:82         |
       | resource.type.text             | COLONOSCOPY                       |
       | resource.specialty.text       | GASTROENTEROLOGY                  |
       | resource.serviceRequested.text | GASTROENTEROLOGY                  |
       | resource.dateSent              | 1996-03-18T13:18:00               |
       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#facilityCode |
       | resource.extension.valueInteger | 561 |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId  |
       | resource.extension.valueString | 82                                                   |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid |
       | resource.extension.valueString | urn:va:order:ABCD:12:5389.1                          |

 @F138_3_fhir_consult @fhir @5000000217V519385 @US8577 @F202-21
 Scenario: Client can request consult results in FHIR format
       Given a patient with "consult" in multiple VistAs
    #   And a patient with pid "5000000217V519385" has been synced through the RDK API
       When the client requests consult for the patient "5000000217V519385" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 1     |
       And the FHIR results contain "consult"
       | name                          | value                             |
       | resource.resourceType          | ReferralRequest                   |
       | resource.status                | active                            |
       | resource.patient.reference     | Patient/5000000217V519385     |
       | resource.requester.reference   | Provider/undefined     |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233   |
       | resource.identifier.value      | urn:va:consult:ABCD:12:82         |
       | resource.type.text             | COLONOSCOPY                       |
       | resource.specialty.text       | GASTROENTEROLOGY                  |
       | resource.serviceRequested.text | GASTROENTEROLOGY                  |
       | resource.dateSent              | 1996-03-18T13:18:00               |
       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId  |
       | resource.extension.valueString | 82                                                   |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid |
       | resource.extension.valueString | urn:va:order:ABCD:12:5389.1                          |

 @F138_4_fhir_consult @fhir @10104V248233 @US8577 @F202-21
 Scenario: Client can request consult results in FHIR format
       Given a patient with "consult" in multiple VistAs
    #   And a patient with pid "10104V248233" has been synced through the RDK API
       When the client requests consult for the patient "10104V248233" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 9     |
       And the FHIR results contain "consult"
       | name                          | value                                                 |
       | resource.resourceType          | ReferralRequest                                       |
       | resource.status                | completed                                             |
       | resource.patient.reference     | Patient/10104V248233                                      |
       | resource.requester.reference   | Provider/urn:va:user:9E7A:11748                                      |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233                       |
       | resource.identifier.value      | urn:va:consult:9E7A:229:373                           |
       | resource.type.text             | Consult                                               |
       | resource.specialty.text       | AUDIOLOGY OUTPATIENT                                  |
       | resource.serviceRequested.text | AUDIOLOGY OUTPATIENT                                  |
       | resource.priority.text         | Routine                                               |
       | resource.reason.text           | 79 year old MALE referred for suspected hearing loss. |
       | resource.dateSent              | 2004-04-01T22:35:29                                   |
       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderName          |
       | resource.extension.valueString | AUDIOLOGY OUTPATIENT                                           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#patientClassName   |
       | resource.extension.valueString | Ambulatory                                                     |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId            |
       | resource.extension.valueString | 373                                                            |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid           |
       | resource.extension.valueString | urn:va:order:9E7A:229:15471                                    |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#results[0].summary  |
       | resource.extension.valueString | ProcedureResult{uid='urn:va:document:9E7A:229:3108'}           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#activity[1].resultUid        |
       | resource.extension.valueString | urn:va:document:9E7A:229:3108                                  |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#results[0].localTitle |
       | resource.extension.valueString | AUDIOLOGY - HEARING LOSS CONSULT                               |

       And the FHIR results contain "consult"
       | name                          | value                                                  |
       | resource.resourceType          | ReferralRequest                                        |
       | resource.status                | draft                                                  |
       | resource.patient.reference     | Patient/10104V248233                                      |
       | resource.requester.reference   | Provider/urn:va:user:9E7A:11748                        |
       | resource.identifier.system     | urn:oid:2.16.840.1.113883.6.233                        |
       | resource.identifier.value      | urn:va:consult:9E7A:229:374                            |
       | resource.type.text             | Consult                                                |
       | resource.specialty.text       | HEMATOLOGY CONSULT                                     |
       | resource.serviceRequested.text | HEMATOLOGY CONSULT                                     |
       | resource.priority.text         | Routine                                                |
       | resource.reason.text           | Decreased WBC - less than 1.0 for a period of 8 weeks. |
       | resource.dateSent              | 2004-04-01T22:35:29                                    |
       #extension
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderName        |
       | resource.extension.valueString | HEMATOLOGY CONSULT                                           |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#patientClassName |
       | resource.extension.valueString | Ambulatory                                                   |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#localId          |
       | resource.extension.valueString | 374                                                          |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/referralrequest#orderUid         |
       | resource.extension.valueString | urn:va:order:9E7A:229:15472                                  |
      
 @F138_5_fhir_consult @fhir @5123456789V027402 @US8577 @F202-21
 Scenario: Client can break the glass when requesting consult in FHIR format for a sensitive patient
       Given a patient with "consult" in multiple VistAs
       #And a patient with pid "5123456789V027402" has been synced through the RDK API
     When the client requests consult for that sensitive patient "5123456789V027402"
     Then a permanent redirect response is returned
     When the client breaks glass and repeats a request for consult for that patient "5123456789V027402"
     Then a successful response is returned
     And the results contain
       | name         | value |
       | total        | 5     |

 @F138_6_fhir_consult @fhir @9E7A100184 @US8577 @F202-21
 Scenario: Negativ scenario. Client can request consult results in FHIR format
   Given a patient with "no consult" in multiple VistAs
   When the client requests consult for the patient "9E7A;100184" in FHIR format
   Then a successful response is returned
   And the results contain
       | name         | value |
       | total        | 0     |

 @F138_7_fhir_consult @fhir @10110V004877 @DE974 @US8577 @F202-21
 Scenario: Client can request consult results in FHIR format
       Given a patient with "consult" in multiple VistAs
       #And a patient with pid "10110V004877" has been synced through the RDK API
       When the client requests "10" consult for the patient "10110V004877" in FHIR format
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total        | 35   |

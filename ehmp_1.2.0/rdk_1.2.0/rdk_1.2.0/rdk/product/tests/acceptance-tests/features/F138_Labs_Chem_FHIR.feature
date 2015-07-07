@labs_fhir @vxsync @patient
Feature: F138 Return of Lab (Chem/Hem) Results in FHIR format

#This feature item covers the return of Chemistry and Hematology Lab results in FHIR format. Also includes cases when no results exist.


@F138_1_Labs_chem_fhir @fhir @11016V630869
Scenario: Client can request lab (Chem/Hem) results in FHIR format
      Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
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
      | field                                           | values                                            |
      | content.contained._id                           | IS_SET                                            |
      | content.contained.name.text                     | GLUCOSE                                           |
      | content.contained.name.coding.code              | urn:va:vuid:4665449                               |
      | content.contained.name.coding.display           | GLUCOSE                                           |
      | content.contained.name.coding.system            | urn:oid:2.16.840.1.113883.6.233                   |
      | content.contained.name.coding.code              | urn:lnc:2344-0                                    |
      | content.contained.name.coding.display           | GLUCOSE                                           |
      | content.contained.name.coding.system            | urn:oid:2.16.840.1.113883.4.642.2.58              |
      | content.contained.valueQuantity.value           | 106                                               |
      | content.contained.valueQuantity.units           | mg/dL                                             |
      | content.contained.interpretation.coding.system  | http://hl7.org/fhir/vs/observation-interpretation |
      | content.contained.interpretation.coding.code    | N                                                 |
      | content.contained.interpretation.coding.display | Normal                                            |
      | content.contained.referenceRange.high.value     | 110                                               |
      | content.contained.referenceRange.high.units     | mg/dL                                             |
      | content.contained.referenceRange.low.value      | 60                                                |
      | content.contained.referenceRange.low.units      | mg/dL                                             |
      | content.contained.status                        | final                                             |
      | content.contained.reliability                   | ok                                                |
      | content.contained.specimen.reference            | IS_SET                                            |
      | content.contained.specimen.display              | SERUM                                             |
 And the results contain lab "(Chem/Hem)" results
      | field                                          | values                                                          |
      | content.text.div                               | CONTAINS Accession: urn:va:accession:9E7A:227:CH;6949681.966383 |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.text.status                  | generated                                                       |
      | content.contained.identifier.label             | facility-code                                                   |
      | content.contained.identifier.value             | 500                                                             |
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
      | content.name.text                              | GLUCOSE                                                         |
      | content.name.coding.display                    | GLUCOSE                                                         |
      | content.name.coding.display                    | GLUCOSE                                                         |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
      | content.status                                 | final                                                           |
      | content.issued                                 | 2005-03-17T03:36:00                                             |
      | content.subject.reference                      | Patient/11016V630869                                            |
      | content.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
      | content.performer.reference                    | IS_SET                                                          |
      | content.serviceCategory.coding.code            | CH                                                              |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
      | content.serviceCategory.coding.display         | Chemistry                                                       |
      | content.serviceCategory.text                   | Chemistry                                                       |
      | content.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
      | content.specimen.reference                     | IS_SET                                                          |
      | content.specimen.display                       | SERUM                                                           |
      | content.result.reference                       | IS_SET                                                          |
      | content.result.display                         | GLUCOSE                                                         |
      And the results contain lab "(Chem/Hem)" results
      | field                         | values                                             |
      | content.subject.reference     | Patient/11016V630869                               |
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
      #And the lab field(s) just contain "Patient/11016V630869"
      #| field                                  |
      #| content.subject.reference              |
      #| content.contained.subject.reference    |


@F138_2_Labs_chem_fhir @fhir @11016V630869
Scenario: Client can request lab (Chem/Hem) results in FHIR format
      Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
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
      | field                                           | values                                            |
      | content.contained._id                           | IS_SET                                            |
      | content.contained.name.text                     | GLUCOSE                                           |
      | content.contained.name.coding.code              | urn:va:vuid:4665449                               |
      | content.contained.name.coding.display           | GLUCOSE                                           |
      | content.contained.name.coding.system            | urn:oid:2.16.840.1.113883.6.233                   |
      | content.contained.name.coding.code              | urn:lnc:2344-0                                    |
      | content.contained.name.coding.display           | GLUCOSE                                           |
      | content.contained.name.coding.system            | urn:oid:2.16.840.1.113883.4.642.2.58              |
      | content.contained.valueQuantity.value           | 106                                               |
      | content.contained.valueQuantity.units           | mg/dL                                             |
      | content.contained.interpretation.coding.system  | http://hl7.org/fhir/vs/observation-interpretation |
      | content.contained.interpretation.coding.code    | N                                                 |
      | content.contained.interpretation.coding.display | Normal                                            |
      | content.contained.referenceRange.high.value     | 110                                               |
      | content.contained.referenceRange.high.units     | mg/dL                                             |
      | content.contained.referenceRange.low.value      | 60                                                |
      | content.contained.referenceRange.low.units      | mg/dL                                             |
      | content.contained.status                        | final                                             |
      | content.contained.reliability                   | ok                                                |
      | content.contained.specimen.reference            | IS_SET                                            |
      | content.contained.specimen.display              | SERUM                                             |
      And the results contain lab "(Chem/Hem)" results
      | field                                          | values                                                          |
      | content.text.div                               | CONTAINS Accession: urn:va:accession:C877:227:CH;6949681.966383 |
      | content.contained._id                          | IS_SET                                                          |
      | content.contained.text.status                  | generated                                                       |
      | content.contained.identifier.label             | facility-code                                                   |
      | content.contained.identifier.value             | 500                                                             |
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
      | content.name.text                              | GLUCOSE                                                         |
      | content.name.coding.display                    | GLUCOSE                                                         |
      | content.name.coding.display                    | GLUCOSE                                                         |
      | content.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
      | content.status                                 | final                                                           |
      | content.issued                                 | 2005-03-17T03:36:00                                             |
      | content.subject.reference                      | Patient/11016V630869                                            |
      | content.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
      | content.performer.reference                    | IS_SET                                                          |
      | content.serviceCategory.coding.code            | CH                                                              |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
      | content.serviceCategory.coding.display         | Chemistry                                                       |
      | content.serviceCategory.text                   | Chemistry                                                       |
      | content.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
      | content.specimen.reference                     | IS_SET                                                          |
      | content.specimen.display                       | SERUM                                                           |
      | content.result.reference                       | IS_SET                                                          |
      | content.result.display                         | GLUCOSE                                                         |
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
      #And the lab field(s) just contain "Patient/11016V630869"
      #| field                                  |
      #| content.subject.reference              |
      #| content.contained.subject.reference    |


@F138_3_Labs_chem_fhir @fhir @9E7A100184
Scenario: Client can request lab (Chem/Hem) results in FHIR format
      Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      And a patient with pid "9E7A;100184" has been synced through the RDK API
      When the client requests lab "(Chem/Hem)" results for that patient "9E7A;100184"
      Then a successful response is returned
      Then the client receives 7 FHIR "VistA" result(s)
      And the client receives 7 FHIR "panorama" result(s)
      And the results contain lab "(Chem/Hem)" results
     | field                                       | value                                                   |
     | content.contained.subject.reference         | Patient/9E7A;100184                                     |
     | content.extension.url                       | http://vistacore.us/fhir/extensions/lab#groupName       |
     | content.extension.valueString               | CH 0429 152                                             |
     | content.contained.identifier.label          | facility-code                                           |
     | content.contained.identifier.value          | 500                                                     |
     | content.contained.name.coding.display       | GLUCOSE                                                 |
     | content.contained.valueQuantity.value       | 321                                                     |
     | content.contained.specimen.display          | SERUM                                                   |
     | content.contained.referenceRange.high.value | 123                                                     |
     | content.contained.referenceRange.high.units | mg/dL                                                   |
     | content.contained.referenceRange.low.value  | 60                                                      |
     | content.contained.referenceRange.low.units  | mg/dL                                                   |
     | content.text.div                            | CONTAINS urn:va:accession:9E7A:100184:CH;6969569.838468 |

@F138_4_Labs_chem_fhir @fhir @C877100184
Scenario: Client can request lab (Chem/Hem) results in FHIR format
      Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      And a patient with pid "C877;100184" has been synced through the RDK API
      When the client requests lab "(Chem/Hem)" results for that patient "C877;100184"
      Then a successful response is returned
      Then the client receives 7 FHIR "VistA" result(s)
      And the client receives 7 FHIR "kodak" result(s)
      And the results contain lab "(Chem/Hem)" results
     | field                                       | value                                                   |
     | content.contained.subject.reference         | Patient/C877;100184                                     |
     | content.extension.url                       | http://vistacore.us/fhir/extensions/lab#groupName       |
     | content.extension.valueString               | CH 0429 152                                             |
     | content.contained.identifier.label          | facility-code                                           |
     | content.contained.identifier.value          | 500                                                     |
     | content.contained.name.coding.display       | GLUCOSE                                                 |
     | content.contained.valueQuantity.value       | 321                                                     |
     | content.contained.specimen.display          | SERUM                                                   |
     | content.contained.referenceRange.high.value | 123                                                     |
     | content.contained.referenceRange.high.units | mg/dL                                                   |
     | content.contained.referenceRange.low.value  | 60                                                      |
     | content.contained.referenceRange.low.units  | mg/dL                                                   |
     | content.text.div                            | CONTAINS urn:va:accession:C877:100184:CH;6969569.838468 |

@F138_5_Labs_ch_neg_fhir @fhir @5000000009V082878
Scenario: Negative scenario.  Client can request lab (Chem/Hem) results in FHIR format
Given a patient with "No lab results" in multiple VistAs
When the client requests lab "(Chem/Hem)" results for that patient "5000000009V082878"
Then a successful response is returned
Then corresponding matching FHIR records totaling "1" are displayed

@F138_7_Labs_chem_fhir @fhir @11016V630869 @DE974
Scenario: Client can request lab (Chem/Hem) results in FHIR format
      Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
      When the client requests "10" lab "(Chem/Hem)" results for that patient "11016V630869" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 10        |

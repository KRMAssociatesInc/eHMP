 @labs_fhir @vxsync @patient
 Feature: F138 Return of Lab (Chem/Hem) Results in FHIR format

 #This feature item covers the return of Chemistry and Hematology Lab results in FHIR format. Also includes cases when no results exist.


 @F138_1_Labs_chem_fhir @fhir @11016V630869
 Scenario: Client can request lab (Chem/Hem) results in FHIR format
       Given a patient with "lab (Chem/Hem) results" in multiple VistAs
      # And a patient with pid "11016V630869" has been synced through the RDK API
       When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
       Then a successful response is returned
       Then the client receives 92 FHIR "VistA" result(s)
       And the client receives 46 FHIR "panorama" result(s)
       And the results contain lab "(Chem/Hem)" results
       | field                                 | panorama_value      |
       | resource.contained.valueQuantity.value | 17.5                |
       | resource.issued                        | 2005-03-17T03:36:00 |
       | resource.name.text           | PROTIME             |
       And the results contain lab "(Chem/Hem)" results
       | field                                           | values                                            |
       | resource.name.text                     | GLUCOSE                                           |
       | resource.name.coding.code              | urn:va:vuid:4665449                               |
       | resource.name.coding.display           | GLUCOSE                                           |
       | resource.name.coding.system            | urn:oid:2.16.840.1.113883.6.233                   |
       | resource.name.coding.code              | urn:lnc:2344-0                                    |
       | resource.name.coding.display           | GLUCOSE                                           |
       | resource.name.coding.system            | urn:oid:2.16.840.1.113883.4.642.2.58              |
       | resource.contained.valueQuantity.value           | 106                                               |
       | resource.contained.valueQuantity.units           | mg/dL                                             |
       | resource.contained.referenceRange.high.value     | 110                                               |
       | resource.contained.referenceRange.high.units     | mg/dL                                             |
       | resource.contained.referenceRange.low.value      | 60                                                |
       | resource.contained.referenceRange.low.units      | mg/dL                                             |
       | resource.contained.status                        | final                                             |
       | resource.contained.reliability                   | ok                                                |
       | resource.contained.specimen.display              | SERUM                                             |
  And the results contain lab "(Chem/Hem)" results
       | field                                          | values                                                          |
       | resource.text.div                               | CONTAINS Accession: urn:va:accession:9E7A:227:CH;6949681.966383 |
       | resource.contained.text.status                  | generated                                                       |
       | resource.contained.identifier.type.text         | facility-code                                                   |
       | resource.contained.identifier.value             | 500                                                             |
       | resource.contained.text.div                     | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
       | resource.contained.name                         | ALBANY VA MEDICAL CENTER                                        |
       | resource.contained.address.text                 | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
       | resource.contained.address.line                 | VA MEDICAL CENTER 1 3RD sT.                                     |
       | resource.contained.address.city                 | ALBANY                                                          |
       | resource.contained.address.state                | NY                                                              |
       | resource.contained.address.postalCode           | 12180-0097                                                      |
       | resource.contained.type.text                    | SERUM                                                           |
       | resource.contained.subject.reference            | Patient/11016V630869                                            |
       | resource.contained.collection.collectedDateTime | 2005-03-17T03:36:00                                             |
       | resource.text.status                            | generated                                                       |
       | resource.name.text                              | GLUCOSE                                                         |
       | resource.name.coding.display                    | GLUCOSE                                                         |
       | resource.name.coding.display                    | GLUCOSE                                                         |
       | resource.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
       | resource.status                                 | final                                                           |
       | resource.issued                                 | 2005-03-17T03:36:00                                             |
       | resource.subject.reference                      | Patient/11016V630869                                            |
       | resource.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
       | resource.serviceCategory.coding.code            | CH                                                              |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
       | resource.serviceCategory.coding.display         | Chemistry                                                       |
       | resource.serviceCategory.text                   | Chemistry                                                       |
       | resource.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
       | resource.specimen.display                       | SERUM                                                           |
       | resource.result.display                         | GLUCOSE                                                         |
       And the results contain lab "(Chem/Hem)" results
       | field                         | values                                             |
       | resource.subject.reference     | Patient/11016V630869                               |
       | resource.contained.type.text   | PLASMA                                             |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#groupName  |
       | resource.extension.valueString | COAG 0317 119                                      |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#groupUid   |
       | resource.extension.valueString | urn:va:accession:9E7A:227:CH;6949681.966382        |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#localId    |
       | resource.extension.valueString | CH;6949681.966382;430                              |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#orderUid   |
       | resource.extension.valueString | urn:va:order:9E7A:227:16688                        |


 @F138_2_Labs_chem_fhir @fhir @11016V630869
 Scenario: Client can request lab (Chem/Hem) results in FHIR format
       Given a patient with "lab (Chem/Hem) results" in multiple VistAs
       #And a patient with pid "11016V630869" has been synced through the RDK API
       When the client requests lab "(Chem/Hem)" results for that patient "11016V630869"
       Then a successful response is returned
       Then the client receives 92 FHIR "VistA" result(s)
       And the client receives 46 FHIR "kodak" result(s)
       And the results contain lab "(Chem/Hem)" results
       | field                                 | kodak_value         |
       | resource.contained.valueQuantity.value | 17.5                |
       | resource.issued                        | 2005-03-17T03:36:00 |
       | resource.name.text           | PROTIME             |
       And the results contain lab "(Chem/Hem)" results
       | field                                           | values                                            |
       | resource.name.text                     | GLUCOSE                                           |
       | resource.name.coding.code              | urn:va:vuid:4665449                               |
       | resource.name.coding.display           | GLUCOSE                                           |
       | resource.name.coding.system            | urn:oid:2.16.840.1.113883.6.233                   |
       | resource.name.coding.code              | urn:lnc:2344-0                                    |
       | resource.name.coding.display           | GLUCOSE                                           |
       | resource.name.coding.system            | urn:oid:2.16.840.1.113883.4.642.2.58              |
       | resource.contained.valueQuantity.value           | 106                                               |
       | resource.contained.valueQuantity.units           | mg/dL                                             |
#       | resource.contained.interpretation.coding.system  | http://hl7.org/fhir/vs/observation-interpretation |
#       | resource.contained.interpretation.coding.code    | N                                                 |
#       | resource.contained.interpretation.coding.display | Normal                                            |
       | resource.contained.referenceRange.high.value     | 110                                               |
       | resource.contained.referenceRange.high.units     | mg/dL                                             |
       | resource.contained.referenceRange.low.value      | 60                                                |
       | resource.contained.referenceRange.low.units      | mg/dL                                             |
       | resource.contained.status                        | final                                             |
       | resource.contained.reliability                   | ok                                                |
       | resource.contained.specimen.display              | SERUM                                             |
       And the results contain lab "(Chem/Hem)" results
       | field                                          | values                                                          |
       | resource.text.div                               | CONTAINS Accession: urn:va:accession:C877:227:CH;6949681.966383 |
       | resource.contained.text.status                  | generated                                                       |
       | resource.contained.identifier.type.text         | facility-code                                                   |
       | resource.contained.identifier.value             | 500                                                             |
       | resource.contained.text.div                     | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
       | resource.contained.name                         | ALBANY VA MEDICAL CENTER                                        |
       | resource.contained.address.text                 | CONTAINS VA MEDICAL CENTER 1 3RD sT. ALBANY, NY 12180-0097      |
       | resource.contained.address.line                 | VA MEDICAL CENTER 1 3RD sT.                                     |
       | resource.contained.address.city                 | ALBANY                                                          |
       | resource.contained.address.state                | NY                                                              |
       | resource.contained.address.postalCode           | 12180-0097                                                      |
       | resource.contained.type.text                    | SERUM                                                           |
       | resource.contained.subject.reference            | Patient/11016V630869                                            |
       | resource.contained.collection.collectedDateTime | 2005-03-17T03:36:00                                             |
       | resource.text.status                            | generated                                                       |
       | resource.name.text                              | GLUCOSE                                                         |
       | resource.name.coding.display                    | GLUCOSE                                                         |
       | resource.name.coding.display                    | GLUCOSE                                                         |
       | resource.name.coding.system                     | urn:oid:2.16.840.1.113883.4.642.2.58                            |
       | resource.status                                 | final                                                           |
       | resource.issued                                 | 2005-03-17T03:36:00                                             |
       | resource.subject.reference                      | Patient/11016V630869                                            |
       | resource.performer.display                      | ALBANY VA MEDICAL CENTER                                        |
       | resource.serviceCategory.coding.code            | CH                                                              |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074                                     |
       | resource.serviceCategory.coding.display         | Chemistry                                                       |
       | resource.serviceCategory.text                   | Chemistry                                                       |
       | resource.diagnosticDateTime                     | 2005-03-17T03:36:00                                             |
       | resource.specimen.display                       | SERUM                                                           |
       | resource.result.display                         | GLUCOSE                                                         |
       And the results contain lab "(Chem/Hem)" results
       | field                         | values                                             |
       | resource.subject.reference     | Patient/11016V630869                               |
       | resource.contained.type.text   | PLASMA                                             |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#groupName  |
       | resource.extension.valueString | COAG 0317 119                                      |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#groupUid   |
       | resource.extension.valueString | urn:va:accession:C877:227:CH;6949681.966382        |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#localId    |
       | resource.extension.valueString | CH;6949681.966382;430                              |
       | resource.extension.url         | http://vistacore.us/fhir/extensions/lab#orderUid   |
       | resource.extension.valueString | urn:va:order:C877:227:16688                        |



 @F138_3_Labs_chem_fhir @fhir @9E7A100184
 Scenario: Client can request lab (Chem/Hem) results in FHIR format
       Given a patient with "lab (Chem/Hem) results" in multiple VistAs
       #And a patient with pid "9E7A;100184" has been synced through the RDK API
       When the client requests lab "(Chem/Hem)" results for that patient "9E7A;100184"
       Then a successful response is returned
       Then the client receives 7 FHIR "VistA" result(s)
       And the client receives 7 FHIR "panorama" result(s)
       And the results contain lab "(Chem/Hem)" results
      | field                                       | value                                                   |
      | resource.contained.subject.reference         | Patient/9E7A;100184                                     |
      | resource.extension.url                       | http://vistacore.us/fhir/extensions/lab#groupName       |
      | resource.extension.valueString               | CH 0429 152                                             |
      | resource.contained.identifier.type.text      | facility-code                                           |
      | resource.contained.identifier.value          | 500                                                     |
      | resource.name.coding.display                 | GLUCOSE                                                 |
      | resource.contained.valueQuantity.value       | 321                                                     |
      | resource.contained.specimen.display          | SERUM                                                   |
      | resource.contained.referenceRange.high.value | 123                                                     |
      | resource.contained.referenceRange.high.units | mg/dL                                                   |
      | resource.contained.referenceRange.low.value  | 60                                                      |
      | resource.contained.referenceRange.low.units  | mg/dL                                                   |
      | resource.text.div                            | CONTAINS urn:va:accession:9E7A:100184:CH;6969569.838468 |

 @F138_4_Labs_chem_fhir @fhir @C877100184
 Scenario: Client can request lab (Chem/Hem) results in FHIR format
       Given a patient with "lab (Chem/Hem) results" in multiple VistAs
     #  And a patient with pid "C877;100184" has been synced through the RDK API
       When the client requests lab "(Chem/Hem)" results for that patient "C877;100184"
       Then a successful response is returned
       Then the client receives 7 FHIR "VistA" result(s)
       And the client receives 7 FHIR "kodak" result(s)
       And the results contain lab "(Chem/Hem)" results
      | field                                       | value                                                   |
      | resource.contained.subject.reference         | Patient/C877;100184                                     |
      | resource.extension.url                       | http://vistacore.us/fhir/extensions/lab#groupName       |
      | resource.extension.valueString               | CH 0429 152                                             |
      | resource.contained.identifier.type.text      | facility-code                                           |
      | resource.contained.identifier.value          | 500                                                     |
      | resource.name.coding.display                 | GLUCOSE                                                 |
      | resource.contained.valueQuantity.value       | 321                                                     |
      | resource.contained.specimen.display          | SERUM                                                   |
      | resource.contained.referenceRange.high.value | 123                                                     |
      | resource.contained.referenceRange.high.units | mg/dL                                                   |
      | resource.contained.referenceRange.low.value  | 60                                                      |
      | resource.contained.referenceRange.low.units  | mg/dL                                                   |
      | resource.text.div                            | CONTAINS urn:va:accession:C877:100184:CH;6969569.838468 |

 @F138_5_Labs_ch_neg_fhir @fhir @5000000009V082878
 Scenario: Negative scenario.  Client can request lab (Chem/Hem) results in FHIR format
 Given a patient with "No lab results" in multiple VistAs
 When the client requests lab "(Chem/Hem)" results for that patient "5000000009V082878"
 Then a successful response is returned
 Then corresponding matching FHIR records totaling "1" are displayed

 @F138_6_Labs_chem_fhir @fhir @11016V630869 @DE974
 Scenario: Client can request lab (Chem/Hem) results in FHIR format
       Given a patient with "lab (Chem/Hem) results" in multiple VistAs
       #And a patient with pid "11016V630869" has been synced through the RDK API
       When the client requests "10" lab "(Chem/Hem)" results for that patient "11016V630869" in FHIR format
       Then a successful response is returned
       And total returned resources are "10"
       And the results contain
       | name         | value     |
       | total        | 107        |

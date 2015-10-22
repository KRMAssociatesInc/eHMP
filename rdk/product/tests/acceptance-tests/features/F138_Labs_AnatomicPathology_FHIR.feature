 @F138_LabsPathology_FHIR @vxsync @patient
 Feature: F138 Return of Lab anatomic pathology Results in FHIR format

 #This feature item returns an order in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
 #Patients used: 11016V630869, 10104V248233, 10110V004877, 10117V810068, 10146V393772, 5123456789V027402

 @F138_1_Labs_pathology_fhir @fhir @11016V630869
 Scenario: Client can request lab anatomic pathology results in FHIR format
 	Given a patient with "lab anatomic pathology results" in multiple VistAs
# And a patient with pid "11016V630869" has been synced through the RDK API
 	When the client requests "anatomic pathology" results for that patient "11016V630869"
 	Then a successful response is returned
       And the results contain
       | name         | value     |
       | total | 1         |
 	And the results contain lab "anatomic pathology" results
       | field                                          | value                        |
       | resource.resourceType                           | DiagnosticReport             |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 2013-06-10T01:01:00          |
       | resource.name.text                    | LR ANATOMIC PATHOLOGY REPORT |
       | resource.status                                 | final                        |
       | resource.subject.reference                      | Patient/11016V630869         |
       | resource.performer.reference                    | IS_SET                       |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 2013-06-10T06:17:00          |
       | resource.serviceCategory.text                   | Other                        |
       | resource.serviceCategory.coding.code            | OTH                          |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Other                        |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId         |
       | resource.extension.valueString                  | 130610 P 33^AP                                          |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                         |
       | resource.identifier.value                       | urn:va:lab:DOD:0000000011:20130610091700_130610-P-33-AP |
       | resource.text.status                            | generated                                               |
       | resource.text.div                               | CONTAINS Procedure:CYTOLOGIC GYN                        |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text             | facility-code     |
       | resource.contained.identifier.value             | DOD               |
       #Observation
       | resource.contained.resourceType                 | Observation                       |
       | resource.contained.status                       | final                             |
       | resource.contained.reliability                  | ok                                |
       | resource.contained.valueString                  | CONTAINS Procedure:CYTOLOGIC GYN  |

 @F138_2_Labs_pathology_fhir @fhir @10110V004877
 Scenario: Client can request lab anatomic pathology results in FHIR format
 	Given a patient with "lab anatomic pathology results" in multiple VistAs
  #And a patient with pid "10110V004877" has been synced through the RDK API
 	When the client requests "anatomic pathology" results for that patient "10110V004877"
 	Then a successful response is returned
       And the results contain
       | name         | value     |
       # @TODO change to 16 for now
       | total | 16        |
 	And the results contain lab "anatomic pathology" results
       | field                                          | value                        |
       | resource.resourceType                           | DiagnosticReport             |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 2008-05-23T00:00:00          |
       | resource.name.text                              | LR ANATOMIC PATHOLOGY REPORT |
       | resource.name.coding.code                       | 719                          |
       | resource.name.coding.system                     | DOD_NCID                     |
       | resource.status                                 | final                        |
       | resource.subject.reference                      | Patient/10110V004877         |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text             | facility-code     |
       | resource.contained.identifier.value             | DOD               |
        #Specimen
       | resource.contained.resourceType                 | Specimen                          |
       | resource.contained.type.text                    | BONE MARROW                       |
       | resource.contained.subject.reference            | Patient/10110V004877              |
       | resource.contained.collection.collectedDateTime | 2008-05-23T16:00:00               |
       #Observation
       | resource.contained.resourceType                 | Observation                       |
       | resource.contained.code.text                    | LR ANATOMIC PATHOLOGY REPORT      |
       | resource.contained.code.coding.code             | 719                               |
       | resource.contained.code.coding.system           | DOD_NCID                          |
       | resource.contained.status                       | final                             |
       | resource.contained.reliability                  | ok                                |
       | resource.contained.valueString               | 080523 CN 19                      |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233  |
       | resource.identifier.value                       | urn:va:lab:DOD:0000000008:20080523160000_080523-BM-15-AP_719 |
       | resource.serviceCategory.text                   | Other                        |
       | resource.serviceCategory.coding.code            | OTH                          |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Other                        |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 2008-05-23T16:00:00          |
       | resource.specimen.display             | BONE MARROW |
       | resource.result.display | LR ANATOMIC PATHOLOGY REPORT |
       | resource.text.status | generated |

    And the results contain lab "anatomic pathology" results
       | resource.resourceType                           | DiagnosticReport             |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 2008-05-23T00:00:00          |
       | resource.name.text                              | LR ANATOMIC PATHOLOGY REPORT |
       | resource.name.coding.system                     | DOD_NCID                     |
       | resource.name.coding.code                       | 2000                          |
       | resource.status                                 | final                        |
       | resource.subject.reference                      | Patient/10110V004877         |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text         | facility-code     |
       | resource.contained.identifier.value             | DOD               |
        #Specimen
       | resource.contained.resourceType                 | Specimen                          |
       | resource.contained.type.text                    | VAGINAL CYTOLOGIC MATERIAL        |
       | resource.contained.subject.reference            | Patient/10110V004877              |
       | resource.contained.collection.collectedDateTime | 2008-05-23T15:37:00               |
       #Observation
       | resource.contained.resourceType                 | Observation                       |
       | resource.contained.code.text                    | LR ANATOMIC PATHOLOGY REPORT      |
       | resource.contained.code.coding.code             | 2000                               |
       | resource.contained.code.coding.system           | DOD_NCID                          |
       | resource.contained.status                       | final                             |
       | resource.contained.reliability                  | ok                                |
       | resource.contained.valueString                  | 080523 S 29                      |
       | resource.contained.specimen.display             | VAGINAL CYTOLOGIC MATERIAL |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233  |
       | resource.identifier.value                       | urn:va:lab:DOD:0000000008:20080523153700_080523-CG-22-AP_2000 |
       | resource.serviceCategory.text                   | Other                        |
       | resource.serviceCategory.coding.code            | OTH                          |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Other                        |
       | resource.specimen.display  | VAGINAL CYTOLOGIC MATERIAL |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 2008-05-23T16:00:00          |
       | resource.result.display | LR ANATOMIC PATHOLOGY REPORT |
       | resource.text.status | generated |

 @F138_3_Labs_pathology_fhir @fhir @10117V810068
 Scenario: Client can request lab anatomic pathology results in FHIR format
 	Given a patient with "lab anatomic pathology results" in multiple VistAs
    #   And a patient with pid "10117V810068" has been synced through the RDK API
 	When the client requests "anatomic pathology" results for that patient "10117V810068"
 	Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 2         |
       And the results contain lab "anatomic pathology" results
       | field                                          | value                        |
       | resource.name.text                              | LR CYTOPATHOLOGY REPORT      |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 1999-01-04                   |
       | resource.subject.reference                      | Patient/10117V810068         |
       | resource.performer.display                      | CAMP MASTER                  |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 1999-01-04                   |
       | resource.serviceCategory.text                   | Cytopathology                |
       | resource.serviceCategory.coding.code            | CP                           |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Cytopathology                |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
       | resource.extension.valueString                  | CY;7009895                                          |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
       | resource.extension.valueString                  | CY 99 1                                             |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
       | resource.extension.valueResource.reference      | Composition/urn:va:document:9E7A:428:CY;7009895 |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.identifier.value                       | urn:va:lab:9E7A:428:CY;7009895                  |
       | resource.specimen.display                       | NEC                                             |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text         | facility-code     |
       | resource.contained.identifier.value             | 500               |
       | resource.contained.name                         | CAMP MASTER       |
       | resource.contained.text.status                  | generated         |
       | resource.contained.text.div                     | <div>CAMP MASTER</div> |
       #Specimen
       | resource.contained.resourceType                 | Specimen                          |
       | resource.contained.type.text                    | NEC                               |
       | resource.contained.subject.reference            | Patient/10117V810068              |
       | resource.contained.collection.collectedDateTime | 1999-01-04                        |
       | resource.text.status                            | generated                         |
       # @TODO change to undefined as it appears to be a JSON encoding issue
       | resource.text.div                               | <div>undefined (NEC)</div>        |
       And the results contain lab "anatomic pathology" results
       | field                                          | value                        |
       | resource.name.text                              | LR CYTOPATHOLOGY REPORT      |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 1999-01-04                   |
       | resource.subject.reference                      | Patient/10117V810068         |
       | resource.performer.display                      | CAMP BEE                     |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 1999-01-04                   |
       | resource.serviceCategory.text                   | Cytopathology                |
       | resource.serviceCategory.coding.code            | CP                           |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Cytopathology                |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
       | resource.extension.valueString                  | CY;7009895                                          |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
       | resource.extension.valueString                  | CY 99 1                                             |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
       | resource.extension.valueResource.reference      | Composition/urn:va:document:C877:428:CY;7009895 |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                 |
       | resource.identifier.value                       | urn:va:lab:C877:428:CY;7009895                  |
       | resource.specimen.display                       | NEC                                             |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text         | facility-code     |
       | resource.contained.identifier.value             | 500               |
       | resource.contained.name                         | CAMP BEE          |
       | resource.contained.text.status                  | generated         |
       | resource.contained.text.div                     | <div>CAMP BEE</div> |
       #Specimen
       | resource.contained.resourceType                 | Specimen                          |
       | resource.contained.type.text                    | NEC                               |
       | resource.contained.subject.reference            | Patient/10117V810068              |
       | resource.contained.collection.collectedDateTime | 1999-01-04                        |
       | resource.text.status                            | generated                         |
       # @TODO change to from null to undefined for now as it appears to be a JSON conversion issue
       | resource.text.div                               | <div>undefined (NEC)</div>        |

 @F138_4_Labs_pathology_fhir @fhir @10146V393772
 Scenario: Client can request lab anatomic pathology results in FHIR format
 	Given a patient with "lab anatomic pathology results" in multiple VistAs
  #And a patient with pid "10146V393772" has been synced through the RDK API
 	When the client requests "anatomic pathology" results for that patient "10146V393772"
 	Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 8         |
       And the results contain lab "anatomic pathology" results
       | field                                          | value                        |
       | resource.name.text                              | LR SURGICAL PATHOLOGY REPORT |
       # comment the resource.issued as it appears to be a timezone issues
       #| resource.issued                                 | 1998-05-14T17:00:00          |
       | resource.subject.reference                      | Patient/10146V393772         |
       | resource.performer.display                      | CAMP BEE                     |
       # comment the resource.diagnosticDateTime as it appears to be a timezone issues
       #| resource.diagnosticDateTime                     | 1998-05-14T17:00:00          |
       | resource.serviceCategory.text                   | Surgical Pathology           |
       | resource.serviceCategory.coding.code            | SP                           |
       | resource.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
       | resource.serviceCategory.coding.display         | Surgical Pathology           |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
       | resource.extension.valueString                  | SP;7019484.83                                       |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
       | resource.extension.valueString                  | SP 98 8                                             |
       | resource.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
       | resource.extension.valueResource.reference      | Composition/urn:va:document:C877:301:SP;7019484.83  |
       | resource.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                     |
       | resource.identifier.value                       | urn:va:lab:C877:301:SP;7019484.83                   |
       | resource.specimen.display                       | PROSTATE CHIPS                                      |
       #Organization
       | resource.contained.resourceType                 | Organization      |
       | resource.contained.identifier.type.text             | facility-code     |
       | resource.contained.identifier.value             | 500               |
       | resource.contained.name                         | CAMP BEE          |
       | resource.contained.text.status                  | generated         |
       | resource.contained.text.div                     | <div>CAMP BEE</div> |
       #Specimen
       | resource.contained.resourceType                 | Specimen                          |
       | resource.contained.type.text                    | PROSTATE CHIPS                    |
       | resource.contained.subject.reference            | Patient/10146V393772              |
       | resource.contained.collection.collectedDateTime | 1998-05-14T17:00:00               |
       | resource.text.status                            | generated                         |
       # @TODO change to undefined as it appears to be a JSON encoding issue
       | resource.text.div                               | <div>undefined (PROSTATE CHIPS)</div>  |

# @F138_5_pathology_fhir @fhir @5123456789V027402
# Scenario: Client can break the glass when requesting anatomic pathology in FHIR format for a sensitive patient
#       Given a patient with "anatomic pathology" in multiple VistAs
#     When the client requests anatomic pathology for that sensitive patient "5123456789V027402"
#     Then a permanent redirect response is returned
#     When the client breaks glass and repeats a request for anatomic pathology for that patient "5123456789V027402"
#     Then a successful response is returned
#     And the results contain
#       | name          | value                                                                    |
#       # @TODO change to 7 for now, need to revisit if this is correct
#       | total         | 7                                                                        |

 @F138_6_Labs_pathology_neg_fhir @fhir @10104V248233
 Scenario: Negative scenario.  Client can request lab anatomic pathology results in FHIR format
    Given a patient with "No lab results" in multiple VistAs
    When the client requests "anatomic pathology" results for that patient "10104V248233"
    Then a successful response is returned
    Then corresponding matching FHIR records totaling "0" are displayed

 @F138_7_Labs_pathology_fhir @fhir @10110V004877 @DE974
 Scenario: Client can request lab anatomic pathology results in FHIR format
       Given a patient with "lab anatomic pathology results" in multiple VistAs
       #And a patient with pid "10110V004877" has been synced through the RDK API
       When the client requests "10" "anatomic pathology" results for that patient "10110V004877" in FHIR format
       Then a successful response is returned
       And total returned resources are "10"
       And the results contain
       | name         | value     |
       | total        | 16        |

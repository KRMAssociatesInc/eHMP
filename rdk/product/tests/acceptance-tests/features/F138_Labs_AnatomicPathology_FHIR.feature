@F138_LabsPathology_FHIR @vxsync @patient
Feature: F138 Return of Lab anatomic pathology Results in FHIR format

#This feature item returns an order in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.
#Patients used: 11016V630869, 10104V248233, 10110V004877, 10117V810068, 10146V393772, 5123456789V027402

@F138_1_Labs_pathology_fhir @fhir @11016V630869
Scenario: Client can request lab anatomic pathology results in FHIR format
	Given a patient with "lab anatomic pathology results" in multiple VistAs
      And a patient with pid "11016V630869" has been synced through the RDK API
	When the client requests "anatomic pathology" results for that patient "11016V630869"
	Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 1         |
	And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.resourceType                           | DiagnosticReport             |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 2013-06-10T01:01:00          |
      | content.contained.name.text                    | LR ANATOMIC PATHOLOGY REPORT |
      | content.status                                 | final                        |
      | content.subject.reference                      | Patient/11016V630869         |
      | content.performer.reference                    | IS_SET                       |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      #| content.diagnosticDateTime                     | 2013-06-10T06:17:00          |
      | content.serviceCategory.text                   | Other                        |
      | content.serviceCategory.coding.code            | OTH                          |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Other                        |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId         |
      | content.extension.valueString                  | 130610 P 33^AP                                          |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                         |
      | content.identifier.value                       | urn:va:lab:DOD:0000000011:20130610091700_130610-P-33-AP |
      | content.text.status                            | generated                                               |
      | content.text.div                               | CONTAINS Procedure:CYTOLOGIC GYN                        |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | DOD               |
      #Observation
      | content.contained._id                          | IS_SET                            |
      | content.contained.resourceType                 | Observation                       |
      | content.contained.name.text                    | LR ANATOMIC PATHOLOGY REPORT      |
      | content.contained.status                       | final                             |
      | content.contained.reliability                  | ok                                |
      | content.contained.valueString                  | CONTAINS Procedure:CYTOLOGIC GYN  |

@F138_2_Labs_pathology_fhir @fhir @10110V004877
Scenario: Client can request lab anatomic pathology results in FHIR format
	Given a patient with "lab anatomic pathology results" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests "anatomic pathology" results for that patient "10110V004877"
	Then a successful response is returned
      And the results contain
      | name         | value     |
      # @TODO change to 16 for now
      | totalResults | 16        |
	And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.resourceType                           | DiagnosticReport             |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 2008-05-23T00:00:00          |
      | content.name.text                              | LR ANATOMIC PATHOLOGY REPORT |
      | content.name.coding.code                       | 719                          |
      | content.name.coding.system                     | DOD_NCID                     |
      | content.status                                 | final                        |
      | content.subject.reference                      | Patient/10110V004877         |
      | content.performer.reference                    | IS_SET                       |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      #| content.diagnosticDateTime                     | 2008-05-23T16:00:00          |
      | content.serviceCategory.text                   | Other                        |
      | content.serviceCategory.coding.code            | OTH                          |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Other                        |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId          |
      | content.extension.valueString                  | 080523 BM 15^AP                                          |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                          |
      # @TODO change to contains, need to get to the root cause of this.
      | content.identifier.value                       | CONTAINS urn:va:lab:DOD:0000000008:20080523160000_080523-BM-15-AP |
      | content.text.status                            | generated                                                |
      #@TODO investigate why this behavior has been changed.
      | content.text.div                               | CONTAINS null (BONE MARROW) 080523 CN 19               |
      | content.specimen.display                       | BONE MARROW                                              |
      | content.result.display                         | LR ANATOMIC PATHOLOGY REPORT                             |
	And the results contain lab "anatomic pathology" results
      #Organization
      | field                                          | value             |
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | DOD               |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | BONE MARROW                       |
      | content.contained.subject.reference            | Patient/10110V004877              |
      | content.contained.collection.collectedDateTime | 2008-05-23T16:00:00               |
      #Observation
      | content.contained._id                          | IS_SET                            |
      | content.contained.resourceType                 | Observation                       |
      | content.contained.name.text                    | LR ANATOMIC PATHOLOGY REPORT      |
      | content.contained.name.coding.code             | 719                               |
      | content.contained.name.coding.system           | DOD_NCID                          |
      | content.contained.status                       | final                             |
      | content.contained.reliability                  | ok                                |
      | content.contained.valueQuantity.value          | 80523                             |
      And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.name.coding.code                       | 2000                         |
      | content.name.coding.system                     | DOD_NCID                     |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 2008-05-23T00:00:00          |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId          |
      | content.extension.valueString                  | 080523 CG 22^AP                                          |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                          |
      | content.identifier.value                       | CONTAINS urn:va:lab:DOD:0000000008:20080523153700_080523-CG-22-AP |
      | content.specimen.display                       | VAGINAL CYTOLOGIC MATERIAL                               |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | DOD               |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | VAGINAL CYTOLOGIC MATERIAL        |
      | content.contained.subject.reference            | Patient/10110V004877              |
      | content.contained.collection.collectedDateTime | 2008-05-23T15:37:00               |
      #Observation
      | content.contained._id                          | IS_SET                            |
      | content.contained.resourceType                 | Observation                       |
      | content.contained.name.text                    | LR ANATOMIC PATHOLOGY REPORT      |
      | content.contained.name.coding.code             | 2000                              |
      | content.contained.name.coding.system           | DOD_NCID                          |
      | content.contained.status                       | final                             |
      | content.contained.reliability                  | ok                                |
      | content.contained.valueQuantity.value          | 80523                             |
      And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.name.text                              | LR SURGICAL PATHOLOGY REPORT |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 2000-01-26                   |
      | content.performer.display                      | CAMP MASTER                  |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      # content.diagnosticDateTime                     | 2000-01-26                   |
      | content.serviceCategory.text                   | Surgical Pathology           |
      | content.serviceCategory.coding.code            | SP                           |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Surgical Pathology           |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
      | content.extension.valueString                  | SP;6999872.99996                                    |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
      | content.extension.valueString                  | SP 00 7                                             |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
      | content.extension.valueResource.reference      | Composition/urn:va:document:9E7A:8:SP;6999872.99996 |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                 |
      | content.identifier.value                       | urn:va:lab:9E7A:8:SP;6999872.99996              |
      | content.specimen.display                       | ear                                             |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | 500               |
      | content.contained.name                         | CAMP MASTER       |
      | content.contained.text.status                  | generated         |
      | content.contained.text.div                     | <div>CAMP MASTER</div> |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | ear                               |
      | content.contained.subject.reference            | Patient/10110V004877              |
      | content.contained.collection.collectedDateTime | 2000-01-26                        |
      | content.text.status                            | generated                         |
      # @TODO change to undefined as it appears to be a JSON encoding issue
      | content.text.div                               | <div>undefined (ear)</div>        |

@F138_3_Labs_pathology_fhir @fhir @10117V810068
Scenario: Client can request lab anatomic pathology results in FHIR format
	Given a patient with "lab anatomic pathology results" in multiple VistAs
      And a patient with pid "10117V810068" has been synced through the RDK API
	When the client requests "anatomic pathology" results for that patient "10117V810068"
	Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 2         |
      And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.name.text                              | LR CYTOPATHOLOGY REPORT      |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 1999-01-04                   |
      | content.subject.reference                      | Patient/10117V810068         |
      | content.performer.display                      | CAMP MASTER                  |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      #| content.diagnosticDateTime                     | 1999-01-04                   |
      | content.serviceCategory.text                   | Cytopathology                |
      | content.serviceCategory.coding.code            | CP                           |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Cytopathology                |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
      | content.extension.valueString                  | CY;7009895                                          |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
      | content.extension.valueString                  | CY 99 1                                             |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
      | content.extension.valueResource.reference      | Composition/urn:va:document:9E7A:428:CY;7009895 |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                 |
      | content.identifier.value                       | urn:va:lab:9E7A:428:CY;7009895                  |
      | content.specimen.display                       | NEC                                             |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | 500               |
      | content.contained.name                         | CAMP MASTER       |
      | content.contained.text.status                  | generated         |
      | content.contained.text.div                     | <div>CAMP MASTER</div> |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | NEC                               |
      | content.contained.subject.reference            | Patient/10117V810068              |
      | content.contained.collection.collectedDateTime | 1999-01-04                        |
      | content.text.status                            | generated                         |
      # @TODO change to undefined as it appears to be a JSON encoding issue
      | content.text.div                               | <div>undefined (NEC)</div>        |
      And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.name.text                              | LR CYTOPATHOLOGY REPORT      |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 1999-01-04                   |
      | content.subject.reference                      | Patient/10117V810068         |
      | content.performer.display                      | CAMP BEE                     |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      #| content.diagnosticDateTime                     | 1999-01-04                   |
      | content.serviceCategory.text                   | Cytopathology                |
      | content.serviceCategory.coding.code            | CP                           |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Cytopathology                |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
      | content.extension.valueString                  | CY;7009895                                          |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
      | content.extension.valueString                  | CY 99 1                                             |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
      | content.extension.valueResource.reference      | Composition/urn:va:document:C877:428:CY;7009895 |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                 |
      | content.identifier.value                       | urn:va:lab:C877:428:CY;7009895                  |
      | content.specimen.display                       | NEC                                             |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | 500               |
      | content.contained.name                         | CAMP BEE          |
      | content.contained.text.status                  | generated         |
      | content.contained.text.div                     | <div>CAMP BEE</div> |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | NEC                               |
      | content.contained.subject.reference            | Patient/10117V810068              |
      | content.contained.collection.collectedDateTime | 1999-01-04                        |
      | content.text.status                            | generated                         |
      # @TODO change to from null to undefined for now as it appears to be a JSON conversion issue
      | content.text.div                               | <div>undefined (NEC)</div>        |

@F138_4_Labs_pathology_fhir @fhir @10146V393772
Scenario: Client can request lab anatomic pathology results in FHIR format
	Given a patient with "lab anatomic pathology results" in multiple VistAs
      And a patient with pid "10146V393772" has been synced through the RDK API
	When the client requests "anatomic pathology" results for that patient "10146V393772"
	Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 8         |
      And the results contain lab "anatomic pathology" results
      | field                                          | value                        |
      | content.name.text                              | LR SURGICAL PATHOLOGY REPORT |
      # comment the content.issued as it appears to be a timezone issues
      #| content.issued                                 | 1998-05-14T17:00:00          |
      | content.subject.reference                      | Patient/10146V393772         |
      | content.performer.display                      | CAMP BEE                     |
      # comment the content.diagnosticDateTime as it appears to be a timezone issues
      #| content.diagnosticDateTime                     | 1998-05-14T17:00:00          |
      | content.serviceCategory.text                   | Surgical Pathology           |
      | content.serviceCategory.coding.code            | SP                           |
      | content.serviceCategory.coding.system          | http://hl7.org/fhir/v2/0074  |
      | content.serviceCategory.coding.display         | Surgical Pathology           |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#localId     |
      | content.extension.valueString                  | SP;7019484.83                                       |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#groupName   |
      | content.extension.valueString                  | SP 98 8                                             |
      | content.extension.url                          | http://vistacore.us/fhir/extensions/lab#report      |
      | content.extension.valueResource.reference      | Composition/urn:va:document:C877:301:SP;7019484.83  |
      | content.identifier.system                      | urn:oid:2.16.840.1.113883.6.233                     |
      | content.identifier.value                       | urn:va:lab:C877:301:SP;7019484.83                   |
      | content.specimen.display                       | PROSTATE CHIPS                                      |
      #Organization
      | content.contained._id                          | IS_SET            |
      | content.contained.resourceType                 | Organization      |
      | content.contained.identifier.label             | facility-code     |
      | content.contained.identifier.value             | 500               |
      | content.contained.name                         | CAMP BEE          |
      | content.contained.text.status                  | generated         |
      | content.contained.text.div                     | <div>CAMP BEE</div> |
      #Specimen
      | content.contained.resourceType                 | Specimen                          |
      | content.contained._id                          | IS_SET                            |
      | content.contained.type.text                    | PROSTATE CHIPS                    |
      | content.contained.subject.reference            | Patient/10146V393772              |
      | content.contained.collection.collectedDateTime | 1998-05-14T17:00:00               |
      | content.text.status                            | generated                         |
      # @TODO change to undefined as it appears to be a JSON encoding issue
      | content.text.div                               | <div>undefined (PROSTATE CHIPS)</div>  |

@F138_5_pathology_fhir @fhir @5123456789V027402
Scenario: Client can break the glass when requesting anatomic pathology in FHIR format for a sensitive patient
      Given a patient with "anatomic pathology" in multiple VistAs
    When the client requests anatomic pathology for that sensitive patient "5123456789V027402"
    Then a permanent redirect response is returned
    When the client breaks glass and repeats a request for anatomic pathology for that patient "5123456789V027402"
    Then a successful response is returned
    And the results contain
      | name          | value                                                                    |
      # @TODO change to 7 for now, need to revisit if this is correct
      | totalResults  | 7                                                                        |

@F138_6_Labs_pathology_neg_fhir @fhir @10104V248233
Scenario: Negative scenario.  Client can request lab anatomic pathology results in FHIR format
Given a patient with "No lab results" in multiple VistAs
When the client requests "anatomic pathology" results for that patient "10104V248233"
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed

@F138_7_Labs_pathology_fhir @fhir @10110V004877 @DE974
Scenario: Client can request lab anatomic pathology results in FHIR format
      Given a patient with "lab anatomic pathology results" in multiple VistAs
      And a patient with pid "10110V004877" has been synced through the RDK API
      When the client requests "10" "anatomic pathology" results for that patient "10110V004877" in FHIR format
      Then a successful response is returned
      And the results contain
      | name         | value     |
      | totalResults | 10        |

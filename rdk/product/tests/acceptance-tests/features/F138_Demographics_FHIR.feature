@Demographics_FHIR @vxsync @patient
Feature: F138 Return of Demographics in FHIR format

#This feature item returns Demographics data in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.


@US2344 @fhir @5000000217V519385
Scenario: Client can request demographics in FHIR format
    Given a patient with "demographics" in multiple VistAs
      And a patient with pid "5000000217V519385" has been synced through the RDK API
    When the client requests demographics for that patient "5000000217V519385"
    Then a successful response is returned
    And the results contain
    | demographics_supplemental_list | demographics_values |
    | resourceType                   | Patient             |
     # defined on wiki and found in json
      | text.status           | generated                                   |
      | text.div              | <div>EIGHT,INPATIENT. SSN: 666000808</div>  |
      | gender.coding.system  | http://hl7.org/fhir/v3/AdministrativeGender |
      | gender.coding.code    | M                                           |
      | gender.coding.display | Male                                        |
     #| extension[service-connected].url
      | extension.url              | http://vistacore.us/fhir/profiles/@main#service-connected |
      | extension.valueCoding.code | N                                                         |
      # identifier[ssn]
      | identifier.label  | ssn                            |
      | identifier.use    | official                       |
      | identifier.system | http://hl7.org/fhir/sid/us-ssn |
      | identifier.value  | 666000808                      |
      # identifier[zzz uid]
      | identifier.label  | uid                               |
      | identifier.system | http://vistacore.us/fhir/id/uid   |
      | identifier.value  | urn:va:patient:9E7A:100716:100716 |
      # identifier[y icn]
      | identifier.label  | icn                             |
      | identifier.system | http://vistacore.us/fhir/id/icn |
      | identifier.value  | 5000000217V519385               |
      #identifier[z dfn]
      | identifier.label  | dfn                             |
      | identifier.system | http://vistacore.us/fhir/id/dfn |
      | identifier.value  | 100716                          |
     # only in json, not defined on wiki
      | resourceType                  | Patient           |
      | extension.valueCoding.code    | N                 |
      | extension.valueCoding.display | Service Connected |
      | name.text                     | EIGHT,INPATIENT   |


@US2344_mar @fhir @10105V001065
Scenario: Client can request demographics in FHIR format
    Given a patient with "demographics" in multiple VistAs
      And a patient with pid "10105V001065" has been synced through the RDK API
    When the client requests demographics for that patient "10105V001065"
    Then a successful response is returned
    And the results contain
      | demographics_supplemental_list     | demographics_values                                               |
      | maritalStatus.coding.system        | http://hl7.org/fhir/v3/MaritalStatus                              |
      | maritalStatus.coding.code          | S                                                                 |
      | maritalStatus.coding.display       | Never Married                                                     |
      | extension.url                      | http://vistacore.us/fhir/profiles/@main#religion                  |
      | extension.url                      | http://vistacore.us/fhir/profiles/@main#service-connected-percent |
      | extension.url                      | http://vistacore.us/fhir/profiles/@main#service-connected         |
      | telecom.use                        | work                                                              |
      | telecom.value                      | (222)555-7720                                                     |
      | telecom.system                     | phone                                                             |
      | telecom.use                        | home                                                              |
      | telecom.value                      | (222)555-8235                                                     |
      | telecom.system                     | phone                                                             |
      | contact.relationship.coding.system | http://hl7.org/fhir/patient-contact-relationship                  |
      | contact.relationship.coding.code   | family                                                            |
      | contact.name.use                   | usual                                                             |
      | contact.name.text                  | VETERAN,BROTHER                                                   |
     #contained[Organization][x].id
      | contained._id                  | IS_SET        |
      | contained.identifier.label     | facility-code |
      | contained.identifier.value     | 998           |
      | contained.name                 | ABILENE (CAA) |
      | managingOrganization.reference | IS_SET        |
    # in json, but not defined on wiki
      | extension.valueCoding.code          | urn:va:pat-religion:99 |
      | extension.valueCoding.display       | ROMAN CATHOLIC CHURCH  |
      | extension.valueQuantity.value       | 10                     |
      | extension.valueQuantity.units       | %                      |
      | extension.valueCoding.code          | Y                      |
      | extension.valueCoding.display       | Service Connected      |
      | contact.relationship.coding.display | Next of Kin            |
      | address.line                        | Any Street             |
      | address.zip                         | 99998                  |
      | address.state                       | WV                     |


@US2344_SEN @fhir @9E7A167
Scenario: Client can break the glass when requesting demographics in FHIR format for a sensitive patient
    Given a patient with "demographics" in multiple VistAs
    When the client requests demographics for that sensitive patient "urn:va:patient:9E7A:167:167"
    Then a permanent redirect response is returned
    #When the client breaks glass and repeats a request for demographics for that patient "urn:va:patient:9E7A:167:167"
    #Then a successful response is returned
    #And the results contain
    #  | demographics_supplemental_list                   | demographics_values                          |
    #  | extension.valueCoding.code    | urn:va:pat-religion:7                             |
    #  | extension.valueCoding.display | UNITED CHURCH OF CHRIST                           |
    #  | extension.url                 | http://vistacore.us/fhir/profiles/@main#sensitive |
    #  | extension.valueBoolean        | true                                              |
    #  | identifier.system             | http://vistacore.us/fhir/id/lrdfn                 |
    #  | identifier.label              | lrdfn                                             |
    #  | identifier.value              | 144                                               |

@US2344_WIKI @fhir @C877100022
Scenario: Client can request demographics in FHIR format
    Given a patient with "demographics" in multiple VistAs
    When the client requests demographics for that patient "urn:va:patient:C877:100022:100022"
    Then a successful response is returned
    And the results contain
     | demographics_supplemental_list | demographics_values |
     | resourceType                   | Patient             |
     # defined on wiki and found in json
      | text.status           | generated                                   |
      | text.div              | <div>BCMA,EIGHT. SSN: 666330008</div>       |
      | gender.coding.system  | http://hl7.org/fhir/v3/AdministrativeGender |
      | gender.coding.code    | M                                           |
      | gender.coding.display | Male                                        |
     #| extension[service-connected].url
      | extension.url              | http://vistacore.us/fhir/profiles/@main#service-connected |
      | extension.valueCoding.code | N                                                         |
      # identifier[ssn]
      | identifier.label  | ssn                            |
      | identifier.use    | official                       |
      | identifier.system | http://hl7.org/fhir/sid/us-ssn |
      | identifier.value  | 666330008                      |
      # identifier[zzz uid]
      | identifier.label  | uid                               |
      | identifier.system | http://vistacore.us/fhir/id/uid   |
      | identifier.value  | urn:va:patient:C877:100022:100022 |
      # identifier[y icn]
      | identifier.label  | lrdfn                             |
      | identifier.system | http://vistacore.us/fhir/id/lrdfn |
      | identifier.value  | 418                               |
      #identifier[z dfn]
      | identifier.label  | dfn                             |
      | identifier.system | http://vistacore.us/fhir/id/dfn |
      | identifier.value  | 100022                          |
     # only in json, not defined on wiki
      | resourceType                  | Patient           |
      | extension.valueCoding.code    | N                 |
      | extension.valueCoding.display | Service Connected |
      | name.text                     | BCMA,EIGHT        |

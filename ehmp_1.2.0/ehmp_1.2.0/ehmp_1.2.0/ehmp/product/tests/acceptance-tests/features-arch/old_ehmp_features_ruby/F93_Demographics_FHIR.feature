@Demographics_FHIR
Feature: F93 Return of Demographics in FHIR format

#This feature item returns Demographics data in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.


@US949 @fhir
Scenario: Client can request demographics in FHIR format
    Given a patient with "demographics" in multiple VistAs
    Given a patient with pid "5000000217V519385" has been synced through Admin API
    When the client requests demographics for that patient "5000000217V519385"
    Then a successful response is returned
    And the results contain
    |demographics_supplemental_list        	| demographics_values                                                         |
     | resourceType                                          | Bundle                                                     |
     # not listed on wiki
      | title                                                 | Patient with subject.identifier '5000000217V519385'       |
      | id                                                    | IS_SET                                                    |
      | link.rel                                              | self                                                      |
      | link.href                                             | CONTAINS /fhir/patient?identifier=5000000217V519385&_format=json       |
      | totalResults                                          | 6                                                         |
      | updated                                               | IS_FORMATTED_DATE                                         |
      | author.name                                           | eHMP                                                      |
      | author.uri                                            | https://ehmp.vistacore.us                                 |
      | entry.title                                           | patient for patient [5000000217V519385]                   |
     # | entry.id                                              | CONTAINS /fhir/patient?identifier=5000000217&_format=json/@     |
      | entry.link.rel                                        | self                                                      |
     # | entry.link.href                                       | CONTAINS /fhir/patient?identifier=5000000217&_format=json/@     |
      | entry.updated                                         | IS_FORMATTED_DATE                                         |
      | entry.published                                       | IS_FORMATTED_DATE                                         |
      | entry.author.name                                     | eHMP                                                      |
      | entry.author.uri                                      | https://ehmp.vistacore.us                                 |
     # defined on wiki and found in json
      | entry.content.text.status                             | generated                                                 |
      | entry.content.text.div                                | <div>EIGHT,INPATIENT. SSN: 666000808</div>                |
      | entry.content.gender.coding.system                    | http://hl7.org/fhir/v3/AdministrativeGender               |
      | entry.content.gender.coding.code                      | M                                                         |
      | entry.content.gender.coding.display                   | Male                                                      |
      | entry.content.name.use                                | official                                                  |
      | entry.content.name.family                             | EIGHT                                                     |
      | entry.content.name.given                              | INPATIENT                                                 |
      | entry.content.birthDate                               | 1945-03-09                                                |
      #| extension[service-connected].url
      | entry.content.extension.url                           | http://vistacore.us/fhir/profiles/@main#service-connected |
      | entry.content.extension.valueCoding.code              | N                                                         |
      # identifier[ssn]
      | entry.content.identifier.label                   	   | ssn                                                      |
      | entry.content.identifier.use                          | official                                                  |
      | entry.content.identifier.system                       | http://hl7.org/fhir/sid/us-ssn                            |
      | entry.content.identifier.value                        | 666000808    										      |
      # identifier[zzz uid]
      | entry.content.identifier.label                        | uid                                                       |
      | entry.content.identifier.system                       | http://vistacore.us/fhir/id/uid                           |
      | entry.content.identifier.value                        | urn:va:patient:9E7A:100716:100716                         |
      # identifier[y icn]
      | entry.content.identifier.label                        | icn                                                       |
      | entry.content.identifier.system                       | http://vistacore.us/fhir/id/icn                           |
      | entry.content.identifier.value                        | 5000000217V519385                                         |
      #identifier[z dfn]
      | entry.content.identifier.label                        | dfn                                                       |
      | entry.content.identifier.system                       | http://vistacore.us/fhir/id/dfn                           |
      | entry.content.identifier.value                        | 100716                                                    |
      | entry.content.address.line                            | Any Street                                                |
      | entry.content.address.city                            | Any Town                                                  |
     # only in json, not defined on wiki
      | entry.content.resourceType                            | Patient                                                   |
      | entry.content.extension.valueCoding.code              | N                                                         |
      | entry.content.extension.valueCoding.display           | Service Connected                                         |
      | entry.content.name.text                               | EIGHT,INPATIENT                                           |

#totalResults are updated from 2 to 5 as demographics are added to the secondary sites (DE53)


@US949_mar @fhir
Scenario: Client can request demographics in FHIR format
    Given a patient with "demographics" in multiple VistAs
    Given a patient with pid "10105V001065" has been synced through Admin API
    When the client requests demographics for that patient "10105V001065"
    Then a successful response is returned
    And the results contain
      |demographics_supplemental_list        	| demographics_values                                                         |
      | entry.content.maritalStatus.coding.system         | http://hl7.org/fhir/v3/MaritalStatus                              |
      | entry.content.maritalStatus.coding.code           | S                                                                 |
      | entry.content.maritalStatus.coding.display        | Never Married                                                     |
      | entry.content.extension.url                       | http://vistacore.us/fhir/profiles/@main#religion                  |
      | entry.content.extension.url                       | http://vistacore.us/fhir/profiles/@main#service-connected-percent |
      | entry.content.extension.url                       | http://vistacore.us/fhir/profiles/@main#service-connected         |
      | entry.content.telecom.use                         | work                                                              |
      | entry.content.telecom.value                       | (222)555-7720                                                     |
      | entry.content.telecom.system                      | phone                                                             |
      | entry.content.telecom.use                         | home                                                              |
      | entry.content.telecom.value                       | (222)555-8235                                                     |
      | entry.content.telecom.system                      | phone                                                             |
      | entry.content.contact.relationship.coding.system  | http://hl7.org/fhir/patient-contact-relationship                  |
      | entry.content.contact.relationship.coding.code    | family                                                            |
      | entry.content.contact.name.use                    | usual                                                             |
      | entry.content.contact.name.text                   | VETERAN,BROTHER                                                   |
     #contained[Organization][x].id
      | entry.content.contained._id | IS_SET |
      | entry.content.contained.identifier.label| facility-code|
      | entry.content.contained.identifier.value | 998 |
      | entry.content.contained.name |ABILENE (CAA)|
      | entry.content.managingOrganization.reference     | IS_SET                                                             |
    # in json, but not defined on wiki
      | entry.content.extension.valueCoding.code          | urn:va:pat-religion:99                                            |
      | entry.content.extension.valueCoding.display       | ROMAN CATHOLIC CHURCH                                             |
      | entry.content.extension.valueQuantity.value       | 10                                                                |
      | entry.content.extension.valueQuantity.units       | %                                                                 |
      | entry.content.extension.valueCoding.code          | Y                                                                 |
      | entry.content.extension.valueCoding.display       | Service Connected                                				  |
      | entry.content.contact.relationship.coding.display | Next of Kin                                                       |
      | entry.content.address.line                        | Any Street                                                        |
      | entry.content.address.zip                         | 99998                                                        |
      | entry.content.address.state                       | WV                                                                |



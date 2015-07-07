@Demographics_FHIR
Feature: F93 Return of Demographics in FHIR format

#This feature item returns Demographics data in FHIR format from all VistA instances in which a patient record exists. It includes breaking the glass for a sensitive patient.


@US949_SEN @fhir @debug @DE141
Scenario: Client can break the glass when requesting demographics in FHIR format for a sensitive patient
    Given a patient with "demographics" in multiple VistAs
    Given a patient with pid "9E7A;167" has been synced through Admin API
    When the client requests demographics for that sensitive patient "9E7A;167"
    Then a temporary redirect response is returned
    When the client breaks glass and repeats a request for demographics for that patient "9E7A;167"
    Then a successful response is returned
    And the results contain
      | demographics_supplemental_list                   | demographics_values                          |
      | entry.content.extension.valueCoding.code    | urn:va:pat-religion:7                             |
      | entry.content.extension.valueCoding.display | UNITED CHURCH OF CHRIST                           |
      | entry.content.extension.url                 | http://vistacore.us/fhir/profiles/@main#sensitive |
      | entry.content.extension.valueBoolean        | true                                              |
      | entry.content.identifier.system             | http://vistacore.us/fhir/id/lrdfn                 |
      | entry.content.identifier.label              | lrdfn                                             |
      | entry.content.identifier.value              | 144                                               |



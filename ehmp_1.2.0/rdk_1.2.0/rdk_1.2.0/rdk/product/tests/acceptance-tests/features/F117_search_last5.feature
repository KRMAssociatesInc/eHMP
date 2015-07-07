@F117_searchlast5 @US1971 @vxsync @enrich
Feature: F117 Searching for patient with first letter of last name + last 4 social security number digits

  Background:
      #Given a patient with "last5"

  @US1971 @F117_searchlast5_1
  Scenario: When a user searches for patient with first letter of last name + last 4 social security number digits
    When the client requests for the patient "B0008" starting with "0" and limited to "5"
    Then a successful response is returned
    And the client receives 1 VPR VistA result(s)
    And the client receives 1 RDK result(s) with start index of 0 and results limit of 5 per page
    And the RDK last5 search results contain
      | field       | value                                        |
      | displayName | Bcma,Eight                                   |
      | birthDate   | 19350407                                     |
      | familyName  | BCMA                                         |
      | genderName  | Male                                         |
      | givenNames  | EIGHT                                        |
      | pid         | 9E7A;100022                                  |
      | ssn         |  *****0008                                    |
      | uid         | CONTAINS urn:va:pt-select:9E7A:100022:100022 |
      | last4       | 0008                                         |
      | last5       | B0008                                        |
      | summary     | Bcma,Eight                                   |
      | localId     | 100022                                       |

  @US1971 @F117_searchlast5_2
  Scenario: When a user searches for patient with patient limited to 0
    When the client sends a request for the patient "Z8372" starting with "0"
    Then a successful response is returned
    #And the client receives 0 RDK result(s) with start index of 0
    And the client receives 0 VPR VistA result(s)

  @US1971 @F117_searchlast5_3
  Scenario: When a user searches for patient atient limited to 1 and should not contain uidHref
    When the client requests for the patient "B0008" starting with "0" and limited to "1"
    Then a successful response is returned
    #And the client receives 1 RDK result(s) with start index of 0
    And the client receives 1 VPR VistA result(s)
    And the result(s) should not contain "uidHref"

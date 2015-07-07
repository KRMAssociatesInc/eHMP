@Cache_Implement
Feature: F6 Cache Implementation
Creation of a NOSQL database (LEIPR) to store patient data from multiple sources.


@US375
Scenario: Clear patient from cache (LEIPR database)
    Given a patient with id "E2" has been synced
    When a client requests "vital" for patient with id "E2"
    Then a successful response is returned within "60" seconds
    When a client requests clear-cache operation for patient with id "E2"
    Then the response status must be successful
    When a client requests "vital" for patient with id "E2"
    Then the response status must be accepted
    And the response header includes "Retry-After"
    And the response header of "Retry-after" has a value of "10"
    Then a successful response is returned within "60" seconds
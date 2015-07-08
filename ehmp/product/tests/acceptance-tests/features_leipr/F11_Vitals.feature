@Vitals
Feature: F11 Vitals
    Vitals data that is requested for a patient will be returned for all VistA instances in which Vitals data exists for that patient and stored in the LEIPR.


@future @US386
Scenario Outline: LEIPR to support Vitals LEIPR data type with mandatory fields
    Given a patient with id "<patient_id>" has not been synced
    When a client requests "vital" for patient with id "<patient_id>"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back
    And the response contains the Vitals field with title "status"
    And the response contains the Vitals field with title "reliability"kjdfhkadshf
    And the response contains the Vitals field with title "name"
@F312 @patientphotos

Feature: F312 - Patient Photos

#POC:Team Pluto

Background:
    Given user is logged into eHMP-UI

 @US5654 @patientSearchScreen @future
 Scenario: Verifies that the patient image is displayed on the patient search screen for a non-sensitive patient.
    When user searches for "Eight,Patient" to validate patient photo
    Then the patient search photo is displayed

 @US5654 @patientSearchScreen @future
 Scenario: Verifies that the patient image is displayed on the patient search screen for a sensitive patient.
    When user searches for "Employee,One" to validate patient photo
    Then the patient search photo is displayed

@US5654 @coversheetRefresh @future
 Scenario: Verifies that the patient image is displayed on the coversheet for a non-sensitive patient.
    And user searches for and selects "EIGHT,Patient"
    Then Cover Sheet is active
    And the coversheet patient photo is displayed
    Then the coversheet is refreshed
    And the coversheet patient photo is displayed

@US5654 @coversheetRefresh @future
 Scenario: Verifies that the patient image is displayed on the coversheet for a sensitive patient.
    And user searches for and selects "ZZZRETIREDSIXTYTWO,PATIENT"
    Then Cover Sheet is active
    And the coversheet patient photo is displayed
    Then the coversheet is refreshed
    And the coversheet patient photo is displayed

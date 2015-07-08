@F312 @patientphotos

Feature: F312 - Patient Photos

#POC:Team Pluto

Background:
    Given user is logged into eHMP-UI

 @US5654 @patientSearchScreen
 Scenario: To display the patient image on the patient search screen.
    #And user searches for and selects "EIGHT,Patient"
    When user searches for "EIGHT,Patient" to validate patient photo
	Then the patient search photo is displayed

@US5654 @coversheetRefresh
 Scenario: To display the patient image on the patient selection screen.
    And user searches for and selects "EIGHT,Patient"
    Then Cover Sheet is active
    And the coversheet patient photo is displayed
    Then the coversheet is refreshed
    And the coversheet patient photo is displayed

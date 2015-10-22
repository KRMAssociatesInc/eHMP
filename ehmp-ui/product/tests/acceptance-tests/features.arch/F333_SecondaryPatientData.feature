@F333 @DemographicSecondaryPatientData

Feature: F333 - Global search of patients outside local VistA

# POC: Team Saturn 

@F333-1.1_DemographicSecondaryPatientDoD @US5720 @DE1203 @debug
Scenario: Demographic information for secondary patients displays in demographic detail dropdown
 Given user is logged into eHMP-UI
    Then the patient search screen is displayed
    And the User selects All Patient
    Then the user is on all patient tab "Nationwide"
    And user enters full last name in all patient search "Dodonly"
    And user enters first name in all patient search "Patient"
    And the user click on All Patient Search
    And the user select all patient result patient name "DODONLY,PATIENT"
    Then the all patient "patient identifying name" is displayed on confirm section header
    | field                     | value                 |
    | patient identifying name  | DODONLY,PATIENT |
    Then wait
    And the user click on Confirm Selection
    Then wait
    Then Default Screen is active
    Then user selects Patient Name drop down
    #Field data
    And the Patient's "Home Phone" is "(301) 222-3333"
    And the Patient's "Home Address line1" is "Lost Street"
    And the Patient's "Home Address line2" is "Norfolk, VA, 20152"

@F333-1.2_DemographicSecondaryPatientICN @US5720 @debug @DE1203
  Scenario: Demographic information for secondary patients displays in demographic detail dropdown
    Given user is logged into eHMP-UI
    Then the patient search screen is displayed
    And the User selects All Patient
    Then the user is on all patient tab "Nationwide"
    And user enters full last name in all patient search "Icnonly"
    And user enters first name in all patient search "Patient"
    And the user click on All Patient Search
    And the user select all patient result patient name "ICNONLY,PATIENT"
    Then the all patient "patient identifying name" is displayed on confirm section header
    | field                     | value                 |
    | patient identifying name  | ICNONLY,PATIENT |
    Then wait
    And the user click on Confirm Selection
    Then wait
    Then Default Screen is active
    Then user selects Patient Name drop down
    #Field data
    And the Patient's "Home Phone" is "(301) 222-3334"
    And the Patient's "Home Address line1" is "Icn Street"
    And the Patient's "Home Address line2" is "Norfolk, VA, 20152"

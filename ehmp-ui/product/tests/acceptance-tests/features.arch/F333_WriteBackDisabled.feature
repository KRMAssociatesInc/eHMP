@F333 @DisableWriteBack @regression

Feature: F333 - Global search of patients outside local VistA

# POC: Team Saturn

@F333-2.1_WriteBackDisabledCoversheet @US5082 @US5070 
Scenario: Disable Write Back for NonVista patient (Secondary Patient) from coversheet
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

    Then Cover Sheet is active
    Then the "AllergyPlusButton" is not visible
    Then the "ConditionPlusButton" is not visible
    Then the "ImmunizationsPlusButton" is not visible
    Then the "VitalsPlusButton" is not visible
    And the "New Observation Button" is not visible

@F333-2.1_WriteBackDisabledMaxView @US5082 @US5070
  Scenario: Disable Write Back for NonVista patient (Secondary Patient) from maximize View
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
    Then Cover Sheet is active
    When the "Allergy" applet expanded
    Then the "AllergyPlusButton" is not visible
    Then Cover Sheet is active
    When the "Condition" applet expanded
    Then the "ConditionPlusButton" is not visible
    Then Cover Sheet is active
    When the "Vitals" applet expanded
    Then the "VitalsPlusButton" is not visible
    Then Cover Sheet is active
    When the "Immunizations" applet expanded
    Then the "ImmunizationsPlusButton" is not visible
    And the "New Observation Button" is not visible
    When user selects Meds Review from Coversheet dropdown
    # Then the Med Review is active
    Then the "Add Non-VA-Med button" is not visible

@WriteBackEnabledMaxView @US5082 @onc @future
  Scenario: Checks Write Back enabled on onc for vista patients
    Given user is logged into eHMP-UI
    And user searches for and selects "Ten,Patient"
    Then Overview is active
    Then Cover Sheet is active
    When the "Allergy" applet expanded
    Then the "AllergyPlusButton" is visible
    Then Cover Sheet is active
    When the "Condition" applet expanded
    Then the "ConditionPlusButton" is visible
    When user selects Meds Review from Coversheet dropdown
    #Then the Med Review is active
    #Then the "Add Non-VA-Med button" is visible
    Then Cover Sheet is active
    When the "Vitals" applet expanded
    Then the "VitalsPlusButton" is visible
    Then Cover Sheet is active
    When the "Immunizations" applet expanded
    Then the "ImmunizationsPlusButton" is visible
    And the "New Observation Button" is visible


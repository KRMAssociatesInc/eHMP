@F144_patientflags @future @regression

Feature:  The UI needs to be updated to include patient flag data returned from the patient demographics resource. The patient flags should be displayed at the time of patient selection and in the patient header.

#POC: Team Mercury
# There is no data for this test to run in jenkins

Background:
    Given user is logged into eHMP-UI

@select_behavioral_patient
Scenario: user selects patient with behavioral flags
    And the User selects mysite and All
    And user enters full last name "One,Patient"
    And the user select patient name "ONE,PATIENT"
    Then the user click on Confirm Selection
    And the results for PATIENT contain
     |value         |
     | 07/07/2005   |
     | PROVIDER,ONE          |
     | ZZ ALBANY-PRRTP        |
     | ZZ ALBANY-PRRTP   |
    Then the user click on Confirm
    Then Cover Sheet is active

@select_behavioral_1_patient
Scenario: user selects patient with behavioral flags
    And the User selects mysite and All
    And user enters full last name "SEVENTY,PATIENT "
    And the user select patient name "SEVENTY,PATIENT"
    Then the user click on Confirm Selection
    And the results for PATIENT contain
     |value         |
     | 07/07/2005   |
     | PROVIDER,ONE          |
     | ZZ ALBANY-PRRTP        |
     | ZZ ALBANY-PRRTP   |     
    Then the user click on Confirm
    Then Cover Sheet is active
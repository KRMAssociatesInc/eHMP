@F144_DefaultPatientSearch @regression
Feature: F144- Default Patient Search

#This feature performs search using Default option similar to CPRS Default search

# Team Andromeda

@f144_defaultPatientSearch @US1972 @vimm @DE1589
Scenario: default patient search
    Given user views the login screen
    When user attempts login
        | field      | value    |
        | Facility   | PANORAMA |
        | AccessCode | 1tdnurse |
        | VerifyCode | tdnurse1 |
        | SignIn     |          |
    Then the patient search screen is displayed
    And the User selects MyCPRSList
    Then the user select default result patient name "EIGHTEEN,INPATIENT"
    And the all patient "patient identifying name" is displayed on confirm section header
        | field                     | value                      |
        | patient identifying name  | EIGHTEEN,INPATIENT         |
    And the all patient "patient identifying traits" is displayed on confirm section
        | field         | value                      |
        | dob           | 03/09/1945                 |
        | age           | 70y                        |
        | gender        | Male                       |
        | ssn           | 666-00-0818                |
    When the user click on Confirm Selection
    Then Default Screen is active
    And the "patient identifying traits" is displayed with information
        | field         | value                      |
        | patient name  | Eighteen,Inpatient         |

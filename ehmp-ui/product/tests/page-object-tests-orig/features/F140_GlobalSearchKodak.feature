@f140_12_KodakOnlyPatient_2 @DE271 @debug
Feature: F140 – All Patient Search-Kodak

Background:
    Given I have a browser available
    And   I am logged into EHMP-UI "KODAK" as "pu1234" with password "pu1234!!"
    Then  I can see the landing page
    And   user selects all patient tab

Scenario: All Patient search with first name and full last name that is in Kodak only and is not in Panorama. User logs on as kodak.
         
    When  user searches for "last_name", "first_name" 
        | field         | value              |
        | last_name     | Bcma               |
        | first_name    | Eighteen-Patient   |
    And   user selects all patient result with patient name "BCMA,EIGHTEEN-PATIENT"
    And   user click on Confirm Selection
    Then the all patient "patient identifying traits" is displayed on confirm section
        | field         | value         |
        | dob           | 04/07/1935    |
        | age           | 79y           |
        | gender        | Male          |
        | ssn           | 666-33-0018   |

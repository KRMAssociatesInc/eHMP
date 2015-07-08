@F117_crosscutting

Feature: F117 provides cross cutting UI concerns including: displaying the current patient identifying traits,
  displaying the application version, and providing screen-to-screen navigation.

  In order to identify current patient identifying traits
  As a clinician
  I want to return to the patient search screen and display identifying traits

# POC: Team Mercury
# Updated by Alderaan on Feb, 18th 2015

  @US2145
  Scenario: Verify current patient identifying traits, application version and screen to screen navigation
    When user searches for "Ten,Patient"
    And  user selects "Ten,Patient"
    And  user confirms selection
    Then "Ten,Patient" information is displayed in overview
         | field       | value         |
         | DOB         | 04/07/1935    |
         | Age         | 79y           |
         | Gender      | Male          |
         | SSN         | ***-**-0010   |
     And "Bottom Region" contains "eHMP version"  
     And the navigation bar displays the "Patient search" Button 
     And the user clicks the "Patient search" Button
     And the patient search screen is displayed
# Team Orion

@US3292  @onc
Feature: F135 - Immunizations (ONC)

#The user should be able to click on Add imunizations

Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    Then Cover Sheet is active

@US3292_Add_Immunizations
Scenario: Adding a new problem
    When Immunization user clicks on "Add"
    Then the modal title is "Location for Current Activity"
    And user selects General Medicine and click Confirm
    Then the immunization modal title is "Add Immunization"
    

  
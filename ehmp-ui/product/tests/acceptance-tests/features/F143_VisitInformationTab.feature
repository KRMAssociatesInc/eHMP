@US2455 @onc
Feature: F143 - Establish Visit Context (Write-back)

#As an EHMP user I need to know what the visit context is when viewing a patient record.

# POC: Team Orion
Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    Then Cover Sheet is active

@US2455_VisitInformationTab 
Scenario: Viewing the  Visit Information details.

    And the user clicks on "Visit Information" tab 
    #Then the "Change Visit" button appears
    #When the user clicks button "Change Visit"
    Then the modal title is "Location for Current Activity"
    And the user clicks on "Clinic Appointments" tab
    And the user selects first row "General Medicine"
    When the user clicks button "Confirm"
    Then location for Visit Information tab is populated with "Location: General Medicine"

@DE254 @debug
Scenario: VVisit context needs to be separated from Patient Care Team info
    And the user clicks on "Visit Information" tab 
    Then the modal title is "Location for Current Activity"
    And the user clicks on "Clinic Appointments" tab
    And the user selects first row "General Medicine"
    When the user clicks button "Confirm"
    And the user clicks on "Care Team Information" tab
    And the Provider should be polpulated with the provider name

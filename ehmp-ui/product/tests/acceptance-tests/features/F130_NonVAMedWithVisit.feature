@F130_NonVAMedWithVisit.feature @US2572 @onc

Feature: F130 - Non Va Med Associate with Visit Applet

#POC: Team Pluto

Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "eight,patient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
        | field         | value                 |
        | patient name  | Eight,Patient         |

@US2572_AssociateNonVaMedWithVisit_Confirm @onc
    Scenario: Non-VA-Med Associate with the Visit Applet - Confirm
    When user selects Meds Review from Coversheet dropdown
    When the Med user clicks "Add Non-VA-Med"
    When the user clicks on the Hospital Admissions header
    Then the user clicks on an item under the header
    Then the user clicks on the confirm button to confirm changes
    Then the search modal title reads "Document Herbal/OTC/Non-VA Medications"
    Then the modal contains the Med search input
    Given the user enters in the Med Search "HALOPERIDOL TAB"
    Then the Med search results populate "HALOPERIDOL TAB"
    Given the user selects Med "HALOPERIDOL TAB"
    Then the add modal title reads "HALOPERIDOL"
    Then the Med user clicks "Cancel Button"

@US2572_AssociateNonVaMedWithVisit_Cancel @onc
    Scenario: Non-VA-Med Associate with the Visit Applet - Cancel
    When user selects Meds Review from Coversheet dropdown
    When the Med user clicks "Add Non-VA-Med"
    When the user clicks on the Hospital Admissions header
    Then the user clicks on an item under the header
    Then the user clicks on the cancel button to return to the coversheet
@F130_NonVAMedWithVisit.feature @US2572

Feature: F130 - Non Va Med Associate with Visit Applet

#POC: Team Pluto

    In order to associate nonVA meds with the Visit Applet
    As a clinician
    I want to be able to associate nonVA meds with the Visit Applet

Background:
    Given I have a browser available
    And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
    And user searches for and selects "eight,patient"
    Then Cover Sheet is active
    And the "patient identifying traits" is displayed with information
        | field			| value 				|
        | patient name	| Eight,Patient 		|
    And the Non VA Med user selects a visit
    And Cover Sheet is active

@US2572_AssociateNonVaMedWithVisit_Confirm @onc
    Scenario: Non-VA-Med Associate with the Visit Applet - Confirm
    When user selects Meds Review from Coversheet dropdown
    And the Med user selects "Add Non-VA-Med"
    And the user selects on the Hospital Admissions header
    And the user selects on an item under the header
    Then the user selects on the confirm button to confirm changes
    And the search modal title reads "Document Herbal/OTC/Non-VA Medications"
    And the user enters in the Med Search "HALOPERIDOL TAB"
    Then the Med search results populate "HALOPERIDOL TAB"
    And the user selects Med "HALOPERIDOL TAB"
    And the add modal title reads "HALOPERIDOL"
    And the Med user selects "Confirm Button"

@US2572_AssociateNonVaMedWithVisit_Cancel @onc
    Scenario: Non-VA-Med Associate with the Visit Applet - Cancel
    When user selects Meds Review from Coversheet dropdown
    And the Med user selects "Add Non-VA-Med"
    And the user selects on the Hospital Admissions header
    And the user selects on an item under the header
    Then the user selects on the cancel button to return to the coversheet
@F129 @VitalsEnteredInError @onc @debug @DE514

Feature: F129 - Vital Signs (write-back)

    In order to validate vital signs entered in error
    As a clinician
    I want to be able to ensure vitals entered in error can be corrected

Background:
    Given I have a browser available
    And I am logged into EHMP-UI "PANORAMA" as "pu1234" with password "pu1234!!"
    And I can see the landing page
    When user searches for "Eight,Patient"
    And user selects "Eight,Patient"
    And user confirms the selection
#    Then overview is active
    And user selects the coversheet from dropdown
    And user navigates to "entered in error" modal via "Entered in Error"
#    And user clicks on the first vital
#    And Vitals modal is opened
#    And user clicks on the Entered in Error button
#    Then Entered in Error modal is opened

@Vitals_EIE @EnteredInError_Marked @onc @US1959 @smoke
#    Scenario: Vitals Entered in Error disabled button
    Scenario: Vitals: Entered in Error button is disabled button

    When user selects vital "BP"
    Then "Reason for Removal" is not selected

@Vitals_EIE @EnteredInError_ChangeObservation @onc @US1959
    Scenario: Vitals Entered in Error change observation
#    And user clicks "Change Observation"
#    And Observation List modal is opened
#    And the user clicks an entry on the vitals observed list
#    Then the Entered in Error modal is opened
    When user navigates to "entered in error" modal via "change Observation"
    Then Entered in Error modal displays

@Vitals_EIE @EnteredInError_Cancel @onc @US1959
    Scenario: Vitals Entered in Error perform action
#    When the user clicks on the first vital
#    And the Vitals modal is opened
#    And the user clicks on the Entered in Error button
#    And the Entered in Error modal is opened
    When user select vital "BP"
    And user selects "Reason for Removal"
    Then

#    And the user checks first vitals checkbox
#    And the user checks the first reason radio button
#    Then the user clicks Marked as Entered in Error

    I'm not sure these tests are actually testing anything.  Can we double check this?

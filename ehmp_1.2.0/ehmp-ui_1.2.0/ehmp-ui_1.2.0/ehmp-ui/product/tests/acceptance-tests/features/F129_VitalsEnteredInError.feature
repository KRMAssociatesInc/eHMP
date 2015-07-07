@F129 @VitalsEnteredInError @onc @DE514

Feature: F129 - Vital Signs (write-back)

#POC: Team Pluto

Background:
  Given user is logged into eHMP-UI
    And user searches for and selects "thirteen,patient"
    Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
        | field         | value                 |
        | patient name  | Thirteen,Patient      |
    Then the user selects a visit

@Vitals_EIE @EnteredInError_Cancel @onc @US1959
    Scenario: Vitals Entered in Error perform action
    Given the user clicks on the first vital
    Then the Vitals modal is opened
    Given the user clicks on the Entered in Error button
    Then the Entered in Error modal is opened
    Then check that the vitals checkbox under vitals is checked
    And then no Reason for Removal is ticked
    Then the user clicks the cancel button to exit the vitals EIE modal

@Vitals_EIE @EnteredInError_ChangeObservation @onc @US1959
    Scenario: Vitals Entered in Error change observation
    Given the user clicks on the first vital
    Then the Vitals modal is opened
    Given the user clicks on the Entered in Error button
    Then the Entered in Error modal is opened
    Then the user clicks the Change Observation button
    Then the Obervation List modal is opened
    Then the user clicks an entry on the vitals observed list
    Then the Entered in Error modal is opened
    Then the user clicks the cancel button to exit the vitals EIE modal

@Vitals_EIE @EnteredInError_Marked @onc @US1959 
    Scenario: Vitals Entered in Error disabled button
    When the Vitals Write Back user Clicks the "Plus" button
    Then the Vitals modal title is "Add Vital Signs"
    Then the Vitals Write Back user enters Blood Pressure "4/4"
    Then the Vitals Write Back user enters Pulse "80"
    Then the Vitals Write Back user enters Respiration "20"
    Then the Vitals Write Back user enters Temperature "99"
    Then the Vitals Write Back user enters Pulse Oximetry "33"
    Then the Vitals Write Back user enters Pain "4"
    Then the Vitals Write Back user enters Weight "150"
    When the Vitals Write Back user Clicks the "Accept" button
    And Vitals applet contains "4/4" for blood pressure
    And Vitals applet contains "80" for pulse
    And Vitals applet contains "20" for respiration
    And Vitals applet contains "99" for temperature
    And Vitals applet contains "33" for pulse oximetry
    And Vitals applet contains "4" for pain
    And Vitals applet contains "150" for weight
    Then Cover Sheet is active
    Given the user clicks on the first vital
    Then the Vitals modal is opened
    Given the user clicks on the Entered in Error button
    Then the Entered in Error modal is opened
    And the user checks the first reason radio button
    Given the user clicks Marked as Entered in Error

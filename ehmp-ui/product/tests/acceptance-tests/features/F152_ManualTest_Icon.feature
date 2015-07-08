
Feature: CCOW and Single Sign-On(SSO)


@US2661_Default_Icon @debug @manual @ccow
Scenario: Verify default Icon for CCOW context on CPRS and eHMP after login

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    And icon for CCOW context on CPRS is blue man
    Then user launches eHMP and viewing patient “ELEVEN, PATIENT”
    And icon for CCOW context on eHMP is green link chain

@US2661_CPRS_Suspended @debug @manual @ccow
Scenario: Verify Icon for CCOW context on CPRS and eHMP when CPRS is suspended

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks context in CPRS
    And icon for CCOW context on CPRS is blue and red people
    And icon for CCOW context on eHMP is green link chain

@US2661_eHMP_Susupended @debug @manual @ccow
Scenario: Verify Icon for CCOW context on CPRS and eHMP when eHMP is suspended

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks context in eHMP
    And icon for CCOW context on eHMP is red
    And icon for CCOW context on CPRS is blue man

@US2661_Accept @debug @manual @ccow
Scenario: Verify icon for CCOW context on CPRS and eHMP when selecting Accept

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Accept”
    Then eHMP is refreshed with the newly selected patient “EIGHTY, PATIENT”
    And CPRS is refreshed with patient “EIGHTY, PATIENT”
    And icon for CCOW context on CPRS is blue man
    And icon for CCOW context on eHMP is green link chain

@US2661_BreakLink @debug @manual @ccow
Scenario: Verify icon for CCOW context on CPRS and eHMP when selecting Break Link
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Break Link”
    Then eHMP is refreshed with the newly selected patient “EIGHTY, PATIENT”
    And CPRS stays on Add Problem window
    And icon for CCOW context on CPRS is blue and red people
    And icon for CCOW context on eHMP is red

@US2661_Cancel @debug @manual @ccow
Scenario: Verify icon for CCOW context on CPRS and eHMP when selecting Cancel
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Cancel”
    Then eHMP stays on patient search page
    And CPRS stays on Add Problem window
    And icon for CCOW context on CPRS is blue man
    And icon for CCOW context on eHMP is green link chain
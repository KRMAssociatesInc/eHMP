Feature: CCOW and Single Sign-On(SSO)
# This test is being moved to archive.
# Manual test is defined in functional test TC3
@US2661_Default_Icon @debug @manual @ccow
Scenario: CCOW Icon for context on CPRS and eHMP when context is active
    Given user is logged in to CPRS 
    And viewing patient "ELEVEN, PATIENT"
    And icon for CCOW context on CPRS is blue man
    When user launches eHMP 
    And user logs in to same location used in CPRS
    Then the system automatically selects patient "ELEVEN, PATIENT"
    And icon for CCOW context on eHMP is green link chain

@US2661_CPRS_Suspended @debug @manual @ccow
Scenario: CCOW Icon for context on CPRS and eHMP when CPRS context is suspended
    Given user is logged in to CPRS 
    And viewing patient "ELEVEN, PATIENT"
    When user launches eHMP 
    And user logs in to same location used in CPRS
    And system automatically selects patient "ELEVEN, PATIENT"
    And user breaks context in CPRS
    Then icon for CCOW context on CPRS is blue and red people
    And icon for CCOW context on eHMP is green link chain

@US2661_eHMP_Susupended @debug @manual @ccow
Scenario: CCOW Icon for context on CPRS and eHMP when EHMP context is suspended
    Given user is logged in to CPRS 
    And viewing patient "ELEVEN, PATIENT"
    When user launches eHMP 
    And user logs in to same location used in CPRS
    And system automatically selects patient "ELEVEN, PATIENT"
    And user breaks context in EHMP
    Then icon for CCOW context on EHMP is red
    And icon for CCOW context on CPRS remains as a blue man
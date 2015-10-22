
Feature: CCOW and Single Sign-On(SSO)

@US2661_Accept @debug @manual @ccow
Scenario: Changing Patient Context from eHMP while CPRS is in edit mode - selecting "Accept"
    Given user is logged in to CPRS 
    And viewing patient “ELEVEN, PATIENT”
    And user launches eHMP 
    And user logs in to eHMP to same location used in CPRS
    And system automatically selects patient "ELEVEN, PATIENT"
    When user opens Add Problem window in CPRS 
    And user switches to eHMP 
    And user selects new patient "EIGHTY, PATIENT"
    And user is prompted with modal to Accept, Cancel or Break Link 
    Then user selects "Accept"
    And eHMP is refreshed with the newly selected patient "EIGHTY, PATIENT"
    And CPRS is refreshed with patient "EIGHTY, PATIENT"
    And icon for CCOW context on CPRS is blue man (linked)
    And icon for CCOW context on eHMP is green link chain (linked)

@US2661_BreakLink @debug @manual @ccow
Scenario: Changing Patient Context from eHMP while CPRS is in edit mode - selecting "Break Link"
    Given user is logged in to CPRS 
    And viewing patient "ELEVEN, PATIENT"
    And user launches eHMP 
    And user logs in to eHMP to same location used in CPRS
    And system automatically selects patient "ELEVEN, PATIENT"
    When user opens Add Problem window in CPRS 
    And user switches to eHMP 
    And user selects new patient "EIGHTY, PATIENT"
    And user is prompted with modal to Accept, Cancel or Break Link 
    Then user selects "Break Link"
    And eHMP is refreshed with the newly selected patient "EIGHTY, PATIENT"
    And CPRS stays on Add Problem window
    And CCOW icon on CPRS is blue and red people
    And CCOW icon on eHMP is red

@US2661_Cancel @debug @manual @ccow
Scenario: Verify icon for CCOW context on CPRS and eHMP when selecting Cancel
    Given user is logged in to CPRS 
    And viewing patient "ELEVEN, PATIENT"
    And user launches eHMP 
    And user logs in to eHMP to same location used in CPRS
    And system automatically selects patient "ELEVEN, PATIENT"
    When user opens Add Problem window in CPRS 
    And user switches to eHMP 
    And user selects new patient "EIGHTY, PATIENT"
    And user is prompted with modal to Accept, Cancel or Break Link 
    Then user selects "Cancel"
    And eHMP stays on patient search page
    And CPRS stays on Add Problem window
    And CCOW icon on CPRS is blue
    And CCOW icon on eHMP is green link chain


@US1951_SignOut @debug @manual @ccow 
Scenario: User signs out manually by clicking “Sign Out” link
    Given user is logged in to eHMP
    And eHMP is connected to Vault 
    And user is viewing Vault
    And context information is visible in Vault
    When user clicks “Sign Out” link on eHMP
    Then context information for eHMP is removed from Vault

@US1951_CloseWindow @debug @manual @ccow 
Scenario: User signs out manually by closing eHMP browser window
    Given user is logged in to eHMP
    And eHMP is connected to Vault 
    And user is viewing Vault
    And context information is visible in Vault
    When user closes eHMP browser window
    Then context information for eHMP is removed from Vault

@US1951 @debug @manual @ccow 
Scenario: User eHMP session times out due to inactivity
    Given user is logged in to eHMP
    And eHMP is connected to Vault 
    And user is viewing Vault
    And context information is visible in Vault
    When user is inactive on eHMP for 15 min
    And user gets prompted with modal to keep session active
    And user does not dismiss message
    Then eHMP session times out 
    And user is logged out
    And context information for eHMP is removed from Vault
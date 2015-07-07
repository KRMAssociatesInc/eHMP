
Feature: CCOW and Single Sign-On(SSO)

@US1949 @debug @manual @ccow
Scenario: Testing patient sync between CPRS and eHMP

Given user is logged in to CPRS and viewing patient ELEVEN, PATIENT”
When user logs in to eHMP
Then information of patient “ELEVEN, PATIENT” displays 


@US1949_Sync @debug @manual @ccow 
Scenario: Testing patient sync between CPRS and eHMP
    Given user is logged in to eHMP and viewing patient ELEVEN, PATIENT”
    When user logs in to CPRS
    Then information of patient “ELEVEN, PATIENT” displays

@US1949_Changing_CPRS_Patient @debug @manual @ccow 
Scenario: Changing patient in CPRS, CCOW server sync’s patient in eHMP
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    When user changes a new patient “EIGHTY, PATIENT” in CPRS 
    Then eHMP is refreshed with the newly selected patient “EIGHTY, PATIENT”

@US1949_Changing_EHMP_Patient @debug @manual @ccow
Scenario: Changing patient in eHMP, CCOW server sync's patient in CPRS
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    When user selects a new patient “EIGHTY, PATIENT” in eHMP
    Then CPRS automatically changes to the newly selected patient “EIGHTY, PATIENT”

@US1949_Accept @debug @manual @ccow
Scenario: Verify CCOW context on CPRS and eHMP when selecting Accept

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Accept”
    Then eHMP is refreshed with the newly selected patient “EIGHTY, PATIENT”
    And CPRS is refreshed with patient “EIGHTY, PATIENT”

@US1949_BreakLink @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when selecting Break Link
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Break Link”
    Then eHMP is refreshed with the newly selected patient “EIGHTY, PATIENT”
    And CPRS stays on Add Problem window

@US1949_Cancel @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when selecting Cancel

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user opens Add Problem window in CPRS 
    Then user switches to eHMP and selects new patient “EIGHTY, PATIENT”
    Then user is prompted with modal to Accept, Cancel or Break Link 
    When user selects “Cancel”
    Then eHMP stays on patient search page
    And CPRS stays on Add Problem window

@US1949_BreakLink_Ehmp @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when breaking link in eHMP

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks link in eHMP 
    Then user changes patient “EIGHTY, PATIENT” in CPRS
    Then patient “ELEVEN, PATIENT” does not change in eHMP

@US1949_BreakLink_CPRS @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when breaking link in CPRS
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks link in CPRS
    Then user changes patient “EIGHTY, PATIENT” in eHMP
    Then patient “ELEVEN, PATIENT” does not change in CPRS


@US1949_BreakLink_Both @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when breaking link in CPRS and eHMP

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks link in CPRS
    And user breaks link in eHMP
    Then user changes patient “EIGHTY, PATIENT” in CPRS 
    And user changes patient “EIGHTY, INPATIENT” in eHMP
    Then user rejoins link in CPRS
    And user rejoins link in eHMP
    Then patient “ELEVEN, PATIENT” displays in CPRS
    And patient “ELEVEN, PATIENT” displays in eHMP


@US1949_RejoinLink_CPRS @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when rejoining link in CPRS

    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks link in CPRS
    Then user changes patient “EIGHTY, PATIENT” in eHMP
    Then user rejoins link in CPRS
    And patient “EIGHTY, PATIENT” displays in CPRS

@US1949_RejoinLink_EHMP @debug @manual @ccow
Scenario: Verify context on CPRS and eHMP when rejoining link in eHMP
    Given user is logged in to CPRS and viewing patient “ELEVEN, PATIENT”
    Given user launches eHMP and viewing patient “ELEVEN, PATIENT”
    Then user breaks link in eHMP
    Then user changes patient “EIGHTY, PATIENT” in CPRS
    Then user rejoins link in eHMP
    And patient “EIGHTY, PATIENT” displays in eHMP


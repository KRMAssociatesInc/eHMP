@Navigate @UI
Feature: Use this file and its scenarios to verify all the selenium actions can be accomplished. This file
does not need to persist

Background:
    Given user has successfully logged into HMP
    
@debug @UI
Scenario: Click all the buttons
    When user types "Eight" in the "Search Field"
    Then the patient list displays "38" results
    And user selects "Eight,Patient" from the patient list
    Then user selects and pauses
        |field|
        |Date Range 2y|
        |Date Range 1y|
        |Date Range 3mo|
        |Date Range 1mo|
        |Date Range 7d|
        |Date Range 72h|
        |Date Range 24h|
        |Date Range All|
        |Filter Meds|
        |Filter Labs|
        |Filter Orders|
        |Filter Vitals|
        |Filter Documents|
        |Filter Observations|
        |Filter Other|
        |Filter All|
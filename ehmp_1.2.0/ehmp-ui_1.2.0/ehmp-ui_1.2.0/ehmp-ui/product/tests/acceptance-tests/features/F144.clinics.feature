@F144_searchClinics @future @regression

Feature:  F144-eHMP Viewer GUI - Patient Search and Selection (Clinics)

#POC: Team Mercury

Background: 
    Given user is logged into eHMP-UI in the browser
    And user attempt to click on Patient search


@validClinicsSearch @US1975
Scenario: search  with mysite,clinics and keyword
    And the User selects mysite and clinics
    And user attempt to filter by keyword "10"
    And the user select keyword "10TH Flooor"
    And user enters full last name "Eight"
    And the user select patient name "EIGHT,PATIENT"
    #Then the user click on TestConfirm
    Then the user click on Confirm Selection

@validClinicsSearch_1 @US1975
Scenario: search  with clinies and refine filter
    And the User selects mysite and clinics
    And user attempt to filter by keyword "19"
    And the user select keyword "19 Linda's Funny Clinic"
    And user enters patient "0008"
    And the user select patient name "EIGHT,PATIENT"
    #Then the user click on TestConfirm
    Then the user click on Confirm Selection

@inValidSearch @US1975
Scenario: User attempts invalid search  with wrong keyword
    And the User selects mysite and clinics
    And user attempt to filter by keyword "@"
    Then the user verifies "No results found."

@inValidSearch_2 @US1975
Scenario: User attempts invalid search  with wrong refine patient results
    And the User selects mysite and clinics
    And user attempt to filter by keyword "10"
    And the user select keyword "chest"
    And user enters patient "0008@"
    Then the user verifies error "Error: No patient record found. Please make sure your search criteria is correct."
 
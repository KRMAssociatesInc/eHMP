@F144_WardSearch @regression

Feature: F144-eHMP Viewer GUI - Patient Search and Selection (Ward)

#POC: Team Mercury

Background:
    Given user is logged into eHMP-UI

# Needs record enrichment for locations for any tests to pass
@validWardSearch @US1976 @debug @DE862
Scenario: search  with mysite,Ward and keyword
    And the User selects mysite and Ward
    And user attempt to filter by keyword "7"
    And the user select keyword "7A Gen Med"
    And the user select patient name "NINE,INPATIENT"
    #Then the user click on TestConfirm
    Then the user click on Confirm Selection
    Then Default Screen is active
    Then the "patient identifying traits" is displayed with information
        | field         | value                      |
        | patient name  | Nine,Inpatient             |

@validWardSearch_1 @US1976 @vimm @debug @DE862
Scenario: search  with Wards and refine filter
    And the User selects mysite and Ward
    And user attempt to filter by keyword "7A"
    And the user select keyword "7A Gen Med"
    And user enters patient "0008" in the patient filter
    And the user select patient name "EIGHT,PATIENT"
    #Then the user click on TestConfirm
    Then the user click on Confirm Selection
    And the results for PATIENT contain
     |value         |
     | 12/23/2014   |
     | PROGRAMMER,EIGHT          |
     | CAMP MASTER        |
     | CAMP MASTER   |
    Then the user click on Confirm
    Then Default Screen is active
    Then the "patient identifying traits" is displayed with information
        | field         | value                      |
        | patient name  | Eight,Patient            |

@validWardSearch_2 @US1976 @vimm @debug @DE862
Scenario: user when goes back to filter with out Confirm Selection, confirm selection should get refresh
    And the User selects mysite and Ward
    And user attempt to filter by keyword "7A"
    And the user select keyword "7A Gen Med"
    And user enters patient "0008" in the patient filter
    And the user select patient name "EIGHT,PATIENT"
    And user attempt to filter by keyword "d"
    And the user select keyword "Domicillary"
    Then the user should not have Confirm Selection

# Room-Bed does not show up in UI looking for roomBed in JSON
@validWardSearch_3 @US1976 @vimm @debug @DE862
Scenario: search  user make sure vpr results for patient
    And the User selects mysite and Ward
    And user attempt to filter by keyword "7A"
    And the user select keyword "7A Gen Med"
    And user enters patient "0008" in the patient filter
    And the user looks for columnHeader
     |Headers     |
     |Patient Name|
     | SSN        |
     | Gender   |
     |  Date of Birth    |
     | Room-Bed   |
    And the user select patient name "EIGHT,PATIENT"
    And the VPR results for "Eight,Patient" contain:
     |value         |
     | 04/07/1935  |
     | 80y          |
     | Male         |
     |666-00-0008  |
     |  722-B        |
    Then the user click on Confirm Selection
    And the results for PATIENT contain
     |value         |
     | 12/23/2014   |
     | PROGRAMMER,EIGHT          |
     | CAMP MASTER        |
     | CAMP MASTER   |
    Then the user click on Confirm
    Then Default Screen is active
    Then the "patient identifying traits" is displayed with information
        | field         | value                      |
        | patient name  | Eight,Patient                 |

@inValidWardSearch @US1976
Scenario: User attempts invalid search  with wrong keyword
    And the User selects mysite and Ward
    And user attempt to filter by keyword "@"
    Then no results are displayed in word
    Then the user verifies word "No results found."

@invalidWardSearch_3 @US1976
Scenario: User attempts search  with  filter which has no data
    And the User selects mysite and Ward
    And user attempt to filter by keyword "3"
    And the user select keyword "3 North Surg"
    Then no results are displayed in patient search
    Then the user verifies patient "No results found."

@inValidWardSearch_2 @US1976 @debug @DE862
Scenario: User attempts invalid search  with wrong refine patient results
    And the User selects mysite and Ward
    And user attempt to filter by keyword "7A"
    And the user select keyword "7A Gen Med"
    And user enters patient "0008@" in the patient filter
    Then no results are displayed in patient search
    Then the user verifies patient "No results found."

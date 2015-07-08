@F144_Lab_Results_Modal @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results - Applet Single Record Modal for Lab Panels from expanded view

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Seven,Patient"
  Then Default Screen is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  Then no results should be found in the Lab Results applet
  And the user clicks the date control "All" in the "Lab Results applet"
  And the applet displays lab results

@f144_1_lab_results_modal @US2034 @TA5012c @modal_test 
Scenario: The user views the modal's Lab Details table.
  Given the user is viewing the expanded view of the Lab Results Applet
  When the user views the first non-panel lab result in a modal
  Then the modal's title is "TRIGLYCERIDE - SERUM"
  And the "Lab Detail" table contains headers
    | Date       | Lab Test             | Flag | Result | Unit   | Ref Range | Facility | 
  And the "Lab Detail" row is
    | Date       | Lab Test             | Flag | Result | Unit   | Ref Range | Facility |
    | 03/05/2010 | TRIGLYCERIDE - SERUM |      | 162    | mg/dL  | 0-249     |TST1      |

@f144_1_lab_results_modal @US2034 @TA5012c @modal_test
Scenario: The user views the modal's Lab Details table and verifies the appropriate flag is displayed.
  Given the user is viewing the expanded view of the Lab Results Applet
  And the applet displays lab results
  When the user views the "HEMOGLOBIN A1C - BLOOD" lab result in a modal
  Then the modal's title is "HEMOGLOBIN A1C - BLOOD"
  And the "Lab Detail" table contains headers
    | Date       | Lab Test               | Flag | Result | Unit   | Ref Range | Facility | 
  And the "Lab Detail" row is
    | Date       | Lab Test               | Flag | Result | Unit   | Ref Range | Facility |
    | 03/05/2010 | HEMOGLOBIN A1C - BLOOD | H    | 6.2    | %      | 3.5-6   |TST1      |

@f144_2_lab_results_modal @US2034 @TA5012d @modal_test 
Scenario: The user views the modal's Lab History table.
  Given the user is viewing the expanded view of the Lab Results Applet
  When the user views the first non-panel lab result in a modal
  And the user clicks the date control "All" in the "Lab Results modal"
  Then the modal's title is "TRIGLYCERIDE - SERUM"
  And the "Lab History" table contains headers
    | Date | Flag | Result | Facility |
  And the "Lab History" table contains 15 rows
  And the Lab History table contains rows
    | Date             | Flag | Result    | Facility |
    | 03/05/2010 - 12:00 |      | 162 mg/dL | TST1     |
    | 12/01/2009 - 10:00 |      | 177 mg/dL | TST1     |
    | 08/24/2009 - 12:00 |      | 199 mg/dL | TST1     |
    | 04/17/2009 - 10:00 |      | 220 mg/dL | TST1     |
    | 11/10/2008 - 09:00 |      | 221 mg/dL | TST1     |
    | 01/30/2008 - 08:00 |      | 201 mg/dL | TST1     |
    | 12/28/2007 - 07:30 |      | 202 mg/dL | TST1     |
    | 11/28/2007 - 07:00 |      | 203 mg/dL | TST1     |
    #| 04/24/2007 - 07:30 |      | 185 mg/dL | TST1     |
  And the "Total Tests" label has the value "22"

@f144_3_lab_results_modal @US2034 @TA5012e @modal_test @vimm_observed @triage
Scenario: The user verifies Lab History table pagination.
  
  Given the user is viewing the expanded view of the Lab Results Applet
  #When the user views the first non-panel lab result in a modal
  And the applet displays lab results
  When the user views the "TRIGLYCERIDE - SERUM" lab result in a modal
  And the user clicks the date control "All" in the "Lab Results modal"
  Then the modal's title is "TRIGLYCERIDE - SERUM"
  And the Lab History table contains headers
    | Date | Flag | Result | Facility |
  And the "Lab History" table contains 15 rows
  And the "Lab History" first row contains
    | Date             | Flag | Result    | Facility |
    | 03/05/2010 - 12:00 |      | 162 mg/dL | TST1     |
  When the user clicks the "Next Page Arrow" for the lab history
  Then the "Lab History" table contains 7 rows
  And the "Lab History" first row contains
    | Date               | Flag | Result    | Facility |
    | 11/28/2007 - 07:00 |      | 203 mg/dL | TST2     |

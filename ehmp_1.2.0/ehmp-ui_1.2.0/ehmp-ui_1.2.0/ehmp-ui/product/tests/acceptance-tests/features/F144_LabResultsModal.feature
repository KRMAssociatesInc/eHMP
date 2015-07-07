@F144_Lab_Results_Modal @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  When user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Given the user has selected All within the global date picker
  And the applet displays lab results
  

#adding debug tag since we are getting different no. of counts
@f144_2_lab_results_coversheet_panel_modal @US2034 @TA5012a @DE387
Scenario: Opening and closing the modal from a coversheet - Panel result.
  Given the user has filtered the lab results on the term "2988" down to 2 rows
  When the user clicks the Panel "COAG PROFILE BLOOD PLASMA WC LB #2988" in the Lab Results applet
  And the user clicks the Lab Test "PROTIME - PLASMA" in the Panel result details
  Then the modal is displayed
  When the user closes modal by clicking the "Close" control
  Then the coversheet is displayed

@f144_2_lab_results_coversheet_modal @US2034 @TA5012b 
Scenario: Opening and closing the modal from a coversheet - non-Panel result.
  When the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  When the user closes modal by clicking the "Close" control
  Then the coversheet is displayed

@f144_lab_results_modal_traversal @US2339 @TA6893a @modal_test
Scenario: Lab Results Modal - full traversal through a page of Lab Result modals from within the modal view using Previous/Next buttons.
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "Sodium, Blood Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Chloride, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Glucose, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Cholesterol, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Calcium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Cholesterol, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Glucose, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Potassium, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Chloride, Serum or Plasma Quantitative - PLASMA"
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  And the modal's title is "Sodium, Blood Quantitative - PLASMA"

@f144_lab_results_modal_traversal @US2339 @TA6893b @modal_test
Scenario: Lab Results Modal - Ensuring data within modal is updated when stepping from one modal to next/prev modal.
  And the user clicks the first non-Panel result in the Lab Results applet
  And the user clicks the date control "All" in the "Lab Results modal"
  Then the modal is displayed
  And the modal's title is "Sodium, Blood Quantitative - PLASMA"
  And the "Lab Detail" row is
    | Date       | Lab Test                            | Flag | Result | Unit   | Ref Range | Facility |
    | 05/07/2013 | Sodium, Blood Quantitative - PLASMA |      | 139    | mmol/L | 134-146   | DOD      |
    And the "Lab History" table contains rows
    | Date             | Flag | Result     | Facility |
    | 05/07/2013 - 10:43 |      | 139 mmol/L | DOD      |
    | 04/09/2013 - 10:08 |      | 135 mmol/L | DOD      |
    | 04/03/2013 - 17:41 |      | 140 mmol/L | DOD      |
    | 03/28/2013 - 14:34 |      | 138 mEq/L  | DOD      |
    | 03/28/2013 - 14:09 |      | 135 mmol/L | DOD      |
    | 02/22/2013 - 08:28 |   L  | 135 mEq/L  | DOD      |
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "Chloride, Serum or Plasma Quantitative - PLASMA"
  And the user clicks the date control "All" in the "Lab Results modal"
  And the "Lab Detail" row is
    | Date       | Lab Test                                        | Flag | Result | Unit   | Ref Range | Facility |
    | 05/05/2013 | Chloride, Serum or Plasma Quantitative - PLASMA |      | 101    | mmol/L | 98-107    | DOD      |
  And the "Lab History" table contains rows
    | Date             | Flag | Result     | Facility |
    | 05/05/2013 - 14:10 |      | 101 mmol/L | DOD      |
    | 04/09/2013 - 10:08 |      | 99 mmol/L  | DOD      |
    | 03/28/2013 - 14:09 |   L* | 25 mmol/L  | DOD      |
  When the user clicks the control "Previous Button" in the "Lab Results modal"
  Then the modal's title is "Sodium, Blood Quantitative - PLASMA"
  And the user clicks the date control "All" in the "Lab Results modal"
  And the "Lab Detail" row is
    | Date       | Lab Test                            | Flag | Result | Unit   | Ref Range | Facility |
    | 05/07/2013 | Sodium, Blood Quantitative - PLASMA |      | 139    | mmol/L | 134-146   | DOD      |
    And the "Lab History" table contains rows
    | Date             | Flag | Result     | Facility |
    | 05/07/2013 - 10:43 |      | 139 mmol/L | DOD      |
    | 04/09/2013 - 10:08 |      | 135 mmol/L | DOD      |
    | 04/03/2013 - 17:41 |      | 140 mmol/L | DOD      |
    | 03/28/2013 - 14:34 |      | 138 mEq/L  | DOD      |
    | 03/28/2013 - 14:09 |      | 135 mmol/L | DOD      |
    | 02/22/2013 - 08:28 |   L  | 135 mEq/L  | DOD      |



@f144_lab_results_modal_non_numeric_table @US2498 @TA7551 @modal_test @vimm
Scenario: Lab Results Modal - history table containing non-numerical result types.
  Given user searches for and selects "Bcma,Eight"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  And the applet displays lab results
  Given the user has filtered the lab results on the term "HEPATITIS" down to 6 rows
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "HEPATITIS C ANTIBODY - BLOOD"
  And the user clicks the date control "All" in the "Lab Results modal"
  And the "Lab History" table contains 6 rows
  And the Lab History table contains rows
    | Date             | Flag | Result    | Facility |
    | 05/29/2007 - 15:16 |      | P         | TST1     |
    | 05/29/2007 - 15:12 |      | P         | TST1     |
    | 05/29/2007 - 14:58 |      | N         | TST1     |
    | 05/29/2007 - 15:16 |      | P         | TST2     |
    | 05/29/2007 - 15:12 |      | P         | TST2     |
    | 05/29/2007 - 14:58 |      | N         | TST2     |
  And the "Total Tests" label has the value "6"







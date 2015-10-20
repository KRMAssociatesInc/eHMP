@F144_Lab_Results_Base_Applet @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda, inherited by Team Venus

Background:
  Given user is logged into eHMP-UI

@f144_1_lab_results_base_applet_cover_sheet @US2038 @TA5030a @reworked_in_firefox @base 
Scenario: View Lab Results Base Applet Cover Sheet
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And the coversheet is displayed
  And the user has selected All within the global date picker
  Then the lab results applet title is "LAB RESULTS"
  And the "Lab Results Applet" table contains headers
    | Date | Lab Test | Flag | Result |
  And the "Lab Results Applet" table contains rows
    | Date             | Lab Test                                           | Flag | Result     |
    | 05/07/2013 - 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139 mmol/L |
    | 05/05/2013 - 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101 mmol/L |
    | 05/05/2013 - 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4 mmol/L |
    | 05/04/2013 - 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |   H  | 100 mg/dL  |
    | 05/04/2013 - 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.1 mmol/L |
    | 05/03/2013 - 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |   L* | 2.2 mmol/L |
    | 05/03/2013 - 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160 mg/dL  |
    | 04/11/2013 - 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4 mmol/L |
    | 04/11/2013 - 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.3 mmol/L |
    | 04/11/2013 - 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |   H  | 10.5 mg/dL |

@f144_lab_results_microbiology @DE377 @future @obe
Scenario: Lab Results Applet - Ensure results for Microbiology labs are being shown.
  Given user searches for and selects "Zzzretfourthirtytwo,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  When the user enters "Blood+Culture" into the "Lab Results Filter Field"
  #And the user inputs "Blood+Culture" in the "Text Filter" control in the "Lab Results applet"
  And the user waits for 5 seconds
  Then the "Lab Results Applet" table contains 1 rows
  And the "Lab Results Applet" table contains rows
    | Date             | Lab Test                     | Flag | Result      | Unit | Ref Range | Facility |
    | 01/03/1994 - 07:00 | BLOOD CULTURE SET #1 - BLOOD |      | View Report |      |           | TST1     |





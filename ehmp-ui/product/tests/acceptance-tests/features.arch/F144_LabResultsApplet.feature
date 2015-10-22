@F144_Lab_Results_Base_Applet @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda, inherited by Team Venus

Background:
  Given user is logged into eHMP-UI

 @f144_1a_lab_results_base_applet_cover_sheet @reworked_in_firefox
Scenario: View ALL lab results on Cover sheet
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  When the user scrolls to the bottom of the Lab Results Applet
  Then the "Lab Results Applet" table contains 373 rows

@f144_lab_results_flag_sort @US2493 @TA7528 @reworked_in_firefox
Scenario: Lab Results Applet - Enable sorting flags by priority.
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  Then the "Lab Results Applet" table contains 30 rows
  When the user clicks the control "Flag column" in the "Lab Results applet"
  Then the Lab Results should be sorted by "Flag"

# after discussion email with product owners and tech leads for andromeda, venus tests tagged f144_lab_results_flickering are being retired 
@f144_lab_results_flickering @US2649 @TA8610a
Scenario: Lab Results Applet - Ensure no data flickering on initial load.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_flickering @US2649 @TA8610b
Scenario: Lab Results Applet - Ensure no data flickering on date criteria change.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user waits for 5 seconds
  And the user clicks the date control "1yr" on the "Coversheet"
  And the user clicks the control "Date Filter Toggle" on the "Coversheet"
  Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_flickering @US2649 @TA8610c
Scenario: Lab Results Applet - Ensure no data flickering on single page initial load.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_flickering @US2649 @TA8610d
Scenario: Lab Results Applet - Ensure no data flickering on single page date criteria change.
  Given user searches for and selects "Five,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  And the user clicks the date control "1yr" in the "Lab Results applet"
  And the user clicks the control "Filter Toggle" in the "Lab Results applet"
  Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_flickering @US2649 @TA8610e
Scenario: Lab Results Applet - Ensure no data flickering when text filtering is used.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Filter Toggle" in the "Lab Results applet"
  And the user inputs "LDL" in the "Text Filter" control in the "Lab Results applet"
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user waits for 5 seconds
  And the user clicks the date control "2yr" on the "Coversheet"
  And the user clicks the control "Apply" on the "Coversheet"
  #Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_flickering @US2649 @TA8610f
Scenario: Lab Results Applet - Ensure no data flickering when text filtering is used on single page view.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  And the user inputs "LDL" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "2yr" in the "Lab Results applet"
  #Then there is no brief display of data in the "Lab Results applet"
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_table_returns_anatomic_pathology_results @DE377a @moved_to_rdk
Scenario: Lab Results Applet - Ensure anatomic pathology results are displayed
  Given user searches for and selects "Onehundredten,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  Then the Lab Results Applet table displays No Records Found
  When the user clicks the date control "All" in the "Lab Results applet"
  Then the "Lab Results Applet" table contains 25 rows
  And the user inputs "patho" in the "Text Filter" control in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  Then the "Lab Results Applet" table contains 4 rows
  And the "Lab Results Applet" table contains rows
    | Date             | Lab Test                                | Flag | Result      | Unit | Ref Range | Facility  |
    | 12/05/1995 - 00:00 | Surgical Pathology - LYMPH NODES        |      | View Report |      |           | TST1      |
    | 12/05/1995 - 00:00 | Surgical Pathology - LYMPH NODES        |      | View Report |      |           | TST2      |
    | 11/16/1995 - 00:00 | Surgical Pathology - BONE MARROW BIOPSY |      | View Report |      |           | TST1      |
    | 11/16/1995 - 00:00 | Surgical Pathology - BONE MARROW BIOPSY |      | View Report |      |           | TST2      |

@f144_lab_results_table_returns_microbiology_results @DE377b @DE1261 @moved_to_rdk
Scenario: Lab Results Applet - Ensure microbiology results are displayed
  Given user searches for and selects "Zzzretfourthirtytwo,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  When the applet displays lab results
  And the user inputs "micro" in the "Text Filter" control in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  Then the "Lab Results Applet" table contains 1 rows
  And the "Lab Results Applet" table contains rows
    | Date             | Lab Test                   | Flag | Result      | Unit | Ref Range | Facility  |
    | 09/11/1993 - 23:15 | Microbiology - URINE       |      | View Report |      |           | TST1      |

@f144_3b_lab_results_base_applet_single_page @US2033 @TA5445 @DE1251 @reworked_in_firefox
Scenario: View ALL Lab result on Expand View
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  And the user has selected All within the global date picker
  And the user clicks the control "Expand View" in the "Lab Results applet"
  Then the Lab Results single page is displayed
  And the lab results applet title is "LAB RESULTS"
  When the user clicks the date control "All" in the "Lab Results applet"
  And the "Lab Results Applet" table contains headers
    | Date | Lab Test | Flag | Result | Unit | Ref Range | Facility |
  When the user scrolls to the bottom of the Lab Results Applet
  Then the "Lab Results Applet" table contains 373 rows

@f144_filtering_LOINC_codes_in_lab_results_applet @S5709 @reworked_in_firefox
Scenario: Lab Results Applet - Ensure user can filter by the LOINC code
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  When the applet displays lab results
  And the user inputs "736-9" in the "Text Filter" control in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  Then the "Lab Results Applet" table contains 1 rows
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                                               | Flag | Result | Unit | Ref Range | Facility  |
    | 06/21/2007 - 10:26 | Lymphocytes/100 Leukocytes, Blood Quantitative Automated Count - BLOOD |  H   | 52.0   |   %  | 16.1-44.7 | DOD       |

@f144_lab_results_panel_grouping_by_facility @DE250 @DE1259 @reworked_in_firefox
Scenario: Lab Results Applet - Ensure panels are not grouped together with different facilities.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  #Then the Lab Results Applet table displays No Records Found
  And the applet displays lab results
  And the user inputs "Panel" in the "Text Filter" control in the "Lab Results applet"
  When the user clicks the date control "All" in the "Lab Results applet"
  Then the "Lab Results Applet" table contains 14 rows
  #And the "Lab Results Applet" table contains rows
  Then the Lab Results Applet table contains specific rows
    |i | Date             | Lab Test                                    | Flag | Result | Unit | Ref Range | Facility |
    |5| 06/01/2006 - 23:56 | Panel COAG PROFILE BLOOD PLASMA WC LB #2988 | H    |        |      |           | TST1     |
    |6| 06/01/2006 - 23:56 | Panel COAG PROFILE BLOOD PLASMA WC LB #2988 | H    |        |      |           | TST2     |
    |7| 03/17/2005 - 01:59 | Panel CHEM 7 BLOOD SERUM SP LB #2681        | H*   |        |      |           | TST1     |
    |8| 03/17/2005 - 01:59 | Panel CPK PROFILE BLOOD SERUM SP LB #2681   | H*   |        |      |           | TST1     |
    |9| 03/17/2005 - 01:59 | Panel CHEM 7 BLOOD SERUM SP LB #2681        | H*   |        |      |           | TST2     |
    |10| 03/17/2005 - 01:59 | Panel CPK PROFILE BLOOD SERUM SP LB #2681   | H*   |        |      |           | TST2     |
    |11| 03/28/2004 - 22:50 | Panel CHEM 7 BLOOD SERUM I LB #2540         |      |        |      |           | TST1     |
    |12| 03/28/2004 - 22:50 | Panel CHEM 7 BLOOD SERUM I LB #2540         |      |        |      |           | TST2     |
    |13| 04/28/2003 - 10:50 | Panel CHEM 7 BLOOD SERUM SP LB #2157        | H*   |        |      |           | TST1     |
    |14| 04/28/2003 - 10:50 | Panel CHEM 7 BLOOD SERUM SP LB #2157        | H*   |        |      |           | TST2     |

@f144_3_lab_results_base_applet_single_page @US2033 @TA5445a @vimm_observed @vimm @reworked_in_firefox
Scenario: View Lab Results Base Applet Single Page by clicking on Expand View
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  And the user has selected All within the global date picker

  And the user clicks the control "Expand View" in the "Lab Results applet"
  Then the Lab Results single page is displayed
  And the lab results applet title is "LAB RESULTS"
  And the "Lab Results Applet" table contains headers
    | Date | Lab Test | Flag | Result | Unit | Ref Range | Facility |
  And the "Lab Results Applet" table contains rows
    | Date               | Lab Test                                           | Flag | Result | Unit   | Ref Range | Facility |
    | 05/07/2013 - 10:43 | Sodium, Blood Quantitative - PLASMA                |      | 139    | mmol/L | 134-146   | DOD      |
    | 05/05/2013 - 14:10 | Chloride, Serum or Plasma Quantitative - PLASMA    |      | 101    | mmol/L | 98-107    | DOD      |
    | 05/05/2013 - 14:10 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4    | mmol/L | 3.5-4.7   | DOD      |
    | 05/04/2013 - 08:25 | Glucose, Serum or Plasma Quantitative - PLASMA     |   H  | 100    | mg/dL  | 70-99     | DOD      |
    | 05/04/2013 - 08:25 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.1    | mmol/L | 3.5-4.7   | DOD      |
    | 05/03/2013 - 12:28 | Potassium, Serum or Plasma Quantitative - PLASMA   |   L* | 2.2    | mmol/L | 3.5-4.7   | DOD      |
    | 05/03/2013 - 11:37 | Cholesterol, Serum or Plasma Quantitative - PLASMA |      | 160    | mg/dL  | 0-240     | DOD      |
    | 04/11/2013 - 14:05 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.4    | mmol/L | 3.5-4.7   | DOD      |
    | 04/11/2013 - 08:49 | Potassium, Serum or Plasma Quantitative - PLASMA   |   H  | 5.3    | mmol/L | 3.5-4.7   | DOD      |
    | 04/11/2013 - 08:23 | Calcium, Serum or Plasma Quantitative - PLASMA     |   H  | 10.5   | mg/dL  | 8.5-10.1  | DOD      |

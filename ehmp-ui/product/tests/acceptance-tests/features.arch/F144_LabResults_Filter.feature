@F144_Lab_Results_Base_Applet_Filter @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results - Filtering

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  @f144_2_lab_results_base_applet_single_page_filter @US2033 @DE206 @reworked_in_firefox
Scenario: Opening and closing filter controls of Lab Results Single Page View
  Given the user is viewing the expanded "Lab Results" applet
  Then the "Date Filter" should be "Displayed" in the "Lab Results applet"
  And the "Text Filter" should be "Displayed" in the "Lab Results applet"
  And the following choices should be displayed for the "Lab Results applet" Date Filter
    | Any | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |
  And the "Text Filter" should be "Displayed" in the "Lab Results applet"
  When the user clicks the control "Filter Toggle" in the "Lab Results applet"
  Then the "Date Filter" should be "Hidden" in the "Lab Results applet"
  And the "Text Filter" should be "Hidden" in the "Lab Results applet"

  @f144_lab_results_applet_filter_by_panel_fail @US2313 @TA6537b @reworked_in_firefox
Scenario: Lab Results Applet - Filter lab results outside of the panel.
  Given the user clicks the control "Filter Toggle" in the "Lab Results applet"
  And the user inputs "noResults" in the "Text Filter" control in the "Lab Results applet"
  When the user has selected All within the global date picker
  Then no results should be found in the "Lab Results applet"

@f144_lab_results_text_filtering_lab_type @US2552 @TA7994a @triage @DE1226 @reworked_in_firefox
Scenario: Lab Results Applet - Filtering by Lab Type inside the panel and view VistA results
  Given the user is viewing the expanded "Lab Results" applet
  When the user inputs "a1c" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "All" on the "Lab Results applet"
  Then the Lab Results Applet table contains specific rows
    | row | Date               | Lab Test               | Flag | Result | Unit | Ref Range | Facility |
    | 1   | 03/05/2010 - 10:00 | HEMOGLOBIN A1C - BLOOD | H    | 6.2    | %    | 3.5-6     | TST1     |

@f144_lab_results_text_filtering_lab_type @US2552 @TA7994a @triage @DE1226 @reworked_in_firefox
Scenario: User can filter by Lab Type inside the panel and view DoD results
  Given the user is viewing the expanded "Lab Results" applet
  # And the user clicks the date control "All" on the "Lab Results applet"
  When the user inputs "hematocrit" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "All" on the "Lab Results applet"
  Then the Lab Results Applet table contains specific rows
    | row | Date               | Lab Test                                               | Flag | Result | Unit    | Ref Range | Facility |
    | 1   | 06/21/2007 - 10:26 | Hematocrit, Blood Quantitative Automated Count - BLOOD |  L   | 30.0   | %       | 35.5-49.1 | DOD      |
    

@f144_lab_results_text_filtering_ref_range @US2552 @TA7994b @DE947 @triage @reworked_in_firefox
Scenario: Lab Results Applet - Filtering by Ref Range.
  Given the user is viewing the expanded "Lab Results" applet
  When the user inputs "134-146" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "All" in the "Lab Results applet"
  Then the Lab Results Applet table contains specific rows
    | row | Date               | Lab Test                            | Flag | Result | Unit   | Ref Range | Facility |
    | 1   | 05/07/2013 - 10:43 | Sodium, Blood Quantitative - PLASMA |      | 139    | mmol/L | 134-146   | DOD      |
    | 2   | 04/09/2013 - 10:08 | Sodium, Blood Quantitative - PLASMA |      | 135    | mmol/L | 134-146   | DOD      |
    | 3   | 04/03/2013 - 17:41 | Sodium, Blood Quantitative - PLASMA |      | 140    | mmol/L | 134-146   | DOD      |
    | 4   | 03/28/2013 - 14:09 | Sodium, Blood Quantitative - PLASMA |      | 135    | mmol/L | 134-146   | DOD      |

@f144_lab_results_text_filtering_result @US2552 @TA7994c @triage @DE1226 @reworked_in_firefox
Scenario: Lab Results Applet - Filtering by Result.
  Given the user is viewing the expanded "Lab Results" applet
  When the user inputs "185" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "All" in the "Lab Results applet"
  Then the Lab Results Applet table contains specific rows
    | row | Date             | Lab Test             | Flag | Result | Unit  | Ref Range | Facility |
    | 1   | 04/24/2007 - 07:30 | TRIGLYCERIDE - SERUM |      | 185    | mg/dL | 0-249     | TST1     |
    | 2   | 04/24/2007 - 07:30 | TRIGLYCERIDE - SERUM |      | 185    | mg/dL | 0-249     | TST2     |

@f144_lab_results_text_filtering_facility @US2552 @TA7994d @triage @reworked_in_firefox
Scenario: Lab Results Applet - Filtering by Facility.

  Given the user is viewing the expanded "Lab Results" applet
  When the user inputs "DOD" in the "Text Filter" control in the "Lab Results applet"
  And the user clicks the date control "All" in the "Lab Results applet"
  Then the Lab Results Applet table contains rows
    | Date             | Lab Test                                           | Flag | Result | Unit   | Ref Range | Facility |
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

@f144_lab_results_text_filter_not_persisting @DE185 @reworked_in_firefox
Scenario: Lab Results Applet - Text Filter should not persist after switching patients.
  When the user clicks the control "Filter Toggle" in the "Lab Results applet"
  And the user inputs "Sodium" in the "Text Filter" control in the "Lab Results applet"
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Filter Toggle" in the "Lab Results applet"
  Then the "Text Filter" input should have the value "" in the "Lab Results applet"

@f144_lab_results_date_filter_not_persisting @DE185 @reworked_in_firefox
Scenario: Lab Results Applet - Date Filter should not persist after switching patients.
  Given the user is viewing the expanded "Lab Results" applet
  When the user clicks the date control "3mo" in the "Lab Results applet"
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Expand View" in the "Lab Results applet"
  Then there is no active date control in the "Lab Results applet"
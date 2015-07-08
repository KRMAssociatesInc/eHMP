@F144_Lab_Results_Modal_Locaing_Indicator
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda

@f144_lab_results_modal_loading_indicators @US2551 @TA7813a @unstable @modal_test
Scenario: Lab Results Modal - loading indicator on initial load.
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "All" on the "Coversheet"
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the loading indicators are "Displayed" in the Lab Results modal
  Then the "Lab History" table contains 15 rows
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the loading indicators are "Hidden" in the Lab Results modal

@f144_lab_results_modal_loading_indicators @US2551 @TA7813b @unstable @modal_test
Scenario: Lab Results Modal - loading indicator on moving to another lab result modal.
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "All" on the "Coversheet"
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  Then the "Lab History" table contains 15 rows
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the loading indicators are "Hidden" in the Lab Results modal
  When the user clicks the control "Next Button" in the "Lab Results modal"
  Then the modal's title is "TRIGLYCERIDE - SERUM"
  And the loading indicators are "Displayed" in the Lab Results modal
  Then the "Lab History" table contains 15 rows
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the loading indicators are "Hidden" in the Lab Results modal

@f144_lab_results_modal_loading_indicators @US2551 @TA7813c @modal_test @unstable
Scenario: Lab Results Modal - loading indicator on date criteria change.
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  And the user clicks the date control "All" on the "Coversheet"
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  Then the "Lab History" table contains 15 rows
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the loading indicators are "Hidden" in the Lab Results modal
  When the user inputs "01/01/2010" in the "From Date" control in the "Lab Results modal"
  And the user inputs "01/01/2013" in the "To Date" control in the "Lab Results modal"
  And the user clicks the control "Apply" in the "Lab Results modal"
  Then the loading indicators are "Displayed" in the Lab Results modal
  And the "Lab History" table contains 2 rows
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the loading indicators are "Hidden" in the Lab Results modal

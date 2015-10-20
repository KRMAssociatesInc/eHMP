@F144_Lab_Results_Modal @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results in expanded view

# Team: Andromeda, inherited by Team Venus

Background:
  Given user is logged into eHMP-UI

@f144_lab_results_graph @US2213 @TA6055 @modal_test @debug @DE1142
Scenario: Lab History modal graph.
  Given user searches for and selects "Seven,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  And the user is viewing the expanded "Lab Results" applet
  When the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "TRIGLYCERIDE - SERUM"
  And the user clicks the date control "All" in the "Lab Results modal"
  And the "Lab Graph" should be "Displayed" in the "Lab Results modal"
  And the "Lab Graph" title is "TRIGLYCERIDE - SERUM"
  And the "Y-axis Label" should be "Displayed" in the "Lab Results modal"
  And the "Y-axis Label" is "mg/dL"


# Lab reports are missing in the UI - marking unstable until jMeadows transformation is complete
@f144_lab_results_modal_non_numeric_no_graph @US2467 @TA7888 @modal_test @vimm
Scenario: Lab Results Modal - no Lab History graph is displayed for non-numerical result types.
  Given user searches for and selects "Bcma,Eight"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  And the user is viewing the expanded "Lab Results" applet
  When the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "pathology report Details"
  And the "Lab Graph" should be "Hidden" in the "Lab Results modal"

@f144_lab_results_modal_graph_date_axis_years @US2562 @TA7868a @modal_test @debug @DE1142
Scenario: Lab Results Modal - ensure data ranges are appropriate for number of tests.
  Given user searches for and selects "Seven,Patient"
  And Cover Sheet is active
  And the user has selected All within the global date picker
  And the user is viewing the expanded "Lab Results" applet
  When the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "TRIGLYCERIDE - SERUM"
  And the user clicks the date control "All" in the "Lab Results modal"
  And the "Total Tests" label has the value "22"
  And the number of "Graph Points" is "22" in the "Lab Results modal"
  And the number of "Date Range labels" is "3" in the "Lab Results modal"
  And the "Date Range labels" in the "Lab Results modal" are given as
    | Label       |
    | Jan 01 2008 |
    | Jan 01 2009 |
    | Jan 01 2010 |






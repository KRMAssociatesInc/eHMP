@F144_Lab_Results_Modal @Lab_Results @manual 
Feature: F144 - eHMP Viewer GUI - Lab Results in expanded view

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  
@f144_lab_results_modal_graph_reference_range_display @US2504 @TA7969 @manual @UI @modal_test
Scenario: Lab Results Modal - ensure data ranges are appropriate for number of tests.
  #There is a defect to track the lab results modal graph issue.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Given the user has selected All within the global date picker
  And the user clicks the control "Expand View" in the "Lab Results applet"
  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  And the modal's title is "Sodium, Blood Quantitative - PLASMA"
  #There is a defect to track the lab results modal graph issue.
  #And the number of "Graph Points" is "6" in the "Lab Results modal"
  #And the following Reference Ranges are displayed in the graph
  #  | Date       | Low Range  | High Range |
  #  | 02-22-2013 | 136 mmol/L | 145 mmol/L |
  #  | 03-28-2013 | 134 mmol/L | 146 mmol/L |
  #  | 03-28-2013 | 136 mmol/L | 145 mmol/L |
  #  | 04-03-2013 | 134 mmol/L | 146 mmol/L |
  #  | 04-09-2013 | 134 mmol/L | 146 mmol/L |
  #  | 05-07-2013 | 134 mmol/L | 136 mmol/L |

@f144_lab_results_modal_graph_clear_date_axis_labels @US2982 @TA9721 @manual @UI @modal_test
Scenario: Lab Results Modal - ensure dates are clearly displayed even when zoomed.
  #There is a defect to track the lab results modal graph issue.  also we need to identify a patient with Panel data.
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  Given the user has selected All within the global date picker
  And the user clicks the control "Expand View" in the "Lab Results applet"
  #And the user clicks the first Panel result in the Lab Results applet
  #And the user clicks the first Lab Test in the Panel result details
  #Then the modal is displayed
  #And the modal's title is "TRIGLYCERIDE - SERUM"
  #There is a defect to track the lab results modal graph issue.
  #And the number of "Graph Points" is "22" in the "Lab Results modal"
  #When the user zooms in the "Lab Results applet" graph manually
  #Then the dates on the X-axis are clearly displayed to the user
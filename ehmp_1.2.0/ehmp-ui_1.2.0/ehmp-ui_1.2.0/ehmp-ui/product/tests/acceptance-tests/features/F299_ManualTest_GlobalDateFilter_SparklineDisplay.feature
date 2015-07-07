@F299_ManualTest_Sparkline_Graph @manual @future
Feature: F229 – Global Timeline Date Filter

#This feature will display a sparkline next to the global date picker to display the history of the encounters, the current date and any scheduled future encounters.  The Global Date Filter (GDF) function will be combined with the Timeline date selection feature.

# Team Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Onehundred,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field         | value                 |
    | patient name  | Onehundred,Patient    |
  Given the " __ - __" dates are correctly set to "18" months in the past and "6" months in the future

@F299_ManualTest_Sparkline_Graph_1 @US4040 @manual @future
Scenario: display a sparkline next to the global date picker for Outpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

@F299_ManualTest_Sparkline_Graph_2 @US4040 @manual @future
Scenario: display a sparkline next to the global date picker for Inpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

@F299_ManualTest_Sparkline_Graph_3 @US4040 @manual @future
Scenario: display a sparkline next to the global date picker for both Outpatient Med and Inpatient Med that has data for the selected date range
  Then 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

@F299_ManualTest_Sparkline_Graph_4 @US4040 @manual @future
Scenario: display a sparkline next to the global date picker for both Outpatient Med and Inpatient Med that has NO data for the selected date range
  Then 0 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

@F299_ManualTest_Sparkline_Graph_5 @US4040 @manual @future
Scenario: display a sparkline next to the global date picker for both Outpatient Med and Inpatient Med that has data for the selected date range
  Then 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "All"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "All" months in the past and "1200" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "2yr"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "1yr"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "3mo"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "1mo"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "1" months in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "72hr"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

  When the user clicks on the sparkline graph on the "Coversheet"
  And the user clicks the date control "24hr"
  And the user clicks the "Apply" button
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And 2 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph

@F299_ManualTest_SelectedActivities_Graph @manual @future
Feature: F229 – Global Timeline Date Filter

#This feature will display the breakout graph is a stack chart that represents the selected time period, as opposed to the full history graph. The stacks will show a breakout of the out-patient vs. the in-patient visits.

# Team Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Onehundred,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field         | value                 |
    | patient name  | Onehundred,Patient    |
  Given the " __ - __" dates are correctly set to "18" months in the past and "6" months in the future

@F299_ManualTest_SelectedActivities_Outpatient_Graph_1 @US4112 @manual @future
Scenario: display selected activities graph for Outpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #custom dates
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  When the user drags the left or right bar the custom dates will be updated
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed


@F299_ManualTest_SelectedActivities_Inpatient_Graph_2 @US4112 @manual @future
Scenario: display selected activities graph for Inpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #custom dates
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  When the user drags the left or right bar the custom dates will be updated
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 1 color selected activities graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed


@F299_ManualTest_SelectedActivities_Outpatient_Inpatient_Graph_3 @US4112 @manual @future
Scenario: display selected activities graph for Outpatient Med and Inpatient Med that has data for the selected date range
  Then 2 colors sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

  #custom dates
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  When the user drags the left or right bar the custom dates will be updated
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 2 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed


@F299_ManualTest_SelectedActivities_Outpatient_Inpatient_Graph_4 @US4112 @manual @future
Scenario: display selected activities graph for Outpatient Med and Inpatient Med that has NO data for the selected date range
  Then 0 colors sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  #All
  And the the date control is set to "All" by default
  Given the full range of NO historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #custom dates
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  When the user drags the left or right bar the custom dates will be updated
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period
  #stack graph
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed
  #change dates
  When the user clicks on left or right drags to select a new date
  Then the selected activities stack graph is filtered to reflect the selected time period
  And 0 colors selected activities graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the selected activities graph
  When the user hovers over the stack graph
  Then there will be no tool-tip displayed

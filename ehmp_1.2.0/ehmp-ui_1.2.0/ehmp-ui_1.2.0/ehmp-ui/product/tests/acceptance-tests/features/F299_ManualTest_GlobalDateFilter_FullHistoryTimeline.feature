@F299_ManualTest_FullHistory_Highchart @manual @future
Feature: F229 – Global Timeline Date Filter

#This feature will display full history timeline highchart for the global date timline expanded view.

# Team Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Onehundred,Patient"
  Then Cover Sheet is active
  Then the "patient identifying traits" is displayed with information
    | field         | value                 |
    | patient name  | Onehundred,Patient    |
  Given the " __ - __" dates are correctly set to "18" months in the past and "6" months in the future

@F299_ManualTest_FullHistory_Outpatient_Highchart_1 @US4034 @manual @future
Scenario: display a full history timeline for Outpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Outpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

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


@F299_ManualTest_FullHistory_Inpatient_Highchart_2 @US4034 @manual @future
Scenario: display a full history timeline for Inpatient Med that has data for the selected date range
  Then 1 color sparkline graph for Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

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


@F299_ManualTest_FullHistory_Outpatient_Inpatient_Highchart_3 @US4034 @manual @future
Scenario: display a full history timeline for Outpatient Med and Inpatient Med that has data for the selected date range
  Then 2 colors sparkline graph for both Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #2 years
  And the user clicks the date control "2yr"
  And the "__ to __" dates are correctly set to "24" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 year
  And the user clicks the date control "1yr"
  And the "__ to __" dates are correctly set to "12" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 months
  And the user clicks the date control "3mo"
  And the "__ to __" dates are correctly set to "3" months in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #3 days
  And the user clicks the date control "72hr"
  And the "__ to __" dates are correctly set to "3" days in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #1 day
  And the user clicks the date control "24hr"
  And the "__ to __" dates are correctly set to "1" day in the past and "6" months in the future
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

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

@F299_ManualTest_NoHistory_Outpatient_Inpatient_Highchart_4 @US4034 @manual @future
Scenario: display a No history timeline for Outpatient Med and Inpatient Med that has NO data for the selected date range
  Then 0 color sparkline graph for Outpatient Med and Inpatient Med will be displayed with any future encounters
  And 1 red line with todays date will be displayed on the sparkline graph
  When the user clicks on the sparkline graph on the "Coversheet"
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is displayed
  And there are bars that represent the encounter information for a given time period

  #All
  And the user clicks the date control "All"
  And the "__ to __" dates are correctly set to "All" months in the past and "100" months in the future
  Given the full range of historical data for the patient is displayed
  And "ALL ACTIVITIES" is displayed as the header
  And 1 red line with todays date will be displayed on the highchart
  And data beyond the current date reference point is NOT displayed
  And there are bars that represent the encounter information for a given time period

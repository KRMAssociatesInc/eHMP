@F299_Global_Date_Timeline @manual @future
Feature: F299 - Global Timeline Date Filter
# This feature will allow a user to drag and select the dates by dragging on the All Activities graph.

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI

@f299-1.3_Selecting_All_activities_from_timeline @US4044 @TA13383a @manual @future
Scenario: F299-1.3 Selecting dates in All activities timeline with multiple years of historic data

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
And the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the Custom date fields should be "enabled" on the "Coversheet"
Then "All Activities" graph is displayed
And "current date" marked as "TODAY" is displayed on the "All Activities" graph
And bars are displayed on the "All Activities" graph


@f299-1.4_Selecting_date_when_no_historic_data @US4044 @TA13383b @manual @future @debug
Scenario: F299-1.4 Selecting dates for the all activity history view with no historic data

Given user searches for and selects "Eighteen,Outpatient"
Then Cover Sheet is active
And the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the Custom date fields should be "enabled" on the "Coversheet"
Then "All Activities" graph is displayed
And "current date" marked as "TODAY" is displayed on the "All Activities" graph
And bars are not displayed on the "All Activities" graph
And no area to select on "All Activities" graph


@f299-3.5_Selecting_date_from_timeline @US4044 @TA13383c @manual @future
Scenario: F299-1.5 Selecting the date range from the timeline updates the global date

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
And the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the Custom date fields should be "enabled" on the "Coversheet"
And "All Activities" graph is displayed
When user drags over to a past date on "All Activities" graph
Then the selected date range is highlighted in the graph
And the gloabal date filter "from field" displays selected "past" date
And the gloabal date filter "to field" displays selected "future" date



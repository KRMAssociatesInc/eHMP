@F299_Global_Date_Timeline @regression
Feature: F299 - Global Timeline Date Filter
# This feature allows a user to select a date range using custom date filter.  Date selection for "from" will be limited to the previous day and all past dates and t he date selection for "to" will be allowed to current to future date.

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI



@f299-3.3_form_date_masking_and_validation @US4025 @TA13178c 
Scenario: F299-3.3 From date text field masking and validation

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the Date Filter displays "18" months in the past and "6" months in the future
Then the Custom date fields should be "enabled" on the "Coversheet"
When user enters "01/01/2019" in the from field
And the from tooltip contains text "Please select a date in the past."
Then the Custom date field "Apply" button should be "disabled" on the "Coversheet"
When user enters today's date in from field
And the from tooltip contains text "Please select a date in the past."
Then the Custom date field "Apply" button should be "disabled" on the "Coversheet"


@f299-3.4_to_date_masking_and_validation @US4025 @TA13178d @future @manual
Scenario: F299-3.4 To date text field masking and validation

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the Date Filter displays "18" months in the past and "6" months in the future
Then the Custom date fields should be "enabled" on the "Coversheet"
When user enters "01/01/2014" in the to field
And the to tooltip contains text "Please select a date that is not in the past."
Then the Custom date field "Apply" button should be "disabled" on the "Coversheet"
When user enters yesterday's date in to field
And the to tooltip contains text "Please select a date that is not in the past."
Then the Custom date field "Apply" button should be "disabled" on the "Coversheet"



@f299-3.5_apply_button_to_close_calender @US4025 @TA13178e @future @manual
Scenario: F299-3.5 Apply button to close calendar

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
When the user inputs "01/01/2010" in the "From Date" control in the "Coversheet"
And the user inputs "01/01/2018" in the "To Date" control in the "Coversheet"
Then the Custom date field "Apply" button should be "enabled" on the "Coversheet"
And the user clicks the control "Apply" on the "Coversheet"
Then the date filter closes

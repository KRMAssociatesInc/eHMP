@F299_Global_Date_Timeline 
Feature: F299 - Global Timeline Date Filter
# The date menu selection will no longer show 6 months into the future.

# Team: Andromeda
# This test is being moved to archive.
# Manual test is defined in functional test F299 US4228 GDT Pre-Defined Dates Displays Past to Present Dates Only
Background:
  Given user is logged into eHMP-UI

 @f299-3.9_clicking_outside @US4228 @TA14378b @vimm @DE864 @manual 
Scenario: F299-3.10 Clicking outside of GDT closes the window and dates are not set

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the user clicks the date control "All" on the "Coversheet"
Then the "From Date" input should have the value "07/16/1993" on the "Coversheet"
And the to date displays today's date 
And the user clicks the control "Cancel" on the "Coversheet"
Then the date filter closes
And the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future

@f299-3.10_clicking_cancel @US4228 @TA14378c @DE864 @manual 
Scenario: F299-3.10 Clicking cancel button closes the window and dates are not set

Given user searches for and selects "Eight,Patient"
Then Cover Sheet is active
When the user clicks the control "Date Filter Toggle" on the "Coversheet"
And the user waits for 5 seconds
And the user clicks the date control "All" on the "Coversheet"
Then the "From Date" input should have the value "07/16/1993" on the "Coversheet"
And the to date displays today's date 
#user clicks outside of GDT
When user selects Documents from Coversheet dropdown 
Then the date filter closes
And the "Viewing __ to __" text is correctly set to "18" months in the past and "6" months in the future 
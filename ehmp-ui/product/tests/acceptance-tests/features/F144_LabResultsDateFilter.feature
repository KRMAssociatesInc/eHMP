@F144_Lab_Results_Date_Filter @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

@f144_lab_results_date_filter_open_close @US2221 @TA6057a @reworked_in_firefox
Scenario: Date filtering - opening and closing control.
	When the user clicks the control "Expand View" in the "Lab Results applet"
	Then the "Date Filter" should be "Displayed" in the "Lab Results applet"
	When the user clicks the control "Filter Toggle" in the "Lab Results applet"
	Then the "Date Filter" should be "Hidden" in the "Lab Results applet"
	When the user clicks the control "Filter Toggle" in the "Lab Results applet"
	Then the "Date Filter" should be "Displayed" in the "Lab Results applet"


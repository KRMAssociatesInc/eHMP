@F144_Lab_Results_Date_Filter @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

@f144_lab_results_date_filter_preset_dates @US2221 @TA6057b @manual
Scenario: Date filtering using the preset buttons.
	When the user clicks the control "Expand View" in the "Lab Results applet"
	Then the "Date Filter" should be "Displayed" in the "Lab Results applet"
	And the following choices should be displayed for the "Lab Results applet" Date Filter
		| All | 2yr | 1yr | 3mo | 1mo | 7d | 72hr | 24hr |
	When the user clicks the date control "All" in the "Lab Results applet"
	Then the "Lab Results Applet" table contains 357 rows
	When the user clicks the date control "2yr" in the "Lab Results applet"
	Then the "Lab Results Applet" table contains 33 rows
	When the user clicks the date control "1yr" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"
	When the user clicks the date control "3mo" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"
	When the user clicks the date control "1mo" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"
	When the user clicks the date control "7d" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"
	When the user clicks the date control "72hr" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"
	When the user clicks the date control "24hr" in the "Lab Results applet"
	Then no results should be found in the "Lab Results applet"

@f144_lab_results_modal_apply_enabled @US2326 @TA6661b @DE284 @reworked_in_firefox
Scenario: Custom filters should NOT retain their values.
  Then the "Lab Results" applet is finished loading

  #When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user waits for 5 seconds
  #And the user clicks the date control "All" on the "Coversheet"
  #And the user clicks the control "Apply" on the "Coversheet"
  And the user has selected All within the global date picker

  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  When the user inputs "01/01/2010" in the "From Date" control in the "Lab Results modal"
  And the user inputs "01/01/2013" in the "To Date" control in the "Lab Results modal"
  And the Custom date field "Apply" button should be "enabled" in the "Lab Results modal"
  When the user clicks the date control "2yr" in the "Lab Results modal"
  Then the "From Date" input should have the value "" in the "Lab Results modal"
  And the "To Date" input should have the value "" in the "Lab Results modal"
  And the Custom date field "Apply" button should be "disabled" in the "Lab Results modal"

@f144_lab_results_modal_apply_enabled @US2326 @TA6661a @reworked_in_firefox
Scenario: Apply button should be disabled unless valid dates are entered.

  #When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user waits for 5 seconds
  #And the user clicks the date control "All" on the "Coversheet"
  #And the user clicks the control "Apply" on the "Coversheet"
  And the user has selected All within the global date picker

  And the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  When the user inputs "" in the "From Date" control in the "Lab Results modal"
  And the user inputs "" in the "To Date" control in the "Lab Results modal"
  Then the Custom date field "Apply" button should be "disabled" in the "Lab Results modal"
  When the user inputs "01/01/2010" in the "From Date" control in the "Lab Results modal"
  And the user inputs "01/01/2013" in the "To Date" control in the "Lab Results modal"
  Then the Custom date field "Apply" button should be "enabled" in the "Lab Results modal"
  When the user inputs "" in the "From Date" control in the "Lab Results modal"
  And the user inputs "" in the "To Date" control in the "Lab Results modal"
  Then the Custom date field "Apply" button should be "disabled" in the "Lab Results modal"

@f144_lab_results_coversheet_default_date @US2481 @TA7508 @reworked_in_firefox
Scenario: Default date range of the applet is 18 months past and 6 months in the future.
  When the user clicks the control "Expand View" in the "Lab Results applet"
  Then the "From Date" input should be set to "18" months in the "past" in the "Lab Results applet"
  And the "To Date" input should be set to "6" months in the "future" in the "Lab Results applet"

@f144_lab_results_date_filter_custom_from_to @US2221 @TA6057c @reworked_in_firefox
Scenario: Date filtering using the Custom button.
	When the user clicks the control "Expand View" in the "Lab Results applet"
	And the user inputs "04/11/2013" in the "From Date" control in the "Lab Results applet"
	And the user inputs "05/04/2013" in the "To Date" control in the "Lab Results applet"
	And the user clicks the control "Apply" in the "Lab Results applet"
	Then the "Lab Results Applet" table contains 7 rows





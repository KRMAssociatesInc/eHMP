@F144_Lab_Results_Modal @Lab_Results @regression
Feature: F144 - eHMP Viewer GUI - Lab Results

# Team: Andromeda, inherited by Team Venus

Background:
  Given user is logged into eHMP-UI
  When user searches for and selects "Eight,Patient"
  Then Cover Sheet is active
  Given the user has selected All within the global date picker
  And the applet displays lab results

  @f144_2_lab_results_coversheet_modal @US2034 @TA5012b @DE1392 @debug @reworked_in_firefox
Scenario: Opening and closing the modal from a coversheet - non-Panel result.
  When the user clicks the first non-Panel result in the Lab Results applet
  Then the modal is displayed
  When the user closes modal by clicking the "Close" control
  Then the coversheet is displayed

  @f144_2_lab_results_coversheet_panel_modal @US2034 @TA5012a @DE387 @DE1250 @DE1392 @debug @reworked_in_firefox
Scenario: Opening and closing the modal from a coversheet - Panel result.
  When the user scrolls to the bottom of the Lab Results Applet
  Given the user has filtered the lab results on the term "2988" down to 2 rows
  When the user clicks the Panel "COAG PROFILE BLOOD PLASMA WC LB #2988" in the Lab Results applet
  And the user clicks the Lab Test "PROTIME - PLASMA" in the Panel result details
  Then the modal is displayed
  And the user waits for 5 seconds
  Then take screenshot for comparison purposes with name "labresults_close_defect"
  When the user closes modal by clicking the "Close" control
  Then the coversheet is displayed
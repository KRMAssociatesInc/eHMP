@F144_Orders @regression
Feature: F144 - eHMP Viewer GUI - Orders

Background:
  Given user is logged into eHMP-UI

# the following scenario was unstable in cucumber and was reworked and is running in the firefox, rspec build
 @f144_4_lab_results_base_applet_single_page @US2033 @vimm @triage @DE1258 @reworked_in_firefox
  Scenario: View ALL orders on Expand View
  Given user searches for and selects "Seven,Patient"
  Then Cover Sheet is active
  And the user clicks the control "Expand View" in the "Orders applet"
  Then the "Date Filter" should be "Displayed" in the "Orders applet"
  When the user clicks the date control "All" in the "Orders applet"
  Then the "Orders" applet is finished loading
  And the user inputs "Diet" in the "Text Filter" control in the "Orders applet"
  Then the "Orders" applet is finished loading
  When the user scrolls to the bottom of the Orders Applet
  Then the "Orders Applet" table contains 2 rows
  And the "Orders Applet" table contains rows
| Order Date | Status       | Order                     | Type                  | Provider Name          | Start Date | Stop Date  | Facilty |
| 03/25/2004 | DISCONTINUED | REGULAR Diet <Discharge>  | Dietetics Order       | Labtech,Fortyeight     | 03/25/2004 | 03/25/2004 | BAY     |
| 03/25/2004 | DISCONTINUED | REGULAR Diet <Discharge>  | Dietetics Order       | Labtech,Fortyeight     | 03/25/2004 | 03/25/2004 | BAY     |

@f144_orders_stepping_all @US2338 @TA6760b @modal_test @vimm @DE1329 @triage @reworked_in_firefox
Scenario: Stepping through the Orders in the list - across pages.
  Given user searches for and selects "Eight,Patient"
  Then Cover Sheet is active

  #When the user clicks the control "Date Filter Toggle" on the "Coversheet"
  #And the user waits for 5 seconds 
  #And the user clicks the date control "All" on the "Coversheet"
  #And the user clicks the control "Apply" on the "Coversheet"
  And the user has selected All within the global date picker

  When the user selects "All" in the Orders applet Order Type dropdown
  #And clicks the first result in the "Orders Applet"
  When the user selects order "01AUDIOLOGY OUTPATIENT Cons Consultant's Choice"
  Then the modal is displayed
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  When the user clicks the control "Next Button" in the "Orders modal"
  # Next item is the last item on the 1st page
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "REGULAR Diet <Discharge>"
  # Next item is the first item on the 2nd page
  When the user clicks the control "Next Button" in the "Orders modal"
  Then the modal's title is "CULTURE & SUSCEPTIBILITY UNKNOWN WC LB #18424"
  # Next item is the last item on the 1st page
  When the user clicks the control "Previous Button" in the "Orders modal"
  Then the modal's title is "REGULAR Diet <Discharge>"

@f144_orders_filter_button_persistence @US2496 @TA7984a @DE1080 @triage @reworked_in_firefox
Scenario: Filter button is persisted when switching Orders applet views.
  Given user searches for and selects "Bcma,Eight"
  Then Cover Sheet is active

  And the user has selected All within the global date picker
  When the user scrolls to the bottom of the Orders Applet
  And the "Orders Applet" table contains 54 rows
  When the user selects "Laboratory" in the Orders applet Order Type dropdown
  Then the "Orders" applet is finished loading
  And the "Orders Applet" table contains 7 rows
  When the user clicks the control "Expand View" in the "Orders applet"
  Then the "Orders" single page view is displayed
  And the "Orders Applet" table contains 7 rows
  And the selected Order type is "Laboratory"
  When the user clicks the "Minimize" button in the Orders applet
  Then the coversheet is displayed
  And the selected Order type is "Laboratory"

@f144_orders_applet_filtering_reworked @US1775 @TA5345b  @DE615 @DE1273 @triage @reworked_in_firefox
Scenario: Filtering of the Orders coversheet applet.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  When the user clicks the control Expand View in the Orders applet
  # Then the Orders applet displays "No Records Found"
  And the user clicks the date control All on the Orders applet
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 445 rows

  When the user selects "Consult" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 8 rows with the Type "Consult"

  When the user selects "Laboratory" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 349 rows with the Type "Laboratory"

  When the user selects "Medication, Inpatient" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then no results should be found in the "Orders applet"

  When the user selects "All" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 445 rows
  
  When the user selects "Medication, Non-VA" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 14 rows with the Type "Medication, Non-VA"

  When the user selects "All" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 445 rows

  When the user selects "Medication, Outpatient" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 46 rows with the Type "Medication, Outpatient"

  When the user selects "Nursing Order" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 8 rows with the Type "Nursing"

  When the user selects "Radiology" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 8 rows with the Type "Radiology"

  When the user selects "All" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 445 rows

  When the user selects "Dietetics Order" in the Orders applet Order Type dropdown
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 4 rows with the Type "Dietetic"
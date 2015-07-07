@F144_Orders  @regression
Feature: F144 - eHMP Viewer GUI - Orders

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI

@f144_orders_applet_filtering_reworked @US1775 @TA5345b  @DE615
Scenario: Filtering of the Orders coversheet applet.
  Given user searches for and selects "Eight,Patient"
  And Cover Sheet is active
  When the user clicks the control Expand View in the Orders applet
  # Then the Orders applet displays "No Records Found"
  And the user clicks the date control All on the Orders applet
  And the user scrolls to the bottom of the Orders Applet
  Then the Orders Applet table contains 445 rows

  When the user selects "Consult" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 8 rows with the Type "Consult"

  When the user selects "Laboratory" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 349 rows with the Type "Laboratory"

  When the user selects "Medication, Inpatient" in the Orders applet Order Type dropdown
  Then no results should be found in the "Orders applet"

  When the user selects "All" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 445 rows
  
  When the user selects "Medication, Non-VA" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 14 rows with the Type "Medication, Non-VA"

  When the user selects "All" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 445 rows

  When the user selects "Medication, Outpatient" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 46 rows with the Type "Medication, Outpatient"

  When the user selects "Nursing Order" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 8 rows with the Type "Nursing"

  When the user selects "Radiology" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 8 rows with the Type "Radiology"

  When the user selects "All" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 445 rows

  When the user selects "Dietetics Order" in the Orders applet Order Type dropdown
  Then the Orders Applet table contains 4 rows with the Type "Dietetic"

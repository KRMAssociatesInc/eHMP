@debug @manual @US3360 @US3562 @US3563
Feature:F172 - User-Definition Screens - Applet Definition
#Team Neptune
# This test is being moved to archive.
# Manual test is defined in functional test TC26
Scenario: Use the gridster view to move the applets and then view expanded view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the vitals applet is moved from the 372px/6px to 563px/106px
  Then the active medications applet is moved from 376px/67px to 372px/6px
  When the user clicks the vitals expanded view button
  Then the user views the expanded view
  
Scenario: Use the gridster view to move the applets and then view model view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the vitals applet is moved from the 372px/6px to 563px/106px
  Then the active medications applet is moved from 376px/67px to 372px/6px
  When the user clicks the vitals row
  Then the vitals modal view opens.

Scenario: Use the gridster view to stretch the applets and then view expanded view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the vitals applet is expanded from 338px and 1114px to 542px and 1114px
  Then the active medications applet moves to 347px/240p
  When the user clicks the vitals expanded view button
  Then the user views the expanded view

Scenario: Use the gridster view to stretch the applets and then view model view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the vitals applet is expanded from 338px and 1114px to 542px and 1114px
  Then the active medications applet moves to 347px/240px
  When the user clicks the vitals row
  Then the vitals modal view opens.
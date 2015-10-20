@debug @manual @US3835
Feature:F172 - User-Definition Screens - Carousel tray and filter
#Team Neptune
# This test is being moved to archive.
# Manual test is defined in functional test TC36
Scenario: User scrolls through the carousel tray
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the user clicks the plus button 
  Then the carousel tray view opens
  When the window is in full screen mode
  Then there is only one carousel page
  When the window is minimized so there are two carousel pages
  Then the first page displays with ten applets
  When the user click the left arrow 
  Then the second page displays with 2 applets
  When the user clicks the first dot
  Then the first page displays with ten applets
 
Scenario: User filters and then scrolls through the carousel tray
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the user clicks the plus button 
  Then the carousel tray view opens
  When the window is in full screen mode
  Then there is only one carousel page
  When the user types "RE" into the carousel filter
  Then there is one carousel page
  And the first page diplays three applets

Scenario: User drags carousel tray option into the gridster preview 
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the user clicks the plus button 
  Then the carousel tray view opens
  When the window is in full screen mode
  Then there is only one carousel page
  When user drags the Active Medications carousel applet to the gridster preview
  Then the Active Medications carousel applet is added to the gridster preview

Scenario: User filters and drag carousel tray applet into the gridster preview
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then Gridster Cover Sheet is active
  When the user clicks the plus button 
  Then the carousel tray view opens
  When the window is in full screen mode
  Then there is only one carousel page
  When the user types "RE" into the carousel filter
  Then there is one carousel page
  And the first page diplays three applets
  When user drags the Clinical Reminders carousel applet to the gridster preview
  Then the Active Clinical Reminders applet is added to the gridster preview
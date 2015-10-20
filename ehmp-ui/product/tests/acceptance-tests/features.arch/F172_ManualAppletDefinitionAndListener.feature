@US4509 @US3730 @manual @future
Feature:F172 - User-Definition Screens - Applet Definition
#Team Neptune
# This test is being moved to archive.
# Manual test is defined in functional test TC61 and F339 US4509 Verify Trend view for the applets
@US4509a
Scenario: Use the gridster view to move the applets in User Defined Screens and then view trend view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks "Workspace Manager Button"
  And the user clicks "Add New Worksheet Button"
  And the user adds title and description and clicks "Add and Load Button"
  Then the user drags and drops each applet on the canvas/workspace from the carousel in screen editors page
  And the user selects each of trend view for vitals, encounters, clinical reminders, medications, conditions, immunizations
  Then the user clicks each record for each applet
  And the modal view opens up for each record clicked

@US3730a
Scenario: Use the gridster view to move the applets in User Defined Screens and then view trend view, summary view and expanded view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks "Workspace Manager Button"
  And the user clicks "Add New Worksheet Button"
  And the user adds title and description and clicks "Add and Load Button"
  Then the user drags and drops each applet on the canvas/workspace from the carousel in screen editors page
  And the user selects each of trend view, summary view and expanded view applicable for each applet selected
  Then the user clicks each record for each applet
  And the modal view opens up for each record clicked
  
@US3730b  
Scenario: Click on one of record for each applet in Coversheet view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks dropdown menu and selects Coversheet view
  And the user clicks one record for each applet in the coversheet view
  Then the user can see the modal view for each record
 
@US3730c 
Scenario: Click on one of record for each applet in Timeline view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks dropdown menu and selects Timeline view
  And the user clicks one record for each applet in the Timeline view
  Then the user can see the modal view for each record

@US3730d  
Scenario: Click on one of record for each applet in Overview view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks dropdown menu and selects Overview view
  And the user clicks one record for each applet in the Overview view
  Then the user can see the modal view for each record

@US3730e  
Scenario: Click on one of record for each applet in Meds Review view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks dropdown menu and selects Meds Review view
  And the user clicks one record for each applet in the Meds Review view
  Then the user can see the modal view for each record

@US3730f  
Scenario: Click on one of record for each applet in Documents view
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks dropdown menu and selects Documents view
  And the user clicks one record for each applet in the Documents view
  Then the user can see the modal view for each record 

 
  
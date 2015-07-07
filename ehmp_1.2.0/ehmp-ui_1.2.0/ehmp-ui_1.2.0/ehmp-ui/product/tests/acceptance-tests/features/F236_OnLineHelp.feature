@F236_OnLineHelp

Feature: F236 - OnLineHelp
#"As an an eHMP user, I need to be able to click on help icons in strategic areas in he eHMP UI in order to display contextual help information and create PDF documents;  so that I can access and print PDF documents of help content."

#POC: Team Venus
@F236_1_OnLineHelp @US4520
Scenario: Verify if OnLineHelp icons are present
  Given the On-line Help icon on login page of eHMP-UI
  Then user is logged into eHMP-UI
  Then the On-line Help icon is present on Patient Search page
  And user searches for patient "Eight,Patient"
  And selects it
  Then Cover Sheet is active
  And the coversheet is displayed
  Then the On-line Help icon is present on "Coversheet" page
  When user navigates to Documents Applet
  Then "Documents" is active
  Then the On-line Help icon is present on Documents page
  When user navigates to Timeline Applet
  Then "Timeline" is active
  Then the On-line Help icon is present on Timeline page

@F236_2_OnLineHelp @US4520
Scenario: Verify if OnLineHelp icon is clickable
  Given user is logged into eHMP-UI
  Then the On-line Help page is opened by clicking on the On-line Help icon

@F236_3_OnLineHelp @US6110
Scenario: Verify if tooltips are present
  Given user is logged into eHMP-UI
  And user searches for and selects "Four,Patient"
  Then Overview is active
  Then the "Vitals" applet is finished loading
  Then the tooltip is present on "Column header"
  #Then the tooltip is present on "Letter symbol"
  Then the tooltip is present on "Icons from toolbar"
  Then the tooltip is present on "Timeline"
  Then the tooltip is present on "Status bar"

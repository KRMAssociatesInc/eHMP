@F353_Renaming_Applets @future
Feature: F353 - Stacked Graph

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  And the user clicks the "Workspace Manager"
  When the user clicks "Plus Button"
  And the user clicks "Customize"

@F353_Rename_Applet @US5333 @US5336 @future
Scenario: User creates the applet container for stack graphs
  When drag and drop the Stacked Graph right by 0 and down by 10
  And user clicks "Stacked Graph expanded view" on the screen editor
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring applet 1 to view
  And user clicks on the control "Header"
  #checking restrictions
  When enters "Graph/" to the header text
  Then a tooltip is displayed containing message "Applet titles may not contain special characters"
  And enters "12345678901234567890123456789012345" to the header text
  Then applet with title "123456789012345678901234567890" is displayed
  And user clicks on the control "Header"
  #entering a valid applet title
  And enters "MY RENAMED STACKED GRAPH" to the header text
  Then applet with title "MY RENAMED STACKED GRAPH" is displayed
  #checking persistence of the applet title 
  And the user attempts signout
  And user is logged into eHMP-UI
  And user searches for and selects "Eight,Patient"
  When the user clicks the "CoversheetDropdown Button"
  And user clicks on the control "New Workspce"
  And user scrolls the window to bring applet 1 to view
  Then applet with title "MY RENAMED STACKED GRAPH" is displayed
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

 

@F239__UDAF @future
Feature: F353 - Stacked Graph

# Team: Andromeda

Background:
  Given user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  And the user clicks the "Workspace Manager"
  When the user clicks "Plus Button"
  And the user clicks "Customize"

@f239_medication_filtering_by_drug_class @US5708 @future
Scenario: The user shall be able to filter on the drug class. This is limited to the medications applets
  When drag and drop the Medications Review right by 0 and down by 10
  And user clicks on the control "Med Review expanded view"
  And user clicks "Done" on the screen editor
  And user scrolls the window to bring applet 1 to view
  And the user has selected All within the global date picker
  And user clicks on the control "Med Review - Search"
  And the user enteres "ANALGESICS" in search box of the Meds Review Applet
  Then user defined filter "ANALGESICS" is created 
  And "Outpatient Meds Group" summary view contains medications in Meds Review Applet
  | Name                | Sig              | Last  | Fillable  |
  | ASPIRIN TAB,EC      | 81MG PO QAM      |       | (Non-VA)  |
  #checking persistence of drug class filter 
  And the user attempts signout
  And user is logged into eHMP-UI
  And user searches for and selects "fourteen,Patient"
  When the user clicks the "CoversheetDropdown Button"
  And user clicks on the control "New Workspce"
  And user scrolls the window to bring applet 1 to view
  And the user has selected All within the global date picker
  And "Outpatient Meds Group" summary view contains medications in Meds Review Applet
  | Name                | Sig              | Last  | Fillable  |
  | ASPIRIN TAB,EC      | 81MG PO QAM      |       | (Non-VA)  |
  When the user clicks "Workspace Manager Button"
  And the user clicks "Delete"
  And the user clicks "Confirm Delete"
  Then the "User Defined Workspace 1" is not listed in the workspace manager page
  And the user clicks "Done editing" on the workspace manager

 

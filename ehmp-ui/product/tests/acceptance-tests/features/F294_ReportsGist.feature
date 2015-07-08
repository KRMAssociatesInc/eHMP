@F294_reports_gist @regression
Feature: F294 : Documetns Applet - Summary View
As a clinician I would like to have a summary view of documents that contains only items 
that are reports so that I can quickly get to information on reports

#POC: Team Jupiter

@F294_1_ReportsGistDisplay @US4157
Scenario: View Reports Gist View on the overview screen
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  Then Overview is active
  And user sees Reports Gist
  
@F294_2_ReportsGistDisplay_procedure @US4157 @base
Scenario: View procedure in reports gist
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  Then Overview is active
  And user sees Reports Gist
  #When the user clicks the control "Date Filter" on the "Overview"
  #And the user clicks the date control "All" on the "Overview"
  #And the user clicks the control "Apply" on the "Overview"
  And the user has selected All within the global date picker
  And the Reports Gist Applet table contains headers
    | Date | Type |  Entered By |
  And the Reports Gist table contains specific rows
      | row index | Date       | Type              | Entered By        |
      | 2         | 08/12/1992 | Procedure         | None              |
      
@F294_3_ReportsGistDisplay_consult @US4157
Scenario: View consult in reports gist
  Given user is logged into eHMP-UI
  And user searches for and selects "NINETYNINE,PATIENT"
  Then Overview is active
  And user sees Reports Gist
  And the user has selected All within the global date picker
  And the Reports Gist Applet table contains headers
    | Date | Type |  Entered By |
  And the Reports Gist table contains specific rows
      | row index | Date       | Type         | Entered By        |
      | 2         | 04/02/2004 | Consult      | Pathology,One     |

#Need image transformation so 'entered by' will work
@F294_4_ReportsGistDisplay_imaging_labreport @US4157
Scenario: View imaging and lab reports in reports gist
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFORTYSEVEN"
  Then Overview is active
  And user sees Reports Gist
  And the user has selected All within the global date picker
  And the Reports Gist Applet table contains headers
    | Date | Type |  Entered By |
  And the Reports Gist table contains specific rows
      | row index | Date       | Type         		| Entered By        |
      | 15        | 04/06/1995 | Laboratory Report  | Provider,Sixteen  | 
      | 2         | 11/13/1997 | Imaging			| Programmer,Twenty |      

@F285_5_ReportssGist_detail_view @US4157
Scenario: The detail view will come up in a modal when selecting a specific document
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  Then Overview is active
  And user sees Reports Gist
  And the user has selected All within the global date picker
  And the user selects the "Procedure" row in Reports Gist
  Then the modal is displayed
  And the modal's title is "laparascopy Details"
  And the user clicks the modal "Close Button"
  And the modal is closed
      
@F285_6_ReportsGist_extended_view @US4157
Scenario: Clicking on extension will go to the reports table view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOUREIGHTY,PATIENT"
  Then Overview is active
  And user sees Reports Gist
  And the user has selected All within the global date picker
  When the user clicks the control "Expand View" in the "Reports Gist applet"
  Then title of the Reports Applet says "Reports"
  
@F285_7_ReportsGist_filter @US4157
Scenario: Clicking on extension will go to the reports table view
  Given user is logged into eHMP-UI
  And user searches for and selects "ZZZRETFOURFORTYSEVEN"
  Then Overview is active
  And user sees Reports Gist
  And the user has selected All within the global date picker
  When the user clicks the control "Filter Toggle" in the "Reports Gist applet"
  And the user inputs "Procedure" in the "Text Filter" control in the "Reports Gist applet"
  And the Reports Gist table contains specific rows
      | row index | Date       | Type         		| Entered By        |
      | 2         | 12/11/1995 | Procedure			| None			    |  
      | 4         | 04/04/1995 | Procedure			| None			    |

F294_reports_gist @regression
Feature: F294 : Documetns Applet - Summary View
As a clinician I would like to have a summary view of documents that contains only items 
that are reports so that I can quickly get to information on reports

@F285_7_ReportsGist_filter @US4157 @DE1381 @reworked_in_firefox @triage
Scenario: User can filter the reports gist
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
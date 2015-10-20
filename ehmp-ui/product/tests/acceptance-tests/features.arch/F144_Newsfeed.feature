@F144_NewsFeedApplet @regression

Feature: F144-eHMP Viewer GUI - Timeline(NewsFeed)

#DE1328 has been implemented in new framework.  Archiving.
@f144_21_newsFeedDisplay_DoDEncounters @US4183 @DE1328 @debug
Scenario: News feed applet displays all of the DoD Encounters for a given patient in a grid form
  Given user is logged into eHMP-UI
  And user searches for and selects "Onehundredsixteen, Patient"
  And the user has selected All within the global date picker
  When user navigates to Timeline Applet
  Then the NewsFeed Applet table contains rows
    | Date & Time        | Activity    		  | Type          | Entered By | Facility    |
	  | 09/10/2012 - 14:21 | Visit OUTPATIENT	| DoD Encounter |			       | DOD         |
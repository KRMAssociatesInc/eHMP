@F120_ProgressNotesApplet @unstable @DE343 @future
Feature: F120 JLV GUI Refactoring to use VistA Exchange Progress Notes Applet Test

#POC: Team Saturn

@f120_1_progress_notes_summary @US1585
Scenario: View Progress Notes Summary Applet
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
	Then Cover Sheet is active
	And user views screen "progress-notes-list" in the eHMP-UI
	Then the progress notes panel title is "Progress Notes"
	Then the Progress Notes table contains headers
		|Headers|
		|Date |
		|Document Type/Title |
		|Provider |
		|Source System|
	And the Progress Notes table contains 136 rows with the data
        | Date        | Document Type/Title                   | Provider             | Source System    | 
        | 06/06/2013  | Consultation Note (Provider) Document |                      | DOD              | 
        #| 2013-06-03  | Progress Note                         |                      | DOD              | 
        #| 2012-04-10  | Administrative Note                   |                      | DOD              | 
        #| 2011-11-01  | Discharge Summarization Note          |                      | DOD              | 
        #| 2007-05-16  | Advance Directive                     |  LABTECH,FIFTYNINE   | DOD              | 
        #| 2006-12-08  | Surgery Report                        |  PROVIDER,THREE      | CAMP MASTER      | 


@f120_2_progress_notes_details @US1586
Scenario: View Progress Notes Detail Modal
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
	Then Cover Sheet is active
	And user views screen "progress-notes-list" in the eHMP-UI
	Then the progress notes panel title is "Progress Notes"
	When the user clicks "Progress Notes Details..."
    Then the modal title is "Progress Notes/Details"
	Then the Progress Notes Details modal contains headers
		|Headers|
		|Date |
		|Document Type/Title |
 	    |Standardized Document Type |
		|Provider |
	    |Source System|
	And the Progress Notes modal contains 136 rows with the data
        | Date        | Document Type/Title                   | Standardized Document Type | Provider             | Source System    |
        | 06/06/2013  | Consultation Note (Provider) Document |                            |                      | DOD              |
        #| 2013-06-03  | Progress Note                         |                            |                      | DOD              |
        #| 2012-04-10  | Administrative Note                   |                            |                      | DOD              |
        #| 2011-11-01  | Discharge Summarization Note          |                            |                      | DOD              |
        #| 2007-05-16  | Advance Directive                     |                            | LABTECH,FIFTYNINE    | DOD              |
        #| 2006-12-08  | Surgery Report                        |                            | PROVIDER,THREE       | CAMP MASTER      |
    When the user clicks the modal "Close Button"
    Then the modal is closed

@f120_3_progress_notes_details @US1586a
Scenario: View Progress Notes Detail Modal
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
	Then Cover Sheet is active
	And user views screen "progress-notes-list" in the eHMP-UI
	Then the progress notes panel title is "Progress Notes"
	When the user clicks "Progress Notes Details..."
    Then the modal title is "Progress Notes/Details"
	Then the Progress Notes Details modal contains headers
		|Headers|
		|Date |
		|Document Type/Title |
 	    |Standardized Document Type |
		|Provider |
		|Source System |
	And the Progress Notes modal contains 136 rows with the data
        | Date        | Document Type/Title                   | Standardized Document Type | Provider             | Source System    |
        | 06/06/2013  | Consultation Note (Provider) Document |                            |                      | DOD              |
        #| 2013-06-03  | Progress Note                         |                            |                      | DOD              |
        #| 2012-04-10  | Administrative Note                   |                            |                      | DOD              |
        #| 2011-11-01  | Discharge Summarization Note          |                            |                      | DOD              |
        #| 2007-05-16  | Advance Directive                     |                            | LABTECH,FIFTYNINE    | DOD              |
        #| 2006-12-08  | Surgery Report                        |                            | PROVIDER,THREE       | CAMP MASTER      |
    When the user clicks the modal "Close Button"
    Then the modal is closed







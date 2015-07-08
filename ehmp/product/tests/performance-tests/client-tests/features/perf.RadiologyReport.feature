@perf.radiologyreport @perf
Feature: F102 Return and display of labs medications

Background:
	Given user logged with valid credentials to HMP


@perf.radiologyreport_rest 
Scenario: Client can request Labs
	Given a patient in multiple VistAs
	When the client requests Radiology for the patient "B362;44"
	Then eHMP returns "17" in the radiology results
	And the results contain data group for radiology
		| field    | value                                  |
     	| summary  | GLUCOSE (BLOOD) 121 MG/DL              |
      	| uid      | urn:va:lab:B362:71:CH;7028782.924588;2 |
      	| result   | 121		                             |
      	| specimen | BLOOD                                  |
      	| high     | 128                                    |
      	| low      | 84                                     |
      	
    And the results contain data group
		| field    | value                                  |
      	| summary  | CHLORIDE (BLOOD) canc                  |
      	| uid      | urn:va:lab:B362:71:CH;7028783.855185;7 |
      	| result   | canc                                   |
      	| specimen | BLOOD                                  |
    

@perf.radiologyreport_display
Scenario: User can view requested labs in the eHMP UI
	Given a patient in multiple VistAs
  When user searches "radiology report" for the patient "Zzzretiredeight,Patient"
  And user selected "Search" from tasks option bar
 	And user looks and selects "radiology report"
  Then Radiology search results displays "13" summaries
    |summary_title|summary_date |
    |ANKLE 2 VIEWS|26-Feb-1997 13:00|
    |CHEST SINGLE VIEW|26-Feb-1993 13:04|
    |ECHOGRAM ABDOMEN LTD|11-Few-1993 16:04|
    |ECHOGRAM LIVER|11-Feb-1993 16:04|
    |ANKLE 2 VIEWS|09-Feb-1993 07:55|
    |CHEST SINGLE VIEW|03-Feb-1993 09:16|
    |CHEST 2 VIEWS PA&LAT|16-Oct-1991 09:00|
    |FOOT 2 VIEWS|10-May-1990 19:00|
    |FINGER(S) 2 OR MORE VIEWS|10-May-1990 08:14|
    |HAND 1 OR 2 VIEWS|10-May-1990 08:14|
    |ABDOMNE 1 VIEW|10-May-1990 07:58|
    |CHEST 2 VIEWS PA&LAT|10-May-1990 07:53|
    |TOE(S) 2 OR MORE VIEWS|26-Apr-1990 15:09|
  Then view radiology search results
    | path |
  	|gridview-1321-record-ext-record-57|
  	|gridview-1321-record-ext-record-58|
  	|gridview-1321-record-ext-record-59|
  	|gridview-1321-record-ext-record-60|
  	|gridview-1321-record-ext-record-61|
  	|gridview-1321-record-ext-record-62|
    |gridview-1321-record-ext-record-63|
    |gridview-1321-record-ext-record-64|
    |gridview-1321-record-ext-record-65|
    |gridview-1321-record-ext-record-66|




@perf.labs @perf
Feature: F102 Return and display of labs medications

Background:
	Given user logged with valid credentials to HMP


@perf.labs_rest 
Scenario: Client can request Labs
	Given a patient in multiple VistAs
	When the client requests Labs for the patient "B362;71"
  Then capture response time for "Patient-Labs REST call"
	Then eHMP returns "17" in the results
	And the results contain data group for lab
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
      	

@perf.labs_display
Scenario: User can view requested labs in the eHMP UI
	Given a patient in multiple VistAs
  When user searches "labs" for the patient "Zzzretiredfortyeight,Patient"
  And user selected "Search" from tasks option bar
 	And user looked and selected "laboratory"
  Then the results for "Laboratory" displayed in "Lab Results Table"
	| name                       | date                                         | value |
    	| Laboratory                 |                                              | 11    |
    	| UREA NITROGEN (BLOOD) canc | 25-Sep-1998 12:42 - Laboratory - CAMP MASTER |       |
    	| GLUCOSE (BLOOD) 121 MG/DL  | 16-Dec-1997 07:54 - Laboratory - CAMP MASTER | 7     |
  Then view lab search results
    | path |
	|gridview-1321-record-ext-record-62|
	|gridview-1321-record-ext-record-63|
	|gridview-1321-record-ext-record-64|
	|gridview-1321-record-ext-record-65|
	|gridview-1321-record-ext-record-66|
	|gridview-1321-record-ext-record-67|


@labs @future
Feature: F102 Return and display of labs
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "9E7A;71" has been synced through FHIR

@labs_rest 
Scenario: Client can request Labs
	Given a patient with "labs" in multiple VistAs
	When the client requests Labs for the patient "9E7A;71"
	Then eHMP returns "17" result(s)
	And the results contain data group
		| field    | value                                  |
     	| summary  | GLUCOSE (BLOOD) 121 MG/DL              |
      	| uid      | urn:va:lab:9E7A:71:CH;7028782.924588;2 |
      	| result   | 121		                             |
      	| specimen | BLOOD                                  |
      	| high     | 128                                    |
      	| low      | 84                                     |
      	
    And the results contain data group
		| field    | value                                  |
      	| summary  | CHLORIDE (BLOOD) canc                  |
      	| uid      | urn:va:lab:9E7A:71:CH;7028783.855185;7 |
      	| result   | canc                                   |
      	| specimen | BLOOD                                  |
      	
      	

@labs_display @UI
Scenario: User can view requested labs in the eHMP UI
	Given user logged with valid credentials to HMP
	And a patient with "labs" in multiple VistAs
    When user requests "labs" for the patient "Zzzretiredfortyeight,Patient"
	And user selected "Search" from tasks optien
   	And user looked and selected "laboratory"
    Then the results for "Laboratory" are displayed in the "Lab Results Table"
		| name                       | date                                         | value |
      	| Laboratory                 |                                              | 11    |
      	| UREA NITROGEN (BLOOD) canc | 25-Sep-1998 12:42 - Laboratory - CAMP MASTER |       |
      	| GLUCOSE (BLOOD) 121 MG/DL  | 16-Dec-1997 07:54 - Laboratory - CAMP MASTER | 7     |

		

      	
      
@encs @future
Feature: F102 Return and display of encounters
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "9E7A;71" has been synced through FHIR

@encs_rest 
Scenario: Client can request encounters
	Given a patient with "encounters" in multiple VistAs
	When the client requests encounters for the patient "9E7A;71"
	Then eHMP returns "8" result(s)
	And the results contain data group
		| field             | value                     |
      	| stopCodeName | AUDIOLOGY                 |
      	| uid          | urn:va:visit:9E7A:71:1995 |
      	| kind         | Visit                     |
      	| dateTime     | 20000404164610            |
      	
    And the results contain data group
		| field             | value                                      |
      	| stopCodeName | GENERAL INTERNAL MEDICINE                  |
      	| uid          | urn:va:appointment:9E7A:71:A;2940218.09;23 |
      	| kind         | Visit                                      |
      	| dateTime     | 199402180900                               |
      	| service      | MEDICINE                                   |

      	
      	

@encs_display @UI
Scenario: User can view requested encounters in the eHMP UI
	Given user logged with valid credentials to HMP
	And a patient with "encounters" in multiple VistAs
    When user requests "encounters" for the patient "Zzzretiredfortyeight,Patient"
	And user selected "Search" from tasks optien
   	And user looked and selected "visit"
	Then the results for "Visit" are displayed in the "Visit Results Table"
		| name             | date                                    | value |
      	| Visit            |                                         | 6     |
      	| COMP AND PEN     | 19-Nov-1997 09:23 - Visit - FT. LOGAN   |       |
      	| GENERAL MEDICINE | 18-Feb-1994 09:00 - Visit - CAMP MASTER |       |
		

      	
      
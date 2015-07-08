@docs @future
Feature: F102 Return and display of documents
# This feature file has UI test and the background UI rest request.  Since we don't want either to run in the jenkins pipeline
# I have marked the Feature as @future so the background step will also not be run

Background:
	Given a patient with pid "9E7A;71" has been synced through FHIR
	
@docs_rest @future
Scenario: Client can request document
	Given a patient with "documents" in multiple VistAs
	When the client requests documents for the patient "9E7A;71"
	Then eHMP returns "3" result(s)
	And the results contain data group
		| field         | value                              |
		| uid      | urn:va:document:9E7A:71:CY;7059298 |
      	| summary  | LR CYTOPATHOLOGY REPORT            |
      	| dateTime | 19940701                           |
      	
    And the results contain data group
		| field         | value                       |
		| uid      | urn:va:document:9E7A:71:494 |
      	| summary  | MONDAY USER                 |
      	| dateTime | 19971215153425              |
      	
      	
      	

@docs_display @UI
Scenario: User can view requested documents in the eHMP UI
	Given user logged with valid credentials to HMP
	And a patient with "documents" in multiple VistAs
    When user requests "document" for the patient "Zzzretiredfortyeight,Patient"
	And user selected "Search" from tasks optien
   	And user looked and selected "document"
    Then the results for "Progress Note" are displayed in the "Progress Note Results Table"
		| name          | date                                            | value |
      	| Progress Note |                                                 | 2     |
      	| MONDAY USER   | 15-Dec-1997 15:34 - Progress Note - CAMP MASTER |       |
		| SHERI'S TITLE | 19-Nov-1997 09:23 - Progress Note - CAMP MASTER |       |
      	
      
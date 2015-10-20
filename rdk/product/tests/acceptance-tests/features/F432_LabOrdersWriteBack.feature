@laborders_writeback @debug
Feature: F432 - Enter and Store a Simple Lab Order--Outpatient

@US7771 @createorder
Scenario: Creating a lab order through RDK
 	Given a patient with pid "9E7A;100472" has been synced through the RDK API
  	When the client request a response in VPR format from RDK API with the parameters 	
  	Then a successful response is returned
  	And the VPR result contain
	    | field      | value          						        	     |
		| content    |CONTAINS 11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*  |
	    | kind       | Laboratory 									         |
	    | pid 	     | 9E7A;100472 										     |
	    | statusName | UNRELEASED										     |
	    
@updateorder
	Scenario: Updating an existing lab order through RDK
 	Given a patient with pid "9E7A;100472" has been synced through the RDK API
  	When the client updates order in VPR format from RDK API with the parameters
  	Then a successful response is returned
  	And the VPR result contain
	    | field      | value          						        	     |
		| content    |CONTAINS 11-DEOXYCORTISOL BLOOD   SERUM ASAP SP *UNSIGNED*  |
	    | kind       | Laboratory 									         |
	    | pid 	     | 9E7A;100472 										     |
	    | statusName | UNRELEASED										     |
  	
@discontinueorder
	Scenario: Discontinuing an existing/unsigned lab order through RDK
 	Given a patient with pid "9E7A;100472" has been synced through the RDK API
  	When the client discontinues order in VPR format from RDK API with the parameters
  	Then a successful response is returned
    And the client clears patient with pid "9E7A;100472" info from vxsync
    Then the client syncs the patient with pid "9E7A;100472" in vxsync
    
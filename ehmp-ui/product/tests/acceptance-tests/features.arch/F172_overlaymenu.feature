#Team Neptune
@US3731 @US3768
Feature:F172 User-Defined Screens
	
Background:
	Given user is logged into eHMP-UI 

Scenario: Users will be able to click overlay button
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES      		 	|
   
    When the user clicks the "Allergies Overlay Button"
 
@US3768a	
Scenario: Users will be able to click overlay button and go to expanded view
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES      		 	|
   
    When the user clicks the "Allergies Overlay Button"
    Then the Allergies Overlay Page contains headers
       |Gist View | Summary View   | Expand View     |
       
    When the user clicks the "Allergies Expand View"
    
    Then user sees Allergies table display
	|Allergen Name| Standardized Allergen | Reaction                | Severity  |Drug Class                                   | Entered By |Facility | | 
	|PENICILLIN	  |	                      |ITCHING,WATERING EYES    |	        |PENICILLINS AND BETA-LACTAM ANTIMICROBIALS	  |VEHU,EIGHT  |CAMP MASTER     | |	

@US3768b
Scenario: Users will be able to click overlay button and go into gist view
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Bcma,Eight    	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES      		 	|
   
    When the user clicks the "Allergies Overlay Button"
    Then the Allergies Overlay Page contains headers
       |Gist View | Summary View   | Expand View     |
       
    And the user clicks the "Allergies Gist View"    
    Then Overview is active
	And the applets are displayed on the overview
		| applet 				|
		| CLINICAL REMINDERS 	|
		| ENCOUNTERS			|
		| DOCUMENTS 			|
		| ACTIVE PROBLEMS		|
		| ALLERGIES				|
		| VITALS				|
		| IMMUNIZATION			|
		| LAB RESULTS			|
		| MEDICATIONS			|

#@Team Neptune
@US2169 @DE389 @DE549 @regression
Feature:F144-eHMP Viewer GUI-Allergies Applet
 @debug @DE1478
Scenario: Users will be able to navigate coversheet, expanded and modal view
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES     		 	|

    Then the user clicks the "Allergies Expand Button"
    #Then the user clicks the "Coversheet Modal Close Button"
    Then user sees Allergies table display
	|Allergen Name| Standardized Allergen | Reaction                | Severity  |Drug Class                                   | Entered By |Facility | |
	|PENICILLIN	  |	                      |ITCHING,WATERING EYES    |	        |PENICILLINS AND BETA-LACTAM ANTIMICROBIALS	  |VEHU,EIGHT  |CAMP MASTER     | |

    When the user clicks the "Iodine Containing Agents"
    And the modal's title is "Allergen - Iodine Containing Agents"
    Then user sees Allergies Modal table display
     | header 1         | header 2    |
     | Drug Classes:    | |
     |Observed/Historical:|Observed|
     |Site:| DOD|

    When the user clicks the "Modal Close Button"
    Then the modal closes

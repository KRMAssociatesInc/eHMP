@US2801 @debug @DE621
Feature: F144 - eHMP viewer GUI - Allergies
#Team Neptune


    
@US2801a 
Scenario: User uses the Allergy applet coversheet to open and close the modal view
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Bcma,Eight 			|
	When the "Allergy Coversheet" contain 5 items
    When the user clicks the "Erythromycin Allergy"
    Then the modal view contains the headers
     | Allergen - Erythromycin | 
    And the "Modal Body" contain 11 items
    And the modal body contains the rows
     | ANOREXIA; DIARRHEA; DROWSINESS; HIVES | <button type="button" class="btn btn-warning">Moderate</button> |
     | Drug Classes: | ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL |
     | Originated: |12/19/2013 - 16:12 |
     | Observed/Historical: |Observed |
     | Observed Date: | 12/19/2013 | 
     | Verified: | | 
     | Entered by: | LORD,BRIAN | 
    Then the user clicks the "Coversheet Modal Close Button"
    When the "Allergy Coversheet" contain 5 items
    Then the Allergies Coversheet contains
	 | ERYTHROMYCIN |
	 | ALCOHOL |
	 | STRAWBERRIES |
	 | PEANUTS        | 
	 | BACON | 

@US2801b 
Scenario: User uses the Allergy expanded view to open and close the modal view
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 			|
	When the user clicks the "Allergies Expand Button"
	And the "Expanded Allergy Rows" contain 8 items
	When the user clicks the "CHOCOLATE"
    And the "Modal Body" contain 11 items
    Then the user clicks the "Coversheet Modal Close Button"
    When the "Expanded Allergy Rows" contain 8 items
	Then the Allergies expanded headers are
		| Headers |
		| Allergen Name |
		| Standardized Allergen |
		| Reaction |
		| Severity | 
		| Drug Class |
		| Entered By |
		| Facility |
		| | 
	And the Allergies expanded contains the rows
	     | Allergen Name | Standardized Allergen | Reaction |Severity | Drug Class | Entered By | Facility | |
		 | CHOCOLATE | Chocolate | DIARRHEA | | | PROVIDER,ONE | CAMP MASTER | <span class="fa fa-transparent-comment"></span> | 

@US2801c
Scenario: User uses the Allergy expanded view to filter and sort
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 			|
	When the user clicks the "Allergies Expand Button"
	And the "Expanded Allergy Rows" contain 8 items
	And the Allergies expanded headers are
		| Headers |
		| Allergen Name |
		| Standardized Allergen |
		| Reaction |
		| Severity | 
		| Drug Class |
		| Entered By |
		| Facility |
		| | 
	Then the first row of the expanded Allergies applet is
    	| Allergen Name | Standardized Allergen | Reaction |Severity | Drug Class | Entered By | Facility | |
		| CHOCOLATE | Chocolate | DIARRHEA | | | PROVIDER,ONE | CAMP MASTER | <span class="fa fa-transparent-comment"></span> |
	When the user clicks the "Standardized Allergen"
	And the user clicks the "Standardized Allergen"
    Then the first row of the expanded Allergies applet is
    	| Allergen Name | Standardized Allergen | Reaction |Severity | Drug Class | Entered By | Facility | |
		| MILK | Skim milk |NAUSEA,VOMITING | | |PROGRAMMER,TWENTY | New Jersey HCS | <span class="fa fa-comment"></span>|
    When the user clicks the "Allergies Filter Button"
    And the user enters "Pen" into the "Allergies Filter Field"
    And the "Expanded Allergy Rows" contain 3 items
    Then the first row of the expanded Allergies applet is
    	| Allergen Name | Standardized Allergen | Reaction |Severity | Drug Class | Entered By | Facility | |
		| Penicillins | Penicillin | | | | | DOD | <span class="fa fa-comment"></span>|

@US2801d @allergy_modal_vista
Scenario: User uses the Allergy applet coversheet to open modal and view VistA data
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "Allergy Coversheet" contain 8 items
	When the user selects the 1 "CHOCOLATE" allergy pill
	Then the modal view contains the headers
	 | header 				 |
     | Allergen - CHOCOLATE | 
    And the modal displays allergy information
     | Field 		          | Value 		       |
     | Drug Classes 		  |                    |
     | Originated Date        | 12/17/2007 - 15:12 |
     | Observed or Historical | Historical         |
     | Observed Date          |					   |
     | Verifier Name          | <auto-verified>    |
     | Originator Name        | PROVIDER,ONE       |
     | Facility Name          | CAMP MASTER 	   |
    When the user clicks the modal "Close Button"
    Then the modal is closed
    When the user selects the 2 "CHOCOLATE" allergy pill
	Then the modal view contains the headers
	 | header 				 |
     | Allergen - CHOCOLATE | 
    And the modal displays allergy information
     | Field 		   | Value 		|
     | Facility Name   | CAMP BEE 	|
     | Originated Date | 12/17/2007 - 15:12 |
    When the user clicks the modal "Close Button"
    Then the modal is closed




@US2801e @allergy_modal_dod
Scenario: User uses the Allergy applet coversheet to open modal and view DoD data
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "Allergy Coversheet" contain 8 items
	When the user selects the 1 "Tetracyclines" allergy pill
	Then the modal view contains the headers
	 | header 				 |
     | Allergen - Tetracyclines | 
    And the modal displays allergy information
     | Field 		          | Value 			   |
     | Drug Classes 		  |                    |
     | Originated Date        |                    |
     | Observed or Historical | Observed           |
     | Observed Date          |					   |
     | Verifier Name          |                    |
     | Originator Name        |                    |
     | Facility Name          | DOD         	   |
    When the user clicks the modal "Close Button"
    Then the modal is closed

@US2801f @allergy_modal_external
Scenario: User uses the Allergy applet coversheet to open modal and view External data
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "Allergy Coversheet" contain 8 items
	When the user selects the 1 "MILK" allergy pill
	Then the modal view contains the headers
	 | header 				 |
     | Allergen - MILK       | 
    And the modal displays allergy information
      | Field                  | Value              |
      | Drug Classes           |                    |
      | Originated Date        | 01/19/1994 - 08:01 |
      | Observed or Historical | Historical         |
      | Observed Date          |                    |
      | Verifier Name          | PROGRAMMER,TWENTY  |
      | Originator Name        | PROGRAMMER,TWENTY  |
      | Facility Name          | New Jersey HCS     |
    When the user clicks the modal "Close Button"
    Then the modal is closed

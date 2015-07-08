@F144_allergy_applet @US2801 @DE621 @regression
Feature: F144 - eHMP viewer GUI - Allergies
#Team Jupiter - refactored

@US2801 @F144_1_allergy_applet_display @base
Scenario: User views the Allergy applet on the coversheet page
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Bcma,Eight 			|
	And user sees the allergy applet on the coversheet page
	And the Allergies Applet view contains
  	| Allergy name		|
	| ERYTHROMYCIN		|
	| ALCOHOL			|
	| PEANUTS			|
	| BACON				|
	| STRAWBERRIES		|

@US2801 @F144_2_allergy_applet_modal_display @modal_test
Scenario: User views the modal when a particular allergy pill is chosen
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Bcma,Eight 			|
	And user sees the allergy applet on the coversheet page
	When the user clicks on the allergy pill "ERYTHROMYCIN"
	Then the modal is displayed
  	And the modal's title is "Allergen - ERYTHROMYCIN"
  	And the user clicks the modal "Close Button"
  	And the modal is closed

@US2801 @F144_3_allergy_applet_modal_detail_display @modal_test @DE549
Scenario: User views the modal details when a particular allergy pill is chosen
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	And user sees the allergy applet on the coversheet page
	When the user clicks on the allergy pill "ERYTHROMYCIN"
	Then the modal is displayed
  	And the modal's title is "Allergen - ERYTHROMYCIN"
  	And the allergy applet modal detail contains
  	| field					| value									|
  	| Symptoms				| ANOREXIA; DIARRHEA; DROWSINESS; HIVES	|
  	| Entered By			| DOCWITH,POWER							|
  	| Nature of Reaction	| Adverse Reaction						|
  	| Drug Classes			|ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL|
  	| Originated			| 12/19/2013 - 16:18					|
  	| Observed/Historical	| Observed								|
  	| Observed Date			| 12/19/2013 - 00:00					|
  	| Verified				|										|
	| Obs dates/severity	| MODERATE								|
	| Site  				| CAMP MASTER							|
	And the user clicks the modal "Close Button"
  	And the modal is closed

@US2801 @F144_4_allergy_applet_expand_view @vimm_observed
Scenario: View Allergies Applet Single Page by clicking on Expand View
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Bcma,Eight 			|
	And user sees the allergy applet on the coversheet page
	When the user clicks the control "Expand View" in the "Allergies Applet"
  	Then the Allergies Applet title is "ALLERGIES"
  	And the "Allergy Applet" table contains headers
    | Allergen Name | Standardized Allergen | Reaction | Severity | Drug Class | Entered By | Facility | |
  	#And the "Allergy Applet" table contains 5 rows
  	And the "Allergy Applet" table contains rows
   	| Allergen Name | Standardized Allergen | Reaction 								| Severity | Drug Class 																										| Entered By | Facility 	| 	|
    | ERYTHROMYCIN	| Erythromycin			| ANOREXIA; DIARRHEA; DROWSINESS; HIVES	| Moderate | ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL	| DOCWITH,POWER | CAMP MASTER	|	|
    | ERYTHROMYCIN	| Erythromycin			| ANOREXIA; DIARRHEA; DROWSINESS; HIVES	| Moderate | ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL	| DOCWITH,POWER | CAMP BEE	|	|
    
    | PENICILLIN    |                       | ANOREXIA; DRY MOUTH                   | Moderate | (INACTIVE) PENICILLINS   | DOCWITH,POWER | CAMP BEE | |
    | ALCOHOL		| 						| PAIN IN EYE							|  | 	| DOCWITH,POWER 		| CAMP MASTER	|	|
    | ALCOHOL		| 						| PAIN IN EYE							|  | 	| DOCWITH,POWER 		| CAMP BEE	|	|
    | PEANUTS		| PEANUT preparation 	| HIVES									|  | 	| DOCWITH,POWER 		| CAMP MASTER	|	|
   
    | PEANUTS		| PEANUT preparation 	| HIVES									|  | 	| DOCWITH,POWER 		| CAMP BEE	|	|
    | CELERY		| Celery (Dietary)		| DRY NOSE								|  |    | DOCWITH,POWER			| CAMP BEE  |   |
    | BACON			| Bacon				 	| 										|  | 	| DOCWITH,POWER		| CAMP MASTER	|	|
    | BACON			| Bacon				 	| 										|  | 	| DOCWITH,POWER		| CAMP BEE	|	|
    | STRAWBERRIES	| Strawberries			| ITCHING,WATERING EYES					|  | 	| RADTECH,SEVENTEEN | CAMP MASTER	|	|

@US2801 @F144_5_allergy_applet_filter @vimm
Scenario: Filter Allergies Applet
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Bcma,Eight 			|
	And user sees the allergy applet on the coversheet page
	When the user clicks the control "Expand View" in the "Allergies Applet"
  	When the user clicks the control "Filter Toggle" in the "Allergies Applet"
  	And the user inputs "ERYTHROMYCIN" in the "Text Filter" control in the "Allergies Applet"
   	#And the "Allergy Applet" table contains 1 rows
  	And the "Allergy Applet" table contains rows
    | Allergen Name | Standardized Allergen | Reaction 								| Severity | Drug Class 																										| Entered By | Facility 	| 	|
    | ERYTHROMYCIN	| Erythromycin			| ANOREXIA; DIARRHEA; DROWSINESS; HIVES	| Moderate | ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL	| DOCWITH,POWER | CAMP MASTER	|	|

@US2801 @F144_6_allergy_applet_sort
Scenario: Sort allergies applet by standardized name
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Bcma,Eight 			|
	And user sees the allergy applet on the coversheet page
	When the user clicks the control "Expand View" in the "Allergies Applet"
  	Then the Allergies Applet title is "ALLERGIES"
  	And Allergy Applet table first row is
  	|row index	| Allergen Name | Standardized Allergen | Reaction 								| Severity | Drug Class 																										| Entered By | Facility 	| 	|
    | 1			| ERYTHROMYCIN	| Erythromycin			| ANOREXIA; DIARRHEA; DROWSINESS; HIVES	| Moderate | ERYTHROMYCINS/MACROLIDES, PHARMACEUTICAL AIDS/REAGENTS, ANTIBACTERIALS,TOPICAL OPHTHALMIC, ANTIACNE AGENTS,TOPICAL	| DOCWITH,POWER| CAMP MASTER	|	|
    When user sorts by the Standardized Allergen
    Then the Allergies Applet is sorted in alphabetic order based on Standardized Allergen

@US2801 @F144_7_allergy_applet_DoD_site @DE549
Scenario: Allergy applet displays data from multiple site.  User can view DoD data details
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And user sees the allergy applet on the coversheet page
	And the Allergies Applet view contains
  	| Allergy name				|
	| Penicillins				|
	| Tetracyclines				|
	| Iodine Containing Agents	|
	When the user clicks on the allergy pill "Tetracyclines"
	Then the modal is displayed
  	And the modal's title is "Allergen - Tetracyclines"
  	And the allergy applet modal detail contains
  	| field					| value					|
  	| Symptoms				| 						|
  	| Entered By			| 						|
  	| Nature of Reaction	| Adverse Reaction		|
  	| Drug Classes			|						|
  	| Originated			| 						|
  	| Observed/Historical	| Observed				|
  	| Observed Date			| 						|
  	| Verified				|						|
	#| Obs dates/severity	|						|
	| Site  				| DOD					|
	| Comments 				| Rash					|
	And the user clicks the modal "Close Button"
  	And the modal is closed

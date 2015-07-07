@F281_immunization_gist @DE618 @regression
Feature: F281 : Intervention Gist View
	
#POC: Team Jupiter

@F281_1_immunizationGistDisplay @US3382 @base  @DE861
Scenario: User views the immunization gist view
	Given user is logged into eHMP-UI
	And user searches for and selects "FORTYSIX,PATIENT"	
  	Then Overview is active
  	And user sees Immunizations Gist
	And the immunization gist view has the following information
	| vaccine name			| age 	| 
	| HEP B, ADULT      | 16y | 
  | INFLUENZA         | 17y |     
  | DTP               | 17y |
  | PNEUMOCOCCAL, UNSPECIFIED FORMULATION | 21y |
  | PNEUMOCOCCAL      | 15y |
	
@F281_2_immunizationGistDisplay @US3382
Scenario: User views the immunization gist modal pop-up
	Given user is logged into eHMP-UI
	And user searches for and selects "FORTYSIX,PATIENT"	
    Then Overview is active
  	And user sees Immunizations Gist
	When user clicks on "PNEUMOCOCCAL" pill
    Then the modal is displayed
    And the modal's title is "Vaccine - PNEUMOCOCCAL"

@F281_3_immunizationGistDisplay @US3382
Scenario: View Immunization Applet Single Page by clicking on Expand View
  Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  Then Overview is active
  And user sees Immunizations Gist
  When the user clicks the control "Expand View" in the "Immunization Gist applet"
  Then the immunization gist applet title is "IMMUNIZATIONS"
  And the "Immunization Gist Applet" table contains headers
    | Vaccine Name | Standardized Name | Reaction | Series | Repeat Contraindicated | Date | Facility | |
  And the "Immunization Gist Applet" table contains rows
    | Vaccine Name                          | Standardized Name 								 | Reaction | Series   | Repeat Contraindicated | Date 		| Facility |
    | PNEUMOCOCCAL                          | pneumococcal polysaccharide vaccine, 23 valent	| 		   |          | No				       | 04/04/2000	| NJS	   |
    | HEP B, ADULT                          |                                                   | NONE     | COMPLETE | No                     | 10/15/1998 | TST1     |
    | HEP B, ADULT                          |                                                   | NONE     | COMPLETE | No                     | 10/15/1998 | TST2     |
    | INFLUENZA (HISTORICAL)                | influenza virus vaccine, unspecified formulation  |          |          | No                     | 10/01/1997 | TST1     |
    | INFLUENZA (HISTORICAL)                | influenza virus vaccine, unspecified formulation  |          |          | No                     | 10/01/1997 | TST2     |  
    | DTP                                   | diphtheria, tetanus toxoids and pertussis vaccine | NONE     | COMPLETE | No                     | 06/21/1997 | TST1     | 
    | DTP                                   | diphtheria, tetanus toxoids and pertussis vaccine | NONE     | COMPLETE | No                     | 06/21/1997 | TST2     | 
    | PNEUMOCOCCAL, UNSPECIFIED FORMULATION | pneumococcal polysaccharide vaccine, 23 valent    | NONE     | COMPLETE | No                     | 01/31/1994 | TST1     |
    | PNEUMOCOCCAL, UNSPECIFIED FORMULATION | pneumococcal polysaccharide vaccine, 23 valent    | NONE     | COMPLETE | No                     | 01/31/1994 | TST2     |


@F281_4_immunizationGist_filter_capability @US3669 @future
Scenario: Immunization Applet Gist - filter immunization
  Given user is logged into eHMP-UI
  Given user searches for and selects "FORTYSIX,PATIENT"
  Then Overview is active
  And user sees Immunizations Gist
  And the immunization gist view has the following information
	| vaccine name			| age 	| 
	| PNEUMOCOCCAL			| 15y	|
	| HEP B, ADULT			| 16y	| 
	| INFLUENZA				| 17y	|			
	| DTP	                | 17y	|
  When the user clicks the control "Filter Toggle" in the "Immunization Gist applet"
  And the user inputs "PNE" in the "Text Filter" control in the "Immunization Gist applet"
  Then the immunizaiton gist view is filtered to 1 item
  And the immunization gist view has the following information
	| vaccine name			| age 	| 
	| PNEUMOCOCCAL			| 15y	|
	
@F281_5_immunizationGistDisplay @US3382 @DE861 @triage
Scenario: User views the immunization gist pill detail view
	Given user is logged into eHMP-UI
	And user searches for and selects "FORTYSIX,PATIENT"	
	Then Overview is active
    And user sees Immunizations Gist
	When user hover over "PNEMOCOCCAL" pill
	And the "Immunization Gist Hover Table" table contains headers
    | Date | Series | Reaction | Since	|
	And the "Immunization Gist Hover Table" table contains rows
	| Date			| Series	| Reaction	| Since	|
	| 04/04/2000	|			| No		| 15y	|
	#| 01/31/1994	| COMPLETE	| No		| 21y	|
	#| 01/31/1994	| COMPLETE	| No		| 21y	|			
  

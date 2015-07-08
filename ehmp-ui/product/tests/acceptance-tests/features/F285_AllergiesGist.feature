@F285_allergies_gist @regression

Feature: F285 : Overview Screen

@F285_1_AllergiesGistDisplay @US4005 @base @vimm_observed
Scenario: View Allergies Gist View on the overview screen
  Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  Then Overview is active
  And user sees Allergies Gist
  And the Allergies Gist view contains 
  	| Allergy name		|
	| CHOCOLATE			|
	| PENICILLIN		|
	| MILK				|
  
@F285_2_AllergiesGistExpandView @US4005 
Scenario: View Allergies Applet Single Page by clicking on Expand View
  Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  #And Cover Sheet is active
  #When user selects Overview from Coversheet dropdown
  Then Overview is active
  And user sees Allergies Gist
  When the user clicks the control "Expand View" in the "Allergies Applet"
  Then the Allergies Applet title is "ALLERGIES"
  
@F285_3_AllergiesGistFilter @US4005 @vimm_observed
Scenario: View Allergies Applet Single Page by clicking on Expand View
  Given user is logged into eHMP-UI
  And user searches for and selects "FORTYSIX,PATIENT"
  #And Cover Sheet is active
  #When user selects Overview from Coversheet dropdown
  Then Overview is active
  And user sees Allergies Gist
  When the user clicks the control "Filter Toggle" in the "Allergies Applet"
  And the user inputs "MILK" in the "Text Filter" control in the "Allergies Applet"
  And Allegies Gist Applet contains only "MILK"
 
     
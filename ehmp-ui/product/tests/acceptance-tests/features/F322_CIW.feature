@F322_CIW @debug
Feature: F322 - Concept Invoked Workspaces

# Team: Jupiter

Background:
    Given user views the login screen
    When user attempts login
        | field      | value       	|
        | Facility   | PANORAMA    	|
        | AccessCode | 1tdnurse   	|
        | VerifyCode | tdnurse1 	|
        | SignIn     |          	|
    Then the patient search screen is displayed  
  	And user searches for and selects "ZZZRETFOURFIFTYEIGHT,PATIENT"
  	
@F322-1.1 @F322-1.3 @F322-1.4 @F322-1.5 @F322-1.6 @F322-1.7 @F322-1.8 @F322-1.9 @F322-1.10 @F322-1.12 @F322-1.13 @F322-1.15
@F322-2.1 @F322-2.3
@F322_Associate_snomed_code_with_udf @US4631 @US6145 @debug
Scenario: Search and associate snomed-code to user defined workspace and delete code.

  Given user navigates to User Defined Workspace manager
  And user creates New User defined workspace "User Defined Workspace 1"

  When user clicks on association button on "User Defined Workspace 1"
  Then user sees the search problems text field
  When user enters "Manic" in the search problems text field
  Then a suggestion list is displayed to the user
  And user chooses "Manic bipolar I disorder" from the suggestion list
  And the selected problem "Manic bipolar I disorder" is added to associated problems list
  And user chooses "Recurrent manic episodes" from the suggestion list
  And the selected problem "Recurrent manic episodes" is added to associated problems list
  And the problem "Recurrent manic episodes" from the suggestion list is disabled
  And user chooses "Recurrent manic episodes" from the suggestion list
  And the problem "Recurrent manic episodes" from the suggestion list is enabled again
  
  When user enters "Essen" in the search problems text field
  Then a suggestion list is displayed to the user
  And user chooses "Essential hypertension" from the suggestion list
  And the selected problem "Essential hypertension" is added to associated problems list
  
  When user enters "Manic" in the search problems text field
  Then a suggestion list is displayed to the user
  And the problem "Manic bipolar I disorder" from the suggestion list is disabled
  
  When user enters "Agilex" in the search problems text field
  Then a suggestion list says "No Results" on "User Defined Workspace 1"
  
  And user creates New User defined workspace "User Defined Workspace 2"
  When user clicks on association button on "User Defined Workspace 2"
  Then user sees the search problems text field
  When user enters "Essen" in the search problems text field
  Then a suggestion list is displayed to the user
  And user chooses "Essential hypertension" from the suggestion list
  And the selected problem "Essential hypertension" is added to associated problems list
  
  When user clicks on association button on "User Defined Workspace 1"
  And user deletes the problem "Manic bipolar I disorder" from the associated problems list
  
  Then user sees the option to delete the workspace "User Defined Workspace 1"
  When user chooses delete from workspace "User Defined Workspace 1"
  Then user should confirm "User Defined Workspace 1" can be deleted
  And the workspace "User Defined Workspace 1" is deleted
  
  Then user sees the option to delete the workspace "User Defined Workspace 2"
  When user chooses delete from workspace "User Defined Workspace 2"
  Then user should confirm "User Defined Workspace 2" can be deleted
  And the workspace "User Defined Workspace 2" is deleted
  
  And user closes the user defined work space manager
	
# this works only in chrome	
@F322-3.1 @F322-3.2 @F322-3.6 @F322-3.7
@F322_Associate_conditions_with_CIW @US4631 @debug
Scenario: Search and associate snomed-code to user defined workspace and access CIW from conditions applet.

  Given user navigates to User Defined Workspace manager
  And user creates New User defined workspace "User Defined Workspace 1"

  When user clicks on association button on "User Defined Workspace 1"
  Then user sees the search problems text field
  When user enters "Essen" in the search problems text field
  Then a suggestion list is displayed to the user
  And user chooses "Essential hypertension" from the suggestion list
  And the selected problem "Essential hypertension" is added to associated problems list
  
  And user creates New User defined workspace "User Defined Workspace 2"
  When user clicks on association button on "User Defined Workspace 2"
  Then user sees the search problems text field
  When user enters "Essen" in the search problems text field
  Then a suggestion list is displayed to the user
  And user chooses "Essential hypertension" from the suggestion list
  And the selected problem "Essential hypertension" is added to associated problems list
  
  And user closes the user defined work space manager

  When user navigates back to overview screen
  And user sees Conditions Gist
  And the user has selected All within the global date picker
  When user clicks on the left hand side of the item "Essential Hypertension" 
  Then user selects the "Essential Hypertension" CIW icon in Conditions Gist
  Then user is presented with two associated workspace "User Defined Workspace 1" and "User Defined Workspace 2"
  When user chooses the associated workspace "User Defined Workspace 1"
  Then user is navigated to the custom workspace "User Defined Workspace 1"
  
  When user navigates back to overview screen
  Given user navigates to User Defined Workspace manager
  
  Then user sees the option to delete the workspace "User Defined Workspace 1"
  When user chooses delete from workspace "User Defined Workspace 1"
  Then user should confirm "User Defined Workspace 1" can be deleted
  And the workspace "User Defined Workspace 1" is deleted
  
  Then user sees the option to delete the workspace "User Defined Workspace 2"
  When user chooses delete from workspace "User Defined Workspace 2"
  Then user should confirm "User Defined Workspace 2" can be deleted
  And the workspace "User Defined Workspace 2" is deleted
  
  And user closes the user defined work space manager
  

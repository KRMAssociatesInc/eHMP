# Team Europa
@future
Feature: F277 - CDS Rules Results List
# This feature covers existance of Rules Results applet on Coversheet

Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    
@US3119_RulesResultsApplet @future
Scenario: Rules Results applet is dispayed on Cover sheet
    When Cover Sheet is active 
    Then the applets are displayed on the coversheet
			| applet 			|
			| RULES RESULTS  	| 
    
@US3119b @future 
Scenario: Rules Results applet displays appropriate columns
    And Cover Sheet is active
    And the applets are displayed on the coversheet
			| applet 			|
			| RULES RESULTS  	| 
    When the user clicks the "RulesResults Expand Button"
    Then the Rules Results expanded columns are
			| |
      | Priority | 
			| Title | 
			| Due Date |
			| Done Date |
	
        
@US3119c @future 
Scenario: User views Rules Results modal when clicks on a rule
    And Cover Sheet is active
    And the applets are displayed on the coversheet
		| applet 			|
		| RULES RESULTS  	| 
    And applet contains columns
        | Priority | Title | Due Date |
    And the user clicks Expand button
    When user clicks on a Rule
    Then the modal view has hearders 
        | |
    And the modal body has rows 
        | Detail: |
        | Due Date: |
        | Done Date: |        
    

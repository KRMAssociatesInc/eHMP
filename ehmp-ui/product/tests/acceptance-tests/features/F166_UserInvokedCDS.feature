# Team Europa
@future
Feature: F166 - User invoked clinical decision support (CDS)
# This feature covers existence of CDS Advice applet on Coversheet

Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    
@US3822_CDSAdviceApplet @future
Scenario: CDS Advice applet is displayed on Cover sheet
    When Cover Sheet is active 
    Then the applets are displayed on the coversheet
				| applet 				|
				| CDS ADVICE  	| 
    
@US3822b @future @US3816 @US3817
Scenario: CDS Advice applet displays appropriate columns
    And Cover Sheet is active
    And the applets are displayed on the coversheet
				| applet	 			|
				| CDS ADVICE  	| 
    When the user clicks the "CDS Advice Expand Button"
    Then the CDS Advice expanded columns are
				| |
      	| Priority 	| 
				| Title 		| 
				| Details 	|
				| Type			|	
        
@US3822c @future
Scenario: User views CDS Advice modal when clicks on a advice
    And Cover Sheet is active
    And the applets are displayed on the coversheet
				| applet 				|
				| CDS ADVICE  	| 
    And applet contains columns
        | Priority | Title | Due Date |
    And the user clicks Expand button
    When user clicks on an advice
    Then the modal view has headers 
        | |
    And the modal body has rows 
		    | Priority: 	|
        | Type: 			|
        | Detail: 		|
				| Provenance: 	|

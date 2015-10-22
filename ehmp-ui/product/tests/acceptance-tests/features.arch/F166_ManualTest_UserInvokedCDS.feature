# Team Europa
@manual @debug @future
Feature: F166 - User invoked clinical decision support (CDS)
# This feature covers existence of CDS Advice applet on Coversheet
# This test is being moved to archive.
# This test is OBE
Background:
    Given user is logged into eHMP-UI
    And user searches for and selects "Eight,Patient"
    And Cover Sheet is active
    
@US3822_CDSAdviceApplet @manual @debug
Scenario: CDS Advice applet is displayed on Overview
    When user selects Overview from Coversheet dropdown
    Then Overview is active 
    And the applets are displayed on the overview
				| applet 				|
				| CDS ADVICE  	| 
    
@US3822b @manual @US3816 @US3817 @debug
Scenario: CDS Advice applet displays appropriate columns
    And user selects Overview from Coversheet dropdown
    And Overview is active
    And the applets are displayed on the overview
				| applet	 			|
				| CDS ADVICE  	| 
    When the user clicks the "Cds Advice Expand Button"
    Then the CDS Advice expanded columns are
				|           |
      	| Priority 	| 
				| Title 		| 
				| Type 	    |
				| Due Date	|
        | Done Date |
        
@US3121 @US3920 @US3086 @US3085 @manual @debug
Scenario: CDS advice and clinical reminders are displayed on applet in Expanded view
    And user selects Overview from Coversheet dropdown
    And Overview is active
    And the applets are displayed on the overview
				| applet	 			|
				| CDS ADVICE  	| 
    When the user clicks the "Cds Advice Grid Options"
    And the user clicks the "Cds Advice Expanded View"
    And the CDS Advice expanded columns are
				|           |
      	| Priority 	| 
				| Title 		| 
				| Type 	    |
				| Due Date	|
        | Done Date |
    Then advices and reminders are displayed in applet 
        
@US3122_Advice @manual @debug
Scenario: User views CDS Advice modal when clicks on an advice
    And user selects Overview from Coversheet dropdown
    And Overview is active
    And the applets are displayed on the coversheet
				| applet 				|
				| CDS ADVICE  	| 
    When user clicks on an advice
    Then the modal view has headers 
        | Advice |
    And the modal body has rows 
        | Provenance: |
		    | Priority: 	|
        
@US3122_Reminder @manual @debug
Scenario: User views CDS Advice modal when clicks on a reminder
    And user selects Overview from Coversheet dropdown
    And Overview is active
    And the applets are displayed on the coversheet
				| applet 				|
				| CDS ADVICE  	| 
    When user clicks on a reminder
    Then the modal view has headers 
        | Reminder |
    And the modal body has rows 
        | Due Date: |
        | Done Date: |
		    | Detail: 	|

@US3123_dropdown @manual @debug
Scenario: User views clinical settings dropdown on the applet
    And user selects Overview from Coversheet dropdown
    When Overview is active 
    Then Clinical Settings dropdown is shown on the applet with Family Medicine and Occupational Medicine options
    
@US3123_FamilyMedicineRule @manual @debug
Scenario: User selects Family Medicine option from clinical settings
    And user selects Overview from Coversheet dropdown
    And Overview is active 
    And Clinical Settings dropdown is shown in the applet 
    When user selects Family Medicine from the list
    Then an advice and clinical reminders display on the applet

@US3123_OccupationalMedicineRule @manual @debug
Scenario: User selects Occupational Medicine option from clinical settings
    And user selects Overview from Coversheet dropdown
    And Overview is active 
    And Clinical Settings dropdown is shown on the applet 
    When user selects Occupational Medicine from the list
    Then the message on the applet is No Records Found

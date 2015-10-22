#Team Neptune
@US3950 @manual @future @US5085
Feature:F172 User-Defined Screens-Resizing Applets-part2
# This test is being moved to archive.
# Manual test is defined in functional test TC69
US3950a	
Scenario: Users will be able to resize the applets for trend view
    Given user is logged into eHMP-UI 
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES      		 	|
   
    And the user types -gridster on the UI
    Then the user sees moving applet for Allergies
    Then the user resizes the allergies applet
    And the user sees width dimensions for trend view for allergies are max: 34% and min 20%
    And the user sees height dimensions for trend view for allergies are max 34% and min 10%
    
@US3950b	
Scenario: Users will be able to resize the applets for summary view
    Given user is logged into eHMP-UI 
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ACTIVE PROBLEMS      		|
   
    And the user types -gridster on the UI
    Then the user sees moving applet for Active Problems
    Then the resizes the active problems applet
    And the user sees width dimensions for summary view for active problems are max: 50% and min 34%
    And the user sees height dimensions for summary view for active problems are max 34% and min 20%

@US3950c	
Scenario: Users will be able to resize the applets for expanded view
    Given user is logged into eHMP-UI 
	And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ACTIVE PROBLEMS      		|
   
    And the user types -gridster on the UI
    Then the user sees moving applet for Active Problems
    Then the resizes the active problems applet
    And the user sees width dimensions for expanded view for active problems are max: 66% and min 50%
    And the user sees height dimensions for expanded view for active problems are max 100% and min 50%

@US5085a
Scenario: Use the gridster view to move the applets in workspace editor view and then view trend view, summary view and expanded view and verify their size
  Given user is logged into eHMP-UI
  And user searches for and selects "EIGHT,Patient"
  Then the user clicks "Workspace Manager Button"
  And the user clicks "Add New Worksheet Button"
  And the user adds title and description and clicks "Add and Load Button"
  Then the user drags and drops each applet on the canvas/workspace from the carousel in screen editors page
  And the user selects each of trend view, summary view and expanded view applicable for each applet selected
  Then the user is able to verify the maximum and minimum size of each applet for each view in the workspace editor page as allocated to them 
  And the user sees width dimensions for trend view are max: 34% and min 20%
  And the user sees height dimensions for trend view are max 34% and min 10%
  And the user sees width dimensions for summary view are max: 50% and min 34%
  And the user sees height dimensions for summary view are max 34% and min 20%
  And the user sees width dimensions for expanded view are max: 66% and min 50%
  And the user sees height dimensions for expanded view are max 100% and min 50%
  
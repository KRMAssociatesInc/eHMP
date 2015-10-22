#Team Neptune
@US4136 @debug @future
Feature: F339 - User Defined Work Spaces 2 
# This test is being moved to archive.
# Manual test is defined in functional test TC87, TC322 and F339_ US4521_Verify the heading elements in the Workspace Manager
Background: 
    Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
		

@US4521 @manual @future
Scenario: User sees a list of items upon clicking the workspace manager button
	When the user clicks "Workspace Manager Button"
    Then the user navigates to the screen manager's view 
	And the user clicks "Plus Button"
	Then the page will add a new workspace below the predefined screen with names like User Defined Workspace1
    Then the user sees following list of items 
    |Heading elements| 
    |Title Workspace Manager|
    |Close Button|
    |Plus Button|
    |Filter Button| 
    |Table Title|
    |Description|
    |Author|
    |Snomed Code|
    |Preview|
    |Menu | 


		        	

 

	
@US4277 @manual @future
Scenario: User can rearrange workspaces inside the workspace manager page
    When the user clicks "Workspace Manager Button"
	And the user navigates to the screen manager's view 
	And the user clicks "Plus Button" to create another workspace
    And the user clicks "Customize"
	Then drag and drop the Allergies into the workspace
	And user clicks "Allergies Gist View" on the screen editor
	And user clicks "Done" on the screen editor
    Then the user will see rectangle that will surround only the applets available on the page the user is currently on and also the page and page size 
         	
@US5413 @US5263 @manual @future
Scenario: User can rearrange workspaces inside the workspace manager page
    When the user clicks "Workspace Manager Button"
	And the user navigates to the screen manager's view 
	Then the user clicks "Plus Button"
	And the user clicks "Plus Button" to create another workspace
    When the user clicks "Menu Button" for a workspace
    Then the user sees flyout options in this order
    |Make Default (US5245)|
    |Duplicate (5261)|
    |Rearrange (5263)|
    |Delete (5274)|
    |Launch (5275)|    
    And the user clicks the "Rearrange Link" to move the active workspace up or down

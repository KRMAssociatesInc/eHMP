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
		


@deletescreen @US4266 @F339-9
Scenario: Users will be able to delete the screen from list of saved user defined screens as well as delete individual applets from the saved screens
	When the user clicks "Workspace Manager Button"
    And the user clicks "Delete2"
    And the user clicks "Confirm Delete"
    And the user clicks "Delete3"
    And the user clicks "Confirm Delete"
    And the user clicks "Delete4"
    And the user clicks "Confirm Delete"
    And the user clicks "Delete5"
    And the user clicks "Confirm Delete"
		        	
@US5413a @US5245 @US5274 @US4521a @US6030a @filter @DE1071 @F339-1 @F339-2 @F339-6 @F339-9 @F339-16
Scenario: User will be able to add,make default,filter and delete a user defined screen upon clicking the workspace manager button and going inside the workspace page
	When the user clicks "Workspace Manager Button"
	And the user clicks "Plus Button"
	Then the user sees following list of screens
		|Menu|
		|Coversheet|
		|Timeline|
		|Meds Review|
		|Documents|
		|Overview|
		|User Defined Workspace 1|
	
	And the user clicks "Filter Button"	
	When the user enters "User Defined Workspace 1" on workspace page filter field 
	Then the user sees workspace manager page display screen with the title "User Defined Workspace 1"		
	And the user clicks "Make Default"
    And the user clicks "Delete"
    And the user clicks "Confirm Delete"
	Then the "User Defined Workspace 1" is not listed in the workspace manager page
 
@US5413b @clone @deleteactivescreen @US6030b @DE1071 @F339-7 @F339-9 @F339-10 @F339-12 @F339-13
Scenario: User will be able to add, delete active screen, launch,clone workspaces and make the screen default upon clicking the workspace manager button and going inside the workspace page
	When the user clicks "Workspace Manager Button"
	And the user clicks "Plus Button"
	Then the user sees following list of screens
		|Coversheet|
		|Timeline|
		|Meds Review|
		|Documents|
		|Overview|
		|User Defined Workspace 1| 
			
	And the user clicks "Customize"
	Then drag and drop the Allergies right by 40 and down by 400
	And user clicks "Allergies Gist View" on the screen editor
	And drag and drop the Allergies preview right by 50 and down by 0
	And user clicks "Done" on the screen editor
	When the user clicks "Workspace Manager Button"
	And the user clicks "Duplicate"	
	Then the user sees copy of user defined screen in the list of screens
		|Coversheet|
		|Timeline|
		|Meds Review|
		|Documents|
		|Overview|
		|User Defined Workspace 1| 
		|User Defined Workspace 1 Copy|
	
	And the user clicks "Delete User Defined Workspace 1 Copy Link"
	And the user clicks "Confirm Delete"
	And the "User Defined Workspace 1 Copy" is not listed in the workspace manager page
	Then the user sees following list of screens
		|Coversheet|
		|Timeline|
		|Meds Review|
		|Documents|
		|Overview|
		|User Defined Workspace 1| 
		
    And the user clicks "Delete"
    #And the user clicks "Delete User Defined Workspace 1 Link"
    And the user clicks "Confirm Delete"
	Then the "User Defined Workspace 1" is not listed in the workspace manager page

@US5244 @preview @DE1071 
Scenario: User will be able to click the preview button and see the applets loaded for the specific screens
    When the user clicks "Workspace Manager Button"
	And the user clicks "Plus Button"
	Then the user sees following list of screens
		|Coversheet|
		|Timeline|
		|Meds Review|
		|Documents|
		|Overview|
		|User Defined Workspace 1| 
		
	And the user clicks "Customize"
	Then drag and drop the Allergies right by 40 and down by 400
	And user clicks "Allergies Gist View" on the screen editor
	And drag and drop the Allergies preview right by 50 and down by 0
	And user clicks "Done" on the screen editor
	When the user clicks "Workspace Manager Button"
	And the user clicks "UDS Preview Link"
	Then the user sees following applets
		|Allergies|
    And the user clicks "Close Link"
    And the user clicks "Delete"
    And the user clicks "Confirm Delete"
	Then the "User Defined Workspace 1" is not listed in the workspace manager page
	


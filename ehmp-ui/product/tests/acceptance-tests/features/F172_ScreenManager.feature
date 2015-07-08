@future @US4160 @US4139 @US4272 @US5412 @US5275 @US5278 @US5261 @US4240  @US5719
Feature: F339 - User Defined Work Spaces 2 - Workspace Manager Redesign
#Feature: F172 - User-Defined Screens - Screen Manager - Old Screen Manager was replaced
#Team Neptune

Background: 
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	And the user clicks the "Workspace Manager"

@US5412a 
Scenario: Screen manager's headers are viewable 
	When the Workspace Manager Header contains 7 headers
	Then the Workspace Manager has the following headers 
		|Headers|
		| |
		|Title |
		|Description |
		|Author|
		|Associated Conditions|
		|Preview|
		|Menu|
	And the user clicks "Done editing" on the workspace manager

@US5412b @future
Scenario: The fly out menu for predefined screens contains four options
	When the Workspace Manager Header contains 7 headers
	And the user clicks "Coversheet fly-out menu" on the workspace manager
	Then the flyout menu contains
		|Launch Menu| 
		|Make Default |
		|Duplicate|
		|Rearrange|
		|Launch|
	And the user clicks "Done editing" on the workspace manager

@US5412c @future
Scenario: The fly out menu for UDS contains five options
	When the Workspace Manager Header contains 7 headers
	And the user clicks "add new screen button" on the workspace manager
	And the user clicks "workspace1 fly-out" on the workspace manager
	Then the workspace 1 flyout menu contains
		|Launch Menu |
		|Make Default |
		|Duplicate|
		|Rearrange|
		|Delete |
		|Launch|
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Done editing" on the workspace manager

@US5412d @future
Scenario: Deleting a workspace triggers an alert and does not affect the other workspaces
	When the Workspace Manager Header contains 10 headers
	And there are 5 "workspace rows"
	And the user clicks "add new screen button" on the workspace manager
	And there are 6 "workspace rows"
	And the user clicks "add new screen button" on the workspace manager
	And there are 7 "workspace rows"
	Then the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Confirm Delete" on the workspace manager
	And there are 6 "workspace rows"
	And the user clicks "Delete workspace2" on the workspace manager
	And the user clicks "Confirm Delete" on the workspace manager
	And there are 5 "workspace rows"
	And the user clicks "Done editing" on the workspace manager
			
@US5275a @future
Scenario: User launches screen with applets from the fly-out menu
	When the user clicks "Coversheet fly-out menu" on the workspace manager
	And the user clicks "Coversheet launch button" on the workspace manager
	Then there are 9 applets on the "coversheet check"

@US5275b @future
Scenario: User launches screen without applets from the fly-out menu
	When the user clicks "add new screen button" on the workspace manager
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "workspace1 launch" on the workspace manager
	Then Screen editor is active
	And the user clicks "Screen Editor Exit" on the workspace manager
	And the user clicks the "Workspace Manager"
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Confirm Delete" on the workspace manager
	And the user clicks "Done editing" on the workspace manager

@US5261a @future
Scenario: Clone a predefined screen 
	When the Workspace Manager Header contains 7 headers
	And the user clicks "Coversheet fly-out menu" on the workspace manager
	And the user clicks "Coversheet Duplicate" on the workspace manager
	And the user clicks "Coversheet Copy Flyout" on the workspace manager
	And the user clicks "Coversheet Copy Launch" on the workspace manager
	Then there are 9 applets on the "coversheet check"
	And drag and drop the conditions copy right by 500 and down by 0
	And the user clicks the "Workspace Manager"
	And the user clicks "Coversheet Copy Flyout" on the workspace manager
	And the user clicks "Coversheet Copy Delete" on the workspace manager
	And the user clicks "Confirm Delete" on the workspace manager
	And the user clicks "Done editing" on the workspace manager

@US5261b @future
Scenario: Clone a UDS
	When the user clicks "add new screen button" on the workspace manager
	And the user clicks "workspace1 fly-out" on the workspace manager
    And the user clicks "Workspace1 Duplicate" on the workspace manager
	And the user clicks "workspace1 copy flyout" on the workspace manager
	And the user clicks "workspace1 copy launch" on the workspace manager
	Then Screen editor is active
	And the user clicks "Screen Editor Exit" on the workspace manager
	And the user clicks the "Workspace Manager"
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "workspace1 copy flyout" on the workspace manager
	And the user clicks "workspace1 copy delete" on the workspace manager
	And the user clicks "Confirm Delete" on the workspace manager
	And the user clicks "Done editing" on the workspace manager

@US5278a @future 
Scenario: User adds a new screen
	When there are 5 "workspace rows"
	Then the user clicks "add new screen button" on the workspace manager
	And there are 6 "workspace rows"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user enters "Title" into the screen manager "workspace1 title field"
	And the user enters "Description" into the screen manager "workspace1 description field"
	And the user clicks "Done editing" on the workspace manager
	And the user clicks the "Workspace Manager"
	And the workspace manager "workspace1 title" contains "Title"
	And the workspace manager "workspace1 description" contains "Description"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Done editing" on the workspace manager

@US5278b @future 
Scenario: User cannot erase the title field or description placeholder
	When there are 5 "workspace rows"
	Then the user clicks "add new screen button" on the workspace manager
	And there are 6 "workspace rows"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user enters " " into the screen manager "workspace1 title field"
	And the user enters " " into the screen manager "workspace1 description field"
	And the user clicks "Done editing" on the workspace manager
	And the user clicks the "Workspace Manager"
	And the workspace manager "workspace1 title" contains "User Defined Workspace 1"
	And the workspace manager "workspace1 description" contains "Add description"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Done editing" on the workspace manager
	
@US5278c @future 
Scenario: User cannot enter more than 40 characters for the title and 140 characters for the description
	When there are 5 "workspace rows"
	Then the user clicks "add new screen button" on the workspace manager
	And there are 6 "workspace rows"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user enters "1234567890123456789012345678901" into the screen manager "workspace1 title field"
	And the user enters "123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901" into the screen manager "workspace1 description field"
	And the user clicks "Done editing" on the workspace manager
	And the user clicks the "Workspace Manager"
	And the workspace manager "workspace1 title" contains "123456789012345678901234567890"
	And the workspace manager "workspace1 description" contains "12345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890123456789012345678901234567890"
	And the workspace manager "workspace1 Author" contains "PANORAMA USER"
	And the user clicks "workspace1 fly-out" on the workspace manager
	And the user clicks "Delete workspace1" on the workspace manager
	And the user clicks "Done editing" on the workspace manager
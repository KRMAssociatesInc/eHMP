@future @dragdrop 
Feature: Testing Drag and Drop 
#TeamNeptune

Scenario: Demo for the drag and drop testing
	Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	And the user navigates to the maximized gridster page
	And the user navigates to "Screen Editor"
	#And the user navigates to "Workspace Manager"
    #And the user navigates to "Add New Worksheet"
	#And the user enters "test" into the "Title Field" in the Workspace Manager
	#And the user enters "test" into the "Description Field" in the Workspace Manager
	#And the user navigates to "Add and Load"
	And drag and drop the "Allergies" right by 5 and down by 169
#Team Neptune
@US4136 @future @manual
Feature: F172 - User-Defined Screens - Screen Manager 
# This test is being moved to archive.
# Manual test is defined in functional test TC54
Background: 
    Given user is logged into eHMP-UI
	And user searches for and selects "Eight,Patient"
	And Cover Sheet is active
	And the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient			|
	And the user clicks the workspace manager button on the left side of the coversheet dropdown list
	And the user navigates to the screen manager's view 
	And the screens are displayed in the following order
		| Coversheet |
		| Timeline |
		| Overview |
		| Meds Review |
		| Documents | 

@US4136a @US3780
Scenario: User creates a new screen and sets it as the default screen
    When the user clicks the Add New Screen Button
    Then the user sees a pop-up window with title and description fields
    When the user creates a new screen titled "screen" with the description "screen"
	And sets "screen" as the default screen
    And the user clicks Add and Load Screen button
    Then the user navigates to the screen editor page with the title of the screen as "screen"
    And the user drags and drops the applets from the carousel into the workspace
    And the user clicks the done button
    Then the title of the screen and applets on that screen gets saved
    And the user is directed to the previously saved screen
    And the user can see the saved applets
    Then the user clicks the workspace manager button
    And the user navigates to the screen manager's view
	Then the screens are displayed in the following order
		| Timeline |
		| Overview |
		| Meds Review |
		| Documents |
		| screen |
	And the default screen is set to screen
			
@US4136b
Scenario: User rearranges the screens and closes the screen managers view
	When the user places the coversheet applet at the end of the carousel
	Then the screens are displayed in the following order
		| Timeline |
		| Overview |
		| Meds Review |
		| Documents |
		| Coversheet |
	And the dynamic dropdown menu is in the following order	
		| Timeline |
		| Overview |
		| Meds Review |
		| Documents |
		| Coversheet |
		
@US4136c
Scenario: User scrolls to different pages on carousel to view existing screens
	When the user creates multiple screens with different titles and descriptions
	Then the user clicks the workspace manager button
    And the user navigates to the screen manager's view
    Then the user sees all the previously saved screens on the carousel
    And the user clicks left and right arrows to go to different pages on the carousel
    And the user clicks dot icon below the different screens on the carousel to go to different pages on the carousel
    
@US4136d
Scenario: User tries to create the screen with the name of the screen already existing and gets a failure message
    When the user clicks the Add New Screen Button
    Then the user sees a pop-up window with title and description fields
    When the user creates a new screen titled "test" with the description "test"
	And sets "test" as the default screen
    And the user clicks Add and Load Screen button
    Then the user navigates to the screen editor page with the title of the screen as "test"
    And the user drags and drops the applets from the carousel into the workspace
    And the user clicks the done button
    Then the title of the screen and applets on that screen gets saved
    And the user is directed to the previously saved screen
    And the user can see the saved applets
    Then the user clicks the workspace manager button
    And the user navigates to the screen manager's view   
    When the user clicks the Add New Screen Button
    Then the user sees a pop-up window with title and description fields
    When the user tries to create a new screen titled "test" which already exists with the description "test"
    And the user clicks Add and Load Screen button
    Then the user sees failure message "Please pick a new title. This one is already in use"
	
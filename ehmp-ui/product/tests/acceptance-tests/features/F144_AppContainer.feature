@F144  @regression
Feature: F144 App Container

# POC: Team Mercury
@US1973 @US3060
Scenario: As a user I will be able to view the app container including header region with patient search link, selected patient info, current user info, and Help menu.
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
	Then Cover Sheet is active
    Then the "patient identifying traits" is displayed with information
	   | html 			| value 				|
       | patient name	| Ten,Patient 			|
	Then the navigation bar displays the Patient Search Button
	And the navigation bar displays "Current User Menu"
	And the Current User Menu Text displays "USER, PANORAMA"

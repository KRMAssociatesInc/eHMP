@F117_crosscutting @DE602 @regression
Feature: F117 provides cross cutting UI concerns including: displaying the current patient identifying traits, displaying the application version, and providing screen-to-screen navigation.

# POC: Team Mercury
Background:
	Given user is logged into eHMP-UI
	And user searches for and selects "Ten,Patient"
	Then Cover Sheet is active

@US2145
Scenario: Verify current patient identifying traits, application version and screen to screen navigation
	Then the "patient identifying traits" is displayed with information
		| html 			| value 				|
		| patient name  | Ten,Patient 			|
		| DOB         	| 04/07/1935 (80y)      |
		| SSN 			| 666-00-0010			|
        | Gender        | Male                  |
	And "Bottom Region" contains "eHMP version"
	Then the navigation bar displays the Patient Search Button
	When the user clicks the Patient Search Button
	Then the patient search screen is displayed
	

@F117
Feature: Create a web application to be used as point-of-care healthcare application.
	
@firsttest @debug
Scenario: Verify ADK opens in browser with a navigation bar
	Given user views ADK
	Then the region "North Region" is displayed

	
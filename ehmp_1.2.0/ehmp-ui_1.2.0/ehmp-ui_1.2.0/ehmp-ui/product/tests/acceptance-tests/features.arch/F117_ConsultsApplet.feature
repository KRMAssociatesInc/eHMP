Feature: Consults Applet Test

@consults_applet
Scenario: First test to verify consults applet
	Given user is logged into eHMP-UI
	Given user enters "EIGHT,PATIENT" in the search box
	And user views screen "consult-list" in the eHMP-UI
	Then the panel title is "Consults"

@future

Feature: Medication Review Applet Test

@med_review_applet
Scenario: First test to verify med review applet
	Given user is logged into eHMP-UI
	And user views screen "medication-review-screen" in the eHMP-UI
	Given user enters "Eight,Patient" in the search box
	Then the search results display 2 results
	Given user selects patient 0 in the list
	Then the "Med Review Tab" is displayed
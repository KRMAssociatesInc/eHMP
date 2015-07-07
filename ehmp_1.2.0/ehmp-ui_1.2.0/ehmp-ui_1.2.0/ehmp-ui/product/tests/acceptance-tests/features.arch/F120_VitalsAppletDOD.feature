@F120 @future
Feature: JLV GUI Refactoring to use VistA Exchange

Background:
	Given user is logged into eHMP-UI
	When the user selects "Sample Applets" menu header
	And the user selects "Vitals" menu item

@future @US1510
Scenario: Verify current patient identifying traits
	Given user enters "BCMA,EIGHT" in the search box
	Then the search results display 20 results
	Given user selects patient 0 in the list
	Then the region "Applet Header Region" is displayed
	And "Panel Title" contains patient name "BCMA,EIGHT"
	# And "Panel Heading" contains "***-**-0008"
	# And "Panel Heading" contains "1935-04-07, 80y Male"
	#Then table class contains "Health Care System"
	

	When the user selects "Sample Applets" menu header
	And the user selects "Vitals" menu item
	Then the panel title is "Vitals"
	#Then the table contains 46 rows
	And the table contains rows
	
	  | Type           | Result | Units | Observed       | Facility |
      | BLOOD PRESSURE | 117/58 | mmHg  | 20070717060926 | DOD      | 



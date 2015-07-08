#Team Neptune
@F120_allergyapplet_dod @regression
Feature: JLV GUI Refactoring to use VistA Exchange

Background:
	Given user is logged into eHMP-UI


@US1446 @US2178
Scenario: Verify current patient identifying traits
	#Given user enters "Ten,Patient" in the search box

    And user searches for and selects "Eight,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Eight,Patient 	    |
	And the applets are displayed on the coversheet
		| applet 					|
		| ALLERGIES     		 	| 

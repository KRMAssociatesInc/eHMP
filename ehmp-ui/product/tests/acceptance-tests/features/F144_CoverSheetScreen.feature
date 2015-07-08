@F144 @regression
Feature: F144-eHMP Viewer GUI - Coversheet View

#POC: Team Mercury

@US2145 @DE130 @DE160 @smoke
Scenario: User views the cover sheet
	Given user is logged into eHMP-UI
	And user searches for and selects "BCMA,Eight"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
		| field			| value 				|
		| patient name	| Bcma,Eight 			|
	And the applets are displayed on the coversheet
		| applet 					|
		| CONDITIONS	 			|
		| LAB RESULTS				|
		| VITALS 					|
		| MEDICATIONS				|
		| ALLERGIES					|
		| IMMUNIZATIONS				|
		| ORDERS					|
		| APPOINTMENTS				|
		| COMMUNITY HEALTH SUMMARIES|
	And the Vitals applet displays data grid rows

@F297_InfoButtonEnterpriseIntegration

Feature: F297 -InfoButton feature file for defects

#POC: Team Venus
#remove future tag when DE1180 is merged
@F297_1_InfoButton @DE1180 @future
Scenario: Verify button appears and disappears
	Given user is logged into eHMP-UI
	And user searches for and selects "Ehmp,Five"
	Then Cover Sheet is active
	Then the InfoButtton is present on "Conditions" applet "extended" view

@F297_2_InfoButton @DE1228
Scenario: Verify button appears and disappears
	Given user is logged into eHMP-UI
	And user searches for and selects "Five,Patient"
	Then Overview is active
	Then the InfoButtton is present on "Vitals" applet "trend" view
	Then Cover Sheet is active
	Then the InfoButtton is present on "Vitals" applet "summary" view
	Then the InfoButtton is present on "Vitals" applet "extended" view
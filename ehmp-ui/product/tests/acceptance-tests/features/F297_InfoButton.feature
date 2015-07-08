@F297_InfoButtonEnterpriseIntegration

Feature: F236 - OnLineHelp
#"By displaying context sensitive medical information specific to certain concepts (problems, medications, and labs), a clinician can better assess and treat patients."

#POC: Team Venus
@F297_1_InfoButton @US4529 @future
Scenario: Verify button appears and disappears
	Given user is logged into eHMP-UI
	And user searches for and selects "Five,Patient"
	Then Cover Sheet is active
	Then the InfoButtton is present on "Coversheet" page

@F297_2_InfoButton @US4529 @US6045 @future
Scenario: Verify button is clickable and a new window si opened
	Given user is logged into eHMP-UI
	And user searches for and selects "Five,Patient"
	Then Cover Sheet is active
	Then the InfoButtton page is opened by clicking on the infobutton icon
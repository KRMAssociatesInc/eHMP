@DiscrepantDataIndicator @F365

Feature: F365 - Enhance Patient Header - Include Non-Local Demographics by Site

# POC: Team Saturn

@F365-4.1_DiscrepantDataOutPatientKodak @US4456 @US5587 @US5078
	Scenario: Discrepancy icon in demographic drop down for Outpatient in Kodak
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Discrepant Data indicator icon displays for "Home Phone"
	And the Discrepant Data indicator icon displays for "Cell Phone"
	And the Discrepant Data indicator icon displays for "Work Phone"
	And the Discrepant Data indicator icon displays for "Temp Address"	
	And the Discrepant Data indicator icon displays for "Email_1"
	And the Discrepant Data indicator icon displays for "Emergency Name"
	And the Discrepant Data indicator icon displays for "Emergency Home Phone"
	And the Discrepant Data indicator icon displays for "Emergency Work Phone"
	And the Discrepant Data indicator icon displays for "Emergency Address"
	And the Discrepant Data indicator icon displays for "NOK Name"
	And the Discrepant Data indicator icon displays for "NOK Home Phone"
	And the Discrepant Data indicator icon displays for "NOK Work Phone"
	And the Discrepant Data indicator icon displays for "NOK Address"
	And the Discrepant Data indicator icon does not displays for "Home Address"

@F365-4.2_DiscrepantDataInPatientKodak @US4456 @US5587 @US5078
	Scenario: Discrepancy icon in demographic drop down for Inpatient in Kodak
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Discrepant Data indicator icon displays for "Home Phone"
	And the Discrepant Data indicator icon displays for "Cell Phone"
	And the Discrepant Data indicator icon displays for "Work Phone"
	And the Discrepant Data indicator icon displays for "Home Address"
	And the Discrepant Data indicator icon displays for "Email_1"
	And the Discrepant Data indicator icon displays for "Emergency Name"
	And the Discrepant Data indicator icon displays for "Emergency Home Phone"
	And the Discrepant Data indicator icon displays for "Emergency Work Phone"
	And the Discrepant Data indicator icon displays for "Emergency Address"
	And the Discrepant Data indicator icon displays for "NOK Name"
	And the Discrepant Data indicator icon displays for "NOK Home Phone"
	And the Discrepant Data indicator icon displays for "NOK Work Phone"
	And the Discrepant Data indicator icon displays for "NOK Address"
	And the Discrepant Data indicator icon does not displays for "Temp Address"


@F365-4.3_DiscrepantDataOutPatientPanorama @US4456 @US5587 @US5078
	Scenario: Discrepancy icon in demographic drop down for Outpatient in Panorama
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Discrepant Data indicator icon displays for "Home Phone"
	And the Discrepant Data indicator icon displays for "Work Phone"
	And the Discrepant Data indicator icon displays for "Home Address"
	And the Discrepant Data indicator icon displays for "NOK Name"

	And the Discrepant Data indicator icon does not displays for "Temp Address"
	And the Discrepant Data indicator icon does not displays for "Emergency Name"
	And the Discrepant Data indicator icon does not displays for "Emergency Home Phone"
	And the Discrepant Data indicator icon does not displays for "Emergency Work Phone"
	And the Discrepant Data indicator icon does not displays for "Emergency Address"

@F365-4.1_DiscrepantDataInPatientPanorama @US4456 @US5587 @US5078
	Scenario: Discrepancy icon in demographic drop down for Inpatient in Panorama
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	And the Discrepant Data indicator icon displays for "Home Address"	
	
	
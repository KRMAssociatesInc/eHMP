@F365 @PatientDemoData @regression

Feature: F365 - Enhance Patient Header - Include Non-Local Demographics by Site

# POC: Team Saturn

@F365-3.OutPatientPanorama @US5116 @US5587 @US4456 @DE1455
	Scenario: Patient Information: Demographic drop down "Data" in Panorama for Outpatient
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	#Field data
	And the Patient's "Home Phone" is "(843) 555-1234"
	And the Patient's "Cell Phone" is "(843) 555-5678"
	And the Patient's "Work Phone" is "(843) 555-2345"
	And the Patient's "Home Address line1" is ""
	And the Patient's "Home Address line1" is "home address"
	And the Patient's "Home Address line2" is "charleston, SC, 29492"
	And the Patient's "Email_1" is "23@EXAMPLE.COM "
	And the Patient's "Sister" is "veteran,sister"
	And the Patient's "Emergency Home Phone" is "(843) 555-0987"
	And the Patient's "Emergency Work Phone" is "(843) 555-9876"
	And the Patient's "Emergency Address1" is "sist address"
	And the Patient's "Emergency Address2" is "mount pleasant, SC, 29464"
	And the Patient's "NOK Brother" is "veteran,brother"
	And the Patient's "NOK Home Phone" is "(843) 555-8765"
	And the Patient's "NOK Work Phone" is "(843) 555-7654"
	And the Patient's "NOK Address line1" is "brot address"
	And the Patient's "NOK Address line2" is "west columbia, SC, 29169"
	And the Patient's "Service Connected" is "Yes"
	And the Patient's "Service Conditions l1" is "DYSLEXIA (100%)"
	And the Patient's "Service Conditions l2" is "DEMENTIA (50%)"
	And the Patient's "Service Conditions l3" is "MULTIPLE SCLEROSIS (50%)"
	And the Patient's "Service Conditions l4" is "INSOMNIA (30%)"
	And the Patient's "Insurance Name" is "PRIVATE INSURANCE CO INC"
	And the Patient's "Group" is ""
	And the Patient's "Holder" is "self"
	And the Patient's "Effective Date" is "01/01/2013"
	And the Patient's "Expiration Date" is "12/01/2026"
	And the Patient's "Veteran Status" is "Yes"
	And the Patient's "Marital Status" is "legally separated"
	And the Patient's "Religion" is "baptist"

@F365-3.InpatientPanorama @US5116 @US5587 @US4456 @F365-3.4
	Scenario:  Patient Information: Demographic drop down "Data" in Panorama for Inpatient
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	#Field data
	And the Patient's "Home Phone" is "(843) 555-4321"
	And the Patient's "Cell Phone" is "(843) 555-8844"
	And the Patient's "Work Phone" is "(843) 555-3456"
	And the Patient's "Home Address line1" is "Home Address"
	And the Patient's "Home Address line2" is "cainhoy, SC, 29492"
	And the Patient's "Temp Address line1" is ""
	And the Patient's "Email_1" is "I23@EXAMPLE.COM "
	And the Patient's "Nephew" is "veteran,nephew"
	And the Patient's "Emergency Home Phone" is "(843) 555-8843"
	And the Patient's "Emergency Work Phone" is "(843) 555-2398"
	And the Patient's "Emergency Address1" is "nephew address"
	And the Patient's "Emergency Address2" is "charleston, SC, 29492"
	And the Patient's "NOK cousin" is "veteran,cousin"
	And the Patient's "NOK Home Phone" is "(843) 555-2299"
	And the Patient's "NOK Work Phone" is "(843) 555-3388"
	And the Patient's "NOK Address line1" is "cousin address"
	And the Patient's "NOK Address line2" is "north charleston, SC, 29405"
	And the Patient's "Service Connected" is "Yes"
	And the Patient's "Service Conditions l1" is "ASMTHA (50%)"
	And the Patient's "Service Conditions l2" is "BALO DISEASE (30%)"
	And the Patient's "Service Conditions l3" is "CELIAC DISEASE (50%)"
	And the Patient's "Service Conditions l4" is "MYOSITIS (10%)"
	And the Patient's "Insurance Name" is "MEDICARE"
	And the Patient's "Group" is "MAN32"
	And the Patient's "Holder" is "self"
	And the Patient's "Effective Date" is "12/10/2014"
	And the Patient's "Expiration Date" is "12/31/2026"
	And the Patient's "Veteran Status" is "Yes"
	And the Patient's "Marital Status" is "never married"
	And the Patient's "Religion" is "confucianism"

@F365-3.3_InPatientKodak @US5116 @US5587 @DE1309
	Scenario: Patient Information: Demographic drop down "Data" in Kodak for Inpatient
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	#Field data
	And the Patient's "Home Phone" is "(555) 555-0083"

@F365-3.3_InPatientKodak2 @US5116 @US5587 @DE1309
	Scenario: Patient Information: Demographic drop down "Data" in Kodak for Inpatient
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	#Field data
	And the Patient's "Cell Phone" is "(555) 555-9833"
	And the Patient's "Work Phone" is "(555) 555-9832"
	And the Patient's "Home Address line1" is "Any Street"
	And the Patient's "Email_1" is "INPATIENT23@EXAMPLE.COM "
	And the Patient's "NOK cousin" is "brother,inpatient"
	And the Patient's "NOK Home Phone" is "(555) 555-3726"
	And the Patient's "NOK Address line1" is "brother address"
	And the Patient's "NOK Address line2" is "Anytown, NC, 27007"
	And the Patient's "Service Connected" is "No"
	And the Patient's "Veteran Status" is "Yes"

@F365-3.4_OutPatientKodak @US5116 @US5587 @DE1309
	Scenario: Patient Information: Demographic drop down "Data" in Kodak for Outpatient
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
	#Field data
	And the Patient's "Work Phone" is "(222) 555-7720"
	And the Patient's "Temp Address line1" is "Temp Address"
	And the Patient's "Temp Address line2" is "Wando, SC, 29492"
	And the Patient's "NOK Brother" is "veteran,brother"
	And the Patient's "Service Connected" is "Yes"
	And the Patient's "Insurance Name" is "MEDICARE"
	And the Patient's "Group" is "MAN32"
	And the Patient's "Holder" is "self"
	And the Patient's "Effective Date" is "01/01/1993"
	And the Patient's "Expiration Date" is ""
	And the Patient's "Veteran Status" is "Yes"
	And the Patient's "Marital Status" is "Legally Separated"
	And the Patient's "Religion" is "Baptist"


@F365 @PatientDemoHeaders @regression

Feature: F365 - Enhance Patient Header - Include Non-Local Demographics by Site

# POC: Team Saturn 

@F365-2.1_DetailDialogOutpatient @US5116 @US4456
	Scenario: Patient Information: Demographic drop down "HEADERS" in Panorama for Outpatient
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient		|
	Then Cover Sheet is active
	Then user selects Patient Name drop down
  
  #group labels (In blue fonts)
	Then the Patient Information header displays: "Phone"
	Then the Patient Information header displays: "Adressess"
	Then the Patient Information header displays: "Email"
	Then the Patient Information header displays: "Emergency Contact"
	Then the Patient Information header displays: "Next of Kin"
	Then the Patient Information header displays: "Email"
	Then the Patient Information header displays: "Health Benefits and Insurance"
	Then the Patient Information header displays: "Service and Social History"
	#Field labels
	Then the Patient Information header displays: "Home Phone"
	Then the Patient Information header displays: "Cell Phone"
	Then the Patient Information header displays: "Work Phone"
	Then the Patient Information header displays: "Home Address"
	Then the Patient Information header displays: "Temporary Address"	
	Then the Patient Information header displays: "Emergency Name Label"
	Then the Patient Information header displays: "Emergency Home Phone"
	Then the Patient Information header displays: "Emergency Work Phone"
	Then the Patient Information header displays: "Emergency Address"
	Then the Patient Information header displays: "NOK Name Label"
	Then the Patient Information header displays: "NOK Home Phone"
	Then the Patient Information header displays: "NOK Work Phone"
	Then the Patient Information header displays: "NOK Address"
	Then the Patient Information header displays: "Service Connected"
	Then the Patient Information header displays: "Service Connected Conditions"
	Then the Patient Information header displays: "Insurance"
	Then the Patient Information header displays: "Insurance Name"
	Then the Patient Information header displays: "Group"
	Then the Patient Information header displays: "Holder"
	Then the Patient Information header displays: "Effective Date"
	Then the Patient Information header displays: "Expiration Date"
	Then the Patient Information header displays: "Veteran Status"
	Then the Patient Information header displays: "Marital Status"
	Then the Patient Information header displays: "Religion"

@F365-2.1_DetailDialogInpatient @US5116 @US4456 @DE1309
	Scenario: Patient Information: Demographic drop down "HEADERS" in Kodak for Inpatient
	Given user is logged into eHMP-UI as kodak user
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	#Then wait
	Then user selects Patient Name drop down
	#group labels (In blue fonts)
	Then the Patient Information header displays: "Phone"
	Then the Patient Information header displays: "Adressess"
	Then the Patient Information header displays: "Email"
	Then the Patient Information header displays: "Emergency Contact"
	Then the Patient Information header displays: "Next of Kin"
	Then the Patient Information header displays: "Email"
	Then the Patient Information header displays: "Health Benefits and Insurance"
	Then the Patient Information header displays: "Service and Social History"
	#Field labels
	Then the Patient Information header displays: "Home Phone"
	Then the Patient Information header displays: "Cell Phone"
	Then the Patient Information header displays: "Work Phone"
	Then the Patient Information header displays: "Home Address"
	Then the Patient Information header displays: "Temporary Address"
	Then the Patient Information header displays: "Emergency Name Label"
	Then the Patient Information header displays: "Emergency Home Phone"
	Then the Patient Information header displays: "Emergency Work Phone"
	Then the Patient Information header displays: "Emergency Address"
	Then the Patient Information header displays: "NOK Name Label"
	Then the Patient Information header displays: "NOK Home Phone"
	Then the Patient Information header displays: "NOK Work Phone"
	Then the Patient Information header displays: "NOK Address"
	Then the Patient Information header displays: "Service Connected"
	Then the Patient Information header displays: "Service Connected Conditions"
	Then the Patient Information header displays: "Insurance"
	Then the Patient Information header does not displays: "Insurance Name"
	Then the Patient Information header does not displays: "Group"
	Then the Patient Information header does not displays: "Holder"
	Then the Patient Information header does not displays: "Effective Date"
	Then the Patient Information header does not displays: "Expiration Date"
	Then the Patient Information header displays: "Veteran Status"
	Then the Patient Information header displays: "Marital Status"
	Then the Patient Information header displays: "Religion"


@F365 @PatientDemographics @regression

Feature: F365 - Enhance Patient Header - Include Non-Local Demographics by Site

# POC: Team Saturn

@F365-1.1_InpatientHeader @US5182 @US5780
	Scenario: Inpatient Demographics Information
	Given user is logged into eHMP-UI
	And user searches for and selects "twentythree,inpatient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Inpatient		|
	Then Cover Sheet is active
	And the Patient's "Name" is "Twentythree,Inpatient"
	And the Patient's "Status" is "Inpatient"
	And the Patient's "DOB" is "03/09/1945 (70y)"
	And the Patient's "SSN" is "666-00-0823"
	And the Patient's "Gender" is "Male"
	 
@F365-2.1_OutpatientHeader @US5182 @US5780
	Scenario: Outpatient Demographics Information
	Given user is logged into eHMP-UI
	And user searches for and selects "Twentythree,Patient"
	Then Cover Sheet is active
	Then the "patient identifying traits" is displayed with information
	| field			| value 				|
	| patient name	| Twentythree,Patient	|
	Then Cover Sheet is active	
	And the Patient's "Name" is "Twentythree,Patient"
	And the Patient's "Status" is "Outpatient"
	And the Patient's "DOB" is "04/07/1935 (80y)"
	And the Patient's "SSN" is "666-00-0023"
	And the Patient's "Gender" is "Male"



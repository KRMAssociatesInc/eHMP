@HMPDemo @Patient @UI
Feature: Access individual patient information

Background:
    Given user has successfully logged into HMP



@SearchPatientSingle @UI
Scenario: Search for single patient
    When user types "Eightyeight,Inpatient" in the "Search Field"
    Then the patient list displays "1" results within "10" seconds
    Then matching patients are displayed in the patient list
    |patient|
    |Eightyeight,Inpatient|
    
@SearchPatientMultiple @UI
Scenario: Search for multiple patients
    When user types "Eight" in the "Search Field"
    Then the patient list displays "38" results within "30" seconds
    Then matching patients are displayed in the patient list
    |patient|
    |Eight,Patient|
    |Eight,Imagepatient|
    |Eight,Inpatient|
    
@SelectPatient @UI
Scenario: Select patient to view 
    And user types "Eight" in the "Search Field"
    Then the patient list displays "38" results
    And user selects "Eight,Patient" from the patient list
    Then the patient details for "Eight,Patient" displays 
	|value|
	|666-00-0008|
	|07-Apr-1935|
	|79y|
	|Male|
	

#Team Orion

Feature: F304 - Health Summaries (VistA Web Health Exchange)

@US4748 @US4748_not_authenticated 
Scenario: Authentication error message received when the RDK endpoint URL is not authenticated
	Given a patient "EIGHTEEN,IMAGEPATIENT"
	And a request data was sent with pid "5000000327V828570"
	Then authentication error returned

@US4748 @US4748_no_pid 
Scenario: Error message received when the RDK endpoint URL is without pid
	Given a patient "EIGHTEEN,IMAGEPATIENT"
	And a request data was sent without pid
	Then error message returned

@US4748 @US4748_bad_pid 
Scenario: Error message received when the RDK endpoint URL is with bad pid
	Given a patient "EIGHTEEN,IMAGEPATIENT"
	And a request data was sent with bad pid "10108V420872"
	Then the error message returned

@US4748 @US4748_correct_JSON 
Scenario: JSON data with VistA sites information received when the RDK endpoint URL with correct pid
	Given a patient "EIGHTEEN,IMAGEPATIENT"
	And a request data was sent with pid "10108V420871"
	Then correct JSON data returned

@US4748 @US4748_primary_sites_JSON 
Scenario: JSON data with VistA Primary Sites information received when the RDK endpoint URL with correct pid
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a request data was sent with pid "10108V420871"
    Then correct JSON data of primary sites returned

#@US4748 @US4748_non_primary_sites_JSON 
#Scenario: JSON data with VistA non-Primary Sites information received when the RDK endpoint URL with correct pid
 #   Given a patient "EIGHTEEN,IMAGEPATIENT"
 #   And a request data was sent with pid "10108V420871"
 #   Then correct JSON data of non-primary sites returned

@US4750 @US4750_correct_report_content 
Scenario: The patient HS report received when the RDK endpoint URL within correct parameters
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a HS report request was sent with patientID "10108V420871", siteID "9E7A", reportID "12;INPATIENT"  
    Then patient HS report returned

@US4750 @US4750_patientID_required 
Scenario: Error message received when the RDK endpoint request for report content is without patient ID
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a HS report request was sent with reportID "12;INPATIENT", siteID "9E7A"
    Then the patient id missing error message returned 

@US4750 @US4750_siteID_required 
Scenario: Error message received when the RDK endpoint request for report content is without site ID
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a HS report request was sent with reportID "12;INPATIENT", patientID "10108V420871" 
    Then the site id missing error message returned

@US4750 @US4750_reportID_required 
Scenario: Error message received when the RDK endpoint request for report content is without report ID
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a HS report request was sent with siteID "9E7A", patientID "10108V420871" 
    Then the report id missing error message returned

@US4750 @US4750_report_title_required 
Scenario: Error message received when the RDK endpoint request for report content is without report ID
    Given a patient "EIGHTEEN,IMAGEPATIENT"
    And a HS report request was sent with siteID "9E7A", patientID "10108V420871", and reportID "12" without report title 
    Then the report title missing error message returned
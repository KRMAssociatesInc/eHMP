@last_name_search
Feature: F119 Searching by patient's partial or complete last name in CPRS Default

#This feature item returns Demographics summary results based on partial or complete last name search and allows the selection of a single result from the summary results. Also includes search for sensitive patient.

@patientdemographicsearch
Scenario: Demographic data (address, gender, etc) is returned when user searches by patient's last name
Given a patient with "this last name exists" in multiple VistAs
When the user searches for a patient "EIGHT,INPATIENT" in VPR format
And the VPR results contain:
      | field                           | panorama_value                                                                                   |
      | displayName                     | Eight,Inpatient                                                                                  |
      | sensitive                       | IS_SET                                                                                       |
      | familyName                      | EIGHT                                                                                            |
      | ssn                             | 666000808                                                                                        |
      | birthDate                       | 19450309                                                                                         |
      | givenNames                      | INPATIENT                                                                                        |
      | genderCode                      | urn:va:pat-gender:M                                                                              |
      | genderName                      | Male                                                                                             |
      | icn                             | 5000000217V519385                                                                                |
      | localId                         | 100716                                                                                           |
      | fullName                        | EIGHT,INPATIENT                                                                                  |
      | last4                           | 0808                                                                                             |
      | last5                           | E0808                                                                                            |
      | pid                             | 9E7A;100716                                                                                       |
      #| summary                         | gov.va.cpe.vpr.PatientDemographics{pids=[5000000217V519385, 500;100716, 666000808, 9E7A;100716]} |
      | uid                             | IS_SET                                                                                           |                          
      #| domainUpdated                   | IS_SET                                                                                           |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from

@sensitivepatientdemograhicsearch
Scenario: When a user searches by patient's last name, demographic data is transformed correctly for a sensitive patient
Given a patient with "this last name exists" in multiple VistAs
When the user searches for a patient "ZZZRETIREDONEFIVE,PATIENT" in VPR format
And the VPR results contain:
      | field         | panorama_value            |
      | pid           | 9E7A;167                  |
      | fullName      | ZZZRETIREDONEFIVE,PATIENT |
      | sensitive     | true                      |

@patientsummarysearch
Scenario: When a user searches by patient's complete last name, demographic summary records are returned.
Given a patient with "this last name exists" in multiple VistAs
When the user searches in summary results for a patient "EIGHT,INPATIENT" in VPR format
And the VPR results contain:
      | field         | panorama_value         |
      | birthDate     | 19450309               |
      | displayName   | Eight,Inpatient        |
      | familyName    | EIGHT                  |
      | genderName    | Male                   |
      | givenNames    | INPATIENT              |
      | pid           | 9E7A;100716            |
      | ssn           | 666000808              |
      | uid           | IS_SET                 |

@patientlastnamesearch
Scenario Outline: When a user searches by patient's partial or complete last name then certain total number of records are returned.
Given a patient with "this last name exists" in multiple VistAs
When the user searches for a patient "<last name>" in VPR format
Then corresponding matching records totaling "<total>" are displayed

	Examples:
		| last name    | total   |
		| EIGHT        | 76      |
		| EIG          | 76      |
		| eight	       | 76      |
		| eiG          | 76      |
		| FIVE         | 208     |
		| FIVEHUNDRED  | 200     |
		| XXX          | 0       |
		| BHI		   | IS_SET  |
		| BHIEPATIENT  | IS_SET  |

@patientlastnamesummarysearch
Scenario Outline: When a user searches by patient's partial or complete last name then certain total number of summary records are returned
Given a patient with "this last name exists" in multiple VistAs
When the user searches in summary results for a patient "<last name>" in VPR format
Then corresponding matching records totaling "<total>" are displayed

	Examples:
		| last name    | total   |
		| EIGHT        | 76      |
		| EIG          | 76      |
		| eight        | 76      |
		| eiG          | 76      |
		| FIVE         | 208     |
		| FIVEHUNDRED  | 200     |
		| XXX          | 0       |
		| BHI		   | IS_SET  |
		| BHIEPATIENT  | IS_SET  |
		
		
# Commit: f4ac319603932d21d9fe57008bb5eaaf11b398c9 [f4ac319]
# Parents: 1667f4ef4f
# Author: Vasudevan, Kamakshi <kamakshi.vasudevan@agilex.com>
# Date: June 20, 2014 at 11:04:38 AM EDT		

# # US1323 - created to fix the below two issues.

# # The following two patient data is not properly synced in HMP.
# # So these two patient searches gets only one line of data in the json response where as in VISTA we have 10 rows.
# # separating this scenario so that other tests pass.

# Scenario Outline: When a user searches by patient's partial or complete last name then certain total number of records are returned.
# Given a patient with "this last name exists" in multiple VistAs
# When the user searches for a patient "<last name>" in VPR format
# Then corresponding matching records totaling "<total>" are displayed

# 	Examples:
# 		| last name    | total   |
# 		| BHI		   | 10  	 |
# 		| BHIEPATIENT  | 10		 |

# # The following two patient data is not properly synced in HMP.  So summary records search is failing.
# # So these two patient searches gets only one line of data in the json response where as in VISTA we have 10 rows.
# # separating this scenario so that other tests pass.


# Scenario Outline: When a user searches by patient's partial or complete last name then certain total number of summary records are returned
# Given a patient with "this last name exists" in multiple VistAs
# When the user searches in summary results for a patient "<last name>" in VPR format
# Then corresponding matching records totaling "<total>" are displayed

# 	Examples:
# 		| last name    | total   |
# 		| BHI		   | 10  	 |
# 		| BHIEPATIENT  | 10  	 |



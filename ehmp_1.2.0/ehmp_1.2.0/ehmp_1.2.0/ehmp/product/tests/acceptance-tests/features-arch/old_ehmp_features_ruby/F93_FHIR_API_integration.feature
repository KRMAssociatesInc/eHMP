@integration 
Feature: F93 FHIR API Integration


#This feature item covers the ability of the FHIR API to sync and unsync a patient, including instances where the patient cannot be found.

@US817
Scenario: Request to unsync a patient
	Given a patient with pid "10104V248233" has been synced through Admin API
	When the client requests that the patient "10104V248233" be cleared from the cache
	Then a successful response is returned within 120 seconds
	And the patient with pid "10104V248233" is cleared within 60 seconds
	

@US817
Scenario: Request to sync a patient
	When a patient with pid "10106V187557" has been synced through Admin API
	Then a successful created response is returned within 180 seconds
	And the patient with pid "10106V187557" is synced within 30 seconds
	
	
@US817 @now
Scenario: Request to sync a patient with a bad pid
	When the client requests that the patient with pid "BADBID" be synced
	Then a Not Found response is returned 
	

@US817-1
Scenario: Requesting data for an unsynced patient will automatically sync the patient
	Given a patient with pid "10105V001065" and icn "10105V001065" has not been synced
	When the client requests allergies for that patient "10105V001065"
	Then a successful response is returned within 480 seconds
	And the patient with pid "10105V001065" is synced within 60 seconds
	
	
@US817
Scenario: Requesting data for a synced patient will return synced data
	Given a patient with pid "10106V187557" has been synced through Admin API
	When the client requests allergies for that patient "10106V187557"
	Then a successful response is returned within 120 seconds
	And the patient with pid "10106V187557" is synced within 60 seconds
	
	
@US817
Scenario: API correctly handles when data retrieval results in an error
	When the client requests allergies for that patient "BAD_PID"
	Then a successful response is returned within 120 seconds
	And the response does not contain patient data
	
	
# The time out is not exposed to the FHIR api and this is not testable ( automatically or manually ) at this time
@US817 @debug
Scenario: API correctly handles when wait time exceeds threshold
	Given a patient with pid "10104V248233" and icn "10104V248233" has not been synced
	When the client requests allergies for that patient "10104V248233"
	Then an error response "???" is returned after 60 seconds
	And the response does not contain patient data

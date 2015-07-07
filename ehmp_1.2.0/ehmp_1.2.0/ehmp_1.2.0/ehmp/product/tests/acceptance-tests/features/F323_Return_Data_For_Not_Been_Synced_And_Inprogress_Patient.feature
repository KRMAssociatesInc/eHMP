@US5939 @F323_3 @vx_sync 
Feature: F323-3  Return Data for a patient that has a sync in progress and has never fully been synced before

#This feature item check that the patient has never been synced and currently has a sync in progress. 	
      
@inprogress_sync_patient
Scenario: An user can get sync status request for the patient that has a sync in progress and has never fully been synced before
	Given a patient with pid "9E7A;1" has not been synced through VX-Sync API for "9E7A" site(s)
	When the client requests sync status for patient with pid "9E7A;1"
	Then the client receives "Patient identifier not found" message in the "body" attribute 
	When the client requests sync process for patient with pid "9E7A;1" through VX-Sync API
	And the client requests sync status for patient with pid "9E7A;1"
	Then the client receives the data stored for that patient along with currently sync in progress status 
	
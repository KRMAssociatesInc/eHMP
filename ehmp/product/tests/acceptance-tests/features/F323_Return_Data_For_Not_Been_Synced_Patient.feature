@US5938 @F323_2 @vx_sync 
Feature: F323-2  Return Data For not been Sync'd Patient

#This feature item sync the patient that has not been synced before. 	
      
@not_been_synced_patient
Scenario: An user can sned sync request for the patient that has not been synced before.
	Given a patient with pid "9E7A;1" has not been synced through VX-Sync API for "9E7A" site(s)
	When the client requests sync status for patient with pid "9E7A;1"
	Then the client receives "Patient identifier not found" message in the "body" attribute 
	When the client requests sync process for patient with pid "9E7A;1" through VX-Sync API
	Then the client receives "created" message in the "status" attribute 
	
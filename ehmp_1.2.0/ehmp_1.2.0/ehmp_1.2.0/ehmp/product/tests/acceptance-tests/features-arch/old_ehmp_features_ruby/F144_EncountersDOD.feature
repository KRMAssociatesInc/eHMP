@US1847

Feature: F144 As a user, I can view Appointments and Visits for VA and DoD patient
#DOD Encounter=VA Visit

Background:
	Given a patient with pid "10108V420871" has been synced through Admin API

@visit
 
Scenario: Client can request DOD encounters in VPR format

	Given a patient with "Visit" in multiple VistAs and in DoD
	When the client requests visit for the patient "10108V420871" in VPR format
	#Then a successful response is returned
	#Then the client receives 210 VPR VistA result(s)
	Then the client receives 19 VPR DoD result(s)
	#Then the VPR results contain:
	And the VPR results contain "visit"

		| field							| value								        |	
		| uid							| urn:va:visit:DOD:0000000003:1000000382  	|
		#| summary						| EncounterProvider{uid='null'}         	|
		| facilityName					| DOD			                            |
		| typeName						| OUTPATIENT							    |
		| categoryName					| DoD Encounter							    |
		
@appointment
 
Scenario: Client can request DOD appointments in VPR format

	Given a patient with "Appointment" in multiple VistAs and in DoD
	When the client requests appointment for the patient "10108V420871" in VPR format
	#Then a successful response is returned
	#Then the client receives 210 VPR VistA result(s)
	Then the client receives 19 VPR DoD result(s)
	#Then the VPR results contain:
	And the VPR results contain "appointment"

		| field							| value								        |	
		| uid							| urn:va:visit:DOD:0000000003:1000000382  	|
		#| summary						| EncounterProvider{uid='null'}         	|
		| facilityName					| DOD			                            |
		| typeName						| OUTPATIENT							    |
		| categoryName					| DoD Encounter							    |
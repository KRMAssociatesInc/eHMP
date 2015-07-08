@US2666

Feature: F153 As a eHMP user I will be able to access a patient's CCD documents that reside in the VLER

Background:
	Given a patient with pid "10108V420871" has been synced through Admin API
 
Scenario: Client can request VLER data in VPR format for a patient with data in VLER C32

	Given a patient with "vler document" in multiple VistAs and in DoD
	When the client requests vler document for the patient "10108V420871" in VPR format
	Then the client receives 11 JDS VistA result(s)
	Then the VPR results contain "vlerdocument"

		| field							| value								                                          |	
		| uid							| urn:va:vlerdocument:VLER:10108V420871:54639790-a2ad-463c-8e7a-9b014eed917b  |
		| summary						| Continuity of Care Document                          						  |
		
@writeback
Feature: F498 Vx-Sync writeback

Background:
	Given a patient with pid "9E7A;66" has been synced through VX-Sync API for "9E7A" site(s)
	And the client requests "VITALS" for the patient "9E7A;66" in VPR format
	And save the totalItems
	And a client connect to VistA using "PANORAMA"


@vital_writeback
Scenario: Client can write to the VistA and add Vital records - BLOOD PRESSURE
	When the client add new Vitals record by using write-back for patient with DFN "66" adding BLOOD PRESSURE with value "110/90"
	Then the client receive the VistA write-back response
	And the new "Vital" record added for the patient "9E7A;66" in VPR format
	When the client use the vx-sync write-back to save the record
	Then the responce is successful
	
	
@vital_writeback
Scenario: Client can write to the VistA and add Vital records - TEMPERATURE
	When the client add new Vitals record by using write-back for patient with DFN "66" adding BODY TEMPERATURE with value "90"
	Then the client receive the VistA write-back response
	And the new "Vital" record added for the patient "9E7A;66" in VPR format
	When the client use the vx-sync write-back to save the record
	Then the responce is successful
@Vx_Sync_writeback @future
Feature: F498 Vx-Sync writeback

Background:
	Given a patient with pid "9E7A;66" has been synced through VX-Sync API for "9E7A" site(s)
	And the client requests "ORDERS" for the patient "9E7A;66" in VPR format
	And save the totalItems
	And a client connect to VistA using "PANORAMA"
	
	
@writeback_lab
Scenario: Client can write to the VistA and add Lab Order records - PTT with Anticoagulation
	When the client add new Lab Order record by using write-back for patient with DFN "66" ordering PTT test
	Then the client receive the VistA write-back response
	And the new "Lab Order" record added for the patient "9E7A;66" in VPR format 
	When the client use the vx-sync write-back to save the record
	Then the responce is successful

	
@writeback_lab
Scenario: Client can write to the VistA and add Lab Order records - THEOPHYLLINE
	When the client add new Lab Order record by using write-back for patient with DFN "66" ordering THEOPHYLLINE test
	Then the client receive the VistA write-back response
	And the new "Lab Order" record added for the patient "9E7A;66" in VPR format  
	When the client use the vx-sync write-back to save the record
	Then the responce is successful

		
@writeback_lab
Scenario: Client can write to the VistA and add Lab Order records - GAS AND CARBON MONOXIDE PANEL 
	When the client add new Lab Order record by using write-back for patient with DFN "66" ordering GAS AND CARBON MONOXIDE PANEL test
	Then the client receive the VistA write-back response
	And the new "Lab Order" record added for the patient "9E7A;66" in VPR format 
	When the client use the vx-sync write-back to save the record
	Then the responce is successful


@writeback_lab
Scenario: Client can write to the VistA and add Lab Order records - GENTAMICIN
	Given a client connect to VistA using "PANORAMA"
	When the client add new Lab Order record by using write-back for patient with DFN "66" ordering GENTAMICIN test
	Then the client receive the VistA write-back response
	And the new "Lab Order" record added for the patient "9E7A;66" in VPR format  
	When the client use the vx-sync write-back to save the record
	Then the responce is successful
		
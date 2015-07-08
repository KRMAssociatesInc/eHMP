@defect118
Feature: F142 (defect number DE118) Return results from Mock HDR and DAS	
	
@de118_sync_das_icn
Scenario: Client can request sync for a patient on mock VLER DAS with the ICN
	When a patient with pid "11016V630869" has been synced through Admin API  
	When the client requests the sync status for patient with pid "11016V630869"
	Then a successful response is returned
	And the data return for "Panorama" is "True"
	And the data return for "Kodak" is "True"
	And the data return for "DOD" is "True"
	And the data return for "DAS" is "True"
	
	
@de118_sync_hdr_icn
Scenario: Client can request sync for a patient on mock HDR just with the ICN
	When a patient with pid "11016V630869" has been synced through Admin API  
	When the client requests the sync status for patient with pid "11016V630869"
	Then a successful response is returned
	And the data return for "Panorama" is "True"
	And the data return for "Kodak" is "True"
	And the data return for "DOD" is "True"
	And the data return for "DAS" is "True"
	And the data return for "HDR" is "True"
	
	
@de118_sync_hdr_icn
Scenario: Client can request sync for a patient on mock HDR just with the ICN
	When a patient with pid "10110V004877" has been synced through Admin API  
	When the client requests the sync status for patient with pid "10110V004877"
	Then a successful response is returned
	And the data return for "Panorama" is "True"
	And the data return for "Kodak" is "True"
	And the data return for "DOD" is "True"
	And the data return for "DAS" is "True"
	And the data return for "HDR" is "True"

@vistA_host @F498 @US5878
Feature: F498 Return results from multiple VistAs

#This feature item syncs patients and returns results in VPR and FHIR formats using the patient ICN from all VistA sites, but using a PID from only the single VistA site for that site hash.


@vistA_host_vitals_vpr @vpr
Scenario: Client can request Vitals from multiple VistAs in VPR format with multiple PIDs
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through VX-Sync API for "9E7A;C877" site(s)
	When the client requests "vitals" for the patient "5000000341V359724" in VPR format
	Then the client receives 22 record(s) for site "9E7A"
	And the VPR results contain "panorama vitals"                                                      
      | field    | panorama_value	|
      | pid		 | 9E7A;100022		|
	  | typeName | TEMPERATURE      |
	  | result	 | 98.6	     		|
	  | units	 | F      			|
	
	Then the client receives 22 record(s) for site "C877"
	And the VPR results contain "kodak vitals" 
	  | field    | kodak_value		|
	  | pid		 | C877;100022		|
	  | typeName | TEMPERATURE      |
	  | result	 | 98.7	     		|
	  | units	 | F      			|                                                       


@vistA_host_labs_ch_vpr @vpr
Scenario: Client can request Lab (Chem/Hem) results from multiple VistAs in VPR format with the ICN 
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
	And a patient with pid "11016V630869" has been synced through VX-Sync API for "9E7A;C877" site(s)
	When the client requests "labs" for the patient "11016V630869" in VPR format
	Then the client receives 46 record(s) for site "9E7A"
	And the VPR results contain "panorama labs"
      | field    	 | panorama_value      |
      | pid		 	 | 9E7A;227			   |
      | result 	 	 | 17.5                |
      | resulted	 | 200503170336 	   |
      | typeName	 | PROTIME             |
  
    Then the client receives 46 record(s) for site "C877"
    And the VPR results contain "kodak labs"                                                       
      | field    	 | kodak_value         |
      | pid		 	 | C877;227			   |
      | result 		 | 15.9                |
      | resulted	 | 200503180437 	   |
      | typeName	 | PROTIME             |


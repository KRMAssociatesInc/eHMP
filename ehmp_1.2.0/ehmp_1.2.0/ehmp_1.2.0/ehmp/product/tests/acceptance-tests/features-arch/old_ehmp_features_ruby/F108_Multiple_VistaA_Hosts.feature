@vistA_host
Feature: F108 Return results from multiple VistAs

#This feature item syncs patients and returns results in VPR and FHIR formats using the patient ICN from all VistA sites, but using a PID from only the single VistA site for that site hash.


@f108_1_vistA_host_vitals_vpr @vpr
Scenario: Client can request Vitals from multiple VistAs in VPR format with multiple PIDs
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests vitals for the patient "5000000341V359724" in VPR format
	Then a successful response is returned
	And the client receives 16 VPR VistA result(s)
	And the VPR results contain "panorama vitals"                                                      
      | field    | panorama_value	|
	  | typeName | TEMPERATURE      |
	  | result	 | 98.6	     		|
	  | units	 | F      			|
	
  	Given a patient with pid "5000000341V359724" has been synced through Admin API	  
  	When the client requests vitals for the patient "5000000341V359724" in VPR format  
	Then a successful response is returned
	And the VPR results contain "kodak vitals" 
	  | field    | kodak_value		|
	  | typeName | TEMPERATURE      |
	  | result	 | 98.7	     		|
	  | units	 | F      			|                                                       


@f108_2_vistA_host_labs_ch_vpr @vpr
Scenario: Client can request Lab (Chem/Hem) results from multiple VistAs in VPR format with the ICN 
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
	Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then a successful response is returned
	And the client receives 92 VPR VistA result(s)
	And the VPR results contain "panorama labs"
      | field    	 | panorama_value      |
      | result 	 	 | 17.5                |
      | resulted	 | 200503170336 	   |
      | typeName	 | PROTIME             |
  
    And the VPR results contain "kodak labs"                                                       
      | field    	 | kodak_value         |
      | result 		 | 15.9                |
      | resulted	 | 200503180437 	   |
      | typeName	 | PROTIME             |
    
      
@f108_3_vistA_host_labs_mi_vpr @vpr
Scenario: Client can request Lab (MI) results from multiple VistAs in VPR format with the ICN
	Given a patient with "lab (MI) results" in multiple VistAs
	Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then a successful response is returned
	Then the client receives 92 VPR "VistA" result(s)
	And the client receives 46 VPR "kodak" result(s)
	And the VPR results contain "panorama labs"                                                    
      | field       | panorama_value      		 |
      | uid 		| CONTAINS urn:va:lab:9E7A 	 |
      | typeName	| AFB CULTURE & SMEAR 		 |
      | resulted	| 199510261516 		 		 |
      
    And the VPR results contain "kodak labs"                                                       
      | field       | kodak_value         		 |
      | uid 		| CONTAINS urn:va:lab:C877 	 |
      | typeName 	| AFB CULTURE & SMEAR 		 |
      | resulted	| 199510261516 		 		 |


@f108_4_vistA_host_vitals_fhir @fhir
Scenario: Client can request Vitals from a multiple VistAs in FHIR format with multiple PIDs
	Given a patient with "vitals" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests vitals for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	And the client receives 18 FHIR VistA result(s)
	And the FHIR results contain "panorama vitals"                                                      
      | field                   		| panorama_value    |
	  | content.name.coding.display 	| TEMPERATURE  	    |
	  | content.valueQuantity.value		| 98.6			    |
	  | content.valueQuantity.units		| F  			    |

   
  Given a patient with pid "5000000341V359724" has been synced through Admin API
  When the client requests vitals for the patient "5000000341V359724" in FHIR format  
  Then a successful response is returned
	And the FHIR results contain "kodak vitals"                                                       
    | field                   		| kodak_value      	|
	| content.name.coding.display 	| TEMPERATURE  	    |
    | content.valueQuantity.value     | 98.7              |
    |content.valueQuantity.units      | F                 |


@f108_5_vistA_host_labs_ch_fhir @fhir
Scenario: Client can request lab (Chem/Hem) from multiple VistAs in FHIR format with the ICN 
	Given a patient with "lab (Chem/Hem) results" in multiple VistAs
	Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	And the client receives 92 FHIR VistA result(s)
	And the FHIR results contain "panorama labs"
      | field                                 | panorama_value      |
      | content.contained.valueQuantity.value | 17.5                |
      | content.issued                        | 2005-03-17T03:36:00 |
      | content.contained.name.text           | PROTIME             |
  
    And the results contain lab "(Chem/Hem)" results                                                       
      | field                         	| kodak_value         |
      | content.contained.valueQuantity.value | 15.9                |
      | content.issued                        | 2005-03-18T04:37:00 |
      | content.contained.name.text           | PROTIME             |


@f108_6_vistA_host_labs_mi_fhir @fhir
Scenario: Client can request Lab (MI) results from multiple VistAs in FHIR format with the ICN
	Given a patient with "lab (MI) results" in multiple VistAs
	Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in FHIR format
	Then a successful response is returned
	Then the client receives 92 FHIR "VistA" result(s)
	And the client receives 46 FHIR "kodak" result(s)
	And the FHIR results contain "panorama labs"                                                    
      | field               	 | panorama_value      		 |
      | content.identifier.value | CONTAINS urn:va:lab:9E7A |
      | content.name.text		 | AFB CULTURE & SMEAR 		 |
      | content.issued	 		 | 1995-10-26T15:16:00 		 |
      
    And the FHIR results contain "kodak labs"                                                       
      | field               	 | kodak_value         		 |
      | content.identifier.value | CONTAINS urn:va:lab:C877 |
      | content.name.text		 | AFB CULTURE & SMEAR 		 |
      | content.issued 			 | 1995-10-26T15:16:00 		 |


@f108_7_vistA_host_sync_panorama
Scenario: Client can request sync for a patient on one VistA with a single PID (Panorama)
	Given a patient with pid "9E7A;100084" has been synced through Admin API  
	When the client requests the sync status for patient with pid "9E7A;100084"
	Then a successful response is returned
	And the data return for "Panorama" is "True"
	And the data return for "Kodak" is "False"
	
	
@f108_8_vistA_host_sync_Kodak
Scenario: Client can request sync for a patient on one VistA with a single PID (Kodak) 
	Given a patient with pid "C877;100084" has been synced through Admin API
	When the client requests the sync status for patient with pid "C877;100084"
	Then a successful response is returned
	And the data return for "Panorama" is "False"
	And the data return for "Kodak" is "True"
	
@f108_9_vistA_host_sync_icn
Scenario: Client can request sync for a patient for multiple VistAs with the ICN (Panorama and Kodak)	
	Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests the sync status for patient with pid "11016V630869"
	Then a successful response is returned
	And the data return for "Panorama" is "True"
	And the data return for "Kodak" is "True"
	

	

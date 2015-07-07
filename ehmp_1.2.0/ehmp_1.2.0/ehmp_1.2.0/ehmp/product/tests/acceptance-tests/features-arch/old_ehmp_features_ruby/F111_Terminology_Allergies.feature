@terminology @VPR 

Feature: F111  Normalization of Allergens Data

#This feature item adds standardized coding values and descriptions for Allergens. (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))  
	
      
@terminology_allergies @VPR @observed_historical 
Scenario Outline: An authorized user can access VA Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests allergies for the patient "5000000341V359724" in VPR format
	Then a successful response is returned  
    And the VPR results contain allergies terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #UMLS Code
	  | codes.code    	| <umls_code>       |
	  | codes.system 	| <umls_system>		|
	  | codes.display 	| <umls_display> 	|
	  #VA Code
	  | products.vuid	| <vuid_code>		|
	  | products.name	| <summary_value>	|
	  
      
    Examples: 
      |facility_code | umls_code | umls_display	| vuid_code 			| summary_value               | umls_system					   |
      | 500 		 | C0014806  | Erythromycin | urn:va:vuid:4017594	| ERYTHROMYCIN                | urn:oid:2.16.840.1.113883.6.86 |
      | 500 		 | C0457802  | Strawberries | urn:va:vuid:4637360	| STRAWBERRIES                | urn:oid:2.16.840.1.113883.6.86 |
	  

@terminology_allergies @VPR @observed_historical 
Scenario Outline: An authorized user can access DoD Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	Given a patient with pid "10110V004877" has been synced through Admin API
	When the client requests allergies for the patient "10110V004877" in VPR format
	Then a successful response is returned  
    And the VPR results contain allergies terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #UMLS Code
	  | codes.code    	| <umls_code>       |
	  | codes.system 	| <umls_system>		|
	  | codes.display 	| <umls_display> 	|
	  #DOD Code
      | codes.system  	| <dod_system> 		|
      | codes.code    	| <dod_ien_code> 	|
      
    Examples: 
      |facility_code | umls_code | umls_display	| vuid_code 			| dod_ien_code  | dod_system 		| summary_value               | umls_system					   |
 	  | DOD 		 | C0014310  | Enoxacin     | EMPTY					| 61021     	| DOD_ALLERGY_IEN 	| ENOXACIN (ENOXACIN)         | urn:oid:2.16.840.1.113883.6.86 |
	  | DOD 		 | C0007537  | Cefaclor     | EMPTY					| 1140	    	| DOD_ALLERGY_IEN 	| CEFACLOR (CEFACLOR)         | urn:oid:2.16.840.1.113883.6.86 |
	  | DOD 		 | EMPTY  	 | EMPTY     	| EMPTY					| 14236002	 	| DOD_ALLERGY_IEN 	| BEE POLLEN (BEE POLLEN)     | EMPTY						   |
 	  | DOD 		 | EMPTY  	 | EMPTY     	| EMPTY					| 13746024	 	| DOD_ALLERGY_IEN 	| ALFALFA				      | EMPTY						   |
        

@terminology_allergies @FHIR @observed_historical
Scenario Outline: An authorized user can access VA Allergens Data and see standardized UMLS CUI values when defined through FHIR API
	Given a patient with "allergies" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests allergies for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned  
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         	| value       		|
	  #UMLS Code
	  | content.contained.type.coding.code    	| <umls_code>       |
	  | content.contained.type.coding.system 	| <umls_system>		|
	  | content.contained.type.coding.display 	| <umls_display> 	|
	  #VA Code
	  | content.contained.type.coding.code		| <vuid_code>		|
	  | content.contained.type.coding.system 	| <va_system>		|
	  | content.contained.type.coding.display	| <summary_value>	|
      
#  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
      
    Examples: 
      |facility_code | umls_code | umls_display	| vuid_code 			| summary_value | umls_system					  | va_system 						 |
      | 500 		 | C0014806  | Erythromycin | urn:va:vuid:4017594	| ERYTHROMYCIN   | urn:oid:2.16.840.1.113883.6.86 | urn:oid:2.16.840.1.113883.6.233  |
      | 500 		 | C0457802  | Strawberries | urn:va:vuid:4637360	| STRAWBERRIES   | urn:oid:2.16.840.1.113883.6.86 | urn:oid:2.16.840.1.113883.6.233  |
	 
    
@terminology_allergies @FHIR @observed_historical 
Scenario Outline: An authorized user can access DoD Allergens Data and see standardized UMLS CUI values when defined through FHIR API
	Given a patient with "allergies" in multiple VistAs
	Given a patient with pid "10110V004877" has been synced through Admin API
	When the client requests allergies for the patient "10110V004877" in FHIR format
	Then a successful response is returned  
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         	| value       		|
	  #UMLS Code
	  | content.contained.type.coding.code    	| <umls_code>       |
	  | content.contained.type.coding.system 	| <umls_system>		|
	  | content.contained.type.coding.display 	| <umls_display> 	|
	  #DOD Code
	  | content.contained.type.coding.code    	| <dod_ien_code> 	|
      | content.contained.type.coding.system  	| <dod_system> 		|
      
      
    Examples: 
      |facility_code | umls_code | umls_display	| dod_ien_code  | dod_system 		| umls_system					  	|
 	  | DOD 		 | C0014310  | Enoxacin     | 61021     	| DOD_ALLERGY_IEN 	| urn:oid:2.16.840.1.113883.6.86 	|
	  | DOD 		 | C0007537  | Cefaclor     | 1140	    	| DOD_ALLERGY_IEN 	| urn:oid:2.16.840.1.113883.6.86 	|
	  | DOD 		 | EMPTY  	 | EMPTY     	| 14236002	 	| DOD_ALLERGY_IEN 	| EMPTY						  		|
 	  | DOD 		 | EMPTY  	 | EMPTY     	| 13746024	 	| DOD_ALLERGY_IEN 	| EMPTY						  		|

    
@terminology_allergies @VPR @historical 
Scenario Outline: An authorized user can access VA and DoD Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the client requests allergies for the patient "5000000217V519385" in VPR format
	Then a successful response is returned  
    And the VPR results contain allergies terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #UMLS Code
	  | codes.code    	| <umls_code>       |
	  | codes.system 	| <umls_system>		|
	  | codes.display 	| <umls_display> 	|
	  #VA Code
	  | products.vuid	| <vuid_code>		|
	  | products.name	| <summary_value>	|
	  #DOD Code
      | codes.system  	| <dod_system> 		|
      | codes.code    	| <dod_ien_code> 	|
      
    Examples: 
      |facility_code | umls_code | umls_display	| vuid_code 			| dod_ien_code  | dod_system 		|  summary_value              | umls_system					   |
      | 500 		 | C0008299  | Chocolate	| urn:va:vuid:4636681	| EMPTY     	| EMPTY 	 		| CHOCOLATE                   | urn:oid:2.16.840.1.113883.6.86 |
      | DOD 		 | EMPTY  	 | EMPTY     	| EMPTY					| 29000		 	| DOD_ALLERGY_IEN 	| Iodine Containing Agents	  | EMPTY						   |
	

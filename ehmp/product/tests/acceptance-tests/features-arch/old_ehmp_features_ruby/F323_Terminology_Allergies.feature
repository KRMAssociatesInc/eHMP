@terminology @VPR @vx_sync 

Feature: F323  Normalization of Allergens Data

#This feature item adds standardized coding values and descriptions for Allergens. (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))  
	
      
@terminology_allergies @VPR @observed_historical 
Scenario: An authorized user can access VA Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through VX-Sync API for "9E7A" site(s)
	When the client requests "allergies" for the patient "5000000341V359724" in VPR format 
    Then the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"    
	  | field         | value       				   |
	  | facilityCode  | 500 						   |
	  | summary       | ERYTHROMYCIN				   |
	  #UMLS Code
	  | codes.code    | C0014806       				   |
	  | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
	  | codes.display | Erythromycin 				   |
	  #VA Code
	  | products.vuid | urn:va:vuid:4017594			   |
	  | products.name | ERYTHROMYCIN				   |
	
	And the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"    
	  | field         | value                          |
      | facilityCode  | 500                            |
      | summary       | STRAWBERRIES                   |
	  #UMLS Code
	  | codes.code    | C0457802                       |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.display | Strawberries                   |
	  #VA Code
	  | products.vuid | urn:va:vuid:4637360            |
      | products.name | STRAWBERRIES                   |
	  

@terminology_allergies @VPR @observed_historical 
Scenario: An authorized user can access DoD Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through VX-Sync API for "DoD" site(s)
	When the client requests "allergies" for the patient "10110V004877" in VPR format 
    Then the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field         | value                          |
      | facilityCode  | DOD                            |
      | summary       | ENOXACIN (ENOXACIN)            |
      #UMLS Code
      | codes.code    | C0014310                       |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.display | Enoxacin                       |
      #DOD Code
      | codes.system  | DOD_ALLERGY_IEN                |
      | codes.code    | 61021                          |
    And the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field         | value                          |
      | facilityCode  | DOD                            |
      | summary       | CEFACLOR (CEFACLOR)            |
      #UMLS Code
      | codes.code    | C0007537                       |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.display | Cefaclor                       |
      #DOD Code
      | codes.system  | DOD_ALLERGY_IEN                |
      | codes.code    | 1140                           |
    And the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field         | value                   |
      | facilityCode  | DOD                     |
      | summary       | BEE POLLEN (BEE POLLEN) |
      #UMLS Code
      | codes.code    | EMPTY                   |
      | codes.system  | EMPTY                   |
      | codes.display | EMPTY                   |
      #DOD Code
      | codes.system  | DOD_ALLERGY_IEN         |
      | codes.code    | 14236002                |
    And the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field         | value           |
      | facilityCode  | DOD             |
      | summary       | ALFALFA         |
      #UMLS Code
      | codes.code    | EMPTY           |
      | codes.system  | EMPTY           |
      | codes.display | EMPTY           |
      #DOD Code
      | codes.system  | DOD_ALLERGY_IEN |
      | codes.code    | 13746024        |
         
	  

@terminology_allergies1 @VPR @historical 
Scenario: An authorized user can access VA and DoD Allergens Data and see standardized UMLS CUI values when defined through VPR API
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "5000000217V519385" has been synced through VX-Sync API for "9E7A;DoD" site(s)
	When the client requests "allergies" for the patient "5000000217V519385" in VPR format 
    Then the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field         | value                          |
      | facilityCode  | 500                            |
      | summary       | CHOCOLATE                      |
      #UMLS Code
      | codes.code    | C0008299                       |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.display | Chocolate                      |
      #VA Code
      | products.vuid | urn:va:vuid:4636681            |
      | products.name | CHOCOLATE                      |
      #DOD Code
      | codes.system  | EMPTY                          |
      | codes.code    | EMPTY                          |
	Then the VPR results contain "allergies" terminology from "(VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
	  | field         | value                    |
      | facilityCode  | DOD                      |
      | summary       | Iodine Containing Agents |
      #UMLS Code
      | codes.code    | EMPTY                    |
      | codes.system  | EMPTY                    |
      | codes.display | EMPTY                    |
      #VA Code
      | products.vuid | EMPTY                    |
      | products.name | Iodine Containing Agents |
      #DOD Code
      | codes.system  | DOD_ALLERGY_IEN          |
      | codes.code    | 29000                    |
	

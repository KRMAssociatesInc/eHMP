@terminology

Feature: F323  Normalization of Allergens Data

#This feature item adds standardized coding values and descriptions for Allergens. (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))  
	

@terminology_allergies @FHIR @observed_historical
Scenario: An authorized user can access VA Allergens Data and see standardized UMLS CUI values when defined through FHIR API
 	Given a patient with "allergies" in multiple VistAs
    And a patient with pid "5000000341V359724" has been synced through the RDK API
    When the client requests allergies for the patient "5000000341V359724" in FHIR format
    Then a successful response is returned 
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value                           |
      #UMLS Code
      | content.contained.type.coding.code    | C0014806                        |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86  |
      | content.contained.type.coding.display | Erythromycin                    |
      #VA Code
      | content.contained.type.coding.code    | urn:va:vuid:4017594             |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.type.coding.display | ERYTHROMYCIN                    |
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value                           |
      #UMLS Code
      | content.contained.type.coding.code    | C0457802                        |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86  |
      | content.contained.type.coding.display | Strawberries                    |
      #VA Code
      | content.contained.type.coding.code    | urn:va:vuid:4637360             |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.type.coding.display | STRAWBERRIES                    |

	  
#  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
      
 
    
@terminology_allergies @FHIR @observed_historical 
Scenario: An authorized user can access DoD Allergens Data and see standardized UMLS CUI values when defined through FHIR API
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through the RDK API
    When the client requests allergies for the patient "10110V004877" in FHIR format
	Then a successful response is returned  
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value                          |
      #DOD Code
      | content.contained.type.coding.code    | 61021                          |
      | content.contained.type.coding.system  | DOD_ALLERGY_IEN                |
      #UMLS Code
      | content.contained.type.coding.code    | C0014310                       |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86 |
      | content.contained.type.coding.display | Enoxacin                       |

    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value                          |
      #DOD Code
      | content.contained.type.coding.code    | 1140                           |
      | content.contained.type.coding.system  | DOD_ALLERGY_IEN                |
      #UMLS Code
      | content.contained.type.coding.code    | C0007537                       |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86 |
      | content.contained.type.coding.display | Cefaclor                       |
      
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value           |
      #DOD Code
      | content.contained.type.coding.code    | 14236002        |
      | content.contained.type.coding.system  | DOD_ALLERGY_IEN |
      #UMLS Code
      | content.contained.type.coding.code    | EMPTY           |
      | content.contained.type.coding.system  | EMPTY           |
      | content.contained.type.coding.display | EMPTY           |
      
    And the FHIR results contain "allergies terminology from (VUID to UMLS CUI (VA), CHCS IEN to UMLS CUI (DoD))"
      | field                                 | value           |
      #DOD Code
      | content.contained.type.coding.code    | 13746024        |
      | content.contained.type.coding.system  | DOD_ALLERGY_IEN |
      #UMLS Code
      | content.contained.type.coding.code    | EMPTY           |
      | content.contained.type.coding.system  | EMPTY           |
      | content.contained.type.coding.display | EMPTY           |
      
      


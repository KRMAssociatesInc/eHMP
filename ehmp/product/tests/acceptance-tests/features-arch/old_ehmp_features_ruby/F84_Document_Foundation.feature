Feature: F84 Document Enrichment (Terminology) Foundation

#This feature represents the ability to "lookup" and add terminology data to data type data that is cached in VistA Exchange. The terminologies that VistA Exchange will support include those that are supported by JLV and HMP and vary by data type. This feature is limited to the Allergy data type. 

	

@US877 @US877_allergies @US877_historical 
Scenario: Allergy terminology lookup is implemented for a patient with historical data through FHIR API
	Given a patient with "allergies" in multiple VistAs
  Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the client requests allergies for that patient "5000000217V519385"
	Then a successful response is returned
	And the FHIR results contain allergy
      | allergies_field             | allergies_values |
      | content.contained.type.text | CHOCOLATE        |
    And the results contain allergy terminology from "US Department of Veterans Affairs"
      | allergies_field                       | allergies_values                |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.type.coding.code    | urn:va:vuid:4636681             |
      | content.contained.type.coding.display | CHOCOLATE                       |
    And the results contain allergy terminology from "Unified Medical Language System"
      | allergies_field                       | allergies_values               |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86 |
      | content.contained.type.coding.code    | C0008299                       |
      | content.contained.type.coding.display | Chocolate                      |
    

@US877 @US877_allergies @US877_observed
Scenario: Allergy terminology lookup is implemented for a patient with observed data through FHIR API
	Given a patient with "allergies" in multiple VistAs
  Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests allergies for that patient "5000000341V359724"
	Then a successful response is returned
	And the FHIR results contain allergy
      | allergies_field             | allergies_values |
      | content.contained.type.text    | ERYTHROMYCIN     |
      | content.contained.resourceType | Substance        |
    And the results contain allergy terminology from "US Department of Veterans Affairs"
      | allergies_field                       | allergies_values                |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
      | content.contained.type.coding.code    | urn:va:vuid:4017594             |
      | content.contained.type.coding.display | ERYTHROMYCIN                    |
    And the results contain allergy terminology from "Unified Medical Language System"
      | allergies_field                       | allergies_values               |
      | content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.86 |
      | content.contained.type.coding.code    | C0014806                       |
      | content.contained.type.coding.display | Erythromycin                   |
      
@US877 @US877_allergies @US877_observed @VPR
Scenario: Allergy terminology lookup is implemented for a patient with observed data through VPR
	Given a patient with "allergies" in multiple VistAs
  Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests allergies for the patient "5000000341V359724" in VPR format
	Then a successful response is returned
	And the VPR results contain  
      | allergies_field             | allergies_values |
      | summary					    | ERYTHROMYCIN     |
    And the VPR results contain allergy terminology from "US Department of Veterans Affairs"
      | allergies_field                       | allergies_values                |
      | products.vuid					      | urn:va:vuid:4017594             |
      | products.name                         | ERYTHROMYCIN                    |
    And the VPR results contain allergy terminology from "Unified Medical Language System"
      | allergies_field                       | allergies_values               |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.code    | C0014806                       |
      | codes.display | Erythromycin                   |
      
@US877 @US877_allergies @US877_historical @VPR
Scenario: Allergy terminology lookup is implemented for a patient with historical data through VPR
	Given a patient with "allergies" in multiple VistAs
  Given a patient with pid "5000000217V519385" has been synced through Admin API
	When the client requests allergies for the patient "5000000217V519385" in VPR format
	Then a successful response is returned
	And the VPR results contain
      | allergies_field             | allergies_values |
      | summary                     | CHOCOLATE        |
    And the VPR results contain allergy terminology from "US Department of Veterans Affairs"
      | allergies_field                       | allergies_values                |
      | products.vuid    | urn:va:vuid:4636681             |
      | products.name    | CHOCOLATE                       |
    And the VPR results contain allergy terminology from "Unified Medical Language System"
      | allergies_field                       | allergies_values               |
      | codes.system  | urn:oid:2.16.840.1.113883.6.86 |
      | codes.code    | C0008299                       |
      | codes.display | Chocolate                      |


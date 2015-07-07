@terminology 
Feature: F323  Normalization of Outpatient Medications Data

#This feature item adds standardized coding values and descriptions for Outpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD)) 


@terminology_out_meds @FHIR
Scenario: An authorized user can access VA Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through the RDK API
  When the client requests out-patient medication results for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                   | value                                 |
      #VA codes
      | content.contained.extension.valueString | urn:va:vuid:4004608                   |
      #RXNORM codes
      | content.contained.code.coding.code      | 866514                                |
      | content.contained.code.coding.system    | urn:oid:2.16.840.1.113883.6.88        |
      | content.contained.code.coding.display   | Metoprolol Tartrate 50 MG Oral Tablet |
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                   | value                            |
      #VA codes
      | content.contained.extension.valueString | urn:va:vuid:4013990              |
      #RXNORM codes
      | content.contained.code.coding.code      | 855332                           |
      | content.contained.code.coding.system    | urn:oid:2.16.840.1.113883.6.88   |
      | content.contained.code.coding.display   | Warfarin Sodium 5 MG Oral Tablet |

  	  
              
@terminology_out_meds @FHIR
Scenario: An authorized user can access DoD Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through the RDK API
  When the client requests out-patient medication results for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                 | value                                       |
      #DOD codes
      | content.contained.code.coding.code    | 3000257828                                  |
      | content.contained.code.coding.system  | DOD_NCID                                    |
      #RXNORM codes
      | content.contained.code.coding.code    | 905225                                      |
      | content.contained.code.coding.system  | urn:oid:2.16.840.1.113883.6.88              |
      | content.contained.code.coding.display | Hydralazine Hydrochloride 25 MG Oral Tablet |
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                 | value    |
      #DOD codes
      | content.contained.code.coding.code    | 15518112 |
      | content.contained.code.coding.system  | DOD_NCID |
      #RXNORM codes
      | content.contained.code.coding.code    | EMPTY    |
      | content.contained.code.coding.system  | EMPTY    |
      | content.contained.code.coding.display | EMPTY    |
  And the FHIR results contain "Medication from RxNorm codes"
      | field                                 | value    |
      #DOD codes
      | content.contained.code.coding.code    | 15165601 |
      | content.contained.code.coding.system  | DOD_NCID |
      #RXNORM codes
      | content.contained.code.coding.code    | EMPTY    |
      | content.contained.code.coding.system  | EMPTY    |
      | content.contained.code.coding.display | EMPTY    |

      
#  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
   
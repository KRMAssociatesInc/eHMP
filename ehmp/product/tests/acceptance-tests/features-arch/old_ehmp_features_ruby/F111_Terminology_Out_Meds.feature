@terminology @VPR 
Feature: F111  Normalization of Outpatient Medications Data

#This feature item adds standardized coding values and descriptions for Outpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD)) 

Background: Make sure the required patient is synced
  Given a patient with pid "10110V004877" has been synced through Admin API
  
@terminology_out_meds @VPR
Scenario Outline: An authorized user can access VA Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  When the client requests medications for the patient "10110V004877" in VPR format
  Then a successful response is returned  
  And the VPR results contain Medication from "RxNorm codes"
      | field                 | value                   |
      | facilityCode          | <facility_code>         |
      | summary               | <summary_value>         |
      #VA codes
      | products.suppliedCode | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | codes.code            | <rxnorm_code>           |
      | codes.system          | <codes_system>          |
      | codes.display         | <rxnorm_text>           |
	   
    Examples: 
      | facility_code | vuid_code | rxnorm_code | rxnorm_text                           | codes_system                   | summary_value                         |
      | 500           | 4004608   | 866514      | Metoprolol Tartrate 50 MG Oral Tablet | urn:oid:2.16.840.1.113883.6.88 | CONTAINS METOPROLOL TARTRATE 50MG TAB |
      | 500           | 4013990   | 855332      | Warfarin Sodium 5 MG Oral Tablet      | urn:oid:2.16.840.1.113883.6.88 | CONTAINS WARFARIN NA 5MG TAB          |
            
                 
@terminology_out_meds @VPR
Scenario Outline: An authorized user can access DoD Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  When the client requests medications for the patient "10110V004877" in VPR format
  Then a successful response is returned  
  And the VPR results contain Medication from "RxNorm codes"
      | field         | value           |
      | facilityCode  | <facility_code> |
      | summary       | <summary_value> |
      #DOD codes
      | codes.code    | <dod_ncid_code> |
      | codes.system  | <dod_system>    |
      #RXNORM codes
      | codes.code    | <rxnorm_code>   |
      | codes.system  | <codes_system>  |
      | codes.display | <rxnorm_text>   |
     
    Examples: 
      | facility_code | dod_ncid_code | dod_system | rxnorm_code | rxnorm_text                                 | codes_system                   | summary_value |
      | DOD           | 3000257828    | DOD_NCID   | 905225      | Hydralazine Hydrochloride 25 MG Oral Tablet | urn:oid:2.16.840.1.113883.6.88 | IS_SET        |
      | DOD           | 15518112      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY                          | IS_SET        |
      | DOD           | 15165601      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY 							| IS_SET        |    
      

@terminology_out_meds @FHIR
Scenario Outline: An authorized user can access VA Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  When the client requests out-patient medication results for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
  	  | field                                   | value                   |
      #VA codes
      | content.contained.extension.valueString | urn:va:vuid:<vuid_code> |
      #RXNORM codes
      | content.contained.code.coding.code      | <rxnorm_code>           |
      | content.contained.code.coding.system    | <codes_system>          |
      | content.contained.code.coding.display   | <rxnorm_text>           |      
	   
    Examples: 
      | facility_code | vuid_code | rxnorm_code | rxnorm_text                           | codes_system                   | summary_value                         |
      | 500           | 4004608   | 866514      | Metoprolol Tartrate 50 MG Oral Tablet | urn:oid:2.16.840.1.113883.6.88 | CONTAINS METOPROLOL TARTRATE 50MG TAB |
      | 500           | 4013990   | 855332      | Warfarin Sodium 5 MG Oral Tablet      | urn:oid:2.16.840.1.113883.6.88 | CONTAINS WARFARIN NA 5MG TAB          |
 
              
@terminology_out_meds @FHIR
Scenario Outline: An authorized user can access DoD Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  When the client requests out-patient medication results for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
  And the FHIR results contain "Medication from RxNorm codes"
      | field         						  | value           |
      #DOD codes
      | content.contained.code.coding.code    | <dod_ncid_code> |
      | content.contained.code.coding.system  | <dod_system>    |
      #RXNORM codes
      | content.contained.code.coding.code    | <rxnorm_code>   |
      | content.contained.code.coding.system  | <codes_system>  |
      | content.contained.code.coding.display | <rxnorm_text>   |
     
    Examples: 
      | facility_code | dod_ncid_code | dod_system | rxnorm_code | rxnorm_text                                 | codes_system                   | 
      | DOD           | 3000257828    | DOD_NCID   | 905225      | Hydralazine Hydrochloride 25 MG Oral Tablet | urn:oid:2.16.840.1.113883.6.88 |
      | DOD           | 15518112      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY                          |
      | DOD           | 15165601      | DOD_NCID   | EMPTY       | EMPTY                                       | EMPTY 							|    
      
#  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
   
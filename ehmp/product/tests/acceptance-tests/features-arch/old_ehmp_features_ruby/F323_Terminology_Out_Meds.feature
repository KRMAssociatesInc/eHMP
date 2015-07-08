@terminology @VPR @vx_sync 
Feature: F323  Normalization of Outpatient Medications Data

#This feature item adds standardized coding values and descriptions for Outpatient Medications. (VUID to RxNORM (VA), NCID to RxNORM (DoD)) 


@terminology_out_meds @VPR
Scenario: An authorized user can access VA Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through VX-Sync API for "9E7A" site(s)
  When the client requests "meds" for the patient "10110V004877" in VPR format 
  Then the VPR results contain "medications" terminology from "RxNorm codes"
      | field                 | value                                 |
      | facilityCode          | 500                                   |
      | summary               | CONTAINS METOPROLOL TARTRATE 50MG TAB |
      #VA codes
      | products.suppliedCode | urn:va:vuid:4004608                   |
      #RXNORM codes
      | codes.code            | 866514                                |
      | codes.system          | urn:oid:2.16.840.1.113883.6.88        |
      | codes.display         | Metoprolol Tartrate 50 MG Oral Tablet |
  And the VPR results contain "medications" terminology from "RxNorm codes"
      | field                 | value                            |
      | facilityCode          | 500                              |
      | summary               | CONTAINS WARFARIN NA 5MG TAB     |
      #VA codes
      | products.suppliedCode | urn:va:vuid:4013990              |
      #RXNORM codes
      | codes.code            | 855332                           |
      | codes.system          | urn:oid:2.16.840.1.113883.6.88   |
      | codes.display         | Warfarin Sodium 5 MG Oral Tablet |
      
                 
@terminology_out_meds @VPR
Scenario: An authorized user can access DoD Outpatient Medications and see standardized RxNorm values when defined
  Given a patient with "Medications" in multiple VistAs
  And a patient with pid "10110V004877" has been synced through VX-Sync API for "9E7A" site(s)
  When the client requests "meds" for the patient "10110V004877" in VPR format 
  Then the VPR results contain "medications" terminology from "RxNorm codes"
  	  | field         | value                                       |
      | facilityCode  | DOD                                         |
      | summary       | IS_SET                                      |
      #DOD codes
      | codes.code    | 3000257828                                  |
      | codes.system  | DOD_NCID                                    |
      #RXNORM codes
      | codes.code    | 905225                                      |
      | codes.system  | urn:oid:2.16.840.1.113883.6.88              |
      | codes.display | Hydralazine Hydrochloride 25 MG Oral Tablet |
  Then the VPR results contain "medications" terminology from "RxNorm codes"
      | field         | value    |
      | facilityCode  | DOD      |
      | summary       | IS_SET   |
      #DOD codes
      | codes.code    | 15518112 |
      | codes.system  | DOD_NCID |
      #RXNORM codes
      | codes.code    | EMPTY    |
      | codes.system  | EMPTY    |
      | codes.display | EMPTY    |
  Then the VPR results contain "medications" terminology from "RxNorm codes"
      | field         | value    |
      | facilityCode  | DOD      |
      | summary       | IS_SET   |
      #DOD codes
      | codes.code    | 15165601 |
      | codes.system  | DOD_NCID |
      #RXNORM codes
      | codes.code    | EMPTY    |
      | codes.system  | EMPTY    |
      | codes.display | EMPTY    |
  

#  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
   
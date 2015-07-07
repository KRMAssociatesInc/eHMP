@DE53
Feature: F142 (defect number DE53) Fix PID and DFN in sync status for secondary site data

 
@de53_1_Patient_with_ICN
Scenario: Client can request pid and dfn in sync status for secondary sites data in VPR format
  When a patient with pid "10108V420871" has been synced through Admin API  
  When the client requests the sync status for patient with pid "10108V420871"
  Then a successful response is returned
  And the data return for "Panorama" is "True"
  And the data return for "Kodak" is "True"
  And the data return for "DOD" is "True"
  And the data return for "DAS" is "True"
  And the data return for "HDR" is "True"    
  And the sync contains 
      | field                                     | value                                         |
      | syncStatusByVistaSystemId.DOD.patientUid  | urn:va:patient:DOD:0000000003:0000000003      |
      | syncStatusByVistaSystemId.DOD.dfn         | 0000000003                                    |
      | syncStatusByVistaSystemId.HDR.patientUid | urn:va:patient:HDR:10108V420871:10108V420871 |
      | syncStatusByVistaSystemId.HDR.dfn        | 10108V420871                                  |
      | syncStatusByVistaSystemId.DAS.patientUid  | urn:va:patient:DAS:10108V420871:10108V420871  |
      | syncStatusByVistaSystemId.DAS.dfn         | 10108V420871                                  |
      
           
@de53_4_domaindata_dod
Scenario: Client can request pid in domain data for secondary sites data in VPR format
Given a patient with "pid and dfn" in multiple VistAs
Given a patient with pid "5000000217V519385" has been synced through Admin API
When the client requests pid for the patient "5000000217V519385" in VPR format
Then a successful response is returned
And the VPR results contain "pid"                                                      
      | field        | value                                  |
      | uid          | urn:va:vital:DOD:0000000001:1000000118 |
      | summary      | TEMPERATURE 96 F                       |
      | pid          | DOD;0000000001                         |
      | kind         | Vital Sign                             |
      | facilityCode | DOD                                    |

     
@de53_5_domaindata_das
Scenario: Client can request pid in domain data for secondary sites data in VPR format
Given a patient with "pid and dfn" in multiple VistAs
Given a patient with pid "5000000217V519385" has been synced through Admin API
When the client requests pid for the patient "5000000217V519385" in VPR format
Then a successful response is returned
And the VPR results contain "pid"                                                      
      | field        | value                                |
      | uid          | urn:va:vital:DAS:5000000217V519385:5000000217-4 |
      | summary      | Height 177 cm                        |
      | pid          | DAS;5000000217V519385                |
      | kind         | Vital Sign                           |
      | facilityCode | PGD                                  |
      | facilityName | Patient Generated Data               |
       
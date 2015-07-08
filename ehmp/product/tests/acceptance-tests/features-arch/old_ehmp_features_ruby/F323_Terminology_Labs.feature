@terminology @VPR @vx_sync 
Feature: F323  Normalization of Labs (Chem/Hem) Data

#This feature item adds standardized coding values and descriptions for Labs (Chem/Hem). (VUID to LOINC (VA data), NCID to LOINC (DoD data))

      
@terminology_labs_ch @VPR
Scenario: An authorized user can access VA Laboratory Chem and see standardized LOINC values when defined through VPR API
	Given a patient with "labs" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through VX-Sync API for "9E7A" site(s)
  	When the client requests "labs" for the patient "5000000341V359724" in VPR format 
  	Then the VPR results contain "labs" terminology from "DOD Ncid and LOINC"
  	  | field         | value                                                             |
      | facilityCode  | 500                                                               |
      | summary       | HEPATITIS C ANTIBODY (BLOOD) P                                    |
      #loinc code
      | codes.code    | 13955-0                                                           |
      | codes.system  | http://loinc.org                                                  |
      | codes.display | Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay |
      #inc code
      | typeCode      | urn:lnc:13955-0                                                   |
  	Then the VPR results contain "labs" terminology from "DOD Ncid and LOINC"
  	  | field         | value                                                             |
      | facilityCode  | 500                                                               |
      | summary       | HEPATITIS C ANTIBODY (BLOOD) N                                    |
      #loinc code
      | codes.code    | 13955-0                                                           |
      | codes.system  | http://loinc.org                                                  |
      | codes.display | Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay |
      #inc code
      | typeCode      | urn:lnc:13955-0                                                   |
      
      
@terminology_labs_ch @VPR 
Scenario: An authorized user can access DoD Laboratory Chem and see standardized LOINC values when defined through VPR API
	Given a patient with "labs" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through VX-Sync API for "DoD" site(s)
  	When the client requests "labs" for the patient "10110V004877" in VPR format 
  	Then the VPR results contain "labs" terminology from "DOD Ncid and LOINC"
  	  | field         | value                                                                        |
      | facilityCode  | DOD                                                                          |
      | summary       | Platelet Mean Volume, Blood Quantitative Automated (BLOOD) 55.0<em>H</em> fL |
      #loinc code
      | codes.code    | 32623-1                                                                      |
      | codes.system  | http://loinc.org                                                             |
      | codes.display | Platelet mean volume [Entitic volume] in Blood by Automated count            |
      #DOD NCID code
      | codes.system  | DOD_NCID                                                                     |
      | codes.code    | 21376                                                                        |
  	Then the VPR results contain "labs" terminology from "DOD Ncid and LOINC"
  	  | field         | value                                                   |
      | facilityCode  | DOD                                                     |
      | summary       | CONTAINS Granulocytes/100 Leukocytes                    |
      #loinc code
      | codes.code    | 19023-1                                                 |
      | codes.system  | http://loinc.org                                        |
      | codes.display | Granulocytes/100 leukocytes in Blood by Automated count |
      #DOD NCID code
      | codes.system  | DOD_NCID                                                |
      | codes.code    | 21061                                                   |
  	Then the VPR results contain "labs" terminology from "DOD Ncid and LOINC"
  	  | field         | value                                                                                   |
      | facilityCode  | DOD                                                                                     |
      | summary       | Lymphocytes/100 Leukocytes, Blood Quantitative Automated Count (BLOOD) 52.0<em>H</em> % |
      #loinc code
      | codes.code    | 736-9                                                                                   |
      | codes.system  | http://loinc.org                                                                        |
      | codes.display | Lymphocytes/100 leukocytes in Blood by Automated count                                  |
      #DOD NCID code
      | codes.system  | DOD_NCID                                                                                |
      | codes.code    | 4736                                                                                    |
  	

#TestNote: 
#	* We could not test Lab MI in VPR format because it's not available through VPR.       
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
      

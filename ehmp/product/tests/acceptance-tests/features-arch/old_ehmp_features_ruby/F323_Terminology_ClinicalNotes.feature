@terminology @VPR @vx_sync 
Feature: F323  Normalization of Clinical Notes Document Data

#This feature item adds standardized coding values and descriptions for Clinical Notes Documents. (VUID to LOINC (VA data), NCID to LOINC (DoD data))

  
  @terminology_clinical_notes1 @VPR
  Scenario: An authorized user can access DoD Notes and see standardized LOINC values when defined
    Given a patient with "Notes" in multiple VistAs
    And a patient with pid "10108V420871" has been synced through VX-Sync API for "DoD" site(s)
	When the client requests "document" for the patient "10108V420871" in VPR format 
    Then the VPR results contain "document" terminology from "LOINC codes"
      | field         | value           					|
      | facilityCode  | DOD 								|
      | summary       | IS_SET 								|
      #DOD codes
      | codes.code    | 15149135 							|
      | codes.system  | DOD_NCID    						|
      #LOINC codes
      | codes.code    | 28570-0   							|
      | codes.system  | http://loinc.org  					|
      | codes.display | Provider-unspecified Procedure note |
    And the VPR results contain "document" terminology from "LOINC codes"
      | field         | value           			|
      | facilityCode  | DOD 						|
      | summary       | IS_SET 						|
      #DOD codes
      | codes.code    | 15148780 					|
      | codes.system  | DOD_NCID    				|
      #LOINC codes
      | codes.code    | 18752-6   					|
      | codes.system  | http://loinc.org  			|
      | codes.display | Exercise stress test study  |
    And the VPR results contain "document" terminology from "LOINC codes"
      | field         | value           	|
      | facilityCode  | DOD 				|
      | summary       | IS_SET 				|
      #DOD codes
      | codes.code    | 15149947 			|
      | codes.system  | DOD_NCID    		|
      #LOINC codes
      | codes.code    | 11502-2   			|
      | codes.system  | http://loinc.org  	|
      | codes.display | Laboratory report   |
      

  
#TestNote:
#  * We could not test notes/documents in FHIR format because it's not available through FHIR.
#  * VUID->LOINC mapping table is quite limited and test patient with a note vuid that could be mapped to VUID->LOINC mapping table could not be found.
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling

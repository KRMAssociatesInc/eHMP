@terminology @VPR @vx_sync 

Feature: F323  Normalization of Immunizations Data

#This feature item adds standardized coding values and descriptions for Immunizations. (CPT to CVX (VA))


  @terminology_immunizations @VPR
  Scenario: An authorized user can access VA Immunization Data and see standardized CVX values when defined through VPR API
    Given a patient with "immunizations" in multiple VistAs
    And a patient with pid "10108V420871" has been synced through VX-Sync API for "9E7A" site(s)
	When the client requests "immunizations" for the patient "10108V420871" in VPR format  
    Then the VPR results contain "immunizations" terminology from "(CPT to CVX (VA))"
      | field         	| value       										|
      | facilityCode	| 561 												|
      | summary       	| PNEUMOCOCCAL 										|
      #CVX Code
      | codes.code    	| 33       											|
      | codes.system 	| urn:oid:2.16.840.1.113883.12.292					|
      | codes.display 	| pneumococcal polysaccharide vaccine, 23 valent 	|
      #VA Code
      | cptCode	| urn:cpt:90732												|
      | cptName	| PNEUMOCOCCAL VACCINE	    								|

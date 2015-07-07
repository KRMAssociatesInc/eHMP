@terminology @VPR 

Feature: F111  Normalization of Immunizations Data

#This feature item adds standardized coding values and descriptions for Immunizations. (CPT to CVX (VA))


  @terminology_immunizations @VPR
  Scenario Outline: An authorized user can access VA Immunization Data and see standardized CVX values when defined through VPR API
    Given a patient with "immunizations" in multiple VistAs
    Given a patient with pid "10108V420871" has been synced through Admin API
    When the client requests immunization for the patient "10108V420871" in VPR format
    Then a successful response is returned
    And the VPR results contain immunizations terminology from "(CPT to CVX (VA))"
      | field         	| value       		|
      | facilityCode	| <facility_code> 	|
      | summary       	| <summary_value> 	|
      #CVX Code
      | codes.code    	| <cvx_code>       |
      | codes.system 	| <cvx_system>		|
      | codes.display 	| <cvx_display> 	|
      #VA Code
      | cptCode	| <cpt_code>		|
      | cptName	| <cpt_name>	    |


  Examples:
    |facility_code | cvx_code  | cvx_display	                                  | cpt_code 			   | cpt_name                      | cvx_system					      | summary_value |
    | 561		   | 33        | pneumococcal polysaccharide vaccine, 23 valent   | urn:cpt:90732	       | PNEUMOCOCCAL VACCINE          | urn:oid:2.16.840.1.113883.12.292 | PNEUMOCOCCAL  |


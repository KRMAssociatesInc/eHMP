@terminology @VPR 
Feature: F111  Normalization of Vitals Data

#This feature item adds standardized coding values and descriptions for Vitals. (VUID to LOINC (VA data), NCID to LOINC (DoD data))

Background: Make sure the required patient is synced
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	
      
@terminology_vitals @VPR
Scenario Outline: An authorized user can access VA Vitals and see standardized LOINC values when defined
	Given a patient with "vitals" in multiple VistAs
	When the client requests vitals for the patient "5000000341V359724" in VPR format
	Then a successful response is returned  
    And the VPR results contain vitals terminology from "DOD Ncid, VUID to LOINC (VA)"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #Loinc code
	  | codes.code    	| <loinc_code>      |
	  | codes.system 	| http://loinc.org	|
	  | codes.display 	| <loinc_name> 		|
	  #VA code
	  | typeCode 		| <vuid_code> 		|
      
    Examples: 
      |facility_code | loinc_code | vuid_code 				| loinc_name                            | summary_value                |
	  | 998 		 | 55284-4    | urn:va:vuid:4500634		| Blood pressure systolic and diastolic | BLOOD PRESSURE 120/75 mm[Hg] |
  	  | 998 		 | 8310-5     | urn:va:vuid:4500638		| Body temperature 						| TEMPERATURE 98.6 F 		   |
        
@terminology_vitals @VPR 
Scenario Outline: An authorized user can access DOD Vitals and see standardized LOINC values when defined# Turned off because of patients without ICN will not have DOD results.
  Given a patient with "vitals" in multiple VistAs
  When the client requests vitals for the patient "10110V004877" in VPR format
  Then a successful response is returned  
    And the VPR results contain vitals terminology from "DOD Ncid, VUID to LOINC (VA)"
    | field           | value             |
    | facilityCode    | <facility_code>   |
    | summary         | <summary_value>   |
    #Loinc code
    | codes.code      | <loinc_code>      |
    | codes.system    | http://loinc.org  |
    | codes.display   | <loinc_name>      |
    #DOD code
    | codes.system    | <dod_system>      |
    | codes.code      | <dod_ncid_code>   |
      
    Examples: 
      |facility_code | loinc_code | dod_ncid_code | dod_system | loinc_name                            | summary_value                |
      | DOD          | 3141-9     | 2178          | DOD_NCID   | Body weight Measured                  | WEIGHT 180 lb                |
      | DOD          | 8310-5     | 2154          | DOD_NCID   | Body temperature                      | TEMPERATURE 100.5 F          |
      | DOD          | 3141-9     | 2178          | DOD_NCID   | Body weight Measured                  | WEIGHT 125 lb                |


@terminology_vitals @FHIR 
Scenario Outline: An authorized user can access VA Vitals and see standardized LOINC values when defined
 Given a patient with "vitals" in multiple VistAs
  When the client requests vitals for the patient "5000000341V359724" in FHIR format
  Then a successful response is returned  
    And the FHIR results contain vitals "terminology from VUID to LOINC (VA)"
    #Loinc code
    | content.name.coding.code      | <loinc_code>      |
    | content.name.coding.system    | http://loinc.org  |
    | content.name.coding.display   | <loinc_name>      |

    Examples: 
      |facility_code | loinc_code | vuid_code             | loinc_name                            | summary_value                |
      | 998          | 8480-6     | 4500634               | Systolic blood pressure               | BLOOD PRESSURE 120/75 mm[Hg] |
      | 998          | 8462-4     | 4500634               | Diastolic blood pressure              | BLOOD PRESSURE 120/75 mm[Hg] |
          
          
@terminology_vitals @FHIR  
Scenario Outline: An authorized user can access DOD Vitals and see standardized LOINC values when defined
  Given a patient with "vitals" in multiple VistAs
  When the client requests vitals for the patient "10110V004877" in FHIR format
  Then a successful response is returned  
    And the FHIR results contain vitals "terminology from DOD Ncid, VUID to LOINC (VA)"
    #Loinc code
    | content.name.coding.code      | <loinc_code>      |
    | content.name.coding.system    | http://loinc.org  |
    | content.name.coding.display   | <loinc_name>      |
    #DOD code
    | content.name.coding.system    | <dod_system>      |
    | content.name.coding.code      | <dod_ncid_code>   |

    Examples: 
      |facility_code | loinc_code | dod_ncid_code | dod_system | loinc_name                            | summary_value                |
      | DOD          | 3141-9     | 2178          | DOD_NCID   | Body weight Measured                  | WEIGHT 180 lb                |
      | DOD          | 8310-5     | 2154          | DOD_NCID   | Body temperature                      | TEMPERATURE 100.5 F          |
      | DOD          | 3141-9     | 2178          | DOD_NCID   | Body weight Measured                  | WEIGHT 125 lb                |

 #  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
    

@terminology @VPR 
Feature: F111  Normalization of Labs (Chem/Hem) Data

#This feature item adds standardized coding values and descriptions for Labs (Chem/Hem). (VUID to LOINC (VA data), NCID to LOINC (DoD data))

Background: Make sure the required patient is synced
	Given a patient with pid "5000000341V359724" has been synced through Admin API
  Given a patient with pid "10110V004877" has been synced through Admin API
	
      
@terminology_labs_ch @VPR
Scenario Outline: An authorized user can access VA Laboratory Chem and see standardized LOINC values when defined through VPR API
	Given a patient with "labs" in multiple VistAs
	When the client requests labs for the patient "5000000341V359724" in VPR format
	Then a successful response is returned  
    And the VPR results contain labs terminology from "DOD Ncid and LOINC"
      | field         | value            |
      | facilityCode  | <facility_code>  |
      | summary       | <summary_value>  |
	  #loinc code
	  | codes.code    | <loinc_code>     |
      | codes.system  | http://loinc.org |
      | codes.display | <loinc_name>     |
	  #inc code
	  | typeCode 	  | <inc_code> 		 |
	  #DOD NCID code
	  #| codes.system  | <dod_system> 	 |
      #| codes.code    | <dod_ncid_code>  |
      
      
	Examples: 
	      |facility_code | loinc_code | inc_code 		| loinc_name                            						    | summary_value                		|
	      | 500 		 | 13955-0    | urn:lnc:13955-0 | Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay | HEPATITIS C ANTIBODY (BLOOD) P 	|
		  | 500 		 | 13955-0    | urn:lnc:13955-0 | Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay | HEPATITIS C ANTIBODY (BLOOD) N 	|
	
		
@terminology_labs_ch @VPR 
Scenario Outline: An authorized user can access DoD Laboratory Chem and see standardized LOINC values when defined through VPR API
	Given a patient with "labs" in multiple VistAs
	When the client requests labs for the patient "10110V004877" in VPR format
	Then a successful response is returned  
    And the VPR results contain labs terminology from "DOD Ncid and LOINC"
      | field         | value            |
      | facilityCode  | <facility_code>  |
      | summary       | <summary_value>  |
	  #loinc code
	  | codes.code    | <loinc_code>     |
      | codes.system  | http://loinc.org |
      | codes.display | <loinc_name>     |
	  #DOD NCID code
	  | codes.system  | <dod_system> 	 |
      | codes.code    | <dod_ncid_code>  |
      
      
	Examples: 
	      |facility_code | loinc_code | dod_ncid_code | dod_system 	  | loinc_name                            						      | summary_value                											       |
		  | DOD 		 | 32623-1    | 21376     	  | DOD_NCID  	  | Platelet mean volume [Entitic volume] in Blood by Automated count | Platelet Mean Volume, Blood Quantitative Automated (BLOOD) 55.0<em>H</em> fL   	 	   |
	      | DOD 		 | 19023-1    | 21061     	  | DOD_NCID 	  | Granulocytes/100 leukocytes in Blood by Automated count 		  | CONTAINS Granulocytes/100 Leukocytes                                           |
		  | DOD 		 | 736-9      | 4736      	  | DOD_NCID 	  | Lymphocytes/100 leukocytes in Blood by Automated count  	 	  | Lymphocytes/100 Leukocytes, Blood Quantitative Automated Count (BLOOD) 52.0<em>H</em> % |


@terminology_labs_ch @FHIR
Scenario Outline: An authorized user can VA access Laboratory Chem and see standardized LOINC values when defined through FHIR API
	Given a patient with "labs" in multiple VistAs
	When the client requests labs for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned  
    And the FHIR results contain "labs terminology from DOD Ncid and LOINC"
	  | field           					    | value       		|
	  #Loinc code
	  | content.contained.name.coding.code    	| <loinc_code>      |
	  | content.contained.name.coding.system    | http://loinc.org	|
	  | content.contained.name.coding.display 	| <loinc_name> 	  	|
	  #VA code
	  | content.contained.name.coding.system  	| <va_system> 		|
	  | content.contained.name.coding.code 		| <va_code> 		|
	  | content.contained.name.coding.display 	| <summary_value> 	|
	  #Inc code
	  | content.contained.name.coding.system  	| <inc_system> 		|
	  | content.contained.name.coding.code 		| <inc_code> 		|
	  | content.contained.name.coding.display 	| <summary_value> 	|
      
      
	Examples: 
	      |facility_code | loinc_code | inc_code 		| loinc_name                            							| summary_value         | inc_system							| va_system 					   | va_code 				|
	      | 500 		 | 13955-0    | urn:lnc:13955-0 | Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay | HEPATITIS C ANTIBODY 	| urn:oid:2.16.840.1.113883.4.642.2.58 	| urn:oid:2.16.840.1.113883.6.233  | urn:va:vuid:4655455 	|
		  

@terminology_labs_ch @FHIR 
Scenario Outline: An authorized user can DoD access Laboratory Chem and see standardized LOINC values when defined through FHIR API
	Given a patient with "labs" in multiple VistAs
	When the client requests labs for the patient "10110V004877" in FHIR format
	Then a successful response is returned  
    And the FHIR results contain "labs terminology from DOD Ncid and LOINC"
	  | field           					    | value       		|
	  #Loinc code
	  | content.contained.name.coding.code    	| <loinc_code>      |
	  | content.contained.name.coding.system    | http://loinc.org	|
	  | content.contained.name.coding.display 	| <loinc_name> 	  	|
	  #DOD code
	  | content.contained.name.coding.system  	| <dod_system> 	  	|
      | content.contained.name.coding.code   	| <dod_ncid_code> 	|
      
      
	Examples: 
	      |facility_code | loinc_code | dod_ncid_code 	| dod_system 	| loinc_name                            							|
		  | DOD 		 | 32623-1    | 21376     		| DOD_NCID 		| Platelet mean volume [Entitic volume] in Blood by Automated count |
	      | DOD 		 | 19023-1    | 21061     		| DOD_NCID 		| Granulocytes/100 leukocytes in Blood by Automated count 		    |
		  | DOD 		 | 736-9      | 4736      		| DOD_NCID 		| Lymphocytes/100 leukocytes in Blood by Automated count  			|


#TestNote: 
#	* We could not test Lab MI in VPR format because it's not available through VPR.       
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
      

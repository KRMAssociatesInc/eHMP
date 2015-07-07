@terminology @FHIR @future
Feature: F323  Normalization of Labs (Chem/Hem) Data

#This feature item adds standardized coding values and descriptions for Labs (Chem/Hem). (VUID to LOINC (VA data), NCID to LOINC (DoD data))


@terminology_labs_ch @FHIR
Scenario: An authorized user can VA access Laboratory Chem and see standardized LOINC values when defined through VPR API
   Given a patient with "labs" in multiple VistAs
   And a patient with pid "9E7A;100022" has been synced through RDK API
   When the client requests labs for the patient "9E7A;100022" in FHIR format
   Then a successful response is returned 
   And  the FHIR results contain labs terminology from "DOD Ncid and LOINC"

	  | field           					    | value       		                                                   |
	  #Loinc code
	  | content.contained.name.coding.code    	| 500                                                                   |
	  | content.contained.name.coding.system    | http://loinc.org	                                                    |
	  | content.contained.name.coding.display 	| Hepatitis C virus Ab [Presence] in Serum or Plasma by Immunoassay	  	|
	  #VA code
	  | content.contained.name.coding.system  	| urn:oid:2.16.840.1.113883.6.233		                                |
	  | content.contained.name.coding.code 		| urn:va:vuid:4655455 		                                            |
	  | content.contained.name.coding.display 	| HEPATITIS C ANTIBODY	                                                |
	  #Inc code
	  | content.contained.name.coding.system  	| urn:oid:2.16.840.1.113883.4.642.2.58		                             |
	  | content.contained.name.coding.code 		| 	urn:lnc:13955-0	                                                     |
	  | content.contained.name.coding.display 	| HEPATITIS C ANTIBODY	                                                 |
      
 
		  

@terminology_labs_ch @FHIR
Scenario: An authorized user can DoD access Laboratory Chem and see standardized LOINC values when defined through VPR API
	Given a patient with "labs" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through RDK API
	When the client requests labs for the patient "9E7A;8" in FHIR format
	Then a successful response is returned
	And the FHIR results contain labs terminology from "DOD Ncid and LOINC"

	  | field           					    | value       		|
	  #Loinc code
	  | content.contained.name.coding.code    	| 32623-1           |
	  | content.contained.name.coding.system    | http://loinc.org	|
	  | content.contained.name.coding.display 	| Platelet mean volume [Entitic volume] in Blood by Automated count |
	  #DOD code
	  | content.contained.name.coding.system  	| DOD_NCID	  	|
      | content.contained.name.coding.code   	| 21376 	    |

      And the VPR results contain "labs terminology from DOD Ncid and LOINC"
	  | field           					    | value       		|
	  #Loinc code
	  | content.contained.name.coding.code    	| 19023-1           |
	  | content.contained.name.coding.system    | http://loinc.org	|
	  | content.contained.name.coding.display 	| Granulocytes/100 leukocytes in Blood by Automated count |
	  #DOD code
	  | content.contained.name.coding.system  	| DOD_NCID	  	|
      | content.contained.name.coding.code   	| 21061 	    |

      And the VPR results contain "labs terminology from DOD Ncid and LOINC"
	  | field           					    | value       		|
	  #Loinc code
	  | content.contained.name.coding.code    	| 736-9          |
	  | content.contained.name.coding.system    | http://loinc.org	|
	  | content.contained.name.coding.display 	| Lymphocytes/100 leukocytes in Blood by Automated count |
	  #DOD code
	  | content.contained.name.coding.system  	| DOD_NCID	  	|
      | content.contained.name.coding.code   	| 4736 	    |
      
   


#TestNote: 
#	* We could not test Lab MI in VPR format because it's not available through VPR.       
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
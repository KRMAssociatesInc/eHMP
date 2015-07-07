@terminology @VPR 
Feature: F111  Normalization of Problems Data

#This feature item adds standardized coding values and descriptions for Problems. (ICD-9 to SNOMED CT (BOTH VA and DoD data))

      
@terminology_problems @VPR
Scenario Outline: An authorized user can access VA Problem Lists and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	Given a patient with pid "10110V004877" has been synced through Admin API
	When the client requests problem lists for the patient "10110V004877" in VPR format
	Then a successful response is returned  
    And the VPR results contain problem lists terminology from "(ICD-9 to SNOMED CT (BOTH))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #icd Code
	  | icdCode 		| <icd_code> 		|
	  #sno med code
	  | codes.code    	| <sno_med_code>    |
	  | codes.system 	| <sno_system>		|
	  | codes.display 	| <display_value> 	|
	  
      
    Examples: 
      |facility_code | icd_code 		| sno_med_code 	| display_value  							| sno_system 				| summary_value              								 | 
      | 500 		 | urn:icd:250.00 	| EMPTY			| EMPTY										| EMPTY					 	| Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | 500 		 | urn:icd:428.22 	| 441481004		| Chronic systolic heart failure (disorder)	| http://snomed.info/sct 	| Chronic Systolic Heart failure (ICD-9-CM 428.22) 			 |
      | 500 		 | urn:icd:401.9 	| 59621000		| Essential hypertension (disorder)			| http://snomed.info/sct 	| Hypertension (ICD-9-CM 401.9)					 			 |
      
      
@terminology_problems @VPR 
Scenario Outline: An authorized user can access DoD Problem Lists and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	Given a patient with pid "10110V004877" has been synced through Admin API
	When the client requests problem lists for the patient "10110V004877" in VPR format
	Then a successful response is returned  
    And the VPR results contain problem lists terminology from "(ICD-9 to SNOMED CT (BOTH))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #icd Code
	  | icdCode 		| <icd_code> 		|
	  #DOD code
	  | codes.code    	| <med_cin_id> 		|
      | codes.system  	| <dod_system> 		|
	  #sno med code
	  | codes.code    	| <sno_med_code>    |
	  | codes.system 	| <sno_system>		|
	  | codes.display 	| <display_value> 	|
	  
      
    Examples: 
      |facility_code | icd_code | med_cin_id | dod_system  | sno_med_code 	| display_value  												| sno_system 				| summary_value | 
      | DOD 		 | 593.9 	| 30627	  	 | DOD_MEDCIN  | 90708001		| Kidney disease (disorder) 									| http://snomed.info/sct 	| IS_SET 		|
      | DOD 		 | 724.2 	| 34447	  	 | DOD_MEDCIN  | 279039007		| Low back pain (finding) 									  	| http://snomed.info/sct 	| IS_SET 		|
      | DOD 		 | 187.9 	| 275493 	 | DOD_MEDCIN  | 93885006		| Primary malignant neoplasm of male genital organ (disorder) 	| http://snomed.info/sct 	| IS_SET 		|
           
      
@terminology_problems @VPR 
Scenario Outline: An authorized user can access DoD Problem List and see standardized SNOMED CT values when defined
	Given a patient with "problem lists" in multiple VistAs
	Given a patient with pid "5000000341V359724" has been synced through Admin API
	When the client requests problem lists for the patient "10110V004877" in VPR format
	Then a successful response is returned  
    And the VPR results contain problem lists terminology from "(ICD-9 to SNOMED CT (BOTH))"
	  | field         	| value       		|
	  | facilityCode	| <facility_code> 	|
	  | summary       	| <summary_value> 	|
	  #DOD code
	  | codes.code    	| <med_cin_id> 		|
      | codes.system  	| <dod_system> 		|
	  #sno med code
	  | codes.code    	| <sno_med_code>    |
	  | codes.system 	| <sno_system>		|
	  | codes.display 	| <display_value> 	|
	  
      
    Examples: 
      |facility_code | med_cin_id | dod_system	| sno_med_code 	| display_value  										| sno_system 				| summary_value | 
      | DOD 		 | 39019	  | DOD_MEDCIN  | 126552007		| Neoplasm of vertebral column (disorder) 				| http://snomed.info/sct 	| IS_SET 		|
	    | DOD 		 | 33222	  | DOD_MEDCIN  | 54160000		| Congenital aneurysm of sinus of Valsalva (disorder) 	| http://snomed.info/sct 	| IS_SET 		|
      | DOD 		 | 34447	  | DOD_MEDCIN  | 279039007		| Low back pain (finding)	 							| http://snomed.info/sct 	| IS_SET		|
 
      
#TestNote: 
#	* We could not test problems in FHIR format because it's not available through FHIR.
#  ** Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
	 

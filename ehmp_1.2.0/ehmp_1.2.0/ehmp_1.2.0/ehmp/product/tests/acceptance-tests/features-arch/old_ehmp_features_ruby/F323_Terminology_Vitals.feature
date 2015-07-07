@terminology @VPR @vx_sync 
Feature: F111  Normalization of Vitals Data

#This feature item adds standardized coding values and descriptions for Vitals. (VUID to LOINC (VA data), NCID to LOINC (DoD data))	
      
@terminology_vitals @VPR
Scenario: An authorized user can access VA Vitals and see standardized LOINC values when defined
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through VX-Sync API for "9E7A" site(s)
	When the client requests "vitals" for the patient "5000000341V359724" in VPR format  
    Then the VPR results contain "vitals" terminology from "DOD Ncid, VUID to LOINC (VA)"
	  | field         | value                                 |
      | facilityCode  | 998                                   |
      | summary       | BLOOD PRESSURE 120/75 mm[Hg]          |
      #Loinc code
      | codes.code    | 55284-4                               |
      | codes.system  | http://loinc.org                      |
      | codes.display | Blood pressure systolic and diastolic |
      #VA code
      | typeCode      | urn:va:vuid:4500634                   |
	
	And the VPR results contain "vitals" terminology from "DOD Ncid, VUID to LOINC (VA)"
	  | field         | value               |
      | facilityCode  | 998                 |
      | summary       | TEMPERATURE 98.6 F  |
      #Loinc code
      | codes.code    | 8310-5              |
      | codes.system  | http://loinc.org    |
      | codes.display | Body temperature    |
      #VA code
      | typeCode      | urn:va:vuid:4500638 |
      
    
@terminology_vitals @VPR 
Scenario: An authorized user can access DOD Vitals and see standardized LOINC values when defined# Turned off because of patients without ICN will not have DOD results.
  	Given a patient with "vitals" in multiple VistAs
  	And a patient with pid "10110V004877" has been synced through VX-Sync API for "DoD" site(s)
  	When the client requests "vitals" for the patient "10110V004877" in VPR format 
  	Then the VPR results contain "vitals" terminology from "DOD Ncid, VUID to LOINC (VA)"
	    | field           | value                |
	    | facilityCode    | DOD   				 |
	    | summary         |  WEIGHT 180 lb   	 |
	    #Loinc code
	    | codes.code      | 3141-9       		 |
	    | codes.system    | http://loinc.org  	 |
	    | codes.display   | Body weight Measured |
	    #DOD code
	    | codes.system    | DOD_NCID      	  	 |
	    | codes.code      | 2178   			     |
    And the VPR results contain "vitals" terminology from "DOD Ncid, VUID to LOINC (VA)"
	    | field         | value               	|
      	| facilityCode  | DOD                 	|
      	| summary       | TEMPERATURE 100.5 F 	|
	    #Loinc code
	    | codes.code    | 8310-5              	|	
      	| codes.system  | http://loinc.org    	|
      	| codes.display | Body temperature    	|
	    #DOD code
	    | codes.system  | DOD_NCID            	|
      	| codes.code    | 2154                	|
    And the VPR results contain "vitals" terminology from "DOD Ncid, VUID to LOINC (VA)"
        | field         | value                	|
	    | facilityCode  | DOD                  	|
	    | summary       | WEIGHT 125 lb        	|
	    #Loinc code
	    | codes.code    | 3141-9               	|
	    | codes.system  | http://loinc.org     	|
	    | codes.display | Body weight Measured 	|
	    #DOD code
	    | codes.system  | DOD_NCID             	|
	    | codes.code    | 2178                 	|
	      

 #  * Using MappingTables_prod.zip to verify the data. https://wiki.vistacore.us/display/VACORE/JLV+Terminology+Handling
    

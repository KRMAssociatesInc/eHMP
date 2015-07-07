@us4596 @F323 @vx_sync 
Feature: F323 syncing of data from primary and secondary vistas, DOD, and VLER


#This feature item covers the data save on JDS.

   
@jds_find_count
Scenario: Client can request allergies in VPR format
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "allergies" for the patient "9E7A;227" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "allergies"
      | field        | value  |
      | kind 		 | ALL_SET |
      | typeName     | ALL_SET |
      | products     | ALL_SET |


@jds_find_count
Scenario: Client can request labs in VPR format
	Given a patient with "labs" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "labs" for the patient "9E7A;227" in VPR format
	Then the client receives 46 record(s) for site "9E7A"
	And the client receives 46 record(s) for site "C877"
	And the client receives 14 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "labs"
		| field         | value  |
		| kind 			| ALL_SET |
      	| abnormal     	| ALL_SET |
      	| specimen    	| ALL_SET |


@jds_find_count
Scenario: Client can request vital in VPR format
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "vitals" for the patient "9E7A;227" in VPR format
	Then the client receives 51 record(s) for site "9E7A"
	And the client receives 51 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "vitals"
		| field             | value   |
		| kind 				| ALL_SET  |
      	| typeName          | ALL_SET  |
      	| result            | ALL_SET  |


@jds_find_count
Scenario: Client can request order in VPR format
	Given a patient with "orders" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "orders" for the patient "9E7A;227" in VPR format
	Then the client receives 30 record(s) for site "9E7A"
	And the client receives 30 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "orders"
		| field             | value    |
		| kind 				| ALL_SET   |
      	| content           | ALL_SET   |
      	| service           | ALL_SET   |

@jds_find_count
Scenario: Client can request med in VPR format
	Given a patient with "meds" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "meds" for the patient "9E7A;227" in VPR format
	Then the client receives 6 record(s) for site "9E7A"
	And the client receives 6 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 0 record(s) for site "HDR"
	Then the VPR results contain "meds"
		| field             | value     |
		| facilityName 		| ALL_SET 	|
      	| name           	| ALL_SET    |
      	| products          | ALL_SET    | 
     

@jds_find_count
Scenario: Client can request consult in VPR format
	Given a patient with "consult" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "consult" for the patient "9E7A;227" in VPR format
	Then the client receives 3 record(s) for site "9E7A"
	And the client receives 3 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "consult"
		| field             | value    |
		| kind 				| ALL_SET   |
      	| typeName          | ALL_SET   |
      	| service           | ALL_SET   |



@jds_find_count
Scenario: Client can request problem list in VPR format
	Given a patient with "problem list" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "problem list" for the patient "9E7A;227" in VPR format
	Then the client receives 5 record(s) for site "9E7A"
	And the client receives 5 record(s) for site "C877"
	And the client receives 3 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "problem list"
		| field             | value     |
		| facilityName 		| ALL_SET 	|
      	| kind        		| ALL_SET    |
      	| problemText       | ALL_SET    |




@jds_find_count
Scenario: Client can request procedure in VPR format
	Given a patient with "procedure" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "procedure" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "procedure"
		| field             | value     |
		| facilityName 		| ALL_SET    |
      	| kind        		| ALL_SET    |
      	| category          | ALL_SET    |


# Heather will either remove debug or create defect after initial run of silver in the jenkins pipeline
@jds_find_count 
Scenario: Client can request document in VPR format
	Given a patient with "document" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "document" for the patient "9E7A;227" in VPR format
	Then the client receives 13 record(s) for site "9E7A"
	And the client receives 13 record(s) for site "C877"
	And the client receives 4 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "document"
		| field             | value         |
		| kind 				| ALL_SET 	    |
      	| status            | ALL_SET        |
      	| text           	| ALL_SET        |

@jds_find_count
Scenario: Client can request purpose of visit (POV) in VPR format
	Given a patient with "purpose of visit" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "purpose of visit" for the patient "9E7A;227" in VPR format
	Then the client receives 4 record(s) for site "9E7A"
	And the client receives 4 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "purpose of visit"
		| field             | value       |
		| name 				| ALL_SET 	  |
      	| type              | ALL_SET      |
      	| encounterName     | ALL_SET      |
      	
      	
@jds_find_count
Scenario: Client can request appointment in VPR format
	Given a patient with "appointment" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "appointment" for the patient "9E7A;227" in VPR format
	Then the client receives 22 record(s) for site "9E7A"
	And the client receives 22 record(s) for site "C877"
	And the client receives 3 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "appointment"
		| field             | value       |
		| appointmentStatus | ALL_SET 	  |
      	| kind              | ALL_SET      |
      	| providers		    | ALL_SET      |


@jds_find_count
Scenario: Client can request visit in VPR format
	Given a patient with "visit" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "visit" for the patient "9E7A;227" in VPR format
	Then the client receives 36 record(s) for site "9E7A"
	And the client receives 36 record(s) for site "C877"
	And the client receives 1 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "visit"
		| field             | value       |
		| typeName 			| ALL_SET 	  |
      	| kind              | ALL_SET      |
      	| facilityName		| ALL_SET      |
      	

@jds_find_count
Scenario: Client can request factor in VPR format
	Given a patient with "factor" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "factor" for the patient "9E7A;227" in VPR format
	Then the client receives 5 record(s) for site "9E7A"
	And the client receives 5 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "factor"
		| field             | value       |
		| categoryName 		| ALL_SET 	  |
      	| encounterName     | ALL_SET      |
      	| kind		    	| ALL_SET      |

      
@jds_find_count
Scenario: Client can request CPT in VPR format
	Given a patient with "CPT" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "CPT" for the patient "9E7A;227" in VPR format
	Then the client receives 8 record(s) for site "9E7A"
	And the client receives 8 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "CPT"
		| field             | value       |
		| encounterName 	| ALL_SET 	  |
      	| quantity     		| ALL_SET      |
      	| type		    	| ALL_SET      |

      	
@jds_find_count
Scenario: Client can request surgery in VPR format
	Given a patient with "surgery" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "surgery" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "surgery"
		| field             | value       |
		| category 			| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| providers		    | ALL_SET      | 

      	
@jds_find_count
Scenario: Client can request image in VPR format
	Given a patient with "image" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "image" for the patient "9E7A;227" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 7 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "image"
		| field             | value       |
		| imageLocation 	| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| category		    | ALL_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request immunizations in VPR format
	Given a patient with "immunizations" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "immunizations" for the patient "9E7A;227" in VPR format
	Then the client receives 2 record(s) for site "9E7A"
	And the client receives 2 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "immunizations"
		| field             | value       |
		| encounterName 	| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| name		    	| ALL_SET      | 
      	
      	
@jds_find_count1
Scenario: Client can request vler document in VPR format
	Given a patient with "vler document" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "VLER" site(s)
	When the client requests "vler document" for the patient "9E7A;227" in VPR format
	Then the client receives 11 record(s) for site "VLER"
	And the VPR results contain "vler document"
		| field             | value       |
		| sections		 	| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| name		    	| ALL_SET      |  
      	
      	 
 @jds_find_count
Scenario: Client can request allergies in VPR format
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "allergies" for the patient "9E7A;8" in VPR format
	Then the client receives 3 record(s) for site "9E7A"
	And the client receives 3 record(s) for site "C877"
	And the client receives 27 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "allergies"
      | field        | value  |
      | kind 		 | ALL_SET |
      | summary      | ALL_SET |
      | products     | ALL_SET |     	


@jds_find_count @jds_find_count_vital
Scenario: Client can request vital in VPR format
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "vitals" for the patient "9E7A;8" in VPR format
	Then the client receives 430 record(s) for site "9E7A"
	And the client receives 430 record(s) for site "C877"
	And the client receives 40 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "vitals"
		| field             | value   |
		| kind 				| ALL_SET  |
      	| typeName          | ALL_SET  |
      	| result            | ALL_SET  |


@jds_find_count
Scenario: Client can request order in VPR format
	Given a patient with "orders" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "orders" for the patient "9E7A;8" in VPR format
	Then the client receives 517 record(s) for site "9E7A"
	And the client receives 517 record(s) for site "C877"
	And the client receives 7 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "orders"
		| field             | value    |
		| kind 				| ALL_SET   |
      	| content           | ALL_SET   |
      	| service           | ALL_SET   |

@jds_find_count
Scenario: Client can request med in VPR format
	Given a patient with "meds" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "meds" for the patient "9E7A;8" in VPR format
	Then the client receives 151 record(s) for site "9E7A"
	And the client receives 151 record(s) for site "C877"
	And the client receives 11 record(s) for site "DOD"
	And the client receives 0 record(s) for site "HDR"
	Then the VPR results contain "meds"
		| field             | value     |
		| facilityName 		| ALL_SET 	|
      	| kind           	| ALL_SET    |
      	| vaType            | ALL_SET    | 
  
     
@jds_find_count1
Scenario: Client can request patient demographics in VPR format
	Given a patient with "patient demographics" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "patient demographics" for the patient "9E7A;8" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 1 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "patient demographics"
		| field             | value     |
		| displayName 		| ALL_SET 	|
      	| birthDate         | ALL_SET    |
      	| displayName       | ALL_SET    | 
      	
      	      	
@jds_find_count
Scenario: Client can request procedure in VPR format
	Given a patient with "procedure" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "procedure" for the patient "9E7A;8" in VPR format
	Then the client receives 2 record(s) for site "9E7A"
	And the client receives 2 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	Then the VPR results contain "procedure"
		| field             | value     |
		| facilityName 		| ALL_SET    |
      	| kind        		| ALL_SET    |
      	| category          | ALL_SET    |

      	
@jds_find_count
Scenario: Client can request surgery in VPR format
	Given a patient with "surgery" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "surgery" for the patient "9E7A;8" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "surgery"
		| field             | value       |
		| category 			| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| providers		    | ALL_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request immunizations in VPR format
	Given a patient with "immunizations" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;HDR" site(s)
	When the client requests "immunizations" for the patient "9E7A;8" in VPR format
	Then the client receives 16 record(s) for site "9E7A"
	And the client receives 16 record(s) for site "C877"
	And the client receives 10 record(s) for site "DOD"
	And the client receives 1 record(s) for site "HDR"
	And the VPR results contain "immunizations"
		| field             | value       |
		| summary 			| ALL_SET 	  |
      	| kind     			| ALL_SET      |
      	| name		    	| ALL_SET      |
      	      	
      	
      	
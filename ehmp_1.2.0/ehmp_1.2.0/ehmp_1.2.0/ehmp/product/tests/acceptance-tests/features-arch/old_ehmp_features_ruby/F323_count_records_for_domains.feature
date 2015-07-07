@us4596 @vx_sync 
Feature: F323 syncing of data from primary and secondary vistas, DOD, and VLER


#This feature item covers the data save on JDS.

   
@jds_find_count
Scenario: Client can request allergies in VPR format
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "allergies" for the patient "9E7A;227" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "allergies"
      | field        | value  |
      | kind 		 | IS_SET |
      | typeName     | IS_SET |
      | products     | IS_SET |


@jds_find_count
Scenario: Client can request labs in VPR format
	Given a patient with "labs" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "labs" for the patient "9E7A;227" in VPR format
	Then the client receives 46 record(s) for site "9E7A"
	And the client receives 46 record(s) for site "C877"
	And the client receives 14 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "labs"
		| field         | value  |
		| kind 			| IS_SET |
      	| typeName     	| IS_SET |
      	| specimen    	| IS_SET |


@jds_find_count
Scenario: Client can request vital in VPR format
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "vitals" for the patient "9E7A;227" in VPR format
	Then the client receives 51 record(s) for site "9E7A"
	And the client receives 51 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "vitals"
		| field             | value   |
		| kind 				| IS_SET  |
      	| typeName          | IS_SET  |
      	| result            | IS_SET  |


@jds_find_count
Scenario: Client can request order in VPR format
	Given a patient with "orders" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "orders" for the patient "9E7A;227" in VPR format
	Then the client receives 30 record(s) for site "9E7A"
	And the client receives 30 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "orders"
		| field             | value    |
		| kind 				| IS_SET   |
      	| content           | IS_SET   |
      	| service           | IS_SET   |

@jds_find_count
Scenario: Client can request med in VPR format
	Given a patient with "meds" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "meds" for the patient "9E7A;227" in VPR format
	Then the client receives 6 record(s) for site "9E7A"
	And the client receives 6 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 0 record(s) for site "CDS"
	Then the JDS results contain "meds"
		| field             | value     |
		| facilityName 		| IS_SET 	|
      	| dosages           | IS_SET    |
      	| products          | IS_SET    | 
     

@jds_find_count
Scenario: Client can request consult in VPR format
	Given a patient with "consult" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "consult" for the patient "9E7A;227" in VPR format
	Then the client receives 3 record(s) for site "9E7A"
	And the client receives 3 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "consult"
		| field             | value    |
		| kind 				| IS_SET   |
      	| typeName          | IS_SET   |
      	| urgency           | IS_SET   |



@jds_find_count
Scenario: Client can request problem list in VPR format
	Given a patient with "problem list" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "problem list" for the patient "9E7A;227" in VPR format
	Then the client receives 5 record(s) for site "9E7A"
	And the client receives 5 record(s) for site "C877"
	And the client receives 4 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "problem list"
		| field             | value     |
		| facilityName 		| IS_SET 	|
      	| kind        		| IS_SET    |
      	| service           | IS_SET    |




@jds_find_count
Scenario: Client can request procedure in VPR format
	Given a patient with "procedure" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "procedure" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "procedure"
		| field             | value     |
		| facilityName 		| IS_SET    |
      	| kind        		| IS_SET    |
      	| category          | IS_SET    |


@jds_find_count
Scenario: Client can request document in VPR format
	Given a patient with "document" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "document" for the patient "9E7A;227" in VPR format
	Then the client receives 13 record(s) for site "9E7A"
	And the client receives 13 record(s) for site "C877"
	And the client receives 4 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "document"
		| field             | value         |
		| clinicians 		| IS_SET 	    |
      	| status            | IS_SET        |
      	| text           	| IS_SET        |

@jds_find_count
Scenario: Client can request purpose of visit (POV) in VPR format
	Given a patient with "purpose of visit" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "purpose of visit" for the patient "9E7A;227" in VPR format
	Then the client receives 4 record(s) for site "9E7A"
	And the client receives 4 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "purpose of visit"
		| field             | value       |
		| name 				| IS_SET 	  |
      	| type              | IS_SET      |
      	| encounterName     | IS_SET      |
      	
      	
@jds_find_count
Scenario: Client can request appointment in VPR format
	Given a patient with "appointment" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "appointment" for the patient "9E7A;227" in VPR format
	Then the client receives 22 record(s) for site "9E7A"
	And the client receives 22 record(s) for site "C877"
	And the client receives 3 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "appointment"
		| field             | value       |
		| appointmentStatus | IS_SET 	  |
      	| kind              | IS_SET      |
      	| providers		    | IS_SET      |


@jds_find_count
Scenario: Client can request education in VPR format
	Given a patient with "education" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "education" for the patient "9E7A;227" in VPR format
	Then the client receives 5 record(s) for site "9E7A"
	And the client receives 5 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "education"
		| field             | value       |
		| facilityName 		| IS_SET      |
		| encounterName		| IS_SET 	  |
      	| name              | IS_SET      |


@jds_find_count
Scenario: Client can request visit in VPR format
	Given a patient with "visit" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "visit" for the patient "9E7A;227" in VPR format
	Then the client receives 36 record(s) for site "9E7A"
	And the client receives 36 record(s) for site "C877"
	And the client receives 1 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "visit"
		| field             | value       |
		| typeName 			| IS_SET 	  |
      	| kind              | IS_SET      |
      	| locationName		| IS_SET      |
      	

@jds_find_count
Scenario: Client can request factor in VPR format
	Given a patient with "factor" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "factor" for the patient "9E7A;227" in VPR format
	Then the client receives 5 record(s) for site "9E7A"
	And the client receives 5 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "factor"
		| field             | value       |
		| categoryName 		| IS_SET 	  |
      	| encounterName     | IS_SET      |
      	| kind		    	| IS_SET      |

      
@jds_find_count
Scenario: Client can request CPT in VPR format
	Given a patient with "CPT" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "CPT" for the patient "9E7A;227" in VPR format
	Then the client receives 8 record(s) for site "9E7A"
	And the client receives 8 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "CPT"
		| field             | value       |
		| encounterName 	| IS_SET 	  |
      	| quantity     		| IS_SET      |
      	| type		    	| IS_SET      |

      	
@jds_find_count
Scenario: Client can request surgery in VPR format
	Given a patient with "surgery" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "surgery" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "surgery"
		| field             | value       |
		| category 			| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| providers		    | IS_SET      | 

      	
@jds_find_count
Scenario: Client can request image in VPR format
	Given a patient with "image" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "image" for the patient "9E7A;227" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 7 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "image"
		| field             | value       |
		| imageLocation 	| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| category		    | IS_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request immunizations in VPR format
	Given a patient with "immunizations" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "immunizations" for the patient "9E7A;227" in VPR format
	Then the client receives 2 record(s) for site "9E7A"
	And the client receives 2 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "immunizations"
		| field             | value       |
		| encounterName 	| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| name		    	| IS_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request exam in VPR format
	Given a patient with "exam" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "exam" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "exam"
		| field             | value       |
		| encounterName 	| IS_SET 	  |
      	| facilityName     	| IS_SET      |
      	| name		    	| IS_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request Mental Health in VPR format
	Given a patient with "Mental Health" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "Mental Health" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "MentalHealth"
		| field             | value       |
      	| facilityName     	| IS_SET      |
      	| name		    	| IS_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request Skin in VPR format
	Given a patient with "Skin" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "Skin" for the patient "9E7A;227" in VPR format
	Then the client receives 0 record(s) for site "9E7A"
	And the client receives 0 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "Skin"
		| field             | value       |
		| encounterName 	| IS_SET 	  |
      	| facilityName     	| IS_SET      |
      	| name		    	| IS_SET      | 
 
      	
@jds_find_count1
Scenario: Client can request vler document in VPR format
	Given a patient with "vler document" in multiple VistAs
	And a patient with pid "9E7A;227" has been synced through VX-Sync API for "VLER" site(s)
	When the client requests "vler document" for the patient "9E7A;227" in VPR format
	Then the client receives 11 record(s) for site "VLER"
	And the JDS results contain "vler document"
		| field             | value       |
		| sections		 	| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| name		    	| IS_SET      |  
      	
      	 
 @jds_find_count
Scenario: Client can request allergies in VPR format
	Given a patient with "allergies" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "allergies" for the patient "9E7A;8" in VPR format
	Then the client receives 3 record(s) for site "9E7A"
	And the client receives 3 record(s) for site "C877"
	And the client receives 27 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "allergies"
      | field        | value  |
      | kind 		 | IS_SET |
      | typeName     | IS_SET |
      | products     | IS_SET |     	


@jds_find_count
Scenario: Client can request vital in VPR format
	Given a patient with "vitals" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "vitals" for the patient "9E7A;8" in VPR format
	Then the client receives 174 record(s) for site "9E7A"
	And the client receives 174 record(s) for site "C877"
	And the client receives 40 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "vitals"
		| field             | value   |
		| kind 				| IS_SET  |
      	| typeName          | IS_SET  |
      	| result            | IS_SET  |


@jds_find_count
Scenario: Client can request order in VPR format
	Given a patient with "orders" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "orders" for the patient "9E7A;8" in VPR format
	Then the client receives 517 record(s) for site "9E7A"
	And the client receives 517 record(s) for site "C877"
	And the client receives 7 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "orders"
		| field             | value    |
		| kind 				| IS_SET   |
      	| content           | IS_SET   |
      	| service           | IS_SET   |

@jds_find_count
Scenario: Client can request med in VPR format
	Given a patient with "meds" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "meds" for the patient "9E7A;8" in VPR format
	Then the client receives 151 record(s) for site "9E7A"
	And the client receives 151 record(s) for site "C877"
	And the client receives 11 record(s) for site "DOD"
	And the client receives 0 record(s) for site "CDS"
	Then the JDS results contain "meds"
		| field             | value     |
		| facilityName 		| IS_SET 	|
      	| dosages           | IS_SET    |
      	| products          | IS_SET    | 
  
     
@jds_find_count
Scenario: Client can request patient demographics in VPR format
	Given a patient with "patient demographics" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "patient demographics" for the patient "9E7A;8" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 2 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "patient demographics"
		| field             | value     |
		| address 			| IS_SET 	|
      	| birthDate         | IS_SET    |
      	| displayName       | IS_SET    | 
      	
      	      	
@jds_find_count
Scenario: Client can request procedure in VPR format
	Given a patient with "procedure" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "procedure" for the patient "9E7A;8" in VPR format
	Then the client receives 2 record(s) for site "9E7A"
	And the client receives 2 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	Then the JDS results contain "procedure"
		| field             | value     |
		| facilityName 		| IS_SET    |
      	| kind        		| IS_SET    |
      	| category          | IS_SET    |

      	
@jds_find_count
Scenario: Client can request surgery in VPR format
	Given a patient with "surgery" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "surgery" for the patient "9E7A;8" in VPR format
	Then the client receives 1 record(s) for site "9E7A"
	And the client receives 1 record(s) for site "C877"
	And the client receives 0 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "surgery"
		| field             | value       |
		| category 			| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| providers		    | IS_SET      | 
      	
      	
@jds_find_count
Scenario: Client can request immunizations in VPR format
	Given a patient with "immunizations" in multiple VistAs
	And a patient with pid "9E7A;8" has been synced through VX-Sync API for "9E7A;C877;DOD;CDS" site(s)
	When the client requests "immunizations" for the patient "9E7A;8" in VPR format
	Then the client receives 16 record(s) for site "9E7A"
	And the client receives 16 record(s) for site "C877"
	And the client receives 10 record(s) for site "DOD"
	And the client receives 1 record(s) for site "CDS"
	And the JDS results contain "immunizations"
		| field             | value       |
		| encounterName 	| IS_SET 	  |
      	| kind     			| IS_SET      |
      	| name		    	| IS_SET      |
      	      	
      	
      	
@F137 @future
Feature: F137 - SDK Expansion and Enhancement

@US1117 @F137_1_detailhtml
Scenario Outline: Implement the resource server Health Check checks
	When client requests the healthcheck details html in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "<subsystem>" contains
		| field 	| value 			|
		| name 		| <subsystem> 		|
		| detail 	| CONTAINS html		|
		
Examples:
	| subsystem							| 
	| solr 								| 
	| jds 								| 			
	| authorization 					| 			
	| patientrecord 					| 			
	| jdsSync 							| 				


@US1117 @F137_1_healthchecks
Scenario Outline: Implement the resource server Health Check checks
	When the client requests the healthcheck checks in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "<subsystem>" contains
		| field 	| value 		|
		| name 		| <subsystem> 	|
		| type 		| <type> 		|
		| interval  | <interval> 	|

Examples:
	| subsystem							| type			| interval 	|
	| solr 								| subsystem 	| 1000		|
	| jds 								| subsystem 	| 1000  	|				
	| authorization 					| subsystem 	| 1000      |				
	| patientrecord 					| subsystem 	| 1000      |				
	| jdsSync 							| subsystem 	| 2000      |				


@US1117 @F137_2_healthchecks
Scenario: Healthchecks include dependencies
	When the client requests the healthcheck checks in RDK format
	Then a successful response is returned
	Then the RDK healthcheck checks response for "patientrecord" contains dependencies
		| dependency |
		| authorization		 |

@US1117 @F137_1_details
Scenario Outline: Implement the resource server Health Checks details
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "<subsystem>" contains
		| field			| value 			|
		| healthy 		| true  			|
		| type			| <type> 			|
		| check 		| true 				|
		| dependencies  | IS_NOT_SET		|

Examples:
	| subsystem							| type			| 
	| solr 								| subsystem 	| 
	| jds 								| subsystem 	| 				
	| authorization 					| subsystem 	| 				
	| patientrecord 					| subsystem 	| 				
	| jdsSync 							| subsystem 	| 				

@US1117 @F137_2_details
Scenario: Implement the resource server Health Checks details
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "patientrecord" contains
		| field					| value 			|
		| dependencies.authorization 		| true   			|
		

@US1117 @F137_1_execute
Scenario Outline: Implement the resource server Health Checks on demand ( execute )
	When client requests the healthcheck details on demand (execute) in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "<subsystem>" contains
		| field			| value 			|
		| healthy 		| true   			|
		| type			| <type> 			|
		| check 	 	| true 				|
		| dependencies  | IS_NOT_SET		|

Examples:
	| subsystem		| type			|
	| solr 			| subsystem 	|
	| jds 			| subsystem 	|
	| authorization | subsystem 	|
	| patientrecord | subsystem 	|
	| jdsSync 		| subsystem 	|



@US1117 @manual @healthcheck_excute
Scenario:
	When client requests the healthcheck details on demand (execute) in RDK format
	Then "the following subsystems are healthy"
		| subsystem							| 
		| solr 								| 
		| jds 								| 				
		| authorization 					| 			
		| patientrecord 					|  				
		| jdsSync 							| 			
	Given "the user has shut down the solr vm"
	# How to shut down solr vm, gradle stopSolr
	Given "the user has shut down the jds vm"
	Given "the user has shut down the APS vm"
	Given "the user has shut down the ve-api vm"
	Given "the user has shut down the jds vm"
	When client requests the healthcheck details on demand (execute) in RDK format
	Then "the following subsystems are not healthy"
		| subsystem							| 
		| solr 								| 
		| jds 								| 				
		| authorization 					| 			
		| patientrecord 					|  				
		| jdsSync 							| 			

@US1117 @F137_health1b @manual
Scenario: Solr - Implement the resource server Health Checks, solr is unhealthy
	Given "the user has shut down the solr vm"
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "solr" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|

@US1117 @F137_health2b @manual
Scenario: JDS - Implement the resource server Health Checks, jds is unhealthy
	Given "the user has shut down the jds vm"
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "jds" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|

@US1117 @F137_health3b @manual
Scenario: Authorization - Implement the resource server Health Checks, authorization is unhealthy
	Given "the user has shut down the APS vm"
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "authorization" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|
	Then the RDK healthcheck detail response for "patientrecord" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|

@US1117 @F137_health4b @manual
Scenario: Patient Record - Implement the resource server Health Checks, patient record is unhealthy
	Given "the user has shut down the ve-api vm"
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "patientrecord" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|

@US1117 @F137_health5b @manual
Scenario: JDS Sync - Implement the resource server Health Checks, jds sync is in unhealthy
	Given "the user has shut down the jds vm"
	When client requests the healthcheck details in RDK format
	Then a successful response is returned
	Then the RDK healthcheck detail response for "jds-sync" contains
		| field		| value 	|
		| healthy 	| false  	|
		| type		| subsystem |
		| check     | false 	|




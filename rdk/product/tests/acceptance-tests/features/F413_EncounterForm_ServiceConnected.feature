@debug @F413 @encounterform @serviceconnected

Feature: F413 - Enter and Store Encounter Form Data

#POC:Team Pluto

@F413-1.1 @service_connected_rated_disabilities @US6643 @debug
Scenario: A request for Ten,Patient's service connected and rated disabilities successfully returns data
	When the client requests service connected and rated disabilities information for user "9E7A;pu1234" and patient id "9E7A;8"
	Then a successful response is returned
	And the response contains a service connected percentage of "20"
	And the response contains a service connected value of "true"
	And the response contains the following disability
		| field      			 | value                          |
		| disPercent 			 | 10                             |
		| name       			 | AUDITORY CANAL DISEASE         |
		| serviceConnected       | true                    		  |
		| summary       		 | PatientDisability{uid=''}      |
	And the response contains the following disability	
		| field      			 | value                          |
		| disPercent 			 | 30                             |
		| name       			 | SUPRAVENTRICULAR ARRHYTHMIAS   |
		| serviceConnected       | true                    		  |
		| summary       		 | PatientDisability{uid=''}      |

@F413-1.2 @service_connected_rated_disabilities @US6643 @debug
Scenario: A request for Eight,Patient's service connected and rated disabilities returns no data
	When the client requests service connected and rated disabilities information for user "9E7A;pu1234" and patient id "9E7A;3"
	Then a successful response is returned
	And the response contains a service connected percentage of "0"
	And the response contains a service connected value of "NO"
	And the response contains a disability of "NONE STATED"

@F413-2.1 @service_connected_service_exposure @US6643 @debug
Scenario: A request for Ten,Patient's service exposure list successfully returns data
	When the client requests service connected exposure information for user "9E7A;pu1234" and patient id "9E7A;101"
	Then a successful response is returned
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | No                     								|
	    | summary            | PatientExposure{uid='urn:va:agent-orange:N'} 		|
	    | uid              	 | urn:va:agent-orange:N                     			|
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | No                     								|
	    | summary            | PatientExposure{uid='urn:va:ionizing-radiation:N'} 	|
	    | uid              	 | urn:va:ionizing-radiation:N                     		|
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | No                     								|
	    | summary            | PatientExposure{uid='urn:va:sw-asia:N'} 				|
	    | uid              	 | urn:va:sw-asia:N      			               		|
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | Unknown                     							|
	    | summary            | PatientExposure{uid='urn:va:head-neck-cancer:U'}		|
	    | uid              	 | urn:va:head-neck-cancer:U      			            |
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | Unknown                     							|
	    | summary            | PatientExposure{uid='urn:va:mst:U'}					|
	    | uid              	 | urn:va:mst:U      			        			    |
	And the response contains the following exposure
	    | field              | value                  								|
	    | name               | No                     							|
	    | summary            | PatientExposure{uid='urn:va:combat-vet:N'}			|
	    | uid              	 | urn:va:combat-vet:N      			        	    |

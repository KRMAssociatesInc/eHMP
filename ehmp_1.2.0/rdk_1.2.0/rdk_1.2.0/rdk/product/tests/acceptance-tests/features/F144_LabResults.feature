@F144_Lab_Results
Feature: F144 eHMP Viewer GUI-Lab Results
F144 will provide an authorized user the ability to access information through the data domains lab results,  The feature will also support a number of ways to view and select a patient based on different filters values such as the primary care teams’ patient panel, hospital clinics or ward.

@f144_labs_results_rdk_api @US1538a @vxsync @enrich
Scenario: Multiple results should be returned - using only observed from date.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name           				   | date.start | date.end | start | limit |
 		| 10108V420871 | Calcium, Serum or Plasma Quantitative | 2013         |            |       |       |
  	Then a successful response is returned
  	And the client receives 4 result(s)
  	And the VPR results contain
	    | field         | panorama_value          																														 |
		| facilityCode  | DOD                    																														 |
	    | facilityName  | NH Great Lakes IL/0056 																														 |
	    #| observed 	    | 20130411082300         																														 |
	    #| resulted 	    | 20130411112400        																														 |
	    | specimen 	    | PLASMA 																																		 |
	    | orderId       | 2157176269 																																	 |
	    | comment       | 3001 GREENBAY ROAD ATTENTION LABORATORY SERVICES NORTH CHICAGO, IL  60064 556 = NORTH CHICAGO VETERAN'S ADMINISTRATION HOSP Test performed at: |
	    | displayName   | Calcium, Serum or Plasma Quantitative 																										 |
	    | result        | 10.5 																																			 |
	    | units         | mg/dL 																																		 |
	    | interpretationCode | urn:hl7:observation-interpretation:H                                  |
      | interpretationName | High                                                                  |
      | low           | 8.5 																																			 |
	    | high          | 10.1 																																			 |
	    | kind          | Laboratory 																																	 |
	    #| abnormal      | true 																																		 |
	    #| micro         | false 																																		 |
	    #| qualifiedName | Calcium, Serum or Plasma Quantitative (PLASMA) 																								 |
	    #| summary       | Calcium, Serum or Plasma Quantitative (PLASMA) 10.5<em>H</em> mg/dL 																					 |
	    #| statusName    | completed 																																	 |

@f144_labs_results_rdk_api_zero_results @US1538b
Scenario: Zero results should be returned.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name           | date.start | date.end | start | limit |
 		| 10108V420871 | Incorrect Lab Type | 2007         |            |       |       |
  	Then a successful response is returned
  	And the client receives 0 result(s)

@f144_labs_results_rdk_api_unfound_pid @US1538c
Scenario: PID that doesn't exist.
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 	    | type.name | date.start | date.end | start | limit |
 		| noPatient | HDL      | 2013         |            |       |       |
  	Then a non-found response is returned

@f144_labs_results_rdk_api_start @US1538d
Scenario: Limiting the number of results with the 'start' parameter.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            |       |       |
  	Then a successful response is returned
  	And the client receives 22 result(s)
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            | 7     |       |
  	Then a successful response is returned
  	And the client receives "22" total items but only "15" current items

@f144_labs_results_rdk_api_limit @US1538e
Scenario: Limiting the number of results with the 'limit' parameter.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            |       |       |
  	Then a successful response is returned
  	And the client receives 22 result(s)
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            |       | 13    |
  	Then a successful response is returned
    And the client receives "22" total items but only "13" current items

@f144_labs_results_rdk_api_start_limit @US1538f
Scenario: Limiting the number of results with the 'start' and 'limit' parameters.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            |       |       |
  	Then a successful response is returned
  	And the client receives 22 result(s)
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            | 7     | 10    |
  	Then a successful response is returned
  	And the client receives "22" total items but only "10" current items with a start index of "7"

@f144_labs_results_rdk_api_observedTo @US1538g
Scenario: Limiting the number of results with the 'observedTo' parameter.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      |              | 2013       |       |       |
  	Then a successful response is returned
  	And the client receives 24 result(s)

@f144_labs_results_rdk_api_observedFrom_observedTo @US1538h
Scenario: Limiting the number of results with the 'observedFrom' and 'observedTo' parameters.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         |            |       |       |
  	Then a successful response is returned
  	And the client receives 22 result(s)
  	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         | 2008       |       |       |
  	Then a successful response is returned
  	And the client receives 10 result(s)

@f144_labs_results_rdk_api_all_parameters @US1538i
Scenario: Limiting the number of results with all the parameters.
 	Given a patient with pid "10108V420871" has been synced through the RDK API
 	When the client requests a response in VPR format from RDK API with the parameters
 		| pid 		   | type.name | date.start | date.end | start | limit |
 		| 10108V420871 | HDL      | 2007         | 2008       | 3     | 10    |
 	Then a successful response is returned
  	And the client receives "10" total items but only "7" current items with a start index of "3"
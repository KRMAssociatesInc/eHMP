@F137 @future
Feature: F137 SDK Expansion and Enhancement - Create resource for drilling down into search results

@US2390
Scenario: Client can request search results for Laboratory
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Laboratory						|					
		| value 	| LDL CHOLESTEROL (SERUM) 77 MG/DL	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Discharge Summary
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Discharge Summary					|					
		| value 	| 	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Problem
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Problem       					|					
		| value 	| 	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Immunization
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Immunization       				|					
		| value 	| 	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Order
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Laboratory						|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|


@US2390
Scenario: Client can request search results for Outpatient Medication
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Medication, Outpatient			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Consult
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Consult               			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Demographics
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| 			               			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Vitals
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Vital Sign			            |					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Allergy
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Allergy/Adverse Reaction			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Radiology
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Imaging               			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Anatomic Pathology
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Pathology               			|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Clinical Document
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Progress Note               		|					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|

@US2390
Scenario: Client can request search results for Inpatient Medication
	When the client searches
		|field		| value								|
		| pid		| 10110V004877						|
		| grouptype	| Medication, Inpatient             |					
		| value 	|                               	|
	Then a successful response is returned
	Then the response contains 22 results
	And the search results contain
		| field		| firstvalue		|

	And the search results contain
		| field		| secondvalue		|
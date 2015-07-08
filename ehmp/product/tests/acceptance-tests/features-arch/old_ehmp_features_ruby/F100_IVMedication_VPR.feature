@Medication_vpr @vpr

Feature: F100 Return of IV Medications in VPR format 

   
@f100_1_iv_medication_vpr @vpr
Scenario: Client can request IV Medications in VPR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "9E7A;17" has been synced through Admin API
When the client requests medications for the patient "9E7A;17" in VPR format
Then a successful response is returned
Then the client receives 5 VPR "VistA" result(s)
Then the client receives 5 VPR "panorama" result(s)
And the VPR results contain "IV medication results"                                                      
      | field                               | panorama_value                                      |
      | uid                                 | urn:va:med:9E7A:17:7418.1                           |
      | summary                             | CONTAINS DEXTROSE 5% IN WATER INJ,SOLN,POTASSIUM CHLORIDE INJ,SOLN (EXPIRED)\n10 ml/hr|
      | pid                                 | 9E7A;17                                             |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP MASTER                                         |
      | localId                             | 3V;I                                                |  
      | overallStart                        | 199712111500                                        |
      | overallStop                         | 19990111145002                                      |
      | stopped                             | 19990111145002                                      |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:105903003                                   |
      | vaType                              | V                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |      
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4017760                                 |
      | products.ingredientCodeName         | DEXTROSE                                            |
      | products.ingredientName             | DEXTROSE 5% IN WATER INJ,SOLN                       |
      | products.drugClassCode              | urn:vadc:TN101                                      |
      | products.drugClassName              | IV SOLUTIONS WITHOUT ELECTROLYTES                   |
      | products.suppliedCode               | urn:va:vuid:4014924                                 |
      | products.suppliedName               | CONTAINS DEXTROSE 5% INJ,BAG,1000ML                 |
      | products.ingredientRole             | urn:sct:418297009                                   |
      | products.strength                   | 1 MEQ                                               |
      | products.ingredientRXNCode          | urn:rxnorm:4850                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.routeName                   | IV                                                  |
      | dosages.ivRate                      | 10 ml/hr                                            |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:9E7A:17:7418.1                         |
      | orders.ordered                      | 199712111623                                        |
      | orders.providerUid                  | urn:va:user:9E7A:983                                |
      | orders.providerName                 | PROVIDER,ONE                                        |
      | orders.pharmacistUid                | urn:va:user:9E7A:923                                |
      | orders.pharmacistName               | PROGRAMMER,TWENTYEIGHT                              |
      | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | POTASSIUM CHLORIDE INJ,SOLN in DEXTROSE 5% IN WATER INJ,SOLN|
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4017760                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000001                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010582                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010586                      |
      | rxncodes                            | CONTAINS urn:rxnorm:4850                            |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147647                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000006402                      |
      | kind                                | Medication, Infusion                                |
      | IMO                                 | false                                               |
      | name                                | POTASSIUM CHLORIDE INJ,SOLN                         |
      
@f100_2_iv_medication_vpr @vpr
Scenario: Client can request IV Medications in VPR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "C877;17" has been synced through Admin API
When the client requests medications for the patient "C877;17" in VPR format
Then a successful response is returned
Then the client receives 5 VPR "VistA" result(s)
Then the client receives 5 VPR "kodak" result(s)
And the VPR results contain "IV medication results"                                                      
      | field                               | kodak_value                                         |
      | uid                                 | urn:va:med:C877:17:7418.1                           |
      | summary                             | CONTAINS DEXTROSE 5% IN WATER INJ,SOLN,POTASSIUM CHLORIDE INJ,SOLN (EXPIRED)\n10 ml/hr|
      | pid                                 | C877;17                                             |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP BEE	                                          |
      | localId                             | 3V;I                                                |  
      | overallStart                        | 199712111500                                        |
      | overallStop                         | 19990111145002                                      |
      | stopped                             | 19990111145002                                      |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:105903003                                   |
      | vaType                              | V                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |      
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4017760                                 |
      | products.ingredientCodeName         | DEXTROSE                                            |
      | products.ingredientName             | DEXTROSE 5% IN WATER INJ,SOLN                       |
      | products.drugClassCode              | urn:vadc:TN101                                      |
      | products.drugClassName              | IV SOLUTIONS WITHOUT ELECTROLYTES                   |
      | products.suppliedCode               | urn:va:vuid:4014924                                 |
      | products.suppliedName               | CONTAINS DEXTROSE 5% INJ,BAG,1000ML                 |
      | products.ingredientRole             | urn:sct:418297009                                   |
      | products.strength                   | 1 MEQ                                               |
      | products.ingredientRXNCode          | urn:rxnorm:4850                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.routeName                   | IV                                                  |
      | dosages.ivRate                      | 10 ml/hr                                            |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:C877:17:7418.1                         |
      | orders.ordered                      | 199712111623                                        |
      | orders.providerUid                  | urn:va:user:C877:983                                |
      | orders.providerName                 | PROVIDER,ONE                                        |
      | orders.pharmacistUid                | urn:va:user:C877:923                                |
      | orders.pharmacistName               | PROGRAMMER,TWENTYEIGHT                              |
      | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | POTASSIUM CHLORIDE INJ,SOLN in DEXTROSE 5% IN WATER INJ,SOLN|
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4017760                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000001                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010582                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010586                      |
      | rxncodes                            | CONTAINS urn:rxnorm:4850                            |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147647                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000006402                      |
      | kind                                | Medication, Infusion                                |
      | IMO                                 | false                                               |
      | name                                | POTASSIUM CHLORIDE INJ,SOLN                         |

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.

@f100_3_iv_medication_vpr @vpr
Scenario: Client can request medication results in VPR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests medications for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 46 VPR "VistA" result(s)
Then the client receives 23 VPR "panorama" result(s)
And the VPR results contain "IV medication results"

	| field									| value										|
	| uid									| CONTAINS urn:va:med:9E7A:301				|
	| facilityCode							| 515.6										|
	| facilityName							| TROY										|
	| productFormName						| IS_NOT_SET								|
	| sig									| IS_NOT_SET								|
	| vaType								| V											|
	| vaStatus								| DISCONTINUED/EDIT							|
	| overallStart							| 199911011024								|
	| overallStop							| 199911051037								|
	| medStatus								| urn:sct:73425007							|
	| products.ingredientCode				| urn:va:vuid:4022505						|
	| products.ingredientCodeName			| DEXTROSE/POTASSIUM CHLORIDE/SODIUM CHLORIDE|
	| dosages.dose							| IS_NOT_SET								|
	| dosages.doseVal						| IS_NOT_SET								|
	| dosages.ivRate						| 150 ml/hr									|
	| orders.providerName					| WARDCLERK,FIFTYTHREE						|
	| orders.locationName					| GEN MED									|
	| rxncodes								| urn:ndfrt:N0000000001						|  
	
@f100_4_iv_medication_vpr @vpr
Scenario: Client can request medication results in VPR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests medications for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 46 VPR "VistA" result(s)
Then the client receives 23 VPR "kodak" result(s)
And the VPR results contain "IV medication results"

	| field									| value										|
	| uid									| CONTAINS urn:va:med:C877:301				|
	| facilityCode							| 515.6										|
	| facilityName							| TROY										|
	| productFormName						| IS_NOT_SET								|
	| sig									| IS_NOT_SET								|
	| vaType								| V											|
	| vaStatus								| DISCONTINUED/EDIT							|
	| overallStart							| 199911011024								|
	| overallStop							| 199911051037								|
	| medStatus								| urn:sct:73425007							|
	| products.ingredientCode				| urn:va:vuid:4022505						|
	| products.ingredientCodeName			| DEXTROSE/POTASSIUM CHLORIDE/SODIUM CHLORIDE|
	| dosages.dose							| IS_NOT_SET								|
	| dosages.doseVal						| IS_NOT_SET								|
	| dosages.ivRate						| 150 ml/hr									|
	| orders.providerName					| WARDCLERK,FIFTYTHREE						|
	| orders.locationName					| GEN MED									|
	| rxncodes								| urn:ndfrt:N0000000001						|       
      
# negative test case for medication.  already checked as part of inpatient medication.

@f100_5_iv_medication_neg_vpr	
Scenario: Negative scenario.  Client can request medication results in VPR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests medications for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed

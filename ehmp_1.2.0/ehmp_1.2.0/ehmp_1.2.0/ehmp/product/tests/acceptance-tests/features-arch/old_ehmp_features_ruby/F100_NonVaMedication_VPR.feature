@Medication_vpr @vpr
Feature: F100 Return of Non-VA Medications in VPR format 

#This feature item returns Non-VA Medications in VPR format. Also includes cases where no Non-VA Medications exist.

   
@f100_1_nonva_medication_vpr @vpr
Scenario: Client can request Non-VA Medications in VPR format
Given a patient with "non-va medication results" in multiple VistAs
Given a patient with pid "10118V572553" has been synced through Admin API
When the client requests medications for the patient "10118V572553" in VPR format
Then a successful response is returned
Then the client receives 38 VPR "VistA" result(s)
Then the client receives 19 VPR "panorama" result(s)
And the VPR results contain "non-va medication results"                                                      
      | field                               | panorama_value                                      |
      | uid                                 | urn:va:med:9E7A:149:18028                           |
      | summary                             | ASPIRIN 81MG TAB,EC (ACTIVE)\n TAKE ONE TABLET BY MOUTH EVERY MORNING |
      | pid                                 | CONTAINS ;149                                               |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP MASTER                                         |
      | localId                             | 1N;O                                                |
      | productFormName                     | TAB,EC                                              |
      | sig                                 | TAKE ONE TABLET BY MOUTH EVERY MORNING              |
      | overallStart                        | 200704111613                                        |
      | overallStop                         | 200704111613                                        |
      | medStatus                           | urn:sct:55561003                                    |
      | medStatusName                       | active                                              |
      | medType                             | urn:sct:329505003                                   |
      | vaType                              | N                                                   |
      | vaStatus                            | ACTIVE                                              |
      | supply                              | false                                               |
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4017536                                 |
      | products.ingredientCodeName         | ASPIRIN                                             |
      | products.ingredientName             | ASPIRIN TAB,EC                                      |
      | products.drugClassCode              | urn:vadc:CN103                                      |
      | products.drugClassName              | NON-OPIOID ANALGESICS                               |
      | products.suppliedCode               | urn:va:vuid:4005766                                 |
      | products.suppliedName               | ASPIRIN 81MG TAB,EC                                 |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 81 MG                                               |
      | products.ingredientRXNCode          | urn:rxnorm:1191                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | 81                                                  |
      | dosages.units                       | MG                                                  |
      | dosages.routeName                   | PO                                                  |
      | dosages.scheduleName                | QAM                                                 |
      | dosages.scheduleType                | CONTINUOUS                                          |   
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 0                                                   |
      | dosages.scheduleFreq                | 1440                                                |
      | dosages.startDateString             | Start                                               |
      | dosages.stopDateString              | Start                                               |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:9E7A:149:18028                         |
      | orders.ordered                      | 200704111613                                        |
      | orders.providerUid                  | urn:va:user:9E7A:10000000031                        |
      | orders.providerName                 | VEHU,ONEHUNDRED                                     |
      | orders.locationName                 | GENERAL MEDICINE                                    | 
      | orders.locationUid                  | urn:va:location:9E7A:23                             |
	  | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | ASPIRIN TAB,EC                                      |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4017536                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000002                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007676                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000185640                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007628                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000005901                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000006035                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000008137                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000145918                      |
      | rxncodes                            | CONTAINS urn:rxnorm:1191                            |        
      | units                               | MG                                                  |
      | kind                                | Medication, Non-VA                                  |
      | IMO                                 | false                                               |
      | name                                | ASPIRIN TAB,EC                                      |
      | type                                | OTC                                                 |
      
@f100_2_nonva_medication_vpr @vpr
Scenario: Client can request Non-VA Medications in VPR format
Given a patient with "non-va medication results" in multiple VistAs
Given a patient with pid "10118V572553" has been synced through Admin API
When the client requests medications for the patient "10118V572553" in VPR format
Then a successful response is returned
Then the client receives 38 VPR "VistA" result(s)
Then the client receives 19 VPR "kodak" result(s)
And the VPR results contain "non-va medication results"                                                      
      | field                               | kodak_value                                         |
      | uid                                 | urn:va:med:C877:149:18028                           |
      | summary                             | ASPIRIN 81MG TAB,EC (ACTIVE)\n TAKE ONE TABLET BY MOUTH EVERY MORNING |
      | pid                                 | CONTAINS ;149                                       |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP BEE                                            |
      | localId                             | 1N;O                                                |
      | productFormName                     | TAB,EC                                              |
      | sig                                 | TAKE ONE TABLET BY MOUTH EVERY MORNING              |
      | overallStart                        | 200704111613                                        |
      | overallStop                         | 200704111613                                        |
      | medStatus                           | urn:sct:55561003                                    |
      | medStatusName                       | active                                              |
      | medType                             | urn:sct:329505003                                   |
      | vaType                              | N                                                   |
      | vaStatus                            | ACTIVE                                              |
      | supply                              | false                                               |
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4017536                                 |
      | products.ingredientCodeName         | ASPIRIN                                             |
      | products.ingredientName             | ASPIRIN TAB,EC                                      |
      | products.drugClassCode              | urn:vadc:CN103                                      |
      | products.drugClassName              | NON-OPIOID ANALGESICS                               |
      | products.suppliedCode               | urn:va:vuid:4005766                                 |
      | products.suppliedName               | ASPIRIN 81MG TAB,EC                                 |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 81 MG                                               |
      | products.ingredientRXNCode          | urn:rxnorm:1191                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | 81                                                  |
      | dosages.units                       | MG                                                  |
      | dosages.routeName                   | PO                                                  |
      | dosages.scheduleName                | QAM                                                 |
      | dosages.scheduleType                | CONTINUOUS                                          |   
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 0                                                   |
      | dosages.scheduleFreq                | 1440                                                |
      | dosages.startDateString             | Start                                               |
      | dosages.stopDateString              | Start                                               |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:C877:149:18028                         |
      | orders.ordered                      | 200704111613                                        |
      | orders.providerUid                  | urn:va:user:C877:10000000031                        |
      | orders.providerName                 | VEHU,ONEHUNDRED                                     |
      | orders.locationName                 | GENERAL MEDICINE                                    | 
      | orders.locationUid                  | urn:va:location:C877:23                             |
	  | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | ASPIRIN TAB,EC                                      |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4017536                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000002                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007676                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000185640                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007628                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000005901                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000006035                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000008137                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000145918                      |
      | rxncodes                            | CONTAINS urn:rxnorm:1191                            |        
      | units                               | MG                                                  |
      | kind                                | Medication, Non-VA                                  |
      | IMO                                 | false                                               |
      | name                                | ASPIRIN TAB,EC                                      |
      | type                                | OTC                                                 |

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.

@f100_3_nonva_medication_vpr @vpr
Scenario: Client can request medication results in VPR format
Given a patient with "non-va medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests medications for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 46 VPR "VistA" result(s)
Then the client receives 23 VPR "panorama" result(s)
And the VPR results contain "non-va medication results" 

	| field									| value										|
	| uid									| CONTAINS urn:va:med:9E7A:301				|
	| facilityCode							| 500										|
	| facilityName							| CAMP MASTER								|
	| productFormName						| TAB,EC									|
	| sig									| TAKE ONE TABLET BY MOUTH EVERY MORNING	|
	| vaType								| N											|
	| vaStatus								| ACTIVE									|
	| overallStart							| 200704111528								|
	| overallStop							| 200704111528								|
	| medStatus								| urn:sct:55561003							|
	| products.ingredientCode				| urn:va:vuid:4017536						|
	| products.ingredientCodeName			| ASPIRIN									|
	| orders.providerName					| VEHU,ONEHUNDRED							|
	| orders.locationName					| GENERAL MEDICINE							|
	| dosages.dose							| 81 										|
	| dosages.units							| MG										|
	| dosages.scheduleName					| QAM										|  
	| fills.dispenseDate					| IS_NOT_SET								|
	| fills.quantityDispensed				| IS_NOT_SET								|
	| rxncodes								| urn:ndfrt:N0000007676						| 
	
@f100_4_nonva_medication_vpr @vpr
Scenario: Client can request Non-VA Medications in VPR format
Given a patient with "non-va medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests medications for the patient "10146V393772" in VPR format
Then a successful response is returned
Then the client receives 46 VPR "VistA" result(s)
Then the client receives 23 VPR "kodak" result(s)
And the VPR results contain "non-va medication results" 

	| field									| value										|
	| uid									| CONTAINS urn:va:med:C877:301				|
	| facilityCode							| 500										|
	| facilityName							| CAMP BEE									|
	| productFormName						| TAB,EC									|
	| sig									| TAKE ONE TABLET BY MOUTH EVERY MORNING	|
	| vaType								| N											|
	| vaStatus								| ACTIVE									|
	| overallStart							| 200704111528								|
	| overallStop							| 200704111528								|
	| medStatus								| urn:sct:55561003							|
	| products.ingredientCode				| urn:va:vuid:4017536						|
	| products.ingredientCodeName			| ASPIRIN									|
	| orders.providerName					| VEHU,ONEHUNDRED							|
	| orders.locationName					| GENERAL MEDICINE							|
	| dosages.dose							| 81										|
	| dosages.units							| MG										|
	| dosages.scheduleName					| QAM										|  
	| fills.dispenseDate					| IS_NOT_SET								|
	| fills.quantityDispensed				| IS_NOT_SET								|
	| rxncodes								| urn:ndfrt:N0000007676						| 

# negative test case for medication.  already tested as part of inpatient medication

@f100_5_nonva_medication_neg_vpr	
Scenario: Negative scenario.  Client can request medication results in VPR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests medications for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed


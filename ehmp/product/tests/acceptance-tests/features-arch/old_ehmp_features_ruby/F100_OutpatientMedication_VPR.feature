@Medication_vpr @vpr
Feature: F100 Return of Outpatient Medications in VPR format

#This feature item returns Outpatient Medications in VPR format. Also includes cases where no Outpatient Medications exist.

   
@f100_1_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "5000000318V495398" has been synced through Admin API
When the client requests medications for the patient "5000000318V495398" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 1 VPR "panorama" result(s)
And the VPR results contain "outpatient medication results"                                                      
      | field                               | panorama_value                                      |
      | uid                                 | urn:va:med:9E7A:100817:27831                        |
      | summary                             | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
      | pid                                 | CONTAINS ;100817                                         |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP MASTER                                         |
      | localId                             | 403827;O                                            |
      | productFormName                     | TAB                                                 |
      | sig                                 | TAKE ONE TABLET BY MOUTH TWICE A DAY                |
      | patientInstruction                  | EMPTY                                               |
      | overallStart                        | 20090810                                            |
      | overallStop                         | 20100811                                            |
      | stopped                             | 20100811                                            |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:73639000                                    |
      | vaType                              | O                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4019380                                 |
      | products.ingredientCodeName         | LISINOPRIL                                          |
      | products.ingredientName             | LISINOPRIL TAB                                      |
      | products.drugClassCode              | urn:vadc:CV800                                      |
      | products.drugClassName              | ACE INHIBITORS                                      |
      | products.suppliedCode               | urn:va:vuid:4008593                                 |
      | products.suppliedName               | LISINOPRIL 10MG TAB                                 |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 10 MG                                               |
      | products.ingredientRXNCode          | urn:rxnorm:29046                                    |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | 10                                                  |
      | dosages.units                       | MG                                                  |
      | dosages.routeName                   | PO                                                  |
      | dosages.scheduleName                | BID                                                 |
      | dosages.scheduleType                | CONTINUOUS                                          |   
      | dosages.start                       | 20090810                                            |
      | dosages.stop                        | 20100811                                            |
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 527040                                              |
      | dosages.scheduleFreq                | 720                                                 |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:9E7A:100817:27831                      |
      | orders.prescriptionId               | 500605                                              |
      | orders.ordered                      | 200908101738                                        |
      | orders.providerUid                  | urn:va:user:9E7A:20010                              |
      | orders.providerName                 | VEHU,EIGHT                                          |
      | orders.pharmacistUid                | urn:va:user:9E7A:20117                              |
      | orders.pharmacistName               | PHARMACIST,THREE                                    |
      | orders.fillCost                     | 3.75                                                |
      | orders.quantityOrdered              | 60                                                  |
      | orders.daysSupply                   | 30                                                  |
      | orders.fillsAllowed                 | 11                                                  |
      | orders.fillsRemaining               | 11                                                  |
      | orders.vaRouting                    | W                                                   |
      | fills.summary                       | MedicationFill{uid='null'}                          |
      | fills.dispenseDate                  | 20090810                                            |
      | fills.quantityDispensed             | 60                                                  |
      | fills.daysSupplyDispensed           | 30                                                  |
      | fills.routing                       | W                                                   |
      | lastFilled                          | 20090810                                            |
      | qualifiedName                       | LISINOPRIL TAB                                      |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4019380                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007697                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007833                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000002                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007874                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007507                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147537                      |
      | rxncodes                            | CONTAINS urn:rxnorm:29046                           |
      | units                               | MG                                                  |
      | kind                                | Medication, Outpatient                              |
      | IMO                                 | false                                               |
      | name                                | LISINOPRIL TAB                                      |
      | type                                | Prescription                                        |
      
@f100_2_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "9E7A;1" has been synced through Admin API
When the client requests medications for the patient "9E7A;1" in VPR format
Then a successful response is returned
Then the client receives 109 VPR "VistA" result(s)
Then the client receives 109 VPR "panorama" result(s)
And the VPR results contain "outpatient medication results"     
      | field                               | panorama_value                                      |
      | orders.locationName                 | GEN MED                                             | 
      | orders.locationUid                  | urn:va:location:9E7A:9                              |
And the VPR results contain "outpatient medication results" 
      | releaseDate                         | 20000216                                            |
      
@f100_3_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "5000000318V495398" has been synced through Admin API
When the client requests medications for the patient "5000000318V495398" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 1 VPR "kodak" result(s)
And the VPR results contain "outpatient medication results"                                                      
      | field                               | kodak_value                                         |
      | uid                                 | urn:va:med:C877:100817:27831                        |
      | summary                             | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
      | pid                                 | CONTAINS ;100817                                    |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP BEE	                                          |
      | localId                             | 403827;O                                            |
      | productFormName                     | TAB                                                 |
      | sig                                 | TAKE ONE TABLET BY MOUTH TWICE A DAY                |
      | patientInstruction                  | EMPTY                                               |
      | overallStart                        | 20090810                                            |
      | overallStop                         | 20100811                                            |
      | stopped                             | 20100811                                            |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:73639000                                    |
      | vaType                              | O                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4019380                                 |
      | products.ingredientCodeName         | LISINOPRIL                                          |
      | products.ingredientName             | LISINOPRIL TAB                                      |
      | products.drugClassCode              | urn:vadc:CV800                                      |
      | products.drugClassName              | ACE INHIBITORS                                      |
      | products.suppliedCode               | urn:va:vuid:4008593                                 |
      | products.suppliedName               | LISINOPRIL 10MG TAB                                 |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 10 MG                                               |
      | products.ingredientRXNCode          | urn:rxnorm:29046                                    |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | 10                                                  |
      | dosages.units                       | MG                                                  |
      | dosages.routeName                   | PO                                                  |
      | dosages.scheduleName                | BID                                                 |
      | dosages.scheduleType                | CONTINUOUS                                          |   
      | dosages.start                       | 20090810                                            |
      | dosages.stop                        | 20100811                                            |
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 527040                                              |
      | dosages.scheduleFreq                | 720                                                 |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:C877:100817:27831                      |
      | orders.prescriptionId               | 500605                                              |
      | orders.ordered                      | 200908101738                                        |
      | orders.providerUid                  | urn:va:user:C877:20010                              |
      | orders.providerName                 | VEHU,EIGHT                                          |
      | orders.pharmacistUid                | urn:va:user:C877:20117                              |
      | orders.pharmacistName               | PHARMACIST,THREE                                    |
      | orders.fillCost                     | 3.75                                                |
      | orders.quantityOrdered              | 60                                                  |
      | orders.daysSupply                   | 30                                                  |
      | orders.fillsAllowed                 | 11                                                  |
      | orders.fillsRemaining               | 11                                                  |
      | orders.vaRouting                    | W                                                   |
      | fills.summary                       | MedicationFill{uid='null'}                          |
      | fills.dispenseDate                  | 20090810                                            |
      | fills.quantityDispensed             | 60                                                  |
      | fills.daysSupplyDispensed           | 30                                                  |
      | fills.routing                       | W                                                   |
      | lastFilled                          | 20090810                                            |
      | qualifiedName                       | LISINOPRIL TAB                                      |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4019380                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007697                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007833                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000002                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007874                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000007507                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147537                      |
      | rxncodes                            | CONTAINS urn:rxnorm:29046                           |
      | units                               | MG                                                  |
      | kind                                | Medication, Outpatient                              |
      | IMO                                 | false                                               |
      | name                                | LISINOPRIL TAB                                      |
      | type                                | Prescription                                        |
      
@f100_4_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "C877;1" has been synced through Admin API
When the client requests medications for the patient "C877;1" in VPR format
Then a successful response is returned
Then the client receives 109 VPR "VistA" result(s)
Then the client receives 109 VPR "kodak" result(s)
And the VPR results contain "outpatient medication results"     
      | field                               | kodak_value                                         |
      | orders.locationName                 | GEN MED                                             | 
      | orders.locationUid                  | urn:va:location:C877:9                              |
And the VPR results contain "outpatient medication results" 
      | releaseDate                         | 20000216                                            |

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.
      
@f100_5_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "9E7A;167" has been synced through Admin API
When the client requests medications for the patient "9E7A;167" in VPR format
Then a successful response is returned
Then the client receives 3 VPR "VistA" result(s)
Then the client receives 3 VPR "panorama" result(s)
And the VPR results contain "outpatient medication results"   

	| field									| value										|
	| pid									| 9E7A;167									|
	| facilityCode							| 500										|
	| facilityName							| CAMP MASTER								|
	| productFormName						| SUPP,RTL									|
	| sig									| TAKE 1 TABLET(S) BY BY MOUTH EVERY 4 HOURS|
	| vaType								| O											|
	| vaStatus								| EXPIRED									|
	| overallStart							| 20000126									|
	| overallStop							| 20010126									|
	| medStatus								| urn:sct:392521001							|
	| products.ingredientCode				| urn:va:vuid:4017513						|
	| products.ingredientCodeName			| ACETAMINOPHEN								|
	| orders.providerName					| PROGRAMMER,TWENTYEIGHT					|
	| orders.locationName					| GENERAL MEDICINE							|
	| fills.dispenseDate					| 20000126									|
	| fills.quantityDispensed				| 100										|
	| rxncodes								| urn:vandf:4017513							| 
	
And the VPR results contain "outpatient medication results" 
	| dosages.dose							| EMPTY										|
	| dosages.doseVal						| IS_NOT_SET								|
	| dosages.scheduleName					| Q4H										| 
	
@f100_6_out_medication_vpr @vpr
Scenario: Client can request Outpatient Medications in VPR format
Given a patient with "outpatient medication results" in multiple VistAs
Given a patient with pid "C877;167" has been synced through Admin API
When the client requests medications for the patient "C877;167" in VPR format
Then a successful response is returned
Then the client receives 3 VPR "VistA" result(s)
Then the client receives 3 VPR "kodak" result(s)
And the VPR results contain "outpatient medication results"   

	| field									| value										|
	| pid									| C877;167									|
	| facilityCode							| 500										|
	| facilityName							| CAMP BEE									|
	| productFormName						| SUPP,RTL									|
	| sig									| TAKE 1 TABLET(S) BY BY MOUTH EVERY 4 HOURS|
	| vaType								| O											|
	| vaStatus								| EXPIRED									|
	| overallStart							| 20000126									|
	| overallStop							| 20010126									|
	| medStatus								| urn:sct:392521001							|
	| products.ingredientCode				| urn:va:vuid:4017513						|
	| products.ingredientCodeName			| ACETAMINOPHEN								|
	| orders.providerName					| PROGRAMMER,TWENTYEIGHT					|
	| orders.locationName					| GENERAL MEDICINE							|
	| fills.dispenseDate					| 20000126									|
	| fills.quantityDispensed				| 100										|
	| rxncodes								| urn:vandf:4017513							| 
	
And the VPR results contain "outpatient medication results" 
	| dosages.dose							| EMPTY										|
	| dosages.doseVal						| IS_NOT_SET								|
	| dosages.scheduleName					| Q4H										| 
	
# negative test case for medication.  already run as part of inpatientmedication_vpr

@f100_7_out_medication_neg_vpr
Scenario: Negative scenario.  Client can request medication results in VPR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests medications for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed
	

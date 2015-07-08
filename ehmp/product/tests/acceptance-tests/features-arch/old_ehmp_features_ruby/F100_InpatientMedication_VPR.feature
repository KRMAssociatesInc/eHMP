@Medication_vpr @vpr

Feature: F100 Return of Inpatient Medications results in VPR format 

#This feature item returns Inpatient Medications in VPR format. Also includes cases where no Inpatient Medications exist.

   
@f100_1_in_medication_vpr @vpr
Scenario: Client can request Inpatient Medications in VPR format
Given a patient with "inpatient medication results" in multiple VistAs
Given a patient with pid "9E7A;100033" has been synced through Admin API
When the client requests medications for the patient "9E7A;100033" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 2 VPR "panorama" result(s)
And the VPR results contain "inpatient medication results"                                                      
      | field                               | panorama_value                                      |
      | uid                                 | urn:va:med:9E7A:100033:17694                        |
      | summary                             | INSULIN NOVOLIN N(NPH) INJ (EXPIRED)\n Give: 8 UNITS SC QD |
      | pid                                 | 9E7A;100033                                         |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP MASTER                                         |
      | localId                             | 2U;I                                                |
      | productFormName                     | INJ                                                 |
      | sig                                 | Give: 8 UNITS SC QD                                 |      
      | overallStart                        | 200606161100                                        |
      | overallStop                         | 200609250000                                        |
      | stopped                             | 200609250000                                        |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:105903003                                   |
      | vaType                              | I                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |      
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4019786                                 |
      | products.ingredientCodeName         | INSULIN                                             |
      | products.ingredientName             | INSULIN NOVOLIN N(NPH) INJ                          |
      | products.drugClassCode              | urn:vadc:HS501                                      |
      | products.drugClassName              | INSULIN                                             |
      | products.suppliedCode               | urn:va:vuid:4001483                                 |
      | products.suppliedName               | INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N            |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 100 UNIT/ML                                         |
      | products.ingredientRXNCode          | urn:rxnorm:5856                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | EMPTY                                               |
      | dosages.units                       | 43                                                  |
      | dosages.routeName                   | SC                                                  |
      | dosages.scheduleName                | QD                                                  |
      | dosages.start                       | 200606161100                                        |
      | dosages.stop                        | 200609250000                                        |
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 144780                                              |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:9E7A:100033:17694                      |
      | orders.ordered                      | 200606161238                                        |
      | orders.providerUid                  | urn:va:user:9E7A:10958                              |
      | orders.providerName                 | WARDCLERK,FIFTYTHREE                                |
      | orders.pharmacistUid                | urn:va:user:9E7A:10000000047                        |
      | orders.pharmacistName               | LABTECH,FIFTYSEVEN                                  |
      | orders.locationName                 | BCMA                                                |
      | orders.locationUid                  | urn:va:location:9E7A:11                             |
      | orders.predecessor                  | urn:va:med:9E7A:100033:17693                        |
      | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | INSULIN NOVOLIN N(NPH) INJ                          |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4019786                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010574                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000029177                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000001                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000029183                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000004931                      |
      | rxncodes                            | CONTAINS urn:rxnorm:5856                            |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147876                      | 
      | units                               | 43                                                  |
      | kind                                | Medication, Inpatient                               |
      | IMO                                 | false                                               |
      | name                                | INSULIN NOVOLIN N(NPH) INJ                          |
 And the VPR results contain "inpatient medication results"  
      | orders.successor                    | urn:va:med:9E7A:100033:17694                        |
			      
@f100_2_in_medication_vpr @vpr
Scenario: Client can request Inpatient Medications in VPR format
Given a patient with "inpatient medication results" in multiple VistAs
Given a patient with pid "100031V310296" has been synced through Admin API
When the client requests medications for the patient "100031V310296" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 2 VPR "kodak" result(s)
And the VPR results contain "inpatient medication results"                                                      
      | field                               | kodak_value                                         |
      | uid                                 | urn:va:med:C877:100033:17694                        |
      | summary                             | INSULIN NOVOLIN N(NPH) INJ (EXPIRED)\n Give: 8 UNITS SC QD |
      | pid                                 | C877;100033                                         |
      | facilityCode                        | 500                                                 |
      | facilityName                        | CAMP BEE                                            |
      | localId                             | 2U;I                                                |
      | productFormName                     | INJ                                                 |
      | sig                                 | Give: 8 UNITS SC QD                                 |      
      | overallStart                        | 200606161100                                        |
      | overallStop                         | 200609250000                                        |
      | stopped                             | 200609250000                                        |
      | medStatus                           | urn:sct:392521001                                   |
      | medStatusName                       | historical                                          |
      | medType                             | urn:sct:105903003                                   |
      | vaType                              | I                                                   |
      | vaStatus                            | EXPIRED                                             |
      | supply                              | false                                               |      
      | products.summary                    | MedicationProduct{uid='null'}                       |
      | products.ingredientCode             | urn:va:vuid:4019786                                 |
      | products.ingredientCodeName         | INSULIN                                             |
      | products.ingredientName             | INSULIN NOVOLIN N(NPH) INJ                          |
      | products.drugClassCode              | urn:vadc:HS501                                      |
      | products.drugClassName              | INSULIN                                             |
      | products.suppliedCode               | urn:va:vuid:4001483                                 |
      | products.suppliedName               | INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N            |
      | products.ingredientRole             | urn:sct:410942007                                   |
      | products.strength                   | 100 UNIT/ML                                         |
      | products.ingredientRXNCode          | urn:rxnorm:5856                                     |
      | dosages.summary                     | MedicationDose{uid='null'}                          |
      | dosages.dose                        | EMPTY                                               |
      | dosages.units                       | 43                                                  |
      | dosages.routeName                   | SC                                                  |
      | dosages.scheduleName                | QD                                                  |
      | dosages.start                       | 200606161100                                        |
      | dosages.stop                        | 200609250000                                        |
      | dosages.relativeStart               | 0                                                   |
      | dosages.relativeStop                | 144780                                              |
      | orders.summary                      | MedicationOrder{uid='null'}                         |
      | orders.orderUid                     | urn:va:order:C877:100033:17694                      |
      | orders.ordered                      | 200606161238                                        |
      | orders.providerUid                  | urn:va:user:C877:10958                              |
      | orders.providerName                 | WARDCLERK,FIFTYTHREE                                |
      | orders.pharmacistUid                | urn:va:user:C877:10000000047                        |
      | orders.pharmacistName               | LABTECH,FIFTYSEVEN                                  |
      | orders.locationName                 | BCMA                                                |
      | orders.locationUid                  | urn:va:location:C877:11                             |
      | orders.predecessor                  | urn:va:med:C877:100033:17693                        |
      | fills                               | IS_NOT_SET                                          |
      | qualifiedName                       | INSULIN NOVOLIN N(NPH) INJ                          |
      | administrations                     | IS_NOT_SET                                          |
      | rxncodes                            | CONTAINS urn:vandf:4019786                          |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000010574                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000029177                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000000001                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000029183                      |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000004931                      |
      | rxncodes                            | CONTAINS urn:rxnorm:5856                            |
      | rxncodes                            | CONTAINS urn:ndfrt:N0000147876                      | 
      | units                               | 43                                                  |
      | kind                                | Medication, Inpatient                               |
      | IMO                                 | false                                               |
      | name                                | INSULIN NOVOLIN N(NPH) INJ                          |
 And the VPR results contain "inpatient medication results"  
      | orders.successor                    | urn:va:med:C877:100033:17694                        |

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.
      
@f100_3_in_medication_vpr @vpr
Scenario: Client can request Inpatient Medications in VPR format
Given a patient with "inpatient medication results" in multiple VistAs
Given a patient with pid "5000000341V359724" has been synced through Admin API
When the client requests medications for the patient "5000000341V359724" in VPR format
Then a successful response is returned
#Then the client receives 3 VPR "VistA" result(s)
#Then the client receives 3 VPR "panorama" result(s)
#changed counts for Cache update
Then the client receives 32 VPR "VistA" result(s)
Then the client receives 16 VPR "panorama" result(s)
And the VPR results contain "inpatient medication results" 
	|field									| value										|
	| pid									| 9E7A;100022								|
	| facilityCode							| 500										|
	| facilityName							| CAMP MASTER								|
	| productFormName						| TAB										|
	| sig									| Give: 325MG PO Q4H						|
	| vaType								| I											|
	| vaStatus								| EXPIRED									|
	| overallStart							| 200606161231								|
	| overallStop							| 200609250000								|
	| medStatus								| urn:sct:392521001							|
	| products.ingredientCode				| urn:va:vuid:4017513						|
	| products.ingredientCodeName			| ACETAMINOPHEN								|
	| dosages.dose							| EMPTY										|
	| dosages.scheduleName					| Q4H										|
	| orders.providerName					| PHYSICIAN,ASSISTANT						|
	| orders.locationName					| BCMA										|
	| rxncodes								| urn:ndfrt:N0000000002						|
      
@f100_4_in_medication_vpr @vpr
Scenario: Client can request Inpatient Medications in VPR format
Given a patient with "inpatient medication results" in multiple VistAs
Given a patient with pid "5000000341V359724" has been synced through Admin API
When the client requests medications for the patient "5000000341V359724" in VPR format
Then a successful response is returned
#Then the client receives 3 VPR "VistA" result(s)
#Then the client receives 3 VPR "kodak" result(s)
#changed counts for Cache update
Then the client receives 32 VPR "VistA" result(s)
Then the client receives 16 VPR "kodak" result(s)
And the VPR results contain "inpatient medication results" 
	|field									| value										|
	| pid									| C877;100022								|
	| facilityCode							| 500										|
	| facilityName							| CAMP BEE									|
	| productFormName						| TAB										|
	| sig									| Give: 325MG PO Q4H						|
	| vaType								| I											|
	| vaStatus								| EXPIRED									|
	| overallStart							| 200606161231								|
	| overallStop							| 200609250000								|
	| medStatus								| urn:sct:392521001							|
	| products.ingredientCode				| urn:va:vuid:4017513						|
	| products.ingredientCodeName			| ACETAMINOPHEN								|
	| dosages.dose							| EMPTY										|
	| dosages.scheduleName					| Q4H										|
	| orders.providerName					| PHYSICIAN,ASSISTANT						|
	| orders.locationName					| BCMA										|
	| rxncodes								| urn:ndfrt:N0000000002						|

# negative test case for medication.

@f100_5_in_medication_neg_vpr	
Scenario: Negative scenario.  Client can request medication results in VPR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests medications for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed

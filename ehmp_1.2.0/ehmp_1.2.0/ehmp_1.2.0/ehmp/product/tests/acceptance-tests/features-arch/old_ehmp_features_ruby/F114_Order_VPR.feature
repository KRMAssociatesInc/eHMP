@order_vpr @vpr

Feature: F114 Return Orders in VPR format

#This feature item returns Orders in VPR format.
 

	
@f114_1_order_vpr @vpr
Scenario: Client can request Orders in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "5000000009V082878" has been synced through Admin API
	When the client requests order results for the patient "5000000009V082878" in VPR format
	Then a successful response is returned
	Then the client receives 4 VPR "VistA" result(s)
	Then the client receives 2 VPR "panorama" result(s)
	And the VPR results contain "order results"                                                      
  
	   | field                                    | panorama_value                                         | 
	   | uid                                      | urn:va:order:9E7A:100125:14268                         |
	   | summary                                  | CONTAINS Cleanse wound with betadine and cover with    |
	   | pid                                      | CONTAINS ;100125                                             |
	   | localId                                  | 14268                                                  |
	   | facilityCode                             | 998                                                    |
	   | facilityName                             | ABILENE (CAA)                                          |
	   | locationName                             | 3 NORTH SURG                                           |
	   | content                                  | CONTAINS Cleanse wound with betadine and cover with    |
	   | entered                                  | 200304272024                                           |
	   | start                                    | 200304272024                                           |
	   | displayGroup                             | NURS                                                   |
	   | statusCode                               | urn:va:order-status:actv                               |
	   | statusName                               | ACTIVE                                                 |
	   | statusVuid                               | urn:va:vuid:4500659                                    |
	   | providerUid                              | urn:va:user:9E7A:20001                                 |
	   | providerName                             | VEHU,ONE                                               |
	   | providerDisplayName                      | Vehu,One                                               |
	   | service                                  | OR                                                     |
	   | kind                                     | Nursing Order                                          |
	   | locationUid                              | urn:va:location:9E7A:5                                 |
	   | clinicians.name                          | VEHU,ONE                                               |
	   | clinicians.role                          | S                                                      |
	   | clinicians.signedDateTime                | 200304272024                                           |
	   | clinicians.uid                           | urn:va:user:9E7A:20001                                 |
	   
@f114_2_order_vpr @vpr
Scenario: Client can request Orders in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "9E7A;164" has been synced through Admin API
	When the client requests order results for the patient "9E7A;164" in VPR format
	Then a successful response is returned
	Then the client receives 13 VPR "VistA" result(s)
	Then the client receives 13 VPR "panorama" result(s)
	And the VPR results contain "order results"
		| field										| panorama_value							|
		| children.uid    							| urn:va:order:9E7A:164:10805				|
		| children.summary							| CONTAINS CALCIUM BLOOD   SERUM WC LB		|
		| children.localId							| 10805										|
		| children.facilityCode						| 515.6										|
		| children.facilityName						| TROY										|
		| children.locationName						| GEN MED									|
		| children.name								| CALCIUM									|
		| children.oiCode							| urn:va:oi:296								|					
		| children.oiName							| CALCIUM									|
		| children.oiPackageRef						| 180;99LRT									|
		| children.content							| CONTAINS CALCIUM BLOOD   SERUM WC LB		|
		| children.entered							| 199911031716								|
		| children.start							| 199911031718								|
		| children.displayGroup						| CH										|
		| children.statusCode						| urn:va:order-status:pend					|
		| children.statusName						| PENDING									|
		| children.statusVuid						| urn:va:vuid:4501114						|
		| children.providerUid						| urn:va:user:9E7A:11710					|
		| children.providerName						| PROVIDER,TWOHUNDREDNINETYFIVE				|
		| children.providerDisplayName				| Provider,Twohundredninetyfive				|
		| children.service							| LR										|
		| children.kind								| Laboratory								|
		| children.locationUid						| urn:va:location:9E7A:9					|

@f114_3_order_vpr @vpr
Scenario: Client can request Orders in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "5000000009V082878" has been synced through Admin API
	When the client requests order results for the patient "5000000009V082878" in VPR format
	Then a successful response is returned
	Then the client receives 4 VPR "VistA" result(s)
	Then the client receives 2 VPR "kodak" result(s)
	And the VPR results contain "order results"                                                      
	  
	   | field                                    | kodak_value                                            | 
	   | uid                                      | urn:va:order:C877:100125:14268                         |
	   | summary                                  | CONTAINS Cleanse wound with betadine and cover with    |
	   | pid                                      | CONTAINS ;100125                                       |
	   | localId                                  | 14268                                                  |
	   | facilityCode                             | 998                                                    |
	   | facilityName                             | ABILENE (CAA)                                          |
	   | locationName                             | 3 NORTH SURG                                           |
	   | content                                  | CONTAINS Cleanse wound with betadine and cover with    |
	   | entered                                  | 200304272024                                           |
	   | start                                    | 200304272024                                           |
	   | displayGroup                             | NURS                                                   |
	   | statusCode                               | urn:va:order-status:actv                               |
	   | statusName                               | ACTIVE                                                 |
	   | statusVuid                               | urn:va:vuid:4500659                                    |
	   | providerUid                              | urn:va:user:C877:20001                                 |
	   | providerName                             | VEHU,ONE                                               |
	   | providerDisplayName                      | Vehu,One                                               |
	   | service                                  | OR                                                     |
	   | kind                                     | Nursing Order                                          |
	   | locationUid                              | urn:va:location:C877:5                                 |
	   | clinicians.name                          | VEHU,ONE                                               |
	   | clinicians.role                          | S                                                      |
	   | clinicians.signedDateTime                | 200304272024                                           |
	   | clinicians.uid                           | urn:va:user:C877:20001                                 |
	   
@f114_4_order_vpr @vpr
Scenario: Client can request Orders in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "C877;164" has been synced through Admin API
	When the client requests order results for the patient "C877;164" in VPR format
	Then a successful response is returned
	Then the client receives 13 VPR "VistA" result(s)
	Then the client receives 13 VPR "kodak" result(s)
	And the VPR results contain "order results"
		| field										| kodak_value								|
		| children.uid    							| urn:va:order:C877:164:10805				|
		| children.summary							| CONTAINS CALCIUM BLOOD   SERUM WC LB		|
		| children.localId							| 10805										|
		| children.facilityCode						| 515.6										|
		| children.facilityName						| TROY										|
		| children.locationName						| GEN MED									|
		| children.name								| CALCIUM									|
		| children.oiCode							| urn:va:oi:296								|					
		| children.oiName							| CALCIUM									|
		| children.oiPackageRef						| 180;99LRT									|
		| children.content							| CONTAINS CALCIUM BLOOD   SERUM WC LB		|
		| children.entered							| 199911031716								|
		| children.start							| 199911031718								|
		| children.displayGroup						| CH										|
		| children.statusCode						| urn:va:order-status:pend					|
		| children.statusName						| PENDING									|
		| children.statusVuid						| urn:va:vuid:4501114						|
		| children.providerUid						| urn:va:user:C877:11710					|
		| children.providerName						| PROVIDER,TWOHUNDREDNINETYFIVE				|
		| children.providerDisplayName				| Provider,Twohundredninetyfive				|
		| children.service							| LR										|
		| children.kind								| Laboratory        						|
		| children.locationUid						| urn:va:location:C877:9					|
	
# following 2 scenarios are checking for another patient for return of order results.
# only few fields are checked to validate data integrity.
		
@f114_5_order_vpr @vpr
Scenario: Client can request the orders results in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "9E7A;100184" has been synced through Admin API
	When the client requests order results for the patient "9E7A;100184" in VPR format
	Then a successful response is returned
	Then the client receives 7 VPR "VistA" result(s)
	Then the client receives 7 VPR "panorama" result(s)
	And the VPR results contain "order results"                                                      
	  
	   | field                                    | panorama_value                                      | 
	#   | uid                                      | urn:va:order:9E7A:100184:13194                      |
	   | uid									  | CONTAINS urn:va:order:9E7A:100184					|
	   | summary                                  | CONTAINS UPPER GI WITH KUB						    |
	   | pid                                      | 9E7A;100184                                         |
	   | facilityCode                             | 500                                                 |
	   | facilityName                             | CAMP MASTER                                       	|
	   | locationName                             | GENERAL MEDICINE                                    |
	   | content                                  | CONTAINS UPPER GI WITH KUB						    |
	   | entered                                  | 200304151745                                        |
	   | start                                    | 20030415	                                        |
	   | displayGroup                             | RAD                                                 |
	   | providerUid                              | urn:va:user:9E7A:20015                              |
	   | providerName                             | VEHU,FIFTEEN                                        |
	   | kind                                     | Radiology		                                    |
	   | clinicians.name                          | VEHU,FIFTEEN                                        |
	   | clinicians.role                          | S                                                   |
	   | clinicians.signedDateTime                | 200304151745                                        | 
	   
@f114_6_order_vpr @vpr
Scenario: Client can request the orders results in VPR format
	Given a patient with "order results" in multiple VistAs
	Given a patient with pid "C877;167" has been synced through Admin API
	When the client requests order results for the patient "C877;167" in VPR format
	Then a successful response is returned
	Then the client receives 3 VPR "VistA" result(s)
	Then the client receives 3 VPR "kodak" result(s)
	And the VPR results contain "order results"                                                      
	  
	   | field                                    | panorama_value                                      | 
	#   | uid                                     | urn:va:order:C877:100184:13194                      |
	   | uid									  | CONTAINS urn:va:order:C877:167						|
	   | summary                                  | CONTAINS ALBUTEROL INHALER Use					    |
	   | pid                                      | C877;167                        	                |
	   | facilityCode                             | 500                                                 |
	   | facilityName                             | CAMP BEE                                      		|
	   | locationName                             | GENERAL MEDICINE                                    |
	   | content                                  | CONTAINS ALBUTEROL INHALER Use					    |
	   | entered                                  | 200001261419                                        |
	   | start                                    | 20000126	                                        |
	   | displayGroup                             | O RX                                                |
	   | providerUid                              | urn:va:user:C877:923                                |
	   | providerName                             | PROGRAMMER,TWENTYEIGHT         	                    |
	   | kind                                     | Medication, Outpatient                              |
	   | clinicians.name                          | PROGRAMMER,TWENTYEIGHT                              |
	   | clinicians.role                          | S                                                   |
	   | clinicians.signedDateTime                | 200001261421                                        |   
	
# negative test case for order. 
	
@f114_7_order_neg_vpr	
Scenario: Negative scenario.  Client can request the orders results in VPR format
	Given a patient with "no order results" in multiple VistAs
	Given a patient with pid "9E7A;100084" has been synced through Admin API
	When the client requests order results for the patient "9E7A;100084" in VPR format
	Then a successful response is returned
	Then corresponding matching records totaling "0" are displayed

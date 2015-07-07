@consult_vpr @vpr

Feature: F114 Return Consults in VPR format

#This feature item returns Consults in VPR format. 


@f114_1_consult @vpr
Scenario: Client can request Consults in VPR format
Given a patient with "consult results" in multiple VistAs
Given a patient with pid "10107V395912" has been synced through Admin API
When the client requests consult results for the patient "10107V395912" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 3 VPR "panorama" result(s)
And the VPR results contain "consult results"                                                      
  
		| field										| panorama_value										| 
		| uid										| urn:va:consult:9E7A:253:379							|
		| summary									| AUDIOLOGY OUTPATIENT Cons								|
		| pid										| CONTAINS ;253												|
		| kind										| Consult												|
		| localId									| 379													|
		| facilityCode								| 500													|
		| facilityName								| CAMP MASTER											|	
		| typeName									| AUDIOLOGY OUTPATIENT Cons								|
		| dateTime									| 20040401225417										|
		| category									| C														|
		| consultProcedure							| Consult												|
		| service									| AUDIOLOGY OUTPATIENT									|
		| statusName								| COMPLETE												|
		| orderUid									| urn:va:order:9E7A:253:15477							|
		| orderName									| AUDIOLOGY OUTPATIENT									|		
		| providerUid								| urn:va:user:9E7A:11748								|
		| providerName								| PATHOLOGY,ONE											|
		| results.uid								| urn:va:document:9E7A:253:3111							|
		| results.summary							| ProcedureResult{uid='urn:va:document:9E7A:253:3111'}	|	
		| results.localTitle						| AUDIOLOGY - HEARING LOSS CONSULT						|

		# no data : | interpretation
		# no data : | results[x].nationalTitle
		
@f114_2_consult @vpr
Scenario: Client can request the Consults in VPR format
Given a patient with "consult results" in multiple VistAs
Given a patient with pid "10107V395912" has been synced through Admin API
When the client requests consult results for the patient "10107V395912" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 3 VPR "kodak" result(s)
And the VPR results contain "consult results"                                                      
  
		| field										| kodak_value											| 
		| uid										| urn:va:consult:C877:253:379							|
		| summary									| AUDIOLOGY OUTPATIENT Cons								|
		| pid										| CONTAINS ;253    										|
		| kind										| Consult												|
		| localId									| 379													|
		| facilityCode								| 500													|
		| facilityName								| CAMP BEE												|	
		| typeName									| AUDIOLOGY OUTPATIENT Cons								|
		| dateTime									| 20040401225417										|
		| category									| C														|
		| consultProcedure							| Consult												|
		| service									| AUDIOLOGY OUTPATIENT									|
		| statusName								| COMPLETE												|
		| orderUid									| urn:va:order:C877:253:15477							|
		| orderName									| AUDIOLOGY OUTPATIENT									|		
		| providerUid								| urn:va:user:C877:11748								|
		| providerName								| PATHOLOGY,ONE											|
		| results.uid								| urn:va:document:C877:253:3111							|
		| results.summary							| ProcedureResult{uid='urn:va:document:C877:253:3111'}	|	
		| results.localTitle						| AUDIOLOGY - HEARING LOSS CONSULT						|

		# no data : | interpretation
		# no data : | results[x].nationalTitle

# following 2 scenarios are checking for another patient for return of consult results.
# only few fields are checked to validate data integrity.

@f114_3_consult @vpr
Scenario: Client can request the consult results in VPR format
Given a patient with "consult results" in multiple VistAs
Given a patient with pid "10199V865898" has been synced through Admin API
When the client requests consult results for the patient "10199V865898" in VPR format
Then a successful response is returned
Then the client receives 4 VPR "VistA" result(s)
Then the client receives 2 VPR "panorama" result(s)
And the VPR results contain "consult results"                                                      
  
		| field										| value													| 
#		| uid										| urn:va:consult:9E7A:100012:564						|
		| uid										| CONTAINS urn:va:consult:9E7A:100012					|
		| summary									| HEMATOLOGY CONSULT Cons								|
		| pid										| CONTAINS ;100012											|
		| kind										| Consult												|
		| facilityCode								| 500													|
		| facilityName								| CAMP MASTER											|	
		| typeName									| HEMATOLOGY CONSULT Cons								|
		| dateTime									| 20040402023152										|
		| category									| C														|
		| consultProcedure							| Consult												|
		| service									| HEMATOLOGY CONSULT									|
		| statusName								| DISCONTINUED											|
		| orderUid									| urn:va:order:9E7A:100012:15662						|
		| orderName									| HEMATOLOGY CONSULT									|		
		| providerUid								| urn:va:user:9E7A:11748								|
		| providerName								| PATHOLOGY,ONE											|

@f114_4_consult @vpr
Scenario: Client can request the consult results in VPR format
Given a patient with "consult results" in multiple VistAs
Given a patient with pid "10199V865898" has been synced through Admin API
When the client requests consult results for the patient "10199V865898" in VPR format
Then a successful response is returned
Then the client receives 4 VPR "VistA" result(s)
Then the client receives 2 VPR "kodak" result(s)
And the VPR results contain "consult results"                                                      
  
		| field										| value													| 
#		| uid										| urn:va:consult:C877:100012:564						|
		| uid										| CONTAINS urn:va:consult:C877:100012					|
		| summary									| HEMATOLOGY CONSULT Cons								|
		| pid										| CONTAINS ;100012										|
		| kind										| Consult												|
		| facilityCode								| 500													|
		| facilityName								| CAMP BEE												|	
		| typeName									| HEMATOLOGY CONSULT Cons								|
		| dateTime									| 20040402023152										|
		| category									| C														|
		| consultProcedure							| Consult												|
		| service									| HEMATOLOGY CONSULT									|
		| statusName								| DISCONTINUED											|
		| orderUid									| urn:va:order:C877:100012:15662						|
		| orderName									| HEMATOLOGY CONSULT									|		
		| providerUid								| urn:va:user:C877:11748								|
		| providerName								| PATHOLOGY,ONE											|

   
# negative test case for order. 

@f114_5_consult_neg_vpr @future	
Scenario: Negative scenario.  Client can request the consult results in VPR format
Given a patient with "no consult results" in multiple VistAs
Given a patient with pid "5000000009V082878" has been synced through Admin API
When the client requests consult results for the patient "5000000009V082878" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed

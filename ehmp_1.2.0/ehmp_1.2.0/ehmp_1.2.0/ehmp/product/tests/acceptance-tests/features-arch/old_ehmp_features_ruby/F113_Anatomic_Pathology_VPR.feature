@anatomic_pathology_vpr @vpr

Feature: F113 Return of Anatomic Pathology results in VPR format 

#This feature item returns Surgical Pathology, Cytopathology, and Electron Microscopy results in VPR format.

		
@f113_1_anatomicpathology_SP_vpr @vpr
Scenario: Client can request Surgical Pathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "9E7A;17" has been synced through Admin API
When the client requests anatomic pathology for the patient "9E7A;17" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 6 VPR "panorama" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | panorama_value						|
      | uid                     | urn:va:lab:9E7A:17:SP;7029872			|
      | summary					| SPUTUM							|
      | pid						| 9E7A;17								|
      | localId					| SP;7029872							|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | groupName				| SP 97 102								|
      | categoryCode			| urn:va:lab-category:SP				|
      | categoryName			| Surgical Pathology					|
      | observed				| 19970127								|
      | kind					| Surgical Pathology					|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR SURGICAL PATHOLOGY REPORT			|
      | results.resultUid		| urn:va:document:9E7A:17:SP;7029872	|
      | results.uid				| urn:va:lab:9E7A:17:SP;7029872		|
      | statusName				| completed								|
      | specimen				| SPUTUM								|
      | qualifiedName			| SPUTUM							|
      
 And the VPR results contain "anatomic pathology report results"
      | resulted				| 199701211645							|
      
@f113_2_anatomicpathology_CY_vpr @vpr
Scenario: Client can request Cytopathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "9E7A;17" has been synced through Admin API
When the client requests anatomic pathology for the patient "9E7A;17" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 6 VPR "panorama" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | panorama_value						|
      | uid                     | urn:va:lab:9E7A:17:CY;7049593			|
      | summary					| SPUTUM, TEST				|
      | pid						| 9E7A;17								|
      | localId					| CY;7049593							|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | groupName				| CY 95 1								|
      | categoryCode			| urn:va:lab-category:CY				|
      | categoryName			| Pathology								|
      | observed				| 19950406								|
      | kind					| Pathology								|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR CYTOPATHOLOGY REPORT				|
      | results.resultUid		| urn:va:document:9E7A:17:CY;7049593	|
      | results.uid				| urn:va:lab:9E7A:17:CY;7049593		|
      | statusName				| completed								|
      | specimen				| SPUTUM, TEST							|
      | qualifiedName			| SPUTUM, TEST					|
      
@f113_3_anatomicpathology_EM_vpr @vpr
Scenario: Client can request Electron Microscoppy report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "9E7A;21" has been synced through Admin API
When the client requests anatomic pathology for the patient "9E7A;21" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 2 VPR "panorama" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | panorama_value						|
      | uid                     | urn:va:lab:9E7A:21:EM;7109668.917		|
      | summary					| SPUTUM					|
      | pid						| 9E7A;21								|
      | localId					| EM;7109668.917						|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | groupName				| EM 89 1								|
      | categoryCode			| urn:va:lab-category:EM				|
      | categoryName			| Pathology								|
      | observed				| 198903300830							|
      | kind					| Pathology								|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR ELECTRON MICROSCOPY REPORT			|
      | results.resultUid		| urn:va:document:9E7A:21:EM;7109668.917|
      | results.uid				| urn:va:lab:9E7A:21:EM;7109668.917	|
      | statusName				| completed								|
      | specimen				| SPUTUM								|
      | qualifiedName			| SPUTUM							|
      
@f113_4_anatomicpathology_SP_vpr @vpr
Scenario: Client can request Surgical Pathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "C877;17" has been synced through Admin API
When the client requests anatomic pathology for the patient "C877;17" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 6 VPR "kodak" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | kodak_value					    	|
      | uid                     | urn:va:lab:C877:17:SP;7029872			|
      | summary					| SPUTUM     					|
      | pid						| C877;17								|
      | localId					| SP;7029872							|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | groupName				| SP 97 102								|
      | categoryCode			| urn:va:lab-category:SP				|
      | categoryName			| Surgical Pathology					|
      | observed				| 19970127								|
      | kind					| Surgical Pathology					|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR SURGICAL PATHOLOGY REPORT			|
      | results.resultUid		| urn:va:document:C877:17:SP;7029872	|
      | results.uid				| urn:va:lab:C877:17:SP;7029872  		|
      | statusName				| completed								|
      | specimen				| SPUTUM								|
      | qualifiedName			| SPUTUM							|
      
 And the VPR results contain "anatomic pathology report results"
      | resulted				| 199701211645							|
      
@f113_5_anatomicpathology_CY_vpr @vpr
Scenario: Client can request Cytopathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "C877;17" has been synced through Admin API
When the client requests anatomic pathology for the patient "C877;17" in VPR format
Then a successful response is returned
Then the client receives 6 VPR "VistA" result(s)
Then the client receives 6 VPR "kodak" result(s)
And the VPR results contain "anatomic pathology report results"                                                       
      | field                   | kodak_value						    |
      | uid                     | urn:va:lab:C877:17:CY;7049593			|
      | summary					| SPUTUM, TEST    				|
      | pid						| C877;17								|
      | localId					| CY;7049593							|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | groupName				| CY 95 1								|
      | categoryCode			| urn:va:lab-category:CY				|
      | categoryName			| Pathology								|
      | observed				| 19950406								|
      | kind					| Pathology								|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR CYTOPATHOLOGY REPORT				|
      | results.resultUid		| urn:va:document:C877:17:CY;7049593	|
      | results.uid				| urn:va:lab:C877:17:CY;7049593  		|
      | statusName				| completed								|
      | specimen				| SPUTUM, TEST							|
      | qualifiedName			| SPUTUM, TEST					|
      
@f113_6_anatomicpathology_EM_vpr @vpr
Scenario: Client can request Electron Microscopy report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "C877;21" has been synced through Admin API
When the client requests anatomic pathology for the patient "C877;21" in VPR format
Then a successful response is returned
Then the client receives 2 VPR "VistA" result(s)
Then the client receives 2 VPR "kodak" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | kodak_value				     		|
      | uid                     | urn:va:lab:C877:21:EM;7109668.917		|
      | summary					| SPUTUM      					|
      | pid						| C877;21								|
      | localId					| EM;7109668.917						|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | groupName				| EM 89 1								|
      | categoryCode			| urn:va:lab-category:EM				|
      | categoryName			| Pathology								|
      | observed				| 198903300830							|
      | kind					| Pathology								|
      | abnormal				| false									|
      | lnccodes				| EMPTY									|
      | statusCode				| urn:va:lab-status:completed			|
      | organizerType			| accession								|
      | results.localTitle		| LR ELECTRON MICROSCOPY REPORT			|
      | results.resultUid		| urn:va:document:C877:21:EM;7109668.917|
      | results.uid				| urn:va:lab:C877:21:EM;7109668.917  	|
      | statusName				| completed								|
      | specimen				| SPUTUM								|
      | qualifiedName			| SPUTUM							|

# following 2 scenarios are checking for another patient for return of accession results.
# only few fields are checked to validate data integrity.
      
@f113_7_anatomicpathology_vpr @vpr
Scenario: Client can request anatomic pathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "9E7A;1" has been synced through Admin API
When the client requests anatomic pathology for the patient "9E7A;1" in VPR format
Then a successful response is returned
Then the client receives 14 VPR "VistA" result(s)
Then the client receives 14 VPR "panorama" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:9E7A:1:SP			|
      | pid						| 9E7A;1								|
      | specimen				| FORIEGN OBJECT						|
      | kind					| Surgical Pathology					|
      | observed				| 19970127								|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | categoryCode			| urn:va:lab-category:SP				|
      
And the VPR results contain "anatomic pathology report results"
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:9E7A:1:CY			|
      | pid						| 9E7A;1								|
      | specimen				| PAP SMEAR								|
      | kind					| Pathology								|
      | observed				| 19960326								|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | categoryCode			| urn:va:lab-category:CY				|
      
And the VPR results contain "anatomic pathology report results"
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:9E7A:1:EM			|
      | pid						| 9E7A;1								|
      | specimen				| WART									|
      | kind					| Pathology								|
      | observed				| 19950308								|
      | facilityCode			| 500									|
      | facilityName			| CAMP MASTER							|
      | categoryCode			| urn:va:lab-category:EM				|

@f113_8_anatomicpathology_vpr @vpr
Scenario: Client can request anatomic pathology report results in VPR format
Given a patient with "anatomic pathology report results" in multiple VistAs
Given a patient with pid "C877;1" has been synced through Admin API
When the client requests anatomic pathology for the patient "C877;1" in VPR format
Then a successful response is returned
Then the client receives 14 VPR "VistA" result(s)
Then the client receives 14 VPR "kodak" result(s)
And the VPR results contain "anatomic pathology report results"                                                      
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:C877:1:SP			|
      | pid						| C877;1								|
      | specimen				| FORIEGN OBJECT						|
      | kind					| Surgical Pathology					|
      | observed				| 19970127								|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | categoryCode			| urn:va:lab-category:SP				|
      
And the VPR results contain "anatomic pathology report results"
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:C877:1:CY			|
      | pid						| C877;1								|
      | specimen				| PAP SMEAR								|
      | kind					| Pathology								|
      | observed				| 19960326								|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | categoryCode			| urn:va:lab-category:CY				|
      
And the VPR results contain "anatomic pathology report results"
      | field                   | value									|
      | uid                     | CONTAINS urn:va:lab:C877:1:EM			|
      | pid						| C877;1								|
      | specimen				| WART									|
      | kind					| Pathology								|
      | observed				| 19950308								|
      | facilityCode			| 500									|
      | facilityName			| CAMP BEE								|
      | categoryCode			| urn:va:lab-category:EM				|

# negative test case
      
@f113_9_anatomicpathology_neg_vpr @vpr	
Scenario: Negative scenario.  Client can request anatomic pathology report results in VPR format
Given a patient with "no anatomic pathology report results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests anatomic pathology for the patient "9E7A;100184" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed      
      

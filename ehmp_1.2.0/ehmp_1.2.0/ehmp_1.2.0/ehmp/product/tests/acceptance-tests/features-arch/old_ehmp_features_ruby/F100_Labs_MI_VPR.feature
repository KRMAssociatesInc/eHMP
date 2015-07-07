@labs_vpr
Feature: F93 Return of Lab (MI) Results in VPR format 

	
@f93_1_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "9E7A;737" has been synced through Admin API
	When the client requests labs for the patient "9E7A;737" in VPR format
	Then the client receives 40 VPR "VistA" result(s)
	Then the client receives 40 VPR "panorama" result(s)
    And the VPR results contain:
      | field                  | panorama_value                              |
      | uid                    | urn:va:lab:9E7A:737:MI;7009789.889352       |
      | summary                | CULTURE & SUSCEPTIBILITY (URINE)            |
      | pid                    | 9E7A;737                                    |
      | localId                | MI;7009789.889352                           |
      | facilityCode           | 500                                         |
      | facilityName           | CAMP MASTER                                 |
      | groupName              | MI 99 2                                     |
      | groupUid               | urn:va:accession:9E7A:737:MI;7009789.889352 |
      | categoryCode           | urn:va:lab-category:MI                      |
      | categoryName           | Microbiology                                |
      | observed               | 199902091106                                |
      | resulted               | 199903241332                                |
      | comment                | CONTAINS LOOK FOR LOCATION                  |
      | specimen               | URINE                                       |
      | kind                   | Microbiology                                |
      | qualifiedName          | CULTURE & SUSCEPTIBILITY (URINE)            |
      | statusCode             | urn:va:lab-status:completed                 |
      | gramStain.result       | CONTAINS GRAM POSITIVE COCCI                |
      | gramStain.result       | CONTAINS GRAM NEGATIVE RODS                 |
      | organisms.name         | ESCHERICHIA COLI                            |
      | organisms.qty          | CONTAINS >15,000/ML                         |
      | organisms.drugs.interp | R                                           |
      | organisms.drugs.name   | GENTAMICIN                                  |
      | organisms.drugs.result | R                                           |
      | results.localTitle     | LR MICROBIOLOGY REPORT                      |
      | results.resultUid      | urn:va:document:9E7A:737:MI;7009789.889352  |
      | results.uid            | MI;7009789.889352                           |
      | statusName             | completed                                   |
      | urineScreen            | Positive                                    |
      | sample                 | URINE                                       |
      | bactRemarks            | CONTAINS PROVIDER NOTIFIED                  |
	# not sure where the following values come from
	  | typeCode               | urn:va:ien:60:548:71                        |
      | typeName               | CULTURE & SUSCEPTIBILITY                    |
      | abnormal               | false                                       |
      | lnccodes               | urn:va:ien:60:548:71                        |
      
@f93_2_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then the client receives 92 VPR "VistA" result(s)
	Then the client receives 46 VPR "panorama" result(s)
    And the VPR results contain:
      | field                  | panorama_value                              |
      | uid                    | urn:va:lab:9E7A:227:MI;7048982.848075       |
      | summary                | AFB CULTURE & SMEAR (URINE)                 |
      | pid                    | CONTAINS ;227                                    |
      | localId                | MI;7048982.848075                           |
      | facilityCode           | 500                                         |
      | facilityName           | CAMP MASTER                                 |
      | groupName              | MI 95 27                                    |
      | groupUid               | urn:va:accession:9E7A:227:MI;7048982.848075 |
      | categoryCode           | urn:va:lab-category:MI                      |
      | categoryName           | Microbiology                                |
      | observed               | 199510161519                                |
      | resulted               | 199510261516                                |
      | specimen               | URINE                                       |
      | typeCode               | urn:va:ien:60:1119:71                       |
      | typeName               | AFB CULTURE & SMEAR                         |
      | abnormal               | false                                       |
      | lnccodes               | urn:va:ien:60:1119:71                       |
      | kind                   | Microbiology                                |
      | qualifiedName          | AFB CULTURE & SMEAR (URINE)                 |
      | statusCode             | urn:va:lab-status:completed                 |
      | gramStain.result       | CONTAINS GRAM POSITIVE COCCI                |
      | organisms.drugs.interp | S                                           |
      | organisms.drugs.name   | PENICILLIN                                  |
      | organisms.drugs.result | S                                           |
      | results.localTitle     | LR MICROBIOLOGY REPORT                      |
      | results.resultUid      | urn:va:document:9E7A:227:MI;7048982.848075  |
      | results.uid            | MI;7048982.848075                           |
      | statusName             | completed                                   |
      | urineScreen            | Positive                                    |
      | sample                 | URINE                                       |
      
@f93_3_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "C877;737" has been synced through Admin API
	When the client requests labs for the patient "C877;737" in VPR format
	Then the client receives 40 VPR "VistA" result(s)
	Then the client receives 40 VPR "kodak" result(s)
    And the VPR results contain:
      | field                  | kodak_value                                 |
      | uid                    | urn:va:lab:C877:737:MI;7009789.889352       |
      | summary                | CULTURE & SUSCEPTIBILITY (URINE)            |
      | pid                    | C877;737                                    |
      | localId                | MI;7009789.889352                           |
      | facilityCode           | 500                                         |
      | facilityName           | CAMP BEE	                                 |
      | groupName              | MI 99 2                                     |
      | groupUid               | urn:va:accession:C877:737:MI;7009789.889352 |
      | categoryCode           | urn:va:lab-category:MI                      |
      | categoryName           | Microbiology                                |
      | observed               | 199902091106                                |
      | resulted               | 199903241332                                |
      | comment                | CONTAINS LOOK FOR LOCATION                  |
      | specimen               | URINE                                       |
      | kind                   | Microbiology                                |
      | qualifiedName          | CULTURE & SUSCEPTIBILITY (URINE)            |
      | statusCode             | urn:va:lab-status:completed                 |
      | gramStain.result       | CONTAINS GRAM POSITIVE COCCI                |
      | gramStain.result       | CONTAINS GRAM NEGATIVE RODS                 |
      | organisms.name         | ESCHERICHIA COLI                            |
      | organisms.qty          | CONTAINS >15,000/ML                         |
      | organisms.drugs.interp | R                                           |
      | organisms.drugs.name   | GENTAMICIN                                  |
      | organisms.drugs.result | R                                           |
      | results.localTitle     | LR MICROBIOLOGY REPORT                      |
      | results.resultUid      | urn:va:document:C877:737:MI;7009789.889352  |
      | results.uid            | MI;7009789.889352                           |
      | statusName             | completed                                   |
      | urineScreen            | Positive                                    |
      | sample                 | URINE                                       |
      | bactRemarks            | CONTAINS PROVIDER NOTIFIED                  |
	# not sure where the following values come from
	  | typeCode               | urn:va:ien:60:548:71                        |
      | typeName               | CULTURE & SUSCEPTIBILITY                    |
      | abnormal               | false                                       |
      | lnccodes               | urn:va:ien:60:548:71                        |
      
@f93_4_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "11016V630869" has been synced through Admin API
	When the client requests labs for the patient "11016V630869" in VPR format
	Then the client receives 92 VPR "VistA" result(s)
	Then the client receives 46 VPR "kodak" result(s)
    And the VPR results contain:
      | field                  | kodak_value                                 |
      | uid                    | urn:va:lab:C877:227:MI;7048982.848075       |
      | summary                | AFB CULTURE & SMEAR (URINE)                 |
      | pid                    | CONTAINS ;227                               |
     # | localId                | MI;7048982.848075                           |
      | facilityCode           | 500                                         |
      | facilityName           | CAMP BEE	                                 |
      | groupName              | MI 95 27                                    |
      | groupUid               | urn:va:accession:C877:227:MI;7048982.848075 |
      | categoryCode           | urn:va:lab-category:MI                      |
      | categoryName           | Microbiology                                |
      | observed               | 199510161519                                |
      | resulted               | 199510261516                                |
      | specimen               | URINE                                       |
      | typeCode               | urn:va:ien:60:1119:71                       |
      | typeName               | AFB CULTURE & SMEAR                         |
      | abnormal               | false                                       |
      | lnccodes               | urn:va:ien:60:1119:71                       |
      | kind                   | Microbiology                                |
      | qualifiedName          | AFB CULTURE & SMEAR (URINE)                 |
      | statusCode             | urn:va:lab-status:completed                 |
      | gramStain.result       | CONTAINS GRAM POSITIVE COCCI                |
      | organisms.drugs.interp | S                                           |
      | organisms.drugs.name   | PENICILLIN                                  |
      | organisms.drugs.result | S                                           |
      | results.localTitle     | LR MICROBIOLOGY REPORT                      |
      | results.resultUid      | urn:va:document:C877:227:MI;7048982.848075  |
      | results.uid            | MI;7048982.848075                           |
      | statusName             | completed                                   |
      | urineScreen            | Positive                                    |
      | sample                 | URINE                                       |

# following 2 scenarios are checking for another patient for return of labs results.
# only few fields are checked to validate data integrity.
      
@f93_5_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "9E7A;1" has been synced through Admin API
	When the client requests labs for the patient "9E7A;1" in VPR format
	Then the client receives 119 VPR "VistA" result(s)
	Then the client receives 119 VPR "panorama" result(s)
    And the VPR results contain:
    	| field					| value								|
    	| uid					| CONTAINS urn:va:lab:9E7A:1:MI		|
    	| summary				| CONTAINS BLOOD CULTURE SET #1 (BLOOD)|
    	| facilityCode			| 500								|
    	| facilityName			| CAMP MASTER						|
    	| specimen				| BLOOD								|
    	| typeName				| BLOOD CULTURE SET #1				|
    	| kind					| Microbiology						|
    	| abnormal				| false								|
    	| gramStain.result		| CONTAINS NEGATIVE					|
    	| statusName			| completed							|
    	
@f93_6_labs_mi_vpr @vpr
Scenario: Client can request lab (MI) results in VPR format
	Given a patient with "lab (MI) results" in multiple VistAs
  Given a patient with pid "C877;1" has been synced through Admin API
	When the client requests labs for the patient "C877;1" in VPR format
	Then the client receives 119 VPR "VistA" result(s)
	Then the client receives 119 VPR "kodak" result(s)
    And the VPR results contain:
    	| field					| value								|
    	| uid					| CONTAINS urn:va:lab:C877:1:MI		|
    	| summary				| CONTAINS BLOOD CULTURE SET #1 (BLOOD)|
    	| facilityCode			| 500								|
    	| facilityName			| CAMP BEE							|
    	| specimen				| BLOOD								|
    	| typeName				| BLOOD CULTURE SET #1				|
    	| kind					| Microbiology						|
    	| abnormal				| false								|
    	| gramStain.result		| CONTAINS NEGATIVE					|
    	| statusName			| completed							|

# negative test case.  already run as part of Labs_Chem_VPR.  
    	
@f93_7_labs_mi_neg_vpr	
Scenario: Negative scenario.  Client can request lab results in VPR format
Given a patient with "No lab results" in multiple VistAs
Given a patient with pid "1006184063V088473" has been synced through Admin API
When the client requests labs for the patient "1006184063V088473" in VPR format
Then a successful response is returned
Then corresponding matching records totaling "0" are displayed

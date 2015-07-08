@problem_vpr 
Feature: F112 Return of Problem List in VPR format 

#This Feature item returns the Problem List in VPR format.


@f112_1_problem_vpr @vpr
Scenario: Client can request the Problem List in VPR format
	Given a patient with "problem list results" in multiple VistAs
      Given a patient with pid "9E7A;129" has been synced through Admin API
	When the client requests problem lists for the patient "9E7A;129" in VPR format
	Then the client receives 16 VPR "VistA" result(s)
	Then the client receives 16 VPR "panorama" result(s)
	Then the VPR results contain:
                                                      
      | field                  | value                          |
      | uid                    | urn:va:problem:9E7A:129:134    |
      | summary                | 518.83 (ICD-9-CM 799.9)        |
      | pid                    | 9E7A;129                       |
      | localId                | 134                            |
      | facilityCode           | 500                            |
      | facilityName           | CAMP MASTER                    |
      | locationName           | MIKE'S MEDICAL CLINIC          |
      | locationDisplayName    | Mike's Medical Clinic          |
      | providerName           | PROVIDER,TWOHUNDREDNINETYSEVEN |
      | providerDisplayName    | Provider,Twohundredninetyseven |
      | problemText            | 518.83 (ICD-9-CM 799.9)        |
      | icdCode                | urn:icd:799.9                  |
      | icdName                | UNKN CAUSE MORB/MORT NEC       |
      | statusCode             | urn:sct:55561003               |
      | statusName             | ACTIVE                         |
      | statusDisplayName      | Active                         |
      | acuityCode             | urn:va:prob-acuity:c           |
      | acuityName             | chronic                        |
      | unverified             | false                          |
      | removed                | false                          |
      | entered                | 19981204                       |
      | updated                | 19981204                       |
      | onset                  | 19981204                       |
      | serviceConnected       | false                          |
      | comments.summary       | ProblemComment{uid='null'}     |
      | comments.entered       | 19981204                       |
      | comments.enteredByName | PROVIDER,TWOHUNDREDNINETYSEVEN |
      | comments.enteredByCode | urn:va:user:9E7A:11712         |
      | comments.comment       | this is a new icd 9 code       |
      | kind                   | Problem                        |
      | icdGroup               | 799                            |
      | providerUid            | urn:va:user:9E7A:11712         |
      | locationUid            | urn:va:location:9E7A:261       |
      
@f112_2_problem_vpr @vpr
Scenario: Client can request the Problem List in VPR format
	Given a patient with "problem list results" in multiple VistAs
    Given a patient with pid "C877;129" has been synced through Admin API
	When the client requests problem lists for the patient "C877;129" in VPR format
	Then the client receives 16 VPR "VistA" result(s)
	Then the client receives 16 VPR "kodak" result(s)
	Then the VPR results contain:
                                                      
      | field                  | value                          |
      | uid                    | urn:va:problem:C877:129:134    |
      | summary                | 518.83 (ICD-9-CM 799.9)        |
      | pid                    | C877;129                       |
      | localId                | 134                            |
      | facilityCode           | 500                            |
      | facilityName           | CAMP BEE                       |
      | locationName           | MIKE'S MEDICAL CLINIC          |
      | locationDisplayName    | Mike's Medical Clinic          |
      | providerName           | PROVIDER,TWOHUNDREDNINETYSEVEN |
      | providerDisplayName    | Provider,Twohundredninetyseven |
      | problemText            | 518.83 (ICD-9-CM 799.9)        |
      | icdCode                | urn:icd:799.9                  |
      | icdName                | UNKN CAUSE MORB/MORT NEC       |
      | statusCode             | urn:sct:55561003               |
      | statusName             | ACTIVE                         |
      | statusDisplayName      | Active                         |
      | acuityCode             | urn:va:prob-acuity:c           |
      | acuityName             | chronic                        |
      | unverified             | false                          |
      | removed                | false                          |
      | entered                | 19981204                       |
      | updated                | 19981204                       |
      | onset                  | 19981204                       |
      | serviceConnected       | false                          |
      | comments.summary       | ProblemComment{uid='null'}     |
      | comments.entered       | 19981204                       |
      | comments.enteredByName | PROVIDER,TWOHUNDREDNINETYSEVEN |
      | comments.enteredByCode | urn:va:user:C877:11712         |
      | comments.comment       | this is a new icd 9 code       |
      | kind                   | Problem                        |
      | icdGroup               | 799                            |
      | providerUid            | urn:va:user:C877:11712         |
      | locationUid            | urn:va:location:C877:261       |

# following 2 scenarios are checking for another patient for return of problems results.
# only few fields are checked to validate data integrity.
      
@f100_3_problem_vpr @vpr
Scenario: Client can request problem list results in VPR format
	Given a patient with "problem list results" in multiple VistAs
    Given a patient with pid "10199V865898" has been synced through Admin API
	When the client requests problem lists for the patient "10199V865898" in VPR format
	Then the client receives 10 VPR "VistA" result(s)
	Then the client receives 5 VPR "panorama" result(s)
	Then the VPR results contain:
                                                      
      | field						| value   									|
      | uid							| CONTAINS urn:va:problem:9E7A:100012    	|
      | pid							| CONTAINS ;100012								|
      | facilityCode				| 500										|
      | facilityName				| CAMP MASTER								|
      | locationName				| 20 MINUTE									|
      | providerName				| VEHU,NINETYNINE							|
      | problemText					| Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)|
      | entered						| 20010308									|
      | kind						| Problem									|
      | providerDisplayName			| Vehu,Ninetynine							|
      | statusName					| ACTIVE									|
      | unverified					| false										|
      
     Then the VPR results contain:
      | codes.code					| 441481004									|
      | codes.system				| http://snomed.info/sct					|
      | codes.display				| Chronic systolic heart failure (disorder)	|
      
@f100_4_problem_vpr @vpr
Scenario: Client can request problem list results in VPR format
	Given a patient with "problem list results" in multiple VistAs
      Given a patient with pid "10199V865898" has been synced through Admin API
	When the client requests problem lists for the patient "10199V865898" in VPR format
	Then the client receives 10 VPR "VistA" result(s)
	Then the client receives 5 VPR "kodak" result(s)
	Then the VPR results contain:
                                                      
      | field						| value   									|
      | uid							| CONTAINS urn:va:problem:C877:100012    	|

      | pid							| CONTAINS ;100012							|
      | facilityCode				| 500										|
      | facilityName				| CAMP BEE									|
      | locationName				| 20 MINUTE									|
      | providerName				| VEHU,NINETYNINE							|
      | problemText					| Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)|
      | entered						| 20010308									|
      | kind						| Problem									|
      | providerDisplayName			| Vehu,Ninetynine							|
      | statusName					| ACTIVE									|
      | unverified					| false										|
      
     Then the VPR results contain:
      | codes.code					| 441481004									|
      | codes.system				| http://snomed.info/sct					|
      | codes.display				| Chronic systolic heart failure (disorder)	|
      
# negative test case for labs.

@f100_5_problem_vpr_neg_vpr	
Scenario: Negative scenario.  Client can request problem list results in VPR format
	Given a patient with "No problem list results" in multiple VistAs
      Given a patient with pid "9E7A;737" has been synced through Admin API
	When the client requests problem lists for the patient "9E7A;737" in VPR format
	Then a successful response is returned
	Then corresponding matching records totaling "0" are displayed      
      
      
 
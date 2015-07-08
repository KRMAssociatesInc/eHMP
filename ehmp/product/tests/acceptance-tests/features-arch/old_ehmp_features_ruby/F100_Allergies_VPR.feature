@allergies @All_VPR  
Feature: F100 Return of Allergies Results in VPR format


#This feature item covers the return of free text, observed, and historical allergies in VPR format.

   
@f100_1_allergies_vpr_freetext 
Scenario: Client can request free text allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "9E7A;1" has been synced through Admin API   
    When the client requests allergies for the patient "9E7A;1" in VPR format
	Then the client receives 8 VPR "VistA" result(s)
	Then the client receives 8 VPR "panorama" result(s)
    And the VPR results contain:
      | field                 | panorama_value              |
      | summary               | DOG HAIR ( FREE TEXT )      |
      | entered               | 199402071026                |
      | products.vuid         | urn:va:vuid:                |
      | products.name         | DOG HAIR ( FREE TEXT )      |
      | reactions.name        | ITCHING,WATERING EYES       |
      | reactions.vuid        | urn:va:vuid:                |
      | observations.severity | MILD                        |
      # UNSURE WHAT VALUES SHOULD BE
      | uid                   | CONTAINS urn:va:allergy:9E7A:1:   |
      | pid                   | 9E7A;1                      |
      | facilityCode          | 500                         |
      | facilityName          | CAMP MASTER                 |
      | localId               | IS_SET                         |
      | historical            | false                       |
      | kind                  | Allergy/Adverse Reaction    |
      | reference             | 1;GMRD(120.82,              |
      | products.summary      | AllergyProduct{uid='null'}  |
      | reactions.summary     | AllergyReaction{uid='null'} |
      | originatorName        | WARDCLERK,FIFTYTHREE        |
      | verifierName          | WARDCLERK,FIFTYTHREE        |
      | mechanism             | ALLERGY                     |
      | typeName              | OTHER                       |
      
@f100_2_allergies_vpr_observed 
Scenario: Client can request observed allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "5000000341V359724" has been synced through Admin API
    When the client requests allergies for the patient "5000000341V359724" in VPR format
	Then the client receives 10 VPR "VistA" result(s)
	Then the client receives 5 VPR "panorama" result(s)
    And the VPR results contain:
      | field                 | panorama_value                 |
      | summary               | ERYTHROMYCIN                   |
      | entered               | 201312191618                   |
      | products.vuid         | urn:va:vuid:4017594            |
      | products.name         | ERYTHROMYCIN                   |
      | reactions.name        | ANOREXIA                       |
      | reactions.vuid        | urn:va:vuid:4637051            |
      | reactions.name        | DIARRHEA                       |
      | reactions.vuid        | urn:va:vuid:4637011            |
      | reactions.name        | DROWSINESS                     |
      | reactions.vuid        | urn:va:vuid:                   |
      | reactions.name        | HIVES                          |
      | reactions.vuid        | urn:va:vuid:                   |
      | observations.severity | MODERATE                       |
      # UNSURE WHAT VALUES SHOULD BE
      | uid                   | CONTAINS urn:va:allergy:9E7A:100022: |
      | pid                   | 9E7A;100022                    |
      | facilityCode          | 500                            |
      | facilityName          | CAMP MASTER                    |
      | localId               | IS_SET                            |
      | historical            | false                          |
      | kind                  | Allergy/Adverse Reaction       |
      | reference             | 92;PSNDF(50.6,                 |
      | products.summary      | AllergyProduct{uid='null'}     |
      | reactions.summary     | AllergyReaction{uid='null'}    |
#      | originatorName        | LORD,BRIAN                     |
      | originatorName        | DOCWITH,POWER                  |
      | mechanism             | ALLERGY                        |
      | typeName              | DRUG                           |

        
@f100_3_allergies_vpr_historical
Scenario: Client can request historical allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "5000000217V519385" has been synced through Admin API
    When the client requests allergies for the patient "5000000217V519385" in VPR format
    Then the client receives 3 VPR "VistA" result(s)
    Then the client receives 1 VPR "panorama" result(s)
    And the VPR results contain
      | field             | panorama_value                 |
      | entered           | 201401071706                   |
      | summary           | CHOCOLATE                      |
      | products.vuid     | urn:va:vuid:4636681            |
      | products.name     | CHOCOLATE                      |
      | reactions.name    | ANXIETY                        |
      | reactions.vuid    | urn:va:vuid:4637050            |
      | severity		  | IS_NOT_SET					   |
      # UNSURE WHAT VALUES SHOULD BE
      | uid               | CONTAINS urn:va:allergy:9E7A:100716: |
#      | pid               | CONTAINS ;100716                    |
      | pid               | CONTAINS ;100                  |
      | facilityCode      | 500                            |
      | facilityName      | CAMP MASTER                    |
      | localId           | IS_SET                            |
      | verified          | IS_SET                         |
      | historical        | true                           |
      | kind              | Allergy/Adverse Reaction       |
      | reference         | 3;GMRD(120.82,                 |
      | products.summary  | AllergyProduct{uid='null'}     |     
      | reactions.summary | AllergyReaction{uid='null'}    |     
      | originatorName    | DOCWITH,POWER                  |
      | verifierName      | <auto-verified>                |
      | mechanism         | ALLERGY                        |
      | typeName          | DRUG, FOOD                     |  

@f100_4_allergies_vpr_freetext 
Scenario: Client can request free text allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "C877;1" has been synced through Admin API   
    When the client requests allergies for the patient "C877;1" in VPR format
	Then the client receives 8 VPR "VistA" result(s)
	Then the client receives 8 VPR "kodak" result(s)
    And the VPR results contain:
      | field                 | kodak_value                 |
      | uid                   | CONTAINS urn:va:allergy:C877:1:   |
      | summary               | DOG HAIR ( FREE TEXT )      |
      | entered               | 199402071026                |
      | products.vuid         | urn:va:vuid:                |
      | products.name         | DOG HAIR ( FREE TEXT )      |
      | reactions.name        | ITCHING,WATERING EYES       |
      | reactions.vuid        | urn:va:vuid:                |
      | observations.severity | MILD                        |
      # UNSURE WHAT VALUES SHOULD BE
      | pid                   | C877;1                      |
      | facilityCode          | 500                         |
      | facilityName          | CAMP BEE	                 |
      | localId               | IS_SET                         |
      | historical            | false                       |
      | kind                  | Allergy/Adverse Reaction  |
      | reference             | 1;GMRD(120.82,              |
      | products.summary      | AllergyProduct{uid='null'}  |
      | reactions.summary     | AllergyReaction{uid='null'} |
      | originatorName        | WARDCLERK,FIFTYTHREE        |
      | verifierName          | WARDCLERK,FIFTYTHREE        |
      | mechanism             | ALLERGY                     |
      | typeName              | OTHER                       |
      
@f100_5_allergies_vpr_observed 
Scenario: Client can request observed allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "5000000341V359724" has been synced through Admin API
    When the client requests allergies for the patient "5000000341V359724" in VPR format
	Then the client receives 10 VPR "VistA" result(s)
	Then the client receives 5 VPR "kodak" result(s)
    And the VPR results contain:
      | field                 | kodak_value                    |           
      | uid                   | CONTAINS urn:va:allergy:C877:100022: |
      | summary               | PENICILLIN                     |
      | entered               | 201312051608                   |
      | products.vuid         | urn:va:vuid:		           |
      | products.name         | PENICILLIN                     |
      | reactions.name        | ANOREXIA                       |
      | reactions.vuid        | urn:va:vuid:4637051            |
      | reactions.name        | DRY MOUTH                      |
      | reactions.vuid        | urn:va:vuid:4538597            |
      | observations.severity | MODERATE                       |
      # UNSURE WHAT VALUES SHOULD BE
      | pid                   | C877;100022                    |
      | facilityCode          | 500                            |
      | facilityName          | CAMP BEE                       |
      | localId               | IS_SET                         |
      | historical            | false                          |
      | kind                  | Allergy/Adverse Reaction     |
      | reference             | 125;GMRD(120.82,               |
      | products.summary      | AllergyProduct{uid='null'}     |
      | reactions.summary     | AllergyReaction{uid='null'}    |
      | originatorName        | DOCWITH,POWER                  |
      | mechanism             | ALLERGY                        |
      | typeName              | DRUG                           |

        
@f100_6_allergies_vpr_historical
Scenario: Client can request historical allergies in VPR format
    Given a patient with "allergies" in multiple VistAs
    And a patient with pid "5000000217V519385" has been synced through Admin API
    When the client requests allergies for the patient "5000000217V519385" in VPR format
	Then the client receives 3 VPR "VistA" result(s)
	Then the client receives 2 VPR "kodak" result(s)
    And the VPR results contain:
      | field             | kodak_value                    |
      | uid               | CONTAINS urn:va:allergy:C877:100716: |
      | entered           | 201401071718                   |
      | summary           | CHOCOLATE                      |
      | products.vuid     | urn:va:vuid:4636681            |
      | products.name     | CHOCOLATE                      |
      | reactions.name    | ANXIETY                        |
      | reactions.vuid    | urn:va:vuid:4637050            |
      | severity		  | IS_NOT_SET					   |
      # UNSURE WHAT VALUES SHOULD BE
      | pid               | CONTAINS ;100716               |
      | facilityCode      | 500                            |
      | facilityName      | CAMP BEE	                   |
      | localId           | IS_SET                         |
      | verified          | IS_SET                         |
      | historical        | true                           |
      | kind              | Allergy/Adverse Reaction       |
      | reference         | 3;GMRD(120.82,                 |
      | products.summary  | AllergyProduct{uid='null'}     |     
      | reactions.summary | AllergyReaction{uid='null'}    |     
      | originatorName    | DOCWITH,POWER                  |
      | verifierName      | <auto-verified>                |
      | mechanism         | ALLERGY                        |
      | typeName          | DRUG, FOOD                     |  
 

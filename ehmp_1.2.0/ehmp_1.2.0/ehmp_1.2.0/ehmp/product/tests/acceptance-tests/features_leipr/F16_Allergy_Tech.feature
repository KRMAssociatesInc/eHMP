@AllergyTech
Feature: F16 Allergy Tech
  
  
@TA1350
Scenario Outline: LEIPR API to support Allergies with documented fields
  Given a patient with id "<patient>" has been synced
  When a client requests "allergy" for patient with id "<patient>"
  Then a successful response is returned within "30" seconds
  And that response does not have untested fields
    |allergy_keys   | 
   #following do not exist
    |resourceType|
    |contained.resourceType|
    |extension.valueDateTime|
   #following exist on wiki
    |text.status              | 
    |text.div                 |
    |identifier.use           |
    |identifier.value         | 
    |identifier.system        | 
    |contained._id            |
    |contained.text.status    |
    |contained.text.div       |
    |contained.type.text      |
    |exposure.substance.reference    |
    |subject.reference               |
    |didNotOccurFlag                 |
    |extension.url| 
    |extension.value| 
    |contained.id| 
    |reactionDate| 
    |recorder.reference| 
    |contained.type.coding.system|
    |contained.type.coding.code |
    |contained.type.coding.display|
    |symptom.severity|
    |symptom.code.text| 
    |symptom.code.coding.system|
    |symptom.code.coding.code|
    |symptom.code.coding.display|
      
Examples:
|patient|
  |E1           |                        
  |E101         |
  
      
@US386
Scenario Outline: LEIPR API to support Allergies with mandatory fields
  Given a patient with id "<patient>" has been synced
  When a client requests "allergy" for patient with id "<patient>"
  Then a successful response is returned within "30" seconds
  And that patient has mandatory allergy fields
	  |allergy_mandatory_keys   | 
	  |text.status              | 
	  |text.div                 |
	  |identifier.use           |
	  |identifier.value         | 
	  |identifier.system        | 
	  |contained._id            |
	  |contained.text.status    |
	  |contained.text.div       |
	  |contained.type.text      |
	  |exposure.substance.reference    |
	  |subject.reference               |
	  |didNotOccurFlag                 |

Examples:
|patient|
  |E1           |                        
  |E101         |

@US386 @US386_mandvalues
Scenario: LEIPR API to support Allergies with mandatory fields
  Given a patient with id "E1" has been synced
  When a client requests "allergy" for patient with id "E1"
  Then a successful response is returned within "30" seconds
  And that patient has expected allergies
      |allergy_mandatory_keys   | values  |
      |text.status              | generated,generated |
      |text.div                 |<div>PENICILLIN</div>,<div>CHOCOLATE</div> |
      |identifier.use           | official,official   |
      #|identifier.value         | deliberately not checked because value is not consistent
      |identifier.system        | urn:oid:2.16.840.1.113883.6.233,urn:oid:2.16.840.1.113883.6.233 |
      |contained.text.status    |generated,generated|
      |contained.text.div       |<div>PENICILLIN</div>,<div>CHOCOLATE</div>|
      |contained.type.text      |PENICILLIN,CHOCOLATE|
      |subject.reference               |Patient/E1,Patient/E1 |
      |didNotOccurFlag                 |false,false|

  
@TA1350 
Scenario Outline: LEIPR API to support Allergies with supplimentary fields
  Given a patient with id "<patient>" has been synced
  When a client requests "allergy" for patient with id "<patient>"
  Then a successful response is returned within "30" seconds
  And that patient has expected supplimentary allergies values to not be found
  |allergy_supp_keys    |  value |
  |extension.url| "http://vistacore.us/fhir/profiles/@main#reaction-nature" |

Examples:
|patient|
|E1|
|E2|
|E101|
|E102|  
#|E3| not sure this guy exists
|E4|
|E5|
|E6|
|E7|
|E103| 
|E104| 
|E105| 
|E106|
  
@TA1350
Scenario Outline: LEIPR API to support Allergies with supplimentary fields
  Given a patient with id "<patient>" has been synced
  When a client requests "allergy" for patient with id "<patient>"
  Then a successful response is returned within "30" seconds
  And that patient has expected supplimentary allergies to not be found
  |allergy_supp_keys    | 
  #|contained[practitioner].id| 
  #|contained[practitioner].text.status| 
  #|contained[practitioner].text.div| 
  |contained.name.text| 
  |reactionDate| 
  |recorder.reference| 

Examples:
|patient|
|E1|
|E2|
|E101|
|E102|  
#|E3| not sure this guy exists
|E4|
|E5|
|E6|
|E7|
|E103| 
|E104| 
|E105| 
|E106| 

  
@US243
Scenario: LEIPR API to support Allergies with supplimentary fields
  Given a patient with id "E101" has been synced
  When a client requests "allergy" for patient with id "E101"
  Then a successful response is returned within "30" seconds
  And that patient has expected supplimentary allergies
  |allergy_supp_keys    | values  |
  |extension.url| "http://vistacore.us/fhir/profiles/@main#entered-datetime"|
  #|extension.value| unknown|
  |extension.valueDateTime|   2014-01-08T16:11:00|
  |contained.type.coding.system|urn:oid:2.16.840.1.113883.6.233|
  |contained.type.coding.code |4637424|
  |contained.type.coding.display|ALCOHOL |
  |symptom.severity|moderate|
  |symptom.code.text| PAIN IN LEG |
  |symptom.code.coding.system|urn:oid:2.16.840.1.113883.6.233|
  |symptom.code.coding.code|4637087|
  |symptom.code.coding.display|PAIN IN LEG|

@US386
Scenario Outline: Verify mandatory fields match
    Given a patient with id "<patient>" has been synced
    When a client requests "allergy" for patient with id "<patient>"
    Then a successful response is returned within "30" seconds
    And contained.id matches exposure.substance.reference
Examples:
|patient|
|E1|
|E2|
|E101|
|E102|  

@TA1350_fail @future
Scenario Outline: LEIPR API to support Allergies with mandatory fields
  Given a patient with id "E1" has been synced
  When a client requests "allergy" for patient with id "E1"
  Then a successful response is returned within "60" seconds
  And that patient has mandatory allergy fields
  |allergy_mandatory_keys   | 
  |  "<field>"              |
Examples:
  | field                   |
  # field within an array element
  |identifier.system.nope   | 
  # nested field
  |text.status.nope         | 
  # first level field
  |shouldNotFind            | 
  

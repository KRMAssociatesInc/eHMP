@Allergy
Feature: F16 Allergy
  the need for a longitudinal enterprise patient record that contains Allergy data from all VistA instances 
  when Allergy data is requested or a change to Allergy data is detected then 
  it will be retrieved and stored in the LEIPR

  Test Data:
   E2 has data at Primary Vista instance 
   E1 has data at Secondary Vista instance     
   E101 has data at Primary and Secondary Vista instance                         
  
Background:
    Given user logs in with valid credentials
      
@US241
Scenario Outline: LEIPR to support Vitals LEIPR data type with mandatory fields
    Given a patient with id "<patient_id>" has not been synced
    When a client requests "vital" for patient with id "<patient_id>"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back
    And the response contains the Vitals field with title "status"
    And the response contains the Vitals field with title "reliability"
    And the response contains the Vitals field with title "name"
  
  Examples:
  |patient_id	|
  |E2         	| 
  |E1         	|                        

@US386
Scenario Outline: LEIPR API to support Allergies with mandatory fields
    Given a patient with id "<patient_id>" has not been synced
    When a client requests "allergy" for patient with id "<patient_id>"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back
    And the response contains the Adverse Reaction field "symptom"
    And the response contains the Adverse Reaction field "text.status"
    And the response contains the Adverse Reaction field "text.div"
    And the response contains the Adverse Reaction field "contained.id"
    And the response contains the Adverse Reaction field "contained.text.status"
    And the response contains the Adverse Reaction field "contained.text.div"
    And the response contains the Adverse Reaction field "contained.type.text"
    And the response contains the Adverse Reaction field "exposure.substance.reference"
    And the response contains the Adverse Reaction field "identifier.use"
    And the response contains the Adverse Reaction field "identifier.system"
    And the response contains the Adverse Reaction field "identifier.value"
    And the response contains the Adverse Reaction field "subject.reference"
    And the response contains the Adverse Reaction field "subject"
    And the response contains the Adverse Reaction field "didNotOccurFlag"

    
  Examples:
  |patient_id	| 
  |E1         	|                        
  |E101       	|  
  
  
@US243 
Scenario Outline: LEIPR API to support Allergies with supplementary fields - Allergies are returned from two or more sites for a single patient.
    Given a patient with id "<patient_id>" has not been synced
    When a client requests "allergy" for patient with id "<patient_id>"
    Then a successful response is returned within "60" seconds
    And the endpoint responds back
    And the response contains the AdverseReaction field "Patient Name" with the value "<patientName_value>"
    And the response contains the AdverseReaction field "Caustive Agent" with the value "<caustiveAgent_value>"
    And the response contains the AdverseReaction field "Status" with the value "<status_value>"
    And the response contains the AdverseReaction field "Symptom/ Sings" with the value "<symptom_value>"

  
Examples:

  |patient_id	|patientName_value	|caustiveAgent_value|status_value	|symptom_value			| 		
  |E101        	|Patient/E101		|STRAWBERRIES		|generated		|ITCHING,WATERING EYES	|		
  |E101        	|Patient/E101		|CELERY				|generated		|DRY NOSE				| 		
  |E101        	|Patient/E101		|ERYTHROMYCIN		|generated		|DIARRHEA				| 
  |E1        	|Patient/E1		|PENICILLIN			|generated		|ANOREXIA				|  					
  |E1           | Patient/E1    | PENICILLIN        | generated     | DRY MOUTH             |                     
  
  
@US256 
Scenario: LEIPR API to support a reconciled view of allergies (removing duplicates)
	Given a patient with id "E101" has been synced
	When a client requests an allergy summary for patient with id "E101"
	Then a successful response is returned within "60" seconds
	And the response contains "1" instances of an allergy to "PEANUTS"
	And the response contains "2" instances of an allergy to "ALCOHOL"
 
# This scenario should be replace with above scenarios US243 and US386.    
@US243 @US386 @future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Allergies data from multiple VistA instances for a patient
  Given a patient with id "E101" has not been synced
  When a client requests "allergy" for patient with id "E101"
  Then a successful response is returned within "60" seconds
  And that patient has Allergies data at multiple VistA instances
    | field                                 | panorama_value    | kodak_value   |
    | contained[substance.x].type.text      | ALCOHOL           | PENICILLIN | 
  Then a response is returned with Allergies data from multiple VistA instances for that patient from LEIPR
    | fields_list                                  | values                                             | Required_fields |
#   | extension[reaction-nature].url               | test "http://vistacore.us/fhir/profiles/@main#reaction-nature"    | No  |
#	| extension[reaction-nature].valueDateTime     | test 2013-12-19T16:18:00                                          | No  |
	| extension[entered-datetime].url              | "http://vistacore.us/fhir/profiles/@main#entered-datetime"        | No  |
	| extension[entered-datetime].valueDateTime    | 2013-12-19T16:18:00                                               | No  |
	| text.status                                  | generated                         | Yes |
	| text.div                                     | <div>ERYTHROMYCIN</div>           | Yes |
#	| contained[practitioner].id                   | test | No  |
#	| contained[practitioner].text.status          | test | No  |
#	| contained[practitioner].text.div             | test | No  |
#	| contained[practitioner].name.text            | test | No  |
	| contained[substance.x]._id                   |                                   | Yes |
	| contained[substance.x].text.status           | generated                         | Yes |
	| contained[substance.x].text.div              | <div>ERYTHROMYCIN</div>           | Yes |
	| contained[substance.x].type.coding.system    | urn:oid:2.16.840.1.113883.6.233   | No  |
	| contained[substance.x].type.coding.code      | 4017594                           | No  |
	| contained[substance.x].type.coding.display   | ERYTHROMYCIN                      | No  |
	| contained[substance.x].type.text             | ERYTHROMYCIN                      | Yes |
	| exposure[x].substance.reference              |                                   | Yes |
	| identifier.use                               | official                          | Yes |
	| identifier.system                            | urn:oid:2.16.840.1.113883.6.233   | Yes |
	| identifier.value                             | urn:va:542GA:100022:allergy:968   | Yes |
#	| reactionDate                                 | test | No  |
	| subject.reference                            | Patient/E101                      | Yes |
	| didNotOccurFlag                              | false                             | Yes |
#	| recorder.reference                           | test | No  |
	| symptom[x].code.text                         | ANOREXIA                          | No  |
	| symptom[x].code.coding.system                | urn:oid:2.16.840.1.113883.6.233   | No  |
	| symptom[x].code.coding.code                  | 4637051                           | No  |
	| symptom[x].code.coding.display               | ANOREXIA                          | No  |
	| symptom[x].severity                          | moderate                          | No  |

  
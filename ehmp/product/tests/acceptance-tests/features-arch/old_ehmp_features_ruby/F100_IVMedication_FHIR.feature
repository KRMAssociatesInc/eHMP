@Medication_fhir @fhir

Feature: F100 Return of IV medication results in FHIR format 

#This feature item returns IV Medications in FHIR format. Also includes cases where IV Medications do not exist.

		
@f100_1_iv_medication_fhir @fhir
Scenario: Client can request IV Medications in FHIR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "9E7A;17" has been synced through Admin API
When the client requests in-patient medication results for the patient "9E7A;17" in FHIR format
Then a successful response is returned
Then the client receives 5 FHIR "VistA" result(s)
And the client receives 5 FHIR "panorama" result(s)
And the FHIR results contain "medication administration results"                                                    
	| field														| panorama_value										|
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:17							|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 3V;I													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:105903003										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:9E7A:923									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| PROGRAMMER,TWENTYEIGHT								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.contained.extension.valueString					| urn:va:order:9E7A:17:7418.1							|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Infusion									|
	| content.contained.identifier.value						| urn:va:user:9E7A:983									|
	| content.contained.name.text								| PROVIDER,ONE											|
	| content.contained.type.text								| V														|
	#uid field
	#| content.contained.identifier.value						| urn:va:med:9E7A:17:7418.1								|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 1997-12-11T16:23:00									|
	| content.contained.patient.reference						| IS_SET												|
	# following fields are from Medication resource type.
	| content.contained.text.div								| CONTAINS DEXTROSE 5% IN WATER INJ,SOLN,POTASSIUM CHLORIDE INJ,SOLN (EXPIRED) |
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:TN101										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| IV SOLUTIONS WITHOUT ELECTROLYTES												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4014924									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| CONTAINS DEXTROSE 5% INJ,BAG,1000ML 					|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 1 MEQ													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:4850										|
	| content.contained.type.coding.code						| urn:va:vuid:4017760									|
	| content.contained.type.coding.display						| DEXTROSE												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:418297009										|
	| content.contained.type.coding.display						| DEXTROSE 5% IN WATER INJ,SOLN							|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| POTASSIUM CHLORIDE INJ,SOLN							|
	| content.contained.code.coding.code						| urn:vandf:4017760										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010582									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010586									|
	| content.contained.code.coding.code						| urn:rxnorm:4850										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000147647									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000006402									|
	| content.contained.code.text								| POTASSIUM CHLORIDE INJ,SOLN							|
	# fields specific to IV following is from Medicatin Administration resource type
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#ivRate		|
	| content.dosage.extension.valueString						| 10 ml/hr												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	| content.contained.extension.valueString					| 100 ML												|
	
@f100_2_iv_medication_fhir @fhir
Scenario: Client can request IV Medications in FHIR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "C877;17" has been synced through Admin API
When the client requests in-patient medication results for the patient "C877;17" in FHIR format
Then a successful response is returned
Then the client receives 5 FHIR "VistA" result(s)
And the client receives 5 FHIR "kodak" result(s)
And the FHIR results contain "medication administration results"                                                    
	| field														| kodak_value					     					|
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:C877:17							|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 3V;I													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:105903003										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:C877:923									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| PROGRAMMER,TWENTYEIGHT								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.contained.extension.valueString					| urn:va:order:C877:17:7418.1							|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Infusion									|
	| content.contained.identifier.value						| urn:va:user:C877:983									|
	| content.contained.name.text								| PROVIDER,ONE											|
	| content.contained.type.text								| V														|
	#uid field
	#| content.contained.identifier.value						| urn:va:med:C877:17:7418.1								|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 1997-12-11T16:23:00									|
	| content.contained.patient.reference						| IS_SET												|
	# following fields are from Medication resource type.
	| content.contained.text.div								| CONTAINS DEXTROSE 5% IN WATER INJ,SOLN,POTASSIUM CHLORIDE INJ,SOLN (EXPIRED) |
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:TN101										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| IV SOLUTIONS WITHOUT ELECTROLYTES												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4014924									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| CONTAINS DEXTROSE 5% INJ,BAG,1000ML 					|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 1 MEQ													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:4850										|
	| content.contained.type.coding.code						| urn:va:vuid:4017760									|
	| content.contained.type.coding.display						| DEXTROSE												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:418297009										|
	| content.contained.type.coding.display						| DEXTROSE 5% IN WATER INJ,SOLN							|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| POTASSIUM CHLORIDE INJ,SOLN							|
	| content.contained.code.coding.code						| urn:vandf:4017760										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010582									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010586									|
	| content.contained.code.coding.code						| urn:rxnorm:4850										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000147647									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000006402									|
	| content.contained.code.text								| POTASSIUM CHLORIDE INJ,SOLN							|
	# fields specific to IV following is from Medicatin Administration resource type
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#ivRate		|
	| content.dosage.extension.valueString						| 10 ml/hr												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	| content.contained.extension.valueString					| 100 ML												|
	
# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.

@f100_3_iv_medication_fhir @fhir
Scenario: Client can request IV medication results in FHIR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests in-patient medication results for the patient "10146V393772" in FHIR format
Then a successful response is returned
Then the client receives 8 FHIR "VistA" result(s)
And the client receives 4 FHIR "panorama" result(s)
And the FHIR results contain "medication administration results" 

	| field														| value									|
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:301:			|
#	| content.contained.identifier.value						| CONTAINS urn:va:med:9E7A:301			|		
	| content.contained.product.form.text						| IS_NOT_SET							|
	| content.contained.dosageInstruction.text					| IS_NOT_SET							|	
	| content.contained.type.text								| V										|
	| content.contained.status									| stopped								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus|
	| content.contained.extension.valueString					| urn:sct:73425007						|
	| content.contained.type.coding.code						| urn:va:vuid:4022505					|
	| content.contained.type.coding.display						| DEXTROSE/POTASSIUM CHLORIDE/SODIUM CHLORIDE|
	| content.dosage.quantity.value								| IS_NOT_SET							|
	| content.dosage.extension.valueString						| 150 ml/hr								|	
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE					|
	| content.contained.location.location.display				| GEN MED								|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001					|						
	
@f100_4_iv_medication_fhir @fhir
Scenario: Client can request IV medication results in FHIR format
Given a patient with "IV medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests in-patient medication results for the patient "10146V393772" in FHIR format
Then a successful response is returned
Then the client receives 8 FHIR "VistA" result(s)
And the client receives 4 FHIR "kodak" result(s)
And the FHIR results contain "medication administration results" 

	| field														| value									|
	| content.identifier.value									| CONTAINS urn:va:med:C877:301			|
#	| content.contained.identifier.value						| CONTAINS urn:va:med:C877:301			|	
	| content.contained.product.form.text						| IS_NOT_SET							|
	| content.contained.dosageInstruction.text					| IS_NOT_SET							|	
	| content.contained.type.text								| V										|
	| content.contained.status									| stopped								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus|
	| content.contained.extension.valueString					| urn:sct:73425007						|
	| content.contained.type.coding.code						| urn:va:vuid:4022505					|
	| content.contained.type.coding.display						| DEXTROSE/POTASSIUM CHLORIDE/SODIUM CHLORIDE|
	| content.dosage.quantity.value								| IS_NOT_SET							|
	| content.dosage.extension.valueString						| 150 ml/hr								|	
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE					|
	| content.contained.location.location.display				| GEN MED								|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001					|		
		
@f100_5_iv_medication_neg_fhir
Scenario: Negative scenario.  Client can request medication results in FHIR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests in-patient medication results for the patient "9E7A;100184" in FHIR format
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed	
	
	


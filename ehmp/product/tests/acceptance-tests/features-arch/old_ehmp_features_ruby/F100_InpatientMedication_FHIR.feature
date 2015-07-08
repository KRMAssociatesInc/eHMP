@Medication_fhir @fhir


Feature: F100 Return of Inpatient Medications in FHIR format 

#This feature item returns Inpatient Medications in FHIR format. Also includes cases where no Inpatient Medications exist.

	
# in-patient medication maps to medication administration in FHIR URL

@f100_1_inpatient_medication_fhir @fhir
Scenario: Client can request in-patient medication results in FHIR format
Given a patient with "in-patient medication results" in multiple VistAs
Given a patient with pid "9E7A;100033" has been synced through Admin API
When the client requests in-patient medication results for the patient "9E7A;100033" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 2 FHIR "panorama" result(s)
And the FHIR results contain "in-patient medication administration results"

	| field														| panorama_value										|
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:100033						|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 2U;I													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:105903003										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:9E7A:10000000047							|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| LABTECH,FIFTYSEVEN									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	#| content.contained.extension.valueString					| urn:va:order:9E7A:100033:17694						|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Inpatient									|
	| content.contained.identifier.value						| urn:va:user:9E7A:10958								|
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE									|
	| content.contained.location.period.start					| 2006-06-16T12:38:00									|
	| content.contained.location.period.end						| 2006-06-16T12:38:00									|
	| content.contained.type.text								| I														|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#locationUid	|
	| content.contained.extension.valueString					| urn:va:location:9E7A:11								|
	#uid field
	| content.contained.identifier.value						| urn:va:med:9E7A:100033:17694							|
	| content.contained.location.location.display				| BCMA													|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 2006-06-16T12:38:00									|
	| content.contained.patient.reference						| IS_SET												|
	| content.contained.text.div								| CONTAINS INSULIN NOVOLIN N(NPH) INJ (EXPIRED)			|
	# following fields are from Medication resource type.
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:HS501										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| INSULIN												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4001483									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N 				|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 100 UNIT/ML											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:5856										|
	| content.contained.type.coding.code						| urn:va:vuid:4019786									|
	| content.contained.type.coding.display						| INSULIN												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| INSULIN NOVOLIN N(NPH) INJ							|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| INSULIN NOVOLIN N(NPH) INJ							|
	| content.contained.code.coding.code						| urn:vandf:4019786										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010574									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000029177									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001 								|
	| content.contained.code.coding.code						| urn:ndfrt:N0000029183									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000004931									|
	| content.contained.code.coding.code						| urn:rxnorm:5856										|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000147876									|	
	| content.contained.code.text								| INSULIN NOVOLIN N(NPH) INJ							|
	#following fields are from Medication resource type and only available for out-patient and in-patient meds.
	#| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	#| content.contained.code.coding.system						| 	|
	#| content.contained.code.coding.code						|	|
	#| content.contained.code.coding.display					| 	|
	| content.contained.product.form.text						| INJ													|
	| content.contained.dosageInstruction.text					| Give: 8 UNITS SC QD									|
	#following fields are from MedicationAdministration resource type and for IV and in-patient meds
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind			|
	| content.extension.valueString								| Medication, Inpatient									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.extension.valueString								| urn:va:order:9E7A:100033:17694						|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.extension.valueString								| urn:va:user:9E7A:10000000047							|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.extension.valueString								| LABTECH,FIFTYSEVEN									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#supply		|
	| content.extension.valueString								| false													|
	| content.contained.identifier.value						| urn:va:user:9E7A:10958								|
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE									|
	#No longer mapped | content.contained.identifier.value		| 9E7A;100033											|
	#providerUID
	#providerName they are repeated.  Are they needed.  There are few more field that are repeated.
	| content.whenGiven.start									| 2006-06-16T11:00:00									|
	| content.whenGiven.end										| 2006-09-25T00:00:00									|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.dosage.extension.valueString						| 0														|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.dosage.extension.valueString						| 144780												|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#predecessor	|
	| content.dosage.extension.valueString						| urn:va:med:9E7A:100033:17693							|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#imo			|
	| content.dosage.extension.valueString						| false													|
	| content.dosage.timingPeriod.extension.url					| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timingPeriod.extension.valueString			| QD													|
	| content.dosage.route.text									| SC													|
	# this patient doesn't have dosevalwhich is mapped to value.  So units will not be outputted either.  Below fields are ignored.
	#| content.dosage.quantity.value								| no value												|
	#| content.dosage.quantity.units								| 43													|

	And the FHIR results contain "in-patient medication administration results"
	
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#successor		|
	| content.dosage.extension.valueString						| urn:va:med:9E7A:100033:17694							|
	

@f100_2_inpatient_medication_fhir @fhir
Scenario: Client can request in-patient medication results in FHIR format
Given a patient with "in-patient medication results" in multiple VistAs
Given a patient with pid "100031V310296" has been synced through Admin API
When the client requests in-patient medication results for the patient "100031V310296" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 2 FHIR "kodak" result(s)
And the FHIR results contain "in-patient medication administration results"

	| field														| kodak_value					    					|
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:C877:100033						|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 2U;I													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:105903003										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:C877:10000000047							|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| LABTECH,FIFTYSEVEN									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.contained.extension.valueString					| urn:va:order:C877:100033:17694						|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Inpatient									|
	#| content.contained.identifier.value						| urn:va:user:C877:10958								|
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE									|
	| content.contained.location.period.start					| 2006-06-16T12:38:00									|
	| content.contained.location.period.end						| 2006-06-16T12:38:00									|
	| content.contained.type.text								| I														|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#locationUid	|
	| content.contained.extension.valueString					| urn:va:location:C877:11								|
	#uid field
	| content.contained.identifier.value						| urn:va:med:C877:100033:17694							|
	| content.contained.location.location.display				| BCMA													|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 2006-06-16T12:38:00									|
	| content.contained.patient.reference						| IS_SET												|
	| content.contained.text.div								| CONTAINS INSULIN NOVOLIN N(NPH) INJ (EXPIRED)			|
	# following fields are from Medication resource type.
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:HS501										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| INSULIN												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4001483									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N 				|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 100 UNIT/ML											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:5856										|
	| content.contained.type.coding.code						| urn:va:vuid:4019786									|
	| content.contained.type.coding.display						| INSULIN												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| INSULIN NOVOLIN N(NPH) INJ							|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| INSULIN NOVOLIN N(NPH) INJ							|
	| content.contained.code.coding.code						| urn:vandf:4019786										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000010574									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000029177									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000001 								|
	| content.contained.code.coding.code						| urn:ndfrt:N0000029183									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000004931									|
	| content.contained.code.coding.code						| urn:rxnorm:5856										|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000147876									|	
	| content.contained.code.text								| INSULIN NOVOLIN N(NPH) INJ							|
	#following fields are from Medication resource type and only available for out-patient and in-patient meds.
	#| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	#| content.contained.code.coding.system						| 	|
	#| content.contained.code.coding.code						|	|
	#| content.contained.code.coding.display					| 	|
	| content.contained.product.form.text						| INJ													|
	| content.contained.dosageInstruction.text					| Give: 8 UNITS SC QD									|
	#following fields are from MedicationAdministration resource type and for IV and in-patient meds
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind			|
	| content.extension.valueString								| Medication, Inpatient									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.extension.valueString								| urn:va:order:C877:100033:17694						|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.extension.valueString								| urn:va:user:C877:10000000047							|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.extension.valueString								| LABTECH,FIFTYSEVEN									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#supply		|
	| content.extension.valueString								| false													|
	| content.contained.identifier.value						| urn:va:user:C877:10958								|
	| content.contained.name.text								| WARDCLERK,FIFTYTHREE									|
	#No longer mapped | content.contained.identifier.value		| 9E7A;100033											|
	#providerUID
	#providerName they are repeated.  Are they needed.  There are few more field that are repeated.
	| content.whenGiven.start									| 2006-06-16T11:00:00									|
	| content.whenGiven.end										| 2006-09-25T00:00:00									|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.dosage.extension.valueString						| 0														|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.dosage.extension.valueString						| 144780												|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#predecessor	|
	| content.dosage.extension.valueString						| urn:va:med:C877:100033:17693							|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#imo			|
	| content.dosage.extension.valueString						| false													|
	| content.dosage.timingPeriod.extension.url					| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timingPeriod.extension.valueString			| QD													|
	| content.dosage.route.text									| SC													|
	# this patient doesn't have dosevalwhich is mapped to value.  So units will not be outputted either.  Below fields are ignored.
	#| content.dosage.quantity.value								| no value												|
	#| content.dosage.quantity.units								| 43													|

	And the FHIR results contain "in-patient medication administration results"
	
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#successor		|
	| content.dosage.extension.valueString						| urn:va:med:C877:100033:17694							|


# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.
	
@f100_3_inpatient_medication_fhir @fhir
Scenario: Client can request in-patient medication results in FHIR format
Given a patient with "in-patient medication results" in multiple VistAs
Given a patient with pid "5000000341V359724" has been synced through Admin API
When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
Then a successful response is returned
#Then the client receives 3 FHIR "VistA" result(s)
#And the client receives 3 FHIR "panorama" result(s)
#Updated counts for Cache update
Then the client receives 16 FHIR "VistA" result(s)
And the client receives 8 FHIR "panorama" result(s)
And the FHIR results contain "in-patient medication administration results"

	| field														| value													|
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:100022						|
	| content.contained.product.form.text						| TAB													|
	| content.contained.dosageInstruction.text					| Give: 325MG PO Q4H									|
	| content.contained.type.text								| I														|
	| content.contained.status									| completed												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.type.coding.code						| urn:va:vuid:4017513									|
	| content.contained.type.coding.display						| ACETAMINOPHEN											|
	| content.dosage.quantity.value								| EMPTY													|
	| content.dosage.timingPeriod.extension.url					| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timingPeriod.extension.valueString			| Q4H													|
	| content.contained.name.text								| PHYSICIAN,ASSISTANT									|
	| content.contained.location.location.display				| BCMA													|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|

@f100_4_inpatient_medication_fhir @fhir
Scenario: Client can request in-patient medication results in FHIR format
Given a patient with "in-patient medication results" in multiple VistAs
Given a patient with pid "5000000341V359724" has been synced through Admin API
When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
Then a successful response is returned
#Then the client receives 3 FHIR "VistA" result(s)
#And the client receives 3 FHIR "kodak" result(s)
#Updated counts for Cache update
Then the client receives 16 FHIR "VistA" result(s)
And the client receives 8 FHIR "kodak" result(s)
And the FHIR results contain "in-patient medication administration results"

	| field														| value													|
	| content.identifier.value									| CONTAINS urn:va:med:C877:100022						|
	| content.contained.product.form.text						| TAB													|
	| content.contained.dosageInstruction.text					| Give: 325MG PO Q4H									|
	| content.contained.type.text								| I														|
	| content.contained.status									| completed												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.type.coding.code						| urn:va:vuid:4017513									|
	| content.contained.type.coding.display						| ACETAMINOPHEN											|
	| content.dosage.quantity.value								| EMPTY													|
	| content.dosage.timingPeriod.extension.url					| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timingPeriod.extension.valueString			| Q4H													|
	| content.contained.name.text								| PHYSICIAN,ASSISTANT									|
	| content.contained.location.location.display				| BCMA													|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|

# negative test case for medication.

@f100_5_in_medication_neg_fhir	
Scenario: Negative scenario.  Client can request Inpatient Medications in FHIR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests in-patient medication results for the patient "9E7A;100184" in FHIR format
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed	
	

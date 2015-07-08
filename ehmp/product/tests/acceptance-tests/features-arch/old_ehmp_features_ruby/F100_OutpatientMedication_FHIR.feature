@Medication_fhir @fhir
Feature: F100 Return of Outpatient Medications in FHIR format

#This feature item returns Outpatient Medications in FHIR format. Also includes cases where no Outpatient Medications exist.


#out-patient medication is mapped to Medication Dispense in FHIR URL.

@f100_1_outpatient_medication_fhir @fhir 
Scenario: Client can request Outpatient Medications in FHIR format
Given a patient with "out-patient medication results" in multiple VistAs
Given a patient with pid "5000000318V495398" has been synced through Admin API
When the client requests out-patient medication results for the patient "5000000318V495398" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "panorama" result(s)
And the FHIR results contain "medication dispense results"

	| field														| panorama_value										|
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:100817						|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 403827;O												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:73639000										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:9E7A:20117								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| PHARMACIST,THREE										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.contained.extension.valueString					| urn:va:order:9E7A:100817:27831						|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Outpatient								|
	| content.contained.identifier.value						| urn:va:user:9E7A:20010								|
	| content.contained.name.text								| VEHU,EIGHT											|
	| content.contained.location.period.start					| 2009-08-10T17:38:00									|
	| content.contained.location.period.end						| 2009-08-10T17:38:00									|
	| content.contained.type.text								| O														|
	#uid field
	#| content.contained.identifier.value						| urn:va:med:9E7A:100817:27831							|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 2009-08-10T17:38:00									|
	| content.contained.patient.reference						| IS_SET												|
	# following fields are from Medication resource type.
	| content.contained.text.div								| CONTAINS LISINOPRIL 10MG TAB (EXPIRED)				|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:CV800										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| ACE INHIBITORS										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4008593									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| LISINOPRIL 10MG TAB 									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 10 MG													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:29046										|
	| content.contained.type.coding.code						| urn:va:vuid:4019380									|
	| content.contained.type.coding.display						| LISINOPRIL											|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| LISINOPRIL TAB										|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| LISINOPRIL TAB										|
	| content.contained.code.coding.code						| urn:vandf:4019380										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007697									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007833									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007874									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007507									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000147537									|	
	| content.contained.code.coding.code						| urn:rxnorm:29046										|	
	| content.contained.code.text								| LISINOPRIL TAB										|
	#following fields are from Medication resource type and only available for outpatient and inpatient meds.
	#| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	#| content.contained.code.coding.system						| 	|
	#| content.contained.code.coding.code						|	|
	#| content.contained.code.coding.display					| 	|
	| content.contained.product.form.text						| TAB													|
	| content.contained.dosageInstruction.text					| TAKE ONE TABLET BY MOUTH TWICE A DAY					|
	#following fields are from Medication Dispense resource type only available for outpatient meds
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#lastFilled	|
	| content.extension.valueString								| 20090810												|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#type			|
	| content.extension.valueString								| Prescription											|
	| content.identifier.value									| urn:va:med:9E7A:100817:27831							|
	| content.status											| completed												|
	| content.patient.reference									| IS_SET												|
	| content.dispenser.reference								| IS_SET												|
	| content.authorizingPrescription.reference					| IS_SET												|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#fillCost		|
	| content.dispense.extension.valueString					| 3.75													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#fillsRemaining|
	| content.dispense.extension.valueString					| 11													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#vaRouting		|
	| content.dispense.extension.valueString					| W														|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#units			|
	| content.extension.valueString								| MG													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#imo			|
	| content.extension.valueString								| false													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#daysSupplyDispensed|
	| content.dispense.extension.valueString					| 30													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#routing		|
	| content.dispense.extension.valueString					| W														|
	#| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#partial		|
	#| content.dispense.extension.valueString					| IS_NOT_SET											|
	| content.contained.dispense.validityPeriod.extension.url	| http://vistacore.us/fhir/extensions/med#stopped		|
	| content.contained.dispense.validityPeriod.extension.valueString| 20100811												|
	| content.contained.dispense.validityPeriod.start			| 2009-08-10T00:00:00									|
	| content.contained.dispense.validityPeriod.end				| 2010-08-11T00:00:00									|
	| content.dispense.quantity.value							| 60													|
	| content.dispense.whenPrepared								| IS_NOT_SET											|
	| content.dispense.whenHandedOver							| 2009-08-10											|
	# following are from Medication Prescription resource type
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#scheduleFreq	|
	| content.contained.extension.valueString					| 720													|
	| content.contained.name									| CAMP MASTER											|
	| content.contained.identifier.value						| 500605												|
	| content.contained.text.status								| generated												|
	| content.contained.identifier.value						| 500													|
	| content.contained.medication.display						| LISINOPRIL TAB										|
	| content.contained.medication.reference					| IS_SET												|
	| content.contained.dosageInstruction.extension.url			| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.contained.dosageInstruction.extension.valueString	| 0														|
	| content.contained.dosageInstruction.extension.url			| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.contained.dosageInstruction.extension.valueString	| 527040												|												
	| content.contained.dosageInstruction.timingPeriod.extension.url			| http://vistacore.us/fhir/extensions/med#scheduleType	|
	| content.contained.dosageInstruction.timingPeriod.extension.valueString	| CONTINUOUS											|
	| content.contained.dosageInstruction.timingPeriod.start	| 2009-08-10T00:00:00									|											
	| content.contained.dosageInstruction.timingPeriod.end		| 2010-08-11T00:00:00									|
	| content.contained.dosageInstruction.timingSchedule.extension.url			| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.contained.dosageInstruction.timingSchedule.extension.valueString	| BID													|
	| content.contained.dosageInstruction.route.coding.code		| PO													|
	| content.contained.dosageInstruction.route.coding.display	| Oral													|
	| content.contained.dosageInstruction.route.coding.system	| http://www.hl7.org/implement/standards/fhir/v3/RouteOfAdministration/	|
	| content.contained.dosageInstruction.doseQuantity.value	| 10													|
	| content.contained.dosageInstruction.doseQuantity.units	| MG													|
	| content.contained.dispense.numberOfRepeatsAllowed			| 11													|
	| content.contained.dispense.quantity.value					| 60													|
	| content.contained.dispense.expectedSupplyDuration.value	| 30													|
	
@f100_2_outpatient_medication_fhir @fhir 
Scenario: Client can request out-patient medication results in FHIR format
Given a patient with "out-patient medication results" in multiple VistAs
Given a patient with pid "5000000318V495398" has been synced through Admin API
When the client requests out-patient medication results for the patient "5000000318V495398" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "kodak" result(s)
And the FHIR results contain "medication dispense results"

	| field														| kodak_value								  		    |
	# following fields are from Medication Prescription resource type.
	| content.identifier.value									| CONTAINS urn:va:med:C877:100817						|
	| content.contained.extension.url 							| http://vistacore.us/fhir/extensions/med#localId		|
	| content.contained.extension.valueString					| 403827;O												|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus		|
	| content.contained.extension.valueString					| urn:sct:392521001										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatusName	|
	| content.contained.extension.valueString					| historical											|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medType		|
	| content.contained.extension.valueString					| urn:sct:73639000										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	| content.contained.extension.valueString					| urn:va:user:C877:20117								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#pharmacistName|
	| content.contained.extension.valueString					| PHARMACIST,THREE										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#supply		|
	| content.contained.extension.valueString					| false													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.contained.extension.valueString					| urn:va:order:C877:100817:27831						|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#kind			|
	| content.contained.extension.valueString					| Medication, Outpatient								|
	| content.contained.identifier.value						| urn:va:user:C877:20010								|
	| content.contained.name.text								| VEHU,EIGHT											|
	| content.contained.location.period.start					| 2009-08-10T17:38:00									|
	| content.contained.location.period.end						| 2009-08-10T17:38:00									|
	| content.contained.type.text								| O														|
	#uid field
	#| content.contained.identifier.value						| urn:va:med:C877:100817:27831							|
	| content.contained.status									| completed												|
	| content.contained.dateWritten								| 2009-08-10T17:38:00									|
	| content.contained.patient.reference						| IS_SET												|
	# following fields are from Medication resource type.
	| content.contained.text.div								| CONTAINS LISINOPRIL 10MG TAB (EXPIRED)				|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:CV800										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| ACE INHIBITORS										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4008593									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| LISINOPRIL 10MG TAB 									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 10 MG													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:29046										|
	| content.contained.type.coding.code						| urn:va:vuid:4019380									|
	| content.contained.type.coding.display						| LISINOPRIL											|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| LISINOPRIL TAB										|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| LISINOPRIL TAB										|
	| content.contained.code.coding.code						| urn:vandf:4019380										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007697									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007833									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007874									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007507									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000147537									|	
	| content.contained.code.coding.code						| urn:rxnorm:29046										|	
	| content.contained.code.text								| LISINOPRIL TAB										|
	#following fields are from Medication resource type and only available for outpatient and inpatient meds.
	#| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#volume		|
	#| content.contained.code.coding.system						| 	|
	#| content.contained.code.coding.code						|	|
	#| content.contained.code.coding.display					| 	|
	| content.contained.product.form.text						| TAB													|
	| content.contained.dosageInstruction.text					| TAKE ONE TABLET BY MOUTH TWICE A DAY					|
	#following fields are from Medication Dispense resource type only available for outpatient meds
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#lastFilled	|
	| content.extension.valueString								| 20090810												|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#type			|
	| content.extension.valueString								| Prescription											|
	| content.identifier.value									| urn:va:med:C877:100817:27831							|
	| content.status											| completed												|
	| content.patient.reference									| IS_SET												|
	| content.dispenser.reference								| IS_SET												|
	| content.authorizingPrescription.reference					| IS_SET												|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#fillCost		|
	| content.dispense.extension.valueString					| 3.75													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#fillsRemaining|
	| content.dispense.extension.valueString					| 11													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#vaRouting		|
	| content.dispense.extension.valueString					| W														|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#units			|
	| content.extension.valueString								| MG													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#imo			|
	| content.extension.valueString								| false													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#daysSupplyDispensed|
	| content.dispense.extension.valueString					| 30													|
	| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#routing		|
	| content.dispense.extension.valueString					| W														|
	#| content.dispense.extension.url							| http://vistacore.us/fhir/extensions/med#partial		|
	#| content.dispense.extension.valueString					| IS_NOT_SET											|
	| content.contained.dispense.validityPeriod.extension.url	| http://vistacore.us/fhir/extensions/med#stopped		|
	| content.contained.dispense.validityPeriod.extension.valueString| 20100811												|
	| content.contained.dispense.validityPeriod.start			| 2009-08-10T00:00:00									|
	| content.contained.dispense.validityPeriod.end				| 2010-08-11T00:00:00									|
	| content.dispense.quantity.value							| 60													|
	| content.dispense.whenPrepared								| IS_NOT_SET											|
	| content.dispense.whenHandedOver							| 2009-08-10											|
	# following are from Medication Prescription resource type
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#scheduleFreq	|
	| content.contained.extension.valueString					| 720													|
	| content.contained.name									| CAMP BEE												|
	| content.contained.identifier.value						| 500605												|
	| content.contained.text.status								| generated												|
	| content.contained.identifier.value						| 500													|
	| content.contained.medication.display						| LISINOPRIL TAB										|
	| content.contained.medication.reference					| IS_SET												|
	| content.contained.dosageInstruction.extension.url			| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.contained.dosageInstruction.extension.valueString	| 0														|
	| content.contained.dosageInstruction.extension.url			| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.contained.dosageInstruction.extension.valueString	| 527040												|												
	| content.contained.dosageInstruction.timingPeriod.extension.url			| http://vistacore.us/fhir/extensions/med#scheduleType	|
	| content.contained.dosageInstruction.timingPeriod.extension.valueString	| CONTINUOUS											|
	| content.contained.dosageInstruction.timingPeriod.start	| 2009-08-10T00:00:00									|											
	| content.contained.dosageInstruction.timingPeriod.end		| 2010-08-11T00:00:00									|
	| content.contained.dosageInstruction.timingSchedule.extension.url			| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.contained.dosageInstruction.timingSchedule.extension.valueString	| BID													|
	| content.contained.dosageInstruction.route.coding.code		| PO													|
	| content.contained.dosageInstruction.route.coding.display	| Oral													|
	| content.contained.dosageInstruction.route.coding.system	| http://www.hl7.org/implement/standards/fhir/v3/RouteOfAdministration/	|
	| content.contained.dosageInstruction.doseQuantity.value	| 10													|
	| content.contained.dosageInstruction.doseQuantity.units	| MG													|
	| content.contained.dispense.numberOfRepeatsAllowed			| 11													|
	| content.contained.dispense.quantity.value					| 60													|
	| content.contained.dispense.expectedSupplyDuration.value	| 30													|

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.
	
@f100_3_outpatient_medication_fhir @fhir 
Scenario: Client can request out-patient medication results in FHIR format
Given a patient with "out-patient medication results" in multiple VistAs
Given a patient with pid "9E7A;167" has been synced through Admin API
When the client requests out-patient medication results for the patient "9E7A;167" in FHIR format
Then a successful response is returned
Then the client receives 3 FHIR "VistA" result(s)
And the client receives 3 FHIR "panorama" result(s)
And the FHIR results contain "medication dispense results"

	| field														| value												|
	| content.identifier.value									| CONTAINS urn:va:med:9E7A:167						|
	#| content.contained.identifier.value						| CONTAINS urn:va:order:9E7A:167					|
	| content.contained.name									| CAMP MASTER										|
	| content.contained.identifier.value						| 500												|
	| content.contained.product.form.text						| SUPP,RTL											|
	| content.contained.dosageInstruction.text					| TAKE 1 TABLET(S) BY BY MOUTH EVERY 4 HOURS		|
	| content.contained.type.text								| O													|
	| content.contained.status									| completed											|
	| content.contained.dispense.validityPeriod.start			| 2000-01-26T00:00:00								|
	| content.contained.dispense.validityPeriod.end				| 2001-01-26T00:00:00								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus	|
	| content.contained.extension.valueString					| urn:sct:392521001									|
	| content.contained.type.coding.code						| urn:va:vuid:4017513								|
	| content.contained.type.coding.display						| ACETAMINOPHEN										|
	| content.contained.name.text								| PROGRAMMER,TWENTYEIGHT							|
	| content.contained.location.location.display				| GENERAL MEDICINE									|
	| content.dispense.whenHandedOver							| 2000-01-26										|
	| content.dispense.quantity.value							| 100												|
	| content.contained.code.coding.code						| urn:vandf:4017513									|	
	
@f100_4_outpatient_medication_fhir @fhir 
Scenario: Client can request out-patient medication results in FHIR format
Given a patient with "out-patient medication results" in multiple VistAs
Given a patient with pid "C877;167" has been synced through Admin API
When the client requests out-patient medication results for the patient "C877;167" in FHIR format
Then a successful response is returned
Then the client receives 3 FHIR "VistA" result(s)
And the client receives 3 FHIR "kodak" result(s)
And the FHIR results contain "medication dispense results"

	| field														| value												|
	| content.identifier.value									| CONTAINS urn:va:med:C877:167						|
	| content.contained.name									| CAMP BEE											|
	| content.contained.identifier.value						| 500												|
	| content.contained.product.form.text						| SUPP,RTL											|
	| content.contained.dosageInstruction.text					| TAKE 1 TABLET(S) BY BY MOUTH EVERY 4 HOURS		|
	| content.contained.type.text								| O													|
	| content.contained.status									| completed											|
	| content.contained.dispense.validityPeriod.start			| 2000-01-26T00:00:00								|
	| content.contained.dispense.validityPeriod.end				| 2001-01-26T00:00:00								|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus	|
	| content.contained.extension.valueString					| urn:sct:392521001									|
	| content.contained.type.coding.code						| urn:va:vuid:4017513								|
	| content.contained.type.coding.display						| ACETAMINOPHEN										|
	| content.contained.name.text								| PROGRAMMER,TWENTYEIGHT							|
	| content.contained.location.location.display				| GENERAL MEDICINE									|
	| content.dispense.whenHandedOver							| 2000-01-26										|
	| content.dispense.quantity.value							| 100												|
	| content.contained.code.coding.code						| urn:vandf:4017513									|	
	
# negative test case, already run as part of inpatient medication.
	
@f100_5_outpatient_medication_neg_fhir
Scenario: Negative scenario.  Client can request Outpatient Medications in FHIR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests out-patient medication results for the patient "9E7A;100184" in FHIR format
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed
	

	
	
	

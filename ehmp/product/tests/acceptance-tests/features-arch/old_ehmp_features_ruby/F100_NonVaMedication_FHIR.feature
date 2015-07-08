@Medication_fhir11 @fhir
Feature: F100 Return of Non-VA Medications in FHIR format 

#This feature item returns Non-VA Medications in FHIR format. Also includes cases where no Non-VA Medications exist.

	
# non-va medication maps to Medication Statement in FHIR URL.

@f100_1_nonvapatient_medication_fhir @fhir
Scenario: Client can request Non-VA Medications in FHIR format
Given a patient with "non-va-patient medication results" in multiple VistAs
Given a patient with pid "10118V572553" has been synced through Admin API
When the client requests non-va medication results for the patient "10118V572553" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "panorama" result(s)
And the FHIR results contain "medication statement results"                                                    
	| field														| panorama_value										| 
      
	# following fields are from Medication Statement resource type.	
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind			|
	| content.extension.valueString								| Medication, Non-VA									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.extension.valueString								| urn:va:order:9E7A:149:18028							|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	#| content.extension.valueString							| no data												|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#pharmacistName|
	#| content.extension.valueString							| no data												|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#administrations|
	#| content.extension.valueString							| EMPTY													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#supply		|
	| content.extension.valueString								| false													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#providerUid	|
	| content.extension.valueString								| urn:va:user:9E7A:10000000031							|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#providerName	|
	| content.extension.valueString								| VEHU,ONEHUNDRED										|
	| content.patient.display									| 9E7A;149													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#locationUid	|
	| content.extension.valueString								| urn:va:location:9E7A:23								|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#vaStatus		|
	| content.extension.valueString								| ACTIVE												|
	# when given start and end no data
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.dosage.extension.valueString						| 0														|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.dosage.extension.valueString						| 0														|
	# successor , predecessor no data
	#| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#fills			|
	#| content.dosage.extension.valueString						| EMTPY													|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#imo			|
	| content.dosage.extension.valueString						| false													|
	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timing.extension.valueString				| QAM													|
	| content.dosage.route.text									| PO													|
	| content.dosage.quantity.units								| MG													|
	| content.dosage.quantity.value								| 81													|
	
	# following fields are from Medication resource type
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:CN103										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| NON-OPIOID ANALGESICS									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4005766									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| ASPIRIN 81MG TAB,EC 									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 81 MG													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:1191										|
	| content.contained._id										| IS_SET												|
	| content.contained.type.coding.code						| urn:va:vuid:4017536									|
	| content.contained.type.coding.display						| ASPIRIN												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| ASPIRIN TAB,EC										|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| ASPIRIN TAB,EC										|
	| content.contained.code.coding.code						| urn:vandf:4017536										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007676									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000185640									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007628									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000005901									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000006035									|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000008137									|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000145918									|
	| content.contained.code.coding.code						| urn:rxnorm:1191										|
	| content.contained.code.text								| ASPIRIN TAB,EC										|
	
@f100_2_nonvapatient_medication_fhir @fhir
Scenario: Client can request non-va-patient medication results in FHIR format
Given a patient with "non-va-patient medication results" in multiple VistAs
Given a patient with pid "10118V572553" has been synced through Admin API
When the client requests non-va medication results for the patient "10118V572553" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "kodak" result(s)
And the FHIR results contain "medication statement results"                                                    
	| field														| kodak_value									    	| 
      
	# following fields are from Medication Statement resource type.	
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind			|
	| content.extension.valueString								| Medication, Non-VA									|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#orderUid		|
	| content.extension.valueString								| urn:va:order:C877:149:18028							|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#pharmacistUid	|
	#| content.extension.valueString							| no data												|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#pharmacistName|
	#| content.extension.valueString							| no data												|
	#| content.extension.url									| http://vistacore.us/fhir/extensions/med#administrations|
	#| content.extension.valueString							| EMPTY													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#supply		|
	| content.extension.valueString								| false													|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#providerUid	|
	| content.extension.valueString								| urn:va:user:C877:10000000031							|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#providerName	|
	| content.extension.valueString								| VEHU,ONEHUNDRED										|
	| content.patient.display									| C877;149       										|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#locationUid	|
	| content.extension.valueString								| urn:va:location:C877:23								|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#vaStatus		|
	| content.extension.valueString								| ACTIVE												|
	# when given start and end no data
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStart	|
	| content.dosage.extension.valueString						| 0														|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#relativeStop	|
	| content.dosage.extension.valueString						| 0														|
	# successor , predecessor no data
	#| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#fills			|
	#| content.dosage.extension.valueString						| EMTPY													|
	| content.dosage.extension.url								| http://vistacore.us/fhir/extensions/med#imo			|
	| content.dosage.extension.valueString						| false													|
	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName	|
	| content.dosage.timing.extension.valueString				| QAM													|
	| content.dosage.route.text									| PO													|
	| content.dosage.quantity.units								| MG													|
	| content.dosage.quantity.value								| 81 													|
	
	# following fields are from Medication resource type
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassCode	|
	| content.contained.extension.valueString					| urn:vadc:CN103										|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#drugClassName	|
	| content.contained.extension.valueString					| NON-OPIOID ANALGESICS									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedCode	|
	| content.contained.extension.valueString					| urn:va:vuid:4005766									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#suppliedName	|
	| content.contained.extension.valueString					| ASPIRIN 81MG TAB,EC 									|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#strength		|
	| content.contained.extension.valueString					| 81 MG													|
	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#ingredientRXNCode	|
	| content.contained.extension.valueString					| urn:rxnorm:1191										|
	| content.contained._id										| IS_SET												|
	| content.contained.type.coding.code						| urn:va:vuid:4017536									|
	| content.contained.type.coding.display						| ASPIRIN												|
	| content.contained.type.coding.system						| urn:oid:2.16.840.1.113883.6.233						|
	| content.contained.type.coding.code						| urn:sct:410942007										|
	| content.contained.type.coding.display						| ASPIRIN TAB,EC										|
	| content.contained.type.coding.system						| SNOMED-CT												|
	| content.contained.name									| ASPIRIN TAB,EC										|
	| content.contained.code.coding.code						| urn:vandf:4017536										|
	| content.contained.code.coding.code						| urn:ndfrt:N0000000002									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007676									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000185640									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007628									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000005901									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000006035									|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000008137									|	
	| content.contained.code.coding.code						| urn:ndfrt:N0000145918									|
	| content.contained.code.coding.code						| urn:rxnorm:1191										|
	| content.contained.code.text								| ASPIRIN TAB,EC										|

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.

@f100_3_nonvapatient_medication_fhir @fhir
Scenario: Client can request non-va-patient medication results in FHIR format
Given a patient with "non-va-patient medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests non-va medication results for the patient "10146V393772" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "panorama" result(s)
And the FHIR results contain "medication statement results"
	| field														| value									|
# Note that when merging from PSI4 - this section was a conflict.  The following section was from NEXT - Keeping it for now.
#	| content.contained.identifier.value						| urn:va:med:9E7A:301:17916				|
#	| content.contained.identifier.value						| CONTAINS urn:va:med:9E7A:301			|	
#	| content.contained.type.text								| N										|
#	| content.contained.status									| in progress							|	
#	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus|
#	| content.contained.extension.valueString					| urn:sct:55561003						|
#	| content.contained.type.coding.code						| urn:va:vuid:4017536					|
#	| content.contained.type.coding.display						| ASPIRIN								|
#	| content.contained.name.text								| VEHU,ONEHUNDRED						|
#	| content.contained.location.location.display				| GENERAL MEDICINE						|
#	| content.dosage.quantity.value								| 81									|
#	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName	|
# Note that when merging from PSI4 - this section was a conflict.  The following section was from PSI4 - commenting it out for now.
	| content.identifier.value									| urn:va:med:9E7A:301:17916				|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind		|
	| content.extension.valueString								| Medication, Non-VA								|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#vaStatus	|
	| content.extension.valueString								| ACTIVE											|
	| content.contained.type.coding.code						| urn:va:vuid:4017536					|
	| content.contained.type.coding.display						| ASPIRIN								|
	| content.dosage.quantity.value								| 81									|
	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName|
# End of PSI 4 section
	| content.dosage.timing.extension.valueString				| QAM									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007676					|
	
@f100_4_nonvapatient_medication_fhir @fhir 
Scenario: Client can request non-va-patient medication results in FHIR format
Given a patient with "non-va-patient medication results" in multiple VistAs
Given a patient with pid "10146V393772" has been synced through Admin API
When the client requests non-va medication results for the patient "10146V393772" in FHIR format
Then a successful response is returned
Then the client receives 2 FHIR "VistA" result(s)
And the client receives 1 FHIR "kodak" result(s)
And the FHIR results contain "medication statement results"
	| field														| value									|
# Note that when merging from PSI4 - this section was a conflict.  The following section was from NEXT - Keeping it for now.
#	| content.contained.identifier.value						| urn:va:med:C877:301:10779				|
#	| content.contained.identifier.value						| CONTAINS urn:va:med:9E7A:301			|	
#	| content.contained.type.text								| N										|
#	| content.contained.status									| in progress							|	
#	| content.contained.extension.url							| http://vistacore.us/fhir/extensions/med#medStatus|
#	| content.contained.extension.valueString					| urn:sct:55561003						|
#	| content.contained.type.coding.code						| urn:va:vuid:4017536					|
#	| content.contained.type.coding.display						| ASPIRIN								|
#	| content.contained.name.text								| VEHU,ONEHUNDRED						|
#	| content.contained.location.location.display				| GENERAL MEDICINE						|
#	| content.dosage.quantity.value								| 81									|
#	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName	|
# Note that when merging from PSI4 - this section was a conflict.  The following section was from PSI4 - commenting it out for now.
	| content.identifier.value									| urn:va:med:C877:301:17916				|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#kind	|
	| content.extension.valueString								| Medication, Non-VA							|
	| content.extension.url										| http://vistacore.us/fhir/extensions/med#vaStatus	|
	| content.extension.valueString								| ACTIVE											|
	| content.contained.type.coding.code						| urn:va:vuid:4017536					|
	| content.contained.type.coding.display						| ASPIRIN								|
	| content.dosage.quantity.value								| 81									|
	| content.dosage.timing.extension.url						| http://vistacore.us/fhir/extensions/med#scheduleName|
# End of PSI 4 section
	| content.dosage.timing.extension.valueString				| QAM									|
	| content.contained.code.coding.code						| urn:ndfrt:N0000007676					|
	
@f100_5_nonvapatient_medication_neg_fhir	
Scenario: Negative scenario.  Client can request medication results in FHIR format
Given a patient with "No medication results" in multiple VistAs
Given a patient with pid "9E7A;100184" has been synced through Admin API
When the client requests non-va medication results for the patient "9E7A;100184" in FHIR format
Then a successful response is returned
Then corresponding matching FHIR records totaling "0" are displayed
	

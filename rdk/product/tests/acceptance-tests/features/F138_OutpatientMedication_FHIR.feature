# @Medication_fhir @fhir @vxsync @patient
 Feature: F138 Return of Outpatient Medications in FHIR format

 #This feature item returns Outpatient Medications in FHIR format. Also includes cases where no Outpatient Medications exist.
 #out-patient medication is mapped to Medication Dispense in FHIR URL.

 @F138_1_outpatient_medication_dispense_fhir @fhir @5000000318V495398
 Scenario: Client can request Outpatient Medications in FHIR format
 	Given a patient with "out-patient medication results" in multiple VistAs
 	#And a patient with pid "5000000318V495398" has been synced through the RDK API
 	When the client requests out-patient medication results for the patient "5000000318V495398" in FHIR format
 	Then a successful response is returned
 	Then the client receives 2 FHIR "VistA" result(s)
 	And the client receives 1 FHIR "panorama" result(s)
 	And the FHIR results contain "medication dispense results"
 	| field                | panorama_value               |
 	| resource.resourceType | MedicationDispense           |
  | resource.status       | completed |
  | resource.dispenser.reference  | Provider/urn:va:user:9E7A:20010 |
  | resource.contained.resourceType  | MedicationPrescription     |
  | resource.contained.patient.reference      | Patient/9E7A;100817 |
  | resource.contained.identifier.system    | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.identifier.value     | urn:va:med:9E7A:100817:27831 |
  | resource.contained.status               | completed |
  | resource.contained.dateWritten          | 2009-08-10T17:38:00 |
  | resource.contained.prescriber.reference | Provider/urn:va:user:9E7A:20010 |
  | resource.contained.note                 | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.contained.resourceType     | Medication      |
  | resource.contained.name | LISINOPRIL TAB |
  | resource.contained.code.text | 314076/Lisinopril 10 MG Oral Tablet |
  | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
  | resource.contained.code.coding.code   | 314076 |
  | resource.contained.code.coding.display | Lisinopril 10 MG Oral Tablet |
  | resource.contained.product.form.text  | TAB |
  | resource.contained.product.ingredient.item.display | LISINOPRIL TAB |
  | resource.contained.contained.resourceType | Substance |
  | resource.contained.contained.type.text  | LISINOPRIL 10MG TAB |
  | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.contained.type.coding.code   | urn:va:vuid:4019380 |
  | resource.contained.contained.type.coding.display | LISINOPRIL |
  | resource.contained.contained.type.coding.system | SNOMED-CT |
  | resource.contained.contained.type.coding.code   | urn:sct:410942007 |
  | resource.contained.contained.type.coding.display | LISINOPRIL TAB |
  | resource.contained.contained.description | LISINOPRIL 10MG TAB |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:vandf:4019380 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000175562 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000000001 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000189939 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000006450 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:rxnorm:29046 |
  | resource.identifier.system  | urn:oid:2.16.840.1.113883.6.233 |
  | resource.identifier.value | urn:va:med:9E7A:100817:27831 |
  | resource.authorizingPrescription.display | LISINOPRIL TAB |
  | resource.quantity.value | 60 |
  | resource.quantity.units | TAB |
  | resource.daysSupply.value | 30 |
  | resource.daysSupply.units | days |
  | resource.medication.display | LISINOPRIL TAB |
  | resource.whenPrepared | 2009-08-10 |
  | resource.note | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.dosageInstruction.schedulePeriod.start | 2009-08-10 |
  | resource.dosageInstruction.schedulePeriod.end | 2010-08-11 |
  | resource.dosageInstruction.scheduleTiming.code.text | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.code | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.display | BID |
  | resource.dosageInstruction.scheduleTiming.repeat.frequency | 720 |
  | resource.dosageInstruction.route.text | Oral |
  | resource.dosageInstruction.route.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.dosageInstruction.route.coding.code | PO |
  | resource.dosageInstruction.route.coding.display | Oral |
  | resource.dosageInstruction.doseQuantity.value | 10 |
  | resource.dosageInstruction.doseQuantity.units | MG |



 @F138_2_outpatient_medication_dispense_fhir @fhir @5000000318V495398
 Scenario: Client can request out-patient medication results in FHIR format
 	Given a patient with "out-patient medication results" in multiple VistAs
 	#And a patient with pid "5000000318V495398" has been synced through the RDK API
 	When the client requests out-patient medication results for the patient "5000000318V495398" in FHIR format
 	Then a successful response is returned
 	Then the client receives 2 FHIR "VistA" result(s)
 	And the client receives 1 FHIR "kodak" result(s)
 	And the FHIR results contain "medication dispense results"
 	| field                | kodak_value                  |
 	| resource.resourceType | MedicationDispense           |
  | resource.status       | completed |
  | resource.dispenser.reference  | Provider/urn:va:user:C877:20010 |
  | resource.contained.resourceType  | MedicationPrescription     |
  | resource.contained.patient.reference      | Patient/C877;100817 |
  | resource.contained.identifier.system    | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.identifier.value     | urn:va:med:C877:100817:27831 |
  | resource.contained.status               | completed |
  | resource.contained.dateWritten          | 2009-08-10T17:38:00 |
  | resource.contained.prescriber.reference | Provider/urn:va:user:C877:20010 |
  | resource.contained.note                 | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.contained.resourceType     | Medication      |
  | resource.contained.name | LISINOPRIL TAB |
  | resource.contained.code.text | 314076/Lisinopril 10 MG Oral Tablet |
  | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
  | resource.contained.code.coding.code   | 314076 |
  | resource.contained.code.coding.display | Lisinopril 10 MG Oral Tablet |
  | resource.contained.product.form.text  | TAB |
  | resource.contained.product.ingredient.item.display | LISINOPRIL TAB |
  | resource.contained.contained.resourceType | Substance |
  | resource.contained.contained.type.text  | LISINOPRIL 10MG TAB |
  | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.contained.type.coding.code   | urn:va:vuid:4019380 |
  | resource.contained.contained.type.coding.display | LISINOPRIL |
  | resource.contained.contained.type.coding.system | SNOMED-CT |
  | resource.contained.contained.type.coding.code   | urn:sct:410942007 |
  | resource.contained.contained.type.coding.display | LISINOPRIL TAB |
  | resource.contained.contained.description | LISINOPRIL 10MG TAB |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:vandf:4019380 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000175562 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000000001 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000189939 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:ndfrt:N0000006450 |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
  | resource.contained.extension.valueString  | urn:rxnorm:29046 |
  | resource.identifier.system  | urn:oid:2.16.840.1.113883.6.233 |
  | resource.identifier.value | urn:va:med:C877:100817:27831 |
  | resource.authorizingPrescription.display | LISINOPRIL TAB |
  | resource.quantity.value | 60 |
  | resource.quantity.units | TAB |
  | resource.daysSupply.value | 30 |
  | resource.daysSupply.units | days |
  | resource.medication.display | LISINOPRIL TAB |
  | resource.whenPrepared | 2009-08-10 |
  | resource.note | LISINOPRIL 10MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.dosageInstruction.schedulePeriod.start | 2009-08-10 |
  | resource.dosageInstruction.schedulePeriod.end | 2010-08-11 |
  | resource.dosageInstruction.scheduleTiming.code.text | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.code | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.display | BID |
  | resource.dosageInstruction.scheduleTiming.repeat.frequency | 720 |
  | resource.dosageInstruction.route.text | Oral |
  | resource.dosageInstruction.route.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.dosageInstruction.route.coding.code | PO |
  | resource.dosageInstruction.route.coding.display | Oral |
  | resource.dosageInstruction.doseQuantity.value | 10 |
  | resource.dosageInstruction.doseQuantity.units | MG |

 @F138_3_outpatient_medication_dispense_fhir @fhir @9E7A167
 Scenario: Client can request out-patient medication results in FHIR format
 	Given a patient with "out-patient medication results" in multiple VistAs
 	#And a patient with pid "10104V248233" has been synced through the RDK API
 	When the client requests out-patient medication results for the patient "10104V248233" in FHIR format
 	Then a successful response is returned
 	Then the client receives 42 FHIR "VistA" result(s)
 	And the client receives 21 FHIR "panorama" result(s)
 	And the FHIR results contain "medication dispense results"
 	| field                | panorama_value                        |
 		| resource.resourceType | MedicationDispense           |
  | resource.status       | completed |
  | resource.dispenser.reference  | Provider/urn:va:user:9E7A:983 |
  | resource.contained.resourceType  | MedicationPrescription     |
  | resource.contained.patient.reference      | Patient/9E7A;229 |
  | resource.contained.identifier.system    | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.identifier.value     | urn:va:med:9E7A:229:27952 |
  | resource.contained.status               | completed |
  | resource.contained.dateWritten          | 2010-02-27T09:03:00 |
  | resource.contained.prescriber.reference | Provider/urn:va:user:9E7A:983 |
  | resource.contained.note                 | METOPROLOL TARTRATE 50MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.contained.resourceType     | Medication      |
  | resource.contained.name | METOPROLOL TARTRATE TAB |
  | resource.contained.code.text | 866514/Metoprolol Tartrate 50 MG Oral Tablet |
  | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
  | resource.contained.code.coding.code   | 866514 |
  | resource.contained.code.coding.display | Metoprolol Tartrate 50 MG Oral Tablet |
  | resource.contained.product.form.text  | TAB |
  | resource.contained.product.ingredient.item.display | METOPROLOL TARTRATE TAB |
  | resource.contained.contained.resourceType | Substance |
  | resource.contained.contained.type.text  | METOPROLOL TARTRATE 50MG TAB |
  | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.contained.type.coding.code   | urn:va:vuid:4019836 |
  | resource.contained.contained.type.coding.display | METOPROLOL |
  | resource.contained.contained.type.coding.system | SNOMED-CT |
  | resource.contained.contained.type.coding.code   | urn:sct:410942007 |
  | resource.contained.contained.type.coding.display | METOPROLOL TARTRATE TAB |
  | resource.contained.contained.description | METOPROLOL TARTRATE 50MG TAB |
  | resource.identifier.system  | urn:oid:2.16.840.1.113883.6.233 |
  | resource.identifier.value | urn:va:med:9E7A:229:27952 |
  | resource.authorizingPrescription.display | METOPROLOL TARTRATE TAB |
  | resource.quantity.value | 180 |
  | resource.quantity.units | TAB |
  | resource.daysSupply.value | 90 |
  | resource.daysSupply.units | days |
  | resource.medication.display | METOPROLOL TARTRATE TAB |
  | resource.whenPrepared | 2010-02-27 |
  | resource.note | METOPROLOL TARTRATE 50MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
  | resource.dosageInstruction.schedulePeriod.start | 2010-02-27 |
  | resource.dosageInstruction.schedulePeriod.end | 2011-02-28 |
  | resource.dosageInstruction.scheduleTiming.code.text | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.code | BID |
  | resource.dosageInstruction.scheduleTiming.code.coding.display | BID |
  | resource.dosageInstruction.scheduleTiming.repeat.frequency | 720 |
  | resource.dosageInstruction.route.text | Oral |
  | resource.dosageInstruction.route.coding.system | urn:oid:2.16.840.1.113883.6.233 |
  | resource.dosageInstruction.route.coding.code | PO |
  | resource.dosageInstruction.route.coding.display | Oral |
  | resource.dosageInstruction.doseQuantity.value | 50 |
  | resource.dosageInstruction.doseQuantity.units | MG |


 @F138_4_outpatient_medication_dispense_fhir @fhir @5123456789V027402
 Scenario: Client can break the glass when requesting out-patient medication results in FHIR format for a sensitive patient
       Given a patient with "out-patient medication results" in multiple VistAs
       When the client requests out-patient medication results for that sensitive patient "5123456789V027402"
       Then a permanent redirect response is returned
       When the client breaks glass and repeats a request for out-patient medication results for that patient "5123456789V027402"
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total        | 1     |

 @F138_5_outpatient_medicationdispense_neg_fhir @fhir @5000000009V082878
 Scenario: Negative scenario.  Client can request Outpatient Medications in FHIR format
 	Given a patient with "No medication results" in multiple VistAs
 	When the client requests out-patient medication results for the patient "5000000009V082878" in FHIR format
 	Then a successful response is returned
 	Then corresponding matching FHIR records totaling "1" are displayed

 @F138_6_outpatient_medication_statement_fhir @fhir @10110V004877
 Scenario: Client can request Outpatient Medications statement in FHIR format
 	Given a patient with "out-patient medication statement" in multiple VistAs
 	#And a patient with pid "10110V004877" has been synced through the RDK API
 	When the client requests out-patient medication statement for the patient "10110V004877" in FHIR format
 	Then a successful response is returned
 	Then the client receives 4 FHIR "VistA" result(s)
 	And the client receives 2 FHIR "panorama" result(s)
 	And the FHIR results contain "medication dispense results"
 	 | field                        | panorama_value                      |
   | resource.resourceType 						| MedicationStatement |
   | resource.status                   | in-progress |
   | resource.patient.reference        | Patient/9E7A;8 |
   | resource.contained.resourceType   | Medication |
   | resource.contained.name           | BACITRACIN OINT,TOP |
   | resource.contained.code.text      | 1366116/bacitracin zinc 0.5 UNT/MG Topical Ointment |
   | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
   | resource.contained.code.coding.code | 1366116 |
   | resource.contained.code.coding.display  | bacitracin zinc 0.5 UNT/MG Topical Ointment |
   | resource.contained.product.form.text | OINT,TOP |
   | resource.contained.product.ingredient.item.display | BACITRACIN OINT,TOP |
   | resource.contained.contained.resourceType | Substance |
   | resource.contained.contained.type.text    | BACITRACIN 500UNT/GM OINT,TOP |
   | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
   | resource.contained.contained.type.coding.code | urn:va:vuid:4017493 |
   | resource.contained.contained.type.coding.display | BACITRACIN |
   | resource.contained.contained.type.coding.system | SNOMED-CT |
   | resource.contained.contained.type.coding.code  | urn:sct:410942007 |
   | resource.contained.contained.type.coding.display | BACITRACIN OINT,TOP |
   | resource.contained.contained.description      | BACITRACIN 500UNT/GM OINT,TOP |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:vandf:4017493 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000007875 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000011330 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000000002 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000011331 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000145879 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:rxnorm:1291 |
   | resource.identifier.system                | urn:oid:2.16.840.1.113883.6.233 |
   | resource.identifier.value                 | urn:va:med:9E7A:8:34267 |
   | resource.informationSource.reference      | Practitioner/urn:va:user:9E7A:1 |
   | resource.wasNotGiven                      | false |
   | resource.note                             | BACITRACIN 500UNT/GM OINT,TOP (ACTIVE)\n APPLY SMALL AMOUNT TO AFFECTED AREA TWICE A DAY |
   | resource.medication.display               | BACITRACIN OINT,TOP |
   | resource.dosage.text                      | MedicationDose{uid=''} |
   | resource.dosage.schedule.code.text        | BID |
   | resource.dosage.schedule.code.coding.code | BID |
   | resource.dosage.schedule.code.coding.display | BID |
   | resource.dosage.schedule.repeat.frequency  | 720 |
   | resource.dosage.route.text                 | TOP |
   | resource.dosage.route.coding.system        | urn:oid:2.16.840.1.113883.6.233 |
   | resource.dosage.route.coding.code          | TOP |
   | resource.dosage.route.coding.display       | TOP |

 @F138_7_outpatient_medication_statement_fhir @fhir @10110V004877
 Scenario: Client can request out-patient medication statement in FHIR format
 	Given a patient with "out-patient medication statement" in multiple VistAs
 	#And a patient with pid "10110V004877" has been synced through the RDK API
 	When the client requests out-patient medication statement for the patient "10110V004877" in FHIR format
 	Then a successful response is returned
 	Then the client receives 4 FHIR "VistA" result(s)
 	And the client receives 2 FHIR "kodak" result(s)
 	And the FHIR results contain "medication dispense results"
 	 | field                        | kodak_value                         |
 	 | resource.resourceType 						| MedicationStatement |
   | resource.status                   | in-progress |
   | resource.patient.reference        | Patient/C877;8 |
   | resource.contained.resourceType   | Medication |
   | resource.contained.name           | BACITRACIN OINT,TOP |
   | resource.contained.code.text      | 1366116/bacitracin zinc 0.5 UNT/MG Topical Ointment |
   | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
   | resource.contained.code.coding.code | 1366116 |
   | resource.contained.code.coding.display  | bacitracin zinc 0.5 UNT/MG Topical Ointment |
   | resource.contained.product.form.text | OINT,TOP |
   | resource.contained.product.ingredient.item.display | BACITRACIN OINT,TOP |
   | resource.contained.contained.resourceType | Substance |
   | resource.contained.contained.type.text    | BACITRACIN 500UNT/GM OINT,TOP |
   | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
   | resource.contained.contained.type.coding.code | urn:va:vuid:4017493 |
   | resource.contained.contained.type.coding.display | BACITRACIN |
   | resource.contained.contained.type.coding.system | SNOMED-CT |
   | resource.contained.contained.type.coding.code  | urn:sct:410942007 |
   | resource.contained.contained.type.coding.display | BACITRACIN OINT,TOP |
   | resource.contained.contained.description      | BACITRACIN 500UNT/GM OINT,TOP |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:vandf:4017493 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000007875 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000011330 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000000002 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000011331 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:ndfrt:N0000145879 |
   | resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
   | resource.contained.extension.valueString  | urn:rxnorm:1291 |
   | resource.identifier.system                | urn:oid:2.16.840.1.113883.6.233 |
   | resource.identifier.value                 | urn:va:med:C877:8:34267 |
   | resource.informationSource.reference      | Practitioner/urn:va:user:C877:1 |
   | resource.wasNotGiven                      | false |
   | resource.note                             | BACITRACIN 500UNT/GM OINT,TOP (ACTIVE)\n APPLY SMALL AMOUNT TO AFFECTED AREA TWICE A DAY |
   | resource.medication.display               | BACITRACIN OINT,TOP |
   | resource.dosage.text                      | MedicationDose{uid=''} |
   | resource.dosage.schedule.code.text        | BID |
   | resource.dosage.schedule.code.coding.code | BID |
   | resource.dosage.schedule.code.coding.display | BID |
   | resource.dosage.schedule.repeat.frequency  | 720 |
   | resource.dosage.route.text                 | TOP |
   | resource.dosage.route.coding.system        | urn:oid:2.16.840.1.113883.6.233 |
   | resource.dosage.route.coding.code          | TOP |
   | resource.dosage.route.coding.display       | TOP |

 @F138_8_outpatient_medication_dispense_fhir @fhir @10118V572553
 Scenario: Client can request out-patient medication statement in FHIR format
 	Given a patient with "out-patient medication statement" in multiple VistAs
 	#And a patient with pid "10118V572553" has been synced through the RDK API
 	When the client requests out-patient medication statement for the patient "10118V572553" in FHIR format
 	Then a successful response is returned
 	Then the client receives 2 FHIR "VistA" result(s)
 	And the client receives 1 FHIR "kodak" result(s)
 	And the FHIR results contain "medication dispense results"
 	 | field                              | value                        |
   | resource.resourceType 						| MedicationStatement |
   | resource.status                   | in-progress |
   | resource.patient.reference        | Patient/9E7A;149 |
   | resource.contained.resourceType   | Medication |
   | resource.contained.name           | ASPIRIN TAB,EC |
   | resource.contained.code.text      | 308416/Aspirin 81 MG Delayed Release Oral Tablet |
   | resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
   | resource.contained.code.coding.code | 308416 |
   | resource.contained.code.coding.display  | Aspirin 81 MG Delayed Release Oral Tablet |
   | resource.contained.product.form.text | TAB,EC |
   | resource.contained.product.ingredient.item.display | ASPIRIN TAB,EC |
   | resource.contained.contained.resourceType | Substance |
   | resource.contained.contained.type.text    | ASPIRIN 81MG TAB,EC |
   | resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
   | resource.contained.contained.type.coding.code | urn:va:vuid:4017536 |
   | resource.contained.contained.type.coding.display | ASPIRIN |
   | resource.contained.contained.type.coding.system | SNOMED-CT |
   | resource.contained.contained.type.coding.code  | urn:sct:410942007 |
   | resource.contained.contained.type.coding.display | ASPIRIN TAB,EC |
   | resource.contained.contained.description      | ASPIRIN 81MG TAB,EC |
   | resource.identifier.system                | urn:oid:2.16.840.1.113883.6.233 |
   | resource.identifier.value                 | urn:va:med:9E7A:149:18028 |
   | resource.informationSource.reference      | Practitioner/urn:va:user:9E7A:10000000031 |
   | resource.wasNotGiven                      | false |
   | resource.note                             | ASPIRIN 81MG TAB,EC (ACTIVE)\n TAKE ONE TABLET BY MOUTH EVERY MORNING |
   | resource.medication.display               | ASPIRIN TAB,EC |
   | resource.dosage.text                      | MedicationDose{uid=''} |
   | resource.dosage.schedule.code.text        | QAM |
   | resource.dosage.schedule.code.coding.code | QAM |
   | resource.dosage.schedule.code.coding.display | QAM |
   | resource.dosage.schedule.repeat.frequency  | 1440 |
   | resource.dosage.route.text                 | Oral |
   | resource.dosage.route.coding.system        | urn:oid:2.16.840.1.113883.6.233 |
   | resource.dosage.route.coding.code          | PO |
   | resource.dosage.route.coding.display       | Oral |
   | resource.dosage.quantity.value | 81 |
   | resource.dosage.quantity.units | MG |

 @F138_9_outpatient_medication_dispense_fhir @fhir @5123456789V027402
 Scenario: Client can break the glass when requesting out-patient medication statement in FHIR format for a sensitive patient
       Given a patient with "out-patient medication statement" in multiple VistAs
       When the client requests out-patient medication statement for that sensitive patient "5123456789V027402"
       Then a permanent redirect response is returned
       When the client breaks glass and repeats a request for out-patient medication statement for that patient "5123456789V027402"
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 0     |

 @F138_10_outpatient_medication_dispense_fhir @fhir @9E7A167 @DE974
 Scenario: Client can request out-patient medication results in FHIR format
 	Given a patient with "out-patient medication results" in multiple VistAs
 #	And a patient with pid "9E7A;167" has been synced through the RDK API
 	When the client requests "10" out-patient medication results for the patient "10104V248233" in FHIR format
 	Then a successful response is returned
 	And the results contain
       | name         | value     |
       | total | 43        |


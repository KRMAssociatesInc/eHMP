@Medication_fhir @fhir @vxsync @patient
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
	| content.text         | CONTAINS LISINOPRIL 10MG TAB |
	| content.resourceType | MedicationDispense           |
	#Location
	| content.contained.resourceType | Location    |
	| content.contained.name         | CAMP MASTER |
	#Encounter
	| content.contained.resourceType | Encounter                                     |
	| content.contained.text.status  | generated                                     |
	| content.contained.text.div     | <div>Encounter with patient 9E7A;100817</div> |
	| content.contained.type         | Outpatient                                    |
	#Substance
	| content.contained.resourceType        | Substance      |
	| content.contained.description         | LISINOPRIL TAB |
	| content.contained.type.text           | LISINOPRIL TAB |
	| content.contained.type.coding.display | LISINOPRIL     |
	| content.contained.type.coding.system  | SNOMED-CT      |
	#Practitioner
	| content.contained.resourceType | Practitioner |
	| content.contained.name.text    | VEHU,EIGHT   |
	#Medication
	| content.contained.resourceType     | Medication                              |
	| content.contained._id              | Medication/urn:va:med:9E7A:100817:27831 |
	| content.contained.name             | LISINOPRIL TAB                          |
	| content.contained.code.coding.code | urn:vandf:4019380                       |
	#MedicationPrescription
	| content.contained.resourceType                                            | MedicationPrescription                                |
	| content.contained._id                                                     | IS_SET                                                |
	| content.contained.dateWritten                                             | 2009-08-10T17:38:00                                   |
	| content.contained.status.code                                             | completed                                             |
	| content.contained.patient.reference                                       | Patient/9E7A;100817                                   |
	| content.contained.text.div                                                | CONTAINS LISINOPRIL 10MG TAB (EXPIRED)                |
	| content.contained.dispense.quantity                                       | 60                                                    |
	| content.contained.dispense.numberOfRepeatsAllowed                         | 11                                                    |
	| content.contained.dispense.validityPeriod.extension.url                   | http://vistacore.us/fhir/extensions/med#stopped       |
	| content.contained.dispense.validityPeriod.extension.valueString           | 20100811                                              |
	| content.contained.dispense.validityPeriod.start                           | 2009-08-10                                            |
	| content.contained.dispense.validityPeriod.end                             | 2010-08-11                                            |
	| content.contained.medication.display                                      | LISINOPRIL TAB                                        |
	| content.contained.medication.reference                                    | #Medication/urn:va:med:9E7A:100817:27831              |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStart |
	| content.contained.dosageInstruction.extension.valueString                 | 0                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStop  |
	| content.contained.dosageInstruction.extension.valueString                 | 527040                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#amount        |
	| content.contained.dosageInstruction.extension.valueString                 | 1                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#noun          |
	| content.contained.dosageInstruction.extension.valueString                 | TABLET                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#instructions  |
	| content.contained.dosageInstruction.extension.valueString                 | 10MG                                                  |
	| content.contained.dosageInstruction.text                                  | TAKE ONE TABLET BY MOUTH TWICE A DAY                  |
	| content.contained.dosageInstruction.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType  |
	| content.contained.dosageInstruction.timing.period.extension.valueString   | CONTINUOUS                                            |
	| content.contained.dosageInstruction.timing.period.start                   | 2009-08-10                                            |
	| content.contained.dosageInstruction.timing.period.end                     | 2010-08-11                                            |
	| content.contained.dosageInstruction.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName  |
	| content.contained.dosageInstruction.timing.schedule.extension.valueString | BID                                                   |

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
	| content.text         | CONTAINS LISINOPRIL 10MG TAB |
	| content.resourceType | MedicationDispense           |
	#Location
	| content.contained.resourceType | Location |
	| content.contained.name         | CAMP BEE |
	#Encounter
	| content.contained.resourceType | Encounter                                     |
	| content.contained.text.status  | generated                                     |
	| content.contained.text.div     | <div>Encounter with patient C877;100817</div> |
	| content.contained.type         | Outpatient                                    |
	#Substance
	| content.contained.resourceType        | Substance      |
	| content.contained.description         | LISINOPRIL TAB |
	| content.contained.type.text           | LISINOPRIL TAB |
	| content.contained.type.coding.display | LISINOPRIL     |
	| content.contained.type.coding.system  | SNOMED-CT      |
	#Practitioner
	| content.contained.resourceType | Practitioner |
	| content.contained.name.text    | VEHU,EIGHT   |
	#Medication
	| content.contained.resourceType     | Medication                              |
	| content.contained._id              | Medication/urn:va:med:C877:100817:27831 |
	| content.contained.name             | LISINOPRIL TAB                          |
	| content.contained.code.coding.code | urn:vandf:4019380                       |
	#MedicationPrescription
	| content.contained.resourceType                                            | MedicationPrescription                                |
	| content.contained._id                                                     | IS_SET                                                |
	| content.contained.dateWritten                                             | 2009-08-10T17:38:00                                   |
	| content.contained.status.code                                             | completed                                             |
	| content.contained.patient.reference                                       | Patient/C877;100817                                   |
	| content.contained.text.div                                                | CONTAINS LISINOPRIL 10MG TAB (EXPIRED)                |
	| content.contained.dispense.quantity                                       | 60                                                    |
	| content.contained.dispense.numberOfRepeatsAllowed                         | 11                                                    |
	| content.contained.dispense.validityPeriod.extension.url                   | http://vistacore.us/fhir/extensions/med#stopped       |
	| content.contained.dispense.validityPeriod.extension.valueString           | 20100811                                              |
	| content.contained.dispense.validityPeriod.start                           | 2009-08-10                                            |
	| content.contained.dispense.validityPeriod.end                             | 2010-08-11                                            |
	| content.contained.medication.display                                      | LISINOPRIL TAB                                        |
	| content.contained.medication.reference                                    | #Medication/urn:va:med:C877:100817:27831              |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStart |
	| content.contained.dosageInstruction.extension.valueString                 | 0                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStop  |
	| content.contained.dosageInstruction.extension.valueString                 | 527040                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#amount        |
	| content.contained.dosageInstruction.extension.valueString                 | 1                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#noun          |
	| content.contained.dosageInstruction.extension.valueString                 | TABLET                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#instructions  |
	| content.contained.dosageInstruction.extension.valueString                 | 10MG                                                  |
	| content.contained.dosageInstruction.text                                  | TAKE ONE TABLET BY MOUTH TWICE A DAY                  |
	| content.contained.dosageInstruction.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType  |
	| content.contained.dosageInstruction.timing.period.extension.valueString   | CONTINUOUS                                            |
	| content.contained.dosageInstruction.timing.period.start                   | 2009-08-10                                            |
	| content.contained.dosageInstruction.timing.period.end                     | 2010-08-11                                            |
	| content.contained.dosageInstruction.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName  |
	| content.contained.dosageInstruction.timing.schedule.extension.valueString | BID                                                   |

@F138_3_outpatient_medication_dispense_fhir @fhir @9E7A167
Scenario: Client can request out-patient medication results in FHIR format
	Given a patient with "out-patient medication results" in multiple VistAs
	#And a patient with pid "9E7A;167" has been synced through the RDK API
	When the client requests out-patient medication results for the patient "10104V248233" in FHIR format
	Then a successful response is returned
	Then the client receives 42 FHIR "VistA" result(s)
	And the client receives 21 FHIR "panorama" result(s)
	And the FHIR results contain "medication dispense results"
	| field                | panorama_value                        |
	| content.text         | CONTAINS METOPROLOL TARTRATE 50MG TAB |
	| content.resourceType | MedicationDispense                    |
	#Location
	| content.contained.resourceType | Location    |
	| content.contained.name         | CAMP MASTER |
	#Encounter
	| content.contained.resourceType | Encounter                                  |
	| content.contained.text.status  | generated                                  |
	| content.contained.text.div     | <div>Encounter with patient 9E7A;229</div> |
	| content.contained.type         | Outpatient                                 |
	#Substance
	| content.contained.resourceType        | Substance               |
	| content.contained.description         | METOPROLOL TARTRATE TAB |
	| content.contained.type.text           | METOPROLOL TARTRATE TAB |
	| content.contained.type.coding.display | METOPROLOL              |
	| content.contained.type.coding.system  | SNOMED-CT               |
	#Practitioner
	| content.contained.resourceType | Practitioner |
	| content.contained.name.text    | PROVIDER,ONE |
	#Medication
	| content.contained.resourceType     | Medication                           |
	| content.contained._id              | Medication/urn:va:med:9E7A:229:27952 |
	| content.contained.name             | METOPROLOL TARTRATE TAB              |
	| content.contained.code.coding.code | urn:vandf:4019836                    |
	#MedicationPrescription
	| content.contained.resourceType                                            | MedicationPrescription                                |
	| content.contained._id                                                     | IS_SET                                                |
	| content.contained.dateWritten                                             | 2010-02-27T09:03:00                                   |
	| content.contained.status.code                                             | completed                                             |
	| content.contained.patient.reference                                       | Patient/9E7A;229                                      |
	| content.contained.text.div                                                | CONTAINS METOPROLOL TARTRATE 50MG TAB (EXPIRED)       |
	| content.contained.dispense.quantity                                       | 180                                                   |
	| content.contained.dispense.numberOfRepeatsAllowed                         | 3                                                     |
	| content.contained.dispense.validityPeriod.extension.url                   | http://vistacore.us/fhir/extensions/med#stopped       |
	| content.contained.dispense.validityPeriod.extension.valueString           | 20110228                                              |
	| content.contained.dispense.validityPeriod.start                           | 2010-02-27                                            |
	| content.contained.dispense.validityPeriod.end                             | 2011-02-28                                            |
	| content.contained.medication.display                                      | METOPROLOL TARTRATE TAB                               |
	| content.contained.medication.reference                                    | #Medication/urn:va:med:9E7A:229:27952                 |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStart |
	| content.contained.dosageInstruction.extension.valueString                 | 0                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#relativeStop  |
	| content.contained.dosageInstruction.extension.valueString                 | 527040                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#amount        |
	| content.contained.dosageInstruction.extension.valueString                 | 1                                                     |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#noun          |
	| content.contained.dosageInstruction.extension.valueString                 | TABLET                                                |
	| content.contained.dosageInstruction.extension.url                         | http://vistacore.us/fhir/extensions/med#instructions  |
	| content.contained.dosageInstruction.extension.valueString                 | 50MG                                                  |
	| content.contained.dosageInstruction.text                                  | TAKE ONE TABLET BY MOUTH TWICE A DAY                  |
	| content.contained.dosageInstruction.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType  |
	| content.contained.dosageInstruction.timing.period.extension.valueString   | CONTINUOUS                                            |
	| content.contained.dosageInstruction.timing.period.start                   | 2010-02-27                                            |
	| content.contained.dosageInstruction.timing.period.end                     | 2011-02-28                                            |
	| content.contained.dosageInstruction.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName  |
	| content.contained.dosageInstruction.timing.schedule.extension.valueString | BID                                                   |

@F138_4_outpatient_medication_dispense_fhir @fhir @unstable @10180V273016
Scenario: Client can request out-patient medication results in FHIR format
	Given a patient with "out-patient medication results" in multiple VistAs
	#And a patient with pid "10180V273016" has been synced through the RDK API
	When the client requests out-patient medication results for the patient "10180V273016" in FHIR format
	Then a successful response is returned
	Then the client receives 40 FHIR "VistA" result(s)
	And the client receives 20 FHIR "kodak" result(s)
	And the FHIR results contain "medication dispense results"
	| field                                           | value                        |
	| content.identifier.value                        | CONTAINS urn:va:med:9E7A:433 |
	| content.contained.name                          | CAMP MASTER                  |
	| content.contained.type.text                     | SIMVASTATIN TAB              |
	| content.contained.status.code                   | completed                    |
	| content.contained.dispense.validityPeriod.start | 2008-01-28                   |
	| content.contained.dispense.validityPeriod.end   | 2009-01-28                   |
	| content.contained.type.coding.code              | urn:sct:410942007            |
	| content.contained.type.coding.display           | SIMVASTATIN TAB              |
	| content.contained.name.text                     | PROVIDER,ONE                 |
	| content.dispense.whenHandedOver                 | 2008-01-28                   |
	| content.dispense.quantity                       | 90                           |
	| content.contained.code.coding.code              | urn:vandf:4020400            |

@F138_5_outpatient_medication_dispense_fhir @fhir @5123456789V027402
Scenario: Client can break the glass when requesting out-patient medication results in FHIR format for a sensitive patient
      Given a patient with "out-patient medication results" in multiple VistAs
      When the client requests out-patient medication results for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for out-patient medication results for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 0     |

@F138_6_outpatient_medicationdispense_neg_fhir @fhir @5000000009V082878
Scenario: Negative scenario.  Client can request Outpatient Medications in FHIR format
	Given a patient with "No medication results" in multiple VistAs
	When the client requests out-patient medication results for the patient "5000000009V082878" in FHIR format
	Then a successful response is returned
	Then corresponding matching FHIR records totaling "0" are displayed

@F138_7_outpatient_medication_statement_fhir @fhir @10110V004877
Scenario: Client can request Outpatient Medications statement in FHIR format
	Given a patient with "out-patient medication statement" in multiple VistAs
	#And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests out-patient medication statement for the patient "10110V004877" in FHIR format
	Then a successful response is returned
	Then the client receives 4 FHIR "VistA" result(s)
	And the client receives 2 FHIR "panorama" result(s)
	And the FHIR results contain "medication dispense results"
	| field                        | panorama_value                      |
	| content.resourceType         | MedicationStatement                 |
	| content.medication.reference | #Medication/urn:va:med:9E7A:8:18060 |
	#Substance
	| content.contained.resourceType        | Substance      |
	| content.contained.description         | ASPIRIN TAB,EC |
	| content.contained.type.text           | ASPIRIN TAB,EC |
	| content.contained.type.coding.display | ASPIRIN        |
	| content.contained.type.coding.system  | SNOMED-CT      |
	#Medication
	| content.contained.resourceType     | Medication                         |
	| content.contained._id              | Medication/urn:va:med:9E7A:8:18060 |
	| content.contained.name             | ASPIRIN TAB,EC                     |
	| content.contained.code.coding.code | urn:vandf:4017536                  |
	| content.contained.code.coding.code | urn:ndfrt:N0000000002              |
	| content.contained.code.coding.code | urn:ndfrt:N0000007676              |
	| content.contained.code.coding.code | urn:ndfrt:N0000185640              |
	| content.contained.code.coding.code | urn:ndfrt:N0000007628              |
	| content.contained.code.coding.code | urn:ndfrt:N0000005901              |
	| content.contained.code.coding.code | urn:ndfrt:N0000006035              |
	| content.contained.code.coding.code | urn:ndfrt:N0000008137              |
	| content.contained.code.coding.code | urn:ndfrt:N0000145918              |
	| content.contained.code.coding.code | urn:rxnorm:1191                    |
	| content.contained.code.text        | ASPIRIN TAB,EC                     |
	#dosage
	| content.dosage.route.text                            | Oral                                                 |
	| content.dosage.route.coding.code                     | PO                                                   |
	| content.dosage.quantity.value                        | 81                                                   |
	| content.dosage.quantity.units                        | MG                                                   |
	| content.dosage.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType |
	| content.dosage.timing.period.extension.valueString   | CONTINUOUS                                           |
	| content.dosage.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName |
	| content.dosage.timing.schedule.extension.valueString | QAM                                                  |

@F138_8_outpatient_medication_statement_fhir @fhir @10110V004877
Scenario: Client can request out-patient medication statement in FHIR format
	Given a patient with "out-patient medication statement" in multiple VistAs
	#And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests out-patient medication statement for the patient "10110V004877" in FHIR format
	Then a successful response is returned
	Then the client receives 4 FHIR "VistA" result(s)
	And the client receives 2 FHIR "kodak" result(s)
	And the FHIR results contain "medication dispense results"
	| field                        | kodak_value                         |
	| content.resourceType         | MedicationStatement                 |
	| content.medication.reference | #Medication/urn:va:med:C877:8:18060 |
	#Substance
	| content.contained.resourceType        | Substance      |
	| content.contained.description         | ASPIRIN TAB,EC |
	| content.contained.type.text           | ASPIRIN TAB,EC |
	| content.contained.type.coding.display | ASPIRIN        |
	| content.contained.type.coding.system  | SNOMED-CT      |
	#Medication
	| content.contained.resourceType     | Medication                         |
	| content.contained._id              | Medication/urn:va:med:C877:8:18060 |
	| content.contained.name             | ASPIRIN TAB,EC                     |
	| content.contained.code.coding.code | urn:vandf:4017536                  |
	| content.contained.code.coding.code | urn:ndfrt:N0000000002              |
	| content.contained.code.coding.code | urn:ndfrt:N0000007676              |
	| content.contained.code.coding.code | urn:ndfrt:N0000185640              |
	| content.contained.code.coding.code | urn:ndfrt:N0000007628              |
	| content.contained.code.coding.code | urn:ndfrt:N0000005901              |
	| content.contained.code.coding.code | urn:ndfrt:N0000006035              |
	| content.contained.code.coding.code | urn:ndfrt:N0000008137              |
	| content.contained.code.coding.code | urn:ndfrt:N0000145918              |
	| content.contained.code.coding.code | urn:rxnorm:1191                    |
	| content.contained.code.text        | ASPIRIN TAB,EC                     |
	#dosage
	| content.dosage.route.text                            | Oral                                                 |
	| content.dosage.route.coding.code                     | PO                                                   |
	| content.dosage.quantity.value                        | 81                                                   |
	| content.dosage.quantity.units                        | MG                                                   |
	| content.dosage.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType |
	| content.dosage.timing.period.extension.valueString   | CONTINUOUS                                           |
	| content.dosage.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName |
	| content.dosage.timing.schedule.extension.valueString | QAM                                                  |

@F138_9_outpatient_medication_dispense_fhir @fhir @10118V572553
Scenario: Client can request out-patient medication statement in FHIR format
	Given a patient with "out-patient medication statement" in multiple VistAs
	#And a patient with pid "10118V572553" has been synced through the RDK API
	When the client requests out-patient medication statement for the patient "10118V572553" in FHIR format
	Then a successful response is returned
	Then the client receives 2 FHIR "VistA" result(s)
	And the client receives 1 FHIR "kodak" result(s)
	And the FHIR results contain "medication dispense results"
	| field                              | value                        |
	| content.identifier.value           | CONTAINS urn:va:med:9E7A:149 |
	| content.contained.name             | ASPIRIN TAB,EC               |
	| content.contained.type.text        | ASPIRIN TAB,EC               |
	| content.contained.type.coding.code | urn:sct:410942007            |
	#Substance
	| content.contained.resourceType        | Substance      |
	| content.contained.description         | ASPIRIN TAB,EC |
	| content.contained.type.text           | ASPIRIN TAB,EC |
	| content.contained.type.coding.display | ASPIRIN        |
	| content.contained.type.coding.system  | SNOMED-CT      |
	#dosage
	| content.dosage.route.text                            | Oral                                                 |
	| content.dosage.route.coding.code                     | PO                                                   |
	| content.dosage.quantity.value                        | 81                                                   |
	| content.dosage.quantity.units                        | MG                                                   |
	| content.dosage.timing.period.extension.url           | http://vistacore.us/fhir/extensions/med#scheduleType |
	| content.dosage.timing.period.extension.valueString   | CONTINUOUS                                           |
	| content.dosage.timing.schedule.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName |
	| content.dosage.timing.schedule.extension.valueString | QAM                                                  |

@F138_10_outpatient_medication_dispense_fhir @fhir @5123456789V027402
Scenario: Client can break the glass when requesting out-patient medication statement in FHIR format for a sensitive patient
      Given a patient with "out-patient medication statement" in multiple VistAs
      When the client requests out-patient medication statement for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for out-patient medication statement for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 0     |

@F138_11_outpatient_medication_dispense_fhir @fhir @9E7A167 @DE974
Scenario: Client can request out-patient medication results in FHIR format
	Given a patient with "out-patient medication results" in multiple VistAs
	And a patient with pid "9E7A;167" has been synced through the RDK API
	When the client requests "10" out-patient medication results for the patient "10104V248233" in FHIR format
	Then a successful response is returned
	And the results contain
      | name         | value     |
      | totalResults | 10        |


@Medication_fhir @fhir @vxsync @patient

Feature: F138 Return of Inpatient Medications in FHIR format

#This feature item returns Inpatient Medications in FHIR format. Also includes cases where no Inpatient Medications exist.
# in-patient medication maps to medication administration in FHIR URL

@F138_1_inpatient_medication_fhir @fhir @9E7A100033
Scenario: Client can request in-patient medication results in FHIR format
	Given a patient with "in-patient medication results" in multiple VistAs
	And a patient with pid "9E7A;100033" has been synced through the RDK API
	When the client requests in-patient medication results for the patient "9E7A;100033" in FHIR format
	Then a successful response is returned
	Then the client receives 2 FHIR "VistA" result(s)
	And the client receives 2 FHIR "panorama" result(s)
	And the FHIR results contain "in-patient medication administration results"
	| field | panorama_value |
	# following fields are from Medication Prescription resource type.
	| content.identifier.value                | CONTAINS urn:va:med:9E7A:100033 |
	| content.contained.name.text             | WARDCLERK,FIFTYTHREE            |
	| content.contained.location.period.start | 2006-06-16T12:38:00             |
	| content.contained.location.period.end   | 2006-06-16T12:38:00             |
	| content.contained.type.text             | I                               |
	#uid field
	| content.contained.location.location.display | BCMA                                          |
	| content.contained.status.code               | completed                                     |
	| content.contained.dateWritten               | 2006-06-16T12:38:00                           |
	| content.contained.patient.reference         | IS_SET                                        |
	| content.contained.text.div                  | CONTAINS INSULIN NOVOLIN N(NPH) INJ (EXPIRED) |
	# following fields are from Medication resource type.
	| content.contained.type.coding.code    | urn:va:vuid:4019786             |
	| content.contained.type.coding.display | INSULIN                         |
	| content.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
	| content.contained.type.coding.code    | urn:sct:410942007               |
	| content.contained.type.coding.display | INSULIN NOVOLIN N(NPH) INJ      |
	| content.contained.type.coding.system  | SNOMED-CT                       |
	| content.contained.name                | INSULIN NOVOLIN N(NPH) INJ      |
	| content.contained.code.coding.code    | urn:vandf:4019786               |
	| content.contained.code.coding.code    | urn:ndfrt:N0000010574           |
	| content.contained.code.coding.code    | urn:ndfrt:N0000029177           |
	| content.contained.code.coding.code    | urn:ndfrt:N0000000001           |
	| content.contained.code.coding.code    | urn:ndfrt:N0000029183           |
	| content.contained.code.coding.code    | urn:ndfrt:N0000004931           |
	| content.contained.code.coding.code    | urn:rxnorm:5856                 |
	| content.contained.code.coding.code    | urn:ndfrt:N0000147876           |
	| content.contained.code.text           | INSULIN NOVOLIN N(NPH) INJ      |
	#following fields are from Medication resource type and only available for out-patient and in-patient meds.
	| content.contained.product.form.text      | INJ                 |
	| content.contained.dosageInstruction.text | Give: 8 UNITS SC QD |
	#following fields are from MedicationAdministration resource type and for IV and in-patient meds
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#kind           |
	| content.extension.valueString  | Medication, Inpatient                                  |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#orderUid       |
	| content.extension.valueString  | urn:va:order:9E7A:100033:17694                         |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#pharmacistUid  |
	| content.extension.valueString  | urn:va:user:9E7A:10000000047                           |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#pharmacistName |
	| content.extension.valueString  | LABTECH,FIFTYSEVEN                                     |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#supply         |
	| content.extension.valueBoolean | false                                                  |
	| content.contained.name.text    | WARDCLERK,FIFTYTHREE                                   |
	#providerUID
	#providerName they are repeated.  Are they needed.  There are few more field that are repeated.
	| content.whenGiven.start                     | 2006-06-16T11:00:00                                   |
	| content.whenGiven.end                       | 2006-09-25T00:00:00                                   |
	| content.dosage.extension.url                | http://vistacore.us/fhir/extensions/med#relativeStart |
	| content.dosage.extension.valueString        | 0                                                     |
	| content.dosage.extension.url                | http://vistacore.us/fhir/extensions/med#relativeStop  |
	| content.dosage.extension.valueString        | 144780                                                |
	| content.dosage.extension.url                | http://vistacore.us/fhir/extensions/med#predecessor   |
	| content.dosage.extension.valueString        | urn:va:med:9E7A:100033:17693                          |
	| content.dosage.extension.url                | http://vistacore.us/fhir/extensions/med#IMO           |
	| content.dosage.extension.valueString        | false                                                 |
	| content.dosage.timing.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName  |
	| content.dosage.timing.extension.valueString | QD                                                    |
	| content.dosage.route.text                   | SC                                                    |
	And the FHIR results contain "in-patient medication administration results"
	| content.dosage.extension.url         | http://vistacore.us/fhir/extensions/med#successor |
	| content.dosage.extension.valueString | urn:va:med:9E7A:100033:17694                      |


@F138_2_inpatient_medication_fhir @fhir @10146V393772
Scenario: Client can request in-patient medication results in FHIR format
	Given a patient with "in-patient medication results" in multiple VistAs
	And a patient with pid "10146V393772" has been synced through the RDK API
	When the client requests in-patient medication results for the patient "10146V393772" in FHIR format
	Then a successful response is returned
	Then the client receives 20 FHIR "VistA" result(s)
	And the client receives 10 FHIR "kodak" result(s)
	And the FHIR results contain "in-patient medication administration results"
	| field | kodak_value |
	# following fields are from Medication Prescription resource type.
	| content.identifier.value                | CONTAINS urn:va:med:9E7A:301:10779:1 |
	| content.contained.name.text             | WARDCLERK,FIFTYTHREE                 |
	| content.contained.location.period.start | 1999-11-01T10:24:00                  |
	| content.contained.location.period.end   | 1999-11-01T10:24:00                  |
	| content.contained.type.text             | V                                    |
	#uid field
	| content.contained.location.location.display | GEN MED             |
	| content.contained.status.code               | stopped             |
	| content.contained.dateWritten               | 1999-11-01T10:24:00 |
	| content.contained.patient.reference         | IS_SET              |
	# According to Lex, this text is wrong, change it.
	| content.contained.text.div | CONTAINS DEXTROSE 5%/NACL 0.45%/KCL 10MEQ/L INJ |
	# following fields are from Medication resource type.
	| content.contained.type.coding.code    | urn:sct:418804003           |
	| content.contained.type.coding.display | POTASSIUM CHLORIDE INJ,SOLN |
	| content.contained.type.coding.code    | urn:sct:418804003           |
	| content.contained.type.coding.display | POTASSIUM CHLORIDE INJ,SOLN |
	| content.contained.type.coding.system  | SNOMED-CT                   |
	| content.contained.name                | POTASSIUM CHLORIDE INJ,SOLN |
	| content.contained.code.coding.code    | urn:vandf:4022505           |
	| content.contained.code.coding.code    | urn:ndfrt:N0000000001       |
	| content.contained.code.coding.code    | urn:ndfrt:N0000010582       |
	| content.contained.code.coding.code    | urn:ndfrt:N0000010586       |
	| content.contained.code.coding.code    | urn:rxnorm:216554           |
	| content.contained.code.text           | POTASSIUM CHLORIDE INJ,SOLN |
	#following fields are from MedicationAdministration resource type and for IV and in-patient meds
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#kind           |
	| content.extension.valueString  | Medication, Infusion                                   |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#orderUid       |
	| content.extension.valueString  | urn:va:order:9E7A:301:10779                            |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#pharmacistUid  |
	| content.extension.valueString  | urn:va:user:9E7A:11817                                 |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#pharmacistName |
	| content.extension.valueString  | RADTECH,FORTYONE                                       |
	| content.extension.url          | http://vistacore.us/fhir/extensions/med#supply         |
	| content.extension.valueBoolean | false                                                  |
	| content.contained.name.text    | WARDCLERK,FIFTYTHREE                                   |
	#providerUID
	#providerName they are repeated.  Are they needed.  There are few more field that are repeated.
	| content.dosage.extension.url          | http://vistacore.us/fhir/extensions/med#successor |
	| content.dosage.extension.valueString  | urn:va:med:9E7A:301:10833                         |
	| content.dosage.extension.url          | http://vistacore.us/fhir/extensions/med#IMO       |
	| content.dosage.extension.valueBoolean | false                                             |
	| content.dosage.route.text             | IV                                                |

	And the FHIR results contain "in-patient medication administration results"
	| content.dosage.extension.url         | http://vistacore.us/fhir/extensions/med#successor |
	| content.dosage.extension.valueString | urn:va:med:9E7A:301:10833                         |

# following 2 scenarios are checking for another patient for return of medication results.
# only few fields are checked to validate data integrity.

@F138_3_inpatient_medication_fhir @fhir @5000000341V359724
Scenario: Client can request in-patient medication results in FHIR format
	Given a patient with "in-patient medication results" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through the RDK API
	When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	Then the client receives 18 FHIR "VistA" result(s)
	And the client receives 9 FHIR "panorama" result(s)
	And the FHIR results contain "in-patient medication administration results"
	| field                                       | value                                                |
	| content.identifier.value                    | CONTAINS urn:va:med:9E7A:100022                      |
	| content.contained.product.form.text         | TAB                                                  |
	| content.contained.dosageInstruction.text    | Give: 325MG PO Q4H                                   |
	| content.contained.type.text                 | I                                                    |
	| content.contained.status.code               | completed                                            |
	| content.contained.type.coding.code          | urn:va:vuid:4017513                                  |
	| content.contained.type.coding.display       | ACETAMINOPHEN                                        |
	| content.dosage.quantity.value               | EMPTY                                                |
	| content.dosage.timing.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName |
	| content.dosage.timing.extension.valueString | Q4H                                                  |
	| content.contained.name.text                 | PHYSICIAN,ASSISTANT                                  |
	| content.contained.location.location.display | BCMA                                                 |
	| content.contained.code.coding.code          | urn:ndfrt:N0000000002                                |

@F138_4_inpatient_medication_fhir @fhir @5000000341V359724
Scenario: Client can request in-patient medication results in FHIR format
	Given a patient with "in-patient medication results" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through the RDK API
	When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	Then the client receives 18 FHIR "VistA" result(s)
	And the client receives 9 FHIR "kodak" result(s)
	And the FHIR results contain "in-patient medication administration results"
	| field                                       | value                                                |
	| content.identifier.value                    | CONTAINS urn:va:med:C877:100022                      |
	| content.contained.product.form.text         | TAB                                                  |
	| content.contained.dosageInstruction.text    | Give: 325MG PO Q4H                                   |
	| content.contained.type.text                 | I                                                    |
	| content.contained.status.code               | completed                                            |
	| content.contained.type.coding.code          | urn:va:vuid:4017513                                  |
	| content.contained.type.coding.display       | ACETAMINOPHEN                                        |
	| content.dosage.quantity.value               | EMPTY                                                |
	| content.dosage.timing.extension.url         | http://vistacore.us/fhir/extensions/med#scheduleName |
	| content.dosage.timing.extension.valueString | Q4H                                                  |
	| content.contained.name.text                 | PHYSICIAN,ASSISTANT                                  |
	| content.contained.location.location.display | BCMA                                                 |
	| content.contained.code.coding.code          | urn:ndfrt:N0000000002                                |

@F138_5_inpatient_medication_fhir  @fhir @5123456789V027402
Scenario: Client can break the glass when requesting in-patient medication results in FHIR format for a sensitive patient
      Given a patient with "in-patient medication results" in multiple VistAs
      When the client requests in-patient medication results for that sensitive patient "5123456789V027402"
      Then a permanent redirect response is returned
      When the client breaks glass and repeats a request for in-patient medication results for that patient "5123456789V027402"
      Then a successful response is returned
      And the results contain
      | name         | value |
      | totalResults | 0     |

# negative test case for medication.
@F138_6_in_medication_neg_fhir @9E7A100184
Scenario: Negative scenario.  Client can request Inpatient Medications in FHIR format
	Given a patient with "No medication results" in multiple VistAs
	When the client requests in-patient medication results for the patient "9E7A;100184" in FHIR format
	Then a successful response is returned
	Then corresponding matching FHIR records totaling "0" are displayed

@F138_7_inpatient_medication_fhir @fhir @5000000341V359724 @DE974
Scenario: Client can request in-patient medication results in FHIR format
	Given a patient with "in-patient medication results" in multiple VistAs
	And a patient with pid "5000000341V359724" has been synced through the RDK API
	When the client requests "10" in-patient medication results for the patient "5000000341V359724" in FHIR format
	Then a successful response is returned
	And the results contain
      | name         | value |
      | totalResults | 10    |

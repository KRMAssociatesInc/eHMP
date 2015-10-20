 #@Medication_fhir @fhir @vxsync @patient

 Feature: F138 Return of Inpatient Medications in FHIR format

 #This feature item returns Inpatient Medications in FHIR format. Also includes cases where no Inpatient Medications exist.
 # in-patient medication maps to medication administration in FHIR URL

 @F138_1_inpatient_medication_fhir @fhir @9E7A100033
 Scenario: Client can request in-patient medication results in FHIR format
 	Given a patient with "in-patient medication results" in multiple VistAs
 #	And a patient with pid "9E7A;100033" has been synced through the RDK API
 	When the client requests in-patient medication results for the patient "9E7A;100033" in FHIR format
 	Then a successful response is returned
 	Then the client receives 4 FHIR "VistA" result(s)
 	And the client receives 2 FHIR "panorama" result(s)
 	And the FHIR results contain "in-patient medication administration results"
 	| field | panorama_value |
 	| resource.resourceType | MedicationAdministration |
  | resource.status | completed |
  | resource.contained.resourceType | MedicationPrescription |
  | resource.contained.status       | stopped |
  | resource.contained.contained.resourceType | Medication |
  | resource.contained.contained.name         | INSULIN NOVOLIN N(NPH) INJ |
  | resource.contained.contained.code.text    | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N] |
  | resource.contained.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
  | resource.contained.contained.code.coding.code   | 311027 |
  | resource.contained.contained.code.coding.display | NPH Insulin, Human 100 UNT/ML Injectable Suspension [Novolin N] |
  | resource.contained.contained.product.form.text   | INJ |
  | resource.contained.contained.product.ingredient.item.display | INSULIN NOVOLIN N(NPH) INJ |
  | resource.contained.contained.contained.resourceType | Substance |
  | resource.contained.contained.contained.type.text    | INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N |
  | resource.contained.contained.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.contained.contained.type.coding.code    | urn:va:vuid:4019786 |
  | resource.contained.contained.contained.type.coding.display | INSULIN |
  | resource.contained.contained.contained.type.coding.system  | SNOMED-CT |
  | resource.contained.contained.contained.type.coding.code    | urn:sct:410942007 |
  | resource.contained.contained.contained.type.coding.display  | INSULIN NOVOLIN N(NPH) INJ |
  | resource.contained.contained.contained.description          | INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N |
  | resource.contained.identifier.system              | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.identifier.value               | urn:va:med:9E7A:100033:17694 |
  | resource.contained.note             | INSULIN NOVOLIN N(NPH) INJ (EXPIRED)\n Give: 8 UNITS SC QD |
  | resource.contained.dateWritten      | 2006-06-16T12:38:00 |
  | resource.contained.prescriber.reference | Provider/urn:va:user:9E7A:10958 |
  | resource.contained.dosageInstruction.text | Give: 8 UNITS SC QD |
  | resource.contained.dosageInstruction.scheduledTiming.repeat.frequency | 1 |
  | resource.contained.dosageInstruction.scheduledTiming.repeat.periodUnits | s |
  | resource.contained.dosageInstruction.scheduledTiming.code.text          | QD |
  | resource.contained.dosageInstruction.route.text                         | SC |
  | resource.contained.dosageInstruction.doseQuantity.units                 | 43 |
  | resource.contained.dispense.validityPeriod.start      | 2006-06-16T11:00:00 |
  | resource.contained.dispense.validityPeriod.end        | 2006-09-25T00:00:00 |
  | resource.contained.dispense.expectedSupplyDuration.units  | days |
  | resource.contained.resourceType         | Practitioner |
  | resource.identifier.system              | urn:oid:2.16.840.1.113883.6.233 |
  | resource.identifier.value               | urn:va:med:9E7A:100033:17694 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#IMO |
  | resource.extension.valueBoolean       | false |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#kind |
  | resource.extension.valueString        | Medication, Inpatient |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#localId |
  | resource.extension.valueString        | 2U;I |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medStatus |
  | resource.extension.valueString        | urn:sct:392521001 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medStatusName |
  | resource.extension.valueString        | historical |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medType |
  | resource.extension.valueString        | urn:sct:105903003 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#supply |
  | resource.extension.valueBoolean       | false |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/amount |
  | resource.extension.valueString        | 1 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/instructions |
  | resource.extension.valueString        | 8 UNITS 100UNT/ML |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/relativeStart |
  | resource.extension.valueInteger       | 0 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/relativeStop |
  | resource.extension.valueInteger       | 144780 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/scheduleName |
  | resource.extension.valueString        | QD |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/summary |
  | resource.extension.valueString        | MedicationDose{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/locationName |
  | resource.extension.valueString        | BCMA |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/locationUid |
  | resource.extension.valueString        | urn:va:location:9E7A:11 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/orderUid |
  | resource.extension.valueString        | urn:va:order:9E7A:100033:17694 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistName |
  | resource.extension.valueString        | LABTECH,FIFTYSEVEN |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistUid |
  | resource.extension.valueString        | urn:va:user:9E7A:10000000047 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/predecessor |
  | resource.extension.valueString        | urn:va:med:9E7A:100033:17693 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/providerName |
  | resource.extension.valueString        | WARDCLERK,FIFTYTHREE |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/summary |
  | resource.extension.valueString        | MedicationOrder{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/drugClassCode |
  | resource.extension.valueString        | urn:vadc:HS501 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/drugClassName |
  | resource.extension.valueString        | INSULIN |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientCode |
  | resource.extension.valueString        | urn:va:vuid:4019786 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientCodeName |
  | resource.extension.valueString        | INSULIN |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientRole |
  | resource.extension.valueString        | urn:sct:410942007 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientRXNCode |
  | resource.extension.valueString        | urn:rxnorm:5856 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/strength |
  | resource.extension.valueString        | 100 UNIT/ML |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/summary |
  | resource.extension.valueString        | MedicationProduct{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/suppliedCode |
  | resource.extension.valueString        | urn:va:vuid:4001483 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/suppliedName |
  | resource.extension.valueString        | INSULIN NPH HUMAN 100 U/ML INJ NOVOLIN N |
  | resource.patient.reference            | Patient/9E7A;100033 |
  | resource.wasNotGiven                  | false |
  | resource.reasonGiven.text             | None |
  | resource.reasonGiven.coding.system    | http://hl7.org/fhir/reason-medication-given |
  | resource.reasonGiven.coding.code      | a |
  | resource.reasonGiven.coding.display   | None |
  | resource.effectiveTimePeriod.start    | 2006-06-16T11:00:00 |
  | resource.effectiveTimePeriod.end      | 2006-09-25T00:00:00 |
  | resource.note                         | MedicationDose{uid=''} |


 @F138_2_inpatient_medication_fhir @fhir @10146V393772
 Scenario: Client can request in-patient medication results in FHIR format
 	Given a patient with "in-patient medication results" in multiple VistAs
 	#And a patient with pid "10146V393772" has been synced through the RDK API
 	When the client requests in-patient medication results for the patient "10146V393772" in FHIR format
 	Then a successful response is returned
 	Then the client receives 20 FHIR "VistA" result(s)
 	And the client receives 10 FHIR "kodak" result(s)
 	And the FHIR results contain "in-patient medication administration results"
 	| field | kodak_value |
  | resource.resourceType | MedicationAdministration |
  | resource.status | stopped |
  | resource.contained.resourceType | MedicationPrescription |
  | resource.contained.status       | stopped |
  | resource.contained.contained.resourceType | Medication |
  | resource.contained.contained.name         | POTASSIUM CHLORIDE INJ,SOLN |
  | resource.contained.contained.code.text    | Potassium Chloride 2 MEQ/ML Injectable Solution |
  | resource.contained.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
  | resource.contained.contained.code.coding.code   | 204520 |
  | resource.contained.contained.code.coding.display | Potassium Chloride 2 MEQ/ML Injectable Solution |
  #| resource.contained.contained.product.form.text   | INJ |
  | resource.contained.contained.product.ingredient.item.display | POTASSIUM CHLORIDE INJ,SOLN |
  | resource.contained.contained.contained.resourceType | Substance |
  | resource.contained.contained.contained.type.text    | POTASSIUM CHLORIDE 2MEQ/ML INJ 20 MEQ |
  | resource.contained.contained.contained.type.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.contained.contained.type.coding.code    | urn:va:vuid:4017447 |
  | resource.contained.contained.contained.type.coding.display | POTASSIUM CHLORIDE |
  | resource.contained.contained.contained.type.coding.system  | SNOMED-CT |
  | resource.contained.contained.contained.type.coding.code    | urn:sct:418804003 |
  | resource.contained.contained.contained.type.coding.display  | POTASSIUM CHLORIDE INJ,SOLN |
  | resource.contained.contained.contained.description          | POTASSIUM CHLORIDE 2MEQ/ML INJ 20 MEQ |
  | resource.contained.identifier.system              | urn:oid:2.16.840.1.113883.6.233 |
  | resource.contained.identifier.value               | urn:va:med:9E7A:301:10779:1 |
  | resource.contained.dateWritten      | 1999-11-01T10:24:00 |
  | resource.contained.prescriber.reference | Provider/urn:va:user:9E7A:10958 |
  | resource.contained.dosageInstruction.scheduledTiming.repeat.periodUnits | s |
  | resource.contained.dosageInstruction.route.text                         | IV |
  | resource.contained.dispense.validityPeriod.start      | 1999-11-01T10:24:00 |
  | resource.contained.dispense.validityPeriod.end        | 1999-11-05T10:37:00 |
  | resource.contained.dispense.expectedSupplyDuration.units  | days |
  | resource.contained.resourceType         | Practitioner |
  | resource.identifier.system              | urn:oid:2.16.840.1.113883.6.233 |
  | resource.identifier.value               | urn:va:med:9E7A:301:10779:1 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#IMO |
  | resource.extension.valueBoolean       | false |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#kind |
  | resource.extension.valueString        | Medication, Infusion |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#localId |
  | resource.extension.valueString        | 2V;I |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medStatus |
  | resource.extension.valueString        | urn:sct:73425007 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medStatusName |
  | resource.extension.valueString        | not active |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#medType |
  | resource.extension.valueString        | urn:sct:105903003 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#supply |
  | resource.extension.valueBoolean       | false |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/ivRate |
  | resource.extension.valueString        | 150 ml/hr |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/summary |
  | resource.extension.valueString        | MedicationDose{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/locationName |
  | resource.extension.valueString        | GEN MED |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/locationUid |
  | resource.extension.valueString        | urn:va:location:9E7A:9 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/orderUid |
  | resource.extension.valueString        | urn:va:order:9E7A:301:10779 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistName |
  | resource.extension.valueString        | RADTECH,FORTYONE |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistUid |
  | resource.extension.valueString        | urn:va:user:9E7A:11817 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/providerName |
  | resource.extension.valueString        | WARDCLERK,FIFTYTHREE |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/successor |
  | resource.extension.valueString        | urn:va:med:9E7A:301:10833 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/summary |
  | resource.extension.valueString        | MedicationOrder{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/drugClassCode |
  | resource.extension.valueString        | urn:vadc:TN430 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/drugClassName |
  | resource.extension.valueString        | POTASSIUM |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientCode |
  | resource.extension.valueString        | urn:va:vuid:4017447 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientCodeName |
  | resource.extension.valueString        | POTASSIUM CHLORIDE |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientRole |
  | resource.extension.valueString        | urn:sct:418804003 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/ingredientRXNCode |
  | resource.extension.valueString        | urn:rxnorm:8591 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/strength |
  | resource.extension.valueString        | 20 MEQ |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/summary |
  | resource.extension.valueString        | MedicationProduct{uid=''} |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/suppliedCode |
  | resource.extension.valueString        | urn:va:vuid:4000853 |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#products[0]/suppliedName |
  | resource.extension.valueString        | POTASSIUM CHLORIDE 2MEQ/ML INJ 20 MEQ |
  | resource.patient.reference            | Patient/9E7A;301 |
  | resource.wasNotGiven                  | false |
  | resource.reasonGiven.text             | None |
  | resource.reasonGiven.coding.system    | http://hl7.org/fhir/reason-medication-given |
  | resource.reasonGiven.coding.code      | a |
  | resource.reasonGiven.coding.display   | None |
  | resource.effectiveTimeDateTime        | 1999-11-01T10:24:00 |
  | resource.note                         | MedicationDose{uid=''} |


 # following scenario are checking for another patient for return of medication results.
 # only few fields are checked to validate data integrity.

 @F138_3_inpatient_medication_fhir @fhir @5000000341V359724
 Scenario: Client can request in-patient medication results in FHIR format
 	Given a patient with "in-patient medication results" in multiple VistAs
 #	And a patient with pid "5000000341V359724" has been synced through the RDK API
 	When the client requests in-patient medication results for the patient "5000000341V359724" in FHIR format
 	Then a successful response is returned
 	Then the client receives 18 FHIR "VistA" result(s)
 	And the client receives 9 FHIR "panorama" result(s)
 	And the FHIR results contain "in-patient medication administration results"
 	| field                                       | value                                                |
 	| resource.identifier.value                    | CONTAINS urn:va:med:9E7A:100022                      |
 	| resource.contained.contained.product.form.text         | TAB                                                  |
 	| resource.contained.dosageInstruction.text    | Give: 325MG PO Q4H                                   |
 	| resource.contained.status               | stopped                                           |
 	| resource.contained.contained.name       | ACETAMINOPHEN TAB                                        |
  | resource.contained.dosageInstruction.doseQuantity.value | 325 |
  | resource.contained.dosageInstruction.doseQuantity.units | MG |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/locationName |
  | resource.extension.valueString        | BCMA |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#dosages[0]]/scheduleName |
  | resource.extension.valueString        | Q4H |
  | resource.extension.url                | http://vistacore.us/fhir/extensions/med#orders[0]/providerName |
  | resource.extension.valueString        | PHYSICIAN,ASSISTANT |


 @F138_5_inpatient_medication_fhir  @fhir @5123456789V027402
 Scenario: Client can break the glass when requesting in-patient medication results in FHIR format for a sensitive patient
       Given a patient with "in-patient medication results" in multiple VistAs
       When the client requests in-patient medication results for that sensitive patient "5123456789V027402"
       Then a permanent redirect response is returned
       When the client breaks glass and repeats a request for in-patient medication results for that patient "5123456789V027402"
       Then a successful response is returned
       And the results contain
       | name         | value |
       | total | 0     |

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
 #	And a patient with pid "5000000341V359724" has been synced through the RDK API
 	When the client requests "10" in-patient medication results for the patient "5000000341V359724" in FHIR format
 	Then a successful response is returned
  And total returned resources are "10"
 	And the results contain
       | name         | value |
       | total | 16    |

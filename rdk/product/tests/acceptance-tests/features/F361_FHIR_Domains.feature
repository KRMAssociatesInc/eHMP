 # Team Europa

 Feature: F361 - CDS FHIR domains

 @F361-3.2_patient @US5108
 Scenario: Client can request demographics in FHIR format
     Given a patient with "demographics" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
     When the client requests demographics for that patient "5000000217V519385"
     Then a successful response is returned
     And the results contain
     	| field 					          	| value                    				                    |
      	| resourceType                          | Patient                                                   |
      	| text.status                           | generated                                                 |
       	| text.div                              | <div>EIGHT,INPATIENT. SSN: 666000808</div>                |
       	| gender                                | male              										|
       	| extension.url                         | http://vistacore.us/fhir/profiles/@main#service-connected |
       	| extension.valueCoding.code            | N                                                         |
       	| extension.valueCoding.display         | Service Connected                                         |
       	| identifier.use                        | official                                                  |
       	| identifier.system                     | http://hl7.org/fhir/sid/us-ssn                            |
       	| identifier.value                      | 666000808    											    |
       	| identifier.system                     | http://vistacore.us/fhir/id/uid                           |
       	| identifier.value                      | urn:va:patient:9E7A:100716:100716                         |
       	| identifier.system                     | http://vistacore.us/fhir/id/dfn                           |
       	| identifier.value                      | 100716                                                    |
       	| identifier.system					    | http://vistacore.us/fhir/id/pid                           |
       	| identifier.value 						| 9E7A;100716 											    |
       	| identifier.system                     | http://vistacore.us/fhir/id/icn                           |
       	| identifier.value                      | 5000000217V519385                                         |
       	| birthDate								| 1945-03-09												|
       	| name.text                             | EIGHT,INPATIENT                                           |

 @F361-3.2_healthfactors @US5108 @DE1444
 Scenario: Client can request Health Factors in FHIR format
     Given a patient with "healthfactors" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
     When the client requests "healthFactors-healthFactors" for the patient "5000000217V519385"
     Then a successful response is returned
     And the results contain
       | name         | value     |
       | total        | 1      |
     And the results contain
     	| field 										| value 												|
     	| entry.resource.resourceType 					| Observation 											|
     	| entry.resource.text.status 					| generated												|
     	| entry.resource.text.div               		| <div>REFUSAL TO COMPLETE SCREENING TOOL</div> 		|
     	| entry.resource.contained.resourceType         | Organization 											|
     	| entry.resource.contained.identifier.system 	| urn:oid:2.16.840.1.113883.6.233 						|
     	| entry.resource.contained.identifier.value 	| 561 													|
     	| entry.resource.contained.name 				| New Jersey HCS 										|
     	| entry.resource.code.coding.system				| http://ehmp.domain/terminology/1.0 					|
     	| entry.resource.code.coding.code 				| /concept/HF.REFUSAL%20TO%20COMPLETE%20SCREENING%20TOOL |
     	| entry.resource.code.coding.display 			| REFUSAL TO COMPLETE SCREENING TOOL 					|
     	| entry.resource.appliesDateTime 				| 2002-02-26T16:03:07 									|
     	| entry.resource.status 						| final 												|
     	| entry.resource.reliability 					| unknown 												|
     	| entry.resource.identifier.use 				| official 												|
     	| entry.resource.identifier.system 				| http://vistacore.us/fhir/id/uid 						|
     	| entry.resource.identifier.value 				| urn:va:factor:ABCD:777:32 							|
     	| entry.resource.subject.reference 				| Patient/777 											|
     	| entry.resource.performer.display 				| New Jersey HCS 										|


 @F361-3.2_educations @US5108 @DE1444
 Scenario: Client can request Education in FHIR format
     Given a patient with "educations" in multiple VistAs
     #And a patient with pid "10107V395912" has been synced through the RDK API
     When the client requests "educations-educations" for the patient "10107V395912"
     Then a successful response is returned
      And the results contain
       | name         | value     |
       | total        | 6         |
     And the results contain
     	| field 										| value 									|
     	| entry.resource.resourceType 					| Procedure 								|
     	| entry.resource.text.status 					| generated									|
     	| entry.resource.text.div               		| <div>undefined</div> 						|
     	| entry.resource.contained.resourceType         | Organization 								|
     	| entry.resource.contained.identifier.system 	| urn:oid:2.16.840.1.113883.6.233 			|
     	| entry.resource.contained.identifier.value 	| 888 										|
     	| entry.resource.contained.name 				| FT. LOGAN 							|
     	| entry.resource.identifier.use 				| official 									|
     	| entry.resource.identifier.system 				| http://vistacore.us/fhir/id/uid 			|
     	| entry.resource.identifier.value 				| urn:va:education:9E7A:253:37 				|
     	| entry.resource.patient.reference 				| Patient/10107V395912 								|
     	| entry.resource.status 						| completed 								|
     	| entry.resource.type.coding.system				| http://ehmp.domain/terminology/1.0 		|
     	| entry.resource.type.coding.code 				| /concept/ED.VA-TOBACCO%20USE%20SCREENING 			|
     	| entry.resource.type.coding.display 			| VA-TOBACCO USE SCREENING 						|
     	| entry.resource.performedDateTime 				| 1976-04-03T16:41:01.200+04:00 			|
     	| entry.resource.encounter.reference			| urn:va:visit:9E7A:253:2035				|
     	| entry.resource.encounter.display 				| PRIMARY CARE Apr 06, 2000 				|
     	| entry.resource.location.reference 			| urn:va:location:9E7A:32 					|
     	| entry.resource.location.display 				| PRIMARY CARE 								|
      | entry.resource.outcome.text             | GOOD |

 @F361-3.2_condition @US5108 @DE1444
 Scenario: Client can request Condition in FHIR format
     Given a patient with "condition" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
     When the client requests "condition-getProblems" for the patient "5000000217V519385"
     Then a successful response is returned
      And the results contain
       | name         | value     |
       | total        | 13        |
     And the results contain
     	| field 										| value 														|
     	| entry.resource.resourceType 					| Condition 													|
     	| entry.resource.category.coding.code			| diagnosis 													|
     	| entry.resource.category.coding.system 		| 2.16.840.1.113883.4.642.2.224 								|
     	| entry.resource.stage.summary 					| Occasional, uncontrolled chest pain (ICD-9-CM 411.1) 			|
     	#| entry.resource.patient.reference				| CDS;5000000217V519385 										|
     	| entry.resource.code.coding.system 			| urn:oid:2.16.840.1.113883.6.233 								|
     	| entry.resource.code.coding.code 				| urn:icd:411.1 												|
     	| entry.resource.code.coding.display 			| INTERMED CORONARY SYND 										|
     	| entry.resource.code.coding.code 				| 25106000 														|
     	| entry.resource.code.coding.display 			| Impending infarction (disorder) 								|
     	| entry.resource.code.coding.system 			| http://snomed.info/sct 										|
     	| entry.resource.asserter.display 				| PROGRAMMER,TWENTY 											|
     	| entry.resource.dateAsserted 					| 1996-05-14 													|
     	| entry.resource.onsetDateTime 					| 1996-03-15 													|
     	| entry.resource.contained.resourceType 		| Encounter 													|
     	| entry.resource.contained.text.status 			| generated 													|
     	#| entry.resource.contained.text.div 			| <div>Encounter with patient CDS;5000000217V519385</div> 		|
     	| entry.resource.contained.location.resourceType | Location 													|
     	| entry.resource.contained.resourceType 		| Practitioner 													|
     	| entry.resource.contained.name 				| PROGRAMMER,TWENTY 											|
     	| entry.resource.contained.identifier.value 	| urn:va:user:ABCD:755 											|
     	| entry.resource.contained.identifier.system 	| urn:oid:2.16.840.1.113883.6.233 								|
     	| entry.resource.clinicalStatus 				| confirmed 													|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#comments 		|
     	| entry.resource.extension.valueString 			| <div><ul><li>comment:SHERIDAN PROBLEM</li><li>entered:19960514</li><li>enteredByCode:urn:va:user:ABCD:755</li><li>enteredByName:PROGRAMMER,TWENTY</li><li>summary:ProblemComment{uid=''}</li></ul></div> |
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#service 		|
     	| entry.resource.extension.valueString 			| MEDICINE 														|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#serviceConnected |
     	| entry.resource.extension.valueBoolean			| false 														|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#statusCode 		|
     	| entry.resource.extension.valueString 			| urn:sct:55561003 												|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#statusDisplayName |
     	| entry.resource.extension.valueString 			| Active 														|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#statusName 		|
     	| entry.resource.extension.valueString			| ACTIVE 														|
     	| entry.resource.extension.url 					| http://vistacore.us/fhir/extensions/condition#updated 		|
     	| entry.resource.extension.valueDateTime		| 1996-05-14 													|


 @F361-3.2_vitalsBP @DE1445
 Scenario: Client can request vitals BP in FHIR format
     Given a patient with "vitals" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
 	   When the "observation" is requested for patient "5000000217V519385"
     Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 1122        |
     And the results contain
     	| field 											| value 								|
     	| entry.resource.resourceType 						| Observation 							|
     	| entry.resource.text.status 						| generated 							|
        #| entry.resource.text.div                          | <div>TEMPERATURE 92 F</div>           |
        | entry.resource.code.coding.code                   | 55284-4                               |
        | entry.resource.code.coding.display                | Blood pressure systolic and diastolic |
        | entry.resource.code.coding.system                 | http://loinc.org                      |
        | entry.resource.valueString                        | 152/80                                |
        | entry.resource.appliesDateTime                    | 2010-02-01T00:27:00                   |
        | entry.resource.issued                             | 2015-01-29T16:54:09-00:00             |
        | entry.resource.status                             | final                                 |
        | entry.resource.reliability                        | unknown                               |
        | entry.resource.identifier.use                     | official                              |
        | entry.resource.identifier.system                  | http://vistacore.us/fhir/id/uid       |
        | entry.resource.identifier.value                   | urn:va:vital:9E7A:100716:24978        |
        | entry.resource.subject.reference                  | Patient/100716                        |
        | entry.resource.performer.display                  | CAMP MASTER                           |
        | entry.resource.related.type                       | has-component                         |
        | entry.resource.related.target.reference           | #systolic                             |
        | entry.resource.related.type                       | has-component                         |
        | entry.resource.related.target.reference           | #diastolic                            |
        # ------------ CHECKING ORGANIZATION CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Organization                          |
        | entry.resource.contained.identifier.system        | urn:oid:2.16.840.1.113883.6.233       |
        | entry.resource.contained.identifier.value         | 500                                   |
        | entry.resource.contained.name                     | CAMP MASTER                           |
        # ------------ CHECKING SYSTOLIC CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Observation                           |
        | entry.resource.contained.id                       | systolic                              |
        | entry.resource.contained.code.coding.system       | http://loinc.org                      |
        | entry.resource.contained.code.coding.code         | 8480-6                                |
        | entry.resource.contained.code.coding.display      | Systolic blood pressure               |
        | entry.resource.contained.status                   | final                                 |
        | entry.resource.contained.reliability              | unknown                               |
        | entry.resource.contained.valueQuantity.value      | 152                                   |
        | entry.resource.contained.valueQuantity.units      | mm[Hg]                                |
        | entry.resource.contained.comments                 | Systolic                              |
        | entry.resource.contained.identifier.value         | systolic                              |
        | entry.resource.contained.issued                   | 2015-01-29T16:54:09-00:00             |
        | entry.resource.contained.referenceRange.low.value              | 100                                 |
        | entry.resource.contained.referenceRange.low.units              | mm[Hg]                              |
        | entry.resource.contained.referenceRange.high.value             | 210                                 |
        | entry.resource.contained.referenceRange.high.units             | mm[Hg]                              |
        | entry.resource.contained.referenceRange.meaning.coding.system  | http://snomed.info/id               |
        | entry.resource.contained.referenceRange.meaning.coding.code    | 12929001                            |
        | entry.resource.contained.referenceRange.meaning.coding.display | Normal systolic arterial pressure   |
     	# ------------ CHECKING DIASTOLIC CONTAINED RESOURCE ----------------------
        | entry.resource.contained.resourceType             | Observation                           |
        | entry.resource.contained.id                       | diastolic                             |
        | entry.resource.contained.code.coding.system       | http://loinc.org                      |
        | entry.resource.contained.code.coding.code         | 8462-4                                |
        | entry.resource.contained.code.coding.display      | Diastolic blood pressure              |
        | entry.resource.contained.status                   | final                                 |
        | entry.resource.contained.reliability              | unknown                               |
        | entry.resource.contained.valueQuantity.value      | 80                                    |
        | entry.resource.contained.valueQuantity.units      | mm[Hg]                                |
        | entry.resource.contained.comments                 | Diastolic                             |
        | entry.resource.contained.identifier.value         | diastolic                             |
        | entry.resource.contained.issued                   | 2015-01-29T16:54:09-00:00             |
        | entry.resource.contained.referenceRange.low.value              | 60                                  |
        | entry.resource.contained.referenceRange.low.units              | mm[Hg]                              |
        | entry.resource.contained.referenceRange.high.value             | 110                                 |
        | entry.resource.contained.referenceRange.high.units             | mm[Hg]                              |
        | entry.resource.contained.referenceRange.meaning.coding.system  | http://snomed.info/id               |
        | entry.resource.contained.referenceRange.meaning.coding.code    | 53813002                            |
        | entry.resource.contained.referenceRange.meaning.coding.display | Normal diastolic arterial pressure  |
        
     	
     	

 @F361-3.2_vitals @US5108
 Scenario: Client can request vitals in FHIR format
     Given a patient with "vitals" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
       When the "observation" is requested for patient "5000000217V519385"
     Then a successful response is returned
       And the results contain
       | name         | value     |
       | total        | 1122        |
     And the results contain
        | field                                             | value                                 |
        | entry.resource.resourceType                       | Observation                           |
        | entry.resource.text.status                        | generated                             |
        | entry.resource.text.div                           | <div>TEMPERATURE 92 F</div>           |
        | entry.resource.contained.resourceType             | Organization                          |
        | entry.resource.contained.identifier.system        | urn:oid:2.16.840.1.113883.6.233       |
        | entry.resource.contained.identifier.value         | 500                                   |
        | entry.resource.contained.name                     | CAMP BEE                              |
        | entry.resource.code.coding.system                 | urn:oid:2.16.840.1.113883.6.233       |
        | entry.resource.code.coding.code                   | urn:va:vuid:4500638                   |
        | entry.resource.code.coding.display                | TEMPERATURE                           |
        | entry.resource.code.coding.system                 | http://loinc.org                      |
        | entry.resource.code.coding.code                   | 8310-5                                |
        | entry.resource.code.coding.display                | BODY TEMPERATURE                      |
        | entry.resource.valueQuantity.value                | 92                                    |
        | entry.resource.valueQuantity.units                | F                                     |
        | entry.resource.appliesDateTime                    | 2013-12-15T13:01:00                   |
     #  | entry.resource.issued                             | 2015-04-09T13:54:52-00:00             |
        | entry.resource.status                             | final                                 |
        | entry.resource.reliability                        | unknown                               |
        | entry.resource.identifier.use                     | official                              |
        | entry.resource.identifier.system                  | http://vistacore.us/fhir/id/uid       |
   #    | entry.resource.identifier.value                   | urn:va:vital:C877:100716:28529        |
        | entry.resource.subject.reference                  | Patient/100716                        |
        | entry.resource.performer.display                  | CAMP BEE                              |
        | entry.resource.referenceRange.low.value           | 95                                    |
        | entry.resource.referenceRange.low.units           | F                                     |
        | entry.resource.referenceRange.high.value          | 102                                   |
        | entry.resource.referenceRange.high.units          | F                                     |
        | entry.resource.referenceRange.meaning.coding.system | http://snomed.info/id               |
        | entry.resource.referenceRange.meaning.coding.code | 87273009                              |
        | entry.resource.referenceRange.meaning.coding.display | Normal Temperature                 |


 @F361-5.4_allergies @US5960
 Scenario: Client can request Allergy in FHIR format
     Given a patient with "allergyintolerance" in multiple VistAs
     #And a patient with pid "10107V395912" has been synced through the RDK API
     When the client requests "allergyIntolerance-allergyintolerances" for the patient "10107V395912"
     Then a successful response is returned
     And the results contain
     	| field 										| value 								|
         | entry.resource.resourceType 					| AllergyIntolerance                    |
         | entry.resource.text.status                    | generated |
         | entry.resource.text.div                       | <div>PENICILLIN</div> |
         | entry.resource.recordedDate                   | 2005-03-17T20:06:00 |
         | entry.resource.patient.reference              | Patient/9E7A;253 |
         | entry.resource.substance.coding.system        | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.substance.coding.code          | AM114 |
         | entry.resource.substance.coding.display       | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS |
         #| entry.resource.status                         | null |
         | entry.resource.criticality                    | unassessible |
         | entry.resource.type                           | immune |
         #| entry.resource.category                       | null |
         #| entry.resource.lastOccurence                  | null |
         | entry.resource.event.substance.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.event.substance.coding.code    | urn:va:vuid: |
         | entry.resource.event.substance.coding.display | PENICILLIN |
         | entry.resource.event.certainty                | likely |
         | entry.resource.event.manifestation.coding.system  | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.event.manifestation.coding.code    | urn:va:vuid: |
         | entry.resource.event.manifestation.coding.display | ITCHING,WATERING EYES |
         #| entry.resource.event.description              | null |
         #| entry.resource.event.onset                    | null |
         #| entry.resource.event.duration                 | null |
         #| entry.resource.event.severity                 | null |
         #| entry.resource.event.exposureRoute            | null |
         #| entry.resource.event.comment                  | null |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#facilityCode |
         | entry.resource.extension.valueString          | 500 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#facilityName |
         | entry.resource.extension.valueString          | CAMP MASTER |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#historical |
         | entry.resource.extension.valueString          | true |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#kind |
         | entry.resource.extension.valueString          | Allergy/Adverse Reaction |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#lastUpdateTime |
         | entry.resource.extension.valueString          | 20050317200629 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#localId |
         | entry.resource.extension.valueString          | 750 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#mechanism |
         | entry.resource.extension.valueString          | PHARMACOLOGIC |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#originatorName |
         | entry.resource.extension.valueString          | VEHU,SEVEN |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#reference |
         | entry.resource.extension.valueString          | 125;GMRD(120.82, |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#stampTime |
         | entry.resource.extension.valueString          | 20050317200629 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#typeName |
         | entry.resource.extension.valueString          | DRUG |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#uid |
         | entry.resource.extension.valueString          | urn:va:allergy:9E7A:253:750 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#verified |
         | entry.resource.extension.valueString          | 20050317200629 |
         | entry.resource.extension.url                  | http://vistacore.us/fhir/extensions/algyInt#verifierName |
         | entry.resource.extension.valueString          | <auto-verified> |

 @F361-5.4_testresults @US5961
     Scenario: Client can request Test Results in FHIR format
     Given a patient with "diagnosticreport" in multiple VistAs
     #And a patient with pid "10110V004877" has been synced through the RDK API
 	  When the diagnosticreport is requested for the patient "10110V004877"
     Then a successful response is returned
     And the results contain
       | name         | value     |
       | total        | 685       |
     And the results contain
     	| field 											| value 								|
       | entry.resource.resourceType 						| DiagnosticReport |
       | entry.resource.name.text              | Hematocrit, Blood Quantitative Automated Count |
       | entry.resource.name.coding.system     | DOD_NCID |
       | entry.resource.name.coding.code       | 8566 |
       | entry.resource.name.coding.system      | http://loinc.org |
       | entry.resource.name.coding.code       | 4544-3 |
       | entry.resource.name.coding.display    | Hematocrit [Volume Fraction] of Blood by Automated count |
       | entry.resource.status                 | final |
       | entry.resource.issued                 | 2007-06-21T14:26:00 |
       | entry.resource.subject.reference      | Patient/10110V004877 |
       | entry.resource.performer.display      | 4th Medical Group/0090 |
       | entry.resource.contained.resourceType | Observation |
       | entry.resource.contained.code.text    | Hematocrit, Blood Quantitative Automated Count |
       | entry.resource.contained.status       | final |
       | entry.resource.contained.reliability  | ok |
       | entry.resource.contained.valueQuantity.value | 30 |
       | entry.resource.contained.valueQuantity.units | % |
       | entry.resource.contained.interpretation.coding.system | http://hl7.org/fhir/vs/observation-interpretation |
       | entry.resource.contained.interpretation.coding.code | L |
       | entry.resource.contained.interpretation.coding.display | Below low normal |
       | entry.resource.contained.specimen.display | BLOOD |
       | entry.resource.contained.referenceRange.high.value | 49.1 |
       | entry.resource.contained.referenceRange.high.units   | % |
       | entry.resource.contained.referenceRange.low.value | 35.5 |
       | entry.resource.contained.referenceRange.low.units | % |
       | entry.resource.serviceCategory.text     | Chemistry |
       | entry.resource.serviceCategory.coding.system | http://hl7.org/fhir/v2/0074 |
       | entry.resource.serviceCategory.coding.code | CH |
       | entry.resource.serviceCategory.coding.display | Chemistry |
       | entry.resource.diagnosticDateTime  | 2007-06-21T10:26:00 |

 @F361-5.1_medicationprescription @US5272
 Scenario: Client can request Medication Prescription in FHIR format
     Given a patient with "medicationprescription" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
 	When the client requests "medicationprescription-medicationprescription" for the patient "5000000217V519385"
     Then a successful response is returned
     And the results contain
     	| field 											| value 								|
     	| entry.resource.resourceType 						| MedicationPrescription				|
     	| entry.resource.status 							| stopped								|
     	| entry.resource.contained.resourceType 			| Medication 							|
     	| entry.resource.contained.name 					| IBUPROFEN TAB 						|
     	| entry.resource.contained.code.text 				| Ibuprofen 800 MG Oral Tablet 			|
     	| entry.resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88|
       | entry.resource.contained.code.coding.code   | 197807 |
       | entry.resource.contained.code.coding.display | Ibuprofen 800 MG Oral Tablet |
       | entry.resource.contained.product.form.text   | TAB |
       | entry.resource.contained.product.ingredient.item.display | IBUPROFEN TAB |
       | entry.resource.contained.contained.resourceType         | Substance |
       | entry.resource.contained.contained.type.text            | IBUPROFEN 800MG TAB |
       | entry.resource.contained.contained.type.coding.system   | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.contained.contained.type.coding.code     | urn:va:vuid:4017840 |
       | entry.resource.contained.contained.type.coding.display  | IBUPROFEN |
       | entry.resource.contained.contained.type.coding.system   | SNOMED-CT |
       | entry.resource.contained.contained.type.coding.code     | urn:sct:410942007 |
       | entry.resource.contained.contained.type.coding.display  | IBUPROFEN TAB |
       | entry.resource.contained.contained.description          | IBUPROFEN 800MG TAB |
       | entry.resource.identifier.system              | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.identifier.value               | urn:va:med:9E7A:100716:33600 |
       | entry.resource.note                           | IBUPROFEN 800MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH EVERY 8 HOURS |
       | entry.resource.patient.reference              | Patient/5000000217V519385 |
       | entry.resource.dateWritten                    | 2014-01-15T10:29:00 |
       | entry.resource.prescriber.reference           | Provider/urn:va:user:9E7A:1057 |
       | entry.resource.dosageInstruction.text         | TAKE ONE TABLET BY MOUTH EVERY 8 HOURS |
       | entry.resource.dosageInstruction.scheduledTiming.repeat.frequency | 1 |
       | entry.resource.dosageInstruction.scheduledTiming.repeat.period    | 480 |
       | entry.resource.dosageInstruction.scheduledTiming.repeat.periodUnits | s |
       | entry.resource.dosageInstruction.scheduledTiming.code.text          | Q8H |
       | entry.resource.dosageInstruction.route.text             | PO |
       | entry.resource.dosageInstruction.doseQuantity.value     | 800 |
       | entry.resource.dosageInstruction.doseQuantity.units     | MG |
       | entry.resource.dispense.validityPeriod.start            | 2014-01-15 |
       | entry.resource.dispense.validityPeriod.end              | 2015-01-16 |
       | entry.resource.dispense.numberOfRepeatsAllowed          | 3 |
       | entry.resource.dispense.quantity.value                  | 270 |
       | entry.resource.dispense.expectedSupplyDuration.value    | 90 |
       | entry.resource.dispense.expectedSupplyDuration.units    | days |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#IMO |
       | entry.resource.extension.valueBoolean                   | false |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#facilityCode |
       | entry.resource.extension.valueString                    | 998 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#facilityName |
       | entry.resource.extension.valueString                    | ABILENE (CAA) |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#kind |
       | entry.resource.extension.valueString                    | Medication, Outpatient |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#lastFilled |
       | entry.resource.extension.valueString                    | 20140115 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#lastUpdateTime |
       | entry.resource.extension.valueString                    | 20150116000000 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#localId |
       | entry.resource.extension.valueString                    | 404197;O |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#medStatus |
       | entry.resource.extension.valueString                    | urn:sct:392521001 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#medStatusName |
       | entry.resource.extension.valueString                    | historical |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#medType |
       | entry.resource.extension.valueString                    | urn:sct:73639000 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#qualifiedName |
       | entry.resource.extension.valueString                    | IBUPROFEN TAB |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#stampTime |
       | entry.resource.extension.valueString                    | 20150116 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#supply |
       | entry.resource.extension.valueBoolean                    | false |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#type |
       | entry.resource.extension.valueString                    | Prescription |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#units |
       | entry.resource.extension.valueString                    | MG |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#vaType |
       | entry.resource.extension.valueString                    | O |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/instructions |
       | entry.resource.extension.valueString                    | 800MG |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/noun |
       | entry.resource.extension.valueString                    | TABLET |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/relativeStart |
       | entry.resource.extension.valueInteger                   | 0 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/relativeStop |
       | entry.resource.extension.valueInteger                   | 527040 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/scheduleType |
       | entry.resource.extension.valueString                    | CONTINUOUS |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#dosages[0]]/summary |
       | entry.resource.extension.valueString                    | MedicationDose{uid=''} |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#fills[0]/daysSupplyDispensed |
       | entry.resource.extension.valueInteger                   | 90 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#fills[0]/dispenseDate |
       | entry.resource.extension.valueString                    | 20140115 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#fills[0]/quantityDispensed |
       | entry.resource.extension.valueString                    | 270 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#fills[0]/routing |
       | entry.resource.extension.valueString                    | M |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#fills[0]/summary |
       | entry.resource.extension.valueString                    | MedicationFill{uid=''} |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/fillCost |
       | entry.resource.extension.valueString                    | 6.129 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/fillsRemaining |
       | entry.resource.extension.valueInteger                   | 3 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/locationName |
       | entry.resource.extension.valueString                    | CARDIOLOGY |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/locationUid |
       | entry.resource.extension.valueString                    | urn:va:location:9E7A:195 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/orderUid |
       | entry.resource.extension.valueString                    | urn:va:order:9E7A:100716:33600 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistName |
       | entry.resource.extension.valueString                    | PROGRAMMER,ONE |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/pharmacistUid |
       | entry.resource.extension.valueString                    | urn:va:user:9E7A:1 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/prescriptionId |
       | entry.resource.extension.valueString                    | 500975 |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/providerName |
       | entry.resource.extension.valueString                    | PROVIDER,THIRTY |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/summary |
       | entry.resource.extension.valueString                    | MedicationOrder{uid=''} |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#orders[0]/vaRouting |
       | entry.resource.extension.valueString                    | M |
       | entry.resource.extension.url                            | http://vistacore.us/fhir/extensions/med#products[0]/summary |
       | entry.resource.extension.valueString                    | MedicationOrder{uid=''} |

 @F361-5.1_medicationdispense @US5272
 Scenario: Client can request Medication Dispense in FHIR format
     Given a patient with "medicationdispense" in multiple VistAs
     #And a patient with pid "10107V395912" has been synced through the RDK API
 	When the client requests "medicationdispense-getMedicationDispense" for the patient "10107V395912"
     Then a successful response is returned
     And the results contain
     	| field 											| value 								|
     	| entry.resource.resourceType 						| MedicationDispense				|
         | entry.resource.status                             | stopped |
         | entry.resource.patient.reference                  | Patient/9E7A;253 |
         | entry.resource.dispenser.reference                | Provider/urn:va:user:9E7A:983 |
         | entry.resource.contained.resourceType             | MedicationPrescription |
         | entry.resource.contained.patient.reference        | Patient/9E7A;253 |
         | entry.resource.contained.identifier.system        | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.contained.identifier.value         | urn:va:med:9E7A:253:27957 |
         | entry.resource.contained.status                   | stopped |
         | entry.resource.contained.dateWritten              | 2010-02-27T09:03:00 |
         | entry.resource.contained.prescriber.reference     | Provider/urn:va:user:9E7A:983 |
         | entry.resource.contained.note                     | METOPROLOL TARTRATE 50MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
         | entry.resource.contained.resourceType             | Medication |
         | entry.resource.contained.name                     | METOPROLOL TARTRATE TAB |
         | entry.resource.contained.code.text                | 866514/Metoprolol Tartrate 50 MG Oral Tablet |
         | entry.resource.contained.code.coding.system       | urn:oid:2.16.840.1.113883.6.88 |
         | entry.resource.contained.code.coding.code         | 866514 |
         | entry.resource.contained.code.coding.display      | Metoprolol Tartrate 50 MG Oral Tablet |
         | entry.resource.contained.product.form.text        | TAB |
         | entry.resource.contained.product.ingredient.item.display | METOPROLOL TARTRATE TAB |
         | entry.resource.contained.contained.resourceType             | Substance |
         | entry.resource.contained.contained.type.text                | METOPROLOL TARTRATE 50MG TAB |
         | entry.resource.contained.contained.type.coding.system       | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.contained.contained.type.coding.code         | urn:va:vuid:4019836 |
         | entry.resource.contained.contained.type.coding.display      | METOPROLOL |
         | entry.resource.contained.contained.type.coding.system       | SNOMED-CT |
         | entry.resource.contained.contained.type.coding.code         | urn:sct:410942007 |
         | entry.resource.contained.contained.type.coding.display      | METOPROLOL TARTRATE TAB |
         | entry.resource.contained.contained.description              | METOPROLOL TARTRATE 50MG TAB |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
         | entry.resource.contained.extension.valueString              | urn:vandf:4019836 |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
         | entry.resource.contained.extension.valueString              | urn:ndfrt:N0000007838 |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
         | entry.resource.contained.extension.valueString              | urn:ndfrt:N0000000001 |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
         | entry.resource.contained.extension.valueString              | urn:ndfrt:N0000007439 |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
         | entry.resource.contained.extension.valueString              | urn:rxnorm:11289 |
         | entry.resource.contained.extension.url                      | http://vistacore.us/fhir/extensions/med#rxncodes |
       #  | entry.resource.contained.extension.valueString              | uurn:ndfrt:N0000007669 |
         | entry.resource.identifier.system                  | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.identifier.value                   | urn:va:med:9E7A:253:27957 |
         | entry.resource.authorizingPrescription.display    | METOPROLOL TARTRATE TAB |
         | entry.resource.quantity.value                     | 180 |
         | entry.resource.quantity.units                     | TAB |
         | entry.resource.daysSupply.value                   | 90 |
         | entry.resource.daysSupply.units                   | days |
         | entry.resource.medication.display                 | METOPROLOL TARTRATE TAB |
         | entry.resource.whenPrepared                       | 2010-02-27 |
         | entry.resource.note                               | METOPROLOL TARTRATE 50MG TAB (EXPIRED)\n TAKE ONE TABLET BY MOUTH TWICE A DAY |
         | entry.resource.dosageInstruction.schedulePeriod.start | 2010-02-27 |
         | entry.resource.dosageInstruction.schedulePeriod.end   | 2011-02-28 |
         | entry.resource.dosageInstruction.scheduleTiming.code.text | BID |
         | entry.resource.dosageInstruction.scheduleTiming.code.coding.code | BID |
         | entry.resource.dosageInstruction.scheduleTiming.code.coding.display | BID |
         | entry.resource.dosageInstruction.scheduleTiming.repeat.frequency | 720 |
         | entry.resource.dosageInstruction.route.text | Oral |
         | entry.resource.dosageInstruction.route.coding.system | urn:oid:2.16.840.1.113883.6.233 |
         | entry.resource.dosageInstruction.route.coding.code   | PO |
         | entry.resource.dosageInstruction.route.coding.display | Oral |
         | entry.resource.dosageInstruction.doseQuantity.value | 50 |
         | entry.resource.dosageInstruction.doseQuantity.units | MG |

 @F361-5.1_medicationadministration @US5272
 Scenario: Client can request Medication Administration in FHIR format
     Given a patient with "medicationadministration" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
 	When the client requests "medicationadministration-medicationAdministration" for the patient "5000000217V519385"
     Then a successful response is returned
     And the results contain
     	| field 											| value 								|
     	| entry.resource.resourceType 						| MedicationAdministration				|
       | entry.resource.status       | stopped |
       | entry.resource.contained.contained.resourceType | Medication |
       | entry.resource.contained.contained.name         | IBUPROFEN, 800 MG, TABLET, ORAL |
       | entry.resource.contained.contained.code.coding.system     | DOD_NCID |
       | entry.resource.contained.contained.code.coding.code       | 3000265540 |
       | entry.resource.contained.contained.product.form.text      | IBUPROFEN, 800 MG, TABLET, ORAL |
       | entry.resource.contained.contained.contained.resourceType | Substance |
       | entry.resource.contained.contained.contained.type.text    | IBUPROFEN, 800 MG, TABLET, ORAL |
       | entry.resource.contained.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.contained.contained.contained.type.coding.system | SNOMED-CT |
       | entry.resource.contained.contained.contained.description  | IBUPROFEN, 800 MG, TABLET, ORAL |
       | entry.resource.contained.identifier.system            | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.contained.identifier.value             | urn:va:med:DOD:0000000001:2157553058 |
       | entry.resource.contained.note  | IBUPROFEN, 800 MG, TABLET, ORAL (Expired)\n TAKE 1 TABLET 3 TIMES DAILY WITH FOOD #60 RF0 |
       | entry.resource.contained.dispense.validityPeriod.start | 2013-05-12T21:06:00 |
       | entry.resource.contained.dispense.validityPeriod.end    | 2013-06-11T21:05:00 |
       | entry.resource.contained.dispense.quantity.value        | 60 |
       | entry.resource.contained.dispense.expectedSupplyDuration.value | 30 |
       | entry.resource.contained.dispense.expectedSupplyDuration.units  | days |
       | entry.resource.contained.resourceType         | Practitioner |
       | entry.resource.identifier.system          | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.identifier.value           | urn:va:med:DOD:0000000001:2157553058 |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#IMO |
       | entry.resource.extension.valueBoolean     | false |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#kind |
       | entry.resource.extension.valueString      | Medication, Inpatient |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#medStatus |
       | entry.resource.extension.valueString      | Expired |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#medType |
       | entry.resource.extension.valueString      | I |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#supply |
       | entry.resource.extension.valueBoolean     | false |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#orders[0]/fillsRemaining |
       | entry.resource.extension.valueInteger     | 0.0 |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#orders[0]/providerName |
       | entry.resource.extension.valueString      | SJF, FIVE |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#orders[0]/summary |
       | entry.resource.extension.valueString      | MedicationOrder{uid=''} |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#products[0]/summary |
       | entry.resource.extension.valueString      | MedicationProduct{uid=''} |
       | entry.resource.extension.url              | http://vistacore.us/fhir/extensions/med#products[0]/suppliedName |
       | entry.resource.extension.valueString      | IBUPROFEN, 800 MG, TABLET, ORAL |
       | entry.resource.patient.reference          | Patient/DOD;0000000001 |
       | entry.resource.wasNotGiven                | true |
       | entry.resource.reasonNotGiven.text        | None |
       | entry.resource.reasonNotGiven.coding.system | http://hl7.org/fhir/reason-medication-not-given |
       | entry.resource.reasonNotGiven.coding.code   | a |
       | entry.resource.reasonNotGiven.coding.display | None |
       | entry.resource.effectiveTimeDateTime        | 2013-05-12T21:06:00 |

 @F361-5.1_medicationstatement @US5272
 Scenario: Client can request Medication Statement in FHIR format
     Given a patient with "medicationstatement" in multiple VistAs
     #And a patient with pid "5000000217V519385" has been synced through the RDK API
 	When the client requests "medicationdstatement-getMedicationStatement" for the patient "5000000217V519385"
     Then a successful response is returned
     And the results contain
     	| field 											| value 								|
     	| entry.resource.resourceType 						| MedicationStatement |
       | entry.resource.status                   | in-progress |
       | entry.resource.patient.reference        | Patient/9E7A;100716 |
       | entry.resource.contained.resourceType   | Medication |
       | entry.resource.contained.name           | ASCORBIC ACID TAB |
       | entry.resource.contained.code.text      | 282402/Ascorbic Acid 500 MG Oral Tablet |
       | entry.resource.contained.code.coding.system | urn:oid:2.16.840.1.113883.6.88 |
       | entry.resource.contained.code.coding.code | 282402 |
       | entry.resource.contained.code.coding.display  | Ascorbic Acid 500 MG Oral Tablet |
       | entry.resource.contained.product.form.text | TAB |
       | entry.resource.contained.product.ingredient.item.display | ASCORBIC ACID TAB |
       | entry.resource.contained.contained.resourceType | Substance |
       | entry.resource.contained.contained.type.text    | ASCORBIC ACID 500MG TAB |
       | entry.resource.contained.contained.type.coding.system | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.contained.contained.type.coding.code | urn:va:vuid:4017471 |
       | entry.resource.contained.contained.type.coding.display | ASCORBIC ACID |
       | entry.resource.contained.contained.type.coding.system | SNOMED-CT |
       | entry.resource.contained.contained.type.coding.code  | urn:sct:410942007 |
       | entry.resource.contained.contained.type.coding.display | ASCORBIC ACID TAB |
       | entry.resource.contained.contained.description      | ASCORBIC ACID 500MG TAB |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:vandf:4017471 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000008028 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000000002 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000007627 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000007676 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000008137 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:rxnorm:1151 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000145859 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000029269 |
       | entry.resource.contained.extension.url          | http://vistacore.us/fhir/extensions/med#rxncodes |
       | entry.resource.contained.extension.valueString  | urn:ndfrt:N0000146025 |
       | entry.resource.identifier.system                | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.identifier.value                 | urn:va:med:9E7A:100716:33599 |
       | entry.resource.informationSource.reference      | Practitioner/urn:va:user:9E7A:1057 |
       | entry.resource.wasNotGiven                      | false |
       | entry.resource.effectivePeriod.start            | 2013-12-02 |
       | entry.resource.note                             | ASCORBIC ACID 500MG TAB (ACTIVE)\n TAKE TWO TABLETS BY MOUTH EVERY 24 HOURS |
       | entry.resource.medication.display               | ASCORBIC ACID TAB |
       | entry.resource.dosage.text                      | MedicationDose{uid=''} |
       | entry.resource.dosage.schedule.code.text        | Q24H |
       | entry.resource.dosage.schedule.code.coding.code | Q24H |
       | entry.resource.dosage.schedule.code.coding.display | Q24H |
       | entry.resource.dosage.schedule.repeat.frequency  | 1440 |
       | entry.resource.dosage.route.text                 | Oral |
       | entry.resource.dosage.route.coding.system        | urn:oid:2.16.840.1.113883.6.233 |
       | entry.resource.dosage.route.coding.code          | PO |
       | entry.resource.dosage.route.coding.display       | Oral |
       | entry.resource.dosage.quantity.value             | 1000 |
       | entry.resource.dosage.quantity.units             | MG |

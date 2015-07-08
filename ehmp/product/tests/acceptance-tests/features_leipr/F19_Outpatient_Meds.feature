@Outpatient_Meds
Feature: F19 Outpatient Medications
  the need for a longitudinal enterprise patient record that contains Outpatient Medication data from all VistA instances where the patient record exists
  Inpatient Medication data is requested or a change to Outpatient Medication data is detected
  it will be retrieved and stored in the LEIPR
  and displayed in the JLV

@US481
Scenario: VistA Exchange supports request, retrieval, storage, and display of Outpatient Medication data from multiple VistA instances for a patient
  Given a patient with id "E104" has not been synced
  When a client requests "med" for patient with id "E104"
  Then a successful response is returned within "60" seconds
  And that patient has Outpatient Medication data at multiple VistA instances
 	    | field                               | panorama_value              | kodak_value                 |
  	    | extension[currentProviderName].valueString | PROGRAMMER,TWENTYEIGHT | PROGRAMMER,TWENTYNINE |
  
  Then a response is returned with Outpatient Medication data from multiple VistA instances for that patient from LEIPR (Data come from one record)
		| Outpatient_fields_list                		                            | Outpatient_values                                             | Required_fields |
		| patient.reference                                                         | Patient/E104                                                  | Yes |
        | text.status                                                               | generated                                                     | Yes |
        | text.div                                                                  | "<div>&lt;div&gt;Prescription #: 500005&lt;br&gt;Last Fill Date: 02/11/2000.00:00:00&lt;br&gt;Fill Status: EXPIRED&lt;br&gt;Prescription: DIGOXIN (LANOXIN) 0.125MG TAB&lt;br&gt;Sig: T1 QD&lt;br&gt;Last Fill Quantity: 30 TAB&lt;br&gt;Last Fill Days Supply: 30&lt;br&gt;Refills Remaining: 5&lt;br&gt;Ordering Provider: PROGRAMMER,TWENTYEIGHT&lt;br&gt;Expires: 02/11/2001.00:00:00&lt;br&gt;&lt;/div&gt;</div>" | Yes |
        | identifier.system                                                         | urn:oid:2.16.840.1.113883.6.233                               | Yes |
        | identifier.value                                                          | 500005                                                        | Yes |
        | extension[ienPrescription].url                                            | "http://vistacore.us/fhir/profiles/@main#ienPrescription"     | No  |
        | extension[ienPrescription].valueString                                    | 402153;O                                                      | No  |
        | extension[currentProviderName].url                                        | "http://vistacore.us/fhir/profiles/@main#currentProviderName" | No  |
        | extension[currentProviderName].valueString                                | PROGRAMMER,TWENTYEIGHT                                        | No  |
        | extension[currentProviderId].url                                          | "http://vistacore.us/fhir/profiles/@main#currentProviderId"   | No  |
        | extension[currentProviderId].valueString                                  | 923                                                           | No  |
        | extension[vaStatus].url                                                   | "http://vistacore.us/fhir/profiles/@main#vaStatus"            | No  |
        | extension[vaStatus].valueString                                           | EXPIRED                                                       | No  |
        | contained[MedicationPrescription].identifier.system 	                    | urn:oid:2.16.840.1.113883.6.233                               | No  |
		| contained[MedicationPrescription].identifier.value 	    		        | 12008                                                         | No  |
		| contained[MedicationPrescription].extension[vaStatus].url 			    | "http://vistacore.us/fhir/profiles/@main#vaStatus"            | No  |
		| contained[MedicationPrescription].extension[vaStatus].valueString 	    | historical                                                    | No  |
		| contained[MedicationPrescription].extension[prescriptionType].url 	    | "http://vistacore.us/fhir/profiles/@main#prescriptionType"    | No  |
		| contained[MedicationPrescription].extension[prescriptionType].valueString | Prescription                                                  | No  |
		| contained[MedicationPrescription].extension[medicationType].url 		    | "http://vistacore.us/fhir/profiles/@main#medicationType"      | No  |
		| contained[MedicationPrescription].extension[medicationType].valueString 	| O                                                             | No  |
		| contained[MedicationPrescription].dispense.validityPeriod.start 		    | 2000-02-11T00:00:00                                           | No  |
		| contained[MedicationPrescription].dispense.validityPeriod.end 		                        | 2001-02-11T00:00:00                                         | No  |
		| contained[MedicationPrescription].dispense.validityPeriod.extension[expires].url 	            | "http://vistacore.us/fhir/profiles/@main#expires"           | No  |
		| contained[MedicationPrescription].dispense.validityPeriod.extension[expires].valueDateTime	| 2001-02-11T00:00:00                                         | No  |
		| contained[MedicationPrescription].dispense.extension[routing].url 			                | "http://vistacore.us/fhir/profiles/@main#routing"           | No  |
		| contained[MedicationPrescription].dispense.extension[routing].valueString 			        | M                                                           | No  |
		| contained[MedicationPrescription].dispense.extension[fillCost].url	 		                | "http://vistacore.us/fhir/profiles/@main#fillCost"          | No  |
		| contained[MedicationPrescription].dispense.extension[fillCost].valueDecimal 		            | 0.33                                                        | No  |
		| contained[MedicationPrescription].dispense.extension[fillsRemaining].url 	                    | "http://vistacore.us/fhir/profiles/@main#fillsRemaining"    | No  |
		| contained[MedicationPrescription].dispense.extension[fillsRemaining].valueInteger 	        | 5                               | No  |
		| contained[MedicationPrescription].dispense.numberOfRepeatsAllowed 			                | 5                               | No  |
		| contained[MedicationPrescription].dispense.expectedSupplyDuration.value 		                | 30                              | No  |
		| contained[MedicationPrescription].dispense.expectedSupplyDuration.system                      | urn:oid:2.16.840.1.113883.6.8   | No  |
		| contained[MedicationPrescription].dispense.expectedSupplyDuration.code 		                | d                               | No  |
		| contained[MedicationPrescription].dispense.expectedSupplyDuration.units 		                | days                            | No  |
		| contained[MedicationPrescription].dispense.quantity.value 					                | 30                              | No  |
		| contained[MedicationPrescription].dispense.quantity.units 					                | TAB                             | No  |
		| contained[MedicationPrescription].dosageInstruction[x].text 					                | T1 QD                           | No  |
		| authorizingPrescription[0].reference                                        |                                                                | Yes |
		| contained[Medication].kind                                                  | product                                                        | No  |
		| contained[Medication].extension[ienMedication].url 			              | "http://vistacore.us/fhir/profiles/@main#ienMedication"        | No  |
		| contained[Medication].extension[ienMedication].valueString 			      | 168                                                            | No  |
		| contained[Medication].extension[classCode].url 				              | "http://vistacore.us/fhir/profiles/@main#classCode"            | No  |
		| contained[Medication].extension[classCode].valueString 				      | CV050                                                          | No  |
		| contained[Medication].extension[className].url 				              | "http://vistacore.us/fhir/profiles/@main#className"            | No  |
		| contained[Medication].extension[className].valueString 				      | DIGITALIS GLYCOSIDES                                           | No  |
		| contained[Medication].extension[classVuid].url 				              | "http://vistacore.us/fhir/profiles/@main#classVuid"            | No  |
		| contained[Medication].extension[classVuid].valueString 				      | 4021564                                                        | No  |
		| contained[Medication].extension[genericProductCode].url 		              | "http://vistacore.us/fhir/profiles/@main#genericProductCode"   | No  |
		| contained[Medication].extension[genericProductCode].valueString 	          | 372                                                            | No  |
		| contained[Medication].extension[genericProductName].url 		              | "http://vistacore.us/fhir/profiles/@main#genericProductName"   | No  |
		| contained[Medication].extension[genericProductName].valueString 	          | DIGOXIN                                                        | No  |
		| contained[Medication].extension[genericProductVuid].url 		              | "http://vistacore.us/fhir/profiles/@main#genericProductVuid"   | No  |
		| contained[Medication].extension[genericProductVuid].valueString 	          | 4018047                                                        | No  |
		| contained[Medication].extension[productConcentration].url 	              | "http://vistacore.us/fhir/profiles/@main#productConcentration" | No  |
		| contained[Medication].extension[productConcentration].valueString           | 0.125 MG                                                       | No  |
		| contained[Medication].code.coding[0].system                                 | urn:oid:2.16.840.1.113883.6.233                                | No  |
		| contained[Medication].code.coding[0].code                                   | 4015935                                                        | No  |
		| contained[Medication].code.coding[0].display                                | DIGOXIN (LANOXIN) 0.125MG TAB                                  | No  |
		| contained[Medication].code.coding.extension[ienVaProduct].url               | "http://vistacore.us/fhir/profiles/@main#ienVaProduct"         | No  |
		| contained[Medication].code.coding.extension[ienVaProduct].valueString       | 15572                                                          | No  |
		| contained[Medication].product.form.text                                     | TAB                                                            | No  |
        | contained[MedicationPrescription].medication.reference                      |                                                                | Yes |
		| contained[Organization].name                                                | CAMP BEE                                                       | No  |
		| contained[Organization].identifier.system               | urn:oid:2.16.840.1.113883.6.233         | No  |
		| contained[Organization].identifier.value                | 500                                     | No  |
		| contained[Practitioner][x].organization.reference       |                                         | Yes |
		| contained[Practitioner][x].name.text                    | PROGRAMMER,TWENTYEIGHT                  | No  |
		| contained[Practitioner][x].identifier.system 			  | urn:oid:2.16.840.1.113883.6.233         | No  |
		| contained[Practioner][x].identifier.value               | 923                                     | No  |
		| contained[Practioner][x].role[0].coding[0].system       | http://hl7.org/fhir/v2/0912             | No  |
        | contained[Practioner][x].role[0].coding[0].code         | PH                                      | No  |
        | contained[Practioner][x].role[0].coding[0].display      | Pharmacist                              | No  |
		| dispenser.reference 									  |                                         | Yes |
		| contained[Practitioner][y].organization.reference       |                                         | Yes |
		| contained[Practitioner][y].name.text 					  | PROGRAMMER,TWENTYEIGHT                  | No  |
		| contained[Practitioner][y].identifier.system            | urn:oid:2.16.840.1.113883.6.233         | No  |
        | contained[Practitioner][y].identifier.value             | 23                                      | No  |
		| contained[Practioner][y].role[0].coding[0].system       | http://hl7.org/fhir/v2/0912             | No  |
		| contained[Practioner][y].role[0].coding[0].code         | OP                                      | No  |
		| contained[Practioner][y].role[0].coding[0].display      | Ordering Provider                       | No  |
		| contained[MedicationPrescription].prescriber.reference  |                                         | Yes |
		| dispense[x].status 									  | completed                               | No  |
		| dispense[0].type.coding[0].system                       | http://hl7.org/fhir/v3/vs/ActPharmacySupplyType           | No  |
		| dispense[0].type.coding[0].code                         | FF                                                        | No  |
		| dispense[0].type.coding[0].display                      | First Fill                                                | No  |
		| dispense[0].whenPrepared                                | 2000-02-11T00:00:00                                       | No  |
		| dispense[0].whenHandedOver                              | 2000-02-11T00:00:00                                       | No  |
		| dispense[0].extension[vaStatus].url                     | "http://vistacore.us/fhir/profiles/@main#vaStatus"        | No  |
		| dispense[0].extension[vaStatus].valueString             | EXPIRED                                                   | No  |
		| dispense[0].extension[fillDaysSupply].url               | "http://vistacore.us/fhir/profiles/@main#fillDaysSupply"  | No  |
		| dispense[0].extension[fillDaysSupply].valueInteger      | 30                                                        | No  |
		| dispense[0].extension[routing].url                      | "http://vistacore.us/fhir/profiles/@main#routing"         | No  |
		| dispense[0].extension[routing].valueString              | M                                                         | No  |
		| dispense[0].quantity.value                              | 30                                                        | No  |
		| dispense[0].quantity.units                              | TAB                                                       | No  |
		| status                                                  | completed                                                 | No  |
	
	And a response is returned with Outpatient Medication data from multiple VistA instances for that patient from LEIPR (Data come from multiple record)
        | Outpatient_fields_list                                        | Outpatient_values                 | Required_fields |
    	| contained[Location].identifier.system                         | urn:oid:2.16.840.1.113883.6.233   | No  |
        | contained[Location].identifier.value                          | 23                                | No  |
        | contained[Location].name                                      | GENERAL MEDICINE                  | No  |
        | contained[Medication].extension[productRole].url              | "http://vistacore.us/fhir/profiles/@main#productRole" | No  |
        | contained[Medication].extension[productRole].valueString      | D                                 | No  |
        | contained[Practioner][y].location[0].reference                |                                   | Yes |
        | dispense[1].extension[routing].valueString                    | M                                 | No  |
        | contained[Medication].name                                    | GENERAL MEDICINE                  | No  |
        | dispense[1].type.coding[0].system                             | http://hl7.org/fhir/v3/vs/ActPharmacySupplyType           | No  |
        | dispense[1].type.coding[0].code                               | FF                                                        | No  |
        | dispense[1].type.coding[0].display                            | Refill                                                    | No  |
        | dispense[1].whenPrepared                                      | 1999-11-01T00:00:00                                       | No  |
        | dispense[1].whenHandedOver                                    | 2000-01-20T00:00:00                                       | No  |
        | dispense[1].extension[fillDaysSupply].url                     | "http://vistacore.us/fhir/profiles/@main#fillDaysSupply"  | No  |
        | dispense[1].extension[fillDaysSupply].valueInteger            | 30                                                        | No  |
        | dispense[1].extension[routing].url                            | "http://vistacore.us/fhir/profiles/@main#routing"         | No  |
        | dispense[1].extension[routing].valueString                    | M                                                         | No  |
        | dispense[0].extension[vaStatus].url                           | "http://vistacore.us/fhir/profiles/@main#vaStatus"        | No  |
        | dispense[0].extension[vaStatus].valueString                   | EXPIRED                                                   | No  |
        | dispense[1].quantity.value                                    | 120                                                       | No  |
        | dispense[1].quantity.units                                    | TAB                                                       | No  |
        

@US481
Scenario: VistA Exchange supports request, retrieval, storage, and display of Outpatient Medication data from multiple VistA instances for a patient
  Given a patient with id "E105" has not been synced
  When a client requests "med" for patient with id "E105"
  Then a successful response is returned within "60" seconds
  And a response is returned with Outpatient Medication data from multiple VistA instances for that patient from LEIPR (Data come from multiple record)
        | Outpatient_fields_list                                                                                       | Outpatient_values                                             | Required_fields |
        | contained[MedicationPrescription].dosageInstruction[x].text                                                  | TAKE ONE TABLET BY MOUTH TWICE A DAY FOR HYPERTENSION AND CHF | No  |
        | contained[MedicationPrescription].dosageInstruction[x].additionalInstructions.text                           | FOR HYPERTENSION AND CHF                                      | No  |
        | contained[MedicationPrescription].dosageInstruction[x].doseQuantity.value                                    | 1                                                             | No  |
        | contained[MedicationPrescription].dosageInstruction[x].doseQuantity.units                                    | TABLET                                                        | No  |
        | contained[MedicationPrescription].dosageInstruction[x].route.text                                            | PO                                                            | No  |
        | contained[MedicationPrescription].dosageInstruction[x].timingPeriod.start                                    | 2010-04-15T00:00:00                                           | No  |
        | contained[MedicationPrescription].dosageInstruction[x].timingPeriod.end                                      | 2011-04-16T00:00:00                                           | No  |
        | contained[MedicationPrescription].dosageInstruction[x].timingPeriod.extension[textDoseSchedule].url          | "http://vistacore.us/fhir/profiles/@main#textDoseSchedule"    | No  |
        | contained[MedicationPrescription].dosageInstruction[x].timingPeriod.extension[textDoseSchedule].valueString  | BID                                                           | No  |
        | contained[MedicationPrescription].status                                                                     | completed                                                     | No  |
        
        
        
# There are no data found for the below fileds.        
@US481-2 @future
Scenario: VistA Exchange supports request, retrieval, storage, and display of Outpatient Medication data from multiple VistA instances for a patient
  Given a patient with id "?" has not been synced
  When a client requests "med" for patient with id "?"
  Then a successful response is returned within "60" seconds
  Then a response is returned with Outpatient Medication data from multiple VistA instances for that patient from LEIPR
        | Outpatient_fields_list                                                                                         | Outpatient_values                                             | Required_fields |
        | contained[MedicationPrescription].dispense.quantity.extension[extendedQuantityUnits].url                       |test | No  |
        | contained[MedicationPrescription].dispense.quantity.extension[extendedQuantityUnits].value                     |test | No  |
        | contained[MedicationPrescription].dosageInstruction[0].doseQuantity.extension[extendedQuantityUnits].url       |test | No  |
        | contained[MedicationPrescription].dosageInstruction[0].doseQuantity.extension[extendedQuantityUnits].value     |test | No  |
        | contained[Medication].name                                    | TestPENICILLIN | No  |
        | dispense[0].quantity.extension[extendedQuantityUnits].url       | test | No  |
        | dispense[0].quantity.extension[extendedQuantityUnits].value     | test | No  |
        | dispense[1+].quantity.extension[extendedQuantityUnits].url      | test | No  |
        | dispense[1+].quantity.extension[extendedQuantityUnits].value    | test | No  |
        

                  				  
 #And the results can be viewed in JLV
 
 

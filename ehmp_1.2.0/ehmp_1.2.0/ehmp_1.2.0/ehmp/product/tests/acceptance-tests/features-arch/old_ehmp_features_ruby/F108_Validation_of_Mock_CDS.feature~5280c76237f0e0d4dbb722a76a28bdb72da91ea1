@mock_cds
Feature: F108 Create a Mock CDS 

#This feature item creates a Mock CDS to support Development/Test validation of the CDS Synchronization.

Background:
	Given a patient with pid "11016V630869" has been synced through Admin API
		
@f108_1_create_mock_cds_vitals 
Scenario: Client can request vitals from multiple VistAs in VPR format
	Given a patient with "vitals" in multiple VistAs
	When the client requests vitals for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field        | value                     |
      | displayName  | PN                        |
      | facilityCode | 561                       |
      | facilityName | New Jersey HCS                  |
      | kind         | Vital Sign                |
      | localId      | 333                       |
      | locationName | GEN MED                   |
      | locationUid  | urn:va:location:ABCD:9    |
      | observed     | 199903091300              |
      | result       | 7                         |
      | resulted     | 19990309154917            |
      | summary      | CONTAINS PAIN 7           |
      | typeCode     | urn:va:vuid:4500635       |
      | typeName     | PAIN                      |
      | uid          | urn:va:vital:ABCD:105:333 |


@f108_2_create_mock_cds_labs 
Scenario: Client can request labs from multiple VistAs in VPR format
	Given a patient with "labs" in multiple VistAs
	When the client requests labs for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:  
      | field              | value                                     |
      | categoryCode       | urn:va:lab-category:CH                    |
      | categoryName       | Laboratory                                |
      | comment            | CONTAINS Ordering Provider: Sixteen Provider Report Released Date/Time: Apr 02, 1991@16:34  |
      | displayName        | GLUCOSE                                   |
      | displayOrder       | 1                                         |
      | facilityCode       | 561                                       |
      | facilityName       | New Jersey HCS                                  |
      | groupName          | CH 0402 9                                 |
      | groupUid           | urn:va:accession:ABCD:15:CH;7089596.8377 |
      | high               | 110                                       |
      | localId            | CH;7089596.8377;2                         |
      | low                | 60                                        |
      | observed           | 199104021623                              |
      | result             | 106                                       |
      | resulted           | 199104021634                              |
      | specimen           | SERUM                                     |
      | statusCode         | urn:va:lab-status:completed               |
      | statusName         | completed                                 |
      | typeCode           | urn:lnc:2344-0                            |
      | typeId             | 175                                       |
      | typeName           | GLUCOSE                                   |
      | uid                | urn:va:lab:ABCD:15:CH;7089596.8377;2     |
      | units              | mg/dL                                     |
      | vuid               | urn:va:vuid:4665449                       |


@f108_3_create_mock_cds_allergies 
Scenario: Client can request allergies from multiple VistAs in VPR format
	Given a patient with "allergies" in multiple VistAs
	When the client requests allergies for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:  
      | field              		| value                                    |
      | comments.comment   		| CONTAINS TESTING DIETETICS						   |
      | comments.entered   		| 19940119082309 						   |
      | comments.enteredByName  | PROGRAMMER,TWENTY						   |
      | comments.enteredByUid   | urn:va:user:ABCD:755					   |
      | entered 		   		| 199401190822 							   |
      | facilityCode       		| 561                                      |
      | facilityName       		| New Jersey HCS                                 |
      | historical	       		| true					                   |
      | kind		       		| Allergy/Adverse Reaction               |
      | localId            		| 106				                       |
      | mechanism          		| ALLERGY			                       |
      | originatorName     		| PROGRAMMER,TWENTY	                       |
      | products.name 	   		| MILK									   |
      | products.vuid 	   		| urn:va:vuid:4636981					   |
      | reactions.name 	   		| NAUSEA,VOMITING						   |
      | reactions.vuid 	   		| urn:va:vuid:							   |
      | summary			   		| MILK									   |
      | typeName           		| DRUG, FOOD                               |
      | verified		   		| 19940119082339						   |
      | verifierName	   		| PROGRAMMER,TWENTY						   |
      

@f108_4_create_mock_cds_appointments 
Scenario: Client can request appointments from multiple VistAs in VPR format
	Given a patient with "appointments" in multiple VistAs
	When the client requests appointments for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
 	  | field              	   | value                                          |  
      | appointmentStatus      | SCHEDULED/KEPT                                 |
      | categoryCode           | urn:va:encounter-category:OV                   |
      | categoryName           | Outpatient Visit                               |
      | checkOut               | 199406161415                                   |
      | dateTime               | 199406161415                                   |
      | facilityCode           | 561                                            |
      | facilityName           | New Jersey HCS                                       |
      | localId                | A;2940616.1415;137                             |
      | locationName           | COMP AND PEN                                   |
      | locationUid            | urn:va:location:ABCD:137                       |
      | patientClassCode       | urn:va:patient-class:AMB                       |
      | patientClassName       | Ambulatory                                     |
      | providers.providerName | PROVIDER,ONEHUNDREDNINETYONE                   |
      | providers.providerUid  | urn:va:user:ABCD:11531                         |
      | service                | MEDICINE                                       |
      | stopCodeName           | AUDIOLOGY                                      |
      | stopCodeUid            | urn:va:stop-code:203                           |
      | summary                | AUDIOLOGY                                      |
      | typeCode               | 1                                              |
      | typeName               | CONTAINS COMPENSATION                          |
      | uid                    | urn:va:appointment:ABCD:159:A;2940616.1415;137 |


@f108_5_create_mock_cds_consults 
Scenario: Client can request consults from multiple VistAs in VPR format
	Given a patient with "consults" in multiple VistAs
	When the client requests consult results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
 	  | field            | value                             | 
      | category         | P                                 |
      | consultProcedure | COLONOSCOPY                       |
      | dateTime         | 199603181318                      |
      | facilityCode     | 561                               |
      | facilityName     | New Jersey HCS                          |
      | localId          | 82                                |
      | orderName        | EMPTY                             |
      | orderUid         | urn:va:order:ABCD:12:5389.1       |
      | service          | GASTROENTEROLOGY                  |
      | statusName       | ACTIVE                            |
      | typeName         | COLONOSCOPY GASTROENTEROLOGY Proc |
      | uid              | urn:va:consult:ABCD:12:82         |
	  
 	  
@f108_6_create_mock_cds_cpt 
Scenario: Client can request cpt from multiple VistAs in VPR format
	Given a patient with "cpt" in multiple VistAs
	When the client requests cpt for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                               |
      | cptCode       | urn:cpt:80061                       |
      | encounterName | LAB DIV 500 OOS ID 108 Oct 07, 1998 |
      | encounterUid  | urn:va:visit:ABCD:477:1316          |
      | entered       | 19981007090230                      |
      | facilityCode  | 561                                 |
      | facilityName  | New Jersey HCS                            |
      | localId       | 881                                 |
      | locationName  | LAB DIV 500 OOS ID 108              |
      | locationUid   | urn:va:location:ABCD:252            |
      | name          | LIPID PANEL                         |
      | quantity      | 1                                   |
      | type          | U                                   |
      | uid           | urn:va:cpt:ABCD:477:881             |
      

@f108_7_create_mock_cds_documents 
Scenario: Client can request documents from multiple VistAs in VPR format
	Given a patient with "documents" in multiple VistAs
	When the client requests document for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                          | value                                                 |
      | uid                            | urn:va:document:ABCD:3:3853                           |
      | summary                        | ADVANCE DIRECTIVE COMPLETED                           |
      | signer                         | LABTECH,FIFTYNINE                                     |
      | signedDateTime                 | 20070516095030                                        |
      | entered                        | 20070516095030                                        |
      | kind                           | Advance Directive                                     |
      | text.uid                       | urn:va:document:ABCD:3:3853                           |
      | text.summary                   | DocumentText{uid='urn:va:document:ABCD:3:3853'}       |
      | text.clinicians.uid            | urn:va:user:ABCD:10000000049                          |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | text.clinicians.name           | LABTECH,FIFTYNINE                                     |
      | text.clinicians.displayName    | Labtech,Fiftynine                                     |
      | text.clinicians.role           | AU                                                    |
      | text.clinicians.uid            | urn:va:user:ABCD:10000000049                          |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | text.clinicians.name           | LABTECH,FIFTYNINE                                     |
      | text.clinicians.displayName    | Labtech,Fiftynine                                     |
      | text.clinicians.role           | S                                                     |
      | text.clinicians.signedDateTime | 20070516095030                                        |
      | text.clinicians.signature      | CONTAINS FIFTYNINE LABTECH                            |
      | text.clinicians.uid            | urn:va:user:ABCD:10000000049                          |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | text.clinicians.name           | LABTECH,FIFTYNINE                                     |
      | text.clinicians.displayName    | Labtech,Fiftynine                                     |
      | text.clinicians.role           | ES                                                    |
      | text.clinicians.uid            | urn:va:user:ABCD:10000000049                          |
      | text.clinicians.summary        | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | text.clinicians.name           | MG                                                    |
      | text.clinicians.displayName    | Mg                                                    |
      | text.clinicians.role           | E                                                     |
      | text.content                   | CONTAINS  VistA Imaging - Scanned Document            |
      | text.dateTime                  | 200705160950                                          |
      | text.status                    | COMPLETED                                             |
      | codes                          | EMPTY                                                 |
      | facilityCode                   | 561                                                   |
      | facilityName                   | New Jersey HCS                                              |
      | localId                        | 3853                                                  |
      | encounterUid                   | urn:va:visit:ABCD:3:5670                              |
      | encounterName                  | 20 MINUTE May 16, 2007                                |
      | referenceDateTime              | 200705160950                                          |
      | documentTypeCode               | D                                                     |
      | documentTypeName               | Advance Directive                                     |
      | documentClass                  | PROGRESS NOTES                                        |
      | localTitle                     | ADVANCE DIRECTIVE COMPLETED                           |
      | statusDisplayName              | Completed                                             |
      | clinicians.uid                 | urn:va:user:ABCD:10000000049                          |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | clinicians.name                | LABTECH,FIFTYNINE                                     |
      | clinicians.displayName         | Labtech,Fiftynine                                     |
      | clinicians.role                | AU                                                    |
      | clinicians.uid                 | urn:va:user:ABCD:10000000049                          |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | clinicians.name                | LABTECH,FIFTYNINE                                     |
      | clinicians.displayName         | Labtech,Fiftynine                                     |
      | clinicians.role                | S                                                     |
      | clinicians.signedDateTime      | 20070516095030                                        |
      | clinicians.signature           | CONTAINS FIFTYNINE LABTECH                            |
      | clinicians.uid                 | urn:va:user:ABCD:10000000049                          |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | clinicians.name                | LABTECH,FIFTYNINE                                     |
      | clinicians.displayName         | Labtech,Fiftynine                                     |
      | clinicians.role                | ES                                                    |
      | clinicians.uid                 | urn:va:user:ABCD:10000000049                          |
      | clinicians.summary             | DocumentClinician{uid='urn:va:user:ABCD:10000000049'} |
      | clinicians.name                | MG                                                    |
      | clinicians.displayName         | Mg                                                    |
      | clinicians.role                | E                                                     |
      | status                         | COMPLETED                                             |
      | documentDefUid                 | urn:va:doc-def:ABCD:1632                              |
      
 	 	 	  
@f108_8_create_mock_cds_educations 
Scenario: Client can request educations from multiple VistAs in VPR format
	Given a patient with "educations" in multiple VistAs
	When the client requests educations for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                        |
      | encounterName | PRIMARY CARE Apr 06, 2000    |
      | encounterUid  | urn:va:visit:ABCD:418:2041   |
      | entered       | 200004061400                 |
      | facilityCode  | 561                          |
      | facilityName  | New Jersey HCS                     |
      | localId       | 43                           |
      | locationName  | PRIMARY CARE                 |
      | locationUid   | urn:va:location:ABCD:32      |
      | name          | SMOKING CESSATION            |
      | uid           | urn:va:education:ABCD:418:43 |
  	  
 	
@f108_9_create_mock_cds_exams 
Scenario: Client can request exams from multiple VistAs in VPR format
	Given a patient with "exams" in multiple VistAs
	When the client requests exams for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                                      |
      | encounterName | CONTAINS 19 LINDA                          |
      | encounterUid  | urn:va:visit:ABCD:34:1075                  |
      | entered       | 199801150800                               |
      | facilityCode  | 561                                        |
      | facilityName  | New Jersey HCS                                   |
      | localId       | 2                                          |
      | locationName  | CONTAINS 19 LINDA                          |
      | locationUid   | urn:va:location:ABCD:169                   |
      | name          | NECK EXAM                                  |
      | result        | NORMAL                                     |
      | uid           | urn:va:exam:ABCD:34:2                      |
  	  
 	 	 	  
@f108_10_create_mock_cds_factors 
Scenario: Client can request factors from multiple VistAs in VPR format
	Given a patient with "factors" in multiple VistAs
	When the client requests factors for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                              |
      | categoryName  | DEPRESSION SCREENING               |
      | categoryUid   | urn:va:factor-category:500077      |
      | display       | true                               |
      | encounterName | AUDIOLOGY Feb 26, 2002             |
      | encounterUid  | urn:va:visit:ABCD:777:2895         |
      | entered       | 20020226160307                     |
      | facilityCode  | 561                                |
      | facilityName  | New Jersey HCS                           |
      | kind          | Health Factor                      |
      | localId       | 32                                 |
      | locationName  | AUDIOLOGY                          |
      | locationUid   | urn:va:location:ABCD:64            |
      | name          | REFUSAL TO COMPLETE SCREENING TOOL |
      | summary       | REFUSAL TO COMPLETE SCREENING TOOL |
      | uid           | urn:va:factor:ABCD:777:32          |
  	  

@f108_11_create_mock_cds_images 
Scenario: Client can request images from multiple VistAs in VPR format
	Given a patient with "images" in multiple VistAs
	When the client requests images for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                  | value                                   |
      | case                   | 45                                      |
      | category               | RA                                      |
      | dateTime               | 199702261300                            |
      | diagnosis.code         | NORMAL                                  |
      | diagnosis.primary      | true                                    |
      | encounterName          | RADIOLOGY MAIN FLOOR Feb 26, 1997       |
      | encounterUid           | urn:va:visit:ABCD:379:308               |
      | facilityCode           | 561                                     |
      | facilityName           | New Jersey HCS                                |
      | hasImages              | false                                   |
      | imageLocation          | RADIOLOGY MAIN FLOOR                    |
      | imagingTypeUid         | urn:va:imaging-Type:GENERAL RADIOLOGY   |
      | kind                   | Imaging                                 |
      | localId                | 7029773.8699-1                          |
      | locationName           | RADIOLOGY MAIN FLOOR                    |
      | locationUid            | urn:va:location:ABCD:40                 |
      | name                   | ANKLE 2 VIEWS                           |
      | providers.providerName | WARDCLERK,SIXTYTHREE                    |
      | providers.providerUid  | urn:va:user:ABCD:11273                  |
      | results.localTitle     | ANKLE 2 VIEWS                           |
      | results.uid            | urn:va:document:ABCD:379:7029773.8699-1 |
      | statusName             | COMPLETE                                |
      | summary                | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS  |
      | typeName               | RADIOLOGIC EXAMINATION, ANKLE; 2 VIEWS  |
      | uid                    | urn:va:image:ABCD:379:7029773.8699-1    |
      | verified               | true                                    |
	  
 	 	 	  
@f108_12_create_mock_cds_immunizations 
Scenario: Client can request immunizations from multiple VistAs in VPR format
	Given a patient with "immunizations" in multiple VistAs
	When the client requests immunization for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                | value                      |
      | administeredDateTime | 20000404105506             |
      | contraindicated      | false                      |
      | cptCode              | urn:cpt:90732              |
      | cptName              | PNEUMOCOCCAL VACCINE       |
      | encounterName        | AUDIOLOGY Apr 04, 2000     |
      | encounterUid         | urn:va:visit:ABCD:229:1975 |
      | facilityCode         | 561                        |
      | facilityName         | New Jersey HCS                   |
      | localId              | 44                         |
      | locationName         | AUDIOLOGY                  |
      | locationUid          | urn:va:location:ABCD:64    |
      | name                 | PNEUMOCOCCAL               |
      | performerName        | WARDCLERK,SIXTYEIGHT       |
      | performerUid         | urn:va:user:ABCD:11278     |
      | summary              | PNEUMOCOCCAL               |

 
@f108_13_create_mock_cds_mentalhealth 
Scenario: Client can request mentalhealth from multiple VistAs in VPR format
	Given a patient with "mentalhealth" in multiple VistAs
	When the client requests mentalhealth for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                | value                 |
      | administeredDateTime | 19901017              |
      | displayName          | 93                    |
      | facilityCode         | 561                   |
      | facilityName         | New Jersey HCS              |
      | isCopyright          | false                 |
      | localId              | 39;1;93;1;2901017     |
      | name                 | HX2                   |
      | providerName         | RESIDENT,NEW          |
      | providerUid          | urn:va:user:ABCD:1000 |
      
 	  
@f108_14_create_mock_cds_orders @cdst1
Scenario: Client can request orders from multiple VistAs in VPR format
	Given a patient with "orders" in multiple VistAs
	When the client requests order results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field        | value                                |
      | content      | CONTAINS IRON                        |
      | displayGroup | LAB                                  |
      | entered      | 19970930092508                       |
      | facilityCode | 561                                  |
      | facilityName | New Jersey HCS                             |
      | localId      | 7141.1                               |
      | locationName | CENTRAL OFFICE                       |
      | locationUid  | urn:va:location:ABCD:48              |
      | providerName | PROVIDER,ONE                         |
      | providerUid  | urn:va:user:ABCD:983                 |
      | service      | LR                                   |
      | start        | 199709300925                         |
      | statusCode   | urn:va:order-status:comp             |
      | statusName   | COMPLETE                             |
      | statusVuid   | urn:va:vuid:4501088                  |
      | stop         | 199710221456                         |
      | uid          | urn:va:order:ABCD:92:7141.1          |
  	  

@f108_15_create_mock_cds_pointofvisits 
Scenario: Client can request pointofvisits from multiple VistAs in VPR format
	Given a patient with "pointofvisits" in multiple VistAs
	When the client requests pointofvisits for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                                   |
      | encounterName | CONTAINS CECELIA                        |
      | encounterUid  | urn:va:visit:ABCD:85:927                |
      | entered       | 199712010800                            |
      | facilityCode  | 561                                     |
      | facilityName  | New Jersey HCS                                |
      | icdCode       | urn:icd:721.2                           |
      | localId       | 158                                     |
      | locationName  | CONTAINS CECELIA                        |
      | locationUid   | urn:va:location:ABCD:273                |
      | name          | THORACIC SPONDYLOSIS WITHOUT MYELOPATHY |
      | type          | P                                       |
      | uid           | urn:va:pov:ABCD:85:158                  |

 	 	  
@f108_16_create_mock_cds_problems 
Scenario: Client can request problems from multiple VistAs in VPR format
	Given a patient with "problems" in multiple VistAs
	When the client requests problem lists for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                  | value                                                |
      | acuityCode             | urn:va:prob-acuity:a                                 |
      | acuityName             | acute                                                |
      | comments.comment       | SHERIDAN PROBLEM                                     |
      | comments.entered       | 19960514                                             |
      | comments.enteredByCode | urn:va:user:ABCD:755                                 |
      | comments.enteredByName | PROGRAMMER,TWENTY                                    |
      | entered                | 19960514                                             |
      | facilityCode           | 561                                                  |
      | facilityName           | New Jersey HCS                                             |
      | icdCode                | urn:icd:411.1                                        |
      | icdName                | INTERMED CORONARY SYND                               |
      | localId                | 58                                                   |
      | onset                  | 19960315                                             |
      | problemText            | Occasional, uncontrolled chest pain (ICD-9-CM 411.1) |
      | providerName           | PROGRAMMER,TWENTY                                    |
      | providerUid            | urn:va:user:ABCD:755                                 |
      | removed                | false                                                |
      | service                | MEDICINE                                             |
      | serviceConnected       | false                                                |
      | statusCode             | urn:sct:55561003                                     |
      | statusName             | ACTIVE                                               |
      | uid                    | urn:va:problem:ABCD:17:58                            |
      | unverified             | false                                                |
      | updated                | 19960514                                             |

 	 	  
@f108_17_create_mock_cds_procedures 
Scenario: Client can request procedures from multiple VistAs in VPR format
	Given a patient with "procedures" in multiple VistAs
	When the client requests procedure results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field          | value                                  |
      | category       | CP                                     |
      | dateTime       | 199811190800                           |
      | facilityCode   | 561                                    |
      | facilityName   | New Jersey HCS                               |
      | interpretation | NORMAL                                 |
      | kind           | Procedure                              |
      | localId        | 50;MCAR(699,                           |
      | name           | LAPARASCOPY                            |
      | statusName     | COMPLETE                               |
      | uid            | urn:va:procedure:ABCD:226:50;MCAR(699, |

  	   	 	  
@f108_18_create_mock_cds_skins 
Scenario: Client can request skins from multiple VistAs in VPR format
	Given a patient with "skins" in multiple VistAs
	When the client requests skin results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field         | value                     |
      | encounterName | 0May 19, 1997             |
      | encounterUid  | urn:va:visit:ABCD:262:386 |
      | entered       | 199705190800              |
      | facilityCode  | 561                       |
      | facilityName  | New Jersey HCS                  |
      | localId       | 1                         |
      | name          | PPD                       |
      | reading       | 10                        |
      | result        | NEGATIVE                  |
      | uid           | urn:va:skin:ABCD:262:1    |
  	  
 	 	  
@f108_19_create_mock_cds_surgeries 
Scenario: Client can request surgeries from multiple VistAs in VPR format
	Given a patient with "surgeries" in multiple VistAs
	When the client requests surgery results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                  | value                                 |
      | category               | SR                                    |
      | dateTime               | 200612080730                          |
      | facilityCode           | 561                                   |
      | facilityName           | New Jersey HCS                              |
      | kind                   | Surgery                               |
      | localId                | 10016                                 |
      | providers.providerName | PROVIDER,ONE                          |
      | providers.providerUid  | urn:va:user:ABCD:983                  |
      | results.localTitle     | OPERATION REPORT                      |
      | results.uid            | urn:va:document:ABCD:8:3563           |
      | results.localTitle     | NURSE INTRAOPERATIVE REPORT           |
      | results.uid            | urn:va:document:ABCD:8:3532           |
      | results.localTitle     | ANESTHESIA REPORT                     |
      | results.uid            | urn:va:document:ABCD:8:3531           |
      | statusName             | COMPLETED                             |
      | summary                | LEFT INGUINAL HERNIA REPAIR WITH MESH |
      | typeName               | LEFT INGUINAL HERNIA REPAIR WITH MESH |
      | uid                    | urn:va:surgery:ABCD:8:10016           |


@f108_20_create_mock_cds_visits 
Scenario: Client can request visits from multiple VistAs in VPR format
	Given a patient with "visits" in multiple VistAs
	When the client requests visit results for the patient "11016V630869" in VPR format
	Then a successful response is returned 
 	And the VPR results contain:    
      | field                  | value                        |
      | categoryCode           | urn:va:encounter-category:AD |
      | categoryName           | Admission                    |
      | current                | true                         |
      | dateTime               | 199411301200                 |
      | facilityCode           | 561                          |
      | facilityName           | New Jersey HCS                     |
      | localId                | H2767                        |
      | locationName           | GEN MED                      |
      | locationUid            | urn:va:location:ABCD:9       |
      | patientClassCode       | urn:va:patient-class:IMP     |
      | patientClassName       | Inpatient                    |
      | providers.providerName | WARDCLERK,FIFTYFOUR          |
      | providers.providerUid  | urn:va:user:ABCD:11247       |
      | providers.role         | A                            |
      | providers.primary      | true                         |
      | providers.providerName | WARDCLERK,FIFTYFOUR          |
      | providers.providerUid  | urn:va:user:ABCD:11247       |
      | providers.role         | P                            |
      | reasonName             | CHEST PAINS                  |
      | service                | MEDICINE                     |
      | specialty              | GENERAL MEDICINE             |
      | stay.arrivalDateTime   | 199411301200                 |
      | typeName               | HOSPITALIZATION              |
 	  


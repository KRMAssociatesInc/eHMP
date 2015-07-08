@US1121 @unstable
Feature: create a web application to be used as point-of-care healthcare application. Sync Patient and Return Patient Domains. REST endpoints for the supported domain types are provided. Each request will be forwarded to JDS, with a patient synchronization process kicked off, if necessary.

@US1121_sync
Scenario: Client requests to sync a patient through the RDK API
	Given a patient with pid "5000000217V519385" has not been synced through the RDK API
	When the client requests that the patient with pid "5000000217V519385" be synced through RDK API
	Then a created response is returned
	And the patient with pid "5000000217V519385" is synced through the RDK API within 30 seconds
	
@US1121_sync_badpid 
Scenario: Client requests to sync a patient with a bad pid through the RDK API
	When the client requests that the patient with pid "BADPID" be synced through RDK API
	Then a non-found response is returned

@US1121_clear 
Scenario: Client requests to clear a patient through the RDK API
	Given a patient with pid "5000000217V519385" has been synced through the RDK API
	When the client requests that the patient with pid "5000000217V519385" be cleared through the RDK API
	Then a successful response is returned
	And the patient with pid "5000000217V519385" is cleared throught the RDK API within 30 seconds
	
@US1121_clear_badpid 
Scenario: Client requests to clear a patient with a bad pid through the RDK API
	When the client requests that the patient with pid "BADPID" be cleared through the RDK API
	Then a non-found response is returned

@US1121_request_synced_data 
Scenario: Client requests domain data for a synced patient
	Given a patient with pid "5000000217V519385" has been synced through the RDK API
	When the client requests allergies for the patient "5000000217V519385" in RDK format 
	Then a successful response is returned
	And the VPR results contain                                                       
      | field             | panorama_value                 |
      | entered           | 201401071706                   |
      | summary           | CHOCOLATE                      |

@US1121_request_unsynced_data 
Scenario: Client requests domain data for an unsynced patient
	Given a patient with pid "5000000217V519385" has not been synced through the RDK API
	When the client requests allergies for the patient "5000000217V519385" in RDK format 
	Then a successful response is returned
	And the VPR results contain                                                       
      | field             | panorama_value                 |
      | entered           | 201401071706                   |
      | summary           | CHOCOLATE                      |
      
@US1121_inpatient_meds 
Scenario: Client requests inpatient meds in VPR format from RDK API
    Given a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests medications for the patient "10110V004877" in RDK format 
	Then a successful response is returned
	And the client receives 294 VPR VistA result(s)
	And the VPR results contain
    | field                           | panorama_value     |
    # I could find the following values in FileMan
      | uid                 | CONTAINS urn:va:med:9E7A:8   |
      | summary             | CONTAINS TAB,EC (PENDING)    |
      | pid                 | 9E7A;8                       |
      | productFormName     | TAB,EC                       |
      | overallStart        | 199607091400                 |
      | overallStop         | 199607150000                 |
      | stopped             | 199607150000                 |
      | vaType              | I                            |
      | vaStatus            | PENDING                      |
      | orders.orderUid     | urn:va:order:9E7A:8:8145     |
      | orders.ordered      | 199607091428                 |
      | orders.providerUid  | urn:va:user:9E7A:923         |
      | orders.providerName | PROGRAMMER,TWENTYEIGHT       |
      | kind                | Medication, Inpatient        |
      | name                | BISACODYL/TANNIC ACID TAB,EC |
      | uidHref             | CONTAINS /patientrecord|
	#NOT SURE WHERE THESE VALUES ARE COMING FROM
      | facilityCode        | 515.6                        |
      | facilityName        | TROY                         |
      | localId             | IS_SET                       |
      | sig                 | CONTAINS Give:               |
      | medStatus           | urn:sct:73425007             |
      | medStatusName       | not active                   |
      | medType             | urn:sct:105903003            |
      | supply              | false                        |
      | orders.summary      | MedicationOrder{uid='null'}  |
      | IMO                 | false                        |

@US1121_clinical_doc 
Scenario: Client requests clinical notes in VPR format from RDK
	Given a patient with pid "5000000009V082878" has been synced through the RDK API
	When the client requests clinical notes for the patient "5000000009V082878" in RDK format 
	Then a successful response is returned
	And the client receives 2 VPR VistA result(s)
    And the VPR results contain                                          
      | field                | panorama_value                         |
      | uid                  | CONTAINS urn:va:document:9E7A:100125   |
      | summary              | ADMISSION REVIEW - NURSING             |
      | pid                  | 9E7A;100125                            |
      | signer               | PROVIDER,ONE                           |
      | signedDateTime       | 20030428000604                         |
      | kind                 | Progress Note                          |
      | text.clinicians.role | S                                      |
      | text.content         | CONTAINS DATE/TIME: APR 27, 2003 20:53 |
      | documentTypeCode     | PN                                     |
      | documentTypeName     | Progress Note                          |
      | documentClass        | PROGRESS NOTES                         |
      
@US1121_ap 
Scenario: Client requests anatomic pathology in VPR format from RDK
	Given a patient with pid "9E7A;230" has been synced through the RDK API
	When the client requests anatomic pathology for the patient "9E7A;230" in RDK format 
	Then a successful response is returned
	And the client receives 4 VPR VistA result(s)
    And the VPR results contain                                          
      | field         | panorama_value                   |
      | uid           | CONTAINS urn:va:lab:9E7A:230:CY; |
      | summary       | SPUTUM                           |
      | pid           | 9E7A;230                         |
      | localId       | CONTAINS CY;                     |
      | facilityCode  | 500                              |
      | facilityName  | CAMP MASTER                      |
      | groupName     | CY 94 3                          |
      | categoryCode  | urn:va:lab-category:CY           |
      | categoryName  | Pathology                        |
      | observed      | 19940411                         |
      | resulted      | 19940411                         |
      | specimen      | SPUTUM                           |
      | abnormal      | false                            |
      | kind          | Pathology                        |
      | qualifiedName | SPUTUM                           |
      | statusCode    | urn:va:lab-status:completed      |
      | organizerType | accession                        |
    And the VPR results contain                                          
      | field         | panorama_value                  |
      | uid           | CONTAINS urn:va:lab:9E7A:230:SP |
      | summary       | PROSTATE CHIPS                  |
      | pid           | 9E7A;230                        |
      | localId       | CONTAINS SP;                    |
      | facilityCode  | 500                             |
      | facilityName  | CAMP MASTER                     |
      | groupName     | SP 94 5                         |
      | categoryCode  | urn:va:lab-category:SP          |
      | categoryName  | Surgical Pathology              |
      | observed      | 19940410                        |
      | resulted      | 19940411                        |
      | specimen      | PROSTATE CHIPS                  |
      | abnormal      | false                           |
      | kind          | Surgical Pathology              |
      | qualifiedName | PROSTATE CHIPS                  |
      | statusCode    | urn:va:lab-status:completed     |
      | organizerType | accession                       |

@US1121_radiology 
Scenario: Client requests radiology in VPR format from RDK
	Given a patient with pid "9E7A;230" has been synced through the RDK API
	When the client requests radiology for the patient "9E7A;230" in RDK format 
	Then a successful response is returned
	And the client receives 5 VPR VistA result(s)
    And the VPR results contain                                          
      | field             | panorama_value                              |
     # VERIFIED BY LOOKING AT CPRS ( COULDN'T FIND IN FILEMAN )
      | uid                  | CONTAINS urn:va:image:9E7A:230           |
      | summary              | RADIOLOGIC EXAMINATION, WRIST; 2 VIEWS   |
      | pid                  | 9E7A;230                                 |
      | kind                 | Imaging                                  |
	|diagnosis.code        |MINOR ABNORMALITY                         |
	|diagnosis.primary     | true                                     |
          
@US1121_allergies @broken_remote
Scenario: Client requests allergies in VPR format from RDK
	Given a patient with pid "5000000217V519385" has been synced through the RDK API
	When the client requests allergies for the patient "5000000217V519385" in RDK format 
	Then a successful response is returned
	And the client receives 3 VPR VistA result(s)
    And the VPR results contain                                                       
      | field             | panorama_value                 |
      | entered           | 201401071706                   |
      | summary           | CHOCOLATE                      |
      | products.vuid     | urn:va:vuid:4636681            |
      | products.name     | CHOCOLATE                      |
      | reactions.name    | ANXIETY                        |
      | reactions.vuid    | urn:va:vuid:4637050            |
      | severity		  | IS_NOT_SET			     |
      # UNSURE WHAT VALUES SHOULD BE
      | uid               | CONTAINS urn:va:allergy:9E7A:100716: |
      | pid               | 9E7A;100716                         |
      | facilityCode      | 500                            |
      | facilityName      | CAMP MASTER                    |
      | localId           | IS_SET                         |
      | verified          | IS_SET                         |
      | historical        | true                           |
      | kind              | Allergy/Adverse Reaction       |
      | reference         | 3;GMRD(120.82,                 |
      | products.summary  | AllergyProduct{uid='null'}     |     
      | reactions.summary | AllergyReaction{uid='null'}    |     
      | originatorName    | LORD,BRIAN                     |
      | verifierName      | <auto-verified>                |
      | mechanism         | ALLERGY                        |
      | typeName          | DRUG, FOOD                     |
   And the VPR results contain                                                       
      | field             | panorama_value                 |
      | summary           | PEANUT BUTTER FLAVOR (FLAVORING AGENT)                      |
      | facilityCode      | DOD                            |

       
Scenario: Client requests vitals in VPR format from RDK
	Given a patient with pid "9E7A;100022" has been synced through the RDK API
	When the client requests vitals for the patient "9E7A;100022" in RDK format 
	Then a successful response is returned
	And the client receives 8 VPR VistA result(s)
    And the VPR results contain    
      | field         | panorama_value                 |
      | typeName      | TEMPERATURE                    |
      | typeCode      | urn:va:vuid:4500638            |
      | facilityCode  | 998                            |
      | facilityName  | ABILENE (CAA)                  |
      | observed      | 201312101432                   |
      | resulted      | IS_SET                         |
      | low           | 95                             |
      | high          | 102                            |
      | result        | 98.6                           |
       # UNSURE WHAT VALUES SHOULD BE
      | uid           | CONTAINS urn:va:vital:9E7A:100022: |
      | summary       | TEMPERATURE 98.6 F             |
      | localId       | IS_SET                         |
      | locationName  | PRIMARY CARE                   |
      | kind          | Vital Sign                     |
      | displayName   | T                              |
      | units         | F                              |
      | metricResult  | 37.0                           |
      | metricUnits   | C                              |
      | qualifiedName | TEMPERATURE                    |
      | locationUid   | urn:va:location:9E7A:32        | 
      | uidHref       | CONTAINS /patientrecord/uid?pid=9E7A%3B100022&uid=urn%3Ava%3Av  |

@US1121_demographics 
Scenario: Client requests demographics in VPR format from RDK API
    Given a patient with pid "5000000217V519385" has been synced through the RDK API
	When the client requests demographics for the patient "5000000217V519385" in RDK format 
	Then a successful response is returned
	And the VPR results contain
      | field                           | panorama_value      |
      | displayName                     | Eight,Inpatient     |
      | serviceConnected                | false               |
      | veteran.serviceConnectedPercent | IS_NOT_SET          |
      | sensitive                       | false               |
      | religionCode                    | IS_NOT_SET          |
      | religionName                    | IS_NOT_SET          |
      | familyName                      | EIGHT               |
      | ssn                             | *****0808           |
      | address.line1                   | Any Street          |
      | address.line2                   | IS_NOT_SET          |
      | address.line3                   | IS_NOT_SET          |
      | address.city                    | Any Town            |
      | address.zip                     | IS_NOT_SET          |
      | address.state                   | IS_NOT_SET          |
      | birthDate                       | 19450309            |
      | givenNames                      | INPATIENT           |
      | genderCode                      | urn:va:pat-gender:M |
      | genderName                      | Male                |
      | icn                             | 5000000217V519385   |
      | localId                         | IS_SET              |
      | veteran.lrdfn                   | IS_NOT_SET          |
      | telecoms.telecom                | IS_NOT_SET          |
      | telecoms.usageCode              | IS_NOT_SET          |
      | telecoms.usageName              | IS_NOT_SET          |
      | telecoms.telecom                | IS_NOT_SET          |
      | telecoms.usageCode              | IS_NOT_SET          |
      | telecoms.usageName              | IS_NOT_SET          |
      # UNSURE WHAT VALUES SHOULD BE
      | briefId                         | E0808               |
      | exposure.name                   | No                  |
      | exposure.uid                    | urn:va:sw-asia:N    |
      #| facility.localPatientId         | IS_SET              |
      | fullName                        | EIGHT,INPATIENT     |
      | last4                           | 0808                |
      | last5                           | E0808               |
      | pid                             | 9E7A;100716         |
      | syncErrorCount                  | IS_SET              |
      | uid                             | IS_SET              |
      # remove following 2 lines, there are instances when it is acceptable for these fields to not be set
      #| domainUpdated                   | IS_SET              |
      #| lastUpdated                     | IS_SET              |
      | exposure.name                   | No                  |
      | exposure.uid                    | urn:va:sw-asia:N    |
      # according to wiki, this value should be at location 27.02, but this patient did not have a 27.02 location, so not sure where these values are coming from
      | facility.code                   | 500                 |
      | facility.homeSite               | false               |
      | facility.name                   | CAMP MASTER         |
      | facility.systemId               | 9E7A                |

@US1121_consults
Scenario: Client requests consults in VPR format from RDK API
    Given a patient with pid "10107V395912" has been synced through the RDK API
	When the client requests consults for the patient "10107V395912" in RDK format 
	Then a successful response is returned
	And the client receives 6 VPR VistA result(s)
	And the VPR results contain
      | field            | panorama_value                   |
      | uid              | IS_SET                           |
      | summary          | AUDIOLOGY OUTPATIENT Cons        |
      | pid              | 9E7A;253                         |
      | kind             | Consult                          |
      | localId          | IS_SET                           |
      | facilityCode     | 500                              |   
      | facilityName     | CAMP MASTER                      |
      | typeName         | AUDIOLOGY OUTPATIENT Cons        |
      | dateTime         | 20040401225417                   |
      | consultProcedure | Consult                          |
      | service          | AUDIOLOGY OUTPATIENT             |
      | orderUid         | IS_SET                           |
      | providerUid      | IS_SET                           |
      | providerName     | PATHOLOGY,ONE                    |
      | statusName       | COMPLETE                         |
      | orderName        | AUDIOLOGY OUTPATIENT             |
      


@US1121_outpatient_meds 
Scenario: Client requests outpatient meds in VPR format from RDK API
    Given a patient with pid "9E7A;71" has been synced through the RDK API
	When the client requests medications for the patient "9E7A;71" in RDK format 
	Then a successful response is returned
	# FILEMAN HAS 59, where are the missing 19
	And the client receives 40 VPR VistA result(s)
	And the VPR results contain
    | field                           | panorama_value                                      |
    # I could find the following values in FileMan
      | uid                         | CONTAINS urn:va:med:9E7A:71                           |
      | summary                     | CONTAINS DIGOXIN (LANOXIN) 0.125MG TAB (DISCONTINUED) |
      | pid                         | 9E7A;71                                               |
      | productFormName             | TAB                                                   |
      | overallStart                | 19990701                                              |
      | overallStop                 | 19990706                                              |
      | stopped                     | 199908190936                                          |
      | vaType                      | O                                                     |
      | vaStatus                    | DISCONTINUED                                          |
      | products.ingredientCodeName | DIGOXIN                                               |
      | products.ingredientName     | DIGOXIN TAB                                           |
      | products.drugClassCode      | urn:vadc:CV050                                        |
      | products.suppliedName       | DIGOXIN (LANOXIN) 0.125MG TAB                         |
      | products.strength           | 0.125 MG                                              |
      | orders.orderUid             | urn:va:order:9E7A:71:10259                            |
      | orders.prescriptionId       | 300409                                                |
      | orders.ordered              | 19990701                                              |
      | orders.providerUid          | urn:va:user:9E7A:10958                                |
      | orders.providerName         | WARDCLERK,FIFTYTHREE                                  |
      | orders.pharmacistUid        | urn:va:user:9E7A:923                                  |
      | orders.pharmacistName       | PROGRAMMER,TWENTYEIGHT                                |
      | orders.quantityOrdered      | 3                                                     |
      | orders.daysSupply           | 3                                                     |
      | orders.fillsAllowed         | 0                                                     |
      | orders.fillsRemaining       | 0                                                     |
      | orders.successor            | urn:va:med:9E7A:71:10375                              |
      | fills.dispenseDate          | 19990701                                              |
      | lastFilled                  | 19990701                                              |
      | qualifiedName               | DIGOXIN TAB                                           |
      | kind                        | Medication, Outpatient                                |
      | name                        | DIGOXIN TAB                                           |
      | type                        | Prescription                                          |
	#NOT SURE WHERE THESE VALUES ARE COMING FROM
      | facilityCode                | 500                                                   |
      | facilityName                | CAMP MASTER                                           |
      | localId                     | IS_SET                                                |
      | sig                         | TAKE ONE EVERY DAY                                    |
      | medStatus                   | urn:sct:73425007                                      |
      | medStatusName               | not active                                            |
      | medType                     | urn:sct:73639000                                      |
      | supply                      | false                                                 |
      | products.summary            | MedicationProduct{uid='null'}                         |
      | products.ingredientCode     | urn:va:vuid:4018047                                   |
      | products.drugClassName      | DIGITALIS GLYCOSIDES                                  |
      | products.ingredientRole     | urn:sct:410942007                                     |
      | products.suppliedCode       | urn:va:vuid:4015935                                   |
      | products.ingredientRXNCode  | urn:rxnorm:3407                                       |
      | orders.summary              | MedicationOrder{uid='null'}                           |
      | orders.fillCost             | 0.033                                                 |
      | fills.summary               | MedicationFill{uid='null'}                            |
      | fills.quantityDispensed     | 3                                                     |
      | fills.routing               | W                                                     |
      | rxncodes                    | CONTAINS 4018047                                      |
      | fills.daysSupplyDispensed   | 3                                                     |
      | IMO                         | false                                                 |


@US1121_labs 
Scenario: Client requests labs in VPR format from RDK API
    Given a patient with pid "10104V248233" has been synced through the RDK API
	When the client requests labs for the patient "10104V248233" in RDK format 
	Then a successful response is returned
	And the client receives 370 VPR VistA result(s)
	And the VPR results contain
	# chem labs
      | field        | panorama_value                      |
      | uid          | CONTAINS urn:va:lab:9E7A:229:CH;    |
      | summary      | HDL (SERUM) 58 MG/DL                |
      | pid          | 9E7A;229                            |
      | localId      | IS_SET                              |
      | facilityCode | 500                                 |
      | facilityName | CAMP MASTER                         |
      | groupName    | CH 0323 2440                        |
      | groupUid     | CONTAINS urn:va:accession:9E7A:229: |
      | categoryCode | urn:va:lab-category:CH              |
      | categoryName | Laboratory                          |
      | observed     | 201003051200                        |
      | resulted     | 201003231255                        |
      | specimen     | SERUM                               |
      | typeCode     | urn:va:ien:60:244:72                |
      | typeName     | HDL                                 |
      | displayName  | HDL                                 |
      | result       | 58                                  |
      | units        | MG/DL                               |
      | low          | 40                                  |
      | high         | 60                                  |
      | abnormal     | false                               |
@US1121_orders 
Scenario: Client requests orders in VPR format from RDK API
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests orders for the patient "10108V420871" in RDK format 
	Then a successful response is returned
	And the client receives 392 VPR VistA result(s)
	And the VPR results contain
      | field               | panorama_value                          |
      # I could find the following values in FileMan
      | uid                 | CONTAINS urn:va:order:9E7A:3            |
      | summary             | CONTAINS HDL BLOOD   SERUM WC LB #17433 |
      | pid                 | 9E7A;3                                  |
      | localId             | IS_SET                                  |
      | name                | HDL                                     |
      | oiCode              | urn:va:oi:357                           |
      | oiName              | HDL                                     |
      | content             | CONTAINS HDL BLOOD   SERUM WC LB #17433 |
      | entered             | 20100323125510                          |
      | start               | 201003051200                            |
      | stop                | 201003231255                            |
      | displayGroup        | CH                                      |
      | statusCode          | urn:va:order-status:comp                |
      | statusName          | COMPLETE                                |
      | statusVuid          | urn:va:vuid:4501088                     |
      | providerUid         | urn:va:user:9E7A:20364                  |
      | providerName        | LABTECH,SEVENTEEN                       |
      | providerDisplayName | Labtech,Seventeen                       |
      | service             | LR                                      |
      | kind                | Laboratory                              |
      | locationUid         | urn:va:location:9E7A:23                 |
      | results.uid         | CONTAINS urn:va:lab:9E7A:3:CH;          |
      # I'm not sure where these values came from 
      | oiPackageRef        | 244;99LRT                               |
      | facilityCode        | 500                                     |
      | facilityName        | CAMP MASTER                             |
      | locationName        | GENERAL MEDICINE                        |
      

@US1121_immunizations 
Scenario: Client requests the immunizations in VPR format from RDK API
    Given a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests immunizations for the patient "10110V004877" in RDK format 
	Then a successful response is returned
	And the client receives 4 VPR VistA result(s)
	And the VPR results contain
      | field                | value                         |
      | uid                  | CONTAINS urn:va:immunization:9E7A:8 |
      #| summary              | MEASLES,MUMPS,RUBELLA (MMR)  |
      | pid                  | 9E7A;8                        |
      | name                 | MEASLES,MUMPS,RUBELLA (MMR)   |
      | localId              | IS_SET                        |
      | administeredDateTime | 19950718091835                |
      | contraindicated      | false                         |
      | seriesName           | BOOSTER                       |
      | reactionName         | NONE                          |
      | cptName              | MMR VACCINE SC                |
      | encounterUid         | urn:va:visit:9E7A:8:1797      |
      | kind                 | Immunization                  |
      | seriesCode           | urn:va:series:9E7A:8:BOOSTER  |
	#NOT SURE WHERE THESE VALUES ARE COMING FROM
      | facilityCode         | 500                           |
      | facilityName         | CAMP MASTER                   |
      | cptCode              | urn:cpt:90707                 |
      | reactionCode         | urn:va:reaction:9E7A:8:0      |
      | locationUid          | IS_NOT_SET                    |
      | locationName         | IS_NOT_SET                    |
      | encounterName        | 00                            |

	


@US1121_problemlist 
Scenario: Client requests the problem list in VPR format from RDK API
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests problem list for the patient "10108V420871" in RDK format 
	Then a successful response is returned
	#FILEMAN LISTS 6, WHY AM I MISSING ONE
	And the client receives 10 VPR VistA result(s)
	And the VPR results contain
	|field| value|
      | uid                 | CONTAINS urn:va:problem:9E7A:3                             |
      | summary             | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | pid                 | 9E7A;3                                                     |
      | facilityCode        | 500                                                        |
      | facilityName        | CAMP MASTER                                                |
      | locationName        | PRIMARY CARE                                               |
      | locationDisplayName | Primary Care                                               |
      | providerName        | VEHU,EIGHT                                                 |
      | providerDisplayName | Vehu,Eight                                                 |
      | problemText         | Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00) |
      | icdCode             | urn:icd:250.00                                             |
      | icdName             | DIABETES MELLI W/O COMP TYP II                             |
      | statusName          | ACTIVE                                                     |
      | statusDisplayName   | Active                                                     |
      | acuityCode          | urn:va:prob-acuity:c                                       |
      | acuityName          | chronic                                                    |
      | entered             | 20000508                                                   |
      | updated             | 20040330                                                   |
      | onset               | 19980502                                                   |
      | serviceConnected    | false                                                      |
      | icdGroup            | 250                                                        |
      | kind                | Problem                                                    |
	#NOT SURE WHERE THESE VALUES ARE COMING FROM
      | localId             | IS_SET                                                     |
      | statusCode          | urn:sct:55561003                                           |
      | unverified          | false                                                      |
      | removed             | false                                                      |
      | providerUid         | urn:va:user:9E7A:20010                                     |
      | locationUid         | urn:va:location:9E7A:32                                    |

@US1121_dischargesummary 
Scenario: Client requests discharge summary in VPR format from RDK
    Given a patient with pid "10108V420871" has been synced through the RDK API
	When the client requests discharge summary for the patient "10108V420871" in RDK format 
	Then a successful response is returned
	And the VPR results contain
	| field                | value                           |
      | uid                  | CONTAINS urn:va:document:9E7A:3 |
      | summary              | Discharge Summary               |
      | pid                  | 9E7A;3                          |
      | signer               | VEHU,EIGHT                      |
      | signedDateTime       | 20040331090512                  |
      | urgency              | routine                         |
      | entered              | 20040331090458                  |
      | kind                 | Discharge Summary               |
      | text.uid             | CONTAINS urn:va:document:9E7A:3 |
      | text.clinicians.uid  | urn:va:user:9E7A:20010          |
      | text.clinicians.role | EC                              |
      | text.content         | CONTAINS ADMISSION              |

	
	

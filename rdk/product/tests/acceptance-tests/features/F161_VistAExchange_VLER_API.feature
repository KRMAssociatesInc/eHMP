@F161_VLER_FHIR @vxsync @patient
Feature: F161 - VistA Exchange - VLER API

#The purpose of this feature is to establish an interface between eHMP and VLER that allows Transition of Care (TOC) data to be passed from eHMP to VLER. VLER calls the VPR API, creates the CCDA and successfully submits it to the ONC test harness and passes the test

@F161_1_fhir_vler_api @unstable @fhir @10107V395912
Scenario: For a patient a collection of data is made successfully
	Given a patient with "data" in multiple VistAs
	And a patient with pid "10107V395912" has been synced through the RDK API
	When the client requests data for the patient "10107V395912" in VPR format in encounter "urn:va:visit:9E7A:253:6491"
	Then a successful response is returned
	And the results contain
		#Header
		| name                                             | value                                        |
		| header.patient.address.city                      | Any Town                                     |
		| header.patient.address.line1                     | Any Street                                   |
		| header.patient.address.state                     | WV                                           |
		| header.patient.address.use                       | H                                            |
		| header.patient.address.zip                       | 99998                                   |
		| header.patient.alias.fullName                    | P7                                           |
		| header.patient.birthDate                         | 19350407                                     |
		| header.patient.briefId                           | S0007                                        |
		| header.patient.contact.name                      | VETERAN,BROTHER                              |
		| header.patient.contact.summary                   | VETERAN,BROTHER                              |
		| header.patient.contact.typeCode                  | urn:va:pat-contact:NOK                       |
		| header.patient.contact.typeName                  | Next of Kin                                  |
		| header.patient.cwadf                             | CAD                                          |
		| header.patient.disability.disPercent             | 10                                           |
		| header.patient.disability.name                   | HEMORRHOIDS                                  |
		| header.patient.disability.serviceConnected       | true                                         |
		| header.patient.disability.summary                | PatientDisability{uid=''}                |
		| header.patient.disability.disPercent             | 0                                            |
		| header.patient.disability.name                   | INGUINAL HERNIA                              |
		| header.patient.disability.serviceConnected       | true                                         |
		| header.patient.disability.summary                | PatientDisability{uid=''}                |
		| header.patient.disability.disPercent             | 20                                           |
		| header.patient.disability.name                   | GASTRIC ULCER                                |
		| header.patient.disability.serviceConnected       | true                                         |
		| header.patient.disability.summary                | PatientDisability{uid=''}                |
		| header.patient.disability.disPercent             | 10                                           |
		| header.patient.disability.name                   | VITAMIN DEFICIENCY                           |
		| header.patient.disability.serviceConnected       | true                                         |
		| header.patient.disability.summary                | PatientDisability{uid=''}                |
		| header.patient.displayName                       | Seven,Patient                                |
		#| header.patient.domainUpdated                     | CONTAINS cpts, syncStatuss, povs, educations |
		| header.patient.exposure.name                     | Unknown                                      |
		| header.patient.exposure.uid                      | urn:va:head-neck-cancer:U                    |
		| header.patient.exposure.name                     | No                                           |
		| header.patient.exposure.uid                      | urn:va:sw-asia:N                             |
		| header.patient.exposure.name                     | No                                           |
		| header.patient.exposure.uid                      | urn:va:ionizing-radiation:N                  |
		| header.patient.exposure.name                     | Unknown                                      |
		| header.patient.exposure.uid                      | urn:va:mst:U                                 |
		| header.patient.exposure.name                     | No                                           |
		| header.patient.exposure.uid                      | urn:va:combat-vet:N                          |
		| header.patient.exposure.name                     | No                                           |
		| header.patient.exposure.uid                      | urn:va:agent-orange:N                        |
		| header.patient.facility.code                     | 987                                          |
		| header.patient.facility.homeSite                 | false                                        |
		| header.patient.facility.latestDate               | 20010101                                     |
		| header.patient.facility.name                     | ASPEN (CMM)                                  |
		| header.patient.facility.summary                  | ASPEN (CMM)                                  |
		| header.patient.facility.code                     | 988                                          |
		| header.patient.facility.name                     | BOCA RATON (CEE)                             |
		| header.patient.facility.code                     | 989                                          |
		| header.patient.facility.name                     | PARK CITY  (CII)                             |
		| header.patient.facility.code                     | 990                                          |
		| header.patient.facility.name                     | SOUTH BEND (CKK)                             |
		| header.patient.facility.code                     | 991                                          |
		| header.patient.facility.name                     | JAMESTOWN (CJJ)                              |
		| header.patient.facility.code                     | 992                                          |
		| header.patient.facility.name                     | LAREDO (CHH)                                 |
		| header.patient.facility.code                     | 993                                          |
		| header.patient.facility.name                     | YUMA  (CGG)                                  |
		| header.patient.facility.code                     | 994                                          |
		| header.patient.facility.name                     | LUBBOCK (CDD)                                |
		| header.patient.facility.code                     | 995                                          |
		| header.patient.facility.name                     | CENTRAL CITY (CCC)                           |
		| header.patient.facility.code                     | 996                                          |
		| header.patient.facility.name                     | CHAMPAIGN (CFF)                              |
		| header.patient.facility.code                     | 997                                          |
		| header.patient.facility.name                     | CHARLESTON (CBB)                             |
		| header.patient.facility.code                     | 998                                          |
		| header.patient.facility.name                     | ABILENE (CAA)                                |
		| header.patient.facility.code                     | 999                                          |
		| header.patient.facility.name                     | LYNCHBURG (CLL)                              |
		| header.patient.familyName                        | SEVEN                                        |
		| header.patient.fullName                          | SEVEN,PATIENT                                |
		| header.patient.genderCode                        | urn:va:pat-gender:M                          |
		| header.patient.genderName                        | Male                                         |
		| header.patient.givenNames                        | PATIENT                                      |
		| header.patient.homeFacility.code                 | 998                                          |
		| header.patient.homeFacility.homeSite             | true                                         |
		| header.patient.homeFacility.latestDate           | 20010101                                     |
		| header.patient.homeFacility.name                 | ABILENE (CAA)                                |
		| header.patient.homeFacility.summary              | ABILENE (CAA)                                |
		| header.patient.icn                               | 10107V395912                                 |
		| header.patient.last4                             | 0007                                         |
		| header.patient.last5                             | S0007                                        |
		| header.patient.localId                           | 253                                          |
		| header.patient.lrdfn                             | 394                                          |
		| header.patient.maritalStatusCode                 | urn:va:pat-maritalStatus:U                   |
		| header.patient.maritalStatusName                 | Unknown                                      |
		| header.patient.meanStatus                        | NO LONGER REQUIRED                           |
		| header.patient.pid                               | 9E7A;253                                     |
		| header.patient.religionCode                      | urn:va:pat-religion:29                       |
		| header.patient.religionName                      | UNKNOWN/NO PREFERENCE                        |
		| header.patient.scPercent                         | 0                                            |
		| header.patient.sensitive                         | false                                        |
		| header.patient.serviceConnected                  | true                                         |
		| header.patient.ssn                               | 666000007                                    |
		# Patient summmary is not being used, comment it out.
		#| header.patient.summary                           | CONTAINS 9E7A;253                            |
		#| header.patient.syncErrorCount                    | 0                                            |
		| header.patient.teamInfo.associateProvider.name   | unassigned                                   |
		| header.patient.teamInfo.attendingProvider.name   | unassigned                                   |
		| header.patient.teamInfo.inpatientProvider.name   | unassigned                                   |
		| header.patient.teamInfo.mhCoordinator.name       | unassigned                                   |
		| header.patient.teamInfo.mhCoordinator.mhPosition | unassigned                                   |
		| header.patient.teamInfo.mhCoordinator.mhTeam     | unassigned                                   |
		| header.patient.teamInfo.primaryProvider.name     | unassigned                                   |
		| header.patient.teamInfo.team.name                | unassigned                                   |
		| header.patient.teamInfo.text                     | CONTAINS Assigned                            |
		| header.patient.telecom.use                       | WP                                           |
		| header.patient.telecom.value                     | (222)555-7720                                |
		| header.patient.telecom.use                       | H                                            |
		| header.patient.telecom.value                     | (222)555-8235                                |
		| header.patient.uid                               | urn:va:patient:9E7A:253:253                  |
		| header.patient.veteran                           | true                                         |
		#Problems
		Then in section "problems" the response contains 11 "problem"s
		And the results contain
		| name                                 | value                                         |
		| problems.problem.facilityCode        | 500                                           |
		| problems.problem.facilityName        | CAMP MASTER                                   |
		| problems.problem.locationName        | PRIMARY CARE                                  |
		| problems.problem.providerName        | VEHU,SEVEN                                    |
		| problems.problem.problemText         | CONTAINS Diabetes Mellitus Type II            |
		| problems.problem.icdCode             | urn:icd:250.00                                |
		| problems.problem.icdName             | DIABETES MELLI W/O COMP TYP II                |
		| problems.problem.acuityCode          | urn:va:prob-acuity:c                          |
		| problems.problem.acuityName          | chronic                                       |
		| problems.problem.removed             | false                                         |
		| problems.problem.entered             | 20000508                                      |
		| problems.problem.updated             | 20040331                                      |
		| problems.problem.onset               | 20000404                                      |
		| problems.problem.kind                | Problem                                       |
		| problems.problem.icdGroup            | 250                                           |
		| problems.problem.uid                 | urn:va:problem:9E7A:253:182                   |
		| problems.problem.summary             | CONTAINS unspecified (ICD-9-CM 250.00)        |
		| problems.problem.pid                 | 9E7A;253                                      |
		| problems.problem.localId             | 182                                           |
		| problems.problem.locationDisplayName | Primary Care                                  |
		| problems.problem.providerDisplayName | Vehu,Seven                                    |
		| problems.problem.statusCode          | urn:sct:55561003                              |
		| problems.problem.statusName          | ACTIVE                                        |
		| problems.problem.statusDisplayName   | Active                                        |
		| problems.problem.unverified          | false                                         |
		| problems.problem.serviceConnected    | false                                         |
		| problems.problem.providerUid         | urn:va:user:9E7A:20008                        |
		| problems.problem.locationUid         | urn:va:location:9E7A:32                       |
		| problems.problem.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A |
		| problems.problem.facilityDisplay     | Camp Master                                   |
		| problems.problem.facilityMoniker     | TST1                                          |
		And the results contain
		#Problems
		| problems.problem.facilityCode        | 500                                           |
		| problems.problem.facilityName        | CAMP BEE                                      |
		| problems.problem.service             | MEDICAL                                       |
		| problems.problem.providerName        | VEHU,ONEHUNDRED                               |
		| problems.problem.problemText         | Hypertension (ICD-9-CM 401.9)                 |
		| problems.problem.icdCode             | urn:icd:401.9                                 |
		| problems.problem.icdName             | HYPERTENSION NOS                              |
		| problems.problem.acuityCode          | urn:va:prob-acuity:c                          |
		| problems.problem.acuityName          | chronic                                       |
		| problems.problem.entered             | 20070410                                      |
		| problems.problem.updated             | 20070410                                      |
		| problems.problem.onset               | 20050407                                      |
		| problems.problem.kind                | Problem                                       |
		| problems.problem.icdGroup            | 401                                           |
		| problems.problem.uid                 | urn:va:problem:C877:253:663                   |
		| problems.problem.summary             | Hypertension (ICD-9-CM 401.9)                 |
		| problems.problem.pid                 | C877;253                                      |
		| problems.problem.localId             | 663                                           |
		| problems.problem.providerDisplayName | Vehu,Onehundred                               |
		| problems.problem.statusCode          | urn:sct:55561003                              |
		| problems.problem.statusName          | ACTIVE                                        |
		| problems.problem.statusDisplayName   | Active                                        |
		| problems.problem.serviceConnected    | false                                         |
		| problems.problem.codes.code          | 59621000                                      |
		| problems.problem.codes.system        | http://snomed.info/sct                        |
		| problems.problem.codes.display       | Essential hypertension (disorder)             |
		| problems.problem.providerUid         | urn:va:user:C877:10000000031                  |
		| problems.problem.uidHref             | CONTAINS /resource/patient/record/uid?pid=C877|
		| problems.problem.facilityDisplay     | Camp Bee                                      |
		| problems.problem.facilityMoniker     | TST2                                          |
		Then in section "encounters" the response contains 25 "encounter"s
		And the results contain
		#Encounter
		| name                                     | value                                        |
		| encounters.encounter.current             | false                                        |
		| encounters.encounter.facilityCode        | 500                                          |
		| encounters.encounter.facilityName        | CAMP MASTER                                  |
		| encounters.encounter.patientClassName    | Ambulatory                                   |
		| encounters.encounter.dateTime            | 200807170800                                 |
		| encounters.encounter.service             | MEDICINE                                     |
		| encounters.encounter.stopCodeName        | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.locationUid         | urn:va:location:9E7A:23                      |
		| encounters.encounter.locationName        | GENERAL MEDICINE                             |
		| encounters.encounter.shortLocationName   | GM                                           |
		| encounters.encounter.locationDisplayName | General Medicine                             |
		| encounters.encounter.kind                | Visit                                        |
		| encounters.encounter.uid                 | urn:va:visit:9E7A:253:6491                   |
		| encounters.encounter.summary             | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.pid                 | 9E7A;253                                     |
		| encounters.encounter.localId             | 6491                                         |
		| encounters.encounter.typeName            | GENERAL MEDICINE VISIT                       |
		| encounters.encounter.typeDisplayName     | General Medicine Visit                       |
		| encounters.encounter.patientClassCode    | urn:va:patient-class:AMB                     |
		| encounters.encounter.categoryCode        | urn:va:encounter-category:OV                 |
		| encounters.encounter.categoryName        | Outpatient Visit                             |
		| encounters.encounter.stopCodeUid         | urn:va:stop-code:301                         |
		| encounters.encounter.uidHref             | CONTAINS resource/patient/record/uid?pid=9E7A|
		| encounters.encounter.facilityDisplay     | Camp Master                                  |
		| encounters.encounter.facilityMoniker     | TST1                                         |
		And the results contain
		#Encounter
		| name                                     | value                                        |
		| encounters.encounter.current             | false                                        |
		| encounters.encounter.facilityCode        | 500                                          |
		| encounters.encounter.facilityName        | CAMP BEE                                     |
		| encounters.encounter.patientClassName    | Ambulatory                                   |
		| encounters.encounter.dateTime            | 200807160800                                 |
		| encounters.encounter.service             | MEDICINE                                     |
		| encounters.encounter.stopCodeName        | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.locationUid         | urn:va:location:9E7A:23                      |
		| encounters.encounter.locationName        | GENERAL MEDICINE                             |
		| encounters.encounter.shortLocationName   | GM                                           |
		| encounters.encounter.locationDisplayName | General Medicine                             |
		| encounters.encounter.locationOos         | false                                        |
		| encounters.encounter.kind                | Visit                                        |
		| encounters.encounter.uid                 | urn:va:visit:9E7A:253:6390                   |
		| encounters.encounter.summary             | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.pid                 | 9E7A;253                                     |
		| encounters.encounter.localId             | 6390                                         |
		| encounters.encounter.typeName            | GENERAL MEDICINE VISIT                       |
		| encounters.encounter.typeDisplayName     | General Medicine Visit                       |
		| encounters.encounter.patientClassCode    | urn:va:patient-class:AMB                     |
		| encounters.encounter.categoryCode        | urn:va:encounter-category:OV                 |
		| encounters.encounter.categoryName        | Outpatient Visit                             |
		| encounters.encounter.encounterType       | P                                            |
		| encounters.encounter.stopCodeUid         | urn:va:stop-code:301                         |
		| encounters.encounter.uidHref             | CONTAINS resource/patient/record/uid?pid=9E7A|
		| encounters.encounter.facilityMoniker     | TST1                                         |
		Then in section "encounters" the response contains 2 "document"s
		And the results contain
		#Encounter-document
		| name                                     | value                                         |
		| encounters.document.authorUid            | urn:va:user:9E7A:20012                        |
		| encounters.document.authorDisplayName    | Vehu,Ten                                      |
		| encounters.document.attendingUid         | urn:va:user:9E7A:20012                        |
		| encounters.document.attendingDisplayName | Vehu,Ten                                      |
		| encounters.document.signerUid            | urn:va:user:9E7A:20012                        |
		| encounters.document.signerDisplayName    | Vehu,Ten                                      |
		| encounters.document.signedDateTime       | 20070529123849                                |
		| encounters.document.urgency              | routine                                       |
		| encounters.document.kind                 | Discharge Summary                             |
		| encounters.document.documentDefUid       | urn:va:doc-def:9E7A:1                         |
		| encounters.document.isInterdisciplinary  | false                                         |
		| encounters.document.facilityCode         | 998                                           |
		| encounters.document.facilityName         | ABILENE (CAA)                                 |
		| encounters.document.referenceDateTime    | 20040325191658                                |
		| encounters.document.documentTypeCode     | DS                                            |
		| encounters.document.documentTypeName     | Discharge Summary                             |
		| encounters.document.documentClass        | DISCHARGE SUMMARY                             |
		| encounters.document.localTitle           | Discharge Summary                             |
		# this is deprecated.
		#| encounters.document.documentDefUidVuid   | urn:va:vuid:4693715                           |
		| encounters.document.uid                  | urn:va:document:9E7A:253:3959                 |
		| encounters.document.summary              | Discharge Summary                             |
		| encounters.document.pid                  | 9E7A;253                                      |
		| encounters.document.author               | VEHU,TEN                                      |
		| encounters.document.attending            | VEHU,TEN                                      |
		| encounters.document.signer               | VEHU,TEN                                      |
		| encounters.document.entered              | 20070529123826                                |
		| encounters.document.localId              | 3959                                          |
		| encounters.document.encounterUid         | urn:va:visit:9E7A:253:3312                    |
		| encounters.document.encounterName        | 7A GEN MED Mar 25, 2004                       |
		| encounters.document.status               | COMPLETED                                     |
		| encounters.document.statusDisplayName    | Completed                                     |
		| encounters.document.uidHref              | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| encounters.document.facilityDisplay      | Bay Pines CIO Test                            |
		| encounters.document.facilityMoniker      | BAY                                           |
		Then in section "allergies" the response contains 5 "allergy"s
		And the results contain
		#Allergies
		| name                                  | value                                         |
		| allergies.allergy.facilityCode        | 500                                           |
		| allergies.allergy.facilityName        | CAMP MASTER                                   |
		| allergies.allergy.entered             | 200503172006                                  |
		| allergies.allergy.verified            | 20050317200629                                |
		| allergies.allergy.kind                | Allergy/Adverse Reaction                      |
		| allergies.allergy.originatorName      | VEHU,SEVEN                                    |
		| allergies.allergy.verifierName        | <auto-verified>                               |
		| allergies.allergy.mechanism           | PHARMACOLOGIC                                 |
		| allergies.allergy.uid                 | urn:va:allergy:9E7A:253:750                   |
		| allergies.allergy.summary             | PENICILLIN                                    |
		| allergies.allergy.pid                 | 9E7A;253                                      |
		| allergies.allergy.localId             | 750                                           |
		| allergies.allergy.historical          | true                                          |
		| allergies.allergy.reference           | 125;GMRD(120.82,                              |
		| allergies.allergy.products.name       | PENICILLIN                                    |
		| allergies.allergy.products.vuid       | urn:va:vuid:                                  |
		| allergies.allergy.products.summary    | AllergyProduct{uid=''}                    |
		| allergies.allergy.reactions.name      | ITCHING,WATERING EYES                         |
		| allergies.allergy.reactions.vuid      | urn:va:vuid:                                  |
		| allergies.allergy.reactions.summary   | AllergyReaction{uid=''}                   |
		| allergies.allergy.drugClasses.code    | AM114                                         |
		| allergies.allergy.drugClasses.name    | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS    |
		| allergies.allergy.drugClasses.summary | AllergyDrugClass{uid=''}                  |
		| allergies.allergy.typeName            | DRUG                                          |
		| allergies.allergy.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| allergies.allergy.facilityDisplay     | Camp Master                                   |
		| allergies.allergy.facilityMoniker     | TST1                                          |
		And the results contain
		#Allergies
		| name                                  | value                                         |
		| allergies.allergy.facilityCode        | 500                                           |
		| allergies.allergy.facilityName        | CAMP BEE                                      |
		| allergies.allergy.entered             | 200503172006                                  |
		| allergies.allergy.verified            | 20050317200629                                |
		| allergies.allergy.kind                | Allergy/Adverse Reaction                      |
		| allergies.allergy.originatorName      | VEHU,SEVEN                                    |
		| allergies.allergy.verifierName        | <auto-verified>                               |
		| allergies.allergy.mechanism           | PHARMACOLOGIC                                 |
		| allergies.allergy.uid                 | urn:va:allergy:C877:253:750                   |
		| allergies.allergy.summary             | PENICILLIN                                    |
		| allergies.allergy.pid                 | C877;253                                      |
		| allergies.allergy.localId             | 750                                           |
		| allergies.allergy.historical          | true                                          |
		| allergies.allergy.reference           | 125;GMRD(120.82,                              |
		| allergies.allergy.products.name       | PENICILLIN                                    |
		| allergies.allergy.products.vuid       | urn:va:vuid:                                  |
		| allergies.allergy.products.summary    | AllergyProduct{uid=''}                    |
		| allergies.allergy.reactions.name      | ITCHING,WATERING EYES                         |
		| allergies.allergy.reactions.vuid      | urn:va:vuid:                                  |
		| allergies.allergy.reactions.summary   | AllergyReaction{uid=''}                   |
		| allergies.allergy.drugClasses.code    | AM114                                         |
		| allergies.allergy.drugClasses.name    | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS    |
		| allergies.allergy.drugClasses.summary | AllergyDrugClass{uid=''}                  |
		| allergies.allergy.typeName            | DRUG                                          |
		| allergies.allergy.uidHref             | CONTAINS /resource/patient/record/uid?pid=C877|
		| allergies.allergy.facilityDisplay     | Camp Bee                                      |
		| allergies.allergy.facilityMoniker     | TST1                                          |
		Then in section "medications" the response contains 12 "medication"s
		And the results contain
		#Medication
		| name                                   | value                                 |
		| medications.medication.facilityCode    | 500                                   |
		| medications.medication.facilityName    | CAMP MASTER                           |
		| medications.medication.overallStart    | 20100227                              |
		| medications.medication.overallStop     | 20110228                              |
		| medications.medication.vaType          | O                                     |
		| medications.medication.supply          | false                                 |
		| medications.medication.lastFilled      | 20100227                              |
		| medications.medication.qualifiedName   | METOPROLOL TARTRATE TAB               |
		| medications.medication.units           | MG                                    |
		| medications.medication.kind            | Medication, Outpatient                |
		| medications.medication.uid             | urn:va:med:9E7A:253:27957             |
		| medications.medication.summary         | CONTAINS METOPROLOL TARTRATE 50MG TAB |
		| medications.medication.pid             | 9E7A;253                              |
		| medications.medication.localId         | 403951;O                              |
		| medications.medication.productFormName | TAB                                   |
		| medications.medication.sig             | TAKE ONE TABLET BY MOUTH TWICE A DAY  |
		| medications.medication.stopped         | 20110228                              |
		| medications.medication.medStatus       | urn:sct:392521001                     |
		| medications.medication.medStatusName   | historical                            |
		| medications.medication.medType         | urn:sct:73639000                      |
		| medications.medication.vaStatus        | EXPIRED                               |
		| medications.medication.IMO             | false                                 |
		Then in section "vitalsigns" the response contains 273 "vitalsign"s
		And the results contain
		#VitalSigns
		| name                                          | value                                         |
		| vitalsigns.vitalsign.facilityCode             | 500                                           |
		| vitalsigns.vitalsign.facilityName             | CAMP MASTER                                   |
		| vitalsigns.vitalsign.observed                 | 201003050900                                  |
		| vitalsigns.vitalsign.resulted                 | 20100305105350                                |
		| vitalsigns.vitalsign.locationName             | GENERAL MEDICINE                              |
		| vitalsigns.vitalsign.kind                     | Vital Sign                                    |
		| vitalsigns.vitalsign.displayName              | BP                                            |
		| vitalsigns.vitalsign.result                   | 134/81                                        |
		| vitalsigns.vitalsign.units                    | mm[Hg]                                        |
		| vitalsigns.vitalsign.low                      | 100/60                                        |
		| vitalsigns.vitalsign.high                     | 210/110                                       |
		| vitalsigns.vitalsign.patientGeneratedDataFlag | false                                         |
		| vitalsigns.vitalsign.qualifiedName            | BLOOD PRESSURE                                |
		| vitalsigns.vitalsign.uid                      | urn:va:vital:9E7A:253:23557                   |
		| vitalsigns.vitalsign.summary                  | BLOOD PRESSURE 134/81 mm[Hg]                  |
		| vitalsigns.vitalsign.pid                      | 9E7A;253                                      |
		| vitalsigns.vitalsign.localId                  | 23557                                         |
		| vitalsigns.vitalsign.typeCode                 | urn:va:vuid:4500634                           |
		| vitalsigns.vitalsign.typeName                 | BLOOD PRESSURE                                |
		| vitalsigns.vitalsign.codes.code               | 55284-4                                       |
		| vitalsigns.vitalsign.codes.system             | http://loinc.org                              |
		| vitalsigns.vitalsign.codes.display            | Blood pressure systolic and diastolic         |
		| vitalsigns.vitalsign.locationUid              | urn:va:location:9E7A:23                       |
		| vitalsigns.vitalsign.uidHref                  | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| vitalsigns.vitalsign.facilityDisplay          | Camp Master                                   |
		| vitalsigns.vitalsign.facilityMoniker          | TST1                                          |
		Then in section "procedures" the response contains 100 "procedure"s
		And the results contain
		#Procedures
		| name                                               | value                                                 |
		| procedures.procedure.kind                          | Surgery                                               |
		| procedures.procedure.facilityCode                  | 500                                                   |
		| procedures.procedure.facilityName                  | CAMP MASTER                                           |
		| procedures.procedure.statusName                    | COMPLETED                                             |
		| procedures.procedure.uid                           | urn:va:surgery:9E7A:253:10013                         |
		| procedures.procedure.summary                       | LEFT INGUINAL HERNIA REPAIR WITH MESH                 |
		| procedures.procedure.pid                           | 9E7A;253                                              |
		| procedures.procedure.localId                       | 10013                                                 |
		| procedures.procedure.typeName                      | LEFT INGUINAL HERNIA REPAIR WITH MESH                 |
		| procedures.procedure.dateTime                      | 200612080730                                          |
		| procedures.procedure.category                      | SR                                                    |
		| procedures.procedure.providers.providerName        | PROVIDER,ONE                                          |
		| procedures.procedure.providers.providerDisplayName | Provider,One                                          |
		#| procedures.procedure.providers.summary             | ProcedureProvider{uid=''}                         |
		| procedures.procedure.providers.providerUid         | urn:va:user:9E7A:983                                  |
		| procedures.procedure.providerName                  | PROVIDER,ONE                                          |
		| procedures.procedure.providerDisplayName           | Provider,One                                          |
		| procedures.procedure.results.localTitle            | OPERATION REPORT                                      |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:253:3560                         |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:253:3560'}  |
		| procedures.procedure.results.uidHref               | CONTAINS /resource/patient/record/uid?pid=10107V395912|
		| procedures.procedure.results.localTitle            | NURSE INTRAOPERATIVE REPORT                           |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:253:3523                         |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:253:3523'}  |
		| procedures.procedure.results.uidHref               | CONTAINS /resource/patient/record/uid?pid=10107V395912|
		| procedures.procedure.results.localTitle            | ANESTHESIA REPORT                                     |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:253:3522                         |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:253:3522'}  |
		| procedures.procedure.results.uidHref               | CONTAINS /resource/patient/record/uid?pid=10107V395912|
		| procedures.procedure.uidHref                       | CONTAINS /resource/patient/record/uid?pid=9E7A        |
		| procedures.procedure.facilityDisplay               | Camp Master                                           |
		| procedures.procedure.facilityMoniker               | TST1                                                  |
		Then in section "immunizations" the response contains 3 "immunization"s
		And the results contain
		#Immunization
		| name                                            | value                                          |
		| immunizations.immunization.facilityCode         | 888                                            |
		| immunizations.immunization.facilityName         | FT. LOGAN                                      |
		| immunizations.immunization.administeredDateTime | 200004061200                                   |
		| immunizations.immunization.cptCode              | urn:cpt:90732                                  |
		| immunizations.immunization.cptName              | PNEUMOCOCCAL VACCINE                           |
		| immunizations.immunization.performerUid         | urn:va:user:9E7A:11623                         |
		| immunizations.immunization.encounterUid         | urn:va:visit:9E7A:253:2035                     |
		| immunizations.immunization.kind                 | Immunization                                   |
		| immunizations.immunization.uid                  | urn:va:immunization:9E7A:253:60                |
		| immunizations.immunization.summary              | PNEUMOCOCCAL, UNSPECIFIED FORMULATION          |
		| immunizations.immunization.pid                  | 9E7A;253                                       |
		| immunizations.immunization.localId              | 60                                             |
		| immunizations.immunization.name                 | PNEUMOCOCCAL, UNSPECIFIED FORMULATION          |
		| immunizations.immunization.contraindicated      | false                                          |
		| immunizations.immunization.seriesName           | BOOSTER                                        |
		| immunizations.immunization.codes.code           | 33                                             |
		| immunizations.immunization.codes.system         | urn:oid:2.16.840.1.113883.12.292               |
		| immunizations.immunization.codes.display        | pneumococcal polysaccharide vaccine, 23 valent |
		| immunizations.immunization.performerName        | STUDENT,SEVEN                                  |
		| immunizations.immunization.locationUid          | urn:va:location:9E7A:32                        |
		| immunizations.immunization.seriesCode           | urn:va:series:9E7A:253:BOOSTER                 |
		| immunizations.immunization.locationName         | PRIMARY CARE                                   |
		| immunizations.immunization.encounterName        | PRIMARY CARE Apr 06, 2000                      |
		| immunizations.immunization.uidHref              | CONTAINS /resource/patient/record/uid?pid=9E7A |
		| immunizations.immunization.facilityMoniker      | 888                                            |
		Then in section "results" the response contains 210 "laboratory"s
		And the results contain
		#Immunization
		| name                               | value                                                                      |
		| results.laboratory.facilityCode    | 500                                                                        |
		| results.laboratory.facilityName    | CAMP MASTER                                                                |
		| results.laboratory.groupName       | CH 0323 2445                                                               |
		| results.laboratory.groupUid        | urn:va:accession:9E7A:253:CH;6899693.879999                                |
		| results.laboratory.categoryCode    | urn:va:lab-category:CH                                                     |
		| results.laboratory.categoryName    | Laboratory                                                                 |
		| results.laboratory.observed        | 201003051200                                                               |
		| results.laboratory.resulted        | 201003231255                                                               |
		| results.laboratory.specimen        | SERUM                                                                      |
		| results.laboratory.comment         | CONTAINS Ordering Provider: Seventeen Labtech Report Released Date/Time: M |
		| results.laboratory.typeCode        | urn:va:ien:60:244:72                                                       |
		| results.laboratory.displayName     | HDL                                                                        |
		| results.laboratory.result          | 58                                                                         |
		| results.laboratory.units           | MG/DL                                                                      |
		| results.laboratory.low             | 40                                                                         |
		| results.laboratory.high            | 60                                                                         |
		| results.laboratory.kind            | Laboratory                                                                 |
		| results.laboratory.resultNumber    | 58                                                                         |
		| results.laboratory.abnormal        | false                                                                      |
		| results.laboratory.micro           | false                                                                      |
		| results.laboratory.qualifiedName   | HDL (SERUM)                                                                |
		| results.laboratory.uid             | urn:va:lab:9E7A:253:CH;6899693.879999;80                                   |
		| results.laboratory.summary         | HDL (SERUM) 58 MG/DL                                                       |
		| results.laboratory.pid             | 9E7A;253                                                                   |
		| results.laboratory.localId         | CH;6899693.879999;80                                                       |
		| results.laboratory.typeName        | HDL                                                                        |
		| results.laboratory.statusCode      | urn:va:lab-status:completed                                                |
		| results.laboratory.statusName      | completed                                                                  |
		| results.laboratory.displayOrder    | 3.9                                                                        |
		| results.laboratory.typeId          | 244                                                                        |
		| results.laboratory.uidHref         | CONTAINS /resource/patient/record/uid?pid=9E7A                             |
		| results.laboratory.facilityDisplay | Camp Master                                                                |
		| results.laboratory.facilityMoniker | TST1                                                                       |
		Then in section "assessment" the response contains 25 "encounter"s
		And the results contain
		#assessment
		| name                                     | value                                         |
		| assessment.encounter.current             | false                                         |
		| assessment.encounter.facilityCode        | 500                                           |
		| assessment.encounter.facilityName        | CAMP MASTER                                   |
		| assessment.encounter.patientClassName    | Ambulatory                                    |
		| assessment.encounter.dateTime            | 200807170800                                  |
		| assessment.encounter.service             | MEDICINE                                      |
		| assessment.encounter.stopCodeName        | GENERAL INTERNAL MEDICINE                     |
		| assessment.encounter.locationUid         | urn:va:location:9E7A:23                       |
		| assessment.encounter.locationName        | GENERAL MEDICINE                              |
		| assessment.encounter.shortLocationName   | GM                                            |
		| assessment.encounter.locationDisplayName | General Medicine                              |
		| assessment.encounter.locationOos         | false                                         |
		| assessment.encounter.kind                | Visit                                         |
		| assessment.encounter.uid                 | urn:va:visit:9E7A:253:6491                    |
		| assessment.encounter.summary             | GENERAL INTERNAL MEDICINE                     |
		| assessment.encounter.pid                 | 9E7A;253                                      |
		| assessment.encounter.localId             | 6491                                          |
		| assessment.encounter.typeName            | GENERAL MEDICINE VISIT                        |
		| assessment.encounter.typeDisplayName     | General Medicine Visit                        |
		| assessment.encounter.patientClassCode    | urn:va:patient-class:AMB                      |
		| assessment.encounter.categoryCode        | urn:va:encounter-category:OV                  |
		| assessment.encounter.categoryName        | Outpatient Visit                              |
		| assessment.encounter.stopCodeUid         | urn:va:stop-code:301                          |
		| assessment.encounter.encounterType       | P                                             |
		| assessment.encounter.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| assessment.encounter.facilityDisplay     | Camp Master                                   |
		| assessment.encounter.facilityMoniker     | TST1                                          |

@F161_2_fhir_vler_api @unstable @fhir @10110V004877
Scenario: For a patient a collection of data is made successfully
	Given a patient with "data" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests data for the patient "10110V004877" in VPR format in encounter "urn:va:visit:9E7A:8:6472"
	Then a successful response is returned
	And the results contain
		#Header
		| name                                             | value                                                  |
		| header.patient.address.city                      | Any Town                                               |
		| header.patient.address.line1                     | Any Street                                             |
		| header.patient.address.state                     | WV                                                     |
		| header.patient.address.use                       | H                                                      |
		| header.patient.address.zip                       | 99998                                                  |
		| header.patient.birthDate                         | 19350407                                               |
		| header.patient.briefId                           | T0010                                                  |
		| header.patient.contact.name                      | VETERAN,BROTHER                                        |
		| header.patient.contact.summary                   | VETERAN,BROTHER                                        |
		| header.patient.contact.typeCode                  | urn:va:pat-contact:NOK                                 |
		| header.patient.contact.typeName                  | Next of Kin                                            |
		| header.patient.cwadf                             | WAD                                                    |
		| header.patient.disability.disPercent             | 10                                                     |
		| header.patient.disability.name                   | AUDITORY CANAL DISEASE                                 |
		| header.patient.disability.serviceConnected       | true                                                   |
		| header.patient.disability.summary                | PatientDisability{uid=''}                          |
		| header.patient.disability.disPercent             | 30                                                     |
		| header.patient.disability.name                   | SUPRAVENTRICULAR ARRHYTHMIAS                           |
		| header.patient.disability.serviceConnected       | true                                                   |
		| header.patient.disability.summary                | PatientDisability{uid=''}                          |
		| header.patient.displayName                       | Ten,Patient                                            |
		#| header.patient.domainUpdated                     | CONTAINS vitals, ptfs, cpts, syncStatuss, visits, povs |
		| header.patient.exposure.name                     | Unknown                                                |
		| header.patient.exposure.uid                      | urn:va:head-neck-cancer:U                              |
		| header.patient.exposure.name                     | No                                                     |
		| header.patient.exposure.uid                      | urn:va:sw-asia:N                                       |
		| header.patient.exposure.name                     | No                                                     |
		| header.patient.exposure.uid                      | urn:va:ionizing-radiation:N                            |
		| header.patient.exposure.name                     | Unknown                                                |
		| header.patient.exposure.uid                      | urn:va:mst:U                                           |
		| header.patient.exposure.name                     | No                                                     |
		| header.patient.exposure.uid                      | urn:va:combat-vet:N                                    |
		| header.patient.exposure.name                     | No                                                     |
		| header.patient.exposure.uid                      | urn:va:agent-orange:N                                  |
		| header.patient.facility.code                     | 200DOD                                                 |
		| header.patient.facility.homeSite                 | false                                                  |
		| header.patient.facility.name                     | DEPT. OF DEFENSE                                       |
		| header.patient.facility.summary                  | DEPT. OF DEFENSE                                       |
		| header.patient.facility.code                     | 500                                                    |
		| header.patient.facility.homeSite                 | false                                                  |
		| header.patient.facility.latestDate               | 20140625                                               |
		| header.patient.facility.localPatientId           | 8                                                      |
		| header.patient.facility.name                     | CAMP MASTER                                            |
		| header.patient.facility.summary                  | CAMP MASTER                                            |
		| header.patient.facility.systemId                 | 9E7A                                                   |
		| header.patient.facility.code                     | 987                                                    |
		| header.patient.facility.homeSite                 | false                                                  |
		| header.patient.facility.latestDate               | 20010101                                               |
		| header.patient.facility.name                     | ASPEN (CMM)                                            |
		| header.patient.facility.summary                  | ASPEN (CMM)                                            |
		| header.patient.facility.code                     | 988                                                    |
		| header.patient.facility.name                     | BOCA RATON (CEE)                                       |
		| header.patient.facility.code                     | 989                                                    |
		| header.patient.facility.name                     | PARK CITY  (CII)                                       |
		| header.patient.facility.code                     | 990                                                    |
		| header.patient.facility.name                     | SOUTH BEND (CKK)                                       |
		| header.patient.facility.code                     | 991                                                    |
		| header.patient.facility.name                     | JAMESTOWN (CJJ)                                        |
		| header.patient.facility.code                     | 992                                                    |
		| header.patient.facility.name                     | LAREDO (CHH)                                           |
		| header.patient.facility.code                     | 993                                                    |
		| header.patient.facility.name                     | YUMA  (CGG)                                            |
		| header.patient.facility.code                     | 994                                                    |
		| header.patient.facility.name                     | LUBBOCK (CDD)                                          |
		| header.patient.facility.code                     | 995                                                    |
		| header.patient.facility.name                     | CENTRAL CITY (CCC)                                     |
		| header.patient.facility.code                     | 996                                                    |
		| header.patient.facility.name                     | CHAMPAIGN (CFF)                                        |
		| header.patient.facility.code                     | 997                                                    |
		| header.patient.facility.name                     | CHARLESTON (CBB)                                       |
		| header.patient.facility.code                     | 998                                                    |
		| header.patient.facility.name                     | ABILENE (CAA)                                          |
		| header.patient.facility.code                     | 999                                                    |
		| header.patient.facility.name                     | LYNCHBURG (CLL)                                        |
		| header.patient.familyName                        | TEN                                                    |
		| header.patient.fullName                          | TEN,PATIENT                                            |
		| header.patient.genderCode                        | urn:va:pat-gender:M                                    |
		| header.patient.genderName                        | Male                                                   |
		| header.patient.givenNames                        | PATIENT                                                |
		| header.patient.homeFacility.code                 | 998                                                    |
		| header.patient.homeFacility.homeSite             | true                                                   |
		| header.patient.homeFacility.latestDate           | 20010101                                               |
		| header.patient.homeFacility.name                 | ABILENE (CAA)                                          |
		| header.patient.homeFacility.summary              | ABILENE (CAA)                                          |
		| header.patient.icn                               | 10110V004877                                           |
		| header.patient.insurance.companyName             | HEALTH INSURANCE PLUS                                  |
		#@TODO, this is from VistA, need to investigate the datetime format in 7D
		#| header.patient.insurance.effectiveDate           | 29201010                                               |
		| header.patient.insurance.groupNumber             | 415                                                    |
		| header.patient.insurance.id                      | 8;3;5                                                  |
		| header.patient.insurance.policyHolder            | SELF                                                   |
		| header.patient.insurance.policyType              | TRICARE                                                |
		#| header.patient.insurance.summary                 | HEALTH INSURANCE PLUS (TRICARE)                        |
		| header.patient.insurance.companyName             | PRIVATE INSURANCE CO INC                               |
		| header.patient.insurance.id                      | 8;1;0                                                  |
		#| header.patient.insurance.summary                 | PRIVATE INSURANCE CO INC (null)                        |
		| header.patient.insurance.companyName             | MEDICARE                                               |
		| header.patient.insurance.id                      | 8;2;0                                                  |
		#| header.patient.insurance.summary                 | MEDICARE (null)                                        |
		| header.patient.last4                             | 0010                                                   |
		| header.patient.last5                             | T0010                                                  |
		| header.patient.localId                           | 8                                                      |
		| header.patient.lrdfn                             | 24                                                     |
		| header.patient.maritalStatusCode                 | urn:va:pat-maritalStatus:S                             |
		| header.patient.maritalStatusName                 | Never Married                                          |
		| header.patient.pid                               | 9E7A;8                                                 |
		| header.patient.religionCode                      | urn:va:pat-religion:24                                 |
		| header.patient.religionName                      | PROTESTANT                                             |
		| header.patient.scPercent                         | 20                                                     |
		| header.patient.sensitive                         | false                                                  |
		| header.patient.serviceConnected                  | true                                                   |
		| header.patient.ssn                               | 666000010                                              |
		# Patient summmary is not being used, comment it out.
		#| header.patient.summary                           | CONTAINS 9E7A;8                                        |
		# syncErrorCount is being deprecated.
		#| header.patient.syncErrorCount                    | 0                                                      |
		| header.patient.teamInfo.associateProvider.name   | unassigned                                             |
		| header.patient.teamInfo.attendingProvider.name   | unassigned                                             |
		| header.patient.teamInfo.inpatientProvider.name   | unassigned                                             |
		| header.patient.teamInfo.mhCoordinator.name       | unassigned                                             |
		| header.patient.teamInfo.mhCoordinator.mhPosition | unassigned                                             |
		| header.patient.teamInfo.mhCoordinator.mhTeam     | unassigned                                             |
		| header.patient.teamInfo.primaryProvider.name     | unassigned                                             |
		| header.patient.teamInfo.team.name                | BLUE                                                   |
		| header.patient.teamInfo.text                     | CONTAINS Assigned                                      |
		| header.patient.telecom.use                       | H                                                      |
		| header.patient.telecom.value                     | (222)555-8235                                          |
		| header.patient.telecom.use                       | WP                                                     |
		| header.patient.telecom.value                     | (222)555-7720                                          |
		| header.patient.uid                               | urn:va:patient:9E7A:8:8                                |
		| header.patient.veteran                           | true                                                   |
		Then in section "problems" the response contains 32 "problem"s
		And the results contain
		#Problems
		| name                                 | value                                         |
		| problems.problem.facilityCode        | 500                                           |
		| problems.problem.facilityName        | CAMP MASTER                                   |
		| problems.problem.locationName        | PRIMARY CARE                                  |
		| problems.problem.providerName        | VEHU,TEN                                      |
		| problems.problem.problemText         | CONTAINS Diabetes Mellitus Type II            |
		| problems.problem.icdCode             | urn:icd:250.00                                |
		| problems.problem.icdName             | DIABETES MELLI W/O COMP TYP II                |
		| problems.problem.acuityCode          | urn:va:prob-acuity:c                          |
		| problems.problem.acuityName          | chronic                                       |
		| problems.problem.removed             | false                                         |
		| problems.problem.entered             | 20000508                                      |
		| problems.problem.updated             | 20040331                                      |
		| problems.problem.onset               | 20000221                                      |
		| problems.problem.kind                | Problem                                       |
		| problems.problem.icdGroup            | 250                                           |
		| problems.problem.uid                 | urn:va:problem:9E7A:8:185                     |
		| problems.problem.summary             | CONTAINS unspecified (ICD-9-CM 250.00)        |
		| problems.problem.pid                 | 9E7A;8                                        |
		| problems.problem.localId             | 185                                           |
		| problems.problem.locationDisplayName | Primary Care                                  |
		| problems.problem.providerDisplayName | Vehu,Ten                                      |
		| problems.problem.statusCode          | urn:sct:55561003                              |
		| problems.problem.statusName          | ACTIVE                                        |
		| problems.problem.statusDisplayName   | Active                                        |
		| problems.problem.unverified          | false                                         |
		| problems.problem.serviceConnected    | false                                         |
		| problems.problem.providerUid         | urn:va:user:9E7A:20012                        |
		| problems.problem.locationUid         | urn:va:location:9E7A:32                       |
		| problems.problem.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| problems.problem.facilityDisplay     | Camp Master                                   |
		| problems.problem.facilityMoniker     | TST1                                          |
		And the results contain
		#Problems
		| problems.problem.facilityCode        | 500                                           |
		| problems.problem.facilityName        | CAMP BEE                                      |
		| problems.problem.locationName        | PRIMARY CARE                                  |
		| problems.problem.providerName        | VEHU,TEN                                      |
		| problems.problem.problemText         | CONTAINS Diabetes Mellitus Type II            |
		| problems.problem.icdCode             | urn:icd:250.00                                |
		| problems.problem.icdName             | HYPERTENSION NOS                              |
		| problems.problem.acuityCode          | urn:va:prob-acuity:c                          |
		| problems.problem.acuityName          | chronic                                       |
		| problems.problem.removed             | false                                         |
		| problems.problem.entered             | 20000508                                      |
		| problems.problem.updated             | 20040331                                      |
		| problems.problem.onset               | 20000221                                      |
		| problems.problem.kind                | Problem                                       |
		| problems.problem.icdGroup            | 250                                           |
		| problems.problem.uid                 | urn:va:problem:C877:8:185                     |
		| problems.problem.summary             | CONTAINS Diabetes Mellitus Type II            |
		| problems.problem.pid                 | C877;8                                        |
		| problems.problem.localId             | 185                                           |
		| problems.problem.locationDisplayName | Primary Care                                  |
		| problems.problem.providerDisplayName | Vehu,Ten                                      |
		| problems.problem.statusCode          | urn:sct:55561003                              |
		| problems.problem.statusName          | ACTIVE                                        |
		| problems.problem.statusDisplayName   | Active                                        |
		| problems.problem.serviceConnected    | false                                         |
		| problems.problem.unverified          | false                                         |
		| problems.problem.codes.code          | 59621000                                      |
		| problems.problem.providerUid         | urn:va:user:C877:20012                        |
		| problems.problem.locationUid         | urn:va:location:C877:32                       |
		| problems.problem.uidHref             | CONTAINS /resource/patient/record/uid?pid=C877|
		| problems.problem.facilityDisplay     | Camp Bee                                      |
		| problems.problem.facilityMoniker     | TST2                                          |
		Then in section "encounters" the response contains 25 "encounter"s
		And the results contain
		#Encounter - visit
		| name                                     | value                                        |
		| encounters.encounter.current             | false                                        |
		| encounters.encounter.facilityCode        | 500                                          |
		| encounters.encounter.facilityName        | CAMP MASTER                                  |
		| encounters.encounter.patientClassName    | Ambulatory                                   |
		| encounters.encounter.dateTime            | 200807170800                                 |
		| encounters.encounter.service             | MEDICINE                                     |
		| encounters.encounter.stopCodeName        | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.locationUid         | urn:va:location:9E7A:23                      |
		| encounters.encounter.locationName        | GENERAL MEDICINE                             |
		| encounters.encounter.shortLocationName   | GM                                           |
		| encounters.encounter.locationDisplayName | General Medicine                             |
		| encounters.encounter.kind                | Visit                                        |
		| encounters.encounter.uid                 | urn:va:visit:9E7A:8:6472                     |
		| encounters.encounter.summary             | GENERAL INTERNAL MEDICINE                    |
		| encounters.encounter.pid                 | 9E7A;8                                       |
		| encounters.encounter.localId             | 6472                                         |
		| encounters.encounter.typeName            | GENERAL MEDICINE VISIT                       |
		| encounters.encounter.typeDisplayName     | General Medicine Visit                       |
		| encounters.encounter.patientClassCode    | urn:va:patient-class:AMB                     |
		| encounters.encounter.categoryCode        | urn:va:encounter-category:OV                 |
		| encounters.encounter.categoryName        | Outpatient Visit                             |
		| encounters.encounter.stopCodeUid         | urn:va:stop-code:301                         |
		| encounters.encounter.uidHref             | CONTAINS resource/patient/record/uid?pid=9E7A|
		| encounters.encounter.facilityDisplay     | Camp Master                                  |
		| encounters.encounter.facilityMoniker     | TST1                                         |
		Then in section "encounters" the response contains 2 "document"s
		And the results contain
		#Encounter - document
		| name                                     | value                       |
		| encounters.document.authorUid            | urn:va:user:9E7A:20012      |
		| encounters.document.authorDisplayName    | Vehu,Ten                    |
		| encounters.document.attendingUid         | urn:va:user:9E7A:20012      |
		| encounters.document.attendingDisplayName | Vehu,Ten                    |
		| encounters.document.signerUid            | urn:va:user:9E7A:20012      |
		| encounters.document.signerDisplayName    | Vehu,Ten                    |
		| encounters.document.signedDateTime       | 20070529124057              |
		| encounters.document.urgency              | routine                     |
		| encounters.document.kind                 | Discharge Summary           |
		| encounters.document.documentDefUid       | urn:va:doc-def:9E7A:1       |
		| encounters.document.isInterdisciplinary  | false                       |
		| encounters.document.facilityCode         | 998                         |
		| encounters.document.facilityName         | ABILENE (CAA)               |
		| encounters.document.referenceDateTime    | 20040325191726              |
		| encounters.document.documentTypeCode     | DS                          |
		| encounters.document.documentTypeName     | Discharge Summary           |
		| encounters.document.documentClass        | DISCHARGE SUMMARY           |
		| encounters.document.localTitle           | Discharge Summary           |
		| encounters.document.nationalTitle.name   | DISCHARGE SUMMARY           |
		| encounters.document.nationalTitle.vuid   | urn:va:vuid:4693715         |
		# This is deprecated.
		#| encounters.document.documentDefUidVuid   | urn:va:vuid:4693715         |
		| encounters.document.uid                  | urn:va:document:9E7A:8:3962 |
		| encounters.document.summary              | Discharge Summary           |
		| encounters.document.pid                  | 9E7A;8                      |
		| encounters.document.author               | VEHU,TEN                    |
		| encounters.document.attending            | VEHU,TEN                    |
		| encounters.document.signer               | VEHU,TEN                    |
		| encounters.document.entered              | 20070529124046              |
		Then in section "allergies" the response contains 34 "allergy"s
		And the results contain
		#Allergies
		| name                                  | value                                         |
		| allergies.allergy.facilityCode        | 500                                           |
		| allergies.allergy.facilityName        | CAMP MASTER                                   |
		| allergies.allergy.entered             | 200503172015                                  |
		| allergies.allergy.verified            | 20050317201533                                |
		| allergies.allergy.kind                | Allergy/Adverse Reaction                      |
		| allergies.allergy.originatorName      | VEHU,TEN                                      |
		| allergies.allergy.verifierName        | <auto-verified>                               |
		| allergies.allergy.mechanism           | PHARMACOLOGIC                                 |
		| allergies.allergy.uid                 | urn:va:allergy:9E7A:8:753                     |
		| allergies.allergy.summary             | PENICILLIN                                    |
		| allergies.allergy.pid                 | 9E7A;8                                        |
		| allergies.allergy.localId             | 753                                           |
		| allergies.allergy.historical          | true                                          |
		| allergies.allergy.reference           | 125;GMRD(120.82,                              |
		| allergies.allergy.products.name       | PENICILLIN                                    |
		| allergies.allergy.products.vuid       | urn:va:vuid:                                  |
		| allergies.allergy.products.summary    | AllergyProduct{uid=''}                    |
		| allergies.allergy.reactions.name      | ITCHING,WATERING EYES                         |
		| allergies.allergy.reactions.vuid      | urn:va:vuid:                                  |
		| allergies.allergy.reactions.summary   | AllergyReaction{uid=''}                   |
		| allergies.allergy.drugClasses.code    | AM114                                         |
		| allergies.allergy.drugClasses.name    | PENICILLINS AND BETA-LACTAM ANTIMICROBIALS    |
		| allergies.allergy.drugClasses.summary | AllergyDrugClass{uid=''}                  |
		| allergies.allergy.typeName            | DRUG                                          |
		| allergies.allergy.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| allergies.allergy.facilityDisplay     | Camp Master                                   |
		| allergies.allergy.facilityMoniker     | TST1                                          |
		Then in section "medications" the response contains 29 "medication"s
		And the results contain
		#Medication
		| name                                            | value                                                    |
		| medications.medication.facilityCode             | DOD                                                      |
		| medications.medication.facilityName             | DOD                                                      |
		| medications.medication.overallStart             | 20131024040100                                           |
		| medications.medication.overallStop              | 20131123192900                                           |
		| medications.medication.vaType                   | O                                                        |
		| medications.medication.supply                   | false                                                    |
		| medications.medication.kind                     | Medication, Outpatient                                   |
		| medications.medication.uid                      | urn:va:med:DOD:0000000008:1000001264                     |
		| medications.medication.summary                  | CONTAINS Gabapentin 50mg/mL, (Neurontin), Solution, Oral |
		| medications.medication.pid                      | DOD;0000000008                                           |
		| medications.medication.productFormCode          | 2165346524                                               |
		| medications.medication.productFormName          | Gabapentin 50mg/mL, (Neurontin), Solution, Oral, 5mL     |
		| medications.medication.sig                      | TEASPOONFUL                                              |
		| medications.medication.patientInstruction       | CONTAINS NONE                                            |
		| medications.medication.medStatus                | Active                                                   |
		| medications.medication.medType                  | O                                                        |
		| medications.medication.vaStatus                 | Active                                                   |
		| medications.medication.IMO                      | false                                                    |
		| medications.medication.products.suppliedName    | Gabapentin 50mg/mL, (Neurontin), Solution, Oral, 5mL     |
		| medications.medication.products.summary         | MedicationProduct{uid=''}                            |
		| medications.medication.orders.providerName      | AHLTADTE, ATTEND B                                       |
		| medications.medication.orders.quantityOrdered   | 1                                                        |
		| medications.medication.orders.daysSupply        | 30                                                       |
		| medications.medication.orders.fillsRemaining    | 0                                                        |
		| medications.medication.orders.summary           | MedicationOrder{uid=''}                              |
		| medications.medication.fills.dispenseDate       | 20131024182900                                           |
		| medications.medication.fills.dispensingPharmacy | MAIN PHARMACY                                            |
		| medications.medication.fills.quantityDispensed  | 1                                                        |
		| medications.medication.fills.summary            | MedicationFill{uid=''}                               |
		| medications.medication.codes.code               | 15518112                                                 |
		| medications.medication.codes.system             | DOD_NCID                                                 |
		| medications.medication.name                     | Gabapentin 50mg/mL, (Neurontin), Solution, Oral, 5mL     |
		| medications.medication.uidHref                  | CONTAINS /resource/patient/record/uid?pid=DOD            |
		| medications.medication.facilityDisplay          | DoD                                                      |
		| medications.medication.facilityMoniker          | DOD                                                      |
		Then in section "vitalsigns" the response contains 389 "vitalsign"s
		And the results contain
		#VitalSigns
		| name                                          | value                                         |
		| vitalsigns.vitalsign.facilityCode             | 500                                           |
		| vitalsigns.vitalsign.facilityName             | CAMP MASTER                                   |
		| vitalsigns.vitalsign.observed                 | 201003050900                                  |
		| vitalsigns.vitalsign.resulted                 | 20100305105350                                |
		| vitalsigns.vitalsign.locationName             | GENERAL MEDICINE                              |
		| vitalsigns.vitalsign.kind                     | Vital Sign                                    |
		| vitalsigns.vitalsign.displayName              | BP                                            |
		| vitalsigns.vitalsign.result                   | 134/81                                        |
		| vitalsigns.vitalsign.units                    | mm[Hg]                                        |
		| vitalsigns.vitalsign.low                      | 100/60                                        |
		| vitalsigns.vitalsign.high                     | 210/110                                       |
		| vitalsigns.vitalsign.patientGeneratedDataFlag | false                                         |
		| vitalsigns.vitalsign.qualifiedName            | BLOOD PRESSURE                                |
		| vitalsigns.vitalsign.uid                      | urn:va:vital:9E7A:8:23462                     |
		| vitalsigns.vitalsign.summary                  | BLOOD PRESSURE 134/81 mm[Hg]                  |
		| vitalsigns.vitalsign.pid                      | 9E7A;8                                        |
		| vitalsigns.vitalsign.localId                  | 23462                                         |
		| vitalsigns.vitalsign.typeCode                 | urn:va:vuid:4500634                           |
		| vitalsigns.vitalsign.typeName                 | BLOOD PRESSURE                                |
		| vitalsigns.vitalsign.codes.code               | 55284-4                                       |
		| vitalsigns.vitalsign.codes.system             | http://loinc.org                              |
		| vitalsigns.vitalsign.codes.display            | Blood pressure systolic and diastolic         |
		| vitalsigns.vitalsign.locationUid              | urn:va:location:9E7A:23                       |
		| vitalsigns.vitalsign.uidHref                  | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| vitalsigns.vitalsign.facilityDisplay          | Camp Master                                   |
		| vitalsigns.vitalsign.facilityMoniker          | TST1                                          |
		Then in section "procedures" the response contains 76 "procedure"s
		And the results contain
		#Procedures
		| name                                               | value                                                 |
		| procedures.procedure.kind                          | Surgery                                               |
		| procedures.procedure.facilityCode                  | 500                                                   |
		| procedures.procedure.facilityName                  | CAMP MASTER                                           |
		| procedures.procedure.statusName                    | COMPLETED                                             |
		| procedures.procedure.uid                           | urn:va:surgery:9E7A:8:10016                           |
		| procedures.procedure.summary                       | LEFT INGUINAL HERNIA REPAIR WITH MESH                 |
		| procedures.procedure.pid                           | 9E7A;8                                                |
		| procedures.procedure.localId                       | 10016                                                 |
		| procedures.procedure.typeName                      | LEFT INGUINAL HERNIA REPAIR WITH MESH                 |
		| procedures.procedure.dateTime                      | 200612080730                                          |
		| procedures.procedure.category                      | SR                                                    |
		| procedures.procedure.providers.providerName        | PROVIDER,ONE                                          |
		| procedures.procedure.providers.providerDisplayName | Provider,One                                          |
		| procedures.procedure.providers.summary             | ProcedureProvider{uid=''}                         |
		| procedures.procedure.providers.providerUid         | urn:va:user:9E7A:983                                  |
		| procedures.procedure.providerName                  | PROVIDER,ONE                                          |
		| procedures.procedure.providerDisplayName           | Provider,One                                          |
		| procedures.procedure.results.localTitle            | OPERATION REPORT                                      |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:8:3563                           |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:8:3563'}    |
		# | procedures.procedure.results.uidHref               | CONTAINS /resource/patientrecord/uid?pid=10110V004877 |
		| procedures.procedure.results.localTitle            | NURSE INTRAOPERATIVE REPORT                           |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:8:3532                           |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:8:3532'}    |
		# | procedures.procedure.results.uidHref               | CONTAINS /resource/patientrecord/uid?pid=10110V004877 |
		| procedures.procedure.results.localTitle            | ANESTHESIA REPORT                                     |
		| procedures.procedure.results.uid                   | urn:va:document:9E7A:8:3531                           |
		| procedures.procedure.results.summary               | ProcedureResult{uid='urn:va:document:9E7A:8:3531'}    |
		# | procedures.procedure.results.uidHref               | CONTAINS /resource/patientrecord/uid?pid=10110V004877 |
		| procedures.procedure.uidHref                       | CONTAINS /resource/patient/record/uid?pid=9E7A        |
		| procedures.procedure.facilityDisplay               | Camp Master                                           |
		| procedures.procedure.facilityMoniker               | TST1                                                  |
		Then in section "immunizations" the response contains 43 "immunization"s
		And the results contain
		#Immunization
		| name                                            | value                                          |
		| immunizations.immunization.facilityCode         | 888                                            |
		| immunizations.immunization.facilityName         | FT. LOGAN                                      |
		| immunizations.immunization.administeredDateTime | 20000405112729                                 |
		| immunizations.immunization.cptCode              | urn:cpt:90732                                  |
		| immunizations.immunization.cptName              | PNEUMOCOCCAL VACCINE                           |
		| immunizations.immunization.performerUid         | urn:va:user:9E7A:11620                         |
		| immunizations.immunization.encounterUid         | urn:va:visit:9E7A:8:2005                       |
		| immunizations.immunization.kind                 | Immunization                                   |
		| immunizations.immunization.uid                  | urn:va:immunization:9E7A:8:54                  |
		| immunizations.immunization.summary              | PNEUMOCOCCAL                                   |
		| immunizations.immunization.pid                  | 9E7A;8                                         |
		| immunizations.immunization.localId              | 54                                             |
		| immunizations.immunization.name                 | PNEUMOCOCCAL                                   |
		| immunizations.immunization.contraindicated      | false                                          |
		| immunizations.immunization.codes.code           | 33                                             |
		| immunizations.immunization.codes.system         | urn:oid:2.16.840.1.113883.12.292               |
		| immunizations.immunization.codes.display        | pneumococcal polysaccharide vaccine, 23 valent |
		| immunizations.immunization.performerName        | STUDENT,FOUR                                   |
		| immunizations.immunization.locationUid          | urn:va:location:9E7A:240                       |
		| immunizations.immunization.locationName         | 20 MINUTE                                      |
		| immunizations.immunization.encounterName        | 20 MINUTE Apr 05, 2000                         |
		| immunizations.immunization.uidHref              | CONTAINS /resource/patient/record/uid?pid=9E7A |
		| immunizations.immunization.facilityMoniker      | 888                                            |
		Then in section "results" the response contains 260 "laboratory"s
		And the results contain
		#Resutls - laboratory
		| name                               | value                                         |
		| results.laboratory.facilityCode    | 500                                           |
		| results.laboratory.facilityName    | CAMP MASTER                                   |
		| results.laboratory.groupName       | CH 0323 2426                                  |
		| results.laboratory.groupUid        | urn:va:accession:9E7A:8:CH;6899693.879999     |
		| results.laboratory.categoryCode    | urn:va:lab-category:CH                        |
		| results.laboratory.categoryName    | Laboratory                                    |
		| results.laboratory.observed        | 201003051200                                  |
		| results.laboratory.resulted        | 201003231255                                  |
		| results.laboratory.specimen        | SERUM                                         |
		| results.laboratory.comment         | CONTAINS Ordering Provider: Seventeen Labtech |
		| results.laboratory.typeCode        | urn:va:ien:60:244:72                          |
		| results.laboratory.displayName     | HDL                                           |
		| results.laboratory.result          | 58                                            |
		| results.laboratory.units           | MG/DL                                         |
		| results.laboratory.low             | 40                                            |
		| results.laboratory.high            | 60                                            |
		| results.laboratory.kind            | Laboratory                                    |
		| results.laboratory.resultNumber    | 58                                            |
		| results.laboratory.abnormal        | false                                         |
		| results.laboratory.micro           | false                                         |
		| results.laboratory.qualifiedName   | HDL (SERUM)                                   |
		| results.laboratory.uid             | urn:va:lab:9E7A:8:CH;6899693.879999;80        |
		| results.laboratory.summary         | HDL (SERUM) 58 MG/DL                          |
		| results.laboratory.pid             | 9E7A;8                                        |
		| results.laboratory.localId         | CH;6899693.879999;80                          |
		| results.laboratory.typeName        | HDL                                           |
		| results.laboratory.statusCode      | urn:va:lab-status:completed                   |
		| results.laboratory.statusName      | completed                                     |
		| results.laboratory.displayOrder    | 3.9                                           |
		| results.laboratory.typeId          | 244                                           |
		| results.laboratory.uidHref         | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| results.laboratory.facilityDisplay | Camp Master                                   |
		| results.laboratory.facilityMoniker | TST1                                          |
		Then in section "results" the response contains 2 "imaging"s
		And the results contain
		#Resutls - imaging
		| name                                          | value                                              |
		| results.imaging.kind                          | Radiology                                          |
		| results.imaging.facilityCode                  | DOD                                                |
		| results.imaging.facilityName                  | DOD                                                |
		#| results.imaging.statusName                    | TRANSCRIBED                                        |
		| results.imaging.encounterUid                  | 23564659                                           |
		| results.imaging.hasImages                     | false                                              |
		| results.imaging.imageLocation                 | CONTAINS INTERNAL MEDICINE SEYMOUR JOHNSON AFB, NC |
		| results.imaging.uid                           | urn:va:image:DOD:0000000008:1000001515             |
		#| results.imaging.summary                       | RADIOLOGIC EXAMINATION, CHEST,AP                   |
		| results.imaging.pid                           | DOD;0000000008                                     |
		| results.imaging.localId                       | 07000073                                           |
		#| results.imaging.typeName                      | RADIOLOGIC EXAMINATION, CHEST,AP                   |
		| results.imaging.dateTime                      | 20070621103700                                     |
		| results.imaging.category                      | RA                                                 |
		| results.imaging.reason                        | test                                               |
		| results.imaging.providers.providerName        | 100000059 LARRY, PROVIDER                          |
		#| results.imaging.providers.providerDisplayName | 100000059 LARRY, PROVIDER                          |
		| results.imaging.providers.summary             | ProcedureProvider{uid=''}                      |
		| results.imaging.providerName                  | 100000059 LARRY, PROVIDER                          |
		| results.imaging.providerDisplayName           | 100000059 Larry, Provider                          |
		| results.imaging.results.localTitle            | CHEST,AP                                           |
		| results.imaging.results.report                | CONTAINS Procedure:CHEST,AP 20070621103000         |
		| results.imaging.results.summary               | ProcedureResult{uid=''}                        |
		| results.imaging.name                          | CHEST,AP                                           |
		| results.imaging.locationName                  | CONTAINS INTERNAL MEDICINE SEYMOUR JOHNSON AFB, NC |
		| results.imaging.uidHref                       | CONTAINS /resource/patient/record/uid?pid=DOD      |
		| results.imaging.facilityDisplay               | DoD                                                |
		| results.imaging.facilityMoniker               | DOD                                                |
		Then in section "assessment" the response contains 25 "encounter"s
		And the results contain
		#Assessment
		| name                                     | value                                         |
		| assessment.encounter.current             | false                                         |
		| assessment.encounter.facilityCode        | 500                                           |
		| assessment.encounter.facilityName        | CAMP MASTER                                   |
		| assessment.encounter.patientClassName    | Ambulatory                                    |
		| assessment.encounter.dateTime            | 200807170800                                  |
		| assessment.encounter.service             | MEDICINE                                      |
		| assessment.encounter.stopCodeName        | GENERAL INTERNAL MEDICINE                     |
		| assessment.encounter.locationUid         | urn:va:location:9E7A:23                       |
		| assessment.encounter.locationName        | GENERAL MEDICINE                              |
		| assessment.encounter.shortLocationName   | GM                                            |
		| assessment.encounter.locationDisplayName | General Medicine                              |
		| assessment.encounter.locationOos         | false                                         |
		| assessment.encounter.kind                | Visit                                         |
		| assessment.encounter.uid                 | urn:va:visit:9E7A:8:6472                      |
		| assessment.encounter.summary             | GENERAL INTERNAL MEDICINE                     |
		| assessment.encounter.pid                 | 9E7A;8                                        |
		| assessment.encounter.localId             | 6472                                          |
		| assessment.encounter.typeName            | GENERAL MEDICINE VISIT                        |
		| assessment.encounter.typeDisplayName     | General Medicine Visit                        |
		| assessment.encounter.patientClassCode    | urn:va:patient-class:AMB                      |
		| assessment.encounter.categoryCode        | urn:va:encounter-category:OV                  |
		| assessment.encounter.categoryName        | Outpatient Visit                              |
		| assessment.encounter.stopCodeUid         | urn:va:stop-code:301                          |
		| assessment.encounter.encounterType       | P                                             |
		| assessment.encounter.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| assessment.encounter.facilityDisplay     | Camp Master                                   |
		| assessment.encounter.facilityMoniker     | TST1                                          |

@F161_3_fhir_vler_api @fhir @10104V248233
Scenario: For a patient a collection of data is made successfully
	Given a patient with "data" in multiple VistAs
	And a patient with pid "10104V248233" has been synced through the RDK API
	When the client requests data for the patient "10104V248233" in VPR format in encounter "urn:va:visit:9E7A:229:1462"
	Then a successful response is returned
	Then in section "problems" the response contains 17 "problem"s
	Then in section "encounters" the response contains 0 "encounter"s
	Then in section "encounters" the response contains 0 "document"s
	Then in section "allergies" the response contains 5 "allergy"s
	Then in section "medications" the response contains 43 "medication"s
	Then in section "vitalsigns" the response contains 301 "vitalsign"s
	Then in section "procedures" the response contains 26 "procedure"s
	Then in section "immunizations" the response contains 3 "immunization"s
	Then in section "results" the response contains 1 "imaging"s
	Then in section "results" the response contains 350 "laboratory"s
	Then in section "results" the response contains 0 "document"s
	Then in section "assessment" the response contains 0 "encounter"s
	Then in section "planOfCare" the response contains 0 "encounter"s
	Then in section "planOfCare" the response contains 0 "procedure"s
	Then in section "planOfCare" the response contains 0 "imaging"s
	Then in section "planOfCare" the response contains 6 "order"s

@F161_4_fhir_vler_api @fhir @5123456789V027402
Scenario: Client can break the glass when requesting data in FHIR format for a sensitive patient
	Given a patient with "data" in multiple VistAs
	And a patient with pid "5123456789V027402" has been synced through the RDK API
	When the client requests data for that sensitive patient "5123456789V027402" in encounter "urn:va:visit:9E7A:8:6472"
	Then a permanent redirect response is returned
	When the client breaks glass and repeats a request for data for that patient "5123456789V027402" in encounter "urn:va:visit:9E7A:8:6472"
	Then a successful response is returned
	And the results contain
		| name               | value             |
		| header.patient.icn | 5123456789V027402 |

@F161_5_fhir_vler_api @fhir @10110V004877
Scenario: For a patient a collection of data is made successfully
	Given a patient with "data" in multiple VistAs
	And a patient with pid "10110V004877" has been synced through the RDK API
	When the client requests data for the patient "10110V004877" in VPR format in encounter "urn:va:visit:9E7A:8:1845"
	Then a successful response is returned
	Then in section "planOfCare" the response contains 14 "encounter"s
		And the results contain
		#Assessment
		| name                                     | value                                         |
		| planOfCare.encounter.current             | false                                         |
		| planOfCare.encounter.facilityCode        | 998                                           |
		| planOfCare.encounter.facilityName        | ABILENE (CAA)                                 |
		| planOfCare.encounter.typeCode            | 9                                             |
		| planOfCare.encounter.patientClassName    | Inpatient                                     |
		| planOfCare.encounter.dateTime            | 200004061500                                  |
		| planOfCare.encounter.stopCodeName        | PRIMARY CARE/MEDICINE                         |
		| planOfCare.encounter.appointmentStatus   | INPATIENT                                     |
		| planOfCare.encounter.locationUid         | urn:va:location:9E7A:32                       |
		| planOfCare.encounter.locationName        | PRIMARY CARE                                  |
		| planOfCare.encounter.shortLocationName   | PCM                                           |
		| planOfCare.encounter.locationDisplayName | Primary Care                                  |
		| planOfCare.encounter.kind                | Visit                                         |
		| planOfCare.encounter.uid                 | urn:va:appointment:9E7A:8:A;3000406.15;32     |
		| planOfCare.encounter.summary             | PRIMARY CARE/MEDICINE                         |
		| planOfCare.encounter.pid                 | 9E7A;8                                        |
		| planOfCare.encounter.localId             | A;3000406.15;32                               |
		| planOfCare.encounter.typeName            | REGULAR                                       |
		| planOfCare.encounter.typeDisplayName     | Regular                                       |
		| planOfCare.encounter.patientClassCode    | urn:va:patient-class:IMP                      |
		| planOfCare.encounter.categoryCode        | urn:va:encounter-category:OV                  |
		| planOfCare.encounter.categoryName        | Outpatient Visit                              |
		| planOfCare.encounter.checkOut            | 200203071334                                  |
		| planOfCare.encounter.stopCodeUid         | urn:va:stop-code:323                          |
		| planOfCare.encounter.uidHref             | CONTAINS /resource/patient/record/uid?pid=9E7A|
		| planOfCare.encounter.facilityMoniker     | BAY                                           |
		Then in section "planOfCare" the response contains 50 "order"s
		And the results contain
		#Assessment
		| name                                       | value                                                 |
		| planOfCare.order.facilityCode              | 998                                                   |
		| planOfCare.order.facilityName              | ABILENE (CAA)                                         |
		| planOfCare.order.name                      | CONTAINS KNEE 2 VIEWS                                 |
		| planOfCare.order.oiName                    | CONTAINS KNEE 2 VIEWS                                 |
		| planOfCare.order.oiPackageRef              | 154;99RAP                                             |
		| planOfCare.order.content                   | CONTAINS KNEE 2 VIEWS LEFT                            |
		| planOfCare.order.start                     | 199912150800                                          |
		| planOfCare.order.displayGroup              | RAD                                                   |
		| planOfCare.order.statusName                | ACTIVE                                                |
		| planOfCare.order.providerDisplayName       | Provider,Twohundredninetyseven                        |
		| planOfCare.order.service                   | RA                                                    |
		| planOfCare.order.kind                      | Radiology                                             |
		| planOfCare.order.uid                       | urn:va:order:9E7A:8:11077                             |
		| planOfCare.order.summary                   | CONTAINS KNEE 2 VIEWS LEFT                            |
		| planOfCare.order.pid                       | 9E7A;8                                                |
		| planOfCare.order.localId                   | 11077                                                 |
		| planOfCare.order.locationName              | 5 WEST PSYCH                                          |
		| planOfCare.order.oiCode                    | urn:va:oi:2748                                        |
		| planOfCare.order.entered                   | 199912151008                                          |
		| planOfCare.order.statusCode                | urn:va:order-status:actv                              |
		| planOfCare.order.statusVuid                | urn:va:vuid:4500659                                   |
		| planOfCare.order.providerUid               | urn:va:user:9E7A:11712                                |
		| planOfCare.order.providerName              | PROVIDER,TWOHUNDREDNINETYSEVEN                        |
		| planOfCare.order.locationUid               | urn:va:location:9E7A:66                               |
		| planOfCare.order.results.uid               | urn:va:image:9E7A:8:7008784.8989-1                    |
		| planOfCare.order.results.uidHref           | CONTAINS /resource/patient/record/uid?pid=10110V004877|
		| planOfCare.order.clinicians.name           | PROVIDER,TWOHUNDREDNINETYSEVEN                        |
		| planOfCare.order.clinicians.role           | S                                                     |
		| planOfCare.order.clinicians.signedDateTime | 199912151008                                          |
		| planOfCare.order.clinicians.uid            | urn:va:user:9E7A:11712                                |
		| planOfCare.order.uidHref                   | CONTAINS /resource/patient/record/uid?pid=9E7A        |
		| planOfCare.order.facilityDisplay           | Bay Pines CIO Test                                    |
		| planOfCare.order.facilityMoniker           | BAY                                                   |
		Then in section "results" the response contains 2 "document"s
		And the results contain
		#Resutls - imaging
		| name                                 | value                                 |
		| results.document.authorUid           | urn:va:user:C877:11712                |
		| results.document.authorDisplayName   | Provider,Twohundredninetyseven        |
		| results.document.signerUid           | urn:va:user:C877:11597                |
		| results.document.signerDisplayName   | Provider,Prf                          |
		| results.document.signedDateTime      | 199901051157                          |
		| results.document.kind                | Radiology Report                      |
		| results.document.isInterdisciplinary | false                                 |
		| results.document.facilityCode        | 998                                   |
		| results.document.facilityName        | ABILENE (CAA)                         |
		| results.document.referenceDateTime   | 199812091138                          |
		| results.document.documentTypeCode    | RA                                    |
		| results.document.documentTypeName    | Radiology Report                      |
		| results.document.documentClass       | RADIOLOGY REPORTS                     |
		| results.document.localTitle          | VAS-CAROTID DUPLEX SCAN               |
		| results.document.nationalTitle.name  | RADIOLOGY REPORT                      |
		| results.document.nationalTitle.vuid  | urn:va:vuid:4695068                   |
		| results.document.uid                 | urn:va:document:C877:8:7018790.8861-1 |
		| results.document.summary             | VAS-CAROTID DUPLEX SCAN               |
		| results.document.pid                 | C877;8                                |
		| results.document.author              | PROVIDER,TWOHUNDREDNINETYSEVEN        |
		| results.document.signer              | PROVIDER,PRF                          |


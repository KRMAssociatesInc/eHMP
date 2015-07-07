VPRJTP01 ;SLC/KCM -- Sample patient data for indexes/queries
 ;;1.0;JSON DATA STORE;;Sep 01, 2012
 ;
PTDATA   ; Sample data for patient, urn:va:patient:93EF:-7
DEMOG7 ;;
 ;;{"addresses":[{"city":"Any Town","postalCode":"99998-0071","stateProvince":"WEST VIRGINIAN"}],"aliases":[{"fullName":"P7"}],"briefId":"U7777","dateOfBirth":19350407,"facilities":[{"code":500,"latestDate":20110613,"name":
 ;;"CAMP MASTER","systemId":"93EF"}],"familyName":"UTESTPATIENT","gender":"M","givenNames":"SEVEN","icn":"-777V123777","ssn":"-77777777","uid":"urn:va:patient:93EF:-7:-7","stampTime":"73","pid":"93EF;-7"}
 ;;zzzzz
DEMOG8 ;;
 ;;{"addresses":[{"city":"Any Town","postalCode":"99998-0071","stateProvince":"WEST VIRGINIAN"}],"aliases":[{"fullName":"P8"}],"briefId":"U7777","dateOfBirth":19350408,"facilities":[{"code":500,"latestDate":20110613,"name":
 ;;"CAMP MASTER","systemId":"93EF"}],"familyName":"UTESTPATIENT","gender":"M","givenNames":"EIGHT","icn":"-888V123888","ssn":"-88888888","uid":"urn:va:patient:93EF:-8:-8","stampTime":"8","pid":"93EF;-8"}
 ;;zzzzz
DEMOG9 ;;
 ;;{"uid":"urn:va:patient:93EF:-9:-9","summary":"gov.va.cpe.vpr.Patient{pids=[666223456, 93EF;-9]}","dateOfBirth":"19350407","ssn":"666223456","last4":"3456","last5":"Z3456","familyName":"ZZZRETFIVEFIFTYONE",
 ;;"givenNames":"PATIENT","fullName":"ZZZRETFIVEFIFTYONE,PATIENT","displayName":"Zzzretfivefiftyone,Patient","genderCode":"urn:va:pat-gender:M","genderName":"Male","briefId":"Z3456","sensitive":true,"domainTotals":{},
 ;;"syncErrorCount":0,"religionCode":"urn:va:pat-religion:21","maritalStatuses":[{"code":"urn:va:pat-maritalStatus:M","name":"Married"}],"religionName":"NAZARENE","localId":-9,"stampTime":"9","pid":"93EF;-9"}
 ;;zzzzz
NEWICN9 ;;
 ;;{"uid":"urn:va:patient:93EF:-9:-9","summary":"gov.va.cpe.vpr.Patient{pids=[666223456, 93EF;-9]}","dateOfBirth":"19350407","ssn":"666223456","last4":"3456","last5":"Z3456","familyName":"ZZZRETFIVEFIFTYONE",
 ;;"givenNames":"PATIENT","fullName":"ZZZRETFIVEFIFTYONE,PATIENT","displayName":"Zzzretfivefiftyone,Patient","genderCode":"urn:va:pat-gender:M","genderName":"Male","briefId":"Z3456","sensitive":true,"domainTotals":{},
 ;;"syncErrorCount":0,"religionCode":"urn:va:pat-religion:21","maritalStatuses":[{"code":"urn:va:pat-maritalStatus:M","name":"Married"}],"religionName":"NAZARENE","localId":-9,"icn":"-999V123999","stampTime":"91","pid":"93EF;-9"}
 ;;zzzzz
DIED9 ;;
 ;;{"uid":"urn:va:patient:93EF:-9:-9","summary":"gov.va.cpe.vpr.Patient{pids=[666223456, 93EF;-9]}","dateOfBirth":"19350407","ssn":"666223456","last4":"3456","last5":"Z3456","familyName":"ZZZRETFIVEFIFTYONE",
 ;;"givenNames":"PATIENT","fullName":"ZZZRETFIVEFIFTYONE,PATIENT","displayName":"Zzzretfivefiftyone,Patient","genderCode":"urn:va:pat-gender:M","genderName":"Male","briefId":"Z3456","sensitive":true,"domainTotals":{},
 ;;"syncErrorCount":0,"religionCode":"urn:va:pat-religion:21","maritalStatuses":[{"code":"urn:va:pat-maritalStatus:M","name":"Married"}],"religionName":"UNKNOWN","localId":-9,"dateOfDeath":"20120524","stampTime":"92","pid":"93EF;-9"}
 ;;zzzzz
NUMFAC ;;
 ;;{"addresses":[{"city":"Any Town","postalCode":"99998-0071","stateProvince":"WEST VIRGINIAN"}],"aliases":[{"fullName":"P1"}],"briefId":"U1111","dateOfBirth":19350401,"facilities":[{"code":500,"latestDate":"20110613","name":
 ;;"CAMP MASTER","systemId":"4321"}],"familyName":"UTESTPATIENT","gender":"M","givenNames":"SEVEN","icn":"-111V123111","pid":"4321;-1","ssn":"-111111111","uid":"urn:va:patient:4321:-1:-1","stampTime":"1"}
 ;;zzzzz
D7BAD ;; Data for patient -7 from different site with bad icn
 ;;{"addresses":[{"city":"Another Town","postalCode":"99778-0071","stateProvince":"SOUTH DAKOTA"}],"aliases":[{"fullName":"P7"}],"briefId":"U7777","dateOfBirth":19350407,"facilities":[{"code":700,"latestDate":20120613,"name":
 ;;"CAMP MASTER","systemId":"93CC"}],"familyName":"UTESTPATIENT","gender":"M","givenNames":"SEVEN","icn":"-777v123777","ssn":"-77777777","uid":"urn:va:patient:93CC:-7:-7","stampTime":"71","pid":"93CC;-7"}
 ;;zzzzz
D7GOOD ;; Data for patient -7 from different site with good icn
 ;;{"addresses":[{"city":"Diff Town","postalCode":"99988-0071","stateProvince":"NORTH DAKOTA"}],"aliases":[{"fullName":"P7"}],"briefId":"U7777","dateOfBirth":19350407,"facilities":[{"code":600,"latestDate":20100613,"name":
 ;;"CAMP MASTER","systemId":"93DD"}],"familyName":"UTESTPATIENT","gender":"M","givenNames":"SEVEN","icn":"-777V123777","ssn":"-77777777","uid":"urn:va:patient:93DD:-7:-7","stampTime":"71","pid":"93DD;-7"}
 ;;zzzzz
TIU1 ; Sample TIU document
 ;;{"uid":"urn:va:document:93EF:8:1090","summary":"BLEEDING DISORDER","pid":"3","kind":"","facilityCode":"500D","facilityName":"SLC-FO HMP DEV","localId":"1090","encounterUid":"urn:va:visit:93EF:8:1218","encounterName":"GEN MED
 ;; Jul 18, 1995","referenceDateTime":"19990513131520","documentTypeCode":"CR","documentTypeName":"","documentClass":"PROGRESS NOTES","localTitle":"BLEEDING DISORDER","status":"completed","content":" LOCAL TITLE: BLEEDING
 ;;DISORDER                                  \r\n   DICT DATE: MAY 13, 1999@10:11     ENTRY DATE: MAY 13, 1999@13:15:20      \r\n DICTATED BY: PROVIDER,TWOHUNDRED  EXP COSIGNER:                           \r\n     URGENCY:
 ;;                            STATUS: COMPLETED                     \r\n\r\n nblkve\r\nv kldh\r\nPatient is a 46-year-old male here for evaluation of his bilateral knee \r\nblood tests done, because he was unaware that he
 ;; needed to be fasting.  \r\nStates that he recently started a new job as a Physiology Professor at \r\na local college and was concerned about missing too much work (needed \r\nto take time from work two days in a row o
 ;;f these exams).  \r\n \r\n@###\r\n \r\n/es/ \r\n\r\nSigned: 05/13/1999 13:15","clinicians":[{"uid":"urn:va:user:93EF:11712","summary":"gov.va.cpe.vpr.DocumentClinician@388c3949","role":"A","name":"PROVIDER,TWOHUNDREDNIN
 ;;ETYSEVEN"},{"uid":"urn:va:user:93EF:11712","summary":"gov.va.cpe.vpr.DocumentClinician@7e05049f","role":"S","signedDateTime":"19990513131536","signature":"TWOHUNDREDNINETYSEVEN PROVIDER COMPUTER SPECIALIST","name":"PROV
 ;;IDER,TWOHUNDREDNINETYSEVEN"}],"text":" LOCAL TITLE: BLEEDING DISORDER                                  \r\n   DICT DATE: MAY 13, 1999@10:11     ENTRY DATE: MAY 13, 1999@13:15:20      \r\n DICTATED BY: PROVIDER,TWOHUNDRE
 ;;D  EXP COSIGNER:                           \r\n     URGENCY:                            STATUS: COMPLETED                     \r\n\r\n nblkve\r\nv kldh\r\nPatient is a 46-year-old male here for evaluation of his bilater
 ;;al knee \r\nblood tests done, because he was unaware that he needed to be fasting.  \r\nStates that he recently started a new job as a Physiology Professor at \r\na local college and was concerned about missing too much
 ;; work (needed \r\nto take time from work two days in a row of these exams).  \r\n \r\n@###\r\n \r\n/es/ \r\n\r\nSigned: 05/13/1999 13:15","idx":[],"stampTime":"3"}
 ;;zzzzz
UTST1 ;; sample object for patient 7
 ;;{"uid":"urn:va:utestc:93EF:-7:1","name":"sample object 1","color":"red","serialNumber":123,"rate":3,"clinical":false,"stay":{"started":"201405071034"},"updated":"201406071034","stampTime":"7"}
 ;;zzzzz
UTST2 ;; sample object for patient 7
 ;;{"uid":"urn:va:utestc:93EF:-7:2","name":"sample object 2","color":"yellow","serialNumber":223,"rate",1,"clinical":false,"stay":{"started":"201306071034"},"updated":"201307071034","stampTime":"7"}
 ;;zzzzz
UTST3 ;; sample object for patient 7
 ;;{"uid":"urn:va:utestc:93EF:-7:3","name":"sample object 3","color":"blue","serialNumber":323,"rate":3,"clinical":false,"updated":"201407221034","stampTime":"7"}
 ;;zzzzz
UTST4 ;; sample object for patient 8
 ;;{"uid":"urn:va:utestc:93EF:-8:4","name":"sample object 4","color":"purple","serialNumber":423,"rate":1,"clinical":false,"stay":{"started":"201405211034"},"updated":"201406211034","stampTime":"8"}
 ;;zzzzz
UTST5 ;; sample object for patient 8
 ;;{"uid":"urn:va:utestc:93EF:-8:5","name":"sample object 5","color":"orange","serialNumber":523,"rate":3,"clinical":false,"stay":{"started":"201406012330"},"updated":"201407012330","stampTime":"8"}
 ;;zzzzz

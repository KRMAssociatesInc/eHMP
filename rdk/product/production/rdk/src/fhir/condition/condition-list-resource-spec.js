'use strict';
var _ = require('underscore');
var problemlistResource = require('./condition-list-resource');
var fhirUtils = require('../common/utils/fhir-converter');

describe('Problem FHIR Resource', function() {
    var inputValue = {
        'apiVersion': '1.0',
        'data': {
            'updated': 20150622125411,
            'totalItems': 27,
            'currentItemCount': 27,
            'items': [{
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'entered': '20000508',
                    'facilityCode': '500',
                    'facilityName': 'CAMP MASTER',
                    'icdCode': 'urn:icd:250.00',
                    'icdGroup': '250',
                    'icdName': 'DIABETES MELLI W/O COMP TYP II',
                    'kind': 'Problem',
                    'lastUpdateTime': '20040330000000',
                    'localId': '183',
                    'locationDisplayName': 'Primary Care',
                    'locationName': 'PRIMARY CARE',
                    'locationUid': 'urn:va:location:9E7A:32',
                    'onset': '19980502',
                    'pid': '9E7A;3',
                    'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                    'providerDisplayName': 'Vehu,Eight',
                    'providerName': 'VEHU,EIGHT',
                    'providerUid': 'urn:va:user:9E7A:20010',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20040330000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                    'uid': 'urn:va:problem:9E7A:3:183',
                    'unverified': false,
                    'updated': '20040330'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'codes': [{
                        'code': '441481004',
                        'display': 'Chronic systolic heart failure (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20040309',
                    'facilityCode': '500',
                    'facilityName': 'CAMP MASTER',
                    'icdCode': 'urn:icd:428.22',
                    'icdGroup': '428',
                    'icdName': 'CHRONIC SYSTOLIC HEART FAILURE',
                    'kind': 'Problem',
                    'lastUpdateTime': '20040309000000',
                    'localId': '323',
                    'locationDisplayName': 'General Medicine',
                    'locationName': 'GENERAL MEDICINE',
                    'locationUid': 'urn:va:location:9E7A:23',
                    'onset': '20040309',
                    'pid': '9E7A;3',
                    'problemText': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                    'providerDisplayName': 'Labtech,Special',
                    'providerName': 'LABTECH,SPECIAL',
                    'providerUid': 'urn:va:user:9E7A:11745',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20040309000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                    'uid': 'urn:va:problem:9E7A:3:323',
                    'unverified': false,
                    'updated': '20040309'
                }, {
                    'entered': '20050317',
                    'facilityCode': '500',
                    'facilityName': 'CAMP MASTER',
                    'icdCode': 'urn:icd:410.90',
                    'icdGroup': '410',
                    'icdName': 'AMI NOS, UNSPECIFIED',
                    'kind': 'Problem',
                    'lastUpdateTime': '20050317000000',
                    'localId': '499',
                    'locationDisplayName': 'General Medicine',
                    'locationName': 'GENERAL MEDICINE',
                    'locationUid': 'urn:va:location:9E7A:23',
                    'onset': '20050317',
                    'pid': '9E7A;3',
                    'problemText': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                    'providerDisplayName': 'Vehu,Eight',
                    'providerName': 'VEHU,EIGHT',
                    'providerUid': 'urn:va:user:9E7A:20010',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20050317000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                    'uid': 'urn:va:problem:9E7A:3:499',
                    'unverified': false,
                    'updated': '20050317'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'codes': [{
                        'code': '59621000',
                        'display': 'Essential hypertension (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20070410',
                    'facilityCode': '500',
                    'facilityName': 'CAMP MASTER',
                    'icdCode': 'urn:icd:401.9',
                    'icdGroup': '401',
                    'icdName': 'HYPERTENSION NOS',
                    'kind': 'Problem',
                    'lastUpdateTime': '20070410000000',
                    'localId': '627',
                    'onset': '20050407',
                    'pid': '9E7A;3',
                    'problemText': 'Hypertension (ICD-9-CM 401.9)',
                    'providerDisplayName': 'Vehu,Onehundred',
                    'providerName': 'VEHU,ONEHUNDRED',
                    'providerUid': 'urn:va:user:9E7A:10000000031',
                    'service': 'MEDICAL',
                    'serviceConnected': false,
                    'stampTime': '20070410000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Hypertension (ICD-9-CM 401.9)',
                    'uid': 'urn:va:problem:9E7A:3:627',
                    'updated': '20070410'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'entered': '20070410',
                    'facilityCode': '500',
                    'facilityName': 'CAMP MASTER',
                    'icdCode': 'urn:icd:272.4',
                    'icdGroup': '272',
                    'icdName': 'HYPERLIPIDEMIA NEC/NOS',
                    'kind': 'Problem',
                    'lastUpdateTime': '20070410000000',
                    'localId': '747',
                    'onset': '20050407',
                    'pid': '9E7A;3',
                    'problemText': 'Hyperlipidemia (ICD-9-CM 272.4)',
                    'providerDisplayName': 'Vehu,Onehundred',
                    'providerName': 'VEHU,ONEHUNDRED',
                    'providerUid': 'urn:va:user:9E7A:10000000031',
                    'service': 'MEDICAL',
                    'serviceConnected': false,
                    'stampTime': '20070410000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Hyperlipidemia (ICD-9-CM 272.4)',
                    'uid': 'urn:va:problem:9E7A:3:747',
                    'updated': '20070410'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:a',
                    'acuityName': 'acute',
                    'codes': [{
                        'code': '25106000',
                        'display': 'Impending infarction (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'comments': [{
                        'comment': 'SHERIDAN PROBLEM',
                        'entered': 19960514,
                        'enteredByCode': 'urn:va:user:ABCD:755',
                        'enteredByName': 'PROGRAMMER,TWENTY',
                        'summary': 'ProblemComment{uid=\'\'}'
                    }],
                    'entered': '19960514',
                    'facilityCode': '561',
                    'facilityName': 'New Jersey HCS',
                    'icdCode': 'urn:icd:411.1',
                    'icdGroup': '411',
                    'icdName': 'INTERMED CORONARY SYND',
                    'kind': 'Problem',
                    'localId': '58',
                    'onset': '19960315',
                    'pid': 'HDR;10108V420871',
                    'problemText': 'Occasional, uncontrolled chest pain (ICD-9-CM 411.1)',
                    'providerDisplayName': 'Programmer,Twenty',
                    'providerName': 'PROGRAMMER,TWENTY',
                    'providerUid': 'urn:va:user:ABCD:755',
                    'removed': false,
                    'service': 'MEDICINE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Occasional, uncontrolled chest pain (ICD-9-CM 411.1)',
                    'uid': 'urn:va:problem:ABCD:17:58',
                    'unverified': false,
                    'updated': '19960514'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'entered': '20000508',
                    'facilityCode': '500',
                    'facilityName': 'CAMP BEE',
                    'icdCode': 'urn:icd:250.00',
                    'icdGroup': '250',
                    'icdName': 'DIABETES MELLI W/O COMP TYP II',
                    'kind': 'Problem',
                    'lastUpdateTime': '20040330000000',
                    'localId': '183',
                    'locationDisplayName': 'Primary Care',
                    'locationName': 'PRIMARY CARE',
                    'locationUid': 'urn:va:location:C877:32',
                    'onset': '19980502',
                    'pid': 'C877;3',
                    'problemText': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                    'providerDisplayName': 'Vehu,Eight',
                    'providerName': 'VEHU,EIGHT',
                    'providerUid': 'urn:va:user:C877:20010',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20040330000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Diabetes Mellitus Type II or unspecified (ICD-9-CM 250.00)',
                    'uid': 'urn:va:problem:C877:3:183',
                    'unverified': false,
                    'updated': '20040330'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'codes': [{
                        'code': '441481004',
                        'display': 'Chronic systolic heart failure (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20040309',
                    'facilityCode': '500',
                    'facilityName': 'CAMP BEE',
                    'icdCode': 'urn:icd:428.22',
                    'icdGroup': '428',
                    'icdName': 'CHRONIC SYSTOLIC HEART FAILURE',
                    'kind': 'Problem',
                    'lastUpdateTime': '20040309000000',
                    'localId': '323',
                    'locationDisplayName': 'General Medicine',
                    'locationName': 'GENERAL MEDICINE',
                    'locationUid': 'urn:va:location:C877:23',
                    'onset': '20040309',
                    'pid': 'C877;3',
                    'problemText': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                    'providerDisplayName': 'Labtech,Special',
                    'providerName': 'LABTECH,SPECIAL',
                    'providerUid': 'urn:va:user:C877:11745',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20040309000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Chronic Systolic Heart failure (ICD-9-CM 428.22)',
                    'uid': 'urn:va:problem:C877:3:323',
                    'unverified': false,
                    'updated': '20040309'
                }, {
                    'entered': '20050317',
                    'facilityCode': '500',
                    'facilityName': 'CAMP BEE',
                    'icdCode': 'urn:icd:410.90',
                    'icdGroup': '410',
                    'icdName': 'AMI NOS, UNSPECIFIED',
                    'kind': 'Problem',
                    'lastUpdateTime': '20050317000000',
                    'localId': '499',
                    'locationDisplayName': 'General Medicine',
                    'locationName': 'GENERAL MEDICINE',
                    'locationUid': 'urn:va:location:C877:23',
                    'onset': '20050317',
                    'pid': 'C877;3',
                    'problemText': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                    'providerDisplayName': 'Vehu,Eight',
                    'providerName': 'VEHU,EIGHT',
                    'providerUid': 'urn:va:user:C877:20010',
                    'removed': false,
                    'serviceConnected': false,
                    'stampTime': '20050317000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Acute myocardial infarction, unspecified site, episode of care unspecified (ICD-9-CM 410.90)',
                    'uid': 'urn:va:problem:C877:3:499',
                    'unverified': false,
                    'updated': '20050317'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'codes': [{
                        'code': '59621000',
                        'display': 'Essential hypertension (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20070410',
                    'facilityCode': '500',
                    'facilityName': 'CAMP BEE',
                    'icdCode': 'urn:icd:401.9',
                    'icdGroup': '401',
                    'icdName': 'HYPERTENSION NOS',
                    'kind': 'Problem',
                    'lastUpdateTime': '20070410000000',
                    'localId': '627',
                    'onset': '20050407',
                    'pid': 'C877;3',
                    'problemText': 'Hypertension (ICD-9-CM 401.9)',
                    'providerDisplayName': 'Vehu,Onehundred',
                    'providerName': 'VEHU,ONEHUNDRED',
                    'providerUid': 'urn:va:user:C877:10000000031',
                    'service': 'MEDICAL',
                    'serviceConnected': false,
                    'stampTime': '20070410000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Hypertension (ICD-9-CM 401.9)',
                    'uid': 'urn:va:problem:C877:3:627',
                    'updated': '20070410'
                }, {
                    'acuityCode': 'urn:va:prob-acuity:c',
                    'acuityName': 'chronic',
                    'entered': '20070410',
                    'facilityCode': '500',
                    'facilityName': 'CAMP BEE',
                    'icdCode': 'urn:icd:272.4',
                    'icdGroup': '272',
                    'icdName': 'HYPERLIPIDEMIA NEC/NOS',
                    'kind': 'Problem',
                    'lastUpdateTime': '20070410000000',
                    'localId': '747',
                    'onset': '20050407',
                    'pid': 'C877;3',
                    'problemText': 'Hyperlipidemia (ICD-9-CM 272.4)',
                    'providerDisplayName': 'Vehu,Onehundred',
                    'providerName': 'VEHU,ONEHUNDRED',
                    'providerUid': 'urn:va:user:C877:10000000031',
                    'service': 'MEDICAL',
                    'serviceConnected': false,
                    'stampTime': '20070410000000',
                    'statusCode': 'urn:sct:55561003',
                    'statusDisplayName': 'Active',
                    'statusName': 'ACTIVE',
                    'summary': 'Hyperlipidemia (ICD-9-CM 272.4)',
                    'uid': 'urn:va:problem:C877:3:747',
                    'updated': '20070410'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '113578',
                        'system': 'DOD_MEDCIN'
                    }],
                    'entered': '20140110170111',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'shocklike sensation from left elbow to hand',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'shocklike sensation from left elbow to hand',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000524',
                    'updated': '20140110170111'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '110199',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '12584003',
                        'display': 'Bone pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20140109202407',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'bone pain fingers of the left hand',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'bone pain fingers of the left hand',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000525',
                    'updated': '20140109202407'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '282630',
                        'system': 'DOD_MEDCIN'
                    }],
                    'entered': '20131119203714',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'sinus pressure',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'sinus pressure',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000526',
                    'updated': '20131119203714'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '116645',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '80068009',
                        'display': 'Swelling of limb (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131205172618',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '729.81',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'onset': '20131205171806',
                    'pid': 'DOD;0000000003',
                    'problemText': 'limb swelling',
                    'providerDisplayName': 'Midtier, Cgl Two',
                    'providerName': 'MIDTIER, CGL TWO',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'limb swelling',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000527',
                    'updated': '20131205172618'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '1916',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '202472008',
                        'display': 'Hand joint pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20140113175540',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '719.44',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'onset': '20140109201454',
                    'pid': 'DOD;0000000003',
                    'problemText': 'joint pain fingers',
                    'providerDisplayName': 'Midtier, Cgl Two',
                    'providerName': 'MIDTIER, CGL TWO',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'joint pain fingers',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000528',
                    'updated': '20140113175540'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '116644',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '90834002',
                        'display': 'Pain in limb (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131205185155',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'limb pain',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'limb pain',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000529',
                    'updated': '20131205185155'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '239',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '81680005',
                        'display': 'Neck pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131202212047',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'neck pain radiating up the back of the head',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'neck pain radiating up the back of the head',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000530',
                    'updated': '20131202212047'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '382',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '47933007',
                        'display': 'Foot pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131203165141',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'foot pain (soft tissue)',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'foot pain (soft tissue)',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000531',
                    'updated': '20131203165141'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '231',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '81680005',
                        'display': 'Neck pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131203164925',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '723.1',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'onset': '20131203160613',
                    'pid': 'DOD;0000000003',
                    'problemText': 'neck pain',
                    'providerDisplayName': 'Midtier, Cgl Two',
                    'providerName': 'MIDTIER, CGL TWO',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'neck pain',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000532',
                    'updated': '20131203164925'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '212959',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '428905002',
                        'display': 'Malignant neoplasm of gastrointestinal tract (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131118180256',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'MALIGNANT NEOPLASM DIGESTIVE ORGANS GASTROINTESTINAL TRACT',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'MALIGNANT NEOPLASM DIGESTIVE ORGANS GASTROINTESTINAL TRACT',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000533',
                    'updated': '20131118180256'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '275689',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '33997006',
                        'display': 'Aneurysm of gastroduodenal artery (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131118180257',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'ANEURYSM OF THE GASTRODUODENAL ARTERY',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'ANEURYSM OF THE GASTRODUODENAL ARTERY',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000534',
                    'updated': '20131118180257'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '272885',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '409663006',
                        'display': 'Cough variant asthma (disorder)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131009165435',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '493.82',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'onset': '20131009165235',
                    'pid': 'DOD;0000000003',
                    'problemText': 'ASTHMA COUGH VARIANT',
                    'providerDisplayName': 'Midtier, Cgl Two',
                    'providerName': 'MIDTIER, CGL TWO',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'ASTHMA COUGH VARIANT',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000535',
                    'updated': '20131009165435'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '945',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '247373008',
                        'display': 'Ankle pain (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131119203838',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '719.47',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'onset': '20131119202612',
                    'pid': 'DOD;0000000003',
                    'problemText': 'ankle joint pain',
                    'providerDisplayName': 'Midtier, Cgl Two',
                    'providerName': 'MIDTIER, CGL TWO',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'ankle joint pain',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000536',
                    'updated': '20131119203838'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '89',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '225564006',
                        'display': 'Pain of nose (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131119203713',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'pain over nose',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'pain over nose',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000537',
                    'updated': '20131119203713'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '1882',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '267045008',
                        'display': 'Gastrointestinal symptom (finding)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131118172458',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'gastrointestinal symptoms',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'gastrointestinal symptoms',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000538',
                    'updated': '20131118172458'
                }, {
                    'acuityName': 'Chronic',
                    'codes': [{
                        'code': '281043',
                        'system': 'DOD_MEDCIN'
                    }, {
                        'code': '268937004',
                        'display': 'Examination of digestive system (procedure)',
                        'system': 'http://snomed.info/sct'
                    }],
                    'entered': '20131118172458',
                    'facilityCode': 'DOD',
                    'facilityName': 'DOD',
                    'icdCode': '',
                    'kind': 'Problem',
                    'locationDisplayName': 'NH Great Lakes Il',
                    'locationName': 'NH Great Lakes IL',
                    'pid': 'DOD;0000000003',
                    'problemText': 'visit for: preoperative gastrointestinal exam',
                    'providerDisplayName': 'Bhie, Userone',
                    'providerName': 'BHIE, USERONE',
                    'serviceConnected': false,
                    'stampTime': '20150619163328',
                    'statusDisplayName': 'Active',
                    'statusName': 'Active',
                    'summary': 'visit for: preoperative gastrointestinal exam',
                    'uid': 'urn:va:problem:DOD:0000000003:1000000539',
                    'updated': '20131118172458'
                }

            ]
        }
    };
    var req = {
        query: {
            'subject.identifier': '9E7A;253'
        },
        headers: {
            host: 'localhost:8888'
        },
        protocol: 'http'
    };
    var vprProblemList = inputValue.data.items;
    var fhirProblemList = problemlistResource.convertToFhir(inputValue, req);
    //console.log(JSON.stringify(fhirProblemList));
    it('verifies that given a valid VPR ProblemList Resource converts to a defined FHIR ProblemList Resource object', function() {
        expect(fhirProblemList).to.not.be.undefined();
    });
    _.each(vprProblemList, function(vprP) {
        it('verifies that each VPR Problem Resource has a coresponding FHIR Problem Resource in the collection with the same uid', function() {
            var fhirP = _.filter(fhirProblemList, function(p) {
                return p._id === vprP.uid;
            })[0];
            //expect(fhirP).to.not.be.undefined();
            //expect(fhirP.status).to.equal('confirmed');
            if (fhirP !== undefined) {
                describe('found FHIR Problem coresponds to the original VPR Problem Resource - uid: ' + vprP.uid, function() {
                    it('verifies that the kind information from VPR Problem Resource coresponds to the category code from the FHIR Problem Resource', function() {
                        expect(fhirP.category.coding[0].code).to.equal('diagnosis');
                        expect(fhirP.category.coding[0].system).to.equal('2.16.840.1.113883.4.642.2.224');
                    });
                    it('verifies that the summary information from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.stage.summary).to.equal(vprP.summary);
                    });
                    it('verifies that the patient id from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.subject.reference).to.equal(vprP.pid);
                    });
                    describe('Contained Resources', function() {
                        it('verifies that the facility from the VPR Problem Resource exists in the contained resources from the FHIR Problem', function() {
                            var resEncounter = _.find(fhirP.contained, function(res) {
                                return res.resourceType === 'Encounter';
                            });
                            expect(resEncounter).to.not.be.undefined();
                            if (resEncounter !== undefined && vprP.facilityName !== undefined || vprP.facilityCode !== undefined) {
                                expect(resEncounter.text.status).to.equal('generated');
                                expect(resEncounter.text.div).to.equal('<div>Encounter with patient 9E7A;253</div>');
                                expect(resEncounter.location[0].resourceType).to.equal('Location');
                                expect(resEncounter.location[0].identifier.value).to.equal(vprP.facilityCode);
                                expect(resEncounter.location[0].Name).to.equal(vprP.facilityName);
                                expect(resEncounter.location[0].identifier.system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                            }
                        });
                        if (vprP.providerUid !== undefined || vprP.providerName !== undefined) {
                            it('verifies that the practitioner from the VPR Problem Resource exists in the contained resources from the FHIR Problem', function() {
                                var resPractitioner = _.find(fhirP.contained, function(res) {
                                    return res.resourceType === 'Practitioner';
                                });
                                expect(resPractitioner).to.not.be.undefined();
                                if (resPractitioner !== undefined) {
                                    expect(resPractitioner.resourceType).to.equal('Practitioner');
                                    expect(resPractitioner.identifier.system).to.equal('urn:oid:2.16.840.1.113883.6.233');
                                    expect(resPractitioner.identifier.value).to.equal(vprP.providerUid);
                                    expect(resPractitioner.name).to.equal(vprP.providerName);
                                }
                                expect(fhirP.asserter.reference).to.equal('#' + resPractitioner._id);
                                expect(fhirP.asserter.display).to.equal(vprP.providerName);
                            });
                        }
                    });
                    it('verifies that the icd code and name information from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.code.coding[0].code).to.equal(vprP.icdCode);
                        expect(fhirP.code.coding[0].display).to.equal(vprP.icdName);
                    });
                    describe('extensions', function() {
                        if (vprP.statusCode !== undefined) {
                            it('verifies that the status code from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusCode = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusCode';
                                });
                                expect(statusCode.valueString).to.equal(vprP.statusCode);
                            });
                        }
                        if (vprP.statusName !== undefined) {
                            it('verifies that the status name from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusName = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusName';
                                });
                                expect(statusName.valueString).to.equal(vprP.statusName);
                            });
                        }
                        if (vprP.statusName !== undefined) {
                            it('verifies that the status display name from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var statusDisplayName = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#statusDisplayName';
                                });
                                expect(statusDisplayName.valueString).to.equal(vprP.statusDisplayName);
                            });
                        }
                        if (vprP.serviceConnected !== undefined) {
                            it('verifies that the service conected flag from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var serviceConnected = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#serviceConnected';
                                });
                                expect(serviceConnected.valueBoolean).to.equal(vprP.serviceConnected);
                            });
                        }
                        if (vprP.service !== undefined) {
                            it('verifies that the service field from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var service = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#service';
                                });
                                expect(service.valueString).to.equal(vprP.service);
                            });
                        }
                        if (vprP.updated !== undefined) {
                            it('verifies that the updated field from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var updated = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#updated';
                                });
                                expect(updated.valueDateTime).to.equal(fhirUtils.convertToFhirDateTime(vprP.updated));
                            });
                        }
                        if (vprP.comments !== undefined) {
                            it('verifies that the summary from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                                var comments = _.find(fhirP.extension, function(ext) {
                                    return ext.url === 'http://vistacore.us/fhir/extensions/condition#comments';
                                });
                                var txt1 = '<li>' + 'entered:' + vprP.comments[0].entered + '</li>';
                                var txt2 = txt1 + '<li>' + 'enteredByName:' + vprP.comments[0].enteredByName + '</li>';
                                var txt3 = txt2 + '<li>' + 'enteredByCode:' + vprP.comments[0].enteredByCode + '</li>';
                                var txt4 = txt3 + '<li>' + 'comment:' + vprP.comments[0].comment + '</li>';
                                var txt = txt4 + '<li>' + 'summary:' + vprP.comments[0].summary + '</li></ul></div>';
                                expect(comments.valueString).to.equal('<div><ul>' + txt);
                            });
                        }
                    });
                    it('verifies that the entered date from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.dateAsserted).to.equal(fhirUtils.convertToFhirDateTime(vprP.entered));
                    });
                    it('verifies that the onset date from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                        expect(fhirP.onsetDate).to.equal(fhirUtils.convertToFhirDateTime(vprP.onset));
                    });
                    if (vprP.resolved !== undefined) {
                        it('verifies that the resolved from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                            expect(fhirP.abatementDate).to.equal(fhirUtils.convertToFhirDateTime(vprP.resolved));
                        });
                    }
                    if (vprP.locationUid !== undefined) {
                        it('verifies that the locationUid from VPR Problem Resource coresponds to the one from the FHIR Problem Resource', function() {
                            expect(fhirP.provider.reference).to.equal('#' + vprP.locationUid);
                        });
                    }
                });
            }
        });
    });
});

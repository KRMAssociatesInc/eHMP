/*jslint node: true */
'use strict';

var jdsUtils = require('../subsystems/jdsSync/jdsUtils');
var _ = require('lodash');

describe('JDS Utils Testing', function() {
    describe('Tesing getVistaSites', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.getVistaSites(undefinedStatus)).toEqual(expectedGetVistASitesRetObj.empty);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.getVistaSites(emptySyncStatus)).toEqual(expectedGetVistASitesRetObj.empty);
        });
        it('Testing with sample Sync Status', function(){
            expect(jdsUtils.getVistaSites(sampleSyncStatus)).toEqual(expectedGetVistASitesRetObj.sample);
        });
    });
    describe('Tesing isSiteSynced', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.isSiteSynced(undefinedStatus)).toEqual(expectedIsSiteSyncedRetObj.empty);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.isSiteSynced(emptySyncStatus)).toEqual(expectedIsSiteSyncedRetObj.empty);
        });
        it('Testing with sample Sync Status', function(){
            _.each(['9E7A','C877','DOD'], function(site){
                expect(jdsUtils.isSiteSynced(sampleSyncStatus, site)).toEqual(expectedIsSiteSyncedRetObj[site]);
            });
        });
    });
    describe('Tesing isSyncMarkedCompleted', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.isSyncMarkedCompleted(undefinedStatus)).toEqual(false);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.isSyncMarkedCompleted(emptySyncStatus)).toEqual(false);
        });
        it('Testing with sample Sync Status', function(){
            _.each(syncMarkCompletedInputAndResult, function(element){
                expect(jdsUtils.isSyncMarkedCompleted(sampleSyncStatus, element.sites)).toEqual(element.result);
            });
        });
    });
    describe('Tesing isSyncCompleted', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.isSyncCompleted(undefinedStatus)).toEqual(false);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.isSyncCompleted(emptySyncStatus)).toEqual(false);
        });
        it('Testing with sample Sync Status', function(){
            _.each(syncCompletedInputAndResult, function(element){
                expect(jdsUtils.isSyncCompleted(element.input)).toEqual(element.result);
            });
        });
    });
    describe('Tesing hasSyncStatusErrorForSite', function(){
        it('Testing with undefined Status', function(){
            expect(jdsUtils.hasSyncStatusErrorForSite(undefinedStatus, 'DOD')).toEqual(false);
        });
        it('Testing with empty Status', function(){
            expect(jdsUtils.hasSyncStatusErrorForSite(emptySyncStatus, 'DOD')).toEqual(false);
        });
        it('Testing with sample Sync Status', function(){
            _.each(hasSyncErrorStatusAndResult, function(element){
                expect(jdsUtils.hasSyncStatusErrorForSite(element.input, element.site)).toEqual(element.result);
            });
        });
    });
});

var expectedIsSiteSyncedRetObj = {
    'empty' : false,
    '9E7A' : true,
    'C877' : true,
    'DOD' : false
};

var syncMarkCompletedInputAndResult = [
    {
        'sites' : ['DOD'],
        'result' : false
    },
    {
        'sites' : ['C877'],
        'result' : true
    },
    {
        'sites' : ['9E7A','C877'],
        'result' : true
    },
    {
        'sites' : ['9E7A','C877','DOD'],
        'result' : false
    }
];

var syncCompletedInputAndResult = [
    {
        'input': {
            'data' : {
                'syncStatus': {}
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'inProgress': {

                    }
                }
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    },
                    'inProgress': {

                    }
                }
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    },
                    'inProgress': {

                    },
                },
                'jobStatus' : [
                ]
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    }
                },
                'jobStatus' : [
                    {
                        'jobId': 1,
                        'name': 'test'
                    }
                ]
            }
        },
        'result': false
    },
    {
        'input': {
            'data' : {
                'syncStatus': {
                    'completedStamp': {

                    }
                },
                'jobStatus' : [
                ]
            }
        },
        'result': true
    }
];

var hasSyncErrorStatusAndResult = [
    {
        site: 'DOD',
        input: {
            data: {
                jobStatus:[
                ]
            }
        },
        result: false
    },
    {
        site: 'DOD',
        input: {
            data: {
                jobStatus:[
                    {
                        'dataDomain': 'radiology',
                        'error': 'unable to sync',
                        'jobId': '30073',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086775',
                        'type': 'jmeadows-sync-radiology-request'
                    },
                    {
                        'dataDomain': 'vital',
                        'error': 'unable to sync',
                        'jobId': '30074',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086806',
                        'type': 'jmeadows-sync-vital-request'
                    },
                ]
            }
        },
        result: true
    },
    {
        site: 'HDR',
        input: {
            data: {
                jobStatus:[
                    {
                        'dataDomain': 'radiology',
                        'error': 'unable to sync',
                        'jobId': '30073',
                        'jpid': '1d745f7b-1ac3-4494-9519-aad07c09e0ed',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'HDR;0000000003'
                        },
                        'requestStampTime': '20150424014126',
                        'rootJobId': '30007',
                        'status': 'error',
                        'timestamp': '1429854086775',
                        'type': 'hdr-sync-radiology-request'
                    }
                ]
            }
        },
        result: true
    },

];

var undefinedStatus;
var emptySyncStatus = {
};

var sampleSyncStatus = {
    'data' : {
        'syncStatus': {
            'completedStamp': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    '9E7A': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:9E7A:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:9E7A:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    },
                    'C877': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:C877:3:751': {
                                        'stampTime': 20050317200936,
                                        'stored': true
                                    },
                                    'urn:va:allergy:C877:3:874': {
                                        'stampTime': 20071217151354,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170817,
                                'syncCompleted': true
                            }
                        },
                        'localId': 3,
                        'pid': '9E7A;3',
                        'stampTime': 20150130170817,
                        'syncCompleted': true
                    }
                },
                'stampTime': 20150130170817
            },
            'inProgress': {
                'icn': '10108V420871',
                'sourceMetaStamp': {
                    'DOD': {
                        'domainMetaStamp': {
                            'allergy': {
                                'domain': 'allergy',
                                'eventMetaStamp': {
                                    'urn:va:allergy:DOD:0000000003:1000010340': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010341': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    },
                                    'urn:va:allergy:DOD:0000000003:1000010342': {
                                        'stampTime': 20150130170811,
                                        'stored': true
                                    }
                                },
                                'stampTime': 20150130170811,
                                'syncCompleted': true
                            },
                            'consult': {
                                'domain': 'consult',
                                'eventMetaStamp': {
                                    'urn:va:consult:DOD:0000000003:1000000649': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000000650': {
                                        'stampTime': 20150130170811
                                    },
                                    'urn:va:consult:DOD:0000000003:1000010652': {
                                        'stampTime': 20150130170811
                                    }
                                },
                                'stampTime': 20150130170811
                            },
                        },
                        'localId': '0000000003',
                        'pid': 'DOD;0000000003',
                        'stampTime': 20150130170811
                    }
                },
                'stampTime': 20150130170811
            },
            'stampTime': 20150130220850
        },
        'jobStatus': [
            {
                'jobId': '1',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'icn',
                    'value': '10108V420871'
                },
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257475375',
                'type': 'enterprise-sync-request'
            },
            {
                'jobId': '2',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': '9E7A;3'
                },
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257478447',
                'type': 'vista-9E7A-subscribe-request'
            },
            {
                'jobId': '3',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257478660',
                'type': 'jmeadows-sync-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '4',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'DOD;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'completed',
                'timestamp': '1423257480377',
                'type': 'jmeadows-sync-allergy-request'
            },
            {
                'dataDomain': 'allergy',
                'jobId': '5',
                'jpid': 'bd9ce7f7-81c8-49b8-b8f3-1ec4ac09e7d2',
                'patientIdentifier': {
                    'type': 'pid',
                    'value': 'HDR;0000000003'
                },
                'requestStampTime': '20150206161758',
                'rootJobId': '1',
                'status': 'created',
                'timestamp': '1423257480377',
                'type': 'hdr-sync-allergy-request'
            }
        ]
    }
};

var expectedGetVistASitesRetObj = {
    'empty' : [],
    'sample': ['9E7A','C877','DOD','HDR']
};

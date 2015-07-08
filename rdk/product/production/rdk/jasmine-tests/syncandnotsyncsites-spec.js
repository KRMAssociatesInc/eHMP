/*jslint node: true */
'use strict';

var prResource = require('../resources/patientrecord/patientrecordResource');



xdescribe('Sync And Not Sync sites', function() {
    it('tests that synced and not synced sites correctly generated from the domain data and sync status from JDS', function() {
        var retObj = prResource.getSyncedAndNotSyncedSites(sampleSyncStatus, 'allergy');
        expect(retObj).toEqual(expectedSyncAndNotSyncRetObj.allergy);
        retObj = prResource.getSyncedAndNotSyncedSites(sampleSyncStatus, 'consult');
        expect(retObj).toEqual(expectedSyncAndNotSyncRetObj.consult);
        // testing empty response
        retObj = prResource.getSyncedAndNotSyncedSites(emptySyncStatus, 'consult');
        expect(retObj).toEqual(expectedSyncAndNotSyncRetObj.empty);
    });
});

var emptySyncStatus = {
};

var sampleSyncStatus = {
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
};

var expectedSyncAndNotSyncRetObj = {
    'allergy': {
        'notSyncedSites': [],
        'syncedSites': ['9E7A','C877','DOD']
    },
    'consult': {
        'notSyncedSites': ['DOD'],
        'syncedSites': ['9E7A','C877']
    },
    'empty' : {
        'notSyncedSites': [],
        'syncedSites': []
    }
};

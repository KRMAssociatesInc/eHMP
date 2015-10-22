'use strict';

var _ = require('underscore');

require('../../../env-setup');
var SyncRulesEngine = require(global.VX_SYNCRULES + '/rules-engine');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var wConfig = require(global.VX_ROOT + 'worker-config');
var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'operational-sync-endpoint-handler-spec',
//     level: 'debug'
// });

describe('operational-data-sync-rule integration test', function() {
    var opdStampAAAA = {
        'stampTime': 20141031094920,
        'sourceMetaStamp': {
            'AAAA': {
                'stampTime': 20141031094920,
                'domainMetaStamp': {
                    'doc-def': {
                        'domain': 'doc-def',
                        'stampTime': 20141031094920,
                        'itemMetaStamp': {
                            'urn:va:doc-def:AAAA:1001': {
                                'stampTime': 20141031094920,
                            },
                        }
                    },
                    'pt-select': {
                        'domain': 'pt-select',
                        'stampTime': 20141031094920,
                        'itemMetaStamp': {
                            'urn:va:pt-select:AAAA:1001': {
                                'stampTime': 20141031094920,
                            }
                        }
                    }
                }
            }
        }
    };
    var opdStampBBBB = {
        'stampTime': 20141031094920,
        'sourceMetaStamp': {
            'BBBB': {
                'stampTime': 20141031094920,
                'domainMetaStamp': {
                    'pt-select': {
                        'domain': 'pt-select',
                        'stampTime': 20141031094920,
                        'itemMetaStamp': {
                            'urn:va:pt-select:BBBB:1001': {
                                'stampTime': 20141031094920,
                            }
                        }
                    }
                }
            }
        }
    };
    var storeDocDefMetadataAAAA = {
        'source': 'AAAA',
        'uid': 'urn:va:doc-def:AAAA:1001',
        'domain': 'doc-def',
        'itemStamp': 20141031094920
    };
    var storePtSelectMetadataAAAA = {
        'source': 'AAAA',
        'uid': 'urn:va:pt-select:AAAA:1001',
        'domain': 'pt-select',
        'itemStamp': 20141031094920
    };
    var storePtSelectMetadataBBBB = {
        'source': 'BBBB',
        'uid': 'urn:va:pt-select:BBBB:1001',
        'domain': 'pt-select',
        'itemStamp': 20141031094920
    };

    var mockPatientIds = [{
        type: 'icn',
        value: '111111V22222'
    }, {
        type: 'pid',
        value: 'AAAA;3'
    }, {
        type: 'pid',
        value: 'BBBB;3'
    }, {
        type: 'pid',
        value: 'DOD;000000180'
    }, {
        type: 'pid',
        value: 'HDR;111111V22222'
    }, {
        type: 'pid',
        value: 'VLER;111111V22222'
    }];

    var config = {
        vistaSites: {
            'AAAA': {},
            'BBBB': {}
        },
        jds: _.defaults(wConfig.jds, {
            protocol: 'http',
            host: '10.2.2.110',
            port: 9080
        }),
        rules: {
            'operational-data-sync': {}
        }
    };

    beforeEach(function() {
        //Clear the metastamps for the sites used in these tests
        var jdsClient = new JdsClient(log, log, config);
        var done1 = false;
        var done2 = false;
        runs(function() {
            jdsClient.deleteOperationalSyncStatus('AAAA', function() {
                done1 = true;
            });
            jdsClient.deleteOperationalSyncStatus('BBBB', function() {
                done2 = true;
            });
        });
        waitsFor(function() {
            return done1 && done2;
        });
    });

    it('Normal path: no primary sites associated with patient have completed OPD sync', function() {
        var done = false;
        var jdsClient = new JdsClient(log, log, config);
        var environment = {
            jds: jdsClient,
            metrics: log
        };
        //No metastamp in JDS
        var engine = new SyncRulesEngine(log, config, environment);
        // engine.rules = [rule];
        runs(function() {
            engine.getSyncPatientIdentifiers(mockPatientIds, [], function(err, result) {
                //console.log(result);
                expect(val(result, 'length')).toEqual(0);
                done = true;
            });
        });
        waitsFor(function() {
            return done;
        });
    });

    it('Normal path: some primary sites associated with patient have completed OPD sync', function() {
        var done1, done2, done3, done4 = false;
        var jdsClient = new JdsClient(log, log, config);
        var environment = {
            jds: jdsClient,
            metrics: log
        };

        //Send operational metastamps to JDS
        runs(function() {
            environment.jds.saveOperationalSyncStatus(opdStampAAAA, 'AAAA', function() {
                done1 = true;
            });
            environment.jds.saveOperationalSyncStatus(opdStampBBBB, 'BBBB', function() {
                done2 = true;
            });
        });
        waitsFor(function() {
            return done1 && done2;
        });
        //Mark all items for BBBB as stored
        runs(function() {
            environment.jds._markOperationalItemAsStored(storePtSelectMetadataBBBB, function() {
                done3 = true;
            });
        });
        waitsFor(function() {
            return done3;
        });

        var engine = new SyncRulesEngine(log, config, environment);
        // engine.rules = [rule];
        runs(function() {
            engine.getSyncPatientIdentifiers(mockPatientIds, [], function(err, result) {
                //console.log(result);
                expect(val(result, 'length')).toEqual(5);
                done4 = true;
            });
        });
        waitsFor(function() {
            return done4;
        });
    });

    it('Normal path: all primary sites associated with patient have completed OPD sync', function() {
        var done1, done2, done3, done4, done5, done6 = false;
        var jdsClient = new JdsClient(log, log, config);
        var environment = {
            jds: jdsClient,
            metrics: log
        };
        //Send operational metastamps to JDS
        runs(function() {
            environment.jds.saveOperationalSyncStatus(opdStampAAAA, 'AAAA', function() {
                done1 = true;
            });
            environment.jds.saveOperationalSyncStatus(opdStampBBBB, 'BBBB', function() {
                done2 = true;
            });
        });
        waitsFor(function() {
            return done1 && done2;
        });
        //Mark all items for AAAA and BBBB as stored
        runs(function() {
            environment.jds._markOperationalItemAsStored(storeDocDefMetadataAAAA, function(error, response) {
                done3 = true;
            });
            environment.jds._markOperationalItemAsStored(storePtSelectMetadataAAAA, function(error, response) {
                done4 = true;
            });
            environment.jds._markOperationalItemAsStored(storePtSelectMetadataBBBB, function(error, response) {
                done5 = true;
            });
        });
        waitsFor(function() {
            return done3 && done4 && done5;
        });

        var engine = new SyncRulesEngine(log, config, environment);
        // engine.rules = [rule];
        runs(function() {
            engine.getSyncPatientIdentifiers(mockPatientIds, [], function(err, result) {
                //console.log(result);
                expect(val(result, 'length')).toEqual(6);
                done6 = true;
            });
        });
        waitsFor(function() {
            return done6;
        });
    });
    //Cleanup
    afterEach(function() {
        var config = {
            jds: _.defaults(wConfig.jds, {
                protocol: 'http',
                host: '10.2.2.110',
                port: 9080
            })
        };
        //Clear the metastamps for the sites used in these tests
        var jdsClient = new JdsClient(log, log, config);
        var done1 = false;
        var done2 = false;
        runs(function() {
            jdsClient.deleteOperationalSyncStatus('AAAA', function() {
                done1 = true;
            });
            jdsClient.deleteOperationalSyncStatus('BBBB', function() {
                done2 = true;
            });
        });
        waitsFor(function() {
            return done1 && done2;
        });
    });
});
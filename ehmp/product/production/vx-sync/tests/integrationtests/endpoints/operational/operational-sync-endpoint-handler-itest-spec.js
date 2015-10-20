'use strict';

var _ = require('underscore');

require('../../../../env-setup');

var handler = require(global.VX_ENDPOINTS + '/operational/operational-sync-endpoint-handler');

var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'operational-sync-endpoint-handler-spec',
//     level: 'debug'
// });

var val = require(global.VX_UTILS + 'object-utils').getProperty;
var wConfig = require(global.VX_ROOT + 'worker-config');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

describe('operational-sync-endpoint-handler integration test', function() {
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
    describe('initialOPDSync()', function() {
        var config = {
            vistaSites: {
                'AAAA': {},
                'BBBB': {}
            },
            jds: _.defaults(wConfig.jds, {
                protocol: 'http',
                host: '10.2.2.110',
                port: 9080
            })
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
        it('normal path: subscribe OPD for all sites', function() {
            var done = false;
            //var testConfig = _.clone(config);
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                metrics: log,
                jds: jdsClient
            };
            //No metastamp in JDS
            spyOn(environment.publisherRouter, 'publish').andCallThrough();

            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(environment.publisherRouter.publish.calls).toBeTruthy();
                    expect(val(environment.publisherRouter.publish.calls, 0, 'args')).toBeTruthy();
                    expect(val(environment.publisherRouter.publish.calls, 1, 'args')).toBeTruthy();

                    var callArgs = [val(environment.publisherRouter.publish.calls, 0, 'args', 0), val(environment.publisherRouter.publish.calls, 1, 'args', 0)];
                    expect(callArgs).toContain({
                        'type': 'vista-operational-subscribe-request',
                        'site': 'AAAA'
                    });

                    expect(callArgs).toContain({
                        'type': 'vista-operational-subscribe-request',
                        'site': 'BBBB'
                    });

                    // expect(val(environment.publisherRouter.publish.calls, 0, 'args', 0)).toEqual({
                    //     'type': 'vista-operational-subscribe-request',
                    //     'site': 'AAAA'
                    // });
                    // expect(val(environment.publisherRouter.publish.calls, 1, 'args', 0)).toEqual({
                    //     'type': 'vista-operational-subscribe-request',
                    //     'site': 'BBBB'
                    // });
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
        it('normal path: subscribe OPD for only some sites', function() {
            var done1, done2, done3, done4 = false;
            //var testConfig = _.clone(config);
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                metrics: log,
                jds: jdsClient
            };
            spyOn(environment.publisherRouter, 'publish').andCallThrough();
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
            //test handler using framework
            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(environment.publisherRouter.publish.calls).toBeTruthy();
                    expect(val(environment.publisherRouter.publish.calls, 0, 'args')).toBeTruthy();
                    expect(val(environment.publisherRouter.publish.calls, 0, 'args', 0)).toEqual({
                        'type': 'vista-operational-subscribe-request',
                        'site': 'AAAA'
                    });
                    expect(val(environment.publisherRouter.publish.calls, 'length')).toEqual(1);
                    done4 = true;
                });
            });
            waitsFor(function() {
                return done4;
            });
        });
        it('normal path: OPD already complete', function() {
            var done1, done2, done3, done4, done5, done6 = false;
            //var testConfig = _.clone(config);
            var jdsClient = new JdsClient(log, log, config);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                metrics: log,
                jds: jdsClient
            };
            spyOn(environment.publisherRouter, 'publish').andCallThrough();
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
                environment.jds._markOperationalItemAsStored(storeDocDefMetadataAAAA, function() {
                    done3 = true;
                });
                environment.jds._markOperationalItemAsStored(storePtSelectMetadataAAAA, function() {
                    done4 = true;
                });
                environment.jds._markOperationalItemAsStored(storePtSelectMetadataBBBB, function() {
                    done5 = true;
                });
            });
            waitsFor(function() {
                return done3 && done4 && done5;
            });
            //test handler using framework
            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(val(environment.publisherRouter.publish.calls, 'length')).toEqual(0);
                    done6 = true;
                });
            });
            waitsFor(function() {
                return done6;
            });
        });
        // it('error path?', function() {});
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
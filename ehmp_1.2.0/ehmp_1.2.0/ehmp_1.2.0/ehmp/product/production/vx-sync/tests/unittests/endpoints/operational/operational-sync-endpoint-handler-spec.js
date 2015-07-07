'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var util = require('util');

var handler = require(global.VX_ENDPOINTS + '/operational/operational-sync-endpoint-handler');
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');

var log = require(global.VX_UTILS + 'dummy-logger');
// log = require('bunyan').createLogger({
//     name: 'operational-sync-endpoint-handler-spec',
//     level: 'debug'
// });

var sampleOpDataStamp = {
    'stampTime': 20141031094920,
    'sourceMetaStamp': {
        '9E7A': {
            'stampTime': 20141031094920,
            'domainMetaStamp': {
                'doc-def': {
                    'domain': 'doc-def',
                    'stampTime': 20141031094920,
                    'itemMetaStamp': {
                        'urn:va:doc-def:AAAA:1001': {
                            'stampTime': 20141031094920,
                        },
                        'urn:va:doc-def:AAAA:1002': {
                            'stampTime': 20141031094920,
                        }
                    }
                },
                'pt-select': {
                    'domain': 'pt-select',
                    'stampTime': 20141031094920,
                    'itemMetaStamp': {
                        'urn:va:pt-select:AAAA:1001': {
                            'stampTime': 20141031094920,
                        },
                        'urn:va:pt-select:AAAA:1002': {
                            'stampTime': 20141031094920,
                        }
                    }
                }
            }
        }
    }
};

var sampleOpDataStamp2 = {
    'stampTime': 20141031094920,
    'sourceMetaStamp': {
        'C877': {
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

describe('operational-sync-endpoint-handler', function() {
    describe('initialOPDSync', function() {
        it('Error path: JDS returns error', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData('Error', null, null);
            var environment = {
                jds: jdsClientDummy
            };

            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeTruthy();
                    expect(error).toEqual('FailedJdsError');
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
        it('Error path: JDS returns no response', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, null, null);
            var environment = {
                jds: jdsClientDummy
            };

            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeTruthy();
                    expect(error).toEqual('FailedJdsNoResponse');
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
        it('Error path: JDS returns no result', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, {
                statusCode: 200
            }, null);
            var environment = {
                jds: jdsClientDummy
            };

            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeTruthy();
                    expect(error).toEqual('FailedJdsNoResult');
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
        it('Error path: JDS returns wrong status code', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, {
                statusCode: 403
            }, {});
            var environment = {
                jds: jdsClientDummy
            };

            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeTruthy();
                    expect(error).toEqual('FailedJdsWrongStatusCode');
                    done = true;
                });
            });
            waitsFor(function() {
                return done;
            });
        });
        it('normal scenario: operational data sync starts', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, [{
                statusCode: 200
            }, {
                statusCode: 200
            }], [{
                'inProgress': sampleOpDataStamp
            }, {
                'inProgress': sampleOpDataStamp2
            }]);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                jds: jdsClientDummy
            };

            spyOn(environment.publisherRouter, 'publish').andCallThrough();
            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(environment.publisherRouter.publish.calls).toBeTruthy();
                    expect(environment.publisherRouter.publish.calls[0].args).toBeTruthy();
                    expect(environment.publisherRouter.publish.calls[0].args[0]).toEqual({
                        "type": "vista-operational-subscribe-request",
                        "site": "9E7A"
                    });
                    expect(environment.publisherRouter.publish.calls[1].args).toBeTruthy();
                    expect(environment.publisherRouter.publish.calls[1].args[0]).toEqual({
                        "type": "vista-operational-subscribe-request",
                        "site": "C877"
                    });
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });
        });
        it('normal scenario: operational data already synced for all sites', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, [{
                statusCode: 200
            }, {
                statusCode: 200
            }], [{
                'completedStamp': sampleOpDataStamp
            }, {
                'completedStamp': sampleOpDataStamp2
            }]);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                jds: jdsClientDummy
            };

            spyOn(environment.publisherRouter, 'publish').andCallThrough();
            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(environment.publisherRouter.publish.calls.length).toEqual(0);
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });
        });
        it('normal scenario: operational data only synced for some sites', function() {
            var done = false;
            var config = {
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };
            var jdsClientDummy = new JdsClientDummy(log, config);
            jdsClientDummy._setResponseData(null, [{
                statusCode: 200
            }, {
                statusCode: 200
            }], [{
                'completedStamp': sampleOpDataStamp
            }, {
                'inProgress': sampleOpDataStamp2
            }]);
            var environment = {
                publisherRouter: {
                    publish: function(jobsToPublish, config, callback) {
                        callback(null, 'success');
                    }
                },
                jds: jdsClientDummy
            };

            spyOn(environment.publisherRouter, 'publish').andCallThrough();
            runs(function() {
                handler.initialOPDSync(log, config, environment, function(error) {
                    expect(error).toBeFalsy();
                    //console.log(JSON.stringify(environment.publisherRouter.publish.calls));
                    expect(environment.publisherRouter.publish.calls.length).toEqual(1);
                    expect(environment.publisherRouter.publish.calls).toBeTruthy();
                    expect(environment.publisherRouter.publish.calls[0].args).toBeTruthy();
                    expect(environment.publisherRouter.publish.calls[0].args[0]).toEqual({
                        "type": "vista-operational-subscribe-request",
                        "site": "C877"
                    });
                    done = true;
                });
            });

            waitsFor(function() {
                return done;
            });
        });
    });
});
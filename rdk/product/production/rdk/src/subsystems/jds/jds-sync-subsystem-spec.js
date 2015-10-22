/*jslint node: true */
'use strict';

var rdk = require('../../core/rdk');
var jdsSync = require('./jds-sync-subsystem');
var httpMocks = require('node-mocks-http');

describe('jdsSync\'s', function() {
    var pid;
    var req;
    var log;
    var httpExpected;

    beforeEach(function() {
        pid = 'test;patientId';

        req = buildRequest();

        log = '';

        httpExpected = [];
        sinon.stub(rdk.utils.http, 'fetch', stubHttp.bind(null, undefined));
        sinon.stub(rdk.utils.http, 'post', stubHttp);
    });

    describe('loadPatient', function() {
        it('should notify of a not-found patient', function(done) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 404);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 404);
            req.app.subsystems.jdsSync.loadPatient(pid, false, req, expectError(done, 404, 'This patient\'s record is not yet accessible. Please try again in a few minutes. If it is still not accessible, please contact your HIMS representative and have the patient loaded into your local VistA.'));
        });

        it('should load a patient', function(done) {
            expectLoadSuccess();
            req.app.subsystems.jdsSync.loadPatient(pid, false, req, expectSuccess(done, 201));
        });

        it('should load a patient and return immediately', function(done) {
            expectLoadImmediate();
            req.app.subsystems.jdsSync.loadPatient(pid, true, req, expectSuccess(done, 201));
        });

        it('should time out when no response received', function(done) {
            expectLoadTimeout();
            req.app.subsystems.jdsSync.loadPatient(pid, false, req, expectError(done));
        });

        it('should load a patient with a priority site', function(done) {
            pid = '9E7A;patientId';
            expectLoadSuccess();
            req.app.subsystems.jdsSync.loadPatientPrioritized(pid, '9E7A', req, expectSuccess(done, 201));
        });

        it('should load a patient with a forced site', function(done) {
            expectLoadSuccess('9E7A');
            req.app.subsystems.jdsSync.loadPatientForced(pid, '9E7A', false, req, expectSuccess(done, 201));
        });

        var syncIncompleteResponse = {
            syncStatus: {
                completedStamp: {
                    sourceMetaStamp: {
                        'C877': {
                            syncCompleted: true,
                            stampTime: 'time'
                        },
                        '9E7A': {
                            syncCompleted: false,
                            hasError: false
                        }
                    }
                }
            },
            jobStatus: [
                {type: 'vler-blah'},
                {type: 'vista-C877-blah'},
                {type: 'jmeadows-blah'}
            ]
        };
        var syncCompleteResponse = {
            syncStatus: {
                completedStamp: {
                    sourceMetaStamp: {
                        'C877': {
                            syncCompleted: true,
                            stampTime: 'time'
                        },
                        '9E7A': {
                            syncCompleted: true,
                            stampTime: 'time'
                        },
                        'VLER': {
                            syncCompleted: true,
                            stampTime: 'time'
                        },
                        'DOD': {
                            syncCompleted: true,
                            stampTime: 'time'
                        }
                    }
                }
            },
            jobStatus: [
                {type: 'vler-blah'},
                {type: 'vista-C877-blah'},
                {type: 'jmeadows-blah'}
            ]
        };
        var patientResponse = {
            data: {
                totalItems: 1
            }
        };

        function expectLoadSuccess(forcedSite) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            var loadPath = '/sync/load?pid=' + pid;
            if (forcedSite) {
                loadPath += '&forcedSync=["' + forcedSite + '"]';
            }
            expectHttpPost(undefined, 'vxSyncServer', loadPath);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid, 200, syncIncompleteResponse);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            return expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid, 200, syncCompleteResponse);
        }

        function expectLoadImmediate() {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            expectHttpPost(undefined, 'vxSyncServer', '/sync/load?pid=' + pid);
            return expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
        }

        function expectLoadTimeout() {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            expectHttpPost(undefined, 'vxSyncServer', '/sync/load?pid=' + pid);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=' + pid, 200, patientResponse);
            return expectHttpFetch('vxSyncServer', '/sync/status?pid=' + pid);
        }
    });

    describe('clearPatient', function() {
        it('should notify of a not-found patient', function(done) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 404);
            req.app.subsystems.jdsSync.clearPatient(pid, req, expectError(done, 404, 'pid test;patientId not found.'));
        });

        it('should unsync a patient', function(done) {
            expectClearSuccess();
            req.app.subsystems.jdsSync.clearPatient(pid, req, expectResponse(done, {
                data: {
                    data: {
                        code: 200,
                        message: 'pid test;patientId unsynced.'
                    }
                },
                status: 200
            }));
        });

        it('should time out when no response received', function(done) {
            expectClearTimeout();
            req.app.subsystems.jdsSync.clearPatient(pid, req, expectError(done));
        });

        var patientResponse = {
            data: {
                totalItems: 1
            }
        };

        function expectClearSuccess() {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpPost(undefined, 'vxSyncServer', '/sync/clearPatient?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            return expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 404);
        }

        function expectClearTimeout() {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpPost(undefined, 'vxSyncServer', '/sync/clearPatient?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 200, patientResponse);
            return expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
        }
    });

    describe('getPatientStatus', function() {
        it('should add the pid to the path', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            req.app.subsystems.jdsSync.getPatientStatus(pid, req, expectSuccess(done));
        });

        it('should add the icn to the path', function(done) {
            pid = 'testicn';
            expectHttpFetch('vxSyncServer', '/sync/status?icn=testicn');
            req.app.subsystems.jdsSync.getPatientStatus(pid, req, expectSuccess(done));
        });

        it('should get the pid from the request when not provided', function(done) {
            req = buildRequest({ params: { pid: 'req;pid' } });
            expectHttpFetch('vxSyncServer', '/sync/status?pid=req;pid');
            req.app.subsystems.jdsSync.getPatientStatus(null, req, expectSuccess(done));
        });

        it('should return 404 when a patient isn\'t found', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 404);
            req.app.subsystems.jdsSync.getPatientStatus(pid, req, expectError(done, 404, 'pid test;patientId is unsynced'));
        });

        it('should return a standard error result for other errors', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 407);
            req.app.subsystems.jdsSync.getPatientStatus(pid, req, expectError(done));
        });
    });

    describe('getPatientDataStatus', function() {
        it('should add the pid to the path', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId');
            req.app.subsystems.jdsSync.getPatientDataStatus(pid, req, expectSuccess(done));
        });

        it('should add the icn to the path', function(done) {
            pid = 'testicn';
            expectHttpFetch('vxSyncServer', '/sync/status?icn=testicn');
            req.app.subsystems.jdsSync.getPatientDataStatus(pid, req, expectSuccess(done));
        });

        it('should get the pid from the request when not provided', function(done) {
            req = buildRequest({ params: { pid: 'req;pid' } });
            expectHttpFetch('vxSyncServer', '/sync/status?pid=req;pid');
            req.app.subsystems.jdsSync.getPatientDataStatus(null, req, expectSuccess(done));
        });

        it('should return success for a normal patient', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 200, {
                syncStatus: {
                    completedStamp: {
                        sourceMetaStamp: {
                            'C877': {
                                syncCompleted: true,
                                stampTime: 'time'
                            }
                        }
                    }
                },
                jobStatus: [
                    {type: 'vler-blah'},
                    {
                        type: 'vista-9E7A-blah',
                        error: 'uh-oh'
                    },
                    {type: 'jmeadows-blah'}
                ]
            });
            req.app.subsystems.jdsSync.getPatientDataStatus(pid, req, expectResponse(done, {
                data: {
                    VISTA: {
                        C877: {
                            isSyncCompleted: true,
                            completedStamp: 'time'
                        },
                        '9E7A': {
                            isSyncCompleted: false,
                            hasError: true
                        }
                    },
                    VLER: {
                        isSyncCompleted: false,
                        hasError: false
                    },
                    DOD: {
                        isSyncCompleted: false,
                        hasError: false
                    },
                    allSites: false
                },
                status: 200
            }));
        });

        it('should return 404 when a patient isn\'t found', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 404);
            req.app.subsystems.jdsSync.getPatientDataStatus(pid, req, expectError(done, 404, 'pid test;patientId is unsynced'));
        });

        it('should return a standard error result for other errors', function(done) {
            expectHttpFetch('vxSyncServer', '/sync/status?pid=test;patientId', 407, {}, 'err');
            req.app.subsystems.jdsSync.getPatientDataStatus(pid, req, expectError(done));
        });
    });

    describe('getPatientStatusDetail', function() {
        it('should add the pid and detailed params to the path', function(done) {
            expectHttpFetch('jdsServer', '/status/test;patientId?detailed=true');
            req.app.subsystems.jdsSync.getPatientStatusDetail(pid, req, expectSuccess(done));
        });

        it('should return 404 when a patient isn\'t found', function(done) {
            expectHttpFetch('jdsServer', '/status/test;patientId?detailed=true', 404);
            req.app.subsystems.jdsSync.getPatientStatusDetail(pid, req, expectError(done, 404, 'pid test;patientId is unsynced'));
        });

        it('should return a standard error result for other errors', function(done) {
            expectHttpFetch('jdsServer', '/status/test;patientId?detailed=true', 407);
            req.app.subsystems.jdsSync.getPatientStatusDetail(pid, req, expectError(done));
        });
    });

    describe('syncPatientDemographics', function() {
        var payload;

        beforeEach(function() {
            payload = {
                'pid': ['test;demographics'],
                'edipi': 'testedipi',
                'icn': 'testicn',
                'demographics': {}
            };
        });

        it('should POST to vxSyncServer', function(done) {
            expectHttpPost(payload, 'vxSyncServer', '/sync/demographicSync');
            req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, expectSuccess(done));
        });

        it('should set the pid in the audit', function(done) {
            expectHttpPost(payload, 'vxSyncServer', '/sync/demographicSync').toAudit('test;demographics');
            req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, expectSuccess(done));
        });

        it('should set the pid in the audit with the icn when pid isn\'t found', function(done) {
            payload.pid = [];
            expectHttpPost(payload, 'vxSyncServer', '/sync/demographicSync').toAudit('testicn');
            req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, expectSuccess(done));
        });

        it('should set the pid in the audit with the edipi when pid and icn aren\'t found', function(done) {
            payload.pid = [];
            payload.icn = null;
            expectHttpPost(payload, 'vxSyncServer', '/sync/demographicSync').toAudit('testedipi');
            req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, expectSuccess(done));
        });

        it('should not use a resultProcessor', function(done) {
            expectHttpPost(payload, 'vxSyncServer', '/sync/demographicSync');
            req.app.subsystems.jdsSync.syncPatientDemographics(payload, req, expectResponse(done, '{}'));
        });
    });

    describe('getOperationalStatus', function() {
        var site = 'testsite';

        it('should get the site from the user', function(done) {
            req.session = {user: {site: 'sessionSite'}};
            expectHttpFetch('jdsServer', '/statusod/sessionSite');
            req.app.subsystems.jdsSync.getOperationalStatus(null, req, expectSuccess(done));
        });

        it('should use the first vista site from the config', function(done) {
            expectHttpFetch('jdsServer', '/statusod/9E7A');
            req.app.subsystems.jdsSync.getOperationalStatus(null, req, expectSuccess(done));
        });

        it('should use the passed-in site', function(done) {
            expectHttpFetch('jdsServer', '/statusod/testsite');
            req.app.subsystems.jdsSync.getOperationalStatus(site, req, expectSuccess(done));
        });

        it('should return a standard error result for errors', function(done) {
            expectHttpFetch('jdsServer', '/statusod/testsite', 407);
            req.app.subsystems.jdsSync.getOperationalStatus(site, req, expectError(done));
        });
    });

    describe('getPatient', function() {
        it('should use the pid path', function(done) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId');
            req.app.subsystems.jdsSync.getPatient(pid, req, expectSuccess(done));
        });

        it('should use the icn path', function(done) {
            pid = 'testicn';
            expectHttpFetch('jdsServer', '/data/index/pt-select-icn?range=testicn');
            req.app.subsystems.jdsSync.getPatient(pid, req, expectSuccess(done));
        });

        it('should return success when the status is 202', function(done) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 202);
            req.app.subsystems.jdsSync.getPatient(pid, req, expectSuccess(done));
        });

        it('should return a standard error result for errors', function(done) {
            expectHttpFetch('jdsServer', '/data/index/pt-select-pid?range=test;patientId', 407);
            req.app.subsystems.jdsSync.getPatient(pid, req, expectError(done));
        });
    });

    describe('getPatientAllSites', function() {
        it('should add the pid to the path', function(done) {
            expectHttpFetch('jdsServer', '/vpr/mpid/test;patientId');
            req.app.subsystems.jdsSync.getPatientAllSites(pid, req, expectSuccess(done));
        });

        it('should return success when the status is 202', function(done) {
            expectHttpFetch('jdsServer', '/vpr/mpid/test;patientId', 202);
            req.app.subsystems.jdsSync.getPatientAllSites(pid, req, expectSuccess(done));
        });

        it('should return a standard error result for errors', function(done) {
            expectHttpFetch('jdsServer', '/vpr/mpid/test;patientId', 407);
            req.app.subsystems.jdsSync.getPatientAllSites(pid, req, expectError(done));
        });
    });

    describe('getJdsStatus', function() {
        it('should add the pid to the path', function(done) {
            expectHttpFetch('jdsServer', '/vpr/test;patientId/count/collection');
            req.app.subsystems.jdsSync.getJdsStatus(pid, req, expectSuccess(done));
        });

        it('should return 404 when a patient isn\'t found', function(done) {
            expectHttpFetch('jdsServer', '/vpr/test;patientId/count/collection', 404);
            req.app.subsystems.jdsSync.getJdsStatus(pid, req, expectError(done, 404, 'pid test;patientId is unsynced'));
        });

        it('should return a standard error result for other errors', function(done) {
            expectHttpFetch('jdsServer', '/vpr/test;patientId/count/collection', 407);
            req.app.subsystems.jdsSync.getJdsStatus(pid, req, expectError(done));
        });
    });

    function buildRequest(request) {
        if (!request) {
            request = httpMocks.createRequest({
                method: 'GET',
                url: '/sync'
            });
        }

        request.param = function(key) {
            return request.params[key];
        };

        request.get = function(key) {
            if (request.headers) {
                return request.headers[key];
            }
            return undefined;
        };

        request.logger = {
            trace: doLog.bind(null, 'trace'),
            debug: doLog.bind(null, 'debug'),
            info: doLog.bind(null, 'info'),
            warn: doLog.bind(null, 'warn'),
            error: doLog.bind(null, 'error')
        };

        request.audit = {};

        request.app = {
            config: {
                jdsServer: {
                    host: 'jdshost',
                    port: 1
                },
                vxSyncServer: {
                    host: 'vxsynchost',
                    port: 2
                },
                hmpServer: {
                    host: 'hmphost',
                    port: 3,
                    accessCode: '9E7A;500',
                    verifyCode: 'ep1234;ep1234!!'
                },
                jdsSync: {
                    settings: {
                        timeoutMillis: 100,
                        waitMillis: 40
                    }
                },
                vistaSites: {
                    '9E7A': {},
                    'C877': {}
                }
            },
            subsystems: {}
        };

        request.app.subsystems.jdsSync = jdsSync;

        return request;
    }

    function doLog(level, stuff) {
        log += level + ': ' + JSON.stringify(stuff) + '\n';
    }

    function stubHttp(content, appConfig, httpConfig, callback, resultProcessor) {
        if (httpExpected.length === 0) {
            throw new Error('Unexpected http call to ' + httpConfig.options.path);
        }
        var http = httpExpected.shift();

        if (http.log) {
            expect(log).to.eql(http.log);
        }
        if (http.auditPatientId) {
            expect(req.audit.patientId).to.equal(http.auditPatientId);
        }

        expect(httpConfig.options.path).to.equal(http.path);
        expect(httpConfig.options.host).to.equal(req.app.config[http.serverName].host);
        expect(httpConfig.options.port).to.equal(req.app.config[http.serverName].port);
        expect(httpConfig.options.method).to.equal(http.method);

        var processor = resultProcessor || function(status, data) {
            return data;
        };
        var processed = processor(http.status, http.response);

        callback(http.error, processed, http.status);
    }

    function expectHttpFetch(serverName, path, status, response, error) {
        var expected = {
            serverName: serverName,
            path: path,
            method: 'GET',
            status: status || 200,
            response: JSON.stringify(response || {}),
            error: error
        };
        httpExpected.push(expected);
        var fluent = {
            toAudit: function(patientId) {
                expected.auditPatientId = patientId;
                return this;
            },
            toLog: function(messages) {
                expected.log = messages || 'log';
                return this;
            }
        };
        fluent.andAudit = fluent.toAudit;
        fluent.andLog = fluent.toLog;
        return fluent;
    }

    function expectHttpPost(payload, serverName, path, status, response, error) {
        var fluent = expectHttpFetch(serverName, path, status, response, error);
        var expected = httpExpected[httpExpected.length-1];
        expected.content = payload;
        expected.method = 'POST';
        return fluent;
    }

    function expectSuccess(done, status) {
        return function(error, result) {
            httpExpected.must.be.empty();
            expect(error).to.be.falsy();
            if (status) {
                expect(result.status).to.equal(status);
            } else if (result && result.status) {
                expect(result.status).to.be.between(200, 202);
            }
            done();
        };
    }

    function expectResponse(done, expected) {
        return function(err, actual) {
            expect(actual).to.eql(expected);
            httpExpected.must.be.empty();
            done();
        };
    }

    function expectError(done, status, message, error) {
        status = status || 500;
        message = message || 'There was an error processing your request. The error has been logged.';
        return function(err, result) {
            if (error) {
                expect(err).to.eql(error);
            }
            if (result.status) {
                expect(result.status).to.equal(status);
            }
            var errorObject = result.error || (result.data || {}).error;
            expect(errorObject.code).to.equal(status);
            if (message) {
                expect(errorObject.message).to.equal(message);
            }
            httpExpected.must.be.empty();
            done();
        };
    }
});

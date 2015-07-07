'use strict';

var _ = require('underscore');

require('../../../env-setup');
var SyncRulesEngine = require(global.VX_SYNCRULES + 'rules-engine');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var wConfig = require(global.VX_ROOT + 'worker-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var patientIdentifiers = [{
    'type': 'pid',
    'value': 'AAAA;1'
}, {
    'type': 'pid',
    'value': 'BBBB;1'
}, {
    'type': 'pid',
    'value': 'DOD;1111111'
}];
var enterpriseSyncJob = {
    'type': 'enterprise-sync-request',
    'patientIdentifier': patientIdentifiers[0],
    'rootJobId': '1',
    'jobId': '1'
};
var vistaAAAAjob = {
    'type': 'vista-AAAA-subscribe-request',
    'patientIdentifier': patientIdentifiers[0],
    'rootJobId': '1',
    'jobId': '2'
};
var vistaBBBBjob = {
    'type': 'vista-BBBB-subscribe-request',
    'patientIdentifier': patientIdentifiers[1],
    'rootJobId': '1',
    'jobId': '3'
};
var jmeadowsJob = {
    'type': 'jmeadows-sync-request',
    'patientIdentifier': patientIdentifiers[2],
    'rootJobId': '1',
    'jobId': '4'
};

var log = require(global.VX_UTILS + 'dummy-logger');
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
        'expiration': {
            'default': 60000
        }
    }
};
var environment = {
    'jds': new JdsClient(log, config)
};

var engine = new SyncRulesEngine(log, config, environment);
var jpid;

describe('expiration-rule-itest', function() {
    beforeEach(function() {
        var finished = false;
        runs(function() {
            environment.jds.storePatientIdentifier({
                'patientIdentifiers': _.pluck(patientIdentifiers, 'value')
            }, function() {
                environment.jds.getPatientIdentifier({
                    'patientIdentifier': patientIdentifiers[0]
                }, function(error, response, result) {
                    jpid = result.jpid;
                    enterpriseSyncJob.jpid =
                        vistaAAAAjob.jpid =
                        vistaBBBBjob.jpid =
                        jmeadowsJob.jpid =
                        jpid;
                    var startedState = _.clone(enterpriseSyncJob);
                    startedState.status = 'started';
                    startedState.timestamp = Date.now().toString();
                    environment.jds.saveJobState(startedState, function() {
                        finished = true;
                    });
                });
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets all identifiers through when unsynced', function() {
        var finished = false;
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                expect(val(ids, 'length')).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('intercepts identifiers for non-expired data when not forced', function() {
        var finished = false;
        runs(function() {
            var completedEnterpriseJob = _.clone(enterpriseSyncJob);
            completedEnterpriseJob.status = 'completed';
            completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

            var completedDodJob = _.clone(jmeadowsJob);
            completedDodJob.status = 'completed';
            completedDodJob.timestamp = (Date.now() - 9000).toString();

            environment.jds.saveJobState(completedEnterpriseJob, function() {
                environment.jds.saveJobState(completedDodJob, function() {
                    engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                        expect(val(ids, 'length')).toBe(2);
                        finished = true;
                    });
                });
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through for forced jobs on non-expired data', function() {
        var finished = false;
        runs(function() {
            var completedEnterpriseJob = _.clone(enterpriseSyncJob);
            completedEnterpriseJob.status = 'completed';
            completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

            var completedDodJob = _.clone(jmeadowsJob);
            completedDodJob.status = 'completed';
            completedDodJob.timestamp = (Date.now() - 9000).toString();

            environment.jds.saveJobState(completedEnterpriseJob, function() {
                environment.jds.saveJobState(completedDodJob, function() {
                    engine.getSyncPatientIdentifiers(patientIdentifiers, true, function(error, ids) {
                        expect(val(ids, 'length')).toBe(3);
                        finished = true;
                    });
                });
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through for a forced site on non-expired data', function() {
        var finished = false;
        runs(function() {
            var completedEnterpriseJob = _.clone(enterpriseSyncJob);
            completedEnterpriseJob.status = 'completed';
            completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

            var completedDodJob = _.clone(jmeadowsJob);
            completedDodJob.status = 'completed';
            completedDodJob.timestamp = (Date.now() - 9000).toString();

            environment.jds.saveJobState(completedEnterpriseJob, function() {
                environment.jds.saveJobState(completedDodJob, function() {
                    engine.getSyncPatientIdentifiers(patientIdentifiers, ['dod'], function(error, ids) {
                        expect(val(ids, 'length')).toBe(3);
                        finished = true;
                    });
                });
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through on expired data', function() {
        var finished = false;
        runs(function() {
            var completedEnterpriseJob = _.clone(enterpriseSyncJob);
            completedEnterpriseJob.status = 'completed';
            completedEnterpriseJob.timestamp = (Date.now() - 10000000).toString();

            var completedDodJob = _.clone(jmeadowsJob);
            completedDodJob.status = 'completed';
            completedDodJob.timestamp = (Date.now() - 90000000).toString();

            environment.jds.saveJobState(completedEnterpriseJob, function() {
                environment.jds.saveJobState(completedDodJob, function() {
                    engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                        expect(val(ids, 'length')).toBe(3);
                        finished = true;
                    });
                });
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    afterEach(function() {
        var finished = false;
        runs(function() {
            environment.jds.deletePatientByPid(patientIdentifiers[0].value, function() {
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        }, 10000);
    });
});
'use strict';

var _ = require('underscore');

require('../../../env-setup');
var SyncRulesEngine = require(global.VX_SYNCRULES + 'rules-engine');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var expirationRule = require(global.VX_SYNCRULES + 'expiration-rule');

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
var jmeadowsDomainSyncJob = {
    'type': 'jmeadows-sync-allergy-request',
    'patientIdentifier': patientIdentifiers[2],
    'rootJobId': '1',
    'jobId': '5'
};

var log = require(global.VX_UTILS + 'dummy-logger');
var config = {
    vistaSites: {
        'AAAA': {},
        'BBBB': {}
    },
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    },
    rules: {
        'expiration': {
            'default': 60000
        }
    }
};
var environment = {
    'jds': new JdsClient(log, config),
    'metrics': log
};

var engine = new SyncRulesEngine(log, config, environment);

describe('expiration-rule-itest', function() {

    it('lets all identifiers through when unsynced', function() {
        var finished = false;
        var startedState = _.clone(enterpriseSyncJob);
        startedState.jpid = 'JPID';
        startedState.status = 'started';
        startedState.timestamp = Date.now().toString();
        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [startedState]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                expect(ids.length).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('intercepts identifiers for non-expired data when not forced', function() {
        var finished = false;

        var completedEnterpriseJob = _.clone(enterpriseSyncJob);
        completedEnterpriseJob.status = 'completed';
        completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

        var completedDodJob = _.clone(jmeadowsJob);
        completedDodJob.status = 'completed';
        completedDodJob.timestamp = (Date.now() - 9000).toString();

        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [completedEnterpriseJob, completedDodJob]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                expect(ids.length).toBe(2);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through for forced jobs on non-expired data', function() {
        var finished = false;

        var completedEnterpriseJob = _.clone(enterpriseSyncJob);
        completedEnterpriseJob.status = 'completed';
        completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

        var completedDodJob = _.clone(jmeadowsJob);
        completedDodJob.status = 'completed';
        completedDodJob.timestamp = (Date.now() - 9000).toString();

        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [completedEnterpriseJob, completedDodJob]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, true, function(error, ids) {
                expect(ids.length).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through for a forced site on non-expired data', function() {
        var finished = false;

        var completedEnterpriseJob = _.clone(enterpriseSyncJob);
        completedEnterpriseJob.status = 'completed';
        completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

        var completedDodJob = _.clone(jmeadowsJob);
        completedDodJob.status = 'completed';
        completedDodJob.timestamp = (Date.now() - 9000).toString();

        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [completedEnterpriseJob, completedDodJob]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, ['dod'], function(error, ids) {
                expect(ids.length).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through on expired data', function() {
        var finished = false;

        var completedEnterpriseJob = _.clone(enterpriseSyncJob);
        completedEnterpriseJob.status = 'completed';
        completedEnterpriseJob.timestamp = (Date.now() - 10000000).toString();

        var completedDodJob = _.clone(jmeadowsJob);
        completedDodJob.status = 'completed';
        completedDodJob.timestamp = (Date.now() - 90000000).toString();

        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [completedEnterpriseJob, completedDodJob]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                expect(ids.length).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    it('lets identifiers through for secondary sites with error jobs', function() {
        var finished = false;

        var completedEnterpriseJob = _.clone(enterpriseSyncJob);
        completedEnterpriseJob.status = 'completed';
        completedEnterpriseJob.timestamp = (Date.now() - 10000).toString();

        var completedDodJob = _.clone(jmeadowsJob);
        completedDodJob.status = 'completed';
        completedDodJob.timestamp = (Date.now() - 9000).toString();

        var errorDodJob = _.clone(jmeadowsDomainSyncJob);
        errorDodJob.status = 'error';
        completedDodJob.timestamp = (Date.now() - 9000).toString();

        environment.jds._setResponseData([null, null], ['', {
            'statusCode': 200
        }], [{
            'items': [completedEnterpriseJob, completedDodJob, errorDodJob]
        }, {}]);
        runs(function() {
            engine.getSyncPatientIdentifiers(patientIdentifiers, [], function(error, ids) {
                expect(ids.length).toBe(3);
                finished = true;
            });
        });

        waitsFor(function() {
            return finished;
        });
    });

    describe('getSecondaryPidsWithErrorJobs', function() {
        it('returns pids that correspond to errored secondary jobs', function() {
            var secondaryPids = ['DOD;1111', 'HDR;2222', 'YYY;3333'];
            var jobs = [{
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-allergy-request',
                status: 'error'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-progressNote-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'HDR;2222'
                },
                type: 'hdr-sync-allergy-request',
                status: 'error'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'AAAA;0000'
                },
                type: 'vista-AAAA-subscribe-request',
                status: 'completed'
            }];
            var errorPids = expirationRule._steps._getSecondaryPidsWithErrorJobs(secondaryPids, jobs, log);
            expect(errorPids).toContain('DOD;1111');
            expect(errorPids).toContain('HDR;2222');
            //console.log(errorPids);
        });
        it('does not return pids for secondary site where all jobs are completed', function() {
            var secondaryPids = ['DOD;1111', 'HDR;2222', 'YYY;3333'];
            var jobs = [{
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-allergy-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-progressNote-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'HDR;2222'
                },
                type: 'hdr-sync-allergy-request',
                status: 'error'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'AAAA;0000'
                },
                type: 'vista-AAAA-subscribe-request',
                status: 'completed'
            }];
            var errorPids = expirationRule._steps._getSecondaryPidsWithErrorJobs(secondaryPids, jobs, log);
            expect(errorPids).toContain('HDR;2222');
            //console.log(errorPids);
        });
        it('does not return any pids when all secondary jobs are successfully completed', function() {
            var secondaryPids = ['DOD;1111', 'HDR;2222', 'YYY;3333'];
            var jobs = [{
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-allergy-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'DOD;1111'
                },
                type: 'jmeadows-sync-progressNote-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'HDR;2222'
                },
                type: 'hdr-sync-allergy-request',
                status: 'completed'
            }, {
                patientIdentifier: {
                    type: 'pid',
                    value: 'AAAA;0000'
                },
                type: 'vista-AAAA-subscribe-request',
                status: 'completed'
            }];
            var errorPids = expirationRule._steps._getSecondaryPidsWithErrorJobs(secondaryPids, jobs, log);
            expect(errorPids).toEqual([]);
            //console.log(errorPids);
        });
    });
});
'use strict';

require('../../../env-setup');

var jds = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var jsu = require(global.VX_JOBFRAMEWORK + 'JobStatusUpdater');
var log = require(global.VX_UTILS + 'dummy-logger');
var config = {
    'jds': {}
};
var job = {
    'rootJobId': '1',
    'jpid': 'X',
    'type': 'enterprise-sync-request',
    'patientIdentifier': {
        'type': 'pid',
        'value': 'AAAA;3'
    }
};

var client = new jds(log.console, config);
var updater = new jsu(log, config, client);

describe('jobStatusUpdater-spec.js', function() {
    //
    it('writes job states', function() {
        //
        updater.startJobStatus(job, function() {
            expect(client.responseIndex).toBe(1);
        });
    });

    it('writes error states', function() {
        //
        updater.errorJobStatus(job, 'error test', function() {
            expect(client.responseIndex).toBe(2);
        });
    });
});
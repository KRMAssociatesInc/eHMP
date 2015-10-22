'use strict';
require('../../../env-setup');
var SyncRulesEngine = require(global.VX_SYNCRULES + '/rules-engine');

var _ = require('underscore');
var log = {
    debug: function() {},
    warn: function(){},
    trace: function(){},
    info: function(){}
};
var config = {};
var environment = {
    metrics: log
};
var acceptAll = require(global.VX_SYNCRULES + '/accept-all-rule');
var rejectAll = require(global.VX_SYNCRULES + '/reject-all-rule');

describe('rules-engine.js', function(){
    var engine = new SyncRulesEngine(log, config, environment);
    var patientIds = [{value:'9E7A;3', type:'PID'},{value:'302394234V323425', type:'ICN'},{value:'DOD;0000000003',type:'PID'}];
    it('accept all', function(){
        engine.rules = [acceptAll];
        engine.getSyncPatientIdentifiers(patientIds, function(err, result) {
            expect(result).toBe(patientIds);
        });
    });
    it('reject all', function(){
        engine.rules = [rejectAll];
        engine.getSyncPatientIdentifiers(patientIds, function(err, result) {
            expect(_.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(0);
            expect(result).toEqual([ ]);
        });
    });
});
'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var realConfig = require(global.VX_ROOT + 'worker-config');
var handle = require(global.VX_HANDLERS + 'jmeadows-sync-domain-request/jmeadows-sync-domain-request-handler');

var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var VistaClientDummy = require(global.VX_SUBSYSTEMS + 'vista/vista-client-dummy');
var jobStatusUpdaterDummy = require(global.VX_JOBFRAMEWORK + '/JobStatusUpdaterDummy');
var config = {
    'jmeadows': {
            'domains': ['allergy'
            ],
            'allergy': {
                'host':'localhost',
                'port':54055,
                'path':'/dod/allergy',
                'method': 'GET'
            }
        },
};

// dummyLogger = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

describe('jmeadows-sync-domain-request-handler.js', function() {
    var environment = {
        vistaClient: new VistaClientDummy(dummyLogger, config, null),
        jobStatusUpdater: jobStatusUpdaterDummy,
        publisherRouter:{
            publish: function(job, callback){
                expect(job.record).toBeDefined();
                callback(null);
            }
        }
    };

    it('Bad Patient ID 1', function(){
        var callback = jasmine.createSpy('callback');
        runs(function(){
            handle(dummyLogger, config, environment, {type:'pid',value:'9E7A;3'}, callback);
        });

        waitsFor(function() {
            return (callback.callCount > 0);
            }, 'Handler never invoked', 750);

        runs(function() {
            expect(callback).toHaveBeenCalled();
            expect(callback.mostRecentCall.args[0]).toBeTruthy();
        });

    });

    it('Bad Patient ID 2', function(){
        var callback = jasmine.createSpy('callback');
        runs(function(){
            handle(dummyLogger, config, environment, '3', callback);
        });

        waitsFor(function() {
            return (callback.callCount > 0);
            }, 'Handler never invoked', 750);

        runs(function() {
            expect(callback).toHaveBeenCalled();
            expect(callback.mostRecentCall.args[0]).toBeTruthy();
        });

    });

    it('Bad domain', function(){
        var callback = jasmine.createSpy('callback');
        runs(function(){
            handle(dummyLogger, config, environment, {patientIdentifier: {type:'edipi', value:'0000000003'},dataDomain: 'stuff'}, callback);
        });

        waitsFor(function() {
            return (callback.callCount > 0);
            }, 'Handler never invoked', 750);

        runs(function() {
            expect(callback).toHaveBeenCalled();
            expect(callback.mostRecentCall.args[0]).toBeTruthy();
        });

    });

    it('All Configured domains are OK', function(){
        var dummyJob = {patientIdentifier:{value:'123'}};
        _.each(realConfig.jmeadows.domains, function(value) {
            var domainJob = _.extend({},dummyJob);
            domainJob.dataDomain = value;
            var domainConfig = handle._getDomainConfiguration(dummyLogger,realConfig,domainJob);
            expect(domainConfig).toBeTruthy();
        });

    });
});
'use strict';

require('../../../../env-setup');
var _ = require('underscore');

var logger = require(global.VX_UTILS + 'dummy-logger');
// logger = require('bunyan').createLogger({
//     name: 'publish-vx-data-change-request-handler-spec',
//     level: 'debug'
// });
// logger = {
//     level: 1,
//     trace: function(message) {
//         if(this.level <= 0) {console.log('TRACE\t'+ message);}
//     },
//     debug: function(message) {
//         if(this.level <= 1) {console.log('DEBUG\t'+message);}
//     },
//     info: function(message) {
//         if(this.level <= 2) {console.log('INFO\t'+message);}
//     },
//     warn: function(message) {
//         if(this.level <= 3) {console.log('WARN\t'+message);}
//     },
//     error: function(message) {
//         if(this.level <= 4) {console.log('ERROR\t'+message);}
//     },
//     fatal: function(message) {
//         if(this.level <= 5) {console.log('FATAL\t'+message);}
//     }
// };

var handler = require(global.VX_HANDLERS + 'publish-vx-data-change-request/publish-vx-data-change-request-handler');
var wConfig = require(global.VX_ROOT + 'worker-config');

var job = {
    type: 'publish-data-change-event',
    patientIdentifier: { type: 'pid', value: 'DOD;4325678' },
    jpid: '39b4d293-90dc-442c-aa9c-4c58191340ea',
    rootJobId: '1',
    dataDomain: 'document',
    record: {
        referenceDateTime: '20100622112945',
        codes: [ {} ],
        localTitle: 'Progress Note',
        documentTypeName: 'Progress Note',
        status: 'completed',
        statusName: 'completed',
        facilityName: 'DOD',
        facilityCode: 'DOD',
        uid: 'urn:va:document:DOD:4325678:1000004203',
        pid: 'DOD;4325678',
        text: [ {} ],
        dodComplexNoteUri: 'http://127.0.0.1:8089/documents?dir=444f443b34333235363738/1000004203&file=da39a3ee5e6b4b0d3255bfef95601890afd80709.html',
        stampTime: '20150506125559',
        isInterdisciplinary: 'false',
        summary: 'Progress Note',
        kind: 'Progress Note',
        statusDisplayName: 'Completed',
        clinicians: []
    }
};

var environment = {
    publisherRouter: {publish:function(jobs, callback){
        callback(jobs);
    }}
};

describe('publish-vx-data-change-request-handler.js', function() {

    it('no publish tubes', function() {
        var config = {
            beanstalk: wConfig.beanstalk,
            publishTubes: []
        };

        handler(logger, config, environment, job, function(result, error){
            expect(result).toBeUndefined();
            expect(error).toBeUndefined();
        });
    });

    it('publish to single tube', function() {
        var matchingJobTypes = [];
        var config = {
            beanstalk: wConfig.beanstalk,
            publishTubes: ['published-change-event']
        };

        _.each(config.publishTubes, function(tubeName){
            config.beanstalk.jobTypes[tubeName] = {};
            matchingJobTypes.push(tubeName);
        });

        handler(logger, config, environment, job, function(result, error){
            expect(error).toBeUndefined();
            expect(result).toBeDefined();
            if(_.isArray(result)) {
                expect(result.length).toEqual(matchingJobTypes.length);
                var jobTypes = _.pluck(result, 'type');
                _.each(result, function(item){
                    expect(_.contains(jobTypes, item.type));
                });
            } else {
                expect(result.type).toEqual(matchingJobTypes[0]);
            }
        });
    });

    it('publish multiple tubes', function() {
        var matchingJobTypes = [];
        var config = {
            beanstalk: wConfig.beanstalk,
            publishTubes: ['published-change-event-1', 'published-change-event-2', 'published-change-event-3']
        };

        _.each(config.publishTubes, function(tubeName){
            config.beanstalk.jobTypes[tubeName] = {};
            matchingJobTypes.push(tubeName);
        });

        handler(logger, config, environment, job, function(result, error){
            expect(error).toBeUndefined();
            expect(result).toBeDefined();
            expect(_.isArray(result)).toBeTruthy();
            expect(result.length).toEqual(matchingJobTypes.length);
            var jobTypes = _.pluck(result, 'type');
            _.each(result, function(item){
                expect(_.contains(jobTypes, item.type));
            });
        });
    });
});

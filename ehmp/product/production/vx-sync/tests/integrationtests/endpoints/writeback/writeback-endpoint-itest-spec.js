'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var moment = require('moment');
var request = require('request');
var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');
var logger = require(global.VX_UTILS + 'dummy-logger');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var wConfig = require(global.VX_ROOT + 'worker-config');
var port = 9090;
var jds = new JdsClient(logger, wConfig);
var tstPid = '9E7A;3';

var httpConfig = {
    path: '/writeback',
    method: 'POST',
    port: port,
    json: true,
    host: vx_sync_ip,
    url: 'http://' + vx_sync_ip + ':' + port + '/writeback',
    timeout: 60000
};
var recordBody = {
    'drugClasses': [{
        'code': 'AM114',
        'name': 'PENICILLINS AND BETA-LACTAM ANTIMICROBIALS',
        'summary': 'AllergyDrugClass{uid=\'\'}'
    }],
    'entered': '200503172009',
    'facilityCode': '500',
    'facilityName': 'CAMP MASTER',
    'historical': true,
    'kind': 'Allergy\/Adverse Reaction',
    'lastUpdateTime': '20150317200936',
    'localId': '751',
    'mechanism': 'PHARMACOLOGIC',
    'originatorName': 'VEHU,EIGHT',
    'products': [{
        'name': 'PENICILLIN',
        'summary': 'AllergyProduct{uid=\'\'}',
        'vuid': 'urn:va:vuid:'
    }],
    'reactions': [{
        'name': 'ITCHING,WATERING EYES',
        'summary': 'AllergyReaction{uid=\'\'}',
        'vuid': 'urn:va:vuid:'
    }],
    'reference': '125;GMRD(120.82,',
    'stampTime': '20050317200936',
    'summary': 'PENICILLIN',
    'typeName': 'DRUG',
    'uid': 'urn:va:allergy:9E7A:3:751',
    'verified': '20050317200936',
    'verifierName': '<auto-verified>'
};
var dateFormat = 'YYYYMMDDHHmmss';

xdescribe('writeback-endpoint', function() {
    //ensure patient is synced
    // beforeEach(function() {
    //     var patientIsSynced = false;
    //     var syncStatus;
    //     runs(function() {
    //         jds.getSyncStatus({
    //             type: 'pid',
    //             value: recordBody.pid
    //         }, function(error, jdsResponse, jdsBody) {
    //             if (!error) {
    //                 if (jdsResponse.statusCode === 404) {
    //                     var syncConfig = _.clone(httpConfig);
    //                     syncConfig.port = 8080;
    //                     syncConfig.url = 'http://' + vx_sync_ip + ':' + syncConfig.port + '/sync/doLoad';
    //                     syncConfig.path = '/sync/doLoad';
    //                     syncConfig.method = 'GET';
    //                     syncConfig.qs = {
    //                         pid: recordBody.pid
    //                     };
    //                     console.log('writeback-endpoint-itest-spec syncing patient');
    //                     request(syncConfig, function(err, response) {
    //                         syncStatus = setInterval(function() {
    //                             logger.debug('writeback-endpoint-itest-spec checking sync status');
    //                             if (!patientIsSynced) {
    //                                 jds.getSyncStatus({
    //                                     type: 'pid',
    //                                     value: recordBody.pid
    //                                 }, function(error, jdsResponse, jdsBody) {
    //                                     if (!error) {
    //                                         if (jdsResponse && jdsResponse.statusCode === 200) {
    //                                             if (jdsBody && jdsBody.completedStamp) {
    //                                                 var completedSites = _.keys(jdsBody.completedStamp.sourceMetaStamp);
    //                                                 logger.debug(completedSites);
    //                                                 if (jdsBody.completedStamp.sourceMetaStamp['9E7A']) {
    //                                                     patientIsSynced = true;
    //                                                     clearInterval(syncStatus);
    //                                                 }
    //                                             } else {
    //                                                 logger.debug('writeback-endpoint-itest-spec:101 no completedStamp\n' + JSON.stringify(_.keys(jdsBody)));
    //                                             }
    //                                         }
    //                                     } else {
    //                                         logger.error('writeback-endpoint-itest-spec:101 ' + JSON.stringify(error));
    //                                     }
    //                                 });
    //                             }
    //                         }, 10000);
    //                     });
    //                 } else {
    //                     if (jdsBody && jdsBody.completedStamp && jdsBody.completedStamp.sourceMetaStamp['9E7A']) {
    //                         patientIsSynced = true;
    //                     }
    //                 }
    //             } else {
    //                 logger.error('writeback-endpoint-itest-spec:113 ' + JSON.stringify(error));
    //             }
    //         });
    //     });

    //     waitsFor(function() {
    //         return patientIsSynced;
    //     }, 'patient 9E7A;3 to sync', 950000);
    //     clearInterval(syncStatus);
    // });

    it('happy path', function() {
        var config = _.clone(httpConfig);
        var nowMoment = moment();
        nowMoment.add(1, 'days'); //make sure this is far enough in the future to prevent conflict with current sync time
        var now = nowMoment.format(dateFormat);
        var body1 = _.clone(recordBody);
        body1.lastUpdateTime = now;
        body1.verified = now;
        delete body1.reactions[0].summary;
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(200);
            jds.getSyncStatus({
                type: 'pid',
                value: tstPid
            }, function(error, jdsResponse, jdsBody) {
                expect(error).toBeFalsy();
                expect(jdsResponse.statusCode).toBe(200);
                expect(jdsBody).toBeTruthy();
                var expectedStampTime = now - 1;
                var stampTime = jdsBody.completedStamp.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.stampTime;
                expect(String(stampTime)).toBe(String(expectedStampTime));
            });
        });
    });
    it('No UID', function() {
        var config = _.clone(httpConfig);
        var now = moment().format(dateFormat);
        var body1 = _.clone(recordBody);
        body1.lastUpdateTime = now;
        delete body1.uid;
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(400);
        });
    });
    it('Malformed UID', function() {
        var config = _.clone(httpConfig);
        var now = moment().format(dateFormat);
        var body1 = _.clone(recordBody);
        body1.lastUpdateTime = now;
        body1.uid = 'urn:va:allergy:9E7A:3:751:somethingelse';
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(400);
        });
    });
    it('Malformed Date', function() {
        var config = _.clone(httpConfig);
        var now = moment().format('x');
        var body1 = _.clone(recordBody);
        body1.lastUpdateTime = now;
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(400);
        });
    });
    it('No lastUpdateTime', function() {
        var config = _.clone(httpConfig);
        var body1 = _.clone(recordBody);
        delete body1.lastUpdateTime;
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(400);
        });
    });
    it('No POST body', function() {
        var config = _.clone(httpConfig);

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(400);
        });
    });
    it('Outdated update time', function() {
        var config = _.clone(httpConfig);
        var old = '20060304123456';
        var body1 = _.clone(recordBody);
        body1.lastUpdateTime = old;
        body1.verified = old;
        config.body = body1;

        request(config, function(err, response) {
            expect(err).toBeFalsy();
            expect(response.statusCode).toBe(200);
            jds.getSyncStatus({
                type: 'pid',
                value: tstPid
            }, function(error, jdsResponse, jdsBody) {
                expect(error).toBeFalsy();
                expect(jdsResponse.statusCode).toBe(200);
                expect(jdsBody).toBeTruthy();
                var stampTime = jdsBody.completedStamp.sourceMetaStamp['9E7A'].domainMetaStamp.allergy.stampTime;
                expect(moment(stampTime, dateFormat).isAfter(moment(old, dateFormat))).toBeTruthy();
            });
        });
    });
});
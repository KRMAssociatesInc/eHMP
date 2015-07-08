'use strict';

var _ = require('underscore');
var nock = require('nock');
var format = require('util').format;
var querystring = require('querystring');

require('../../../../env-setup');
var log = require(global.VX_UTILS + 'dummy-logger');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var MviClient = require(global.VX_SUBSYSTEMS + 'mvi/mvi-client');
// log = require('bunyan').createLogger({
//     name: 'test',
//     level: 'debug'
// });

var config = {
    mvi: {
        protocol: 'http',
        host: '127.0.0.1',
        port: 3001,
        path: '/mvi'
    }
};

var patientFullId = {
    type: 'icn',
    value: '10110V004877'
};

var patientFull = {
    name: 'Ten,Patient',
    ids: [{
        type: 'icn',
        value: '10110V004877'
    }, {
        type: 'edipi',
        value: '10110'
    }, {
        type: 'pid',
        value: 'C877;8'
    }, {
        type: 'pid',
        value: '9E7A;8'
    }]
};
var jds = {};   //not used in unit tests

var url = format('%s://%s:%s', config.mvi.protocol, config.mvi.host, config.mvi.port);

//mvi(log, config.mvi, patientId, callback)

describe('mvi-client.js', function() {
    var mviClient = new MviClient(log, config, jds);

    it('construct results', function() {
        var idList = '3^PI^9E7A^USVHA^P\r\n2^PI^C877^USVHA\r\n00003^NI^200DOD^USDOD^H\r\n32435V23462^NI^200M^USVHA';
        mviClient._parseVistaMVIResponse(patientFullId, idList, function(err, result) {
            expect(err).toBeFalsy();
            expect(_.isArray(result.ids)).toBeTruthy();
            expect(result.ids.length).toEqual(4);
        });
    });
    it('parsing error response', function() {
        var idList = '-1^Unknown Authority';
        mviClient._parseVistaMVIResponse(patientFullId, idList, function(err) {
            expect(err).toBeTruthy();
        });
    });
    it('parsing mvi soap response', function() {
        var mviResponse = {
            controlActProcess: {
                queryAck: {
                    queryResponseCode: {
                        code: 'OK'
                    }
                },
                subject: [{
                    registrationEvent: {
                        subject1: {
                            patient: {
                                id: [{
                                    extension: '3^PI^9E7A^USVHA^P'
                                }, {
                                    extension: '2^PI^C877^USVHA'
                                }, {
                                    extension: '00003^NI^200DOD^USDOD^H'
                                }, {
                                    extension: '32435V23462^NI^200M^USVHA'
                                }]
                            }
                        }
                    }
                }]
            }
        };
        mviClient._parseRealMVIResponse(patientFullId, mviResponse, function(err, result) {
            expect(err).toBeFalsy();
            expect(_.isArray(result.ids)).toBeTruthy();
            expect(result.ids.length).toEqual(4);
        });
    });

    it('parsing mvi soap response patient not found', function() {
        var mviResponse = {
            controlActProcess: {
                queryAck: {
                    queryResponseCode: {
                        code: 'NF'
                    }
                }
            }
        };
        mviClient._parseRealMVIResponse(patientFullId, mviResponse, function(err) {
            expect(err).toBeTruthy();
        });
    });

    it('parsing mvi soap response other error', function() {
        var mviResponse = {
            controlActProcess: {
                queryAck: {
                    queryResponseCode: {
                        code: 'AE'
                    }
                }
            }
        };
        mviClient._parseRealMVIResponse(patientFullId, mviResponse, function(err) {
            expect(err).toBeTruthy();
        });
    });

    xit('parsing mvi soap response incorrect response', function() {
        var mviResponse = {};
        mviClient._parseRealMVIResponse(patientFullId, mviResponse, function(err) {
            expect(err).toBeTruthy();
        });
    });

    it('handle real mvi json response - ok', function(){
        var okFile = fsUtil.readFileSync('./tests/data/mvi/mviCorrespondingIdsOK.json');
        if(Buffer.isBuffer(okFile)) {
            okFile = okFile.toString('UTF-8');
            okFile = JSON.parse(okFile);
        }

        mviClient._parseRealMVIResponse(patientFullId, okFile, function(err, result) {
            expect(err).toBeFalsy();
            expect(_.isArray(result.ids)).toBeTruthy();
            expect(result.ids.length).toEqual(3);
        });
    });

    it('handle real mvi json response - not found', function(){
        var errFile = fsUtil.readFileSync('./tests/data/mvi/mviCorrespondingIdsNotFound.json');
        if(Buffer.isBuffer(errFile)) {
            errFile = errFile.toString('UTF-8');
            errFile = JSON.parse(errFile);
        }

        mviClient._parseRealMVIResponse(patientFullId, errFile, function(err) {
            expect(err).toBeTruthy();
        });
    });


    //Old mock mvi test suite
    xdescribe('fetch()', function() {
        it('500 code', function() {
            nock(url)
                .get(format('%s?%s', config.mvi.path, querystring.stringify({
                    id: '500',
                    type: 'icn'
                })))
                .reply(500, 'Unknown error');

            var mviError;
            var mviResult;

            new MviClient(log, config).lookup({
                value: '500',
                type: 'icn'
            }, function(error, result) {
                mviError = error;
                mviResult = result;
            });

            waitsFor(function() {
                return mviError || mviResult;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(mviError).not.toBeUndefined();
            });
        });

        it('400 code', function() {
            nock(url)
                .get(format('%s?%s', config.mvi.path, querystring.stringify({
                    id: '400',
                    type: 'icn'
                })))
                .reply(400, 'No value for id');

            var mviError;
            var mviResult;

            new MviClient(log, config).lookup({
                value: '400',
                type: 'icn'
            }, function(error, result) {
                mviError = error;
                mviResult = result;
            });

            waitsFor(function() {
                return mviError || mviResult;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(mviError).not.toBeUndefined();
            });
        });

        it('404 code', function() {
            nock(url)
                .get(format('%s?%s', config.mvi.path, querystring.stringify({
                    id: '404',
                    type: 'icn'
                })))
                .reply(404, 'No patient found');

            var mviError;
            var mviResult;

            new MviClient(log, config).lookup({
                value: '404',
                type: 'icn'
            }, function(error, result) {
                mviError = error;
                mviResult = result;
            });

            waitsFor(function() {
                return mviError || mviResult;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(mviError).not.toBeUndefined();
            });
        });

        it('Bad JSON', function() {
            nock(url)
                .get(format('%s?%s', config.mvi.path, querystring.stringify({
                    id: 'json',
                    type: 'icn'
                })))
                .reply(200, '{ not valid jason');

            var mviError;
            var mviResult;

            new MviClient(log, config).lookup({
                value: 'json',
                type: 'icn'
            }, function(error, result) {
                mviError = error;
                mviResult = result;
            });

            waitsFor(function() {
                return mviError || mviResult;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(mviError).not.toBeUndefined();
            });
        });

        it('Valid result', function() {
            nock(url)
                .get(format('%s?%s', config.mvi.path, querystring.stringify({
                    id: patientFullId.value,
                    type: patientFullId.type
                })))
                .reply(200, JSON.stringify(patientFull));

            var mviError;
            var mviResult;

            new MviClient(log, config).lookup({
                value: patientFullId.value,
                type: patientFullId.type
            }, function(error, result) {
                mviError = error;
                mviResult = result;
            });

            waitsFor(function() {
                return mviError || mviResult;
            }, 'should return an error or result that is not undefined', 1000);

            runs(function() {
                expect(mviResult).toEqual(patientFull);
            });
        });
    });
});
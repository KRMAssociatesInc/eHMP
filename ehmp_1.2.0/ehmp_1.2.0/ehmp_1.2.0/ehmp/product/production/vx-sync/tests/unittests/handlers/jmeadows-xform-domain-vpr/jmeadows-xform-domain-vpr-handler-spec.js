'use strict';

require('../../../../env-setup');
var _ = require('underscore');
var util = require('util');
var moment = require('moment');

var handler = require(global.VX_HANDLERS + 'jmeadows-xform-domain-vpr/jmeadows-xform-domain-vpr-handler');
var log = require(global.VX_UTILS + 'dummy-logger');
// NOTE: be sure next lines are commented out before pushing
// log = require('bunyan').createLogger({
//     name: 'jmeadows-xform-domain-vpr-handler-spec',
//     level: 'debug'
// });

var mockConfig = {
    jmeadows: {
        domains: ['allergy']
    },
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    }
};

var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var jdsClientDummy = new JdsClientDummy(log, mockConfig);

var mockEnvironment = {
    publisherRouter: {
        publish: function(jobsToPublish, callback) {
            callback(null, 'success');
        }
    },
    jds: jdsClientDummy
};
var mockHandlerCallback = {
    callback: function(error, response) {
        // console.log('callback');
        // console.log(error);
        // console.log(response);
    }
};
var dodItems = require('../../../data/secondary/jmeadows/allergySoap');

describe('jmeadows-xform-domain-vpr-handler', function() {

    describe('xformItemCollection', function() {

        var mockRequestStampTime = '20140113154827.356';

        var allergyXformer = require('../../../../handlers/jmeadows-xform-domain-vpr/jmeadows-allergy-xformer');

        var mockEdipi = '00000099';

        var sampleDODAllergy = {
            cdrEventId: 1000001128,
            codes: [{
                code: 7090000,
                system: 'DOD_ALLERGY_IEN'
            }, {
                code: 'C0037494',
                display: 'Sodium Chloride',
                system: 'UMLS'
            }],
            site: {
                agency: 'DOD',
                moniker: 'NH Great Lakes IL/0056',
                name: 'AHLTA',
                siteCode: '2.16.840.1.113883.3.42.126.100001.13'
            },
            sourceProtocol: 'DODADAPTER',
            allergyName: 'SODIUM CHLORIDE {Class}',
            uid: 'urn:va:allergy:DOD:00000099:1000001128',
            comment: 'Nausea'
        };

        var sampleVPRAllergy = {
            products: [{
                name: 'SODIUM CHLORIDE {Class}'
            }],
            summary: 'SODIUM CHLORIDE {Class}',
            codes: [{
                code: 7090000,
                system: 'DOD_ALLERGY_IEN'
            }, {
                code: 'C0037494',
                display: 'Sodium Chloride',
                system: 'urn:oid:2.16.840.1.113883.6.86'
            }],
            comments: [{
                comment: 'Nausea'
            }],
            facilityName: 'DOD',
            facilityCode: 'DOD',
            kind: 'Allergy/Adverse Reaction',
            uid: 'urn:va:allergy:DOD:00000099:1000001128',
            pid: 'DOD;00000099',
            stampTime: '20140113154827.356'
        };

        var sampleItemCollection =
            [
                null, {
                    site: {
                        agency: 'VA',
                        moniker: 'VA',
                        name: 'VA',
                        siteCode: 'VA'
                    },
                    allergyName: 'Connection unavailable.'
                }, {
                    site: {
                        agency: 'DOD',
                        moniker: 'DODADAPTER_SOURCE_STATUS_REPORT',
                        name: 'DODADAPTER_SOURCE_STATUS_REPORT',
                        siteCode: 'DOD'
                    },
                    allergyName: '<div class=\'title\'>Source Status List<\/div><table><thead><th scope=\'col\' class=\'table-header\'>Source Name<\/th><th scope=\'col\' class=\'table-header\'>Source Status<\/th><\/thead><tbody><tr class=\'even\'><td>AHLTA<\/td><td>UNKNOWN, IN_PROGRESS, COMPLETE<\/td><\/tr><tr class=\'odd\'><td>SHARE:  PORTSMOUTH<\/td><td>UNKNOWN, IN_PROGRESS, COMPLETE_WITH_ERRORS<\/td><\/tr><tr class=\'even\'><td>VA<\/td><td>UP, IN_PROGRESS, COMPLETE<\/td><\/tr><\/tbody><\/table><br/><br/><div class=\'title\'>Errors<\/div><table><thead><th scope=\'col\' colspan=\'2\' class=\'table-header\'>Error Code<\/th><\/thead><tr class=\'even\'><td align=\'center\'><div style=\'margin:10px;background-color:red;width:15px;\'><\/div><\/td><td>XDSRepositoryError<\/td><\/tr><\/tbody><\/table>'
                },
                sampleDODAllergy
            ];

        var vprItems = handler._steps._xformItemCollection(log, 'allergy', sampleItemCollection, mockEdipi, allergyXformer, mockRequestStampTime);

        it('result includes sample VPR allergy', function() {
            expect(vprItems).toContain(sampleVPRAllergy);
        });

        it('result includes stampTime', function() {
            expect(vprItems[0].stampTime).toBeTruthy();
        });

        it('excludes null items and items that lack cdrEventId (such as DOD Adaptor Status Report)', function() {
            expect(vprItems.length).toEqual(1);
        });
    });

    describe('getDemographicsIcnFromJds', function() {
        var jdsClientDummy = new JdsClientDummy(log, mockConfig);

        it('Good response path', function() {
            var done = false;

            var expectedJdsResponse = {
                statusCode: 200,
            };
            var expectedJdsResult = {
                jpid: 'aaa-aaaaa-aaaaaaaaaaa',
                patientIdentifiers: [
                    '10108V420871'
                ]
            };

            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeFalsy();
                expect(response).toBeTruthy();
                expect(response).toEqual('10108V420871');
                done = true;
            });
        });

        it('Error condition: No icn found', function() {
            var done = false;

            var expectedJdsResponse = {
                statusCode: 200,
            };
            var expectedJdsResult = {
                jpid: 'aaa-aaaaa-aaaaaaaaaaa',
                patientIdentifiers: [
                    'DOD;0000000003'
                ]
            };

            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeTruthy();
                expect(error).toEqual('NoIcnFound');
                expect(response).toBeFalsy();
                done = true;
            });
        });
        it('Error condition: JDS error', function() {
            var done = false;

            var expectedJdsResponse = null;
            var expectedJdsResult = {};

            jdsClientDummy._setResponseData({}, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeTruthy();
                expect(response).toBeFalsy();
                expect(error).toEqual('FailedJdsError');
                done = true;
            });
        });
        it('Error condition: No response', function() {
            var done = false;

            var expectedJdsResponse = null;
            var expectedJdsResult = {};

            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeTruthy();
                expect(response).toBeFalsy();
                expect(error).toEqual('FailedJdsNoResponse');
                done = true;
            });
        });
        it('Error condition: Wrong status code', function() {
            var done = false;

            var expectedJdsResponse = {
                statusCode: 404,
            };
            var expectedJdsResult = {};

            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeTruthy();
                expect(response).toBeFalsy();
                expect(error).toEqual('FailedJdsWrongStatusCode');
                done = true;
            });
        });
        it('Error condition: No jpid', function() {
            var done = false;

            var expectedJdsResponse = {
                statusCode: 200,
            };
            var expectedJdsResult = {
                patientIdentifiers: [
                    'DOD;0000000003'
                ]
            };

            jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

            handler._steps._getDemographicsIcnFromJds('DOD;0000000003', log, jdsClientDummy, function(error, response) {
                expect(error).toBeTruthy();
                expect(response).toBeFalsy();
                expect(error).toEqual('FailedNoJpidInResult');
                done = true;
            });
        });
    });

    describe('handle', function() {
        beforeEach(function() {
            spyOn(mockHandlerCallback, 'callback');
        });

        it('error condition: incorrect job type', function() {
            var done = false;

            runs(function() {
                var job = {};
                job.type = 'hdr-xform-vpr';
                job.record = {};
                //job.record.data = {};
                //job.record.data.items = {};
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';

                job.patientIdentifier = {
                    type: 'icn',
                    value: '00000V00000'
                };

                //spyOn(mockHandlerCallback, 'callback');

                handler(log, mockConfig, mockEnvironment, job, function() {
                    done = true;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function() {
                return done;
            }, 'Callback not called', 100);

            runs(function() {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });
        it('error condition: wrong patient identifier', function() {
            var done = false;
            runs(function() {
                var job = {};
                job.type = 'jmeadows-xform-allergy-vpr';
                job.dataDomain = 'allergy';
                job.record = dodItems; //{};
                //job.record.data = {};
                //job.record.data.items = dodItems;
                job.requestStampTime = '20140102120059.000';
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';
                job.icn = '00000V00000';

                job.patientIdentifier = {
                    type: 'pid',
                    value: '9E7A;3'
                };

                //spyOn(mockHandlerCallback, 'callback');

                handler(log, mockConfig, mockEnvironment, job, function() {
                    done = true;
                    mockHandlerCallback.callback();
                });

                waitsFor(function() {
                    return done;
                }, 'Callback not called', 100);

                runs(function() {
                    expect(mockHandlerCallback.callback).toHaveBeenCalled();
                });
            });
        });
        it('error condition: invalid domain type', function() {
            var done = false;
            runs(function() {
                var job = {};
                job.type = 'jmeadows-xform-allergy-vpr';
                job.dataDomain = 'fake domain';
                job.record = dodItems; //{};
                //job.record.data = {};
                job.requestStampTime = '20140102120059.000';
                //job.record.data.items = dodItems;
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';

                job.patientIdentifier = {
                    type: 'edipi',
                    value: '0000096'
                };

                //spyOn(mockHandlerCallback, 'callback');

                handler(log, mockConfig, mockEnvironment, job, function() {
                    done = true;
                    mockHandlerCallback.callback();
                });
            });

            waitsFor(function() {
                return done;
            }, 'Callback not called', 100);

            runs(function() {
                expect(mockHandlerCallback.callback).toHaveBeenCalled();
            });
        });
        describe('transformation and job creation', function() {
            beforeEach(function() {
                spyOn(mockEnvironment.publisherRouter, 'publish').andCallThrough();
                spyOn(jdsClientDummy, 'saveSyncStatus').andCallThrough();
            });

            it('should publish a separate job for each transformed data item from sample data', function() {
                log.debug('jmeadows-xform-domain-vpr-handler-spec: ***** STARTING TEST NOW ********');

                var job = {};
                job.type = 'jmeadows-xform-allergy-vpr';
                job.dataDomain = 'allergy';
                job.record = dodItems; //{};
                //job.record.data = {};
                //job.record.data.items = dodItems;
                job.requestStampTime = '20140102120059.000';
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';
                job.icn = '9E7A;3';
                job.patientIdentifier = {
                    type: 'pid',
                    value: 'DOD;00001'
                };

                var expectedJdsResponse = {
                    statusCode: 200
                };
                jdsClientDummy._setResponseData(null, expectedJdsResponse, null);

                var finished = false;
                var actualError;
                var actualResponse;
                runs(function() {
                    handler(log, mockConfig, mockEnvironment, job, function(error, response) {
                        actualError = error;
                        actualResponse = response;
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 'Call to handler failed to return in time.', 1000);

                runs(function() {
                    log.debug('jmeadows-xform-domain-vpr-handler-spec: ***** DONE WAITING ********');

                    //Get information about calls made to publisherRouter.publish
                    //------------------------------------------------------------
                    var publishCalls = mockEnvironment.publisherRouter.publish.calls;
                    log.debug('jmeadows-xform-domain-vpr-handler-spec: publishCalls: %j', publishCalls);

                    expect(publishCalls[0].args[0].length).toEqual(3);

                    log.debug('jmeadows-xform-domain-vpr-handler-spec: ***** AFTER TEST NOW ********');

                    //Get jobs published and compare them to expected jobs
                    var jobsPublished = publishCalls[0].args[0];
                    var expectedJobs = [{
                        'type': 'record-enrichment',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;00001'
                        },
                        'jpid': 'aaa-aaaaa-aaaaaaaaaaa',
                        'dataDomain': 'allergy',
                        'record': {
                            'products': [{
                                'name': 'Tetracyclines'
                            }],
                            'summary': 'Tetracyclines',
                            'codes': [{
                                'code': '7000',
                                'system': 'DOD_ALLERGY_IEN'
                            }],
                            'comments': [{
                                'comment': 'Rash'
                            }],
                            'facilityName': 'DOD',
                            'facilityCode': 'DOD',
                            'kind': 'Allergy/Adverse Reaction',
                            'uid': 'urn:va:allergy:DOD:00001:1000010341',
                            'pid': 'DOD;00001',
                            'stampTime': '20140102120059.000'
                        }
                    }, {
                        'type': 'record-enrichment',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;00001'
                        },
                        'jpid': 'aaa-aaaaa-aaaaaaaaaaa',
                        'dataDomain': 'allergy',
                        'record': {
                            'products': [{
                                'name': 'Penicillins'
                            }],
                            'summary': 'Penicillins',
                            'codes': [{
                                'code': '1000',
                                'system': 'DOD_ALLERGY_IEN'
                            }, {
                                'code': 'C0220892',
                                'display': 'Penicillin',
                                'system': 'urn:oid:2.16.840.1.113883.6.86'
                            }],
                            'comments': [{
                                'comment': 'Vomiting'
                            }],
                            'facilityName': 'DOD',
                            'facilityCode': 'DOD',
                            'kind': 'Allergy/Adverse Reaction',
                            'uid': 'urn:va:allergy:DOD:00001:1000010340',
                            'pid': 'DOD;00001',
                            'stampTime': '20140102120059.000'
                        }
                    }, {
                        'type': 'record-enrichment',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'DOD;00001'
                        },
                        'jpid': 'aaa-aaaaa-aaaaaaaaaaa',
                        'dataDomain': 'allergy',
                        'record': {
                            'products': [{
                                'name': 'Iodine Containing Agents'
                            }],
                            'summary': 'Iodine Containing Agents',
                            'codes': [{
                                'code': '29000',
                                'system': 'DOD_ALLERGY_IEN'
                            }],
                            'comments': [{
                                'comment': 'Nausea'
                            }],
                            'facilityName': 'DOD',
                            'facilityCode': 'DOD',
                            'kind': 'Allergy/Adverse Reaction',
                            'uid': 'urn:va:allergy:DOD:00001:1000010342',
                            'pid': 'DOD;00001',
                            'stampTime': '20140102120059.000'
                        }
                    }];

                    expect(jobsPublished).toEqual(expectedJobs);

                });
            });
        });

        describe('demographics transformation pathway', function() {

            var mockConfig2 = {
                jmeadows: {
                    domains: ['demographics']
                },
                jds: {
                    protocol: 'http',
                    host: '10.2.2.110',
                    port: 9080
                }
            };

            var jdsClientDummy = new JdsClientDummy(log, mockConfig2);

            var mockEnvironment = {
                publisherRouter: {
                    publish: function(jobsToPublish, callback) {
                        callback(null, 'success');
                    }
                },
                jds: jdsClientDummy
            };

            beforeEach(function() {
                spyOn(handler._steps, '_getDemographicsIcnFromJds').andCallThrough();
                spyOn(mockEnvironment.publisherRouter, 'publish').andCallThrough();
            });

            it('ensure getDemographicsIcnFromJds called', function() {
                var done = false;

                var expectedJdsResponse = [{
                    statusCode: 200,
                }, {statusCode: 200}];
                var expectedJdsResult = {
                    jpid: 'aaa-aaaaa-aaaaaaaaaaa',
                    patientIdentifiers: [
                        '10108V420871'
                    ]
                };
                jdsClientDummy._setResponseData(null, expectedJdsResponse, expectedJdsResult);

                var job = {};
                job.type = 'jmeadows-xform-demographics-vpr';
                job.dataDomain = 'demographics';
                job.record = [{
                    cdrEventId: '10000000'
                }];
                job.requestStampTime = '20140102120059.000';
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';
                job.patientIdentifier = {
                    type: 'pid',
                    value: 'DOD;000000003'
                };

                var finished = false;
                var actualError;
                var actualResponse;
                runs(function() {
                    handler(log, mockConfig2, mockEnvironment, job, function(error, response) {
                        actualError = error;
                        actualResponse = response;
                        finished = true;
                    });
                });

                waitsFor(function() {
                    return finished;
                }, 'Call to handler failed to return in time.', 1000);

                runs(function() {
                    log.debug('jmeadows-xform-domain-vpr-handler-spec: ***** DONE WAITING ********');

                    //Get information about calls made to handler._getDemographicsIcnFromJds
                    //------------------------------------------------------------
                    // var getIcnCalls = handler._steps._getDemographicsIcnFromJds;//.calls;
                    // console.log(getIcnCalls);
                    // expect(getIcnCalls[0].args[0].length).toEqual(1);

                    //Get information about calls made to publisherRouter.publish
                    //------------------------------------------------------------
                    var publishCalls = mockEnvironment.publisherRouter.publish.calls;
                    log.debug('jmeadows-xform-domain-vpr-handler-spec: publishCalls: %j', publishCalls);

                    expect(publishCalls[0].args[0].length).toEqual(1);

                    log.debug('jmeadows-xform-domain-vpr-handler-spec: ***** AFTER TEST NOW ********');

                    //Get jobs published and compare them to expected jobs
                    var jobsPublished = publishCalls[0].args[0];
                    expect(jobsPublished).toBeTruthy();
                    expect(jobsPublished[0].type).toEqual('record-enrichment');
                    expect(jobsPublished[0].record).toBeTruthy();

                    //This is how we know _getDemographicsIcnFromJds was called
                    expect(jobsPublished[0].record.icn).toBeTruthy();
                });
            });
        });
    });

    describe('Ensure transformations set required fields', function() {
        var mockEdipi = '00001';
        var mockCdrEventId = '100000000';
        var mockDodLabOrderDate = '1182435900000';

        var jmeadowsDomains = require(global.VX_ROOT + 'worker-config').jmeadows.domains;

        var jmeadowsDomainsToVpr = {
            encounter: 'visit',
            consult: 'document',
            progressNote: 'document',
            dischargeSummary: 'document',
            medication: 'med',
            radiology: 'image',
            demographics: 'patient'
        };

        var allXformers = _.map(jmeadowsDomains, function(domain) {
            return require(util.format(global.VX_HANDLERS + '/jmeadows-xform-domain-vpr/jmeadows-%s-xformer', domain));
        });
        var vprObjects = _.map(allXformers, function(xformer) {
            return xformer({
                accession: 'TEST ACC^ESSION',    //Labs only
                orderDate: mockDodLabOrderDate,     //Labs only
                resultDate: mockDodLabOrderDate,    //Labs only
                codes: [{                       //Labs only
                    code:'20215',
                    system:'DOD_NCID'
                }],
                cdrEventId: mockCdrEventId
            }, mockEdipi);
        });

        _.each(jmeadowsDomains, function(jmeadowsDomain, index) {
            var vprObject = vprObjects[index];
            var vprDomain = jmeadowsDomainsToVpr[jmeadowsDomain] || jmeadowsDomain;
            var expectUid;

            if(vprDomain === 'lab') {
                var expectDodVprLabObserved = moment(mockDodLabOrderDate, 'x').format('YYYYMMDDHHmmss');
                expectUid = 'urn:va:lab:DOD:00001:' + expectDodVprLabObserved + '_TEST-ACC-ESSION_20215';
            }
            else if(vprDomain === 'patient'){
             expectUid = 'urn:va:' + vprDomain + ':DOD:' + mockEdipi + ':' + mockEdipi;
            } else {
             expectUid = 'urn:va:' + vprDomain + ':DOD:' + mockEdipi + ':' + mockCdrEventId;
            }
            it('Check DOD ' + jmeadowsDomain + ' to VPR transformation for correct uid', function() {
                if(_.isArray(vprObject)) {
                    expect(vprObject.length).toBeGreaterThan(0);
                    expect(vprObject[0].uid).toEqual(expectUid);
                } else {
                    expect(vprObject.uid).toEqual(expectUid);
                }
            });
            it('Check DOD ' + jmeadowsDomain + ' to VPR transformation for correct pid', function() {
                if(_.isArray(vprObject)) {
                    expect(vprObject.length).toBeGreaterThan(0);
                    expect(vprObject[0].pid).toEqual('DOD;' + mockEdipi);
                } else {
                    expect(vprObject.pid).toEqual('DOD;' + mockEdipi);
                }
            });
            //stampTime is another required field, but it is added by
            //jmeadows-xform-domain-vpr-handler.xformItemCollection (tested above)
            //instead of the individual transformers
        });
    });
});
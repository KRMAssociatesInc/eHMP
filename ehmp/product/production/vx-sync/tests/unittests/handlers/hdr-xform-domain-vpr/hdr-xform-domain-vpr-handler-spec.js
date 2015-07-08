'use strict';

require('../../../../env-setup');

var handler = require(global.VX_HANDLERS + 'hdr-xform-domain-vpr/hdr-xform-domain-vpr-handler');
var log = require(global.VX_UTILS + 'dummy-logger');
var OperationaldataSyncUtil = require(global.VX_UTILS + 'site-operational-data-status-util');
var _ = require('underscore');

var mockConfig = {
    hdr: {
        domains: ['allergy']
    },
    jds: {
        protocol: 'http',
        host: '10.2.2.110',
        port: 9080
    },
    "vistaSites" : {
        "9E7A": {
            "name": "panorama"
        },
        "C877": {
            "name": "kodak"
        }
    }
};

var configWithPrimarySites = {
    "vistaSites" : {
        "9E7A": {
            "name": "panorama"
        },
        "C877": {
            "name": "kodak"
        }
    }
}

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
    }
};

var mockODSyncedSites = ['9E7A'];

var hdrItems = require('../../../data/secondary/hdr/allergy');

describe('hdr-xform-domain-vpr-handler', function() {

    describe('xformItemCollection', function() {

        var mockRequestStampTime = '20140113154827.356';

        var mockEdipi = '00000099';

        var sampleCDSAllergy = {
            comments: [
              {
                comment: ' TESTING DIETETICS',
                entered: 19940119082309,
                enteredByName: 'PROGRAMMER,TWENTY',
                enteredByUid: 'urn:va:user:ABCD:755'
              }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            signedDateTime: '05/16/07 09:50',
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
              {
                name: 'MILK',
                vuid: 'urn:va:vuid:4636981'
              }
            ],
            reactions: [
              {
                name: 'NAUSEA,VOMITING',
                vuid: 'urn:va:vuid:'
              }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:ABCD:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY'
        };

        var sampleItemCollection ={
               data:{
                items:[sampleCDSAllergy]
                }
            };

        var sampleVPRAllergy = {
            comments: [
              {
                comment: ' TESTING DIETETICS',
                entered: 19940119082309,
                enteredByName: 'PROGRAMMER,TWENTY',
                enteredByUid: 'urn:va:user:ABCD:755'
              }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            signedDateTime: '20070516095000',
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
              {
                name: 'MILK',
                vuid: 'urn:va:vuid:4636981'
              }
            ],
            reactions: [
              {
                name: 'NAUSEA,VOMITING',
                vuid: 'urn:va:vuid:'
              }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:ABCD:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY',
            pid: 'HDR;00000099',
            stampTime: '20140113154827.356'
        };

        var vprItems = handler._steps._xformItemCollection(log, mockConfig, sampleItemCollection, mockEdipi, mockRequestStampTime);

        it('result includes sample VPR allergy', function() {
            expect(vprItems).toContain(sampleVPRAllergy);
        });

        it('result includes stampTime', function() {
            expect(vprItems[0].stampTime).toBeTruthy();
        });

        it('Checks HDR to VPR transformation for correct pid', function() {
            expect(vprItems[0].pid).toEqual('HDR;' + mockEdipi);
        });
    });

    describe('xformItemCollection Primary Sites', function() {

        var operationaldataSyncUtil = OperationaldataSyncUtil.getInstance();
        var mockRequestStampTime = '20140113154827.356';

        var mockEdipi = '00000099';

        var sampleCDSAllergyCDS = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:ABCD:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY'
        };

        var sampleVPRAllergyCDS = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:ABCD:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY',
            pid: 'HDR;00000099',
            stampTime: '20140113154827.356'
        };

        var sampleCDSAllergy9E7A = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:9E7A:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY'
        };

        var sampleVPRAllergy9E7A = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:9E7A:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY',
            pid: 'HDR;00000099',
            stampTime: '20140113154827.356'
        };

        var sampleCDSAllergyC877 = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:C877:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY'
        };

        var sampleVPRAllergyC877 = {
            comments: [
                {
                    comment: ' TESTING DIETETICS',
                    entered: 19940119082309,
                    enteredByName: 'PROGRAMMER,TWENTY',
                    enteredByUid: 'urn:va:user:ABCD:755'
                }
            ],
            entered: 199401190822,
            facilityCode: 561,
            facilityName: 'New Jersey HCS',
            historical: true,
            kind: 'Allergy / Adverse Reaction',
            localId: 106,
            mechanism: 'ALLERGY',
            originatorName: 'PROGRAMMER,TWENTY',
            products: [
                {
                    name: 'MILK',
                    vuid: 'urn:va:vuid:4636981'
                }
            ],
            reactions: [
                {
                    name: 'NAUSEA,VOMITING',
                    vuid: 'urn:va:vuid:'
                }
            ],
            reference: '29;GMRD(120.82,',
            summary: 'MILK',
            typeName: 'DRUG, FOOD',
            uid: 'urn:va:allergy:C877:16:106',
            verified: 19940119082339,
            verifierName: 'PROGRAMMER,TWENTY',
            pid: 'HDR;00000099',
            stampTime: '20140113154827.356'
        };

        var sampleItemCollection ={
            data:{
                items:[sampleCDSAllergy9E7A]
            }
        };

        var site9E7ASynced = function (log, vistaSites, ODSyncedSites, jds){
            ODSyncedSites.length = 0;
            ODSyncedSites.push('9E7A');
        };

        var site9E7AAndC877Synced = function (log, vistaSites, ODSyncedSites, jds){
            ODSyncedSites.length = 0;
            ODSyncedSites.push('9E7A');
            ODSyncedSites.push('C877');
        };

        it('result includes sample VPR allergy', function() {
            operationaldataSyncUtil.initialize(log, mockConfig, mockEnvironment, site9E7ASynced);
            var vprItems = handler._steps._xformItemCollection(log, mockConfig, sampleItemCollection, mockEdipi, mockRequestStampTime);
            expect(vprItems.length).toEqual(0);
        });

        it('result includes sample VPR allergy', function() {
            var items = {
                data:{
                    items:[sampleCDSAllergy9E7A, sampleCDSAllergyC877]
                }
            };
            operationaldataSyncUtil.initialize(log, mockConfig, mockEnvironment, site9E7AAndC877Synced);
            var vprItems = handler._steps._xformItemCollection(log, mockConfig, items, mockEdipi, mockRequestStampTime);
            expect(vprItems.length).toEqual(0);
        });

        xit('result includes sample VPR allergy', function() {
            var items = {
                data:{
                    items:[sampleCDSAllergy9E7A, sampleCDSAllergyC877]
                }
            };
            operationaldataSyncUtil.initialize(log, mockConfig, mockEnvironment, site9E7AAndC877Synced);
            var vprItems = handler._steps._xformItemCollection(log, mockConfig, items, mockEdipi, mockRequestStampTime);
            expect(vprItems.length).toEqual(1);
            expect(vprItems).toContain(sampleVPRAllergyC877);
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
                job.type = 'hdr-xform-allergy-vpr';
                job.dataDomain = 'allergy';
                job.record = hdrItems; //{};
                job.requestStampTime = '20140102120059.000';
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';
                job.icn = '00000V00000';

                job.patientIdentifier = {
                    type: 'pid',
                    value: '9E7A;3'
                };


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
                job.type = 'hdr-xform-allergy-vpr';
                job.dataDomain = 'fake domain';
                job.record = hdrItems; //{};
                job.requestStampTime = '20140102120059.000';
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
                log.debug('hdr-xform-domain-vpr-handler-spec: ***** STARTING TEST NOW ********');

                var job = {};
                job.type = 'hdr-xform-allergy-vpr';
                job.dataDomain = 'allergy';
                job.record = hdrItems; //{};
                job.requestStampTime = '20140102120059.000';
                job.jpid = 'aaa-aaaaa-aaaaaaaaaaa';
                job.icn = '9E7A;3';
                job.patientIdentifier = {
                    type: 'pid',
                    value: 'HDR;00001'
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
                    log.debug('hdr-xform-domain-vpr-handler-spec: ***** DONE WAITING ********');

                    //Get information about calls made to publisherRouter.publish
                    //------------------------------------------------------------
                    var publishCalls = mockEnvironment.publisherRouter.publish.calls;
                    log.debug('hdr-xform-domain-vpr-handler-spec: publishCalls: %j', publishCalls);

                    expect(publishCalls[0].args[0].length).toEqual(1);

                    log.debug('hdr-xform-domain-vpr-handler-spec: ***** AFTER TEST NOW ********');

                    //Get jobs published and compare them to expected jobs
                    var jobsPublished = publishCalls[0].args[0];
                    var expectedJobs = [{
                        'type': 'record-enrichment',
                        'patientIdentifier': {
                            'type': 'pid',
                            'value': 'HDR;00001'
                        },
                        'jpid': 'aaa-aaaaa-aaaaaaaaaaa',
                        'dataDomain': 'allergy',
                        'record': {
                            'comments': [
                              {
                                'comment': ' TESTING DIETETICS',
                                'entered': 19940119082309,
                                'enteredByName': 'PROGRAMMER,TWENTY',
                                'enteredByUid': 'urn:va:user:ABCD:755'
                              }
                            ],
                            'entered': 199401190822,
                            'facilityCode': 561,
                            'facilityName': 'New Jersey HCS',
                            'historical': true,
                            'kind': 'Allergy / Adverse Reaction',
                            'localId': 106,
                            'mechanism': 'ALLERGY',
                            'originatorName': 'PROGRAMMER,TWENTY',
                            'products': [
                              {
                                'name': 'MILK',
                                'vuid': 'urn:va:vuid:4636981'
                              }
                            ],
                            'reactions': [
                              {
                                'name': 'NAUSEA,VOMITING',
                                'vuid': 'urn:va:vuid:'
                              }
                            ],
                            'reference': '29;GMRD(120.82,',
                            'summary': 'MILK',
                            'typeName': 'DRUG, FOOD',
                            'uid': 'urn:va:allergy:ABCD:16:106',
                            'verified': 19940119082339,
                            'verifierName': 'PROGRAMMER,TWENTY',
                            'pid': 'HDR;00001',
                            'stampTime': '20140102120059.000'
                        }
                    }
                    ];

                    expect(jobsPublished).toEqual(expectedJobs);

                });
            });
        });

    });

});
'use strict';

//-----------------------------------------------------------------------------------------
// This tests the vista-subscribe.js module.
//-----------------------------------------------------------------------------------------
require('../../../../env-setup');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var dummyLogger = require(global.VX_UTILS + '/dummy-logger');
var dummyRpcClient = require(global.VX_UTILS + '/dummy-RpcClient').RpcClient;
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');

var hmpServer = 'TheHmpServer';

var config = {
    'vistaSites': {
        '9E7A': {
            'name': 'panorama',
            'host': '10.2.2.101',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        },
        'C877': {
            'name': 'kodak',
            'host': '10.2.2.102',
            'port': 9210,
            'accessCode': 'pu1234',
            'verifyCode': 'pu1234!!',
            'localIP': '127.0.0.1',
            'localAddress': 'localhost',
            'connectTimeout': 3000,
            'sendTimeout': 10000
        }
    },
    'hmp.server.id': hmpServer,
    'hmp.version': '0.7-S65',
    'hmp.batch.size': '1000',
    'hmp.extract.schema': '3.001'
};

describe('vista-subscribe.js', function() {
    // beforeEach(function() {
    //     // Underlying JDS and RPC calls to monitor and make sure that they are made.
    //     //---------------------------------------------------------------------------
    //     spyOn(dummyRpcClient, 'callRpc').andCallThrough();
    // });

    describe('_createRpcConfigVprContext()', function() {
        it('Verify context was added correctly', function() {
            var siteConfig = config.vistaSites;
            var rpcConfig = VistaClient._createRpcConfigVprContext(siteConfig, 'C877');
            //          console.log("rpcConfig: %j", rpcConfig);
            expect(rpcConfig).toBeTruthy();
            expect(rpcConfig.name).toEqual('kodak');
            expect(rpcConfig.context).toEqual('HMP SYNCHRONIZATION CONTEXT');
        });
    });

    describe('fetchAppointment()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.fetchAppointment(site, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to fetchAppointment failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                //expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP PATIENT ACTIVITY', jasmine.any(Object), jasmine.any(Function));
            });
        });
    });

    describe('subscribe()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var rootJobId = '1';
            var jobId = '3';
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.subscribe('C877', patientIdentifier, rootJobId, jobId, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMPDJFS API',
                    jasmine.objectContaining({
                        '"server"': hmpServer,
                        '"command"': 'putPtSubscription',
                        '"localId"': dfn,
                        '"rootJobId"': rootJobId,
                        '"jobId"': jobId
                    }), jasmine.any(Function));
            });
        });
    });

    describe('unsubscribe()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.unsubscribe(patientIdentifier.value, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeNull();
                expect(expectedResponse).toEqual('success');
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMPDJFS DELSUB',
                    jasmine.objectContaining({
                        '"hmpSrvId"': hmpServer,
                        '"pid"': patientIdentifier.value
                    }), jasmine.any(Function));
            });
        });
    });

    describe('status()', function() {
        it('invokes the HMP SUBSCRIPTION STATUS RPC', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var site = 'C877';
            var dummyrpc = handler._getRpcClient(site);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var patientIdentifier = idUtil.create('pid', site + ';' + dfn);
            var expectedError;
            var expectedResponse;
            var called = false;
            handler.status(patientIdentifier.value, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).not.toBeNull();
                expect(expectedResponse).toBeUndefined();
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP SUBSCRIPTION STATUS',
                    jasmine.objectContaining({
                        '"server"': hmpServer,
                        '"localId"': patientIdentifier.value.split(';')[1]
                    }), jasmine.any(Function));
            });
        });
    });

    describe('getDemographics()', function() {
        it('Happy Path', function() {
            var handler = new VistaClient(dummyLogger, dummyLogger, config, dummyRpcClient);
            var vistaId = 'C877';
            var dummyrpc = handler._getRpcClient(vistaId);
            spyOn(dummyrpc, 'execute').andCallThrough();
            var dfn = '3';
            var expectedError;
            var expectedResponse;

            var called = false;
            handler.getDemographics(vistaId, dfn, function(error, response) {
                expectedError = error;
                expectedResponse = response;
                called = true;
            });

            waitsFor(function() {
                return called;
            }, 'Call to subscribe failed to return in time.', 500);

            runs(function() {
                expect(expectedError).toBeTruthy(); // This is because we are calling the dummyRPC and it does not return a valid result.
                expect(expectedResponse).toBeNull(); // This is because we are calling the dummyRPC
                expect(dummyrpc.execute.calls.length).toEqual(1);
                expect(dummyrpc.execute).toHaveBeenCalledWith('HMP GET PATIENT DATA JSON',
                    jasmine.objectContaining({
                        '"patientId"': dfn,
                        '"domain"': 'patient',
                        '"extractSchema"': '3.001'
                    }), jasmine.any(Function));
            });
        });
    });

});
'use strict';

//------------------------------------------------------------------------------------
// This file contains unit tests for ptdemographics-utils.js.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

require('../../../env-setup');
var _ = require('underscore');

var PtDemographicsUtil = require(global.VX_UTILS + '/ptdemographics-utils');
var morphToSecondaryDemographics = require(global.VX_UTILS + '/ptdemographics-utils')._morphToSecondaryDemographics;
var JdsClientDummy = require(global.VX_SUBSYSTEMS + 'jds/jds-client-dummy');
var log = require(global.VX_UTILS + '/dummy-logger');
// log = require('bunyan').createLogger({
// 	name: 'vista-record-poller-spec',
// 	level: 'debug'
// });

var hmpServer = 'TheHmpServer';


var config = {
	jds: {
		protocol: 'http',
		host: '10.2.2.110',
		port: 9080
	},
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

var demographicsFromVista = {
    'pid': '9E7A;3',
    'birthDate': '19350407',
    'last4': '0008',
    'last5': 'E0008',
    'icn': '10108V420871',
    'familyName': 'EIGHT',
    'givenNames': 'PATIENT',
    'fullName': 'EIGHT,PATIENT',
    'displayName': 'Eight,Patient',
    'genderCode': 'urn:va:pat-gender:M',
    'genderName': 'Male',
    'sensitive': false,
    'uid': 'urn:va:patient:9E7A:3:3',
    'summary': 'Eight,Patient',
    'ssn': '666000008',
    'localId': '3'
};

var pidDod = 'DOD;111';
var uidDod = 'urn:va:patient:DOD:111:111';
var demographicsDod = _.clone(demographicsFromVista);
demographicsDod.pid = pidDod;
demographicsDod.uid = uidDod;

//---------------------------------------------------------------------
// Create an instance of the environment variable.
//---------------------------------------------------------------------
function createEnvironment(vistaClient) {
	var environment = {
		jds: new JdsClientDummy(log, config),
		vistaClient: {}
	};

	if (vistaClient) {
		environment.vistaClient = vistaClient;
	}

	spyOn(environment.jds, 'getOperationalDataPtSelectByIcn').andCallThrough();
	spyOn(environment.jds, 'getOperationalDataPtSelectByPid').andCallThrough();
	spyOn(environment.jds, 'storePatientData').andCallThrough();
	spyOn(environment.jds, 'getPtDemographicsByPid').andCallThrough();

	return environment;
}

describe('ptdemographics-utils.js', function() {
	describe('createPtDemographics()', function() {
		it('Happy Path with pid', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 404
			}, {
				statusCode: 201
			}];
			var expectedJdsResult = [null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var originalSyncJob = {
				patientIdentifier: {
					type: 'pid',
					value: '9E7A;3'
				}
			};
			var syncJobsToPublish = [];
			runs(function() {
				ptDemographicsUtil.createPtDemographics(originalSyncJob, syncJobsToPublish, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toEqual(syncJobsToPublish);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Happy Path with icn', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null, null];
			var expectedJdsResponse = [{
				statusCode: 200
			}, {
				statusCode: 404
			}, {
				statusCode: 201
			}];
			var expectedJdsResult = [{
				data: {
					items: [{
						pid: '9E7A;3'
					}]
				}
			},
			null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var icn = '100';
			var originalSyncJob = {
				patientIdentifier: {
					type: 'icn',
					value: icn
				}
			};
			var syncJobsToPublish = [];
			runs(function () {
		 		ptDemographicsUtil.createPtDemographics(originalSyncJob, syncJobsToPublish, function (error, response) {
		 		expect(error).toBeFalsy();
		 		expect(response).toEqual(syncJobsToPublish);
                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
		 		finished = true;
				});
		 });

		 waitsFor(function() {
		 	return finished;
		 });
		});
		it('No originalSyncJob', function() {
			var finished = false;
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var syncJobsToPublish = {};
			runs(function() {
				ptDemographicsUtil.createPtDemographics(null, syncJobsToPublish, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBe(syncJobsToPublish);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No patientIdentifier', function() {
			var finished = false;
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var originalSyncJob = {};
			var syncJobsToPublish = {};
			runs(function() {
				ptDemographicsUtil.createPtDemographics(originalSyncJob, syncJobsToPublish, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBe(syncJobsToPublish);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('patientIdentifier not icn or pid.', function() {
			var finished = false;
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var originalSyncJob = {
				patientIdentifier: {
					type: 'edipi',
					value: '1111'
				}
			};
			var syncJobsToPublish = {};
			runs(function() {
				ptDemographicsUtil.createPtDemographics(originalSyncJob, syncJobsToPublish, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBe(syncJobsToPublish);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('patientIdentifier with pid but not a primary site.', function() {
			var finished = false;
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var originalSyncJob = {
				patientIdentifier: {
					type: 'pid',
					value: '4E44;100'
				}
			};
			var syncJobsToPublish = {};
			runs(function() {
				ptDemographicsUtil.createPtDemographics(originalSyncJob, syncJobsToPublish, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBe(syncJobsToPublish);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});

	});
	describe('retrievePrimaryPidUsingIcn()', function() {
		it('Happy Path', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				data: {
					items: [{
						pid: '9E7A;3'
					}]
				}
			};
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toEqual('9E7A;3');
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No icn', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				data: {
					items: [{
						pid: '9E7A;3'
					}]
				}
			};
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(null, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBeFalsy();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Error from JDS', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = 'SomeError';
			var expectedJdsResponse = {
				statusCode: 404
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBeFalsy();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No response from JDS', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = null;
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBeFalsy();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Incorrect JDS status code', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 404
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeTruthy();
					expect(response).toBeFalsy();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No result returned', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toBeNull();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No result.data returned', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = { };
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toBeNull();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No result.data.items returned', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				data: {}
			};
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toBeNull();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('No result.data.items[0] returned', function() {
			var finished = false;
			var environment = createEnvironment();
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				data: {
					items:[]
				}
			};
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var icn = '100';

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrievePrimaryPidUsingIcn(icn, function(error, response) {
					expect(error).toBeFalsy();
					expect(response).toBeNull();
	                expect(environment.jds.getOperationalDataPtSelectByIcn.calls.length).toEqual(1);
	                expect(environment.jds.getOperationalDataPtSelectByIcn).toHaveBeenCalledWith(icn, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});
	describe('retrieveDemographicsFromVistAandStoreInJds()', function() {
		it('Happy Path', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsFromVista));	// toEqual because we should get our original item plus an additional attribute.
					expect(ptDemographics.stampTime).toBeTruthy();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsFromVista), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Pid was null', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(null, function(error, ptDemographics) {
					expect(error).toEqual('FailedNoPid');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Pid was invalid', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds('9E7A', function(error, ptDemographics) {
					expect(error).toEqual('FailedPidInvalid');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('VistA RPC call returned error', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback('ErrorFromVista', null);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toEqual('ErrorFromVista');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('VistA RPC call returned no error and no demographics', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, null);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toBeNull();
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('JDS returned error on storage of demographics', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = 'SomeError';
			var expectedJdsResponse = {
				statusCode: 404
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsError');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsFromVista), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('JDS returned no response on storge of demographics', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = null;
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsNoResponse');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsFromVista), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('JDS returned invalid status code on storage of demographics', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 404
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveDemographicsFromVistAandStoreInJds(demographicsFromVista.pid, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsWrongStatusCode');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsFromVista), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});
	describe('retrieveOrCreateDemographicsForPrimaryPid()', function() {
		it('Found demographics in JDS', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = {
				data: {
					items: [demographicsFromVista]
				}
			};
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveOrCreateDemographicsForPrimaryPid(demographicsFromVista.pid, null, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsFromVista));
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Did not find demographics in JDS', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 404
			}, {
				statusCode: 201
			}];
			var expectedJdsResult = [null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveOrCreateDemographicsForPrimaryPid(demographicsFromVista.pid, null, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsFromVista));	// toEqual because we should get our original item plus an additional attribute.
					expect(ptDemographics.stampTime).toBeTruthy();
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsFromVista), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});
	describe('_demographicsCreationTaskWrapper()', function() {
		it('Happy Path', function() {
			var finished = false;
			var demographicsCreationTask = function(callback) {
				return callback(null, demographicsDod);
			};
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var _demographicsCreationTaskWrapper = PtDemographicsUtil._demographicsCreationTaskWrapper.bind(ptDemographicsUtil, pidDod, demographicsCreationTask);
			runs(function() {
				_demographicsCreationTaskWrapper(function(error, response) {
					expect(error).toBeNull();
					expect(response).toEqual(demographicsDod);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Happy Path', function() {
			var finished = false;
			var demographicsCreationTask = function(callback) {
				return callback('SomeError', null);
			};
			var environment = createEnvironment();
			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			var _demographicsCreationTaskWrapper = PtDemographicsUtil._demographicsCreationTaskWrapper.bind(ptDemographicsUtil, pidDod, demographicsCreationTask);
			runs(function() {
				_demographicsCreationTaskWrapper(function(error, response) {
					expect(error).toBeNull();
					expect(response).toEqual({ errorPid: pidDod, errorMessage: 'SomeError'});
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});
	describe('createPtDemographicsForJobsUsingPid()', function() {
		it('Happy Path for DoD Job', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 200
			}, {
				statusCode: 200
			}];
			var expectedJdsResult = [{
				data: {
					items: [demographicsFromVista]
				}
			},{
				data: {
					items: [demographicsDod]
				}
			}];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var syncJobsToPublish = [{
				type: 'jmeadows-sync-request',
				patientIdentifier: {
					type: 'pid',
					value: pidDod
				}
			}];

			// Note we cannot test all the jobs at once - because of the parallel nature - we cannot control what order
			// JDS will have to give its responses.
			//-----------------------------------------------------------------------------------------------------------
			// var syncJobsToPublish = [{
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: demographicsFromVista.pid
			// 	}
			// }, {
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: 'C877;3'
			// 	}
			// }, {
			// 	type: 'jmeadows-sync-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: pidDod
			// 	}
			// }];

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.createPtDemographicsForJobsUsingPid(demographicsFromVista.pid, syncJobsToPublish, null, function(error, filteredSyncJobsToPublish) {
					expect(error).toBeFalsy();
					expect(filteredSyncJobsToPublish).toEqual(syncJobsToPublish);
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(2);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(pidDod, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Happy Path for Primary Site Job - same as original primary site', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 200
			}, {
				statusCode: 200
			}];
			var expectedJdsResult = [{
				data: {
					items: [demographicsFromVista]
				}
			},{
				data: {
					items: [demographicsDod]
				}
			}];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var syncJobsToPublish = [{
				type: 'vista-9E7A-subscribe-request',
				patientIdentifier: {
					type: 'pid',
					value: demographicsFromVista.pid
				}
			}];

			// Note we cannot test all the jobs at once - because of the parallel nature - we cannot control what order
			// JDS will have to give its responses.
			//-----------------------------------------------------------------------------------------------------------
			// var syncJobsToPublish = [{
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: demographicsFromVista.pid
			// 	}
			// }, {
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: 'C877;3'
			// 	}
			// }, {
			// 	type: 'jmeadows-sync-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: pidDod
			// 	}
			// }];

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.createPtDemographicsForJobsUsingPid(demographicsFromVista.pid, syncJobsToPublish, null, function(error, filteredSyncJobsToPublish) {
					expect(error).toBeFalsy();
					expect(filteredSyncJobsToPublish).toEqual(syncJobsToPublish);
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(2);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Happy Path for Primary Site Job - different than original primary site', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 200
			}, {
				statusCode: 200
			}];
			var expectedJdsResult = [{
				data: {
					items: [demographicsFromVista]
				}
			},{
				data: {
					items: [demographicsDod]
				}
			}];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var syncJobsToPublish = [{
				type: 'vista-9E7A-subscribe-request',
				patientIdentifier: {
					type: 'pid',
					value: 'C877;3'
				}
			}];

			// Note we cannot test all the jobs at once - because of the parallel nature - we cannot control what order
			// JDS will have to give its responses.
			//-----------------------------------------------------------------------------------------------------------
			// var syncJobsToPublish = [{
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: demographicsFromVista.pid
			// 	}
			// }, {
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: 'C877;3'
			// 	}
			// }, {
			// 	type: 'jmeadows-sync-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: pidDod
			// 	}
			// }];

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.createPtDemographicsForJobsUsingPid(demographicsFromVista.pid, syncJobsToPublish, null, function(error, filteredSyncJobsToPublish) {
					expect(error).toBeFalsy();
					expect(filteredSyncJobsToPublish).toEqual(syncJobsToPublish);
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(2);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith('9E7A;3', jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('DoD Job received an error', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null, 'SomeError'];
			var expectedJdsResponse = [{
				statusCode: 200
			}, {
				statusCode: 200
			}, {
				statusCode: 404
			}];
			var expectedJdsResult = [{
				data: {
					items: [demographicsFromVista]
				}
			}, null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var syncJobsToPublish = [{
				type: 'jmeadows-sync-request',
				patientIdentifier: {
					type: 'pid',
					value: pidDod
				}
			}];

			// Note we cannot test all the jobs at once - because of the parallel nature - we cannot control what order
			// JDS will have to give its responses.
			//-----------------------------------------------------------------------------------------------------------
			// var syncJobsToPublish = [{
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: demographicsFromVista.pid
			// 	}
			// }, {
			// 	type: 'vista-9E7A-subscribe-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: 'C877;3'
			// 	}
			// }, {
			// 	type: 'jmeadows-sync-request',
			// 	patientIdentifier: {
			// 		type: 'pid',
			// 		value: pidDod
			// 	}
			// }];

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.createPtDemographicsForJobsUsingPid(demographicsFromVista.pid, syncJobsToPublish, null, function(error, filteredSyncJobsToPublish) {
					expect(error).toBeFalsy();
					expect(filteredSyncJobsToPublish).toEqual([]);		// Since there was an error - should have been removed from the list.
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(2);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(pidDod, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('retrieveOrCreateDemographicsForPrimaryPid failed to return ptDemographics.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
			var syncJobsToPublish = [];

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.createPtDemographicsForJobsUsingPid(demographicsFromVista.pid, syncJobsToPublish, null, function(error) {
					expect(error).toEqual('FailedToCreateDemographicsForPrimaryPid');
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(demographicsFromVista.pid, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
        it('retrieveOrCreateDemographicsForPrimaryPid failed to return ptDemographics.', function() {
            var finished = false;
            var vistaClient = {
                getDemographics: function(vistaId, dfn, callback) {
                    return callback(null, demographicsFromVista);
                }
            };
            var environment = createEnvironment(vistaClient);
            var expectedJdsError = null;
            var expectedJdsResponse = {
                statusCode: 200
            };
            var expectedJdsResult = null;
            environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);
            var syncJobsToPublish = [];

            var demographics = {name:'test patient'};
            var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
            runs(function() {
                ptDemographicsUtil.createPtDemographicsForJobsUsingPid('HDR;3', syncJobsToPublish, demographics, function(error) {
                    expect(error).toBeFalsy();
                    expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
                    expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith('HDR;3', jasmine.any(Function));
                    finished = true;
                });
            });

            waitsFor(function() {
                return finished;
            });
        });
	});
	describe('storeDemographicsInJdsUsingBasisDemographics()', function() {
		it('Happy Path', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsDod));	// toEqual because we should get our original item plus an additional attribute.
					expect(ptDemographics).toEqual(jasmine.objectContaining({ stampTime: jasmine.any(String)}));
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsDod), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Missing pid', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(null, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedNoPid');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Missing ptDemographicsBasis', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(pidDod, null, function(error, ptDemographics) {
					expect(error).toEqual('FailedNoPtDemographicsBasis');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('PID not secondary site.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics('9E7A;3', demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedPidNotSecondarySite');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('PID secondary site - but not valid format.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics('DOD;', demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedPidNotSecondarySite');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Store failed with JDS returning error.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = 'SomeError';
			var expectedJdsResponse = {
				statusCode: 201
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsError');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsDod), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Store failed with JDS returning no response.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = null;
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsNoResponse');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsDod), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Store failed with JDS returning incorrect response status code.', function() {
			var finished = false;
			var vistaClient = {
				getDemographics: function(vistaId, dfn, callback) {
					return callback(null, demographicsFromVista);
				}
			};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 404
			};
			var expectedJdsResult = null;
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.storeDemographicsInJdsUsingBasisDemographics(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedJdsWrongStatusCode');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsDod), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});
	describe('retrieveOrCreateDemographicsForSecondaryPid()', function() {
		it('Found demographics in JDS', function() {
			var finished = false;
			var vistaClient = {};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = null;
			var expectedJdsResponse = {
				statusCode: 200
			};
			var expectedJdsResult = [{
				data: {
					items: [demographicsDod]
				}
			}];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveOrCreateDemographicsForSecondaryPid(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsDod));
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(pidDod, jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Did not find demographics in JDS', function() {
			var finished = false;
			var vistaClient = {};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 404
			}, {
				statusCode: 201
			}];
			var expectedJdsResult = [null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveOrCreateDemographicsForSecondaryPid(pidDod, demographicsFromVista, function(error, ptDemographics) {
					expect(error).toBeFalsy();
					expect(ptDemographics).toBeTruthy();
					expect(ptDemographics).toEqual(jasmine.objectContaining(demographicsDod));	// toEqual because we should get our original item plus an additional attribute.
					expect(ptDemographics.stampTime).toBeTruthy();
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(1);
	                expect(environment.jds.getPtDemographicsByPid).toHaveBeenCalledWith(pidDod, jasmine.any(Function));
	                expect(environment.jds.storePatientData.calls.length).toEqual(1);
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining(demographicsDod), jasmine.any(Function));
	                expect(environment.jds.storePatientData).toHaveBeenCalledWith(jasmine.objectContaining({ stampTime: jasmine.any(String)}), jasmine.any(Function));
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
		it('Pid was not for a secondary site.', function() {
			var finished = false;
			var vistaClient = {};
			var environment = createEnvironment(vistaClient);
			var expectedJdsError = [null, null];
			var expectedJdsResponse = [{
				statusCode: 404
			}, {
				statusCode: 201
			}];
			var expectedJdsResult = [null, null];
			environment.jds._setResponseData(expectedJdsError, expectedJdsResponse, expectedJdsResult);

			var ptDemographicsUtil = new PtDemographicsUtil(log, config, environment);
			runs(function() {
				ptDemographicsUtil.retrieveOrCreateDemographicsForSecondaryPid('9E7A;111', demographicsFromVista, function(error, ptDemographics) {
					expect(error).toEqual('FailedPidNotSecondarySite');
					expect(ptDemographics).toBeNull();
	                expect(environment.jds.getPtDemographicsByPid.calls.length).toEqual(0);
	                expect(environment.jds.storePatientData.calls.length).toEqual(0);
					finished = true;
				});
			});

			waitsFor(function() {
				return finished;
			});
		});
	});

    describe('_morphToSecondaryDemographics()', function() {
        it('Happy Path', function() {
            var primaryDemographics = {
                'pid': '9E7A;3',
                'birthDate': '19350407',
                'last4': '0008',
                'last5': 'E0008',
                'icn': '10108V420871',
                'familyName': 'EIGHT',
                'givenNames': 'PATIENT',
                'fullName': 'EIGHT,PATIENT',
                'displayName': 'Eight,Patient',
                'genderCode': 'urn:va:pat-gender:M',
                'genderName': 'Male',
                'sensitive': false,
                'uid': 'urn:va:patient:9E7A:3:3',
                'summary': 'Eight,Patient',
                'ssn': '666000008',
                'localId': '3',
                'shortInpatientLocation': 'shortInpatientLocation',
                'roomBed': 'roomBed',
                'inpatientLocation' : 'inpatientLocation',
                'admissionUid': 'admissionUid',
                'cwadf' : 'cwadf'
            };

            var secondaryDemographics = PtDemographicsUtil._morphToSecondaryDemographics(primaryDemographics);
            expect(secondaryDemographics.shortInpatientLocation).toBeUndefined();
            expect(secondaryDemographics.roomBed).toBeUndefined();
            expect(secondaryDemographics.inpatientLocation).toBeUndefined();
            expect(secondaryDemographics.admissionUid).toBeUndefined();
            expect(secondaryDemographics.cwadf).toBeUndefined();
        });
    });

});
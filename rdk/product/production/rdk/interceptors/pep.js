/*jslint node: true */
'use strict';

var rdk = require('../rdk/rdk');
var rpcUtil = require('../utils/rpc/rpcUtil');
var JsonAuth = require('../systems/pep/JsonAuth');
var httpUtil = require('../utils/http-wrapper/http');
var vista = require('../VistaJS/VistaJS');
var nullchecker = require('../utils/nullchecker/nullchecker');
var SENSITIVITY_RPC = 'HMPCRPC RPC';
var RPC_COMMAND_PATIENT_ACCESS = 'logPatientAccess';
var _ = require('underscore');
var cache = require('memory-cache');
var now = require('performance-now');

/**
 * Check for authorization via policy decision point
 * 
 * @namespace pep
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next A callback function
 * @return {undefined}
 */
module.exports = function(req, res, next) {

	var config = req.app.config;
	req.audit.sensitive = 'false';
	if ('interceptors' in config && 'pep' in config.interceptors
			&& config.interceptors.pep.disabled) {
		req.logger.warn('PEP: pep authorization disabled');
		next();
		return;
	}

	// if this is not created it should be an object
	// it is undefined while running tests
	// but it may also be undefined based on how the PEP is called
	var _this = this || {};
	var requestUser = req.session.user || undefined;
	var patientIdentifier = '';
	var isPatientIdPid = false;
	_this.requestUserAuthorization = {
		accessCode : '',
		verifyCode : ''
	};

	req.logger.info('PEP: pep authorization invoked');

	/**
	 * THIS APPEARS TO BE DONE FOR US IN THE AUTHORIZATION INTERCEPTOR NAD NEVER
	 * STORED
	 * 
	 * set the access and verify code from the request 'Authorization' header
	 */
	try {
		_this.requestUserAuthorization.accessCode = requestUser.accessCode;
		_this.requestUserAuthorization.verifyCode = requestUser.verifyCode;
	} catch (e) {
		req.logger
				.warn('Could not parse Authorization field from request.  Please ensure that the access and verify codes are encoded properly');
	}

	if (!checkUserPermissions()) {
		return res.status(rdk.httpstatus.forbidden).send(
				'User lacks sufficient permissions for this resource.');
	}

	/**
	 * set the xacml resource (patient) if available
	 */
	try {
		var requestPid;
		if (req.query.pid) {
			requestPid = req.query.pid;
		} else {
			requestPid = req.body.pid;
		}
		if (requestPid.indexOf(';') !== -1) {
			var splitPid = requestPid.split(';');
			isPatientIdPid = true;
			patientIdentifier = splitPid[1];
		} else {
			patientIdentifier = requestPid;
		}
	} catch (e) {
		req.logger.warn('Could not get pid field from request.');
	}

	// Stop if there is no patient
	if (nullchecker.isNullish(patientIdentifier) === true) {
		req.logger.warn('No patient could be identified to authorize against.');
		res.status(rdk.httpstatus.forbidden).send();
		return;
	}

	/**
	 * Parameters passed to the pep XcamlAuth.getAuth
	 * 
	 * @type {Object}
	 */
	_this.options = {
		action : 'read',
		breakglass : req.query._ack || 'false',
		resource : patientIdentifier,
		sensitive : 'false',
		hasSSN : 'true',
		requestingOwnRecord : 'false',
		subject : '',
		siteCode : '',
		rptTabs : 'false',
		corsTabs : 'false',
		dgRecordAccess : 'false',
		dgSensitiveAccess : 'false',
		dgSecurityOfficer : 'false',
		text : ''
	};

	if (typeof requestUser === 'object') {
		if (requestUser.hasOwnProperty('username')) {
			_this.options.subject = requestUser.username;
		}
		if (requestUser.hasOwnProperty('facility')) {
			_this.options.siteCode = requestUser.facility;
		}
		if (requestUser.hasOwnProperty('rptTabs')) {
			_this.options.rptTabs = requestUser.rptTabs;
		}
		if (requestUser.hasOwnProperty('corsTabs')) {
			_this.options.corsTabs = requestUser.corsTabs;
		}
		if (requestUser.hasOwnProperty('dgRecordAccess')) {
			_this.options.dgRecordAccess = requestUser.dgRecordAccess;
		}
		if (requestUser.hasOwnProperty('dgSensitiveAccess')) {
			_this.options.dgSensitiveAccess = requestUser.dgSensitiveAccess;
		}
		if (requestUser.hasOwnProperty('dgSecurityOfficer')) {
			_this.options.dgSecurityOfficer = requestUser.dgSecurityOfficer;
		}
	}

	function checkUserPermissions() {
		var passed;
		req.logger.info('Required permissions: [ %s ]',
				req._resourceConfigItem.permissions);
		req.logger
				.info('User permissions:     [ %s ]', requestUser.permissions);
		var missingPermissions = _.difference(
				req._resourceConfigItem.permissions, requestUser.permissions);
		if (_.isEmpty(missingPermissions)) {
			req.logger
					.info('User has the required permissions for this resource. Continuing pep...');
			passed = true;
		} else {
			req.logger
					.info('User lacks sufficient permissions for this resource - UNAUTHORIZED');
			passed = false;
		}
		return passed;
	}

	var runPep = function(err) {

		if (err) {
			req.logger
					.error('An error occured in pep while gathering data from JDS'
							+ err);
			res.status(rdk.httpstatus.internal_server_error).send();
			return;
		}

		// no access -> 403 httpstatus.forbidden
		// access but no _ack -> 308 httpstatus.permanent_redirect
		// full access -> 200 httpstatus.ok
		req.logger.debug('PEP: processing pep request');

		var options = _this.options;

		var requestCache = {};
		// _.pick correctly orders items - use it to ensure stringify
		// consistency
		var keys = _.keys(options).sort();
		requestCache.key = 'pep-interceptor'
				+ JSON.stringify(_.pick.apply(null, _
						.flatten([ options, keys ])));

		var cachedResponse = cache.get(requestCache.key);
		if (cachedResponse) {
			requestCache.cached = true;
			var timeDelta = now() - cachedResponse.begin;
			req.logger.info('PEP: cached response used from %sms ago',
					timeDelta);
			return pepAuthHandler(cachedResponse.err, cachedResponse.response,
					requestCache);
		}

		var pep = new JsonAuth();

		var pepAuthHandlerPartial = _.partial(pepAuthHandler, _, _,
				requestCache);
		/**
		 * Go to the JsonAuth and have it build, send and recieve a xacml
		 * authorization request. {@link module:JsonAuth.getAuth}
		 */
		pep.getAuth(options, pepAuthHandlerPartial);

	};

	function pepAuthHandler(err, response, requestCache) {
		var status = rdk.httpstatus.forbidden;
		var sendBodyText = response.text;
		var pepResponseCode = {
			permit : 'Permit',
			breakglass : 'BreakGlass',
			notapplicable : 'NotApplicable',
			indeterminate : 'Indeterminate',
			deny : 'Deny'
		};

		if (err) {
			req.logger.error('PEP: error from JsonAuth' + err);
			return res.status(rdk.httpstatus.internal_server_error).send(
					sendBodyText);
		}
		req.logger.debug('PEP: ' + response.code + ' pep response received.');
		switch (response.code) {
		case pepResponseCode.permit:
			status = rdk.httpstatus.ok;
			if (!requestCache.cached) {
				var millisecondsCached = 15 * 60 * 1000;
				cache.put(requestCache.key, {
					err : err,
					response : response,
					begin : now()
				}, millisecondsCached);
				req.logger.info('PEP: response cached, expires in %d ms',
						millisecondsCached);
			}
			break;
		case pepResponseCode.breakglass:
			/*
			 * This is a non-default Axiomatics response. We set this when the
			 * PDP returns a breakglass value.
			 */
			status = rdk.httpstatus.permanent_redirect;
			res.header('BTG', response.reason);
			break;
		default:
			// default to deny for Deny, Not Applicable and Indeterminate
			// results
			status = rdk.httpstatus.forbidden;
		}

		res.status(status);

		if (status === rdk.httpstatus.ok) {
			return next();
		} else {
			return res.send(sendBodyText);
		}

	}

	var sensitivityReponseRPC = function(localpid, serverConfig) {
		if (typeof serverConfig !== 'object'
				&& nullchecker.isNullish(patientIdentifier)) {
			return;
		}
		req.logger.debug('PEP: calling sensative rpc call to Vista'
				+ serverConfig.name);

		vista.callRpc(req.logger, serverConfig, SENSITIVITY_RPC, [ {
			'"command"' : RPC_COMMAND_PATIENT_ACCESS,
			'"patientId"' : localpid
		} ], function(err, result) {
			if (err) {
				req.logger.warn('PEP: Sensitive RPC call error: ' + err);
			}

			if (result) {
				req.logger.debug('PEP: Sensitive RPC results: ' + result);
			}
		});
	};

	var patientDataInformation = function(statusCode, response) {
		if (typeof response === 'string') {
			// TODO
			// this should be inside a try catch
			response = JSON.parse(response);
		}
		if (typeof response !== 'object') {
			return;
		}
		if (!response.hasOwnProperty('data')) {
			return;
		}
		if (!(response.data.hasOwnProperty('items') && config
				.hasOwnProperty('vistaSites'))) {
			req.logger
					.warn('PEP: Not enough information available to build an authorization request.');
			return;
		}
		if (response.data.items instanceof Array) {
			// check if ssn match the user and the patient
			// ssn must be filled in and match
			// an empty string is considered false
			if (req.session.user && req.session.user.hasOwnProperty('ssn')
					&& req.session.user.ssn && response.data.items.length > 0
					&& response.data.items[0].hasOwnProperty('ssn')
					&& response.data.items[0].ssn
					&& (req.session.user.ssn === response.data.items[0].ssn)) {
				// must be a string of true
				_this.options.requestingOwnRecord = 'true';
			}
			_
					.each(
							response.data.items,
							function(patientObj) {
								var key = patientObj.pid.split(';')[0];
								var localpid = patientObj.pid.split(';')[1];
								if (patientObj.sensitive === true) {
									_this.options.sensitive = 'true';
									req.audit.sensitive = 'true';
									if (_this.options.breakglass === 'true') {
										var serverConfig = rpcUtil
												.getVistaRpcConfiguration(
														config, key);

										serverConfig.accessCode = _this.requestUserAuthorization.accessCode;
										serverConfig.verifyCode = _this.requestUserAuthorization.verifyCode;
										sensitivityReponseRPC(localpid,
												serverConfig);
									}
								}
								if (nullchecker.isNullish(patientObj.ssn)) {
									_this.options.hasSSN = false;
								}
							});
		}
	};

	// Trigger the JDS fetch and run the check for sensative data on a patient
	// and finally run the pep
	// paths can be as follows
	// http://10.2.2.110:9080/data/index/pt-select-icn/?range=5123456789V027402
	// http://10.2.2.110:9080/data/index/pt-select-pid/?range=9E7A;18

	// /////////////////////////////////////////////////////////////
	// NOTE: You MUST NOT add server configurations EXCEPT to //
	// the config file. Adding NEW server configurations //
	// REQUIRES that you coordinate with dev-ops or you will //
	// BREAK the build on Jenkins. //
	// /////////////////////////////////////////////////////////////
	var jdsPath = '/data/index/pt-select-';
	jdsPath += isPatientIdPid ? 'pid' : 'icn';
	jdsPath += '?range=' + req.query.pid;

	var jdsConfig = req.app.config.jdsServer;
	httpUtil.fetch({
		cacheTimeout : 15 * 60 * 1000,
		timeoutMillis : 5000,
		logger : req.logger,
		options : {
			host : jdsConfig.host,
			port : jdsConfig.port,
			path : jdsPath,
			method : 'GET'
		}
	}, runPep, patientDataInformation);

};

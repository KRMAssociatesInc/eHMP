'use strict';

//------------------------------------------------------------------------------------
// This class is used to store and retrieve the last update time for a site from
// JDS.
//
// Author: Les Westberg
//-------------------------------------------------------------------------------------

require('../env-setup');

var logUtil = require(global.OSYNC_UTILS + 'log');
//var inspect = require(global.VX_UTILS + 'inspect');
var _ = require('underscore');


//-------------------------------------------------------------------------------------
// Constructor for this class.
//
// log: The log to be used to write log messages to.
// vistaId: The vistaId for the site that the last-update-time is to be stored for.
// jdsClient: The handle to the jdsClient object.
//-------------------------------------------------------------------------------------
var VprUpdateOpData = function(log, vistaId, jdsClient) {
	this.log = logUtil.getAsChild('VprUpdateOpData-' + vistaId, log);
	this.vistaId = vistaId;
	this.jdsClient = jdsClient;
};

//---------------------------------------------------------------------------------------
// This function stores the last update time to JDS.
//
// lastUpdateTime: This is a string for the last update time in internal vista
//                 format (3150106-1624)
// callback: The callback handler to call when the data is stored.
//---------------------------------------------------------------------------------------
VprUpdateOpData.prototype.storeLastUpdateTime = function(lastUpdateTime, callback) {
	var self = this;
	var errorMessage;

	if (!lastUpdateTime) {
		errorMessage = 'Failed to store lastUpdateTime.  lastUpdateTime did not contain a valid value.  lastUpdateTime: ' + lastUpdateTime;
		self.log.error('storeLastUpdateTime: ' + errorMessage);
		callback(errorMessage, null);
		return; // Get out of here.
	}
	if (!self.vistaId) {
		errorMessage = 'Failed to store lastUpdateTime.  vistaId did not contain a valid value.  vistaId: ' + self.vistaId;
		self.log.error('storeLastUpdateTime: ' + errorMessage);
		callback(errorMessage, null);
		return; // Get out of here.
	}

	var lastUpdateTimeUid = 'urn:va:vprupdate:' + self.vistaId;
	var lastUpdateTimeOpData = {
		_id: self.vistaId,
		lastUpdate: lastUpdateTime,
		uid: lastUpdateTimeUid
	};

	self.jdsClient.storeOperationalDataMutable(lastUpdateTimeOpData, function(error, response) {
		var errorMessage;

		// Check for error conditions
		//---------------------------
		if (error) {
			errorMessage = 'Failed to store last update time to JDS for VistaId: ' + self.vistaId + '.  Error: ' + error;
			self.log.error('storeLastUpdateTime: ' + errorMessage + ' response: [%j]', response);
			return callback(errorMessage, null);
		}

		if (!response) {
			errorMessage = 'Failed to store last update time to JDS for VistaId: ' + self.vistaId + '.  JDS did not return an error or a response.';
			self.log.error('storeLastUpdateTime: ' + errorMessage + ' response: []');
			return callback(errorMessage, null);
		}

		if (response.statusCode !== 200) {
			errorMessage = 'Failed to store last update time for vistaId: ' + self.vistaId + ' response.statusCode: ' + response.statusCode;
			self.log.error('storeLastUpdateTime: ' + errorMessage + ' response: [%j]', response);
			return callback(errorMessage, null);
		}

		self.log.debug('storeLastUpdateTime: Successfully stored last update time for vistaId: %s.  response: [%j]', self.vistaId, response);
		callback(null, 'success');
	});
};

//---------------------------------------------------------------------------------------
// This function stores the last update time to JDS.
//
// callback: The callback handler to call when the data is stored.  Note if there is no
//           error, then the  lastUpdateTime will be sent as the second parameter of the
//           callback function.  It is a string in format (3150106-1624)
//---------------------------------------------------------------------------------------
VprUpdateOpData.prototype.retrieveLastUpdateTime = function(callback) {
	var self = this;
	var errorMessage;

	if (!self.vistaId) {
		errorMessage = 'Failed to retrieve lastUpdateTime.  vistaId did not contain a valid value.  vistaId: ' + self.vistaId;
		self.log.error('retrieveLastUpdateTime: ' + errorMessage);
		callback(errorMessage, null);
		return; // Get out of here.
	}

	//var lastUpdateTimeUid = 'urn:va:vprupdate:' + self.vistaId;

	self.jdsClient.getOperationalDataMutable(self.vistaId, function(error, response, result) {
		var errorMessage;

		if (error) {
			errorMessage = 'Failed to retrieve last update time from JDS for VistaId: ' + self.vistaId + '.  Error: ' + error;
			self.log.error('retrieveLastUpdateTime: ' + errorMessage + ' response: [%j]', response);
			return callback(errorMessage, null);
		}

		if (!response) {
			errorMessage = 'Failed to retrieve last update time from JDS for VistaId: ' + self.vistaId + '.  JDS did not return an error or a response.';
			self.log.error('retrieveLastUpdateTime: ' + errorMessage + ' response: []');
			return callback(errorMessage, null);
		}

		if (response.statusCode !== 200) {
			errorMessage = 'Failed to retreive last update time from JDS for vistaId: ' + self.vistaId + ' response.statusCode: ' + response.statusCode;
//			console.log('Failed to retrieve last update time.  response: %j', response);
			self.log.error('storeLastUpdateTime: ' + errorMessage + ' response: [%j]', response);
			return callback(errorMessage, null);
		}

		if (!result) {
			errorMessage = 'Failed to retrieve last update time from JDS for VistaId: ' + self.vistaId + '.  JDS did not return an error, response, or a result.';
			self.log.error('retrieveLastUpdateTime: ' + errorMessage + ' response: []; result: []');
			return callback(errorMessage, null);
		}

        // This is the case where there is currently not a lastUpdateTime stored.   The lowest value is '0'.  So return that.
        //-------------------------------------------------------------------------------------------------------------------
        if (response.statusCode === 200 && result && _.isEmpty(result)) {
            self.log.debug('retrieveLastUpdateTime: No last update time found in JDS for vistaId: %s; Returning 0 as last update time.', self.vistaId);
            return callback(null, '0');
        }

		// We got a result back - lets see if it contained what we wanted.
		//-----------------------------------------------------------------
		//if ((result.data) && (result.data.items) && (result.data.items.length === 1) && (result.data.items[0].timestamp)) {
		if(result && result.lastUpdate){
        	self.log.debug('retrieveLastUpdateTime: Returning last update time for vistaId: %s; lastUpdateTime: %s', self.vistaId, result.lastUpdate);
			callback(null, result.lastUpdate);
		}
		else {
			errorMessage = 'Failed to retrieve last update time from JDS for VistaId: ' + self.vistaId + '.  Received a response from JDS but it did not contain what we were looking for.';
			self.log.error('retrieveLastUpdateTime: ' + errorMessage + ' response: [%j]; result: [%j]', response, result);
//				console.log('Result: [' + inspect(result) + '].');
			callback(errorMessage, null);
		}
	});
};

module.exports = VprUpdateOpData;
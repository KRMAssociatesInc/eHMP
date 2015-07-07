'use strict';

var _ = require('underscore');
var util = require('util');
var objUtil = require(global.VX_UTILS+'object-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var logUtil = require(global.VX_UTILS + 'log');
//var async = require('async');

//-------------------------------------------------------------------------------------
// Constructor for VistaClient.
//
// log - The logger to be used to log messages.
// config - The configuration information that was established for this environment.
// rpcClient - The handle to the client used to make RPC calls to VistA.
//-------------------------------------------------------------------------------------
function VistaClient(log, config, rpcClient) {
    if (!(this instanceof VistaClient)) {
        return new VistaClient(log, config);
    }

    this.log = log;
    // this.log = require('bunyan').createLogger({
    //     name: 'vista-client',
    //     level: 'debug'
    // });
    this.rpcLog = logUtil.get('rpc', log);
    this.config = config;
    this.hmpServerId = config['hmp.server.id'];
    this.hmpVersion = config['hmp.version'];
    this.hmpBatchSize = config['hmp.batch.size'];
    this.extractSchema = config['hmp.extract.schema'];
    log.debug('vista-client.vistaSubscribe: creating vista subscribe proxy');
    if (rpcClient) {
        this.rpcClient = rpcClient;
    } else {
        this.rpcClient = require(global.VX_VISTAJS + 'RpcClient').RpcClient;
    }
}

//-------------------------------------------------------------------------------------
// This function makes an RPC call to VistA to subscribe the patient.
//
// vistaId - The site hash for the vistaId that this handler is configured to process.
// patientIdentifier - This is an object that represents the patient identifier.  It
//                     must be a pid for the site represented in vistaId.
// rootJobId - This is the job Id of the root job that triggered this subscription
// jobId - This is the job Id of the job that represents the poller's job when it
//         receives the data for this patient.
// subscribeCallback - The is the function that is called when the RPC call is completed.
//-------------------------------------------------------------------------------------
VistaClient.prototype.subscribe = function(vistaId, patientIdentifier, rootJobId, jobId, subscribeCallback) {
    var self = this;
    self.log.debug('vista-client.subscribe: vistaId: %s; patient: %j; rootJobId: %s; jobId: %s', vistaId, patientIdentifier, rootJobId, jobId);
    var pid = patientIdentifier.value;
    var dfn = idUtil.extractDfnFromPid(pid);

    var rpcConfig = _createRpcConfigVprContext(self.config.vistaSites, vistaId);
    var configWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(rpcConfig,'accessCode'),'verifyCode');

    self.log.debug('vista-client.subscribe: rpcConfig for pid: %s - %j', pid, configWithoutPwd);

    var params;

    if (rpcConfig) {
        params = {
            '"server"': self.hmpServerId,
            '"command"': 'putPtSubscription',
            '"localId"': dfn,
            '"rootJobId"': rootJobId,
            '"jobId"': jobId
        };
        self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMPDJFS API', params, function(error, response) {
            self.log.debug('vista-client.subscribe: Completed calling RPC for pid: %s; error: %s', pid, error);
            var responseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(response,'accessCode'),'verifyCode');
            self.log.debug('vista-client.subscribe: Completed calling RPC for pid: %s; result: %j', pid, responseWithoutPwd);
            if (!error) {
                handleSuccessfulResponse(response, pid);
            } else {
                handleFailedRequestResponse(error, response, pid);
            }
        });

        //request.post(url, handleMockResponse);
    } else {
        handleFailedRequestResponse('Failed to subscribe patient for pid: ' + pid + ', invalid config', null, pid);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.log.debug('vista-client.handleSuccessfulResponse: successfully subscribed for patient %s', pid);
        var vistaResponseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(vistaResponse,'accessCode'),'verifyCode');
        self.log.debug(vistaResponseWithoutPwd);
        subscribeCallback(null, 'success');
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // response - The result returned from VistA through the RPC
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, response, pid) {
        var errorMessage = 'Subscribe error for pid: ' + pid + '; error: ' + error;
        self.log.error('%s response: %j', errorMessage, response);
        subscribeCallback(errorMessage, null);
    }
};

//-----------------------------------------------------------------------------------------------
// This method fetches the next batch of messages from a VistA site.
//
// vistaId: The vista site to fetch from.
// lastUpdateTime: The last time a fetch was done to this site.
// batchCallBack: The callback function to call when the fetch completes.
//-----------------------------------------------------------------------------------------------
VistaClient.prototype.fetchNextBatch = function(vistaId, lastUpdateTime, batchCallback) {
    var self = this;
    self.log.debug('vista-client.fetchNextBranch: Entering VistaClient.fetchNextBatch vistaId: %s.  lastUpdateTime: %s', vistaId, lastUpdateTime);

    var rpcConfig = _createRpcConfigVprContext(self.config.vistaSites, vistaId);
    var configWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(rpcConfig,'accessCode'),'verifyCode');

    self.log.debug('vista-client.fetchNextBranch: rpcConfig for fetchNextBranch: %j', configWithoutPwd);

    var params;

    if (rpcConfig) {
        params = {
            '"command"': 'getPtUpdates',
            '"lastUpdate"': lastUpdateTime,
            '"getStatus"': true,
            '"max"': self.hmpBatchSize,
            '"hmpVersion"': self.hmpVersion,
            '"extractSchema"': self.extractSchema,
            '"server"': self.hmpServerId
        };
        self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMPDJFS API', params, function(error, response) {
            self.log.debug('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s; error: %s', vistaId, error);
            self.log.debug('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s', vistaId);
            self.log.trace('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s; response (String): %s', vistaId, response);
            if ((!error) && (response)) {
                // TODO:  Need to change RpcClient to return JSON and not a string...
                //--------------------------------------------------------------------
                var jsonResponse;
                try {
                    jsonResponse = JSON.parse(response);
                    self.log.debug('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s', vistaId);
                    self.log.trace('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s; jsonResponse: %j', vistaId, jsonResponse);
                } catch (e) {
                    self.log.debug('vista-client.fetchNextBranch: Failed to parse JSON');
                    return handleFailedRequestResponse('Failed to parse the response into JSON for vistaId: ' + vistaId, null);
                }
                if ((jsonResponse) && (jsonResponse.data)) {
                    handleSuccessfulResponse(jsonResponse);
                } else {
                    handleFailedRequestResponse('vista-client.fetchNextBranch: jsonResponse did not contain any data attribute.', jsonResponse);
                }
            } else {
                handleFailedRequestResponse(error, response);
            }
        });
    } else {
        handleFailedRequestResponse('vista-client.fetchNextBranch: Failed to call RPC getPtUpdates for vistaId: ' + vistaId + ', invalid config', null);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // jsonResponse - the result returned from VistA through the RPC in JSON format.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(jsonResponse) {
        self.log.debug('vista-client.handleSuccessfulResponse: Successfully called RPC for getPtUpdates.');
        batchCallback(null, jsonResponse.data);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // vistaResponse - The result returned from VistA through the RPC
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, vistaResponse) {
        var errorMessage = 'Subscribe error for RPC call: getPtUpdates: Error: ' + error;
        if (vistaResponse && vistaResponse.warning && vistaResponse.warning === 'Staging is not complete yet!') {
            self.log.debug('vista-client.fetchNextBatch.handleFailedRequestResponse: Staging is not yet complete');
        } else {
            self.log.error('%s response: %j', errorMessage, vistaResponse);
        }
        batchCallback(errorMessage, vistaResponse);
    }

};


//-----------------------------------------------------------------------------------------
// This function retrieves the patient demographics for the given site and dfn from VistA
// and returns it as the response in the callback.
//
// vistaId: The vistaId of the site.
// dfn: The dfn of the patient.
// callback: The handler to call when the data is received.  It will pass the information
// in the response parameter of the callback.
//-----------------------------------------------------------------------------------------
VistaClient.prototype.getDemographics = function(vistaId, dfn, callback) {
    var self = this;
    self.log.debug('vista-client.getDemographics: vistaId: %s; dfn: %s', vistaId, dfn);
    var pid = vistaId + ';' + dfn;

    var rpcConfig = _createRpcConfigVprContext(self.config.vistaSites, vistaId);

    var configWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(rpcConfig,'accessCode'),'verifyCode');
    self.log.debug('vista-client.getDemographics: rpcConfig for pid: %s; rpcConfig: %j', pid, configWithoutPwd);

    var params;

    if (rpcConfig) {
        params = {
            '"patientId"': dfn,
            '"domain"': 'patient',
            '"extractSchema"': self.extractSchema
        };
        self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMP GET PATIENT DATA JSON', params, function(error, response) {
            self.log.debug('vista-client.getDemographics: Completed calling RPC for pid: %s; error: %s', pid, error);
            self.log.debug('vista-client.getDemographics: Completed calling RPC for pid: %s; result: %j', pid, response);
            if (!error) {
                handleSuccessfulResponse(response, pid);
            } else {
                handleFailedRequestResponse(error, response, pid);
            }
        });

        //request.post(url, handleMockResponse);
    } else {
        handleFailedRequestResponse('Failed to subscribe patient for pid: ' + pid + ', invalid config', null, pid);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.log.debug('vista-client.getDemographics.handleSuccessfulResponse: successfully subscribed for patient %s; vistaResponse: %s', pid, vistaResponse);
        if (typeof vistaResponse === 'string') {
            try {
                self.log.debug('vista-client.getDemographics.handleSuccessfulResponse: Response was a string - parse to an object.');
                vistaResponse = JSON.parse(vistaResponse);
            } catch (e) {
                self.log.error('vista-client.getDemographics.handleSuccessfulResponse: Failed to parse response for pid: %s; vistaResponse: %s', pid, vistaResponse);
                return callback('Failed to parse response.', vistaResponse);
            }
        }

        // Find the actual Demographics data and return that...
        //-----------------------------------------------------
        if ((vistaResponse) && (vistaResponse.data) && (vistaResponse.data.totalItems) && (vistaResponse.data.totalItems === 1) && (vistaResponse.data.items) && (vistaResponse.data.items.length === 1)) {
            return callback(null, vistaResponse.data.items[0]);
        }

        self.log.error('vista-client.getDemographics.handleSuccessfulResponse:  Response did not contain the expected data.  pid: %s; vistaResponse: %j', pid, vistaResponse);
        return callback(util.format('Response did not contain the expected data.  pid: %s; vistaResponse: %j', pid, vistaResponse), vistaResponse);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // vistaResponse - The result returned from VistA through the RPC
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, vistaResponse, pid) {
        var errorMessage = 'Subscribe error for pid: ' + pid + '; error: ' + error;
        self.log.error('vista-client.getDemographics.handleSuccessfulResponse: %s response: %j', errorMessage, vistaResponse);
        callback(errorMessage, null);
    }
};


VistaClient.prototype.fetchAppointment = function(vistaId, batchCallback) {

    var self = this;
    var rpcConfig = _createRpcConfigVprContext(self.config.vistaSites, vistaId);

    self.log.debug('vista-client.fetchAppointment: rpcConfig for fetchAppointment: %j', rpcConfig);
    if (rpcConfig) {
        var parameter = [];
        self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMP PATIENT ACTIVITY', parameter, function(error, response) {
            if (error) {
                self.log.debug('vista-client.fetchAppointment: error ' + error);
                return handleFailedRequestResponse(error, response);
            }

            if (_.isEmpty(response) || (_.isString(response) && _.isEmpty(response.trim()))) {
                handleSuccessfulResponse(JSON.parse('[]'));
            } else {
                self.log.debug('vista-client.fetchAppointment: Completed calling RPC. Got response back for vistaId: %s; response (String): %s', vistaId, response);
                var jsonResponse;
                try {
                    jsonResponse = JSON.parse(response);
                    self.log.debug('vista-client.fetchAppointment: Completed calling RPC: getPtUpdates: for vistaId: %s; jsonResponse: %j', vistaId, jsonResponse);
                    handleSuccessfulResponse(jsonResponse);
                } catch (e) {
                    self.log.debug('vista-client.fetchAppointment: Failed to parse JSON');
                    return handleFailedRequestResponse('Failed to parse the response into JSON for vistaId: ' + vistaId, null);
                }

                if (!_.isArray(jsonResponse)) {
                    return handleFailedRequestResponse('vista-client.fetchAppointment: jsonResponse did not contain any data attribute.', jsonResponse);
                }
            }

        });
    } else {
        handleFailedRequestResponse('vista-client.fetchAppointment: Failed to call RPC getPtUpdates for vistaId: ' + vistaId + ', invalid config', null);
    }


    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // jsonResponse - the result returned from VistA through the RPC in JSON format.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(jsonResponse) {
        self.log.debug('vista-subscribe.fetchAppointment.handleSuccessfulResponse: Successfully called RPC.', jsonResponse);
        batchCallback(null, jsonResponse);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // vistaResponse - The result returned from VistA through the RPC
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, vistaResponse) {
        var errorMessage = 'vista-client.fetchAppointment.handleFailedRequestResponse: Subscribe error for RPC call: getPtUpdates: Error: ' + error;
        self.log.error('Error: %s; response: %j', errorMessage, vistaResponse);
        batchCallback(errorMessage, vistaResponse);
    }

};

VistaClient.prototype.unsubscribe = function(pid, unsubscribeCallback) {
    var self = this;
    self.log.debug('vista-client.unsubscribe: pid: %s', pid);
    var vistaId = idUtil.extractSiteFromPid(pid);

    var rpcConfig = _createRpcConfigVprContext(self.config.vistaSites, vistaId);
    self.log.debug('vista-client.unsubscribe: rpcConfig for pid: %s - %j', pid, rpcConfig);

    var params;

    if (rpcConfig) {
        params = {
            '"hmpSrvId"': self.hmpServerId,
            '"pid"': pid
        };
        self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMPDJFS DELSUB', params, function(error, response) {
            self.log.debug('vista-client.unsubscribe: Completed calling RPC for pid: %s; error: %s', pid, error);
            self.log.debug('vista-client.unsubscribe: Completed calling RPC for pid: %s; result: %j', pid, response);
            if (!error) {
                handleSuccessfulResponse(response, pid);
            } else {
                handleFailedRequestResponse(error, response, pid);
            }
        });

        //request.post(url, handleMockResponse);
    } else {
        handleFailedRequestResponse('Failed to unsubscribe patient for pid: ' + pid + ', invalid config', null, pid);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.log.debug('vista-client.handleSuccessfulResponse: successfully unsubscribed for patient %s', pid);
        self.log.debug(vistaResponse);
        unsubscribeCallback(null, 'success');
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // response - The result returned from VistA through the RPC
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, response, pid) {
        var errorMessage = 'Unsubscribe error for pid: ' + pid + '; error: ' + error;
        self.log.error('%s response: %j', errorMessage, response);
        unsubscribeCallback(errorMessage, null);
    }
};

//------------------------------------------------------------------------------------
// This method creates the configuration context that is to be sent to the RPC.  Most
// of the context is the same for every RPC call and can be obtained from the
// configuration.  But some items are specific to the RPC call.  This adds in the
// items that are specific to the RPC call.
//------------------------------------------------------------------------------------
function _createRpcConfigVprContext(config, vistaId) {
    var siteConfig = config[vistaId];
    var rpcConfig = _.clone(siteConfig);
    rpcConfig.context = 'HMP SYNCHRONIZATION CONTEXT';
    return (rpcConfig);
}


//-----------------------------------------------------------------------------------------
// This function retrieves all the ids this patient has in all sites she has
// records in. Used by mviClient ...
//
// dfn: The dfn of the patient.
// stationNumber: station number for the patient
// Typical input:
//          3^PI^USVHA^500
// callback: The handler to call when the data is received.  It will pass the information
// in the response parameter of the callback.
// Response is a string such as:
//      10108V420871^NI^200M^USVHA^A\r\n3^PI^9E7A^USVHA^A\r\n0000000003^NI^200DOD^USDOD^A\r\n
//          icn 10108V420871
//          pid 9E7A;3
//          edipi 0000000003
//-----------------------------------------------------------------------------------------
VistaClient.prototype.getIds = function(rpcConfig, dfn, stationNumber, callback) {
    var self = this;
    self.log.debug('vista-client.getIds: dfn: %s; stationNumber: %s', dfn, stationNumber);

    if (_.isUndefined(rpcConfig) || _.isUndefined(dfn) || _.isUndefined(stationNumber)) {
        self.log.error('vista-client.getIds: with incomplete parameters...');
        callback('Failed to getIds');
        return;
    }


    var params = dfn + '^PI^USVHA^' + stationNumber;
    rpcConfig.context = 'HMP SYNCHRONIZATION CONTEXT';

    self.rpcClient.callRpc(self.rpcLog, rpcConfig, 'HMP LOCAL GETCORRESPONDINGIDS', params, function(error, response) {
        if (error) {
            self.log.error('vista-client.getIds: Completed calling RPC for dfn: %s; error: %s', dfn, error);
            callback(error);
        } else {
            self.log.debug('vista-client.getIds: Completed calling RPC for dfn: %s; result: %j', dfn, response);
            callback(null, response);
        }
    });
};

module.exports = VistaClient;
VistaClient._createRpcConfigVprContext = _createRpcConfigVprContext;

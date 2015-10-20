'use strict';

var _ = require('underscore');
var util = require('util');
var objUtil = require(global.VX_UTILS + 'object-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var logUtil = require(global.VX_UTILS + 'log');
var uuid = require('node-uuid');
//var async = require('async');

var rpcClients = [];

//-------------------------------------------------------------------------------------
// Constructor for VistaClient.
//
// log - The logger to be used to log messages.
// config - The configuration information that was established for this environment.
// rpcClient - The handle to the client used to make RPC calls to VistA.
//-------------------------------------------------------------------------------------
function VistaClient(log, metrics, config, rpcClient) {
    var self = this;
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
    this.metrics = metrics;
    this.hmpServerId = config['hmp.server.id'];
    this.hmpVersion = config['hmp.version'];
    this.hmpBatchSize = config['hmp.batch.size'];
    this.extractSchema = config['hmp.extract.schema'];
    log.debug('vista-client.vistaSubscribe: creating vista subscribe proxy');
    if (rpcClient) {
        this.rpcClient = rpcClient;
    } else {
        this.rpcClient = require('vista-js').RpcClient;
    }
    _.each(config.vistaSites, function(siteConfig, siteId){
        if(!rpcClients[siteId]) {
            var vistaConfig = _.clone(siteConfig);
            vistaConfig.context = 'HMP SYNCHRONIZATION CONTEXT';
            rpcClients[siteId] = new self.rpcClient(self.rpcLog, vistaConfig);
        }
    });
}

VistaClient.prototype._getRpcClient = function(vistaId) {
    if(rpcClients[vistaId]) {
        return rpcClients[vistaId];
    } else {
        return null;
    }
};

/**
 * This function invokes the HMP SUBSCRIPTION STATUS RPC to determine the subscriptiong
 * status of the provided DFN on the client's connected server.
 *
 * patientIdentifier - Should be a PID value for a VistA source
 * statusCallback - Callback function to receive results
 */
VistaClient.prototype.status = function(patientIdentifier, statusCallback) {
    var vistaId = patientIdentifier.split(';')[0];
    var dfn = patientIdentifier.split(';')[1];
    var rpcClient = this._getRpcClient(vistaId);
    var self = this;

    var params = {
        '"server"': this.hmpServerId,
        '"localId"': dfn
    };

    rpcClient.execute('HMP SUBSCRIPTION STATUS', params, function(error, response) {
        if (!error) {
            try {
                var result = JSON.parse(response);
                result.siteId = vistaId;
                return statusCallback(null, result);
            } catch (e) {
                self.log.error('VistaClient.status() : ERROR - %j', e);
                error = e;
            }
        }

        statusCallback(error);
    });
};

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
    var metricsObj = {
        'subsystem':'Vista',
        'action':'subscribe',
        'pid':patientIdentifier.value,
        'site':vistaId,
        'jobId':jobId,
        'rootJobId':rootJobId,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Subscribe', metricsObj);
    metricsObj.timer = 'stop';
    self.log.debug('vista-client.subscribe: vistaId: %s; patient: %j; rootJobId: %s; jobId: %s', vistaId, patientIdentifier, rootJobId, jobId);
    var pid = patientIdentifier.value;
    var dfn = idUtil.extractDfnFromPid(pid);

    self.log.debug('vista-client.subscribe: rpcConfig for pid: %s', pid);
    var rpcClient = this._getRpcClient(vistaId);

    var params;

    if (rpcClient) {
        params = {
            '"server"': self.hmpServerId,
            '"command"': 'putPtSubscription',
            '"localId"': dfn,
            '"rootJobId"': rootJobId,
            '"jobId"': jobId
        };
        rpcClient.execute('HMPDJFS API', params, function(error, response) {
            self.log.debug('vista-client.subscribe: Completed calling RPC for pid: %s; error: %s', pid, error);
            var responseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(response,'accessCode'),'verifyCode');
            self.log.debug('vista-client.subscribe: Completed calling RPC for pid: %s; result: %j', pid, responseWithoutPwd);
            if (!error) {
                return handleSuccessfulResponse(response, pid);
            } else {
                return handleFailedRequestResponse(error, response, pid);
            }
        });
    } else {
        self.metrics.debug('Vista Subscribe in Error', metricsObj);
        return handleFailedRequestResponse('Failed to subscribe patient for pid: ' + pid + ', invalid config', null, pid);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.log.info('vista-client.handleSuccessfulResponse: successfully subscribed for patient %s', pid);
        var vistaResponseWithoutPwd = objUtil.removeProperty(objUtil.removeProperty(vistaResponse,'accessCode'),'verifyCode');
        self.metrics.debug('Vista Subscribe', metricsObj);
        self.log.debug('vista-client.handleSuccessfulResponse: response for pid: %s; response: %s', pid, vistaResponseWithoutPwd);
        return subscribeCallback(null, 'success');
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
        self.metrics.debug('Vista Subscribe in Error', metricsObj);
        self.log.error('vista-client.handleFailedRequestResponse: %s response: %j', errorMessage, response);
        return subscribeCallback(errorMessage, null);
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
    var metricsObj = {
        'subsystem':'Vista',
        'action':'fetchNextBatch',
        'site':vistaId,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Fetch Next', metricsObj);
    metricsObj.timer = 'stop';
    self.log.debug('vista-client.fetchNextBranch: Entering VistaClient.fetchNextBatch vistaId: %s.  lastUpdateTime: %s', vistaId, lastUpdateTime);

    self.log.debug('vista-client.fetchNextBranch: rpcConfig for fetchNextBranch: %s', vistaId);
    var rpcClient = this._getRpcClient(vistaId);

    var params;

    if (rpcClient) {
        params = {
            '"command"': 'getPtUpdates',
            '"lastUpdate"': lastUpdateTime,
            '"getStatus"': true,
            '"max"': self.hmpBatchSize,
            '"hmpVersion"': self.hmpVersion,
            '"extractSchema"': self.extractSchema,
            '"server"': self.hmpServerId
        };
        rpcClient.execute('HMPDJFS API', params, function(error, response) {
            self.log.info('vista-client.fetchNextBranch: Completed calling RPC: getPtUpdates: for vistaId: %s; error: %s', vistaId, error);
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
                    return handleFailedRequestWithRawResponse(util.format('Failed to parse the vista response into JSON for vistaId: %s; exception: %j', vistaId, e), response);
                }
                if ((jsonResponse) && (jsonResponse.data)) {
                    return handleSuccessfulResponse(jsonResponse);
                // In some cases we may get no data - but it is not an error.  One case is if staging is not complete yet.   So look for this special case.
                // If it occurs - it is not an error situation.  We just want to ignore it.
                //------------------------------------------------------------------------------------------------------------------------------------------
                } else if ((jsonResponse) && (jsonResponse.warning) && (jsonResponse.warning === 'Staging is not complete yet!')) {
                    self.log.debug('vista-client.fetchNextBatch.handleFailedRequestResponse: Staging is not yet complete');
                    return handleSuccessfulResponse(jsonResponse);
                // A true error condition...
                //--------------------------
                } else {
                    return handleFailedRequestWithParsedResponse('vista-client.fetchNextBranch: jsonResponse did not contain any data attribute.', jsonResponse);
                }
            } else {
                return handleFailedRequestWithRawResponse(util.format('vista-client.fetchNextBranch: Error received from RPC call.  Error: %s', error), response);
            }
        });
    } else {
        return handleFailedRequestWithRawResponse('vista-client.fetchNextBranch: Failed to call RPC getPtUpdates for vistaId: ' + vistaId + ', invalid configuration information.', null);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // jsonResponse - the result returned from VistA through the RPC in JSON format.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(jsonResponse) {
        self.log.debug('vista-client.fetchNextBatch: Successfully called RPC for getPtUpdates.');
        self.metrics.debug('Vista Fetch Next', metricsObj);
        return batchCallback(null, jsonResponse.data);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.  When
    // we have to log an error where we have not or cannot parse the response - so we need
    // to deal with it as a raw response.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // rawVistaResponse - The result returned from VistA through the RPC in its original form.
    //----------------------------------------------------------------------------------------
    function handleFailedRequestWithRawResponse(error, rawVistaResponse) {
        self.log.error('%s rawVistaResponse: %s', error, rawVistaResponse);
        self.metrics.debug('Vista Fetch Next (raw response) in Error', metricsObj);
        return batchCallback(error, rawVistaResponse);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // vistaResponse - The result returned from VistA through the RPC
    //-------------------------------------------------------------------------------------
    function handleFailedRequestWithParsedResponse(error, vistaResponse) {
        self.log.error('%s vistaResponse: %j', error, vistaResponse);
        self.metrics.debug('Vista Fetch Next (parsed response) in Error', metricsObj);
        return batchCallback(error, vistaResponse);
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
    var metricsObj = {
        'subsystem':'Vista',
        'action':'getDemographics',
        'site':vistaId,
        'pid': vistaId+';'+dfn,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Get Demographics', metricsObj);
    metricsObj.timer = 'stop';
    self.log.debug('vista-client.getDemographics: vistaId: %s; dfn: %s', vistaId, dfn);
    var pid = vistaId + ';' + dfn;

    self.log.debug('vista-client.getDemographics: rpcConfig for pid: %s;', pid);
    var rpcClient = this._getRpcClient(vistaId);

    var params;

    if (rpcClient) {
        params = {
            '"patientId"': dfn,
            '"domain"': 'patient',
            '"extractSchema"': self.extractSchema
        };
        rpcClient.execute('HMP GET PATIENT DATA JSON', params, function(error, response) {
            self.log.debug('vista-client.getDemographics: Completed calling RPC for pid: %s; error: %s', pid, error);
            self.log.trace('vista-client.getDemographics: Completed calling RPC for pid: %s; result: %j', pid, response);
            if (!error) {
                return handleSuccessfulResponse(response, pid);
            } else {
                return handleFailedRequestResponse(error, response, pid);
            }
        });

    } else {
        return handleFailedRequestResponse('Failed to subscribe patient for pid: ' + pid + ', invalid configuration information', null, pid);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.metrics.debug('Vista Get Demographics', metricsObj);
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
            self.log.debug('vista-client.getDemographics.handleSuccessfulResponse: successfully retrieved demographics for patient %s; vistaResponse: %s', pid, vistaResponse);
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
        self.metrics.debug('Vista Get Demographics in Error', metricsObj);
        var errorMessage = 'Failed to retrieve demographics for pid: ' + pid + '; error: ' + error;
        self.log.error('vista-client.getDemographics.handleFailedRequestResponse: %s vistaResponse: %j', errorMessage, vistaResponse);
        return callback(errorMessage, null);
    }
};


VistaClient.prototype.fetchAppointment = function(vistaId, batchCallback) {
    var self = this;
    var metricsObj = {
        'subsystem':'Vista',
        'action':'getDemographics',
        'site':vistaId,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Fetch Appointment', metricsObj);
    metricsObj.timer = 'stop';
    var rpcClient = this._getRpcClient(vistaId);

    self.log.debug('vista-client.fetchAppointment: rpcConfig for fetchAppointment');
    if (rpcClient) {
        var parameter = [];
        rpcClient.execute('HMP PATIENT ACTIVITY', parameter, function(error, response) {
            if (error) {
                return handleFailedRequestWithRawResponse(util.format('vista-client.fetchAppointment: Error received from RPC call.  Error: %s', error), response);
            }

            if (_.isEmpty(response) || (_.isString(response) && _.isEmpty(response.trim()))) {
                return handleSuccessfulResponse(JSON.parse('[]'));
            } else {
                self.log.debug('vista-client.fetchAppointment: Completed calling RPC. Got response back for vistaId: %s; response (String): %s', vistaId, response);
                var jsonResponse;
                try {
                    jsonResponse = JSON.parse(response);
                    self.log.debug('vista-client.fetchAppointment: Completed calling RPC: getPtUpdates: for vistaId: %s; jsonResponse: %j', vistaId, jsonResponse);
                    return handleSuccessfulResponse(jsonResponse);
                } catch (e) {
                    return handleFailedRequestWithRawResponse(util.format('vista-client.fetchAppointment: Failed to parse the vista response into JSON for vistaId: %s; exception: %j', vistaId, e), response);
                }

                // Commenting this code out... It should have been dead code - but could also have been bad code.  The handleSuccessfulResponse call above did not have a return
                // on it.  That would potentially cause two call backs from ths routine.  Not a good idea.  I fixed the one above - which makes this code never called.
                // commenting it out - just in case there was some reason some of this behavior was really wanted.
                //---------------------------------------------------------------------------------------------------------------------------------------------------------------
                // if (!_.isArray(jsonResponse)) {
                //     return handleFailedRequestResponse('vista-client.fetchAppointment: jsonResponse did not contain any data attribute.', jsonResponse);
                // }
            }

        });
    } else {
        return handleFailedRequestWithRawResponse('vista-client.fetchAppointment: Failed to call RPC getPtUpdates for vistaId: ' + vistaId + ', invalid configuration information.', null);
    }


    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // jsonResponse - the result returned from VistA through the RPC in JSON format.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(jsonResponse) {
        self.metrics.debug('Vista Fetch Appointment', metricsObj);
        self.log.debug('vista-subscribe.fetchAppointment.handleSuccessfulResponse: Successfully called RPC.', jsonResponse);
        return batchCallback(null, jsonResponse);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.  When
    // we have to log an error where we have not or cannot parse the response - so we need
    // to deal with it as a raw response.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // rawVistaResponse - The result returned from VistA through the RPC in its original form.
    //----------------------------------------------------------------------------------------
    function handleFailedRequestWithRawResponse(error, rawVistaResponse) {
        self.metrics.debug('Vista Fetch Appointment in Error', metricsObj);
        self.log.error('%s rawVistaResponse: %s', error, rawVistaResponse);
        return batchCallback(error, rawVistaResponse);
    }
};

//-------------------------------------------------------------------------------------
// This function makes an RPC call to VistA to unsubscribe the patient.
//
// pid - The pid of the patient to be unsubscribed.
// unsubscribeCallback - The is the function that is called when the RPC call is completed.
//-------------------------------------------------------------------------------------
VistaClient.prototype.unsubscribe = function(pid, unsubscribeCallback) {
    var self = this;
    var metricsObj = {
        'subsystem':'Vista',
        'action':'unsubscribe',
        'pid':pid,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Unsubscribe', metricsObj);
    metricsObj.timer = 'stop';
    self.log.debug('vista-client.unsubscribe: pid: %s', pid);
    var vistaId = idUtil.extractSiteFromPid(pid);

    self.log.debug('vista-client.unsubscribe: rpcConfig for pid: %s', pid);
    var rpcClient = this._getRpcClient(vistaId);

    var params;

    if (rpcClient) {
        params = {
            '"hmpSrvId"': self.hmpServerId,
            '"pid"': pid
        };
        rpcClient.execute('HMPDJFS DELSUB', params, function(error, response) {
            self.log.debug('vista-client.unsubscribe: Completed calling RPC for pid: %s; error: %s', pid, error);
            self.log.debug('vista-client.unsubscribe: Completed calling RPC for pid: %s; result: %j', pid, response);
            if (!error) {
                return handleSuccessfulResponse(response, pid);
            } else {
                return handleFailedRequestResponse(util.format('vista-client.unsubscribe: Error received from VistA when attempting to unsubscribe patient.  error: %s; pid: %s.', error, pid), response);
            }
        });

    } else {
        return handleFailedRequestResponse(util.format('vista-client.unsubscribe: Failed to unsubscribe patient for pid: %s - invalid configuration information.', pid), null);
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a sucessful response from the RPC.
    //
    // vistaResponse - the result returned from VistA through the RPC.
    // pid - The pid that identifies the patient.
    //-------------------------------------------------------------------------------------
    function handleSuccessfulResponse(vistaResponse, pid) {
        self.metrics.debug('Vista Unsubscribe', metricsObj);
        self.log.debug('vista-client.unsubscribe.handleSuccessfulResponse: successfully unsubscribed for patient %s; vistaResponse: %s', pid, vistaResponse);
        return unsubscribeCallback(null, 'success');
    }

    //-------------------------------------------------------------------------------------
    // This function handles calling the callback for a failed response from the RPC.
    //
    // error - The error message to be sent - because of the failed rPC call.
    // response - The result returned from VistA through the RPC
    //-------------------------------------------------------------------------------------
    function handleFailedRequestResponse(error, response) {
        self.metrics.debug('Vista Unsubscribe in Error', metricsObj);
        self.log.error('%s response: %s', error, response);
        return unsubscribeCallback(error, null);
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
VistaClient.prototype.getIds = function(vistaId, dfn, stationNumber, callback) {
    var self = this;
    var metricsObj = {
        'subsystem':'Vista',
        'action':'getIds',
        'site':vistaId,
        'pid': vistaId+';'+dfn,
        'process':uuid.v4(),
        'timer': 'start'
    };
    self.metrics.debug('Vista Get IDs', metricsObj);
    metricsObj.timer = 'stop';
    self.log.debug('vista-client.getIds: dfn: %s; stationNumber: %s', dfn, stationNumber);

    if (_.isUndefined(vistaId) || _.isUndefined(dfn) || _.isUndefined(stationNumber)) {
        self.log.error('vista-client.getIds: called with missing parameters...');
        return callback('Failed to getIds');
    }
    var rpcClient = this._getRpcClient(vistaId);

    var params = dfn + '^PI^USVHA^' + stationNumber;

    if(rpcClient) {
        rpcClient.execute('HMP LOCAL GETCORRESPONDINGIDS', params, function(error, response) {
            if (error) {
                self.metrics.debug('Vista Get IDs in Error', metricsObj);
                self.log.error('vista-client.getIds: Error received when call RPC for dfn: %s; error: %s', dfn, error);
                return callback(error);
            } else {
                self.metrics.debug('Vista Get IDs', metricsObj);
                self.log.debug('vista-client.getIds: Successful call to RPC for dfn: %s; result: %j', dfn, response);
                return callback(null, response);
            }
        });
    } else {
        self.metrics.debug('Vista Get IDs in Error', metricsObj);
        self.log.error('vista-client.getIds: Unable to find RPC client for vistaId: %s', vistaId);
        callback('No RPC client found for Vista ' + vistaId);
    }
};

module.exports = VistaClient;
VistaClient._createRpcConfigVprContext = _createRpcConfigVprContext;

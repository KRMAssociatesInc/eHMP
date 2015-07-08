'use strict';
//------------------------------------------------------------------------------------------
// This is just a little utility script that will unscubscribe a patient and resubscribe them 
// for a specific site.
//-------------------------------------------------------------------------------------------

require('../../env-setup');
var _ = require('underscore');
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);
var log = logUtil.get('subscriberHost', 'host');
var rpcClient = require(global.VX_VISTAJS + 'RpcClient').RpcClient;
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');


var pid = '9E7A;3';

//-----------------------------------------------------------------------------------
// Unsubscribe the operational data.
//
// pid - pid of the patient to unsubscribe.
// config - The configuration information to use for context
// callback - The callback to call when it is done.
//-----------------------------------------------------------------------------------
function unsubscribePatientData(pid, config, callback) {
    var vistaId = idUtil.extractSiteFromPid(pid);

    var rpcConfig = _createRpcConfigVprContext(config, vistaId);
    var rpcLog = logUtil.get('rpc', log);
    var params;

    if (rpcConfig) {
        params = {
            '"hmpSrvId"': config['hmp.server.id'],
            '"pid"': pid
        };
        rpcClient.callRpc(rpcLog, rpcConfig, 'HMPDJFS DELSUB', params, function(error, response) {
            log.debug('patient-subscribe-reset-util.unsubscribePatientData: Completed calling RPC to unsubscribe patient pid: %s; error: %s', pid, error);
            log.debug('patient-subscribe-reset-util.unsubscribePatientData: Completed calling RPC fto unsubscribe patient pid: %s; result: %s', pid, response);
            callback(error, response);
        });

        //request.post(url, handleMockResponse);
    } else {
        callback('Failed to unsubscribe patient pid: ' + pid + ', invalid config', null);
    }
}

//-----------------------------------------------------------------------------------
// Resubscribe the patient data.
//
// pid - pid for this patient
// config - The configuration information to use for context
// callback - The callback to call when it is done.
//-----------------------------------------------------------------------------------
function resubscribePatientData(pid, config, callback) {
    var vistaId = idUtil.extractSiteFromPid(pid);
    var localId = idUtil.extractDfnFromPid(pid);

    var rpcConfig = _createRpcConfigVprContext(config, vistaId);
    var rpcLog = logUtil.get('rpc', log);
    var params;

    if (rpcConfig) {
        params = {
            '"server"': config['hmp.server.id'],
            '"command"': 'putPtSubscription',
            '"localId"': localId
        };
        rpcClient.callRpc(rpcLog, rpcConfig, 'HMPDJFS API', params, function(error, response) {
            log.debug('patient-subscribe-reset-util.resubscribePatientData: Completed calling RPC to subscribe patient - pid: %s; error: %s', pid, error);
            log.debug('patient-subscribe-reset-util.resubscribePatientData: Completed calling RPC to subscribe patient - pid: %s; result: %s', pid, response);
            callback(error, response);
        });

        //request.post(url, handleMockResponse);
    } else {
        callback('Failed to subscribe patient - pid: ' + pid + ', invalid config', null);
    }
}

//------------------------------------------------------------------------------------
// This method creates the configuration context that is to be sent to the RPC.  Most
// of the context is the same for every RPC call and can be obtained from the
// configuration.  But some items are specific to the RPC call.  This adds in the
// items that are specific to the RPC call.
//------------------------------------------------------------------------------------
function _createRpcConfigVprContext(config, vistaId) {
    var siteConfig = config.vistaSites[vistaId];
    var rpcConfig = _.clone(siteConfig);
    rpcConfig.context = 'HMP SYNCHRONIZATION CONTEXT';
    return (rpcConfig);
}

//------------------------------------------------------------------------------------
// Unsubscribe/Resubscribe pid
//------------------------------------------------------------------------------------
unsubscribePatientData(pid, config, function (error, response) {
	if (!error) {
		resubscribePatientData(pid, config, function(error, response) {
			log.debug('patient-subscribe-reset-util.unsubscribePatientData: Completed resubscribe of patient data with error: %s; and response: %s', error, response);
		});
	} else {
		log.debug('patient-subscribe-reset-util.unsubscribePatientData: Failed to unsubscribe.  error: %s; response: %s ', error, response);
	}
});


'use strict';
//------------------------------------------------------------------------------------------
// This is just a little utility script that will unscubscribe the operational data and then
// send a subscribe for it.
//-------------------------------------------------------------------------------------------

require('../../env-setup');
var _ = require('underscore');
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);
var log = logUtil.get('subscriberHost', 'host');
var rpcClient = require('vista-js').RpcClient;

//-----------------------------------------------------------------------------------
// Unsubscribe the operational data.
//
// vistaId - The site to be unsubscribed
// config - The configuration information to use for context
// callback - The callback to call when it is done.
//-----------------------------------------------------------------------------------
function unsubscribeOperationalData(vistaId, config, callback) {
    var rpcConfig = _createRpcConfigVprContext(config, vistaId);
    var rpcLog = logUtil.get('rpc', log);
    var params;

    if (rpcConfig) {
        params = {
            '"server"': config['hmp.server.id'],
            '"command"': 'resetAllSubscriptions'
        };
        rpcClient.callRpc(rpcLog, rpcConfig, 'HMPDJFS API', params, function(error, response) {
            log.debug('operational-data-reset.unsubscribeOperationalData: Completed calling RPC to unsubscribe operational data for vistaId: %s; error: %s', vistaId, error);
            log.debug('operational-data-reset.unsubscribeOperationalData:Completed calling RPC fto unsubscribe operational data for vistaId: %s; result: %s', vistaId, response);
            callback(error, response);
        });

        //request.post(url, handleMockResponse);
    } else {
        callback('Failed to unsubscribe operational data for vistaId: ' + vistaId + ', invalid config', null);
    }
}

//-----------------------------------------------------------------------------------
// Resubscribe the operational data.
//
// vistaId - The site to be subscribed
// config - The configuration information to use for context
// callback - The callback to call when it is done.
//-----------------------------------------------------------------------------------
function resubscribeOperationalData(vistaId, config, callback) {
    var rpcConfig = _createRpcConfigVprContext(config, vistaId);
    var rpcLog = logUtil.get('rpc', log);
    var params;

    if (rpcConfig) {
        params = {
            '"server"': config['hmp.server.id'],
            '"command"': 'startOperationalDataExtract'
        };
        rpcClient.callRpc(rpcLog, rpcConfig, 'HMPDJFS API', params, function(error, response) {
            log.debug('operational-data-reset.resubscribeOperationalData: Completed calling RPC to unsubscribe operational data for vistaId: %s; error: %s', vistaId, error);
            log.debug('operational-data-reset.resubscribeOperationalData: Completed calling RPC fto unsubscribe operational data for vistaId: %s; result: %s', vistaId, response);
            callback(error, response);
        });

        //request.post(url, handleMockResponse);
    } else {
        callback('Failed to unsubscribe operational data for vistaId: ' + vistaId + ', invalid config', null);
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
// Unsubscribe/Resubscribe 9E7A
//------------------------------------------------------------------------------------
unsubscribeOperationalData('9E7A', config, function (error, response) {
	if (!error) {
		resubscribeOperationalData('9E7A', config, function(error, response) {
			log.debug('operational-data-reset.unsubscribeOperationalData: Completed unsubscribe of operational data with error: %s; and response: %s', error, response);
		});
	} else {
		log.debug('operational-data-reset.unsubscribeOperationalData: Failed to unsubscribe.  error: %s; response: %s ', error, response);
	}
});

//------------------------------------------------------------------------------------
// Unsubscribe/Resubscribe C877
//------------------------------------------------------------------------------------
unsubscribeOperationalData('C877', config, function (error, response) {
	if (!error) {
		resubscribeOperationalData('C877', config, function(error, response) {
			log.debug('operational-data-reset.unsubscribeOperationalData: Completed unsubscribe of operational data with error: %s; and response: %s', error, response);
		});
	} else {
		log.debug('operational-data-reset.unsubscribeOperationalData: Failed to unsubscribe.  error: %s; response: %s ', error, response);
	}
});

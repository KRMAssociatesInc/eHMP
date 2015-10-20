'use strict';

var httpUtil = require('../../core/rdk').utils.http;
var async = require('async');

module.exports = function(writebackContext, vxSyncResponse, callback) {
    var logger = writebackContext.logger;
    logger.debug('jds-direct-writer');
    var error = null;
    var vprModel = writebackContext.vprModel;
    if (!vprModel) {
        writebackContext.logger.warn('No VPR model defined, skipping VX-Sync writeback call');
        return setImmediate(callback);
    }

    var vprModels = [].concat(vprModel);

    var appConfig = writebackContext.appConfig;
    var requestConfig = {
        protocol: 'http',
        logger: writebackContext.logger,
        options: {
            host: appConfig.vxSyncWritebackServer.host,
            port: appConfig.vxSyncWritebackServer.port,
            path: '/writeback',
            method: 'POST'
        }
    };
    logger.info('Calling the VX-Sync writeback endpoint');
    logger.debug({jdsDirectWriterVprModel: vprModel});
    async.each(vprModels, function(vprModel, callback) {
        httpUtil.post(vprModel, appConfig, requestConfig, function(err, response) {
            if (err) {
                // We don't need to return an error if this fails
                logger.warn({jdsDirectWriterResponseError: err}, 'Error calling the VX-Sync writeback endpoint');
                vxSyncResponse.message = 'Error calling the VX-Sync writeback endpoint';
            }
            logger.debug({jdsDirectWriterResponse: response});
            return callback();
        });
    }, function(err) {
        return setImmediate(callback, error);
    });
};

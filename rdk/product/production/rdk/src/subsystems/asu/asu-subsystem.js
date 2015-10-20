'use strict';

// var config = req.app.config;
var asuProcess = require('./asu-process');

function evaluateProcessor(req, res, next) {
    var logger = req.app.logger;
    logger.info('Got to evaluate processor');
    var jsonParams = req.body;
    var httpConfig = req.app.config.asu.evaluateRuleService;
    httpConfig.options.host = req.app.config.vxSyncServer.host;

    asuProcess.evaluate(jsonParams, req.app.config, httpConfig, res, logger);
}
function testProcessor(req, res, next) {
    req.app.logger.info('Inside mocked asu rules endpoint');
    res.rdkSend({
        isAuthorized : true
    });
}

function getSubsystemConfig() {
    return {
        healthcheck : function() {
            return true;
        }
    };
}

module.exports.getSubsystemConfig = getSubsystemConfig;
module.exports.evaluate = evaluateProcessor;
module.exports.test = testProcessor;

'use strict';

var async = require('async');
var _ = require('lodash');
var dd = require('drilldown');
var jdsDirectWriter = require('./jds-direct-writer');

function getVistaConfig(logger, appConfig, user) {
    var site = dd(user)('site').val;
    if(!site) {
        logger.error('getVistaConfig: user site not found');
    }
    var siteConfiguration = dd(appConfig)('vistaSites')(site).val;
    if(!siteConfiguration) {
        logger.error('getVistaConfig: site configuration not found');
    }
    var context = dd(appConfig)('rpcConfig')('context').val;
    if(!context) {
        logger.error('getVistaConfig: app rpcConfig context not found');
    }
    var accessCode = dd(user)('accessCode').val;
    if(!accessCode) {
        logger.error('getVistaConfig: user access code not found');
    }
    var verifyCode = dd(user)('verifyCode').val;
    if(!verifyCode) {
        logger.error('getVistaConfig: user verify code not found');
    }
    var vistaConfig = _.extend({}, siteConfiguration, {
        context: context,
        accessCode: accessCode,
        verifyCode: verifyCode
    });
    return vistaConfig;
}

module.exports = function writebackWorkflow(req, res, tasks) {
    var writebackContext = {
        logger: req.logger,
        vistaConfig: getVistaConfig(req.logger, req.app.config, req.session.user),
        siteHash: req.session.user.site,
        duz: req.session.user.duz,
        appConfig: req.app.config,
        model: req.body,
        interceptorResults: req.interceptorResults,
        pid: req.param('pid'),
        resourceId: req.param('resourceId'),
        vprModel: null,
        vprResponse: null,
        vprResponseStatus: 200
    };
    var vxSyncResponse = {};
    var elevatedTasks = [jdsDirectWriter];
    tasks = _.map(tasks, function(task) {
        if(_.contains(elevatedTasks, task)) {
            return task.bind(null, writebackContext, vxSyncResponse);
        }
        return task.bind(null, writebackContext);
    });

    async.series(tasks, function(err) {
        if(err) {
            req.logger.error(err);
            return res.status(500).rdkSend(err);
        }
        if(!writebackContext.vprResponse) {
            var undefinedResponse = {};
            undefinedResponse.error = 'Undefined response from the resource';
            req.logger.error('Writeback error: undefined response from the resource');
            return res.status(500).rdkSend(undefinedResponse);
        }
        return res.status(writebackContext.vprResponseStatus).rdkSend(_.extend({
            status: writebackContext.vprResponseStatus,
            data: writebackContext.vprResponse
        }, vxSyncResponse));
    });
};

module.exports._getVistaConfig = getVistaConfig;

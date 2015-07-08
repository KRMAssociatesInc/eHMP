'use strict';

var async = require('async');
var _ = require('lodash');

/**
 * @param {Object} appConfig
 * @param {Object} user The user object on the session
 */
function getVistaConfig(appConfig, user) {
    var site = user.site;
    var vistaConfig = _.extend({}, appConfig.vistaSites[site], {
        context: appConfig.rpcConfig.context,
        accessCode: user.username,
        verifyCode: user.password
    });
    return vistaConfig;
}

module.exports = function writebackWorkflow(req, res, tasks) {
    var writebackContext = {
        logger: req.logger,
        vistaConfig: getVistaConfig(req.app.config, req.session.user),
        model: req.body,
        pid: req.param('pid'),
        resourceId: req.param('resourceId'),
        response: null
    };

    tasks = _.map(tasks, function(task) {
        return task.bind(null, writebackContext);
    });

    async.series(tasks, function(err, data) {
        if(err) {
            // TODO handle errors
            return res.status(500).send(err);
        }
        // TODO handle success
        //return res.status(200).send(data[data.length-1]);
    });
};


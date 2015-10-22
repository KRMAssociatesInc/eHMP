'use strict';

var _ = require('lodash');
var getDefaultImmediateCollectTime = require('./lab-default-immediate-collect-time').getDefaultImmediateCollectTime;
var getLabCollectTimes = require('./lab-collect-times').getLabCollectTimes;
var nullUtil = require('../../../core/null-utils');

module.exports.getResourceConfig = function(app) {
    return [{
        name: '',
        path: '',
        interceptors: {
            operationalDataCheck: false,
            synchronize: false,
            pep: false
        },
        get: fetchSupportData
    }];
};



function fetchSupportData(req, res) {
    var log = req.app.logger;
    var type = req.param('type');
    var site = req.param('site');

    if (nullUtil.isNullish(type) || _.isEmpty(type)) {
        res.status(500).rdkSend('Parameter \'type\' cannot be null or empty');
        return;
    }
    if (nullUtil.isNullish(site) || _.isEmpty(site)) {
        res.status(500).rdkSend('Parameter \'site\' cannot be null or empty');
        return;
    }
    site = site.toUpperCase();
    type = type.toLowerCase();

    var configuration = req.app.config.vistaSites[site];
    configuration.context = 'OR CPRS GUI CHART';


    var serverSend = function(error, json) {
        if (error) {
            res.status(500).rdkSend(error);
        }
        else {
            res.status(200).rdkSend(json);
        }
    };

    if (type.toLowerCase() === 'lab-default-immediate-collect-time'){
        getDefaultImmediateCollectTime(log,configuration, serverSend);
        return;
    }
    if (type.toLowerCase() === 'lab-collect-times'){
        getLabCollectTimes(log,configuration, req.param('dateSelected'), req.param('location'), serverSend);
        return;
    }
    serverSend('Not yet implemented');
    return;
}

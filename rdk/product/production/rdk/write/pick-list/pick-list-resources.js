/*jslint node: true */
'use strict';

var getVitals = require('./vitals-fetch-list').getVitals;
var getProblemsLex = require('./problems-fetch-list').getProblemsLex;
var getAllergiesSymptoms = require('./allergies-fetch-list').getAllergiesSymptoms;
var getAllergiesMatch = require('./allergies-fetch-list').getAllergiesMatch;
var nullUtil = require('../core/null-utils');
var _ = require('lodash');

module.exports.getResourceConfig = function(app) {
    return [{
        name: '',
        path: '',
        get: fetchWritePickList
    }];
};



function fetchWritePickList(req, res) {
    var type = req.param('type');
    if (nullUtil.isNullish(type) || _.isEmpty(type)) {
        res.status(500).send({error: "Parameter 'type' cannot be null or empty"});
        return;
    }

    //TODO: Use facility (req.user.site) to look up configuration

    var log = req.app.logger;
    var configuration = {
        context: 'OR CPRS GUI CHART',
        host: '10.2.2.101',
        port: 9210,
        accessCode: 'pu1234',
        verifyCode: 'pu1234!!',
        localIP: '10.2.2.1',
        localAddress: 'localhost'
    };

    var serverSend = function(error, json) {
        if (error) {
            res.status(500).send({error: error});
        }
        else {
            res.status(200).send(json);
        }
    };

    // TODO: replace with cached versions later instead of calling directly.
    if (type.toLowerCase() === "vitals")
        getVitals(log, configuration, serverSend);
    else if (type.toLowerCase() === "problems-lex")
        getProblemsLex(log, configuration, serverSend);
    else if (type.toLowerCase() === "allergies-symptoms")
        getAllergiesSymptoms(log, configuration, serverSend);
    else if (type.toLowerCase() === "allergies-match")
        getAllergiesMatch(log, configuration, serverSend);
    else
        serverSend('Not yet implemented', serverSend);
}

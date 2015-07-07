'use strict';

var _ = require('lodash');
var url = require('url');
var request = require('request');

function saveToJDS(log, config, key, value, cb) {

    var postdata = _.merge({}, { "_id": key}, value);

    var endpoint = url.format({
        protocol: config.jds.protocol,
        host: config.jds.host + ":" + config.jds.port,
        pathname: config.jds.jdsSaveURI
    });

    var options = {
        url: endpoint,
        body: postdata,
        method: 'POST',
        json: true
    };

    request(options, function (error, response) {
        //log.debug("saveToJDS: response: %s", response);
        if ((_.isNull(error) || _.isUndefined(error)) && response.statusCode == 200) {
          //  log.debug('saveToJDS: saved: %s ', postdata);
            cb(null, response);
        }
        else {
            //log.error('saveToJDS: failed to save to JDS: %s ', postdata);
            cb(error, null);
        }
    });
}

function getFromJDS(log, config, key, cb) {
    var endpoint = url.format({
        protocol: config.jds.protocol,
        host: config.jds.host + ":" + config.jds.port,
        pathname: config.jds.jdsGetURI + "/" + key
    });

    var options = {
        url: endpoint,
        method: 'GET'
    };

    request(options, function (error, response) {
        //log.debug("getFromJDS: response: %s", response);
        if ((_.isNull(error) || _.isUndefined(error)) && response.statusCode == 200) {
           // log.debug('getFromJDS: Success');
        }
        else {
           // log.error('getFromJDS: failed to GET from JDS');
        }
        cb(error, response);
    });
}

module.exports.saveToJDS = saveToJDS;
module.exports.getFromJDS = getFromJDS;
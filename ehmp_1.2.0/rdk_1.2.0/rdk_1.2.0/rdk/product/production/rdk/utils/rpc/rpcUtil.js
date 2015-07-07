'use strict';
var rdk = require('../../rdk/rdk');
var httpUtil = rdk.utils.http;
var util = require('util');
var querystring = require('querystring');
var nullchecker = rdk.utils.nullchecker;
var _ = require('underscore');
var clc = require('cli-color');


function getVistaRpcConfiguration(config, siteHash) {
    if (siteHash === undefined || siteHash === null) {
        throw new Error('The siteHash parameter must be defined when calling getVistaRpcConfiguration');
    }

    return _.extend(_.clone(config.rpcConfig), config.vistaSites[siteHash]);
}


module.exports.getVistaRpcConfiguration = getVistaRpcConfiguration;

'use strict';
var rdk = require('../../../core/rdk');
var httpUtil = rdk.utils.http;
var querystring = require('querystring');
//var _ = require('underscore');
//var moment = require('moment');

//TO DO: move these to a config file
var settings = {
    protocol: 'http',
    port: '80',
    host: 'browserdata-2.ihtsdotools.org',
    path: '/api/snomed',
    database: 'en-edition',
    version: 'v20150131'
};
var semanticFilters = {
    product: 'product',
    disorder: 'disorder',
    procedure: 'procedure',
    situation: 'situation',
    substance: 'substance',
    finding: 'finding',
    qualif_value: 'qulifier value',
    regime_therapy: 'regime/therapy'
};

var searchModes = {
    FullText: 'fullText',
    PartialMatching: 'partialMatching',
    RegularExp: 'regex'
};



module.exports.executeTermQuery = executeTermQuery;
module.exports.executeReferenceQuery = executeReferenceQuery;


function executeTermQuery(queryString, req, callback) {
    var params = {
        query: queryString,
        lang: 'english',
        statusFilter: 'activeOnly',
        normalize: 'true',
        returnLimit: '100',
        skipTo: '0',
        //semanticFilter: semanticFilters.substance, //hardcoded for now
        groupByConcept: 1,
        searchMode: searchModes.PartialMatching
    };
    var config = {
        protocol: settings.protocol,
        logger: req.logger,
        options: {
            host: settings.host,
            port: settings.port,
            path: settings.path + '/' + settings.database + '/' + settings.version + '/descriptions?' + querystring.stringify(params),
            method: 'GET'
        }
    };

    req.logger.info(config.options.method + ' ' + config.options.host + ':' + config.options.port + config.options.path);

    httpUtil.fetch(req.app.config, config, function(error, result) {

        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return callback(error);
            //            res.status(500).rdkSend('There was an error processing your request. The error has been logged.');
        } else {
            try {
                var ontoResult = JSON.parse(result);
                return callback(null, ontoResult);
            } catch (parseError) {
                return callback(parseError);
            }
        }
    });
}

function executeReferenceQuery(conceptid, req, callback) {
    var params = {
        form: 'inferred'
    };
    var config = {
        protocol: settings.protocol,
        logger: req.logger,
        options: {
            host: settings.host,
            port: settings.port,
            path: settings.path + '/' + settings.database + '/' + settings.version + '/concepts/' + conceptid + '?' + querystring.stringify(params),
            method: 'GET'
        }
    };
    httpUtil.fetch(req.app.config, config, function(error, result) {

        if (error) {
            req.logger.error('Error performing search', (error.message || error));
            return callback(error);
        } else {
            try {
                var ontoResult = JSON.parse(result);
                return callback(null, ontoResult);
            } catch (parseError) {
                return callback(parseError);
            }
        }
    });
}

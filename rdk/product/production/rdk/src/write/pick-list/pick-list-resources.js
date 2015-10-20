'use strict';

var _ = require('lodash');
var nullUtil = require('../core/null-utils');
var dbList = require('./pick-list-db');
var pickListConfig = require('./config/pickListConfig').pickListConfig;

var getProblemsLexiconLookup = require('./problems/problems-lexicon-lookup-fetch-list').getProblemsLexiconLookup;
var getAllergiesMatch = require('./allergies/allergies-match-fetch-list').getAllergiesMatch;
var getMedicationIndex = require('./medications/medication-index-fetch-list').getMedicationIndex;
var getMedicationList = require('./medications/medication-list-fetch-list').getMedicationList;
var getEncounterDiagnosisLexiconLookup = require('./encounters/encounters-diagnosis-lexicon-lookup-fetch-list').getEncountersDiagnosisLexiconLookup;
var getEncountersProceduresLexiconLookup = require('./encounters/encounters-procedures-lexicon-lookup-fetch-list').getEncountersProceduresLexiconLookup;
var getNewPersons = require('./person/new-persons-fetch-list').getNewPersons;

var async = require('async');

module.exports.getResourceConfig = function(/*app*/) {
    return [{
        name: '',
        path: '',
        interceptors: {
            operationalDataCheck: false,
            synchronize: false,
            pep: false
        },
        get: fetchWritePickList
    }];
};

/**
 * Utility function to make it easy to log what is contained in params.
 */
function paramsAsString(params) {
    var str = '' + params.pickList;
    if (_.has(pickListConfig[params.index], 'requiredParams')) {
        _.each(pickListConfig[params.index].requiredParams, function(requiredName) {
            str += ', ' + requiredName + '=' + params[requiredName];
        });
    }
    return str;
}

/**
 * Loads all of the large pick lists as determined in pickListConfig.json
 */
module.exports.loadLargePickLists = function(app) {
    //This queue will populate each pick list.
    var q = async.queue(function (params, callback) {
        app.logger.info('PROCESSING LOADING OF LARGE PICK LIST: ' + paramsAsString(params));

        dbList.initialLoadPickList(app.logger, app.config.vistaSites[params.site], params, pickListConfig[params.index].modulePath, function(error) {
                if (error) {
                    app.logger.error(error);
                }
                else {
                    app.logger.debug('Loaded');
                }

                app.logger.info('FINISHED PROCESSING LOADING OF LARGE PICK LIST: ' + paramsAsString(params));
                callback();
            }
        );
    }, 1);

    //Called when all queues are finished being processed.
    q.drain = function() {
        app.logger.info('FINISHING LOADING ALL LARGE PICK LISTS');
    };

    //For each pick list in the configuration which has a largePickListRetry, add it to the queue.
    //If that largePickListRetry also has requiredParams, then a matching entry will be found in initialLoadDefaultParams.
    //Iterate through each of them and add to the queue a separate call to populate for each default entry that is found.
    _.each(_.pluck(pickListConfig, 'name'), function(name, i) {
        if (_.has(pickListConfig[i], 'largePickListRetry')) {
            if (_.has(pickListConfig[i], 'requiredParams')) {
                if (_.isEmpty(pickListConfig[i].initialLoadDefaultParams)) {
                    app.logger.error('cannot have an empty initialLoadDefaultParams in the configuration if there are requiredParams');
                    return;
                }

                _.each(pickListConfig[i].requiredParams, function(requiredName) {
                    if (!_.has(pickListConfig[i].initialLoadDefaultParams, requiredName)) {
                        app.logger.error('could not find ' + requiredName + ' in initialLoadDefaultParams - it is a requiredParams');
                        return;
                    }

                    var initialLoadDefaultParam = pickListConfig[i].initialLoadDefaultParams[requiredName];
                    if (!_.isArray(initialLoadDefaultParam)) {
                        app.logger.error('initialLoadDefaultParams[' + requiredName + '] was not an array');
                        return;
                    }

                    _.each(initialLoadDefaultParam, function(initialLoadDefaultParamField) {
                        var params = {
                            'pickList': pickListConfig[i].name,
                            'site': '9E7A',
                            'index': i
                        };
                        params[requiredName] = initialLoadDefaultParamField;
                        q.push(params);
                    });
                });
            }
            else {
                var params = {
                    'pickList': pickListConfig[i].name,
                    'site': '9E7A',
                    'index': i
                };

                q.push(params);
            }
        }
    });
};

function fetchWritePickList(req, res) {
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

    var filters = null;


    var configuration = req.app.config.vistaSites[site];

    var serverSend = function(error, json, statusCode, headers) {
        if (error) {
            if (!nullUtil.isNullish(statusCode)) {
                if (!nullUtil.isNullish(headers)) {
                    _.each(headers, function(value, key) {
                        res.setHeader(key, value);
                    });
                }
                res.status(statusCode).rdkSend(error);
            }
            else {
                res.status(500).rdkSend(error);
            }
        }
        else {
            res.status(200).rdkSend(json);
        }
    };

//----------------------------------------------------------------------------------------------------------------------
//                 These RPC's must always be called directly - there is no in-memory solution for them.
//----------------------------------------------------------------------------------------------------------------------

    //These RPC's must be called directly rather than being loaded from an in-memory database as they will
    //expect a certain number of characters to be submitted before the call can even be made (usually a minimum of 3 characters).
    //In these cases, you will NOT be able to retrieve the entire set of data.
    //When it comes to these kinds of RPC calls, "It polls several sources and pulls the returns from all of them - literally many thousands."
    if (type.toLowerCase() === 'allergies-match') {
        getAllergiesMatch(log, configuration, req.param('searchString'), serverSend);
        return;
    }
    if (type.toLowerCase() === 'medication-index') {
        getMedicationIndex(log, configuration, req.param('ien'), req.param('searchString'), serverSend);
        return;
    }
    if (type.toLowerCase() === 'medication-list') {
        getMedicationList(log, configuration, req.param('searchString'), serverSend);
        return;
    }
    if (type.toLowerCase() === 'problems-lexicon-lookup') {
        getProblemsLexiconLookup(log, configuration, req.param('searchString'), null, serverSend);
        return;
    }
    if (type.toLowerCase() === 'encounters-diagnosis-lexicon-lookup') {
        getEncounterDiagnosisLexiconLookup(log, configuration, req.param('searchString'), serverSend);
        return;
    }
    if (type.toLowerCase() === 'encounters-procedures-lexicon-lookup') {
        getEncountersProceduresLexiconLookup(log, configuration, req.param('searchString'), serverSend);
        return;
    }
    if (type.toLowerCase() === 'new-persons') {
        getNewPersons(log, configuration, req.param('searchString'), req.param('new-persons-type'), req.param('dateTime'), serverSend);
        return;
    }

//----------------------------------------------------------------------------------------------------------------------
// These RPC's returned 44 records at a time - we called them recursively and obtained the entire collection of their data.
//         We are here passing in a filter that will be used against that entire list to only return what matches it.
//----------------------------------------------------------------------------------------------------------------------
    if (type.toLowerCase() === 'lab-order-orderable-items') {
        filters = {
            'fieldToCheckAgainst': 'synonym',
            'stringToSearchFor': req.param('searchString')
        };
    }
    if (type.toLowerCase() === 'allergies-symptoms') {
        filters = {
            'fieldToCheckAgainst': 'synonym',
            'stringToSearchFor': req.param('searchString')
        };
    }
    if (type.toLowerCase() === 'progress-notes-titles') {
        filters = {
            'fieldToCheckAgainst': 'name',
            'stringToSearchFor': req.param('searchString')
        };
    }

    if (type.toLowerCase() === 'refresh') {
        if (dbList.refreshInProgress) {
            return serverSend(null, 'Refresh in progress');
        }
        else {
            dbList.refresh(req.app, true,function(err, result) {
                if (err) {
                    return serverSend(err);
                }

                return serverSend(null,result);
            });
        }
    }

    var i = _.indexOf(_.pluck(pickListConfig, 'name'), type);
    if (i === -1) {
        return serverSend('Not yet implemented');
    }

    // We already checked type and site at the start of this function.
    var params = {
        'pickList': type,
        'site': site
    };
    if (_.has(pickListConfig[i], 'requiredParams')) {
        for (var p = 0; p < pickListConfig[i].requiredParams.length; p++) {
            var paramName = pickListConfig[i].requiredParams[p];
            if (nullUtil.isNullish(req.param(paramName)) || _.isEmpty(req.param(paramName))) {
                return serverSend('Parameter \'' + paramName + '\' cannot be null or empty');
            }
            _.set(params, paramName, req.param(paramName).toUpperCase());
        }
    }
    if (_.has(pickListConfig[i], 'optionalParams')) {
        for (var p = 0; p < pickListConfig[i].optionalParams.length; p++) {
            var paramName = pickListConfig[i].optionalParams[p];
            if (!(nullUtil.isNullish(req.param(paramName)) || _.isEmpty(req.param(paramName)))) {
                _.set(params, paramName, req.param(paramName).toUpperCase());
            } else {
                _.set(params, paramName, null);
            }
        }
    }
    dbList.retrievePickList(req.app.logger, req.app.config.vistaSites[site], params, filters, pickListConfig[i].modulePath, pickListConfig[i].refreshInterval, serverSend);
}

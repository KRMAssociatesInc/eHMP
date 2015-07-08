/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var VistaJSLibrary = require('../../VistaJS/VistaJSLibrary');
var _ = require('underscore');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;

// below: _ exports for unit testing only
module.exports._buildSearchResults = buildSearchResults;
module.exports._buildSymptomResults = buildSymptomResults;
module.exports._getResourceConfig = getResourceConfig;
module.exports._performSearch = performSearch;
module.exports._getSymptoms = getSymptoms;

function getResourceConfig() {
    return [{
        name: 'search',
        path: '/search',
        get: performSearch,
        interceptors: {
            pep: false
        },
        parameters: {
            get: {
                searchParam: {
                    required: true,
                    description: 'Partial string for allergen search.'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/allergy/search',
                nickname: 'allergy-op-data-search',
                summary: '',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('searchParam', 'partial string for allergen search', 'string', true)
                ],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['jdsSync'],
        },
        description: {
            get: 'Given a text string, return a list of possible matches from several different sources.'
        }
    }, {
        name: 'symptoms',
        path: '/symptoms',
        get: getSymptoms,
        interceptors: {
            pep: false
        },
        parameters: {
            get: {
                param: {
                    required: true,
                    description: 'JSON string of parameters; ex.: {"dir":1,"from":"cough"}'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/allergy/symptoms',
                nickname: 'allergy-op-data-symptoms',
                summary: '',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('param', 'JSON string of parameters; ex.: {"dir":1,"from":"cough"}', 'string', true)
                ],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        description: {
            get: 'Returns a set of Symptoms for allergic reactions'
        }
    }];
}

/**
 * Given a text string, return a list of possible matches from several different sources.
 */
function performSearch(req, res) {
    req.logger.info('perform search for operational data resource GET called');

    var requestObj = {
        searchParam: req.param('searchParam')
    };

    if (requestObj.searchParam === undefined || requestObj.searchParam === null) {
        res.send(rdk.httpstatus.internal_server_error, 'The was no "searchParam" string in the request.');
    }

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDAL32 ALLERGY MATCH', requestObj.searchParam, function(error, result) {
        if (!error) {
            // Build object from result
            result = buildSearchResults(result);
            res.send(result);
        } else {
            res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
        }
    });
    //res.send(true);
}

/**
 * Returns a set of Symptoms for allergic reactions
 */
function getSymptoms(req, res) {
    req.logger.info('get symptoms for operational data resource GET called');

    var requestObj = {};
    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.\n' +
            'Executing with default params.');
    }
    requestObj.from = requestObj.from ? VistaJSLibrary.adjustForSearch(requestObj.from.toUpperCase()) : '';
    requestObj.dir = requestObj.dir || 1;

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDAL32 SYMPTOMS', requestObj.from, requestObj.dir, function(error, result) {
        if (!error) {
            // Build object from result
            result = buildSymptomResults(result);
            res.send(result);
        } else {
            res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
        }
    });
}

function buildSymptomResults(str) {
    str = str.split('\r\n');
    var retObj = {
        data: {
            items: []
        }
    };
    var symptoms = retObj.data.items;
    _.each(str, function(element) {
        var elArr = element.split('^');
        if (elArr.length < 2) {
            return;
        }
        symptoms.push({
            IEN: elArr[0] || '',
            name: elArr[1] || ''
        });
    });
    return retObj;
}

function buildSearchResults(str) {
    str = str.split('\r\n');
    var retObj = {
        numResults: 0,
        data: {
            items: []
        }
    };
    var files = retObj.data.items;
    _.each(str, function(element) {
        var elArr = element.split('^');
        if (elArr.length < 4) {
            return;
        }
        if (elArr[4] === 'TOP') {
            files.push({
                fileName: elArr[1] || '',
                fileNumber: elArr[0] || '',
                results: []
            });
        } else {
            _.each(files, function(file) {
                if (file.fileNumber === elArr[4]) {
                    file.results.push({
                        name: elArr[1] || '',
                        IEN: elArr[0] || '',
                        location: elArr[2] || '',
                        type: elArr[3] || '',
                        fileNumber: elArr[4] || ''
                    });
                }
            }, retObj);
        }
    });

    //Scrub duplicates
    _.each(files, function(file) {
        file.results = _.uniq(file.results, function(result) {
            return result.name;
        });
        retObj.numResults += file.results.length;
    }, retObj);
    return retObj;
}



module.exports.getResourceConfig = getResourceConfig;

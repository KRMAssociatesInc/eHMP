/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var _ = require('underscore');
var querystring = require('querystring');
var operationalData = require('./operationalData');
var VistaJS = require('../../VistaJS/VistaJS');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var jdsFilter = rdk.utils.jdsFilter;
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var filemanDateUtil = require('../../utils/filemanDateUtil');

function getResourceConfig() {
    return [{
        name: 'getImmunizationsOperationalData',
        path: '/operational-data',
        get: getImmunizationsOperationalData,
        parameters: {
            get: {
                searchforName: {
                    required: false,
                    description: 'the name used to search for immunizations'
                },
                searchforID: {
                    required: false,
                    description: 'the ID used to search for immunizations'
                },
                order: {
                    required: false,
                    description: 'the maximum number of immunizations to return from the search'
                },
                limit: {
                    required: false,
                    description: 'the maximum number of immunizations to return from the search'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('name', 'the name used to search for immunizations', 'string', false),
                    rdk.docs.commonParams.id('query', 'immunization', false),
                    rdk.docs.commonParams.jds.order,
                    rdk.docs.commonParams.jds.limit
                ],
                responseMessages: []
            }
        },
        interceptors: {
            synchronize: true,
            pep: false
        },

        healthcheck: {
            dependencies: ['jdsSync']
        }
    },
    {
        name: 'getPatientImmunizations',
        path: '',
        get: getPatientImmunizations,
        parameters: {
            get: {
                searchfor: {
                    required: false,
                    description: 'the term used to used to search for immunizations'
                },
                order: {
                    required: false,
                    description: 'the maximum number of immunizations to return from the search'
                },
                limit: {
                    required: false,
                    description: 'the maximum number of immunizations to return from the search'
                }
            }
        },
        apiDocs: {
            spec: {
                summary: '',
                notes: '',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('query', 'the name used to search for immunizations', 'string', false),
                    rdk.docs.commonParams.jds.order,
                    rdk.docs.commonParams.jds.limit
                ],
                responseMessages: []
            }
        },
        interceptors: {
            synchronize: true,
            pep: false
        },

        healthcheck: {
            dependencies: ['jdsSync']
        }
    },
    {
        name: 'AddImmunization',
        path: '',
        put: addImmunization,
        interceptors: {
            audit: false,
            metrics: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        },
        healthcheck: {
            dependencies: []
        },
        permissions: ['add-patient-immunization'],
        parameters: {
        },
        apiDocs: {
            spec: {
                summary: 'Add a new patient immunization',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        description: {
            put: 'Add a new patient immunization'
        }
    }];
}

/**
* Adds an immunization. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to add an immunization.
* @param {Object} res - The default Express response.
*/
function addImmunization(req, res) {
    req.audit.dataDomain = 'Immunization';
    req.audit.logCategory = 'ADD_IMMUNIZATION';

/*
    var content = req.body;

    var result;
    var siteID;
    try {
        req.logger.debug('addProblem content: ' + content);
        result = parseAddProblemInput(content);
        siteID = sitetoStationID(req, req.session.user.site);
    } catch (e) {
        req.logger.error(e.message);
        res.send(rdk.httpstatus.bad_request, e.message);
        return;
    }
*/
    var rpcConfiguration = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfiguration.accessCode = req.session.user.accessCode;
    rpcConfiguration.verifyCode = req.session.user.verifyCode;

    var params = [];
    var currentDate = new Date();
    currentDate = filemanDateUtil.getFilemanDate(currentDate);
    /*
    params[0] = 'HMPLIST(1)="HDR^0^0^WALGREENS;' + currentDate + ';E"';
    params[1] = 'HMPLIST(2)="VST^DT^3' + currentDate + '"';
    params[2] = 'HMPLIST(3)="VST^PT^3"';
    params[3] = 'HMPLIST(5)="VST^VC^E"';
    VistaJS.callRpc(req.logger, rpcConfiguration, 'PX SAVE DATA', [params, null, 'HMP', 'HMP'], function(error, result) {
    return an error
    */

     //params[0] = 'HMPLIST(1)="HDR^0^0^WALGREENS;100095;E"';
     //params[1] = 'HMPLIST(2)="VST^DT^3"';
     //params[2] = 'HMPLIST(3)="VST^PT^3"';
     //params[3] = 'HMPLIST(4)="VST^VC^E"';
     //params[4] = 'HMPLIST(5)="IMM+^612013^^^^0^0^^^6"';
     //params[5] = 'HMPLIST(6)="COM^COM^Comment entered Feb 05, 2015@16:57:46"';
     //VistaJS.callRpc(req.logger, rpcConfiguration, 'PX SAVE DATA', params, function(error, result) {
     //ERROR=<PARAMETER>SAVE^PXRPC
     //LAST REF=^XUSEC("XUPROGMODE",10000000

    params[0] = 'HMPLIST(1)="HDR^0^0^WALGREENS;' + currentDate + ';E"';
    params[1] = 'HMPLIST(2)="VST^DT^3' + currentDate + '"';
    params[2] = 'HMPLIST(3)="VST^PT^3"';
    params[3] = 'HMPLIST(5)="VST^VC^E"';


    VistaJS.callRpc(req.logger, rpcConfiguration, 'PX SAVE DATA', params, function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully wrote new problem back to VistA. with ' + result);
            res.send(rdk.httpstatus.ok, {
                response: 'Success'
            });
        }
    });

    res.status(rdk.httpstatus.ok).send('Success');
}

function getImmunizationsOperationalData(req, res) {
    req.audit.dataDomain = 'Immunization';
    req.audit.logCategory = 'GET_IMMUNIZATION_OPERATIONAL_DATA';

    getOperationalData(req, function(err, immunizations) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            res.status(rdk.httpstatus.ok).send(immunizations);
        }
    });
}

function getLotNumbers(logger, lotNumbers, immunization) {
    var retVal = [];

    _.forEach(lotNumbers, function(lotNumber) {
        var vaccine_1 = lotNumber.vaccine;
        var vaccine_2 = lotNumber.vaccine_2;
        var vaccine_3 = lotNumber.vaccine_3;
        var vaccine_4 = lotNumber.vaccine_4;
        var vaccine_5 = lotNumber.vaccine_5;

        if (immunization.toLowerCase() === vaccine_1.toLowerCase()) {
            retVal.push(lotNumber);
        }

        if (vaccine_2 && immunization.toLowerCase() === vaccine_2.toLowerCase()) {
            retVal.push(lotNumber);
        }

        if (vaccine_3 && immunization.toLowerCase() === vaccine_3.toLowerCase()) {
            retVal.push(lotNumber);
        }

        if (vaccine_4 && immunization.toLowerCase() === vaccine_4.toLowerCase()) {
            retVal.push(lotNumber);
        }

        if (vaccine_5 && immunization.toLowerCase() === vaccine_5.toLowerCase()) {
            retVal.push(lotNumber);
        }

    });

    return retVal;
}

function getVis(logger, viss, immunization) {
    var retVal = [];

    _.forEach(viss, function(vis) {
        var vaccines = vis.vaccines;
        if (!_.isUndefined(vaccines)) {
            _.forEach(vaccines, function(vaccine){
                if (immunization === vaccine.name) {
                    //logger.error('found a match');
                    retVal.push(vis);
                }
            });
        }
    });

    return retVal;
}

function getImmunizationOperationalData(logger, name) {
    var routeOfAdministrationList = operationalData.routeOfAdministrationList;
    var vaccineInformationStatementList = operationalData.vaccineInformationStatementList;
    var infoSourceList = operationalData.infoSourceList;
    var anatomicLocationList = operationalData.anatomicLocationList;
    var lotNumberList = operationalData.lotNumberList;
    var reactionList = operationalData.reactionList;
    var seriesList = operationalData.seriesList;

    var lotNumbers = getLotNumbers(logger, lotNumberList, name);
    var vis = getVis(logger, vaccineInformationStatementList, name);

    var retVal = {
        lotNumbers : lotNumbers,
        vaccineInformationStatement: vis,
        routeOfAdministration: routeOfAdministrationList,
        infoSource: infoSourceList,
        anatomicLocation: anatomicLocationList,
        reaction: reactionList,
        series : seriesList
    };

    return retVal;
}

function getOperationalData(req, callback) {
    // TODO the JDS data is not complete yet and we are hard coding the results

    var immunizations = {};
    immunizations.data = {};
    var searchName = req.param('name');

    if (_.isUndefined(searchName)) {
        immunizations.data.items = operationalData.completeOperationalData;
    } else {
        var retVal = getImmunizationOperationalData(req.logger, searchName);
        immunizations.data.items = retVal;

    }

    callback(null, immunizations);
}

function getPatientImmunizations(req, res) {
    req.audit.dataDomain = 'Immunization';
    req.audit.logCategory = 'GET_IMMUNIZATION';

    getPatientImmunizations_(req, function(err, immunizations) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            res.status(rdk.httpstatus.ok).send(immunizations);
        }
    });
}

function massageData(input, logger) {
    if (_.isUndefined(logger)){
        logger = {};
    }

    var retVals = {};
    logger.debug('for immunizations we got ' + input);

    if (nullchecker.isNullish(input)) {
        logger.debug('massageData: input is missing');
        return retVals;
    }

    var data = '';

    try {
        data = JSON.parse(input);
    } catch(err) {
        logger.error(err.message);
        return retVals;
    }

    if (data && data.data && data.data.items) {
        retVals.data = {};
        retVals.data.items = data.data.items;
    }

    return retVals;
}

function getPatientImmunizations_(req, callback) {
    var limit = req.param('limit');
    var order = req.param('order');
    var jdsServer = req.app.config.jdsServer;
    var siteCode = req.session.user.site;
    var jdsQuery = {};

    if (limit) { //ensure limit exists and is positive integer
        limit = Number(limit);
        jdsQuery.limit = limit;
    }

    if (order) {
        jdsQuery.order = order;
    }

    jdsQuery.filter = jdsFilter.build([
        ['like', 'uid', '"%' + siteCode + '%"']
    ]);

    var jdsResource = '/data/find/immunization-list';
    var jdsQueryString = querystring.stringify(jdsQuery);
    var jdsPath = jdsResource + '?' + jdsQueryString;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsPath
    });

    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger
    };

    httpUtil.fetch(config, function(err, result) {
        if (err) {
            req.logger.error(err.message);
            callback(err);
            return;
        }

        var returnedData = result.trim();
        var immunizations = massageData(returnedData, req.logger);
        callback(null, immunizations);
    });
}

module.exports.getResourceConfig = getResourceConfig;

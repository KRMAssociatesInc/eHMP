'use strict';

var _ = require('underscore');

var rdk = require('../../core/rdk');
var utils = require('../../utils/param-converter');
var VistaJS = require('../../VistaJS/VistaJS');
var VistaJSLibrary = require('../../VistaJS/VistaJSLibrary');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var nullChecker = require('../../utils/nullchecker');
var async = require('async');
var querystring = require('querystring');
var jdsFilter = require('jds-filter');

var internalError = rdk.httpstatus.internal_server_error;

var ORDER_QUICK_VIEW_FILE_IEN = 30;

// below: _ exports for unit testing only
module.exports._getResourceConfig = getResourceConfig;
module.exports._performSearch = performSearch;
module.exports._getMedSchedule = getMedSchedule;
module.exports._getMedDefaults = getMedDefaults;
module.exports._getDialogFormat = getDialogFormat;
module.exports._getMedSearchList = getMedSearchList;
module.exports._getDiscontinueReason = getDiscontinueReason;
module.exports._getOrderPresets = getOrderPresets;
module.exports._verifyDayToQuantity = verifyDayToQuantity;
module.exports._getDaysSupply = getDaysSupply;

//helper functions
module.exports._buildMedResultList = buildMedResultList;
module.exports._buildMedSchedules = buildMedSchedules;
module.exports._buildMedDefaults = buildMedDefaults;
module.exports._buildDialogFormat = buildDialogFormat;
module.exports._buildDiscontinueReasonList = buildDiscontinueReasonList;
module.exports._buildOrderPresets = buildOrderPresets;

/* AVAILABLE CALLS (see function comments for parameter explanation)
writeback/med/orderpresets?param={"orderien":"X33344;1", "trans":0}
writeback/med/search?searchParam=alc
writeback/med/getSearchList?param={"search":"alc","count":"10"}
writeback/med/schedule?param={"dfn":"100695","locien":"0"}
writeback/med/defaults?param={"oi":"1348","pstype":"X","orvp": 100695,"needpi":"Y", "pkiactiv":"Y"} ()
writeback/med/dialogformat?dlg="PSH OERR"
writeback/med/discontinuereason
*/

var defaultsMapping = {
    'medication': ['medien', 'value'],
    'verb': ['value'],
    'preposition': ['value'],
    'ptinstr': ['value'],
    'alldoses': ['dose', 'drugien', 'dose_desc'],
    'dosage': ['drugname', 'drugien', 'NF', 'dose_desc', 'qty', 'price_per_dispensed_unit', 'maxrefills', 'dispunits', 'split'],
    'dispense': ['drugien', 'strength', 'unit', 'name', 'split'],
    'route': ['routeien', 'route', 'latin_abbr', 'outpatient_expansion', 'iv_flag'], //just in case...
    'iroute': ['routeien', 'route', 'latin_abbr', 'outpatient_expansion', 'iv_flag'],
    'droute': ['routeien', 'route', 'iv_flag'],
    'schedule': ['value'],
    'guideline': ['value'],
    'message': ['value'],
    'deaschedule': ['type']
};

var dialogFormatMapping = {
    'all': ['prmtid', 'prmtien', 'fmtseq', 'fmt', 'omit', 'lead', 'trail', 'nwln', 'wrap', 'child', 'ischild']
};

//see 10.2.2.101/query?fmql=DESCRIBE%20100_045%20IN%20100-33344%20LIMIT%2010&format=HTML
var orderPresetsMapping = {
    't': 'text',
    'e': 'external',
    'i': 'internal'
};

var daysSupplyDescription = {
    get: 'perform medication days supply search for operational data resource GET called'
};

// PAT: patient DFN
// DRG: drug ien
// OI: medication medium

var daysSupplyParameters = {
    get: {
        patientIEN: {
            required: true,
            description: 'patient IEN'
        },
        drugIEN: {
            required: true,
            description: 'drug IEN'
        },
        medIEN: {
            required: true,
            description: 'medication IEN'
        }
    }
};

function getResourceConfig() {
    return [{
        name: 'search',
        path: '/search',
        get: performSearch,
        parameters: {
            get: {
                searchParam: {
                    required: true,
                    description: 'The search text for the medication'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/search',
                nickname: 'med-op-data-search',
                summary: 'Returns subset of medication orders for search string entered',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('searchParam', 'search text for the medication', 'string', true),
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns subset of medication orders for search string entered'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'schedule',
        path: '/schedule',
        get: getMedSchedule,
        parameters: {
            get: {
                dfn: {
                    required: true,
                    description: 'Patient IEN'
                },
                locien: {
                    required: false,
                    description: 'Ward Location IEN'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/schedule',
                nickname: 'med-op-data-schedule',
                summary: 'Return all medication schedules',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('dfn', 'patient ien', 'string', true),
                    rdk.docs.swagger.paramTypes.query('locien', 'ward location ien', 'string', false)
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Return all medication schedules'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'defaults',
        path: '/defaults',
        get: getMedDefaults,
        parameters: {
            get: {
                oi: {
                    required: true,
                    description: 'order item file IEN (drug)'
                },
                pstype: {
                    required: true,
                    description: 'pharmacy type'
                },
                ovrp: {
                    required: true,
                    description: 'patient DFN'
                },
                needpi: {
                    required: true,
                    description: 'patient instructions flag (Y|N)'
                },
                pkiactiv: {
                    required: true,
                    description: 'drug dea schedule flag (Y|N)'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/defaults',
                nickname: 'med-op-data-defaults',
                summary: 'Returns all meds and doses',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('dfn', 'order item file IEN (drug)', 'string', true),
                    rdk.docs.swagger.paramTypes.query('pstype', 'pharmacy type', 'string', true),
                    rdk.docs.swagger.paramTypes.query('ovrp', 'patient DFN', 'string', true),
                    rdk.docs.swagger.paramTypes.query('needpi', 'patient instructions flag', 'string', true, ['Y', 'N']),
                    rdk.docs.swagger.paramTypes.query('pkiactiv', 'drug dea schedule flag', 'string', true, ['Y', 'N'])
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns all meds and doses'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'searchlist',
        path: '/searchlist',
        get: getMedSearchList,
        interceptors: {
            jdsFilter: true,
            pep: false,
            synchronize: false
        },
        parameters: {
            get: {
                filter: {
                    required: false,
                    regex: /eq("[^"]*","[^"]*")/,
                    description: 'Sample filter param: "filter=and(ilike(name,"aspirin"),eq("types[].type","NON-VA MEDS"))"' +
                        'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/searchlist',
                nickname: 'med-op-data-searchlist',
                summary: 'Get medications from JDS - use filter parameter to query based on string, type, etc.',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.commonParams.jds.filter
                ],
                responseMessages: []
            }
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        description: {
            get: 'Get medications from JDS - use filter parameter to query based on string, type, etc.'
        }
    }, {
        name: 'dialogformat',
        path: '/dialogformat',
        get: getDialogFormat,
        parameters: {
            get: {
                dlg: {
                    required: true,
                    description: 'Order dialog file #'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/dialogformat',
                nickname: 'med-op-data-dialogformat',
                summary: 'Returns format mapping for PSH OERR dialog',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('dlg', 'Order dialog file #', 'string', true)
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns format mapping for PSH OERR dialog'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'discontinuereason',
        path: '/discontinuereason',
        get: getDiscontinueReason,
        parameters: {},
        apiDocs: {
            spec: {
                path: '/writeback/med/discontinuereason',
                nickname: 'med-op-data-discontinuereason',
                summary: 'Perform discontinue reason lookup for operational data resource',
                notes: '',
                method: 'GET',
                parameters: [],
                responseMessages: []
            }
        },
        description: {
            get: 'Perform discontinue reason lookup for operational data resource'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'orderpresets',
        path: '/orderpresets',
        get: getOrderPresets,
        parameters: {
            get: {
                orderien: {
                    required: true,
                    description: 'The order ien + ";" + revision which should resemble 3455;3'
                },
                trans: {
                    required: false,
                    description: 'Transient parameter and possibly has to do with children, but at the time, functionality is more or less unknown'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/orderpresets',
                nickname: 'med-op-data-orderpresets',
                summary: 'Returns a data set containing operational data selections required to re-populate order page when edit is triggered',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('orderien', 'The order ien + ";" + revision which should resemble 3455;3', 'string', true),
                    rdk.docs.swagger.paramTypes.query('trans', 'Transient parameter and possibly has to do with children, but at the time, functionality is more or less unknown', 'string', false)
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns a data set containing operational data selections required to re-populate order page when edit is triggered'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'daytoquantity',
        path: '/daytoquantity',
        get: getDayToQuantity,
        parameters: {
            get: {
                supply: {
                    required: true,
                    description: 'The day\'s supply'
                },
                dose: {
                    required: true,
                    description: 'The dose'
                },
                schedule: {
                    required: true,
                    description: 'The schedule'
                },
                duration: {
                    required: true,
                    description: 'The duration'
                },
                patientIEN: {
                    required: true,
                    description: 'The patient IEN'
                },
                drugIEN: {
                    required: true,
                    description: 'The drug IEN'
                }
            }
        },
        apiDocs: {
            spec: {
                path: '/writeback/med/daytoquantity',
                nickname: 'med-op-data-daytoquantity',
                summary: 'Returns the quantity of a medication',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('supply', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('dose', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('schedule', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('duration', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('patientIEN', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('drugIEN', undefined, 'string', true)
                ],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns the quantity of a medication'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        }
    }, {
        name: 'dayssupply',
        path: '/dayssupply',
        get: getDaysSupply,
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        parameters: daysSupplyParameters,
        apiDocs: {
            spec: {
                path: '/writeback/med/dayssupply',
                nickname: 'med-op-data-dayssupply',
                summary: 'perform medication days supply search for operational data resource GET called',
                notes: '',
                method: 'GET',
                parameters: [
                    rdk.docs.swagger.paramTypes.query('patientIEN', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('drugIEN', undefined, 'string', true),
                    rdk.docs.swagger.paramTypes.query('medIEN', undefined, 'string', true)
                ],
                responseMessages: []
            }
        },
        description: daysSupplyDescription
    }];
}

function getOrderPresets(req, res) {
    //returns a data set containing operational data selections required to re-populate order page when edit is triggered
    //orderien is the order ien + ';' + revision which should resemble 3455;3
    //second parameter is transient and possibly has to do with children, but at the time, functionality is more or less unknown
    req.logger.info('perform search for preexisting orders operational data defaults GET called');
    var requestObj = {};

    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }

    if (nullChecker.isNullish(requestObj.orderien)) {
        res.status(internalError).rdkSend('The was no \'orderien\' string in the request.');
    }

    if (requestObj.orderien.toUpperCase().charAt(0) !== 'X') {
        requestObj.orderien = 'X' + requestObj.orderien;
    }

    //TODO:  figure out what the second parameter is
    requestObj.trans = requestObj.trans || 0;

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX LOADRSP', [requestObj.orderien, requestObj.trans], function(error, result) {
        if (!error) {
            // Build object from result
            try {
                res.rdkSend(buildOrderPresets(result));
            } catch (e) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend('RPC returned with error:' + e);
            }
        } else {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('RPC returned with error:' + error);
        }
    });
}

function buildOrderPresets(str) {
    //Parses response and creates object for return
    //Since all item entries have a fixed format for item data, we will only use mapping to differentiate types and precidence
    var orderPresets = {};
    _.each(str.split('~'), function(element) {
        if (nullChecker.isNullish(element) || element.length < 1) {
            return;
        }

        var itemEntry = element.split('\r\n'),
            temp,
            fieldName,
            code;

        _.each(itemEntry, function(element, index) {
            if (nullChecker.isNullish(element) || element.length < 1) {
                return;
            }
            if (index === 0) { //First item contains data about the item entry
                temp = element.split('^');
                if (nullChecker.isNullish(temp)) {
                    return;
                }
                if (temp.length !== 3) { //something is very wrong, we should have exactly 3 items
                    throw 'Failed to parse order presets';
                }
                fieldName = temp[2].toLowerCase();
                orderPresets[fieldName] = {
                    'entryien': temp[0],
                    'instance': temp[1],
                    'values': {},
                    'displayvalue': {}
                };
            } else {
                code = element.charAt(0);
                //if nothing is parsed for the code, just set it to text
                // if there is a collsion then replace with an array.
                if (orderPresets[fieldName].values[orderPresetsMapping[code] || 'text']) {
                    var arr = [],
                        val = orderPresets[fieldName].values[orderPresetsMapping[code] || 'text'];
                    arr = arr.concat(val, element.substring(1));
                    orderPresets[fieldName].values[(orderPresetsMapping[code] || 'text')] = arr;
                } else {
                    orderPresets[fieldName].values[orderPresetsMapping[code] || 'text'] = element.substring(1);
                }
            }
        });
        if (!nullChecker.isNullish(orderPresets[fieldName].values)) {
            //set field name by precidence
            orderPresets[fieldName].displayvalue = orderPresets[fieldName].values.text || orderPresets[fieldName].values.external || orderPresets[fieldName].values.internal;
        }
    });
    return new utils.returnObject([orderPresets]);
}

function performSearch(req, res) { //returns 1 result
    req.logger.info('perform medication search for operational data resource GET called');

    var userSearchParam = req.param('searchParam');
    if (userSearchParam === undefined || userSearchParam === null) {
        res.status(rdk.httpstatus.internal_server_error).rdkSend('The was no \'searchParam\' string in the request.');
    }
    var requestObj = {
        ien: ORDER_QUICK_VIEW_FILE_IEN, //constant IEN for medication serach
        searchParam: VistaJSLibrary.adjustForSearch(userSearchParam.toUpperCase())
    };

    console.log('**********');
    console.log('req.app: %s', require('util').inspect(req.app, {
        depth: null
    }));
    console.log('getVistaRpcConfiguration(req.app.config, req.session.user.site): %s', require('util').inspect(getVistaRpcConfiguration(req.app.config, req.session.user.site), {
        depth: null
    }));
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWUL FVIDX', [requestObj.ien, requestObj.searchParam], function(error, result) {
        if (!error) {
            // Build object from result
            res.rdkSend(buildMedResultList(result));
        } else {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('RPC returned with error:' + error);
        }
    });
}

function getMedSearchList(req, res) {
    //expects two JSON formatted input params
    //search is the medication string to search on (which should be formatted for search)
    //count is the number of results to display
    //Is a wrapper for two distinct RPC calls
    //...first one returns an array of a single item with item index
    //...second calls list passing item index and end (index-1+count)

    req.logger.info('perform separate search and med list functions with one RDK call');

    var jdsQuery = {};
    var filter = req.interceptorResults && req.interceptorResults.jdsFilter.filter || [];
    filter.push(['ilike', 'uid', '%' + req.session.user.site + '%']);
    jdsQuery.filter = jdsFilter.build(filter);
    var jdsPath = '/data/find/orderable?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    async.series([
            function(callback) {
                fetchData(httpConfig, req, callback);
            }
        ],
        function(err, results) {
            if (err instanceof FetchError) {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
            } else if (err instanceof NotFoundError) {
                res.status(rdk.httpstatus.not_found).rdkSend(err.error);
            } else if (err) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            } else {
                var domainData = results[0];
                return res.rdkSend(domainData);
            }
        });
}

function buildMedResultList(str) {
    var medications = [];

    _.each(str.split('\r\n'), function(element) {
        var elem = element.split(/\^|[ ]{5,}/g);
        if (elem.length < 2) {
            return;
        }
        medications.push({
            IEN: elem[0] || '',
            name: elem[1] || '',
            desc: elem[2] || ''
        });

    });

    return new utils.returnObject(medications);
}

function getMedSchedule(req, res) { //returns all meds and doses
    var requestObj = {};

    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }

    var dfn = requestObj.dfn;
    if (!nullChecker.isNullish(dfn)) {
        req.audit.patientId = dfn;
    }

    //dfn is the patientien
    //locien is the wardien
    req.logger.info('perform medication schedule search for operational data resource GET called');

    var jdsQuery = {};
    jdsQuery.filter = jdsFilter.build(['ilike', 'uid', '%' + req.session.user.site + '%']);
    var jdsPath = '/data/find/schedule?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, req.app.config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    async.series([
            function(callback) {
                fetchData(httpConfig, req, callback);
            }
        ],
        function(err, results) {
            if (err instanceof FetchError) {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).rdkSend('There was an error processing your request. The error has been logged.');
            } else if (err instanceof NotFoundError) {
                res.status(rdk.httpstatus.not_found).rdkSend(err.error);
            } else if (err) {
                res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
            } else {
                var domainData = results[0];
                var items = domainData.data.items;
                items = _.sortBy(items, function(obj) {
                    return obj.name;
                });
                domainData.data.items = items;
                return res.rdkSend(domainData);
            }
        });
}

function getDaysSupply(req, res) {
    req.logger.info(daysSupplyDescription);

    var requestObj;

    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }

    if (nullChecker.isNullish(requestObj.patientIEN)) {
        res.status(internalError).rdkSend('The was no \'patientIEN\' property in the request.');
    }

    if (nullChecker.isNullish(requestObj.drugIEN)) {
        res.status(internalError).rdkSend('The was no \'drugIEN\' property in the request.');
    }

    if (nullChecker.isNullish(requestObj.medIEN)) {
        res.status(internalError).rdkSend('The was no \'medIEN\' property in the request.');
    }

    req.audit.patientId = requestObj.patientIEN;

    // e.g. params '^', '^', '149', '108', '3524'
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site),
        'ORWDPS1 DFLTSPLY', ['^', '^', requestObj.patientIEN, requestObj.drugIEN, requestObj.medIEN], function(error, result) {
        if (!error) {
            res.rdkSend({'dayssupply': result});
        } else {
            res.status(internalError).rdkSend('RPC returned with error:' + error);
        }
    });
}

function buildMedSchedules(str) {
    //name, desc, code, time
    var schedule = [];

    _.each(str.split('\r\n'), function(element) {
        if (element.length < 1) {
            return;
        }
        var elem = element.split('^');
        schedule.push({
            name: elem[0] || '',
            desc: elem[1] || '',
            code: elem[2] || '',
            time: elem[3] || ''
        });

    });

    return new utils.returnObject(schedule);
}

function getMedDefaults(req, res) { //returns all meds and doses
    //oi is order item file IEN (drug)
    //pstype is pharmacy type
    //ovrp is patient DFN
    //needpi is patient instructions flag (Y|N)
    //pkiactiv is drug dea schedule flag (Y|N)
    //all fields are required

    req.logger.info('perform medication defaults search for operational data resource GET called');

    var requestObj = {};

    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }

    if (requestObj.oi === undefined || requestObj.oi === null) {
        res.status(internalError).rdkSend('The was no \'oi\' string in the request.');
    }

    if (requestObj.pstype === undefined || requestObj.pstype === null) {
        res.status(internalError).rdkSend('The was no \'pstype\' string in the request.');
    }

    if (requestObj.orvp === undefined || requestObj.orvp === null) {
        res.status(internalError).rdkSend('The was no \'orvp\' string in the request.');
    }

    if (requestObj.needpi === undefined || requestObj.needpi === null) {
        res.status(internalError).rdkSend('The was no \'needpi\' string in the request.');
    }

    var needpi = requestObj.needpi.toLowerCase();
    if (needpi !== 'y' && needpi !== 'n') {
        res.status(internalError).rdkSend('The \'needpi\' string must be either \'y\' or \'n\', case insensitive.');
    }

    if (requestObj.pkiactiv === undefined || requestObj.pkiactiv === null) {
        res.status(internalError).rdkSend('The was no \'pkiactiv\' string in the request.');
    }

    var pkiactiv = requestObj.pkiactiv.toLowerCase();
    if (pkiactiv !== 'y' && pkiactiv !== 'n') {
        res.status(internalError).rdkSend('The \'pkiactiv\' string must be either \'y\' or \'n\', case insensitive.');
    }

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDPS2 OISLCT', [requestObj.oi, requestObj.pstype.toUpperCase(), requestObj.orvp, requestObj.needpi.toUpperCase(), requestObj.pkiactiv.toUpperCase()], function(error, result) {
        if (!error) {
            // Build object from result
            res.status(buildMedDefaults(result).rdkSend(req));
        } else {
            res.status(internalError).rdkSend('RPC returned with error:' + error);
        }
    });

}

function buildMedDefaults(str) {
    //formats nested complex data
    var defaults = [];
    var parsedObj = {
        internal: {},
        display: {}
    };
    _.each(str.split('~'), function(element) {
        if (!element || element.length < 1) {
            return;
        }

        var elementArr = element.split('\r\n'),
            fieldName = elementArr[0], //first element will be the subject of the following fields
            fields = defaultsMapping[fieldName.toLowerCase()]; //get the list of fields we will parse

        _.each(elementArr, function(elem, index) { //parse the subsets under each subject
            if (index === 0 || elem.length < 1) { //we don't need the first one since it is the subject and we don't want empty fields
                return;
            }
            var tmp = {},
                ptr,
                fName = fieldName.toLowerCase();

            if ((/^d/).test(elem)) {
                ptr = parsedObj.display;
                elem = elem.replace(/^d/, ''); //string the leading 'd' if there is one
                if (fName === 'route') { //edge case where 'i' and 'd' mappings do not match
                    fields = defaultsMapping['d' + fName];
                }
            } else { //assume internal if we don't have a key showing as much
                ptr = parsedObj.internal;
                elem = elem.replace(/^i/, ''); //strip the leading 'i' if there is one
                if (fName === 'route') { //edge case where 'i' and 'd' mappings do not match
                    fields = defaultsMapping['i' + fName];
                }
            }

            _.each(elem.split('^'), function(elem, index) { //iterate through the columns and match to the field names
                var key = fields[index].toLowerCase();
                tmp[key] = elem;
            });
            if (ptr[fieldName] === undefined) {
                ptr[fieldName] = [];
            }
            ptr[fieldName].push(tmp);
        });
    });

    defaults.push(parsedObj);
    return new utils.returnObject(defaults);
}

function getDialogFormat(req, res) { //returns all meds and doses
    //dlg is order dialog file #
    req.logger.info('perform order format search for operational data resource GET called');

    var requestObj = {};

    requestObj.dlg = JSON.parse(req.param('dlg'));
    if (requestObj.dlg === undefined || requestObj.dlg === null) {
        res.status(internalError).rdkSend('The was no \'dlg\' string in the request.');
    }

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX DLGDEF', requestObj.dlg, function(error, result) {
        if (!error) {
            // Build object from result
            res.rdkSend(buildDialogFormat(result));
        } else {
            res.status(internalError).rdkSend('RPC returned with error:' + error);
        }
    });
}


function buildDialogFormat(str) {
    var retObj = {};
    var mapping = dialogFormatMapping.all;
    _.each(str.split('\r\n'), function(elem) {
        if (!elem || elem.length < 1) {
            return;
        }
        var tmp = {},
            pk = '';
        _.each(elem.split('^'), function(elem, index) {
            if (index === 0) {
                pk = elem;
                return;
            }
            var key = mapping[index];
            tmp[key] = elem;
        });
        retObj[pk] = tmp;
    });
    return new utils.returnObject([retObj]);
}

function getDiscontinueReason(req, res) {
    //no required inputs, nothing to validate
    req.logger.info('perform discontinue reason lookup for operational data resource GET called');
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX2 DCREASON', [], function(error, result) {
        if (!error) {
            // Build object from result
            res.rdkSend(buildDiscontinueReasonList(result));
        } else {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('RPC returned with error:' + error);
        }
    });
}

function verifyDayToQuantity(requestParameters) {
    var errorMessage = '';

    if (requestParameters.supply === undefined || requestParameters.supply === null) {
        errorMessage = 'There was no \'supply\' string in the request.\n';
    }
    if (requestParameters.dose === undefined || requestParameters.dose === null) {
        errorMessage += 'There was no \'dose\' string in the request.\n';
    }
    if (requestParameters.schedule === undefined || requestParameters.schedule === null) {
        errorMessage += 'There was no \'schedule\' string in the request.\n';
    }
    if (requestParameters.duration === undefined || requestParameters.duration === null) {
        errorMessage += 'There was no \'duration\' string in the request.\n';
    }
    if (requestParameters.patientIEN === undefined || requestParameters.patientIEN === null) {
        errorMessage += 'There was no \'patient IEN\' string in the request.\n';
    }
    if (requestParameters.drugIEN === undefined || requestParameters.drugIEN === null) {
        errorMessage += 'There was no \'drug IEN\' string in the request.\n';
    }
    return errorMessage;
}

function getDayToQuantity(req, res) {
    // requestParameters.locien = requestParameters.locien || 0;
    req.logger.info('perform medication schedule search for operational data resource GET called');

    var errorMessage = '';

    var requestParameters;// = req.query;

    try {
        requestParameters = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }
    errorMessage = verifyDayToQuantity(requestParameters);

    if (errorMessage.length === 0) {
        var supply = requestParameters.supply;
        var dose = requestParameters.dose + '^';
        var schedule = requestParameters.schedule + '^';
        var duration = requestParameters.duration + '^';
        var patientIEN = requestParameters.patientIEN;
        var drugIEN = requestParameters.drugIEN;

        VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDPS2 DAY2QTY', [supply, dose, schedule, duration, patientIEN, drugIEN], function(error, result) {
            if (!error) {
                // Build object from result
                res.rdkSend({'quantity':result});
            } else {
                res.status(internalError).rdkSend('RPC returned with error:' + error);
            }
        });
    } else {
        res.rdkSend(errorMessage);
    }
}

function buildDiscontinueReasonList(str) {
    var retObj = [],
        lineItem;
    _.each(str.split('\r\n'), function(elem) {
        lineItem = elem.split('^');
        //make sure we have something and that it isn't the title (which isn't needed)
        if (lineItem[0] && lineItem[0].charAt(0) !== '~'
        ) {
            retObj.push({
                'id': lineItem[0].replace('i', ''),
                'name': lineItem[1]
            });
        }
    });
    return new utils.returnObject(retObj);
}

function fetchData(httpConfig, req, callback) {
    var pid = req.param('pid');

    req.logger.info('Retrieve pid=%s index=%s from server %s:%s', pid, httpConfig.host, httpConfig.port);
    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (isNotFound(obj)) {
                    return callback(new NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

function isNotFound(obj) {
    return ('code' in obj.error && String(obj.error.code) === String(rdk.httpstatus.not_found));
}

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.performSearch = performSearch;
module.exports.getMedSchedule = getMedSchedule;
module.exports.getMedDefaults = getMedDefaults;
module.exports.getDialogFormat = getDialogFormat;
module.exports.getMedSearchList = getMedSearchList;
module.exports.getDiscontinueReason = getDiscontinueReason;
module.exports.getOrderPresets = getOrderPresets;
module.exports.verifyDayToQuantity = verifyDayToQuantity;
module.exports.getDaysSupply = getDaysSupply;

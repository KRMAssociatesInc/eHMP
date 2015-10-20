/*jslint node: true*/
'use strict';

var rdk = require('../../core/rdk');
var httpUtil = require('../../utils/http');
var VistaJS = require('../../VistaJS/VistaJS');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var paramUtil = require('../../utils/param-converter');

var closestParams = {
    get: {
        pid: {
            required: true,
            description: 'patient ID'
        },
        ts: {
            required: false,
            description: 'root date of where search will take place, used in conjunction with the flag parameter'
        },
        type: {
            required: true,
            description: 'the vital type abbreviation'
        },
        flag: {
            required: false,
            description: 'indicates if the search should look before or after the date/time specified in the GMVDT value where 1 indicates before, 2 indicates after and 0 inidicates either direction'
        }
    }
};

var qualifiersParams = {
    get: {
        param: {
            required: false,
            description: 'a comma delimited list of vital abbreviations; example: types=WT,HT,T for weight, height, temperature. Leaving this parameter off will return all vital qualifiers'
        }
    }
};

var vitalsRuleParams = {
    get: {
        pid: {
            required: true,
            description: 'The patient identifier'
        },
        weight: {
            required: true,
            description: 'The user entered patient weight'
        },
        height: {
            required: true,
            description: 'The user entered patient height'
        }
    }
};

var allParams = {
    get: {
        pid: {
            required: true,
            description: 'patient ID'
        },
        start: {
            required: true,
            description: 'start date/time for search in FileMan format'
        },
        end: {
            required: true,
            description: 'end date/time for search in FileMan format'
        }
    }
};

var apiDocs = {
    closest: {
        spec: {
            summary: 'Get the observation date/time and reading of the record closest to the date/time specified for the patient and vital type',
            notes: '',
            parameters: [
                rdk.docs.commonParams.pid,
                rdk.docs.swagger.paramTypes.query('ts', 'root date of where search will take place, used in conjunction with the flag parameter', 'string', true),
                rdk.docs.swagger.paramTypes.query('type', 'the vital type abbreviation', 'string', true),
                rdk.docs.swagger.paramTypes.query('flag', 'indicates if the search should look before or after the date/time specified in the GMVDT value where 1 indicates before, 2 indicates after and 0 inidicates either direction', 'string', true, ['1', '2'])
            ],
            responseMessages: []
        }
    },
    qualifiers: {
        spec: {
            summary: 'Get qualifier information for selected vital types',
            notes: 'Returns all qualifier information for the vital types selected. If no types are selected, then all qualifiers are returned.',
            parameters: [
                rdk.docs.swagger.paramTypes.query('param', 'a comma delimited list of vital abbreviations; example: types=WT,HT,T for weight, height, temperature. Leaving this parameter off will return all vital qualifiers', 'string', true)
            ],
            responseMessages: []
        }
    },
    all: {
        spec: {
            summary: 'List all vitals/measurements data for a given date/time span',
            notes: '',
            parameters: [
                rdk.docs.commonParams.pid,
                rdk.docs.swagger.paramTypes.query('date.start', 'start date/time for search in FileMan format', 'string', true),
                rdk.docs.swagger.paramTypes.query('date.end', 'end date/time for search in FileMan format', 'string', true)
            ],
            responseMessages: []
        }
    }
};

function getResourceConfig() {
    return [{
        name: 'closest-reading',
        path: '/closest',
        get: getClosestVital,
        parameters: closestParams,
        apiDocs: apiDocs.closest,
        description: {
            get: 'Returns the observation date/time and reading of the record closest to the date/time specified for the patient and vital type'
        },
        interceptors: {
            synchronize: true,
            convertPid: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }, {
        name: 'qualifier-information',
        path: '/qualifiers',
        get: getQualifierInformation,
        parameters: qualifiersParams,
        apiDocs: apiDocs.qualifiers,
        description: {
            get: 'Returns all qualifier information for the vital types selected. If no types are selected, then all qualifiers are returned.'
        },
        interceptors: {
            pep: false
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        }
    }, {
        name: 'all-vitals',
        path: '/all',
        get: getAllVitals,
        parameters: allParams,
        apiDocs: apiDocs.all,
        description: {
            get: 'Lists all vitals/measurements data for a given date/time span'
        },
        interceptors: {
            synchronize: true,
            convertPid: true
        },
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: []
    }, {
        name: 'vitalsRule',
        path: '/vitals-rule',
        get: execVitalsRule,
        parameters: vitalsRuleParams,
        interceptors: {
            pep: false
        }
    }];
}

function execVitalsRule(req, res) {
    if (!req.param('pid')) {
        res.status(rdk.httpstatus.not_found).rdkSend('Missing param: pid');
        return;
    }
    if (!req.param('weight') && !req.param('height')) {
        res.status(rdk.httpstatus.not_found).rdkSend('Missing param: weight and/or height');
        return;
    }
    
    var weight = req.param('weight');
    var height = req.param('height');
    var pid = req.param('pid');
    var config = {
        timeoutMillis: 50000,
        protocol: 'http',
        logger: req.logger,
        options: {
            host: '10.2.2.49',
            port: 8080,
            path: '/cds-results-service/cds/invokeRules',
            method: 'POST'
        }
    };
    var content = {
        context: {
            location: {
                codeSystem: null,
                entityType: 'Location',
                id: 'Location1',
                name: 'Test Location',
                type: null
            },
            specialty: null,
            subject: {
                codeSystem: null,
                entityType: 'Subject',
                id: pid,
                name: 'TestSubject',
                type: null
            },
            user: {
                codeSystem: null,
                entityType: 'User',
                id: 'Id1',
                name: 'Tester',
                type: null
            }
        },
        parameters: {
            Weight: {
                resourceType: 'Observation',
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '29463-7'
               }
            ]
                },
                valueQuantity: {
                    value: weight,
                    code: 'inches'
                },
                comments: 'Comment',
                issued: '2015-06-11T12:52:19.739-07:00',
                status: 'preliminary'
            },
            Height: {
                resourceType: 'Observation',
                code: {
                    coding: [
                        {
                            system: 'http://loinc.org',
                            code: '8302-2'
               }
            ]
                },
                valueQuantity: {
                    value: height
                },
                comments: 'Comment',
                status: 'preliminary'
            }
        },
        target: {
            intentsSet: [
         'VitalsValidation'
      ],
            mode: 'Normal',
            perceivedExecutionTime: null,
            supplementalMappings: null,
            type: 'Direct'
        }
    };
    httpUtil.post(content, req.app.config, config, function (error, result) {
        if (error) {
            res.status(rdk.httpstatus.internal_server_error).rdkSend(error);
            return;
        }
        res.status(rdk.httpstatus.ok).rdkSend({
            data: result
        });
    });
}

/**
 *  Returns the observation date/time and reading of the record closest to the
 *  date/time specified for the patient and vital type. Uses the site id that is
 *  stored in the user session.
 *
 *  REST params:
 *    pid ; patient ID
 *    dfn : the patient IEN
 *    ts : (optional) root date of where search will take place, used in
 *        conjunction with the flag parameter
 *    type : The vital type abbreviation
 *    flag : (optional) indicates if the search should look before or after the
 *        date/time specified in the GMVDT value where 1 indicates before, 2
 *        indicates after and 0 inidicates either direction
 */
function getClosestVital(req, res) {
    req.logger.info('vital resource closest reading GET called');

    var dfn = req.interceptorResults.patientIdentifiers.dfn,
        ts = req.param('ts'),
        type = req.param('type'),
        flag = req.param('flag');

    if (typeof ts === 'undefined') {
        ts = '';
    }
    if (typeof flag === 'undefined') {
        flag = '';
    }

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV CLOSEST READING', [dfn, ts, type, flag], function (error, message) {
        if (!error) {
            message = message.split('^');
            var response = {
                'dfn': dfn,
                'type': type,
                'vistaTsObserved': message[0],
                'vprTsObserved': filemanDateUtil.getVprDateTime(message[0]),
                'reading': message[1]
            };

            res.rdkSend((response));
            return;
        } else {
            res.status(rdk.httpstatus.bad_gateway).rdkSend('RPC error: ' + error);
            return;
        }
    });
}

/**
 *  Lists all vitals/measurements data for a given date/time span.
 *  Uses the site id that is stored in the user session.
 *
 *  REST params:
 *    pid ; patient ID
 *    dfn : the patient IEN
 *    start : start date/time for search in FileMan format
 *    end : end date/time for search in FileMan format
 */
function getAllVitals(req, res) {
    req.logger.info('vital resource all vitals GET called');

    var dfn = req.interceptorResults.patientIdentifiers.dfn,
        start = req.param('date.start'),
        end = req.param('date.end');

    if (typeof dfn === 'undefined' ||
        typeof start === 'undefined' ||
        typeof end === 'undefined') {
        res.status(rdk.httpstatus.bad_request).rdkSend('Missing parameters.  Please include a pid, start, and end parameter.');
    }

    var rpcParam = [dfn, start, end].join('^');

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV V/M ALLDATA', [rpcParam], function (error, message) {
        if (!error) {
            VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV VITALS/CAT/QUAL', [''], function (err, msg) {
                if (err) {
                    res.status(rdk.httpstatus.bad_gateway).rdkSend('RPC error: ' + error);
                    return;
                }
                var qualifiersArray = formatQualifierInformationOutput(msg);
                var json = formatAllVitalsResponse(message, qualifiersArray);
                res.rdkSend(json);
                return;
            });
        }

        res.status(rdk.httpstatus.bad_gateway).rdkSend('RPC error: ' + error);
    });
}

function formatAllVitalsResponse(message, qualifiersArray) {
    var response = {};

    var lines = message.split('\r\n');

    response.meta = lines.splice(0, 4);
    response.readings = lines.splice(0, lines.length - 1);

    response.meta = formatAllVitalsMeta(response.meta);
    response.readings = formatAllVitalsReadings(response.readings, qualifiersArray);

    return response;
}

function formatAllVitalsMeta(meta) {
    var json = {};

    var metadata = meta[0].split('  ');
    json.name = metadata[0];
    json.ssn4 = metadata[1];
    json.dob = metadata[2];
    json.age = metadata[3];
    json.gender = metadata[4];

    metadata = meta[1].split('   ');
    json.unit = metadata[0].split(':')[1].substr(1);
    json.room = metadata[1].split(':')[1].substr(1);

    json.division = meta[2].split(':')[1].substr(1);

    metadata = meta[3].split(' - ');
    json.dates = {
        'start': metadata[0],
        'end': metadata[1]
    };

    return json;
}

function formatAllVitalsReadings(readings, qualifiersArray) {
    var VITAL_MAP = [{
        'label': 'readingDate',
        'qualified': false
    }, {
        'label': 'readingTime',
        'qualified': false
    }, {
        'label': 'T'
    }, {
        'label': 'P'
    }, {
        'label': 'R'
    }, {
        'label': 'PO2',
        'poFlag': true
    }, {
        'label': 'BP',
        'abnormal': [
            'abnormalSystolicHighValue',
            'abnormalDiastolicHighValue',
            'abnormalSystolicLowValue',
            'abnormalDiastolicLowValue'
        ]
    }, {
        'label': 'WT'
    }, {
        'label': 'WTkg',
        'qualified': false
    }, {
        'label': 'BMI',
        'qualified': false
    }, {
        'label': 'HT'
    }, {
        'label': 'HTcm',
        'qualified': false
    }, {
        'label': 'CG'
    }, {
        'label': 'CGcm',
        'qualified': false
    }, {
        'label': 'CVP'
    }, {
        'label': 'CVPmmhg',
        'qualified': false
    }, {
        'label': 'inputValue',
        'qualified': false
    }, {
        'label': 'outputValue',
        'qualified': false
    }, {
        'label': 'PAIN'
    }, {
        'label': 'null1',
        'omitted': true
    }, {
        'label': 'null2',
        'omitted': true
    }, {
        'label': 'location',
        'qualified': false
    }, {
        'label': 'recorder',
        'qualified': false
    }, {
        'label': 'db',
        'qualified': false
    }];

    var readingsJson = {
        'data': {
            'items': []
        }
    };

    var qualifiersMap = {};
    for (var qIndex = 0; qIndex < qualifiersArray.items.length; qIndex++) {
        qualifiersMap[qualifiersArray.items[qIndex].abbreviation] = qualifiersArray.items[qIndex];
    }
    // qualifiers = qualifiersMap;

    for (var i = 0; i < readings.length; i++) {
        var raw = readings[i].split('^');
        var readingData = {};

        for (var j = 0; j < raw.length; j++) {
            if (typeof VITAL_MAP[j].omitted === 'undefined' || VITAL_MAP[j].omitted === false) {
                if (raw[j].length > 0) {
                    readingData[VITAL_MAP[j].label] = //raw[j];
                        formatReadingWithQualifiers(raw[j], VITAL_MAP[j], qualifiersMap);
                }
            }
        }

        readingsJson.data.items.push(readingData);
    }

    return readingsJson;
}

function formatReadingWithQualifiers(rawReading, map, qualifiersMap) {
    var readingJson = {
        'qualifiers': {
            'items': []
        }
    };

    if (typeof map.qualified !== 'undefined' && map.qualified === false) {
        readingJson.reading = rawReading;
        return readingJson;
    }

    if (rawReading === '') {
        readingJson.reading = rawReading;
        return readingJson;
    }

    var values = rawReading.split('- ');
    if (values[0].slice(-1) === '*') {
        if (typeof map.abnormal === 'undefined') {
            readingJson.abnormal = {
                'low': qualifiersMap[map.label].abnormalLowValue,
                'high': qualifiersMap[map.label].abnormalHighValue
            };
        } else {
            readingJson.abnormal = {};
            for (var i = 0; i < map.abnormal.length; i++) {
                readingJson.abnormal[map.abnormal[i]] = qualifiersMap[map.label][map.abnormal[i]];
            }
        }
        values[0] = values[0].slice(0, -1);
    } else {
        readingJson.abnormal = false;
    }
    readingJson.reading = values[0];

    if (typeof values[1] === 'undefined' || typeof values[1].length === 'undefined' || values[1].length === 0) {
        return readingJson;
    }

    if (typeof map.poFlag !== 'undefined' && map.poFlag === true) {
        var poQualifierData = values[1].split('-'),
            poQualifier = {},
            qualified = false;

        if (poQualifierData[0].length > 0) {
            poQualifier.method = translateQualifier(poQualifierData[0], map, qualifiersMap).value;
            qualified = true;
        }
        if (poQualifierData[1].length > 0) {
            poQualifier.flowRate = poQualifierData[1];
            qualified = true;
        }
        if (poQualifierData[2].length > 0) {
            poQualifier.concentration = poQualifierData[2];
            qualified = true;
        }

        if (qualified === true) {
            readingJson.qualifiers.items.push(poQualifier);
        }
        return readingJson;
    } else {
        var qualifierData = values[1].split(' ');
        for (var j = 0; j < qualifierData.length; j++) {
            var translation = translateQualifier(qualifierData[j], map, qualifiersMap);
            var qualifier = {};
            qualifier[translation.name] = translation.value;
            readingJson.qualifiers.items.push(qualifier);
        }
        return readingJson;
    }
}

function translateQualifier(qualifier, map, qualifiersMap) {
    var qualifierIndex = qualifiersMap[map.label];

    for (var i = 0; i < qualifierIndex.categories.length; i++) {
        for (var j = 0; j < qualifierIndex.categories[i].qualifiers.length; j++) {
            if (qualifier === qualifierIndex.categories[i].qualifiers[j].synonym) {
                return {
                    'name': qualifierIndex.categories[i].name,
                    'value': qualifierIndex.categories[i].qualifiers[j].name
                };
            }
        }
    }
}

/**
 *  Returns all qualifier information for the vital types selected. If no types
 *  are selected, then all qualifiers are returned. Uses the site id that is
 *  stored in the user session.
 *
 *  REST params:
 *    param (optional) : a comma delimited list of vital abbreviations;
 *        example: types=WT,HT,T for weight, height, temperature. Leaving this
 *        parameter off will return all vital qualifiers
 */
function getQualifierInformation(req, res) {
    req.logger.info('vital resource qualifier information GET called');
    var types = req.query.types;
    var jsonTypes;

    if (types === undefined) {
        jsonTypes = [];
    } else {
        types = types.replace(/(^,)|(,$)/g, '');
        jsonTypes = types.split(',');
    }

    var rpcParametersArray = paramUtil.convertArrayToRPCParameters(jsonTypes);

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV VITALS/CAT/QUAL', rpcParametersArray, function (error, message) {
        if (!error) {
            var response = formatQualifierInformationOutput(message);
            res.rdkSend(response);
            return;
        } else {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('RPC error: ' + error);
            return;
        }
    });
}

function formatQualifierInformationOutput(messageElements) {
    messageElements = messageElements.split('\r\n');
    var currentVital;
    var currentCategory;
    var currentQualifier;
    var response = {
        items: []
    };

    messageElements.forEach(function (element) {
        element = element.split('^');

        if (element[0] === 'V') {
            currentVital = {};

            if (element.length >= 5) {
                currentVital.type = element[2];
                currentVital.fileIEN = element[1];
                currentVital.abbreviation = element[3];
                currentVital.pceAbbreviation = element[4];

                if (currentVital.type === 'BLOOD PRESSURE' && element.length >= 9) {
                    currentVital.abnormalSystolicHighValue = element[5];
                    currentVital.abnormalDiastolicHighValue = element[6];
                    currentVital.abnormalSystolicLowValue = element[7];
                    currentVital.abnormalDiastolicLowValue = element[8];
                } else if ((currentVital.type === 'TEMPERATURE' ||
                        currentVital.type === 'RESPIRATION' ||
                        currentVital.type === 'PULSE' ||
                        currentVital.type === 'CENTRAL VENOUS PRESSURE') && element.length >= 7) {
                    currentVital.abnormalHighValue = element[5];
                    currentVital.abnormalLowValue = element[6];

                    if (currentVital.type === 'CENTRAL VENOUS PRESSURE' && element.length >= 8) {
                        currentVital.abnormalO2Saturation = element[7];
                    }
                }
            }

            response.items.push(currentVital);
            currentCategory = undefined;
            currentQualifier = undefined;
        } else if (typeof element[0] !== 'undefined' && element[0] === 'C') {
            if (typeof currentVital.categories === 'undefined') {
                currentVital.categories = [];
            }

            currentCategory = {};

            if (element.length >= 3) {
                currentCategory.fileIEN = element[1];
                currentCategory.name = element[2];
            }

            currentVital.categories.push(currentCategory);
        } else if (typeof element[0] !== 'undefined' && element[0] === 'Q') {
            if (typeof currentVital.categories === 'undefined') {
                currentVital.categories = [];
                currentCategory = {};
                currentVital.categories.push(currentCategory);
            }

            if (typeof currentCategory.qualifiers === 'undefined') {
                currentCategory.qualifiers = [];
            }

            currentQualifier = {};

            if (element.length >= 4) {
                currentQualifier.fileIEN = element[1];
                currentQualifier.name = element[2];
                currentQualifier.synonym = element[3];
            }

            currentCategory.qualifiers.push(currentQualifier);
        }
    });

    return response;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.getClosestVital = getClosestVital;
module.exports.getQualifierInformation = getQualifierInformation;
module.exports.getAllVitals = getAllVitals;
module.exports.formatQualifierInformationOutput = formatQualifierInformationOutput;

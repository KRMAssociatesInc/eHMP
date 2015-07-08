/*jslint node: true*/
'use strict';

var async = require('async');
var filemanDateUtil = require('../../utils/filemanDateUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var mathjs = require('mathjs');
var nullChecker = require('../../utils/nullchecker/nullchecker');
var paramUtil = require('../../utils/paramUtil');
var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var format = require('util').format;

var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var errorMessage = 'There was an error processing your request. The error has been logged.';

var params = {
    post: {
        dfn: {
            required: true,
            description: 'the patient IEN'
        },
        duz: {
            required: true,
            description: 'the user duz (IEN) adding a new vital'
        },
        locIEN: {
            required: true,
            description: 'the location (visit) IEN'
        },
        vitals: {
            required: true,
            description: 'an array of vital objects',
            vital: {
                fileIEN: {
                    required: true,
                    description: 'a required variable of a vital object; the vital IEN'
                },
                reading: {
                    required: true,
                    description: 'a required variable of a vital object; the vital reading value'
                },
                flowRate: {
                    required: false,
                    description: 'an optional variable of the vital object; the Pulse Oximetry flow rate integer value as a string'
                },
                o2Concentration: {
                    required: false,
                    description: 'an optional variable of the vital object; the Pulse Oximetry percentage value represented as an integer as a string, i.e. 90 for 90%'
                },
                unit: {
                    required: false,
                    description: 'valid units are "C" for Celsius, "cm" for centimeters, "kg" for kilogram, "mmHG" for millimeter of mercury, this unit value can be blank for default values'
                },
                qualifiers: {
                    required: false,
                    description: 'an array of qualifiers IENs'
                }
            }
        }
    }
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        post: writeBackVitals,
        parameters: params,
        description: {
            post: 'Adds vitals to a patient'
        },

        interceptors: {
            audit: true,
            metrics: true,
            authentication: true,
            pep: true,
            operationalDataCheck: true,
            synchronize: true,
            jdsFiler: true
        },
        healthcheck: {
            dependencies: ['jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: ['add-patient-vital']
    }];
}

/**
 *  Performs the vitals write back to VistA. The post req expects a param variable with a JSON object
 *  in the format below. Uses the site id that is stored in the user session.
 *
 *  param = {
 *      dateTime: 'YYYYMMDD HHmm'
 *      dfn: 'dfn',
 *      duz: 'duz',
 *      locIEN: 'location',
 *      vitals: [{
 *          fileIEN: 'fileIEN',
 *          reading: 'reading',
 *          flowRate: 'flowRate', //integer as string
 *          o2Concentration: 'o2Concentration', //percentage represented as integer as string, i.e. 90 for 90%
 *          unit: 'C' || 'cm' || 'kg' || 'mmHG' || <blank>,
 *          qualifiers: ['qualifierIEN1', 'qualifierIEN2', ...]
 *      }
 *  }
 *
 *
 *  {
    "param" :
    {
        "dateTime": "20150502",
        "dfn":"3", "duz"
    :
        "10000000224", "locIEN"
    :
        "67", "vitals"
    :
        [{"fileIEN": "1", "reading": "80/20", "qualifiers": ["23", "59", "100"]}, {
            "fileIEN": "3",
            "reading": "57",
            "qualifiers": ["47", "50"]
        }]
    }
}
 */
function writeBackVitals(req, res) {
    req.logger.info('perform vitals write back');

    var userSession;
    var originatorIEN;
    var site;

    try {
        userSession = req.session.user;
        site = userSession.site;
        originatorIEN = userSession.duz[site];
    } catch (e) {
        res.status(rdk.httpstatus.internal_server_error).send('Required authentication data is not present in request.');
        return;
    }

    var input = req.body.param;
    var checkedInput = verifyInput(input);
    if (!checkedInput.valid) {
        req.logger.error(checkedInput.errMsg);
        res.status(rdk.httpstatus.internal_server_error).send(checkedInput.errMsg);
        return;
    }

    req.logger.debug(format('passed in parameters are: %j', input));

    var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(input.dateTime);
    var eventFilemanYear = filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));
    if (eventFilemanYear === -1) {
        var errorMessage = 'DateTime is not a valid date: ' + input.dateTime;
        req.logger.error(errorMessage);
        res.status(rdk.httpstatus.internal_server_error).send(errorMessage);
        return;
    }

    var currentTime = eventFilemanYear + '.' + eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
    var vitals = [];
    input.vitals.forEach(function(element) {
        var rpcArray = [];
        rpcArray.push(currentTime, input.dfn);

        var vitalRPCDelimitedStr = '';
        vitalRPCDelimitedStr += element.fileIEN + ';';

        var reading = element.reading;

        if (nullChecker.isNotNullish(element.unit)) {
            if (element.unit.toUpperCase() === 'C') {
                reading = paramUtil.celsiusToFahrenheit(reading);
            }

            if (element.unit.toUpperCase() === 'CM') {
                var cmUnit = mathjs.unit(parseFloat(reading), 'cm');
                reading = cmUnit.toNumber('inch');
            }

            if (element.unit.toUpperCase() === 'KG') {
                var kgUnit = mathjs.unit(parseFloat(reading), 'kg');
                reading = kgUnit.toNumber('lb');
            }

            if (element.unit.toUpperCase() === 'MMHG') {
                reading = paramUtil.mmHGToCmH2O(reading);
            }
        }

        var flowRate = '';

        if (nullChecker.isNotNullish(element.flowRate)) {
            flowRate = element.flowRate + ' l/min';
        }

        var o2Concentration = '';

        if (nullChecker.isNotNullish(element.o2Concentration)) {
            if (nullChecker.isNotNullish(flowRate)) {
                o2Concentration = ' ' + element.o2Concentration + '%';
            } else {
                o2Concentration = element.o2Concentration + '%';
            }
        }

        vitalRPCDelimitedStr += reading + ';' + flowRate + o2Concentration;
        rpcArray.push(vitalRPCDelimitedStr);
        rpcArray.push(input.locIEN);

        //var qualifiersRPCDelimitedStr = input.duz + '*';
        var qualifiersRPCDelimitedStr = originatorIEN + '*';
        qualifiersRPCDelimitedStr += paramUtil.convertArrayToRPCParameters(element.qualifiers, ':');
        rpcArray.push(qualifiersRPCDelimitedStr);
        vitals.push(rpcArray);
    });

    async.each(vitals,
        function(vital, callback) {
            var rpcDelimitedStr = paramUtil.convertArrayToRPCParameters(vital);
            req.logger.debug(format('adding vital: %j', vital));
            req.logger.debug(format('rcpDelimitedStr: %j', rpcDelimitedStr));


            VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV ADD VM', rpcDelimitedStr, function(error, result) {
                req.logger.info('Writeback result: ' + result);
                callback(error);
            });
        },
        function(error) {
            if (error) {
                req.logger.error(errorVistaJSCallback + error);
                res.status(rdk.httpstatus.internal_server_error).send(errorMessage);
            } else {
                req.logger.info('Successfully wrote back to VistA.');
                res.status(rdk.httpstatus.ok).send(new paramUtil.returnObject([]));
            }
        });
}

/**
 *  Verifies the JSON object passed from the front-end to ensure that all necessary data
 *  is complete.
 */
function verifyInput(input) {
    var retObj = {
        'valid': true,
        'errMsg' : ''
    };

    if (nullChecker.isNullish(input.dateTime)) {
        retObj.errMsg += 'The patient dateTime is required.\n';
        retObj.valid = false;
    }

    if (nullChecker.isNullish(input.dfn)) {
        retObj.errMsg += 'The patient dfn (localId) is required.\n';
        retObj.valid = false;
    }

    if (nullChecker.isNullish(input.duz)) {
        retObj.errMsg += 'The duz is required.\n';
        retObj.valid = false;
    }

    if (nullChecker.isNullish(input.locIEN)) {
        retObj.errMsg += 'The location is required.\n';
        retObj.valid = false;
    }
    if (nullChecker.isNullish(input.vitals)) {
        retObj.errMsg += 'vitals is required.\n';
        retObj.valid = false;
    } else {
        input.vitals.forEach(function(element, index) {
            if (nullChecker.isNullish(element.fileIEN)) {
                retObj.errMsg += 'The vital IEN is required for vital in index ' + index + '.\n';
                retObj.valid = false;
            }

            if (nullChecker.isNullish(element.reading)) {
                retObj.errMsg += 'The vital reading is required for vital in index ' + index + '.\n';
                retObj.valid = false;
            }
        });
    }

    return retObj;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.writeBackVitals = writeBackVitals;
module.exports.verifyInput = verifyInput;




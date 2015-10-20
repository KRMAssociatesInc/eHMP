'use strict';

var async = require('async');
var mathjs = require('mathjs');
var format = require('util').format;
var VistaJS = require('../core/VistaJS');
var _ = require('underscore');
var filemanDateUtil = require('../../utils/fileman-date-converter');
var nullChecker = require('../../utils/nullchecker');
var paramUtil = require('../../utils/param-converter');

function getVitals(model) {
    var vitals = [];
    var currentTime = currentTimeRpc(model.dateTime);

    model.vitals.forEach(function(vital) {
        var rpcArray = [];
        rpcArray.push(currentTime, model.dfn);

        var vitalRPCDelimitedStr = vital.fileIEN + ';';

        var reading = vital.reading;

        if (nullChecker.isNotNullish(vital.unit)) {
            if (vital.unit.toUpperCase() === 'C') {
                reading = paramUtil.celsiusToFahrenheit(reading);
            }

            if (vital.unit.toUpperCase() === 'CM') {
                var cmUnit = mathjs.unit(parseFloat(reading), 'cm');
                reading = cmUnit.toNumber('inch');
            }

            if (vital.unit.toUpperCase() === 'KG') {
                var kgUnit = mathjs.unit(parseFloat(reading), 'kg');
                reading = kgUnit.toNumber('lb');
            }

            if (vital.unit.toUpperCase() === 'MMHG') {
                reading = paramUtil.mmHGToCmH2O(reading);
            }
        }

        var flowRate = '';

        if (nullChecker.isNotNullish(vital.flowRate)) {
            flowRate = vital.flowRate + ' l/min';
        }

        var o2Concentration = '';

        if (nullChecker.isNotNullish(vital.o2Concentration)) {
            if (nullChecker.isNotNullish(flowRate)) {
                o2Concentration = ' ' + vital.o2Concentration + '%';
            } else {
                o2Concentration = vital.o2Concentration + '%';
            }
        }

        vitalRPCDelimitedStr += reading + ';' + flowRate + o2Concentration;
        rpcArray.push(vitalRPCDelimitedStr);
        rpcArray.push(model.locIEN);

        var qualifiersRPCDelimitedStr = model.enterdByIEN + '*';
        qualifiersRPCDelimitedStr += paramUtil.convertArrayToRPCParameters(vital.qualifiers, ':');
        rpcArray.push(qualifiersRPCDelimitedStr);
        vitals.push(rpcArray);
    });

    return vitals;
}

function convertVitalToRpcString(vital) {
    return paramUtil.convertArrayToRPCParameters(vital);
}

function currentTimeRpc(dateTime) {
    var eventDateTimeMoment = paramUtil.convertWriteBackInputDate(dateTime);
    var eventFilemanYear = filemanDateUtil.getFilemanDateWithArgAsStr(eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_DATE_FORMAT));
    var currentTime = eventFilemanYear + '.' + eventDateTimeMoment.format(paramUtil.WRITEBACK_INPUT_TIME_FORMAT);
    return currentTime;
}

function adjustContextForSuccess(writebackContext, results) {
    writebackContext.vprResponse = {items: results};
    writebackContext.vprModel = results;
}

function adjustContextForPartialSuccess(writebackContext, results) {
    writebackContext.vprResponse = {data: 'not all of the vitals were added'};
    writebackContext.vprResponseStatus = 202; // accepted
    writebackContext.vprModel = results;
}

function adjustContextForFailure(writebackContext) {
    writebackContext.vprModel = null;
}

function create (writebackContext, passedInCallback) {
    var logger = writebackContext.logger;
    var model = writebackContext.model;
    var vistaConfig = writebackContext.vistaConfig;
    var vitals = getVitals(model);

    logger.debug({vitalsVistaWriterModel: model});

    var addedAtLeastOne = false;

    async.map(vitals,
        function(vital, callback) {
            var rpcDelimitedStr = convertVitalToRpcString(vital);
            logger.debug({vital: vital});
            logger.debug({rpcDelimitedStr: rpcDelimitedStr});

            var params =  [];
            params[0] = 0;
            params[1] =  model.dfn;
            params[2] = rpcDelimitedStr;

            VistaJS.callRpc(logger, vistaConfig, 'HMP WRITEBACK VITALS', params, function(err, result) {
                if(err) {
                    logger.error({vitals: {error: err}});
                    return callback(err);
                }

                addedAtLeastOne = true;

                logger.debug({vitals: {'writeback result': result}});
                callback(null, result);

            });
        }, function(err, results) {
            logger.debug({vitals: 'asnyc.map complete'});
            if(err) {
                if (!addedAtLeastOne) {
                    logger.error({vitals: {error: err}});
                    adjustContextForFailure(writebackContext);
                    return passedInCallback(err);
                }

                logger.warn({vitals: {'partial error': err}});
                adjustContextForPartialSuccess(writebackContext, results);
                return passedInCallback(null);
            }

            logger.debug({vitals: {'success': results}});
            adjustContextForSuccess(writebackContext, results);
            return passedInCallback(null);
        }
    );
}

module.exports.create = create;
module.exports._getVitals = getVitals;
module.exports._convertVitalToRpcString = convertVitalToRpcString;
module.exports._currentTimeRpc = currentTimeRpc;
module.exports._adjustContextForSuccess = adjustContextForSuccess;
module.exports._adjustContextForPartialSuccess = adjustContextForPartialSuccess;
module.exports._adjustContextForFailure = adjustContextForFailure;




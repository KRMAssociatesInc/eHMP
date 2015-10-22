/*
 TODO: Using ORWDXA DC until RPC wrapper is in place
 */
'use strict';

var async = require('async');
var fhirUtils = require('../../../fhir/common/utils/fhir-converter');
var filemanDateUtil = require('../../../utils/fileman-date-converter');
var VistaJS = require('../../core/VistaJS');
var ordersUtils = require('./orders-utils');

module.exports = function(writebackContext, callback) {
    writebackContext.vistaConfig.context = 'OR CPRS GUI CHART';
    async.series([
        function sendDataToVista(callback) {
            var rpcName = 'ORWDXA DC';
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                getParameters(writebackContext.model),
                callback);
        }
    ], function(err, data) {
        if (err) {
            return callback(err, data);
        }
        var error = null;
        writebackContext.vprResponse = data;

        var vprOrder = {};
        vprOrder.kind = writebackContext.model.kind;
        vprOrder.pid = writebackContext.pid;
        var resultArray = ('' + data).split('^');
        vprOrder.localId = resultArray[0].substring(1, resultArray[0].indexOf(';'));
        vprOrder.uid = 'urn:va:order:' + vprOrder.pid.substring(0, vprOrder.pid.indexOf(';')) + ':' +
            vprOrder.pid.substring(vprOrder.pid.indexOf(';') + 1, vprOrder.pid.length) + ':' + vprOrder.localId;
        vprOrder.entered = filemanDateUtil.getVprDateTime(resultArray[2]);
        if (resultArray[3]) {
            if (isFinite(resultArray[3])) {
                vprOrder.start = filemanDateUtil.getVprDateTime(resultArray[3]);
            }
        }
        if (resultArray[4]) {
            if (isFinite(resultArray[4])) {
                vprOrder.stop = filemanDateUtil.getVprDateTime(resultArray[4]);
            }
        }
        vprOrder.lastUpdateTime = fhirUtils.convertDateToHL7V2(new Date(), true);
        vprOrder.content = resultArray[23].substring(4, resultArray[23].length);
        vprOrder.summary = vprOrder.content;
        vprOrder.statusName = ordersUtils.getStatusName(parseInt(resultArray[5]));
        vprOrder.providerName = resultArray[10];
        vprOrder.locationName = resultArray[18].substring(0, resultArray[18].indexOf(':'));
        if (vprOrder.summary) {
            if (vprOrder.summary.indexOf('  ') === -1) {
                vprOrder.name = vprOrder.summary.substring(0, vprOrder.summary.indexOf(' '));
            }else {
                var subStr = vprOrder.summary.substring(0, vprOrder.summary.indexOf('  '));
                var subStrArray = subStr.split(' ');
                var name = '';
                for (var i = 0; i < subStrArray.length - 1; i++) {
                    name += subStrArray[i] + ' ';
                }
                vprOrder.name = name;
            }
        }
        writebackContext.vprModel = vprOrder;
        return callback(error);
    });
};

function getParameters(model) {
    var parameters = [];
    if (model && model.orderId && model.provider && model.location) {
        parameters.push(model.orderId);
        parameters.push(model.provider);
        parameters.push(model.location);
        parameters.push('0');
        parameters.push('0');
        parameters.push('0');
    }
    return parameters;
}

module.exports._getParameters = getParameters;

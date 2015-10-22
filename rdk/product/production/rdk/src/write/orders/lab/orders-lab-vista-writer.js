/*
    TODO: Using ORWDX SAVE until RPC wrapper is in place
 */
'use strict';

var async = require('async');
var fhirUtils = require('../../../fhir/common/utils/fhir-converter');
var filemanDateUtil = require('../../../utils/fileman-date-converter');
var VistaJS = require('../../core/VistaJS');
var ordersUtils = require('../common/orders-utils');

module.exports.create = function(writebackContext, callback) {
    saveOrder(writebackContext, callback);
};

module.exports.update = function(writebackContext, callback) {
    saveOrder(writebackContext, callback);
};

function saveOrder(writebackContext, callback) {
    writebackContext.vistaConfig.context = 'OR CPRS GUI CHART';
    async.series([
        function sendDataToVista(callback) {
            var rpcName = 'ORWDX SAVE';
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
        writebackContext.vprResponse = JSON.stringify(vprOrder);
        writebackContext.vprModel = vprOrder;
        return callback(error);
    });
}

function getParameters(model) {
    var parameters = [];
    if (model && model.dfn && model.provider && model.location && model.inputList) {
        parameters.push(model.dfn);
        parameters.push(model.provider);
        parameters.push(model.location);
        parameters.push(model.orderDialog);
        parameters.push(model.displayGroup);
        parameters.push(model.quickOrderDialog);
        if (model.orderId) {
            parameters.push(model.orderId);
        } else {
            parameters.push('');
        }
        var inputList = {};
        for (var i in model.inputList) {
            inputList[model.inputList[i].inputKey + ',1'] = model.inputList[i].inputValue; //TODO instance
        }
        if (model.commentList) {
            var wpInstance = '15,1'; //TODO instance
            inputList[wpInstance] = 'ORDIALOG("WP",' + wpInstance + ')';
            for (i= 1; i <= model.commentList.length; i++) {
                inputList['"WP",' + wpInstance + ',' + i + ',0'] = model.commentList[i -1].comment;
            }
        }
        if (model.orderCheckList) {
            inputList['"ORCHECK"'] = '' + model.orderCheckList.length;
            for (var j in model.orderCheckList) {
                var orderCheck = model.orderCheckList[j].orderCheck.split('^');
                var index = j + 1;
                inputList['"ORCHECK","' + orderCheck[0] + '","' + orderCheck[2] + '","' + index + '"'] =
                    model.orderCheckList[j].orderCheck.substring(orderCheck[0].length + 1, model.orderCheckList[j].length);
            }
        } else {
            inputList['"ORCHECK"'] = '0';
        }
        inputList['"ORTS"'] = '0';
        parameters.push(inputList);
        parameters.push('');
        parameters.push('');
        parameters.push('');
        parameters.push('0');
    }
    return parameters;
}

module.exports._getParameters = getParameters;

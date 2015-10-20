/*
 TODO: Using ORWDX LOADRSP until RPC wrapper is in place
 */
'use strict';

var async = require('async');
var VistaJS = require('../../core/VistaJS');
var ordersUtils = require('../common/orders-utils');

module.exports = function(writebackContext, callback) {
    writebackContext.vistaConfig.context = 'OR CPRS GUI CHART';
    async.series([
        function sendDataToVista(callback) {
            var rpcName = 'ORWDX LOADRSP';
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                getParameters(writebackContext.resourceId),
                callback);
        }
    ], function(err, data) {
        if (err) {
            return callback(err, data);
        }
        var error = null;

        if (data) {
            var results = ('' + data).split('~');
            if (results && results.length > 1) {
                var items = [];
                for (var i = 1; i < results.length; i++) {
                    var result = results[i].split('^');
                    if (result && result.length === 3) {
                        var selection = {};
                        selection.keyId = result[0];
                        var resultValues = result[2].split('\r\n');
                        selection.keyName = resultValues[0];
                        if (result[0] === '6') {
                            var startDate = resultValues[1].substring(1, resultValues[1].length);
                            if (!startDate || (startDate && isNaN(startDate.charAt(0)))) {
                                selection.valueId = resultValues[1].substring(1, resultValues[1].length);
                                selection.valueName = resultValues[2].substring(1, resultValues[2].length);
                            } else {
                                selection.valueId = startDate;
                                selection.valueName = ordersUtils.convertFileManDateToString(startDate);
                            }
                        } else if (result[0] === '15') {
                            selection.valueId = '';
                            if (isFinite(results[i+1].charAt(0))) {
                                selection.valueName = '';
                            } else {
                                selection.valueName = '~' + results[i+1].replace('\r\nt', '\r\n') + '~' + results[i+2].replace('\r\nt', '\r\n');
                                i += 2;
                            }
                        } else {
                            selection.valueId = resultValues[1].substring(1, resultValues[1].length);
                            selection.valueName = resultValues[2].substring(1, resultValues[2].length);
                        }
                        items.push(selection);
                    }
                }
                var order = {};
                order.items = items;
                writebackContext.vprResponse = order;
            }
        }

        return callback(error);
    });
};

function getParameters(resourceId) {
    var parameters = [];
    if (resourceId) {
        parameters.push('X' + resourceId);
        parameters.push('0');
    }
    return parameters;
}

module.exports._getParameters = getParameters;

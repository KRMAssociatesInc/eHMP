/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var nullChecker = require('../../utils/nullchecker/nullchecker');
var utils = require('../../utils/paramUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var paramUtils = require('../../utils/paramUtil');
var VistaJSLibrary = require('../../VistaJS/VistaJSLibrary');
var _ = rdk.utils.underscore;

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

var formularyDescription = {
    get: 'Perform search based on parameters for drugs returning all matches along with formulary status'
};

var formularyParameters = {
    get: {
        search: {
            required: true,
            description: 'the medication string to search on (which should be formatted for search)'
        },
        count: {
            required: true,
            description: 'number of results to limit to for display'
        }
    }
};

function getResourceConfig() {
    return [{
        name: 'save',
        path: '/save',
        post: saveOpMedOrder,
                healthcheck: [

            function() {
                return true;
            }
        ],
        permissions: ['add-patient-order']
    }, {
        name: 'sign',
        path: '/sign',
        post: signOrder,
                healthcheck: [

            function() {
                return true;
            }
        ],
        permissions: ['add-patient-order']
    }, {
        name: 'formulary',
        path: '/formulary',
        get: getFormularyDrugs,
                healthcheck: [
            function() {
                return true;
            }
        ],
        parameters: formularyParameters,
        description: formularyDescription,
        permissions: ['add-patient-order']
    }];
}

function saveOpMedOrder(req, res, next) {
    req.logger.info('perform write back for outpatient medication resource');

    var input = req.body.param;

    var inputCheck,
        inMed,
        medArrayObj = {},
        rpcArray = [];

    // Check for required data
    inputCheck = verifyInput(input);

    if (!inputCheck.valid) {
        req.logger.error(inputCheck.errMsg);
        res.send(rdk.httpstatus.internal_server_error, inputCheck.errMsg);
        return;
    }

    rpcArray.push(input.ien, input.provider, input.location, input.orderDialog, input.displayGroup, input.quickOrderDialog, ''); //input.orderID ||

    inMed = input.ORDIALOG;

    // Med IEN is required.
    if (nullChecker.isNullish(inMed.medIEN)) {
        var errMsg = 'The medication IEN is required.';
        req.logger.error(errMsg);
        res.send(rdk.httpstatus.internal_server_error, errMsg);
        return;
    }

    medArrayObj['4,1'] = inMed.medIEN.toString();
    medArrayObj['136,1'] = inMed.strength.toString() || ''; //inMed.dose.toString() || '';
    medArrayObj['138,1'] = inMed.drugIEN.toString() || '';
    medArrayObj['386,1'] = inMed.doseString.toString() || '';
    medArrayObj['384,1'] = inMed.dose.toString() || '';
    medArrayObj['137,1'] = inMed.routeIEN.toString() || '';
    medArrayObj['170,1'] = inMed.schedule.toString() || '';
    medArrayObj['7,1'] = inMed.priority.toString() || '';
    medArrayObj['15,1'] = 'ORDIALOG(\"WP\",15,1)';
    medArrayObj['\"WP\",15,1,1,0'] = inMed.comment.toString() || '';
    medArrayObj['387,1'] = inMed.supply.toString() || '';
    medArrayObj['149,1'] = inMed.quantity.toString() || '';
    medArrayObj['150,1'] = inMed.refills.toString() || '';
    medArrayObj['148,1'] = inMed.pickup.toString() || '';
    medArrayObj['1358,1'] = 'ORDIALOG(\"WP\",1358,1)';
    medArrayObj['\"WP\",1358,1,1,0'] = '';
    medArrayObj['385,1'] = 'ORDIALOG(\"WP\",385,1)';
    medArrayObj['\"WP\",385,1,1,0'] = inMed.instructions.toString() || '';
    medArrayObj['\"ORCHECK\"'] = inMed.ORCHECK.toString() || '';
    medArrayObj['\"ORTS\"'] = inMed.ORTS.toString() || '';

    rpcArray.push(medArrayObj);

    req.logger.info('RPC call args: ' + rpcArray);
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX SAVE', rpcArray, function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully wrote back to VistA.');
            req.logger.info('Writeback result: ' + result);
            res.send(getNewOrderIEN(result));
            // input.orderIENObj = getNewOrderIEN(result);

            // Signing order immediately to reflect changes in JDS.
            // input.req = req;
            // input.res = res;
            // input.rpcStr = '^1^1^E';

            // signOrder(input);
        }
    });
}

function signOrder(req, res) {
    req.logger.info('perform sign outpatient medication order');

    var input = req.body.param;
    var argArr = [],
        orderObj = {};

    argArr.push(input.ien, input.provider, input.location, '');
    orderObj['1'] = input.orderIEN + '^1^1^E';
    argArr.push(orderObj);
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX SEND', argArr, function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully signed order: ' + result);
            res.send(input.orderIEN);
        }
    });
}

function getNewOrderIEN(input) {
    var splitOut, firstItem, orderIEN, success;
    //Even if we fail to parse out the new order IEN, we still had a success, so we should return success on save regardless
    success = {
        'success': true
    };
    if (nullChecker.isNullish(input)) {
        return success;
    }
    splitOut = input.split('^');
    firstItem = splitOut[0];
    orderIEN = (firstItem.split(';')[0]) ? new utils.returnObject(firstItem.replace('~', '')) : success;
    return orderIEN;
}

function verifyInput(input) {
    //The first checks are logical checks so that all orders should contain a patient, provider, etc.
    //The last 5 verification checks were added to match what CPRS messages.
    var retObj = {
        'valid': true,
        'errMsg': ''
    };
    var msg = '';
    if (nullChecker.isNullish(input.ien) || nullChecker.isNullish(input.provider) || nullChecker.isNullish(input.location) ||
        nullChecker.isNullish(input.orderDialog) || nullChecker.isNullish(input.displayGroup) || nullChecker.isNullish(input.ORDIALOG) ||
        nullChecker.isNullish(input.ORDIALOG.medIEN)) {
        msg += 'Required data is missing.\n';
    }
    if (nullChecker.isNullish(input.ORDIALOG.dose) || input.ORDIALOG.dose.match(/^\d+$/)) {
        msg += 'Dosage may not be numeric only.\n';
    }
    if (nullChecker.isNullish(input.ORDIALOG.routeIEN)) {
        msg += 'Route must be entered.\n';
    }
    if (nullChecker.isNullish(input.ORDIALOG.schedule)) {
        msg += 'Schedule must be entered.\n';
    }
    if (isNaN(parseInt(input.ORDIALOG.quantity)) || parseFloat(input.ORDIALOG.quantity) === 0) {
        msg += 'Unable to validate quantity.\n';
    }
    if (isNaN(parseInt(input.ORDIALOG.supply))) {
        msg += 'Days Supply is an invalid number.\n';
    }
    if (input.ORDIALOG.supply === '0') {
        msg += 'Days Supply may not be less than 1.\n';
    }
    if (msg.length > 0) {
        retObj.valid = false;
        retObj.errMsg = 'This order cannot be saved for the following reason(s):\n' + msg;
    }

    return retObj;
}

function getFormularyDrugs(req, res) {
    //expects two JSON formatted input params
    //search is the medication string to search on (which should be formatted for search)
    //count is the number of results to display
    //Is a wrapper for two distinct RPC calls
    //...first one returns an array of a single item with item index
    //...second calls list passing item index and end (index-1+count)
    var requestObj = {};

    try {
        requestObj = JSON.parse(req.param('param'));
    } catch (error) {
        req.logger.info('Error caught trying to parse the request into JSON.');
    }

    if (requestObj.search === undefined || requestObj.search === null) {
        res.send(rdk.httpstatus.internal_server_error, 'The was no \'search\' string in the request.');
    }

    if (requestObj.count === undefined || requestObj.count === null) {
        res.send(rdk.httpstatus.internal_server_error, 'The was no \'count\' parameter in the request.');
    }

    if (!paramUtils.isInt(parseFloat(requestObj.count))) {
        res.send(rdk.httpstatus.internal_server_error, 'The \'count\' parameter must be an integer.');
    }
    var count = parseInt(requestObj.count);

    requestObj.ien = null;

    //Get File IEN for subsequent calls
    //O RX = outpatient med
    //NV RX = nonva med
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWUL FV4DG', ['O RX'], function(error, result) {
        if (!error) {
            requestObj.ien = result.split('^')[0] || null;

            if (requestObj.ien === null) {
                return res.send(rdk.httpstatus.internal_server_error, 'Unable to retrieve outpatient file IEN.');
            }

            VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWUL FVIDX', [requestObj.ien, VistaJSLibrary.adjustForSearch(requestObj.search.toUpperCase())], function(error, result) {
                if (!error) {
                    // Build object from result
                    var resultItem, resultIEN, end;

                    resultItem = buildMedResultList(result);
                    try {
                        resultIEN = resultItem.data.items[0].IEN; //search returns exactly one result
                        try {
                            resultIEN = parseInt(resultIEN);
                            end = resultIEN - 1 + count;
                        } catch (error) {
                            req.logger.info('Incorrect formatting of result returned from RPC call');
                        }
                    } catch (error) {
                        req.logger.info('No search result returned from RPC call');
                    }
                    if (resultIEN !== null && resultIEN !== undefined) {
                        //get list to return
                        VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWUL FVSUB', [requestObj.ien, resultIEN, end], function(error, result) {
                            if (!error) {

                                // Build object from result
                                res.send(buildMedResultList(result));
                            } else {
                                res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
                            }
                        });
                    } else {
                        res.send(new paramUtils.returnObject([]));
                    }
                } else {
                    res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
                }
            });

        } else {
            res.send(rdk.httpstatus.internal_server_error, 'RPC returned with error:' + error);
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
            desc: elem[2] || '',
            formulary: element.indexOf(' NF', element.length - 3) === -1
        });

    });

    return new paramUtils.returnObject(medications);
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.verifyInput = verifyInput;

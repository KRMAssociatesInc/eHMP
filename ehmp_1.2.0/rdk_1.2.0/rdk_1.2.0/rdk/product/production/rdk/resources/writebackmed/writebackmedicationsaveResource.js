/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var _ = require('underscore');
var nullchecker = require('../../utils/nullchecker/nullchecker');
var paramUtil = require('../../utils/paramUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

function getResourceConfig() {
    return [{
        name: '',
        path: '/nonVA',
        post: performWriteBack,
        parameters: {
            post: {
                ien: {
                    required: true,
                    description: 'The patient file IEN'
                },
                provider: {
                    required: true,
                    description: 'New Person IEN'
                },
                location: {
                    required: true,
                    description: 'Hospital location IEN'
                },
                orderDialog: {
                    required: true,
                    description: 'Order dialog name field'
                },
                displayGroup: {
                    required: true,
                    description: 'Display group IEN'
                },
                ORDIALOG: {
                    required: true,
                    description: 'Response list'
                },
                quickOrderDialog: {
                    required: false,
                    description: ''
                },
                orderID: {
                    required: false,
                    description: ''
                }
            }
        },
        description: {
            post: 'Perform write back for Non-VA medication resource'
        },
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['jdsSync', 'authorization', 'jds', 'solr']
        },
        permissions: ['edit-patient-med']
    }, {
        name: 'discontinue',
        path: '/discontinue',
        put: discontinue,
        parameters: {
            put: {
                ien: {
                    required: true,
                    description: 'The patient file IEN'
                },
                locien: {
                    required: true,
                    description: 'The location file IEN'
                },
                orderien: {
                    required: true,
                    description: 'The order file IEN'
                },
                reason: {
                    required: true,
                    description: 'The reason for the discontinue'
                },
                isneword: {
                    required: false,
                    description: 'If 1, the order is new and has not been implemented and it is deleted, if 0 order is cancelled'
                }
            }
        },
        description: {
            put: 'Perform discontinue write back for Non-VA medication resource'
        },
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['jdsSync', 'authorization', 'jds', 'solr']
        },
        permissions: ['remove-patient-med']
    }];
}

function discontinue(req, res) {
    req.logger.info('perform discontinue write back for Non-VA medication resource GET called');
    var input = '';

    input = req.body.param;

    var inputCheck,
        rpcArray = [];

    inputCheck = verifyDiscontinueInput(input);
    if (!inputCheck.valid) {
        req.logger.error(inputCheck.errMsg);
        res.send(rdk.httpstatus.internal_server_error, inputCheck.errMsg);
        return;
    }

    input.dcorig = 0; //this is param that seems to have no value
    input.isneword = input.isneword || 0; //if 1, the order is new and has not been implemented and it is deleted, if 0 order is cancelled
    rpcArray.push(input.orderien, input.ien, input.locien, input.reason, input.dcorig, input.isneword);

    req.logger.info('RPC call args: ' + rpcArray);
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDXA DC', rpcArray, function(error, result) {
        if (error) {
            req.logger.info('Error wrote back to VistA.');
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully wrote back to VistA.');
            req.logger.info('Writeback result: ' + result);
            input.orderIENObj = getNewOrderIEN(result);

            // TODO: Signing order immediately to reflect changes in JDS.
            input.req = req;
            input.res = res;
            input.provider = input.ien;
            input.ien = input.localId;
            input.location = input.locien;

            input.rpcStr = '^2^0^E';

            signOrder(input);
        }
    });
}

function performWriteBack(req, res) {
    req.logger.info('perform write back for Non-VA medication resource called');

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

    rpcArray.push(input.ien, input.provider, input.location, input.orderDialog, input.displayGroup, input.quickOrderDialog, input.orderID || '');

    inMed = input.ORDIALOG;

    // Med IEN is required.
    if (nullchecker.isNullish(inMed.medIEN)) {
        var errMsg = 'The medication IEN is required.';
        req.logger.error(errMsg);
        res.send(rdk.httpstatus.internal_server_error, errMsg);
        return;
    }

    medArrayObj['4,1'] = inMed.medIEN.toString();
    medArrayObj['136,1'] = inMed.dose && inMed.dose.toString() || '';
    medArrayObj['138,1'] = inMed.doseIEN && inMed.doseIEN.toString() || '';
    medArrayObj['386,1'] = inMed.doseString && inMed.doseString.toString() || '';
    medArrayObj['384,1'] = inMed.strength && inMed.strength.toString() || '';
    medArrayObj['137,1'] = inMed.routeIEN && inMed.routeIEN.toString() || '';
    medArrayObj['170,1'] = inMed.schedule && inMed.schedule.toString() || '';
    medArrayObj['\"WP\",15,1,1,0'] = inMed.comment && inMed.comment.toString() || '';
    medArrayObj['\"WP\",385,1,1,0'] = inMed.instructions && inMed.instructions.toString() || '';
    medArrayObj['\"ORCHECK\"'] = inMed.ORCHECK && inMed.ORCHECK.toString() || '';
    medArrayObj['\"ORTS\"'] = inMed.ORTS && inMed.ORTS.toString() || '';

    // Defined comments
    _.each(inMed.definedComments, function(comment, index) {
        medArrayObj['\"WP\",1615,1,' + (index + 2) + ',0'] = comment.toString();
    });

    // Date
    if (!nullchecker.isNullish(inMed.date)) {
        medArrayObj['6,1'] = paramUtil.convertWriteBackInputDate(inMed.date).format('MMM DD,YYYY').toString();
    }

    // These are constant for all
    medArrayObj['0,1'] = '';
    medArrayObj['15,1'] = 'ORDIALOG(\"WP\",15,1)';
    medArrayObj['1615,1'] = 'ORDIALOG(\"WP\",1615,1)';
    medArrayObj['\"WP\",1615,1,1,0'] = '';
    medArrayObj['385,1'] = 'ORDIALOG(\"WP\",385,1)';

    rpcArray.push(medArrayObj);

    req.logger.info('RPC call args: ' + rpcArray);
    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX SAVE', rpcArray, function(error, result) {
        if (error) {

            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully wrote back to VistA.');
            req.logger.info('Writeback result: ' + result);
            input.orderIENObj = getNewOrderIEN(result);

            // TODO: Signing order immediately to reflect changes in JDS.
            input.req = req;
            input.res = res;
            input.rpcStr = '^3^1^E';

            signOrder(input);
        }
    });
}

function signOrder(input) {
    var argArr = [],
        orderObj = {},
        req = input.req,
        res = input.res;

    argArr.push(input.ien, input.provider, input.location, '');

    // TODO: Figure out if the last portion of this needs to be changed
    orderObj['1'] = input.orderIENObj.data.items + input.rpcStr;

    argArr.push(orderObj);

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORWDX SEND', argArr, function(error, result) {
        if (error) {

            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            req.logger.info('Successfully signed order: ' + result);
            res.send(input.orderIENObj);
        }
    });
}

function getNewOrderIEN(input) {
    var splitOut, firstItem, orderIEN, success;
    //Even if we fail to parse out the new order IEN, we still had a success, so we should return success on save regardless
    success = {
        'success': true
    };
    if (nullchecker.isNullish(input)) {
        return success;
    }
    splitOut = input.split('^');
    firstItem = splitOut[0];
    orderIEN = (firstItem) ? new paramUtil.returnObject(firstItem.replace('~', '')) : success;
    return orderIEN;
}

function verifyInput(input) {
    var retObj = {
        'valid': true
    };
    retObj.errMsg = '';
    if (nullchecker.isNullish(input.ien)) {
        retObj.errMsg += 'The patient file IEN is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.provider)) {
        retObj.errMsg += 'The provider is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.location)) {
        retObj.errMsg += 'The location is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.orderDialog)) {
        retObj.errMsg += 'The order dialog is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.displayGroup)) {
        retObj.errMsg += 'The display group is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.ORDIALOG)) {
        retObj.errMsg += 'input.ORDIALOG.medIEN is required.\n';
        retObj.valid = false;
    }
    return retObj;
}

function verifyDiscontinueInput(input) {
    var retObj = {
        'valid': true,
        'errMsg': ''
    };
    if (nullchecker.isNullish(input.ien)) {
        retObj.errMsg += 'The patient file IEN is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.locien)) {
        retObj.errMsg += 'The location file IEN is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.orderien)) {
        retObj.errMsg += 'The order file IEN is required.\n';
        retObj.valid = false;
    }
    if (nullchecker.isNullish(input.reason)) {
        retObj.errMsg += 'The reason is required.\n';
        retObj.valid = false;
    }
    return retObj;
}
module.exports.getResourceConfig = getResourceConfig;
module.exports.verifyInput = verifyInput;
module.exports.discontinue = discontinue;

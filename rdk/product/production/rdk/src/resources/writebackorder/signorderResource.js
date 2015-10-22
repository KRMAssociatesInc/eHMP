'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var async = require('async');
var isNullish = require('../../utils/nullchecker').isNullish;

// below: _ exports for unit testing only
module.exports._signOrder = signOrder;

function getResourceConfig() {
    return [{
        name: 'sign',
        path: '/sign',
        interceptors: {
            pep: false,
            synchronize: false
        },
        apiDocs: {
            spec: {
                summary: 'Signs an order',
                notes: '',
                // parameters: [
                //     rdk.docs.commonParams.pid,
                // ],
                responseMessages: []
            }
        },
        description: {
            post: 'Signs an order'
        },
        post: signOrder,
        healthcheck: [

            function() {
                return true;
            }
        ],
        // permissions: ['sign-patient-laborder']
    }];
}

function signOrder(req, res) {
    req.logger.info('perform sign order');
    var userSession,
        site, duz;

    try {
        userSession = req.session.user;
        site = userSession.site;
        duz = userSession.duz[site];
    } catch (e) {
        res.status(rdk.httpstatus.internal_server_error).rdkSend('Required authentication data is not present in request.');
        return;
    }

    var input = req.body.param;
    var signatureCode = req.body.param.signatureCode;
    var order = input.order;
    var orderIEN = order.localId;
    var pid = input.patientIEN;
    var locationId = input.locationIEN;
    var rpcConfig = getVistaRpcConfiguration(req.app.config, req.session.user.site);
    rpcConfig.accessCode = userSession.accessCode;
    rpcConfig.verifyCode = userSession.verifyCode;
    rpcConfig.context = 'OR CPRS GUI CHART';

    if (isNullish(pid) || isNullish(locationId)) {
        var error = {
            message: 'REQUEST NOT VALID'
        };

        req.logger.error(error);
        res.status(rdk.httpstatus.forbidden).rdkSend(error);
        return;
    }

    async.series([
            function isUserAProvider(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWU NPHASKEY', [duz, 'PROVIDER'], function(error, result) {
                    if (parseInt(result) === 0) {
                        error = {
                            message: 'NOT A PROVIDER',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function checkOrder(callback) {
                var args = [];
                args.push(orderIEN, 'ES', duz);
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWDXA VALID', args, function(error, result) {
                    if (result) {
                        error = {
                            message: 'NOT AUTHORIZED',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function lockOrder(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWDX LOCK ORDER', orderIEN, function(error, result) {
                    if (parseInt(result) !== 1) {
                        error = {
                            message: 'UNABLE TO LOCK ORDER',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function validateSignature(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWU VALIDSIG', signatureCode, function(error, result) {
                    if (parseInt(result) !== 1) {
                        error = {
                            message: 'SIGNATURE NOT VALID',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function sendOrders(callback) {
                var args = [];
                var ordersArray = {};
                ordersArray[1] = orderIEN + ';1^1^1^E';
                args.push(pid, duz, locationId, signatureCode, ordersArray);
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWDX SEND', args, function(err, result) {
                    var error;
                    if(err) {
                         error = {
                            message: 'UNABLE TO SIGN ORDER',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            },
            function unlockOrders(callback) {
                VistaJS.callRpc(req.logger, rpcConfig, 'ORWDX UNLOCK ORDER', orderIEN, function(err, result) {
                    var error;
                    if(err) {
                         error = {
                            message: 'UNABLE TO UNLOCK ORDER',
                            rpcError: result
                        };
                    }
                    callback(error, result);
                });
            }
        ],
        function(error, result) {
            if (error) {
                req.logger.error(error);
                res.status(rdk.httpstatus.forbidden).rdkSend(error);
            } else {
                req.logger.info('Successfully signed order: ' + result);
                res.status(rdk.httpstatus.ok).rdkSend();
            }
        });
}

module.exports.getResourceConfig = getResourceConfig;

/*jslint node: true*/
'use strict';

var rdk = require('../../rdk/rdk');
var nullChecker = require('../../utils/nullchecker/nullchecker');
var VistaJS = require('../../VistaJS/VistaJS');
var utils = require('../../utils/paramUtil');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

var params = {
    put: {
        ien: {
            required: true,
            description: 'vital IEN'
        },
        reason: {
            required: true,
            description: '1 = INCORRECT DATE/TIME, 2 = INCORRECT READING, 3 =INCORRECT PATIENT, and 4 = INVALID RECORD'
        }
    }
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        put: deleteVital,
        parameters: params,
        description: {
            put: 'Marks a selected vitals record in the GMRV Vital Measurement (#120.5) file as entered-in-error'
        },
        interceptors: {
            synchronize: true
        },
        healthcheck: {
            dependencies: ['jds', 'solr', 'jdsSync', 'authorization']
        },
        permissions: ['remove-patient-vital']
    }];
}

/**
 * Deletes a vital. Uses the site id that is stored in the user session.
 *
 * @param {Object} req - The default Express request that contains the
                         URL parameters needed to remove a vital.
 * @param {Object} res - The default Express response.
 *
 * param = {
 *   ien: {
 *     required: true,
 *     description: vital IEN
 *   },
 *   reason: {
 *     required: true,
 *     description: 1 = INCORRECT DATE/TIME, 2 = INCORRECT READING, 3 =INCORRECT PATIENT, and 4 = INVALID RECORD
 *   }
 * }
 */
function deleteVital(req, res) {
    req.logger.info('perform write back for Vital entered in error resource DELETE called');
    var input = req.body;

    var inputCheck,
        rpcArgs;

    // Check for required data
    inputCheck = verifyInput(input);

    if (!inputCheck.valid) {
        req.logger.error(inputCheck.errMsg);
        res.send(rdk.httpstatus.internal_server_error, inputCheck.errMsg);
        return;
    }

    rpcArgs = input.ien + '^' + req.session.user.duz[req.session.user.site] + '^' + input.reason;

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'GMV MARK ERROR', rpcArgs, function(error, result) {
        if (error || result.toString().toLowerCase().indexOf('error') > -1) {
            req.logger.error(errorVistaJSCallback + error);
            res.send(rdk.httpstatus.internal_server_error, error.toString());
        } else {
            result = result.toString();
            if (result.toLowerCase() === 'ok') {
                req.logger.info('Successfully wrote back to VistA.');
                req.logger.info('Writeback result: ' + result);

                res.send(new utils.returnObject(result));
            } else if (result.toLowerCase().indexOf('not found') > -1) {
                req.logger.error(errorVistaJSCallback + result);
                res.send(rdk.httpstatus.not_found, result);
            } else {
                req.logger.error(errorVistaJSCallback + result);
                res.send(rdk.httpstatus.internal_server_error, result);
            }
        }
    });
}

function verifyInput(input) {
    var retObj = {
        'valid': true,
        'errMsg': ''
    };
    if (nullChecker.isNullish(input.ien)) {
        retObj.errMsg += 'The vital IEN is required.\n';
        retObj.valid = false;
    }
    if (nullChecker.isNullish(input.reason) || input.reason.toString().length !== 1 ||
        nullChecker.isNullish(input.reason.toString().match(/[1-4]/))) {
        retObj.errMsg += 'The reason is a required in between 1 and 4.\n';
        retObj.valid = false;
    }
    return retObj;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.deleteVital = deleteVital;

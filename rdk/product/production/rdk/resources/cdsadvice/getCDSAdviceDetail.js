/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var nullchecker = rdk.utils.nullchecker;
var cdsUtil = require('./cdsUtil');
var adviceCache = require('./adviceCache');
var auditUtil = require('../../utils/audit/auditUtil');

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var errorAdviceDetail = 'Advice detail not available';

var apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.id('query', 'advice', true),
            rdk.docs.swagger.paramTypes.query('use', 'Rules invocation context', 'string', true)
        ],
        responseMessages: []
    }
};

/**
 * Create a JSON object from the parameters
 *
 * @param {string} detail the advice detail information
 * @param {string} provenance the advice provenance information
 */
function createDetails(detail, provenance) {
    return {
        detail: detail,
        provenance: provenance
    };
}

/**
 * Create a JSON response object for details
 *
 * @param {object} details the details information
 */
function createResponse(details) {
    return JSON.stringify({
        data: {
            items: [details]
        }
    });
}

/** Check advice for details
 *
 * @param {object} advice the advice information object
 */
function hasDetails(advice) {
    return advice.details && Object.keys(advice.details).length !== 0;
}

/**
 * Retrieve the advice/reminder detail. Uses the site id that is stored in the user session.
 *
 * @param {object} req The HTTP request object
 * @param {object} res The HTTP response object
 * @param {callback} next The next function
 * @return a 404 Not found if error no longer available
 */
module.exports = {
    getCDSAdviceDetail: function(req, res, next) {
        req.logger.info('retrieve cds advice detail resource GET called');

        var pid = req.param('pid');
        var use = req.param('use');
        var adviceId = req.param('id');

        req.logger.debug('pid: ' + pid);
        req.logger.debug('use: ' + use);
        req.logger.debug('advice detail id: ' + adviceId);

        // Audit this access
        req.audit.dataDomain = 'CDS';
        req.audit.logCategory = 'ADVICE';
        req.audit.patientId = pid;
        auditUtil.addAdditionalMessage(req, 'use', use);
        auditUtil.addAdditionalMessage(req, 'adviceId', adviceId);

        var cached = adviceCache.getCachedAdvice(pid, use, adviceId);

        if (cached && hasDetails(cached)) {
            res.send(createResponse(cached.details));
        } else {
            if (adviceId.indexOf('advice') === 0) {
                req.logger.error(errorAdviceDetail);
                res.send(rdk.httpstatus.not_found, errorAdviceDetail);
            }
            cdsUtil.getDFN(req, pid, function(data) {
                if (data instanceof Error) {
                    res.status(rdk.httpstatus.internal_server_error).send(data.message);
                } else {
                    req.logger.info('retrieve cds advice detail');

                    var dfn = data;
                    req.logger.debug('dfn: ' + dfn);
                    if (nullchecker.isNullish(adviceId)) {
                        res.status(rdk.httpstatus.bad_request).send('Missing required parameter: adviceId.');
                        return next();
                    }

                    // Make the RPC call and cache the result
                    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORQQPX REMINDER DETAIL', [dfn, adviceId], function(error, result) {
                        if (error) {
                            req.logger.error(errorVistaJSCallback + error);
                            res.send(rdk.httpstatus.internal_server_error, errorMessage);
                        } else {
                            if (result) {
                                req.logger.info('Successfully retrieved cds advice detail from VistA.');
                                var details = createDetails(result, null);
                                if (cached) {
                                    cached.details = details;
                                }
                                res.send(createResponse(details));
                            } else {
                                req.logger.error(errorVistaJSCallback + 'empty detail returned');
                                res.send(rdk.httpstatus.not_found, errorMessage);
                            }
                        }
                    });
                }
            });
        }

    }
};

module.exports.apiDocs = apiDocs;

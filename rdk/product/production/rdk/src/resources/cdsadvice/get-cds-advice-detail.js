'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var nullchecker = rdk.utils.nullchecker;
var cdsUtil = require('./cds-util');
var adviceCache = require('./advice-cache');
var auditUtil = require('../../utils/audit');

var errorVistaJSCallback = 'VistaJS RPC callback error: ';
var errorDetailNotFound = 'Advice detail not available';
var errorMissingRequiredParam = 'Missing required parameters. The following parameters are required: pid, use, id.';

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

/*
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

/*
 * Create a JSON response object for details
 *
 * @param {object} details the details information
 */
function createResponse(details) {
    return {
        data: {
            items: [details]
        }
    };
}

/* Check advice for details
 *
 * @param {object} advice the advice information object
 */
function hasDetails(advice) {
    return advice.details && Object.keys(advice.details).length !== 0;
}

/**
 * Retrieve the advice/reminder detail. Uses the site id that is stored in the user session.
 *
 * @api {get} /resource/cds/advice/detail?pid=123VQWE&use=test&id=4567 Request CDS Advice Detail
 *
 * @apiName AdviceDetail
 * @apiGroup CDS Advice
 *
 * @apiparam {string} pid The patient identifier
 * @apiparam {string} use The CDS Use (Intent)
 * @apiparam {string} id The advice list id
 *
 * @apiSuccess (Success 200) {json} payload Detailed information
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Success
  {
     “details”:{
          “detail”:“Patient John Smith is due for lab tests.”,
          “provenance”:“The U.S. Preventive Service s Task Force (USPSTF) recommends screening…”
      }
   }
 *
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
  {
    CDS Advice - missing or null parameters
  }
 * @param {object} req The HTTP request object
 * @param {object} res The HTTP response object
 * @returns Details object
 */
module.exports = {
    getCDSAdviceDetail: function(req, res) {
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
        auditUtil.addAdditionalMessage(req, 'id', adviceId);

        // check for required parameters
        if (nullchecker.isNullish(pid) || nullchecker.isNullish(use) || nullchecker.isNullish(adviceId)) {
            return res.status(rdk.httpstatus.bad_request).end(errorMissingRequiredParam);
        }

        var cached = adviceCache.getCachedAdvice(req.session.id, pid, use, adviceId);

        if (cached && hasDetails(cached)) {
            res.rdkSend(createResponse(cached.details));
        } else {
            cdsUtil.getDFN(req, pid, function(data) {
                if (data instanceof Error) {
                    req.logger.error('Error retrieving DFN -- ' + data.message);
                    res.status(rdk.httpstatus.not_found).rdkSend(errorDetailNotFound);
                } else {
                    var dfn = data;
                    req.logger.info('retrieve cds advice detail');
                    req.logger.debug('dfn: ' + dfn);

                    // Make the RPC call and cache the result
                    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORQQPX REMINDER DETAIL', [dfn, adviceId], function(error, result) {
                        if (error) {
                            req.logger.error(errorVistaJSCallback + error);
                            res.status(rdk.httpstatus.not_found).rdkSend(errorDetailNotFound);
                        } else {
                            if (result) {
                                req.logger.info('Successfully retrieved cds advice detail from VistA.');
                                var details = createDetails(result, null);
                                if (cached) {
                                    cached.details = details;
                                }
                                res.status(rdk.httpstatus.ok).rdkSend(createResponse(details));
                            } else {
                                req.logger.error(errorVistaJSCallback + 'empty detail returned');
                                res.status(rdk.httpstatus.not_found).rdkSend(errorDetailNotFound);
                            }
                        }
                    });
                }
            });
        }

    }
};

module.exports.apiDocs = apiDocs;

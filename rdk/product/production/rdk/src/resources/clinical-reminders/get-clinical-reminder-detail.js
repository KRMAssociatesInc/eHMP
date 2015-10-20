'use strict';

var rdk = require('../../core/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc-config').getVistaRpcConfiguration;
var nullchecker = rdk.utils.nullchecker;

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

module.exports = getClinicalReminderDetail;
module.exports._getClinicalReminderDetail = getClinicalReminderDetail;
module.exports.parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        reminderId: {
            required: true,
            description: 'Clinical Reminder ID'
        }
    }
};
module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.id('query', 'clinical reminder', true)
        ],
        responseMessages: []
    }
};


/**
* Retrieves details about a clinical reminder given a DFN and reminder
* id. Uses the site id that is stored in the user session.
*
* @param {Object} req - The default Express request that contains the
                        URL parameters needed to retrieve a clinical reminder.
* @param {Object} res - The default Express response that will contain
                        clinical reminder details.
* @param {function} next - The middleware to be executed after this
                        function has finished executing.
*/
function getClinicalReminderDetail(req, res, next) {
    req.logger.info('retrieve clinical reminder detail resource GET called');

    var dfn = req.interceptorResults.patientIdentifiers.dfn;
    var reminderId = req.param('reminder.id');

    req.logger.debug('DFN: ' + dfn);
    req.logger.debug('clinical reminder ID: ' + reminderId);

    if (nullchecker.isNullish(dfn) || nullchecker.isNullish(reminderId)) {
        return next();
    }

    req.audit.patientId = dfn;

    VistaJS.callRpc(req.logger, getVistaRpcConfiguration(req.app.config, req.session.user.site), 'ORQQPX REMINDER DETAIL', [dfn, reminderId], function(error, result) {
        if (error) {
            req.logger.error(errorVistaJSCallback + error);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(errorMessage);
        } else {
            if (result) {
                req.logger.info('Successfully retrieved clinical reminder detail from VistA.');
                res.rdkSend({
                    'data': {
                        'items': [{
                            'detail': result
                        }]
                    }
                });
            } else {
                req.logger.error(errorVistaJSCallback + result);
                res.status(rdk.httpstatus.internal_server_error).rdkSend(errorMessage);
            }
        }
    });
}

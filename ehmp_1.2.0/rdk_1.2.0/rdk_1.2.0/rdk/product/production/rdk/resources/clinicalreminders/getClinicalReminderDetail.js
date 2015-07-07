/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var VistaJS = require('../../VistaJS/VistaJS');
var getVistaRpcConfiguration = require('../../utils/rpc/rpcUtil').getVistaRpcConfiguration;
var nullchecker = rdk.utils.nullchecker;

var errorMessage = 'There was an error processing your request. The error has been logged.';
var errorVistaJSCallback = 'VistaJS RPC callback error: ';

module.exports = getClinicalReminderDetail;
module.exports._getClinicalReminderDetail = getClinicalReminderDetail;
module.exports.parameters = {
    get: {
        dfn: {
            required: true,
            description: 'DFN'
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
            rdk.docs.swagger.paramTypes.query('dfn', 'dfn', 'string', true),
            rdk.docs.commonParams.id('clinical reminder', true)
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

    var dfn = req.param('dfn');
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
            res.send(rdk.httpstatus.internal_server_error, errorMessage);
        } else {
            if (result) {
                req.logger.info('Successfully retrieved clinical reminder detail from VistA.');
                res.send(JSON.stringify({
                    'data': {
                        'items': [{
                            'detail': result
                        }]
                    }
                }));
            } else {
                req.logger.error(errorVistaJSCallback + result);
                res.send(rdk.httpstatus.internal_server_error, errorMessage);
            }
        }
    });
}

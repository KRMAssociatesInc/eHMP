'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;


module.exports = getServiceConnectedAndServiceExposureList;
module.exports._getServiceConnectedAndServiceExposureList = getServiceConnectedAndServiceExposureList;
module.exports.apiDocs = {
    spec: {
        summary: 'Indicates whether corresponding form fields should be enabled.',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'pid',  // name
                'patient id',  // description
                'string',  // type
                true  // required
            )
        ]
    }
};

/**
* Retrieves indication of which checkbox form fields should be enabled.
*
* @param {Object} req - The default Express request that contains the
*                       parameters needed to retrieve disabilities for
*                       a specific patient.
* @param {Object} res - The default Express response that will contain a
*                       list of disabilities for a specific patient.
* @param {function} next - The middleware to be executed after this
*                          function has finished executing.
*/
function getServiceConnectedAndServiceExposureList(req, res, next) {
    req.logger.debug('Service connected resource GET called');

    // Set audit log parameters
    req.audit.dataDomain = 'Service Connected';
    req.audit.logCategory = 'SERVICE_CONNECTED_EXPOSURE_LIST';
    req.audit.patientId = req.param('pid');

    var sitePid = req.interceptorResults.patientIdentifiers.siteDfn;

    var appConfig = req.app.config;
    var jdsServer = appConfig.jdsServer;
    var jdsResource = '/vpr/';

    if(!sitePid) {
        req.logger.info('pid not provided');
        return next();
    }

    var jdsOptions = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsResource + sitePid
    });

    var jdsConfig = {
        options: jdsOptions,
        protocol: 'http',
        logger: req.logger
    };

    httpUtil.fetch(appConfig, jdsConfig,
        function(err, data, statusCode) {
            var exposure = [];

            if(err) {
                req.logger.error('The fetch sent back an error:' + err);
                return res.send({status: statusCode, data: err});
            }
            data = JSON.parse(data);

            if (_.isObject(data.data.items[0])) {
                exposure = data.data.items[0].exposure;
            }

            if(!_.isArray(exposure)){
                req.logger.debug('This patient has no Service Connected Exposure Data');
                exposure = 'NONE';
            }

            req.logger.debug('Service Connected Exposure Data successfully retrieved.');
            return res.send({status: statusCode, data: {exposure: exposure}});

        });

}

'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;

var noRatedDisabilitiesMessage = 'NONE STATED';
var serviceConnectedFlag = 'NO';

module.exports = getServiceConnectedAndRatedDisabilities;
module.exports._getServiceConnectedAndRatedDisabilities = getServiceConnectedAndRatedDisabilities;
module.exports.apiDocs = {
    spec: {
        summary: 'Populates service connection & rated disabilities for a patient',
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
* Retrieves a list of a patient's disabilities and whether or not they are
* service connected.
*
* @param {Object} req - The default Express request that contains the
*                       parameters needed to retrieve disabilities for
*                       a specific patient.
* @param {Object} res - The default Express response that will contain a
*                       list of disabilities for a specific patient.
* @param {function} next - The middleware to be executed after this
*                          function has finished executing.
*/
function getServiceConnectedAndRatedDisabilities(req, res, next) {
    req.logger.debug('Service connected resource GET called');

    // Set audit log parameters
    req.audit.dataDomain = 'Service Connected';
    req.audit.logCategory = 'SERVICE_CONNECTED_RATED_DISABILITIES';
    req.audit.patientId = req.param('pid');

    var dfn = req.interceptorResults.patientIdentifiers.siteDfn;

    if(!dfn) {
        req.logger.info('pid not provided');
        return next();
    }

    var appConfig = req.app.config;
    var jdsServer = appConfig.jdsServer;
    var jdsResource = '/vpr/';

    var jdsOptions = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsResource + dfn
    });

    var jdsConfig = {
        options: jdsOptions,
        protocol: 'http',
        logger: req.logger
    };

    httpUtil.fetch(appConfig, jdsConfig,
        function(err, data, statusCode) {
            var scPercent = '',
                serviceConnected = false,
                disability = [];

            if(err) {
                req.logger.error('The fetch sent back an error:' + err);
                return res.send({status: statusCode, data: err});
            }
            data = JSON.parse(data);

            if (_.isObject(data.data.items[0])) {
                scPercent = data.data.items[0].scPercent;
                serviceConnected = data.data.items[0].serviceConnected;
                disability = data.data.items[0].disability;
            }

            if(!_.isArray(disability)){
                req.logger.debug('Service Connected Disability data was unavailable for this patient');
                serviceConnected = serviceConnectedFlag;
                disability = noRatedDisabilitiesMessage;
            }

            req.logger.debug('Service Connected Disability data succesfully retrieved.');
            return res.send({status: statusCode, data:{
                scPercent: scPercent,
                serviceConnected: serviceConnected,
                disability: disability
            }});
        }
    );
}

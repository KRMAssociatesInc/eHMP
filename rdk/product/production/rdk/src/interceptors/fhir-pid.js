'use strict';

/**
 * Checks if the resource is a FHIR resource and attempts to
 * parse the patient id from the URL and set it to the request query.
 *
 * @namespace fhirPid
 * @param {Object} req The request object
 * @param {Object} res The response object
 * @param {Function} next A callback function
 * @return {undefined}
 */
module.exports = function(req, res, next) {
    if (req.param('pid')) {
        return next();
    }
    req.logger.debug('fhirPid() ');
    var pid = getPid(req.originalUrl);
    if (pid) {
        pid = pid.replace(/:/, ';');
        req.query.pid = pid;
    }
    next();
};

function getPid(url) {
    var fhirRegex = /\/fhir\/patient\/([^\/]+)/i;
    var res = fhirRegex.exec(url);
    return (res && res.length > 1) ? res[1] : null;
}

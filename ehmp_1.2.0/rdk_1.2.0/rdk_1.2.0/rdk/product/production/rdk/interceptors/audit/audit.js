/*jslint node: true */
'use strict';

var util = require('util');
var auditUtil = require('../../utils/audit/auditUtil');

var XUPROG_STRING = 'XUPROG';
var XUPROGMODE_STRING = 'XUPROGMODE';
var VISTAKEYS = 'vistaKeys';

module.exports = function(req, res, next) {

    var authInfo = req.session.user;

    req.audit = {};
    req.audit.remoteHost = req.ip;

    if (typeof authInfo === 'object') {
        req.audit.authuser = authInfo.duz;
        req.audit.siteCode = authInfo.site;
    }
    req.audit.date = new Date();
    req.audit.request = util.format('%s %s HTTP/%s', req.method, req.originalUrl, req.httpVersion);
    req.audit.patientId = req.query.pid;
    req.audit.sensitive = 'false';

    //Check for programmer mode keys, append to additional messages if found
    if (authInfo !== undefined && authInfo.vistaKeys !== undefined) {
        var xuprogIndex = authInfo.vistaKeys.indexOf(XUPROG_STRING);
        var xuprogModeIndex = authInfo.vistaKeys.indexOf(XUPROGMODE_STRING);

        if (xuprogIndex !== -1 && xuprogIndex !== xuprogModeIndex) {
            auditUtil.addAdditionalMessage(req, VISTAKEYS, XUPROG_STRING);
        }

        if (xuprogModeIndex !== -1) {
            auditUtil.addAdditionalMessage(req, VISTAKEYS, XUPROGMODE_STRING);
        }
    }

    function onFinish() {
        finalizeAudit();
    }

    function onClose() {
        finalizeAudit();
    }

    function finalizeAudit() {
        req.audit.status = res.statusCode;
        res.removeListener('finish', onFinish);
        res.removeListener('close', onClose);

        req.app.auditer.save(req.audit);
    }

    res.on('finish', onFinish);

    res.on('close', onClose);

    res.on('timeout', function(err) {
        req.logger.error('response timeout when calling middleware');
        res.send(500, 'There was an error processing your request. The error has been logged.');
    });

    next();
};

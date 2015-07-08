/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var httpUtil = require('../../utils/http-wrapper/http');
var _ = require('underscore');
var authSSO = require('../../resources/authentication/authSSOResource');

function getResourceConfig() {
    return [{
        name: 'stopContext',
        path: '/stopContext',
        post: stopContext,
        interceptors: {
            metrics: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'setContext',
        path: '/setContext',
        post: setContext,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'contextparticipant',
        path: '/contextparticipant',
        get: contextparticipant,
        interceptors: {
            metrics: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'getNewContext',
        path: '/getNewContext',
        post: getNewContext,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'addNewPatient',
        path: '/addNewPatient',
        post: addNewPatient,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'commitContextChange',
        path: '/commitContextChange',
        post: commitContextChange,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'cancelContextChange',
        path: '/cancelContextChange',
        post: cancelContextChange,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'preventContextChange',
        path: '/preventContextChange',
        post: preventContextChange,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'acceptAllContextChange',
        path: '/acceptAllContextChange',
        get: acceptAllContextChange,
        interceptors: {
            metrics: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'suspend',
        path: '/suspend',
        post: suspend,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'resume',
        path: '/resume',
        post: resume,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'breakContext',
        path: '/breakContext',
        post: breakContext,
        interceptors: {
            metrics: false,
            operationalDataCheck: false,
            pep: false
        }
    }, {
        name: 'ssoprocess',
        path: '/ssoprocess',
        post: ssoProcess,
        interceptors: {
            metrics: false,
            authentication: false,
            operationalDataCheck: false,
            pep: false
        }
    }];
}

function stopContext(req, res) {
    ccowPost(req, res, 'stopContext');
}

function setContext(req, res) {
    var config = req.app.config;

    httpUtil.postJSONObject({
            blob: req.body.blob,
            mContextManagerUrl: req.body.mContextManagerUrl,
            participantUrl: req.body.participantUrl,
            vistaSite: config.vistaSites[req.body.site]
        }, {
            timeoutMillis: 5000,
            logger: req.logger,
            options: {
                hostname: config.ccowServer.hostname,
                port: config.ccowServer.port,
                path: config.ccowServer.path + '/setContext',
                method: 'POST'
            }
        },
        function (err, response) {
            if (err || !response) {
                res.status(500).json({
                    msg: 'There was an error adding patient to the context.'
                });
            } else {
                try {
                    var fresult = JSON.parse(response);
                    ensureICNforSelectedPatient(req, res, fresult);
                } catch (e) {
                    res.status(500).json({
                        msg: 'There was an error setting the context.'
                    });
                }
            }
        });
}

function contextparticipant(req, res) {
    var resp = 'decision=accept';
    res.removeHeader('X-Powered-By');
    res.removeHeader('Access-Control-Allow-Credentials');
    res.setHeader('content-type', 'application/x-www-form-urlencoded');
    res.setHeader('content-length', resp.length);
    res.write(resp);
    res.end();
}

function getNewContext(req, res) {
    var config = req.app.config;

    httpUtil.postJSONObject({
            blob: req.body.blob,
            mContextManagerUrl: req.body.mContextManagerUrl,
            participantUrl: req.body.participantUrl,
            site: req.body.site,
            vistaSite: config.vistaSites[req.body.site]
        }, {
            timeoutMillis: 5000,
            logger: req.logger,
            options: {
                hostname: config.ccowServer.hostname,
                port: config.ccowServer.port,
                path: config.ccowServer.path + '/getNewContext',
                method: 'POST'
            }
        },
        function (err, response) {
            if (err || !response) {
                res.status(500).json({
                    msg: 'There was an error adding patient to the context.'
                });
            } else {
                try {
                    var fresult = JSON.parse(response);
                    ensureICNforSelectedPatient(req, res, fresult);
                } catch (e) {
                    res.status(500).json({
                        msg: 'There was an error getting new context.'
                    });
                }
            }
        });
}

function addNewPatient(req, res) {
    var config = req.app.config;

    httpUtil.postJSONObject({
            blob: req.body.blob,
            dfn: req.body.dfn,
            name: req.body.name,
            site: req.body.site,
            vistaSite: config.vistaSites[req.body.site]
        }, {
            timeoutMillis: 5000,
            logger: req.logger,
            options: {
                hostname: config.ccowServer.hostname,
                port: config.ccowServer.port,
                path: config.ccowServer.path + '/addNewPatient',
                method: 'POST'
            }
        },
        function (err, response) {
            if (err || !response) {
                res.status(500).json({
                    msg: 'There was an error adding patient to the context.'
                });
            } else {
                try {
                    req.session.participantDecision = 'decision=accept';
                    var fresult = JSON.parse(response);
                    ensureICNforSelectedPatient(req, res, fresult);
                } catch (e) {
                    res.status(500).json({
                        msg: 'There was an error adding patient to the context.'
                    });
                }
            }
        });
}


function ssoProcess(req, res) {
    var config = req.app.config;
    var vistaSiteCollection = req.app.config.vistaSites;
    var site = req.body.site;

    for (var key in vistaSiteCollection) {
        if (vistaSiteCollection.hasOwnProperty(key)) {
            if (vistaSiteCollection[key].host === site) {
                site = key;
                break;
            }
        }
    }

    req.logger.debug('SITE', site);

    req.logger.debug('config.ccowServer.path: ' + config.ccowServer.path + '/ssoprocess');
    httpUtil.postJSONObject({
            blob: req.body.blob,
            mContextManagerUrl: req.body.mContextManagerUrl,
            participantUrl: req.body.participantUrl,
            hostIP: config.vistaSites[site].host,
            hostPort: config.vistaSites[site].port
        }, {
            timeoutMillis: 5000,
            logger: req.logger,
            options: {
                hostname: config.ccowServer.hostname,
                port: config.ccowServer.port,
                path: config.ccowServer.path + '/ssoprocess',
                method: 'POST'
            }
        },
        function (err, response) {
            if (err) {
                res.send(err);
            } else {
                var fresult = JSON.parse(response);
                fresult.site = site;
                req.logger.debug('SSO PROCESS', fresult);
                ensureICNforSelectedPatient(req, res, fresult, function (pid) {
                    fresult.ccowObject.pid = pid;
                    authSSO.processSSOAuthentication(req, res, {
                        accessCode: fresult.token,
                        site: site
                    }, fresult.ccowObject);
                });
            }
        });
}


function commitContextChange(req, res) {
    ccowPost(req, res, 'commitContextChange');
}

function cancelContextChange(req, res) {
    ccowPost(req, res, 'cancelContextChange');
}

function preventContextChange(req, res) {
    ccowPost(req, res, {
        type: 'preventContextChange',
        params: req.params
    });
}

function acceptAllContextChange(req, res) {
    ccowPost(req, res, {
        type: 'acceptAllContextChange',
        params: req.params
    });
}

function suspend(req, res) {
    ccowPost(req, res, 'suspend');
}

function breakContext(req, res) {
    ccowPost(req, res, 'breakContext');
}

function resume(req, res) {
    ccowPost(req, res, 'resume');
}

function ccowPost(req, res, path) {
    var config = req.app.config;
    req.logger.debug('ccowPost with config.ccowServer.path: ' + config.ccowServer.path + '/' + path);

    httpUtil.postJSONObject({
            blob: req.body.blob
        }, {
            timeoutMillis: 5000,
            logger: req.logger,
            options: {
                hostname: config.ccowServer.hostname,
                port: config.ccowServer.port,
                path: config.ccowServer.path + '/' + path,
                method: 'POST'
            }
        },
        function (err, response) {
            if (err) {
                req.logger.error(err.message);
                res.status(rdk.httpstatus.internal_server_error).send(err.message);
            } else if (res.status === 500) {
                req.logger.error(res.message);
                res.status(rdk.httpstatus.internal_server_error).send(res.message);
            } else {
                try {
                    res.status(rdk.httpstatus.ok).json(JSON.parse(response));
                } catch (e) {
                    req.logger.error(e.message);
                    res.status(rdk.httpstatus.internal_server_error).send(e.message);
                }
            }
        });
}

function ensureICNforSelectedPatient(req, res, fresult, callback) {
    if (fresult.site) {
        fresult.pid = fresult.site + ';' + fresult.ccowObject.pid;
    } else {
        fresult.pid = req.body.site + ';' + fresult.pid;
    }

    var jdsPath = '/data/index/pt-select-pid/?range=' + fresult.pid;
    var jdsServer = req.app.config.jdsServer;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsPath
    });
    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger
    };
    httpUtil.fetch(config, function (error, result) {
        try {
            result = JSON.parse(result);
        } catch (e) {
            // do nothing
        }

        req.logger.debug('ICN RESULT', result);
        if (result.data && result.data.items) {
            var icn = result.data.items[0] && result.data.items[0].icn;

            if (icn) {
                fresult.pid = icn;
            }
        }

        if (callback && typeof (callback) === 'function') {
            req.logger.debug('PID', fresult.pid);
            callback(fresult.pid);
        } else {
            res.json(fresult);
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;

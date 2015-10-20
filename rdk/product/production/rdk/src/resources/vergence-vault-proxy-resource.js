'use strict';

var rdk = require('../core/rdk');
var httpUtil = require('../utils/http');
var _ = require('underscore');
var authSSO = require('./authentication/auth-sso-resource');

function getResourceConfig() {
    return [
        {
            name: 'geticnforccow',
            path: '/getICNForCCOW',
            post: getICNForCCOW,
            permitResponseFormat: true,
            interceptors: {
                authentication: false,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            }
    }, {
            name: 'getSiteInfo',
            path: '/getSiteInfo',
            get: getSiteInfo,
            permitResponseFormat: true,
            interceptors: {
                authentication: false,
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            }
    }];
}

function getSiteInfo(req, res) {
    var vistaSiteCollection = req.app.config.vistaSites;
    var site = req.param('site');
    req.logger.info('SITE PARAMS2', req, _.isUndefined(site));
    if (_.isUndefined(site)) {
        res.status(rdk.httpstatus.internal_server_error).json({
            msg: 'Site Id is missing'
        });
    }
    res.status(rdk.httpstatus.ok).json({
        'Site': vistaSiteCollection[site] || 'Not Found'
    });
}

function getICNForCCOW(req, res, next) {
    var props = {
        site: req.body.site,
        pid: req.body.dfn
    };
    ensureICNforSelectedPatient(req, res, props);
}

function ensureICNforSelectedPatient(req, res, props, callback) {
    props.pid = props.site + ';' + props.pid;

    var jdsPath = '/data/index/pt-select-pid/?range=' + props.pid;
    var jdsServer = req.app.config.jdsServer;
    var options = _.extend({}, jdsServer, {
        method: 'GET',
        path: jdsPath
    });
    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };
    httpUtil.fetch(req.app.config, config, function (error, result) {
        try {
            result = JSON.parse(result);
        } catch (e) {
            // do nothing
        }

        req.logger.debug('ICN RESULT', result);
        if (result.data && result.data.items) {
            var icn = result.data.items[0] && result.data.items[0].icn;

            if (icn) {
                props.pid = icn;
            }
        }

        if (callback && typeof (callback) === 'function') {
            req.logger.debug('PID', props.pid);
            callback(props.pid);
        } else {
            res.json(props);
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;

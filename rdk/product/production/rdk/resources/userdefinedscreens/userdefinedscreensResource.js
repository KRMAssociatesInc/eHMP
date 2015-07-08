'use strict';

var rdk = require('../../rdk/rdk');
var _ = rdk.utils.underscore;
var httpUtil = rdk.utils.http;
var util = require('util');

var apiDocs = {
    spec: {
        summary: '',
        notes: '',
        method: 'GET',
        parameters: [rdk.docs.swagger.paramTypes.query(
            'screenType',
            'workspace id',
            'string',
            true
        )],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: getUserDefinedScreens,
        apiDocs: apiDocs,
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        permissions: ['save-userdefined-screens']
    }];
}

function getUserDefinedScreens(req, res) {
    req.logger.debug('Inside Get user defined screens');

    var uid = createScreenIdFromRequest(req, req.param('screenType'));

    getScreenData(uid, req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            //the UI is coded to work with data.userdefinedscreens
            //return as it expects it if we can,
            //but don't force that standard on other users of the getScreenData function
            //make UI happy by passing a string - even undefined/null
            data = JSON.stringify(data.userdefinedscreens);
            res.status(rdk.httpstatus.ok).send(data);
        }
    });
}

function createScreenIdFromRequest(req, screenType) {
    var userSession = req.session.user;
    var site = userSession.site;
    var ien = userSession.duz[site];
    var uid = site.concat(';').concat(ien);

    req.logger.debug('Inside getUserDefinedScreens screenType: ' + screenType);

    uid = uid.concat('_').concat(screenType);
    return uid;
}

function getScreenData(screenId, req, callback) {
    var mdsResource = '/user/get'; //The correct endpoint from the JDS for GET which is part of VPRJSES global

    var conf_options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: mdsResource + '/' + screenId //JDS team decided to just append sit to URL for get
    });
    var config = {
        options: conf_options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger
    };

    httpUtil.fetch(config,
        function(err, data) {
            if (err) {
                config.logger.error('userdefinedscreens getScreenData screenId:' + screenId + '. with err:' + err);
                callback(err);
            } else {
                callback(null, data);
            }
        },
        function responseProcessor(statusCode, data) {
            try {
                data = JSON.parse(data) || {};
            } catch (e) {
                config.logger.error('Error parsing user defined screens JSON: ' + e.toString());
                data = {};
            }
            req.logger.debug({data: data}, 'Inside responseProcessor userdefinedscreens: ');
            //return data.userdefinedscreens;
            return data;
        }
    );
}

exports.getResourceConfig = getResourceConfig;
exports.getScreenData = getScreenData;
exports.createScreenIdFromRequest = createScreenIdFromRequest;

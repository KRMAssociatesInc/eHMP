'use strict';

var dd = require('drilldown');
var jdsFilter = require('jds-filter');
var querystring = require('querystring');
var rdk = require('../../core/rdk');
var nullChecker = rdk.utils.nullchecker;
var mongoStore = rdk.utils.mongoStore;
var httpUtil = rdk.utils.http;
var _ = require('underscore');
var USERS_COLLECTION = 'ehmpUsers';
var userUtil = require('./user-whitelist');

var users = {};

users.apiDocs = {
    spec: {
        summary: 'Get the list of users from JDS with eHMP roles',
        notes: '',
        responseMessages: []
    }
};

users.getUserList = function(req, res) {
    var vistaSites = req.app.config.vistaSites;

    var processResults = function(err, result) {
        try {
            result = JSON.parse(result);
        } catch (error) {
            res.status(rdk.httpstatus.internal_server_error).rdkSend('Could not parse results from JDS');
            return;
        }

        if (err) {
            req.logger
                .error('An error occured in pep while gathering data from JDS' + err);
            res.status(err.status).rdkSend('An error occured in pep while gathering user list data.');
            return;
        } else if (!dd(result)('data')('items').val) {
            req.logger.debug('JDS did not provide a list of user items.');
            res.status(rdk.httpstatus.internal_server_error).rdkSend('Expected Conditions were not met for a list of users');
            return;
        }

        var whiteListUsers = [];
        mongoStore.getCollection(USERS_COLLECTION, req, res, function(ehmpUsers) {
            if (nullChecker.isNullish(ehmpUsers)) {
                return; // mongo-store db connector will report error
            }
            _.each(result.data.items, function(user) {
                var name = user.name.split(',');
                user.lastname = name[0];
                user.firstname = name[1];
                var uidParts = user.uid.split(':');
                user.site = uidParts[3];
                user.duz = user.localId || uidParts[4];
                user.facility = vistaSites[user.site].name;
                if (nullChecker.isNullish(user.uid)) {
                    res.status(rdk.httpstatus.bad_request).rdkSend('User uid missing from request');
                    return;
                }
                ehmpUsers.findOne({
                    uid: user.uid
                }, function(err, result) {
                    if (!_.isEmpty(err) && !_.isNull(err)) {
                        res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                        return;
                    }
                    if (nullChecker.isNullish(result)) {
                        user.roles = [];
                    } else {
                        user.roles = result.roles || [];
                    }
                    whiteListUsers.push(userUtil.sanitizeUser(user, userUtil.userListWhitelist));
                });
            })
            res.status(rdk.httpstatus.ok).rdkSend(whiteListUsers);
        });
    };

    //get all the users from this users site.
    var jdsFilterObject = ['like', 'uid', '%' + req.session.user.site + '%'];
    var jdsFilterPath = jdsFilter.build(jdsFilterObject);
    var jdsPath = '/data/find/user' + querystring.stringify(jdsFilterPath);
    var jdsConfig = req.app.config.jdsServer;
    var httpConfig = {
        cacheTimeout: 15 * 60 * 1000,
        timeoutMillis: 5000,
        protocol: 'http',
        logger: req.logger,
        options: {
            host: jdsConfig.host,
            port: jdsConfig.port,
            path: jdsPath,
            method: 'GET'
        }
    };

    httpUtil.fetch(req.app.config, httpConfig, processResults);
};

module.exports = users;

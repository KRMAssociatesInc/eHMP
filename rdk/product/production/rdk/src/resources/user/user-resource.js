'use strict';

var sessionUserInfo = require('./get-session-user-info');
var userList = require('./get-user-list');

var getResourceConfig = function() {
    return [{
            name: 'userinfo',
            path: '/info',
            interceptors: {
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            apiDocs: sessionUserInfo.apiDocs,
            get: sessionUserInfo.getUser,
            healthcheck: {

            }
        }, {
            name: 'userlist',
            path: '/list',
            interceptors: {
                operationalDataCheck: false,
                pep: false,
                synchronize: false
            },
            apiDocs: userList.apiDocs,
            get: userList.getUserList,
            healthcheck: {}
    }];
};

module.exports.getResourceConfig = getResourceConfig;

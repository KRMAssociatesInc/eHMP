'use strict';

var getSession = require('./get-session');
var refreshToken = require('./refresh-token');
var destroySession = require('./destroy-session');
var listResource = require('./list-resource');


/**
 * Returns the configuration for the authentication resources
 *  - authentication : requires the authentication interceptor to run in order to add the user to teh session for returning that data
 *  - refreshToken : expects a session to already occur or it returns a blank object
 *  - destroySession : expects a session to be there in order to destroy it returns nothing
 *  - list : is a readonly resource that gives the list of vistas available returns an array
 *
 * @return {Array}      -an array containing the objects needed to configure the authentication resource
 *
 */
function getResourceConfig() {
    return [{
        name: 'authentication',
        path: '',
        post: getSession,
        interceptors: {
            operationalDataCheck: false,
            pep: {
                handlers: ['permission']
            },
            synchronize: false
        },
        parameters: getSession.parameters,
        apiDocs: getSession.apiDocs
    }, {
        name: 'refreshToken',
        path: '',
        get: refreshToken,
        //we do not want to re-authenticate here just refresh the token
        interceptors: {
            audit: false,
            metrics: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false,
            synchronize: false
        },
        parameters: {},
        apiDocs: refreshToken.apiDocs
    }, {
        name: 'destroySession',
        path: '',
        delete: destroySession,
        //we are trying to destroy the session so don't re-authenticate here
        interceptors: {
            authentication: false,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        parameters: {},
        apiDocs: destroySession.apiDocs
    }, {
        name: 'list',
        path: '/list',
        get: listResource.get,
        interceptors: {
            authentication: false,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        parameters: {},
        apiDocs: listResource.apiDocs
    }];
}

module.exports.getResourceConfig = getResourceConfig;

/*jslint node: true */
'use strict';

function getResourceConfig(app) {
    var config = [ evaluate(app)];
    config.healthcheck = function() {
        return true;
    };
    return config;
}

var evaluate = function(app) {
    return {
        name : 'evaluate',
        path : '/evaluate',
        post : require('../../subsystems/asu/asuSubSystem').evaluate,
        interceptors: {
            audit: false,
            metrics: false,
            authentication: false,
            pep: false,
            operationalDataCheck: false
        },
        healthcheck: function() {
            return true;
        }
    };
};

module.exports.getResourceConfig = getResourceConfig;

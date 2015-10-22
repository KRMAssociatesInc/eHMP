'use strict';

function getSubsystemConfig(app) {
    return {
        healthcheck: {
            name: 'authorization',
            interval: 100000,
            check: function(callback){
                // authorization subsystem uses an RDK-implementation. See commit history for APS healthcheck.
                return callback(true);
            }
        }
    };
}

module.exports.getSubsystemConfig = getSubsystemConfig;

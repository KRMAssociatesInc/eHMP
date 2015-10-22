'use strict';
var moment = require('moment');
var _ = require('underscore');

/*
    startHearbeat()
    Starts the heartbeat for a process if heartbeat is enabled
    Parameters:
        logger: The logger
        config: The configuration
        environment: The environment
        processName: The name of the process
        profile: The name of the process' profile (applicable to subscriberHost and pollerHost only)
        processStartTime: The time when the process started in YYYYMMDDHHmmss format
    Returns: A reference to the new heartbeat timer (to use with clearHeartbeat), or null if heartbeat is not enabled
*/
function startHeartbeat(logger, config, environment, processName, profile, processStartTime) {
    if (config.healthcheck && config.healthcheck.heartbeatEnabled) {
        var healthcheckOptions = config.healthcheck;
        var heartbeatIntervalMillis = healthcheckOptions.heartbeatIntervalMillis;

        logger.debug('healthcheck-utils(name: %s, id: %s).start(): Sending initial heartbeat.');
        sendHeartbeat(logger, config, environment, processName, profile, process.pid, processStartTime);

        logger.debug('healthcheck-utils(name: %s, id: %s).start(): Heartbeat enabled: heartbeatIntervalMillis: %s', processName, process.pid, heartbeatIntervalMillis);
        return setInterval(sendHeartbeat, heartbeatIntervalMillis, logger, config, environment, processName, profile, process.pid, processStartTime);
    } else {
        return null;
    }
}

// function startWorkerHeartbeat(logger, config, environment){

// }

// function clearHeartbeat(heartbeatReference){
//      clearInterval(heartbeatReference);
// }

/*
    sendHeartbeat()
    Sends a heartbeat message to JDS
    Parameters:
       logger: The logger
       config: The configuration
       environment: The environment
       processName: The name of the process
       profile: The name of the process' profile (applicable to subscriberHost and pollerHost only)
       processId: The id of the process
       processStartTime: The time when the process started in YYYYMMDDHHmmss format
       callback: (OPTIONAL) The callback to call when the function is complete
*/
function sendHeartbeat(logger, config, environment, processName, profile, processId, startTime, callback) {
    logger.debug('healthcheck-utils.sendHeartbeat(): Sending heartbeat to JDS for process (name: %s, id: %s)', processName, processId);

    if (!processName) {
        logger.error('healthcheck-utils(name: %s, id: %s).sendHeartbeat(): processName is null or undefined. Cannot send heartbeat.', processName, processId);
        return;
    }

    var heartbeat = {
        _id: processName,
        profile: profile,
        process: processId,
        processStartTime: startTime,
        heartbeatTime: moment().format('YYYYMMDDHHmmss'),
    };

    environment.jds.storeOperationalDataMutable(heartbeat, function(err, response) {
        if (err) {
            logger.error('healthcheck-utils(name: %s, id: %s).sendHeartbeat(): Error sending heartbeat. Error: %s', processName, processId, err);
        } else {
            logger.debug('healthcheck-utils(name: %s, id: %s).sendHeartbeat(): Heartbeat sent.', processName, processId);
        }

        if (callback) {
            callback(err, response);
        }
    });
}

/*
    retrieveHeartbeats()
    Retrieve all heartbeat messages from JDS
    Parameters:
       logger: The logger
       config: The configuration
       environment: The environment
       callback: The callback to call when the function is complete
*/
function retrieveHeartbeats(logger, config, environment, callback) {
    logger.debug('healthcheck-utils.retreiveHeartbeats(): Entering method');

    environment.jds.getOperationalDataMutableByFilter('?filter=exists(\"heartbeatTime\")', function(error, response, result) {
        if (error) {
            logger.error('healthcheck-utils.retreiveHeartbeats(): Got error from JDS: %s', error);
            callback('FailedJdsError');
        } else if (!response) {
            logger.error('healthcheck-utils.retreiveHeartbeats(): Response is null or undefined');
            callback('FailedJdsNoResponse');
        } else if (response.statusCode !== 200) {
            logger.error('healthcheck-utils.retreiveHeartbeats(): Unexpected statusCode received from JDS: %s', response.statusCode);
            callback('FailedJdsWrongStatusCode');
        } else if (!result) {
            logger.error('healthcheck-utils.retreiveHeartbeats(): Result is null or undefined');
            callback('FailedJdsNoResult');
        } else {
            logger.trace('healthcheck-utils.retreiveHeartbeats(): Got result from JDS: %j', result);
            callback(null, result);
        }
    });
}

/*
    retrieveStaleHeartbeats()
    Retrieve all heartbeat messages from JDS,
    then filter out those that indicate healthy processes,
    leaving only the heartbeat messages for unhealthy processes.
    Parameters:
       logger: The logger
       config: The configuration
       environment: The environment
       currentMoment: (Moment object) The current time (used to determine whether heartbeat messages are stale)
       callback: The callback to call when the function is complete
*/
function retrieveStaleHeartbeats(logger, config, environment, currentMoment, callback) {
    logger.debug('healthcheck-utils.retreiveStaleHeartbeats(): Entering method. currentMoment: %s', currentMoment);

    var currentTime = currentMoment;
    var staleTime = currentTime.clone();
    var staleAgeMillis = config.healthcheck.heartbeatStaleAgeMillis;
    staleTime.subtract(staleAgeMillis, 'milliseconds');
    logger.debug('healthcheck-utils.retreiveStaleHeartbeats(): staleAgeMillis: %s staleTime: %s', staleAgeMillis, staleTime);

    retrieveHeartbeats(logger, config, environment, function(error, response) {
        if (error) {
            callback(error);
        } else {
            var staleHeartbeats = _.filter(response.items, function(heartbeat) {
                var heartbeatTime = moment(heartbeat.heartbeatTime, 'YYYYMMDDHHmmss');
                return heartbeatTime.isBefore(staleTime);
            });

            logger.debug('healthcheck-utils.retreiveStaleHeartbeats(): Found stale heartbeats: %j', staleHeartbeats);
            callback(null, staleHeartbeats);
        }
    });
}

module.exports = {
    startHeartbeat: startHeartbeat,
    sendHeartbeat: sendHeartbeat,
    retrieveHeartbeats: retrieveHeartbeats,
    retrieveStaleHeartbeats: retrieveStaleHeartbeats
};
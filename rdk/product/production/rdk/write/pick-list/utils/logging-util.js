/*jslint node: true */
'use strict';

/**
 * logs a info message
 *
 * @param log The logger
 * @param infoMsg The message you want to have logged
 */
module.exports.logInfo = function(log, infoMsg) {
    console.log("INFO: " + infoMsg); //Since logger won't print to console, do it here
    log.info("INFO: " + infoMsg);
};

/**
 * logs a debug message
 *
 * @param log The logger
 * @param debugMsg The message you want to have logged
 */
module.exports.logDebug = function(log, debugMsg) {
    //console.log("DEBUG: " + debugMsg); //Since logger won't print to console, do it here
    log.debug("DEBUG: " + debugMsg);
};

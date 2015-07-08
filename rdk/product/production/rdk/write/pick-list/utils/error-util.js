/*jslint node: true */
'use strict';

/**
 * logs an error and then throws the Exception using the errorMsg provided
 *
 * @param log The logger
 * @param errorMsg The message you want to have logged and the contents of the exception thrown.
 */
module.exports.throwError = function(log, errorMsg) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    throw errorMsg;
};


/**
 * logs an error using the specified logger and then invokes the callback function.<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param log The logger to call log.error with.
 * @param errorMsg The message you want to have logged.
 * @param handlerCallback The callback method you want invoked passing in errorMsg as the first argument.
 */
module.exports.handleError = function(log, errorMsg, handlerCallback) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    handlerCallback("ERROR: " + errorMsg);
};

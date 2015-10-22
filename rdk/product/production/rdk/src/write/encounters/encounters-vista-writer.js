'use strict';

var async = require('async');
var VistaJS = require('../core/VistaJS');
var filemanDateUtil = require('../../utils/fileman-date-converter');

var CARET = '^';

/**
 * Creates a new encounter in VistA.
 *
 * @param  {Object} writebackContext - context object which is shared across handlers
 * @param  {Object} callback - function to callback to
 *
 * @return The data from the newly created encounter
*/
module.exports.create = function(writebackContext, callback) {
    var logger = writebackContext.logger;

    async.series([
        function sendDataToVista(callback) {

            var rpcName = 'HMP PUT OPERATIONAL DATA';
            var patientIEN = writebackContext.pid;

            var rpcDataString = buildRpcDataString(writebackContext);
            logger.debug('Sending the following data string to ' + rpcName + ': ' + rpcDataString);

            var params =  {};
            params['"domain"'] = 'encounters';
            params['"data"'] = rpcDataString;

            // Call the RPC wrapper. A zero should be passed in as the first parameter
            // to indicate that we want to create a new encounter
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                [0, patientIEN, params],
                callback);

            logger.debug('Finished calling RPC');

        }
    ], function(err, data) {
        if(err) {
            logger.debug('An error occurred when calling the RPC wrapper: ' + err);
            return callback(err, data);
        }

        logger.debug('The RPC wrapper has finished executing, the response is: ' + data);

        writebackContext.vprModel = data;
        var error = err;

        return callback(error);
    });

};

/**
 * Updates an existing encounter in VistA.
 *
 * @param  {Object} writebackContext - context object which is shared across handlers
 * @param  {Object} callback - function to callback to
 *
 * @return The updated data from the given encounter
*/
module.exports.update = function(writebackContext, callback) {
    var logger = writebackContext.logger;
    var patientIEN = writebackContext.pid;

    async.series([
        function sendDataToVista(callback) {
            var rpcName = 'ORQPT MYRPC';
            var rpcDataString = buildRpcDataString(writebackContext);
            logger.debug('Sending the following data string to ' + rpcName + ': ' + rpcDataString);

            var params =  {};
            params['"domain"'] = 'encounters';
            params['"data"'] = rpcDataString;
            VistaJS.callRpc(
                writebackContext.logger,
                writebackContext.vistaConfig,
                rpcName,
                [0, patientIEN, params],
                callback);
        }
    ], function(err, data) {
        if(err) {
            return callback(err, data);
        }
        writebackContext.vprModel = null;  // TODO set this by the VistA response
        var error = null;  // TODO set error if trouble writing back
        return callback(error);
    });
};

/**
 * Takes an encounter model and builds a string of parameters to pass to an RPC.
 *
 * piece 1: patient IEN ~~~~~~~~~~~~~~~~~~~~~~~REMOVE?
 * piece 2: inpatient/outpatient
 * piece 3: facility IEN
 * piece 4: encounter date/time
 * piece 5: service category
 * piece 6: provider IEN
 * piece 7: encounter type
 * piece 8: encounter IEN
 * piece 9: diagnosis
 * piece 10: encounter comment number
 * piece 11: encounter comment
 *
 * @param  {Object} writebackContext - the context object that contains the encounter model
 *
 * @return A caret-delimited string of the encounter model data.
*/
function buildRpcDataString(writebackContext) {
    var logger = writebackContext.logger;
    var model = writebackContext.model;

    // encounter fields
    var facilityIEN = model.facilityIEN;
    var isInPatient = model.isInPatient;
    var encounterDateTime = filemanDateUtil.getFilemanDateWithArgAsStr(model.encounterDateTime); //model.visitDateTime;    // TODO convert to fileman format?
    var serviceCategory = model.serviceCategory;
    // var serviceConnected = model.serviceConnected;  // TODO understand why this field doesn't need to be passed into the RPC
    // var diagnosis = model.diagnosis;    // TODO understand why this field doesn't need to be passed into the RPC
    // var procedure = model.procedure;    // TODO understand why this field doesn't need to be passed into the RPC
    var providerIEN = 983;  // TODO add this field to the model and remove hard-coded value
    var encounterType = model.encounterType;
    var encounterIEN = model.encounterIEN;
    var encounterResultCode = model.encounterResult;
    var encounterCommentNumber = model.commentNumber;   // TODO determine how client can pass in multiple comments
    var encounterComment = model.comment;   // TODO determine how client can pass in multiple comments

    // var hard_coded_rpcDelimitedStr = '3^0^32^3150202.171126^X^983^CPT^78468^1^1^testcomment';
    //logger.debug('Hard-coded RPC data string: ' + hard_coded_rpcDelimitedStr);

    var rpcDataString = isInPatient + CARET + facilityIEN + CARET + encounterDateTime + CARET + serviceCategory + CARET + providerIEN + CARET +
                        encounterType + CARET + encounterIEN + CARET + encounterResultCode + CARET + encounterCommentNumber + CARET + encounterComment;

    logger.debug('rpcDataString=' + rpcDataString);

    return rpcDataString;
}


'use strict';

var async = require('async');
var VistaJS = require('../core/VistaJS');
var filemanDateUtil = require('../../utils/fileman-date-converter');

function immunizationFromModel(model) {
    model.visitDate = filemanDateUtil.getFilemanDateWithArgAsStr(model.visitDate);
    model.encounterLocation = model.encounterLocation || '';
    model.encounterTime = model.encounterTime ? filemanDateUtil.getFilemanDateWithArgAsStr(model.encounterTime) : '';
    model.inpatientEncounter = model.inpatientEncounter ? 1 : 0;
    model.cptCodes = model.cptCodes ? 1 : 0;
    model.reaction = model.reaction ? 1 : 0;
    model.contraindicated = model.contraindicated ? 1 : 0;
    model.series = model.series ? model.series : '';
    model.comment = model.comment || '@';
    model.action = model.action || 'add';

    return model;
}

function constructRpcArgs(immunization) {
    var retVal =  {};

    retVal[1] = 'HDR^' + immunization.inpatientEncounter + '^' +
        immunization.cptCodes + '^' + immunization.encounterLocation + ';' +
        immunization.dfn + ';' + immunization.encounterServiceCategory;
    retVal[2] = 'VST^DT^' + immunization.visitDate;
    retVal[3] = 'VST^PT^' + immunization.dfn;
    retVal[4] = 'VST^VC^' + immunization.encounterServiceCategory;
    retVal[5] = 'IMM' + (immunization.action === 'delete' ? '-' : '+') + '^' +
        immunization.immunizationIEN + '^^^' + immunization.series + '^^' +
        immunization.reaction + '^' + immunization.contraindicated + '^^1';
    retVal[6] = 'COM^1^' + immunization.comment;

    return retVal;
}

module.exports.create = function(writebackContext, callback) {
    var logger = writebackContext.logger;
    var vistaConfig = writebackContext.vistaConfig;
    var immunization = immunizationFromModel(writebackContext.model);
    logger.debug({immunizationModel: immunization});

    var rpcArgs = constructRpcArgs(immunization);
    logger.debug({rpcArgs: rpcArgs});

    VistaJS.callRpc(logger, vistaConfig, 'PX SAVE DATA', rpcArgs, '','HMP','HMP', function(err, results) {
        if (err) {
            logger.error({rpcError: err});
            return callback(err, results);
        }

        logger.debug({results: results});
        writebackContext.vprResponse = {items: results};
        writebackContext.vprModel = results;
        return callback(null);
    });
};

module.exports._constructRpcArgs = constructRpcArgs;
module.exports._immunizationFromModel = immunizationFromModel;

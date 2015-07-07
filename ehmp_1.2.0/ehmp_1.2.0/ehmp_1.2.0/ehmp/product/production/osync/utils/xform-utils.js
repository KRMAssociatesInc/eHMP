'use strict';

require('../env-setup');
var _ = require('underscore');
var JLVTerminologySystem = require(global.OSYNC_UTILS + 'JLVTerminologySystem');

function transformCodes(dodCodes){

    var xformCodes = [];

    if(!dodCodes || !_.isArray(dodCodes)) {return xformCodes;}

    var codeList = [];

    if (!_.isArray(dodCodes)) {
        codeList[0] = dodCodes;
    } else {
        codeList = dodCodes;
    }

    _.each(codeList, function(codeObject) {
        if (!_.isEmpty(codeObject)) {
            var xformCode = {};

            if(codeObject.code) {xformCode.code = codeObject.code;}
            if(codeObject.display) {xformCode.display = codeObject.display;}
            if(codeObject.system) {xformCode.system = JLVTerminologySystem.getTermSystemOidOrUrn(codeObject.system) || codeObject.system;}

            xformCodes.push(xformCode);
        }
    });

    return xformCodes;
}

module.exports.transformCodes = transformCodes;
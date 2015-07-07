'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');
var nc = require('namecase');

function dodProblemToVPR(dodRecord, edipi) {
	var vprProblems = {};

	vprProblems.codes = xformUtils.transformCodes(dodRecord.codes);

	vprProblems.facilityCode = 'DOD';
	vprProblems.facilityName = 'DOD';

	vprProblems.locationName = dodRecord.hospitalLocation;

    if(dodRecord.hospitalLocation){
    	vprProblems.locationDisplayName = nc(dodRecord.hospitalLocation);
    }

    if (_.isNull(dodRecord.description) || _.isUndefined(dodRecord.description)) {
    	vprProblems.problemText = 'NULL';
    	vprProblems.summary = 'NULL';
    } else {
    	vprProblems.problemText= dodRecord.description;
    	vprProblems.summary = dodRecord.description;
    }

	vprProblems.providerName = dodRecord.enteredBy;
	vprProblems.providerDisplayName = dodRecord.enteredBy;

	vprProblems.icdCode = dodRecord.icdCode;

	vprProblems.statusName= dodRecord.status;

    if(dodRecord.status) {
	   vprProblems.statusDisplayName = nc(dodRecord.status);
    }

	vprProblems.acuityName = dodRecord.acuity;

	if (_.isNull(dodRecord.serviceConnected) || _.isUndefined(dodRecord.serviceConnected)) {
		vprProblems.serviceConnected = false;
	} else {
		vprProblems.serviceConnected = dodRecord.serviceConnected;
	}

	vprProblems.kind='Problem';

	if(!_.isNull(dodRecord.enteredDate) && !_.isUndefined(dodRecord.enteredDate)){
		vprProblems.entered = moment(dodRecord.enteredDate, 'x').format('YYYYMMDDHHmmss');
 	}

	if(!_.isNull(dodRecord.lastModifiedDate) && !_.isUndefined(dodRecord.lastModifiedDate)){
		vprProblems.updated = moment(dodRecord.lastModifiedDate, 'x').format('YYYYMMDDHHmmss');
 	}

	if(!_.isNull(dodRecord.onsetDate) && !_.isUndefined(dodRecord.onsetDate)){
		vprProblems.onset = moment(dodRecord.onsetDate, 'x').format('YYYYMMDDHHmmss');
 	}

	vprProblems.uid = uidUtils.getUidForDomain('problem', 'DOD', edipi, dodRecord.cdrEventId);

	if(!_.isNull(dodRecord.notes) && !_.isUndefined(dodRecord.notes)){
		vprProblems.comments = _.map(dodRecord.notes, function(note) {
            return {
                comment: note.noteText,
            };
        });
 	}

	vprProblems.pid = 'DOD;' + edipi;

	return vprProblems;
}


module.exports = dodProblemToVPR;
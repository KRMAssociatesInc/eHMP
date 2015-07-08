'use strict';

//------------------------------------------------------------------------------------
// This is a module with utility functions for helping with record enrichment
// transformations.
//
// Author: Les Westberg
//------------------------------------------------------------------------------------

var _ = require('underscore');

var CLINICIAN_ROLE = {
        /**
         * @see "VistA FileMan TIU DOCUMENT,ENTERED BY(8925,1302)"
         */
        ENTERER: 'E',
        /**
         * @see "VistA FileMan TIU DOCUMENT,AUTHOR/DICTATOR(8925,1202)"
         */
        AUTHOR_DICTATOR: 'AU',
        /**
         * @see "VistA FileMan TIU DOCUMENT,EXPECTED SIGNER(8925,1204)"
         */
        EXPECTED_SIGNER: 'ES',
        /**
         * @see "VistA FileMan TIU DOCUMENT,EXPECTED COSIGNER(8925,1208)"
         */
        EXPECTED_COSIGNER: 'EC',
        /**
         * @see "VistA FileMan TIU DOCUMENT,SIGNED BY(8925,1502)"
         */
        SIGNER: 'S',
        /**
         * @see "VistA FileMan TIU DOCUMENT,COSIGNED BY(8925,1508)"
         */
        COSIGNER: 'C',
        /**
         * @see "VistA FileMan TIU DOCUMENT,ATTENDING PHYSICIAN(8925,1209)"
         */
        ATTENDING_PHYSICIAN: 'ATT',
        /**
         * @see "VistA FileMan TIU MULTIPLE SIGNATURE(8925.7)"
         */
        ADDITIONAL_SIGNER: 'X'
};


//------------------------------------------------------------------------------------
// This method creates the value of the summary based on the information passed in the
// record.
//
// summaryName:  The name of the summary.  In the previous EHMP system this was the
//               class name of the record.  In order to keep consistent this should
//               be the same class name that was used previously.
// record: This is the data record.  Note this could also be a child node within
//         the record.  But note that a child node will not have a UID.  But that is
//         consistent with the way it was done in the previous EHMP.
//-----------------------------------------------------------------------------------
function getSummary(summaryName, record) {
	var summary = '';

	if (record) {
		if (summaryName) {
			summary = summaryName;
		}

		if (_.isString(record.uid)) {
			summary += '{uid=\'' + record.uid + '\'}';
		}
		else {
			summary += '{uid=\'\'}';
		}
	}

	return summary;
}

//-----------------------------------------------------------------------------------
// This method will update the codes array in the record with the terminology
// mapping information.
//
// targetCodeSystem: This will be the code system of the code we are wanting.
// jlvTerminologyMappingType: This is the type of mapping that will be performed if
//                            we do not find the code for the targetCodeSystem in the
//                            codes array.
// sourceCode: This is the source terminology code that we are trying to map to.
// record: The data event record.
// terminologyUtils: A handle to the terminologyUtils module.  (Passed in so we can
//                   override it for a unit test)
// callback: The callback handler to call when the terminology code is retrieved.
//           function (error, jlvMappedCode) where:
//               error: The error if one occurs.
//               jlvMappedCode: The code obtained from the terminology system.
//-----------------------------------------------------------------------------------
function retrieveMappedTerminoloyCodeInfo(targetCodeSystem, jlvTerminologyMappingType, sourceCode, record, log, terminologyUtils, callback) {
	log.debug('record-enrichment-xformer-utils.retrieveMappedTerminoloyCodeInfo: Entered method.  targetCodeSystem: %s; jlvTerminologyMappingType: %s; sourceCode: %s; record: %j', targetCodeSystem, jlvTerminologyMappingType, sourceCode, record);
	if (!recordContainsCode(targetCodeSystem, record)) {
		log.debug('record-enrichment-xformer-utils.retrieveMappedTerminoloyCodeInfo: Code did not exist - looking up terminology code now.  targetCodeSystem: %s; jlvTerminologyMappingType: %s; sourceCode: %s; record: %j', targetCodeSystem, jlvTerminologyMappingType, sourceCode, record);
		terminologyUtils.getJlvMappedCode(jlvTerminologyMappingType, sourceCode, function (error, jlvMappedCode) {
			log.debug('record-enrichment-xformer-utils.retrieveMappedTerminoloyCodeInfo: Returned from getJlvMappedCode() error: %s; jlvMappedCode: %j', error, jlvMappedCode);

			return callback(error, jlvMappedCode);
		});
	} else {
		log.debug('record-enrichment-xformer-utils.retrieveMappedTerminoloyCodeInfo: Code already existed in record - no mapping was done.  targetCodeSystem: %s; jlvTerminologyMappingType: %s; sourceCode: %s; record: %j', targetCodeSystem, jlvTerminologyMappingType, sourceCode, record);
		return setTimeout(callback, 0, null, null);
	}
}

//-----------------------------------------------------------------------------------
// This method returns true if the given record has a code in the codes attribute for
// the given code system.  False if it does not.
//
// targetCodeSystem: The terminology code system to look for.
// record: The data event record to check.
//-----------------------------------------------------------------------------------
function recordContainsCode(targetCodeSystem, record) {
	if ((!record) || (!record.codes)) {
		return false;
	}

	var foundCode = _.findWhere(record.codes, { system: targetCodeSystem });

	if (!foundCode) {
		return false;
	}

	return true;
}

//-----------------------------------------------------------------------------------
// This routine strips off the prefix of a vuid urn if it exists.
//
// vuidUrn: The urn for the vuid
// returns: The vuid without the urn wrapper.
//-----------------------------------------------------------------------------------
function stripUrnFromVuid (vuidUrn) {
	var returnValue = vuidUrn;

	if ((vuidUrn) && (vuidUrn.indexOf('urn:va:vuid:') === 0)) {
		returnValue = vuidUrn.substring('urn:va:vuid:'.length);
	}

	return returnValue;
}

//------------------------------------------------------------------------------------
// This method converts a code that is in the form of a JlvMappedCode to be in the
// form of a code that is stored in JDS.
//
// jlvMappedCode: The code as it is returned from the jlv mapping routines.
// returns: jdsCode - A code in the format that it can be stored in JDS.
//------------------------------------------------------------------------------------
function convertMappedCodeToJdsCode (jlvMappedCode) {
	if (jlvMappedCode) {
		var jdsCode = {
			system: jlvMappedCode.codeSystem,
			code: jlvMappedCode.code,
			display: jlvMappedCode.displayText
		};
		return jdsCode;
	} else {
		return null;
	}
}

module.exports.getSummary = getSummary;
module.exports.retrieveMappedTerminoloyCodeInfo = retrieveMappedTerminoloyCodeInfo;
module.exports.recordContainsCode = recordContainsCode;
module.exports.stripUrnFromVuid = stripUrnFromVuid;
module.exports.convertMappedCodeToJdsCode = convertMappedCodeToJdsCode;
module.exports.CLINICIAN_ROLE = CLINICIAN_ROLE;
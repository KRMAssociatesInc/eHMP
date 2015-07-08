'use strict';

require('../../env-setup');

//--------------------------------------------------------------------------
// This module is a utility with functions to simplify the SOLR 
// transformations.
//
// @Author: Les Westberg
//--------------------------------------------------------------------------

var _ = require('underscore');
var mapUtil = require(global.VX_UTILS + 'map-utils');

//---------------------------------------------------------------------------------
// This method will set a simple value (ignoring type) with the given solrPropName
// in the solrRecord to the vprPropName field in the vprRecord.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
//----------------------------------------------------------------------------------
function setSimpleFromSimple(solrRecord, solrPropName, vprRecord, vprPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (vprRecord[vprPropName] !== undefined) && (vprRecord[vprPropName] !== null)) {
    	solrRecord[solrPropName] = vprRecord[vprPropName];
    }
}

//---------------------------------------------------------------------------------
// This method will set a simple string value with the given solrPropName
// in the solrRecord to the given value.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// value: The value to set it to.
//----------------------------------------------------------------------------------
function setStringFromValue(solrRecord, solrPropName, value) {
    if ((_.isObject(solrRecord)) && (_.isString(value))) {
    	solrRecord[solrPropName] = value;
    } else if ((_.isObject(solrRecord)) && ((_.isNumber(value) || _.isBoolean(value)))) {
    	solrRecord[solrPropName] = String(value);
    }
}


//--------------------------------------------------------------------------
// This method will set a simple string value with the given solrPropName
// in the solrRecord to the vprPropName field in the vprRecord.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
//---------------------------------------------------------------------------
function setStringFromSimple(solrRecord, solrPropName, vprRecord, vprPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isString(vprRecord[vprPropName]))) {
    	solrRecord[solrPropName] = vprRecord[vprPropName];
    } else if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && ((_.isNumber(vprRecord[vprPropName]) || _.isBoolean(vprRecord[vprPropName])))) {
    	solrRecord[solrPropName] = String(vprRecord[vprPropName]);
    }
}

//--------------------------------------------------------------------------
// This method will add a simple string value to the given solrPropName
// in the solrRecord to the vprPropName field in the vprRecord.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
//---------------------------------------------------------------------------
function addStringFromSimple(solrRecord, solrPropName, vprRecord, vprPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isString(vprRecord[vprPropName]))) {
    	if (_.isArray(solrRecord[solrPropName])) {
    		solrRecord[solrPropName] = solrRecord[solrPropName].concat(vprRecord[vprPropName]);
    	} else {
	    	solrRecord[solrPropName] = [vprRecord[vprPropName]];
    	}
    }
}

//--------------------------------------------------------------------------
// This method will set a simple string array with the given solrPropName
// in the solrRecord to the vprPropName field in the vprRecord.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
//---------------------------------------------------------------------------
function setStringArrayFromSimple(solrRecord, solrPropName, vprRecord, vprPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isString(vprRecord[vprPropName]))) {
    	solrRecord[solrPropName] = [vprRecord[vprPropName]];
    } else if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && ((_.isNumber(vprRecord[vprPropName]) || _.isBoolean(vprRecord[vprPropName])))) {
    	solrRecord[solrPropName] = [String(vprRecord[vprPropName])];
    }
}

//--------------------------------------------------------------------------
// This method will set a simple string array with the given solrPropName
// in the solrRecord by looping through the array of objects in the vprPropName
// and extracting the value at the vprChildPropName field.  It creates an array
// of these and sets the field in the SOLR record to this array.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
// vprChildPropName: The VPR property in the vpr child object.
//---------------------------------------------------------------------------
function setStringArrayFromObjectArrayField(solrRecord, solrPropName, vprRecord, vprPropName, vprChildPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isArray(vprRecord[vprPropName])) && (!_.isEmpty(vprRecord[vprPropName]))) {
        var list = mapUtil.filteredMap(vprRecord[vprPropName], function(item) {
            if ((_.isObject(item)) && (_.isString(item[vprChildPropName])) && (!_.isEmpty(item[vprChildPropName]))) {
                return item[vprChildPropName];
            } else {
                return null;
            }
        }, [null, undefined]);

        if (!_.isEmpty(list)) {
            solrRecord[solrPropName] = list;
        }
    }
}

//--------------------------------------------------------------------------
// This method will set a simple string array with the given solrPropName
// in the solrRecord by looping through the array of objects in the vprPropName
// and extracting the values at the vprChildPropName1 and vprChildPropName2 
// field and concatenating them with the given delimieter.  It creates an array
// of these and sets the field in the SOLR record to this array.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
// vprChildPropName1: The VPR property in the vpr child object.
// vprChildPropName2: The VPR property in the vpr child object.
// delimiter: The delimiter to use between the two properties
//---------------------------------------------------------------------------
function setStringArrayFromObjectArrayFields(solrRecord, solrPropName, vprRecord, vprPropName, vprChildPropName1, vprChildPropName2, delimiter) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isArray(vprRecord[vprPropName])) && (!_.isEmpty(vprRecord[vprPropName]))) {
        var list = mapUtil.filteredMap(vprRecord[vprPropName], function(item) {
        	var text = '';
            if ((_.isObject(item)) && (_.isString(item[vprChildPropName1])) && (!_.isEmpty(item[vprChildPropName1]))) {
                text = item[vprChildPropName1];
            }
            if ((_.isObject(item)) && (_.isString(item[vprChildPropName2])) && (!_.isEmpty(item[vprChildPropName2]))) {
            	if (text.length > 0) {
            		text += delimiter;
            	}
                text += item[vprChildPropName2];
            }

            if (text.length > 0) {
            	return text;
            } else {
                return null;
            }
        }, [null, undefined]);

        if (!_.isEmpty(list)) {
            solrRecord[solrPropName] = list;
        }
    }
}

//--------------------------------------------------------------------------
// This method will set a simple string array with the given solrPropName
// in the solrRecord by looping through the array of array of objects in the vprPropName
// and extracting the value at the vprChildPropName field.  It creates an array
// of these and sets the field in the SOLR record to this array.  It verifies
// the existence of the field before attempting to set the solr value.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
// vprChildPropName: The child property in the vprPropName object.
// vprGrandChildPropName: The child property in the vprChildPropName object.
//---------------------------------------------------------------------------
function setStringArrayFromObjectArrayArrayField(solrRecord, solrPropName, vprRecord, vprPropName, vprChildPropName, vprGrandChildPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isArray(vprRecord[vprPropName])) && (!_.isEmpty(vprRecord[vprPropName]))) {
    	var list = [];
    	_.each(vprRecord[vprPropName], function(vprChild) {
	        var childList = mapUtil.filteredMap(vprChild[vprChildPropName], function(item) {
	            if ((_.isObject(item)) && (_.isString(item[vprGrandChildPropName])) && (!_.isEmpty(item[vprGrandChildPropName]))) {
	                return item[vprGrandChildPropName];
	            } else {
	                return null;
	            }
	        }, [null, undefined]);
	        if (!_.isEmpty(childList)) {
	        	list = list.concat(childList);
	        }
    	});

        if (!_.isEmpty(list)) {
            solrRecord[solrPropName] = list;
        }
    }
}

//--------------------------------------------------------------------------
// This method will set a string to be the value of the primary provider's
// name from a list of providers.
//
// solrRecord: The SOLR record that is being updated.
// solrPropName: The name of the SOLR property field to be updated.
// vprRecord: The VPR record to extract the data from.
// vprPropName: The VPR property in the VPR record to extract the data from.
// vprChildPropName: The VPR property in the vpr child object.
//---------------------------------------------------------------------------
function setStringFromPrimaryProviders(solrRecord, solrPropName, vprRecord, vprPropName, vprChildPropName) {
    if ((_.isObject(solrRecord)) && (_.isObject(vprRecord)) && (_.isArray(vprRecord[vprPropName])) && (!_.isEmpty(vprRecord[vprPropName]))) {
    	var primaryProvider = _.find(vprRecord[vprPropName], function(provider) {
            return ((_.isObject(provider)) && (provider.primary === true) && (_.isString(provider[vprChildPropName])) && (!_.isEmpty(provider[vprChildPropName])));
    	});
        if (_.isObject(primaryProvider)) {
            solrRecord[solrPropName] = primaryProvider[vprChildPropName];
        }
    }
}


//-------------------------------------------------------------------------
// Fill in the fields common to all domain types.
//
// solrRecord: The place to put the SOLR fields.
// vprRecord: The record in VPR format.
//-------------------------------------------------------------------------
function setCommonFields(solrRecord, vprRecord) {
	setStringFromSimple(solrRecord, 'uid', vprRecord, 'uid');
	setStringFromSimple(solrRecord, 'pid', vprRecord, 'pid');
	setStringFromSimple(solrRecord, 'facility_code', vprRecord, 'facilityCode');
	setStringFromSimple(solrRecord, 'facility_name', vprRecord, 'facilityName');
	setStringFromSimple(solrRecord, 'kind', vprRecord, 'kind');
	setStringFromSimple(solrRecord, 'summary', vprRecord, 'summary');
	setStringArrayFromObjectArrayField(solrRecord, 'codes_code', vprRecord, 'codes', 'code');
	setStringArrayFromObjectArrayField(solrRecord, 'codes_system', vprRecord, 'codes', 'system');
	setStringArrayFromObjectArrayField(solrRecord, 'codes_display', vprRecord, 'codes', 'display');
	setDateTimes(solrRecord, vprRecord);
}

//----------------------------------------------------------------------------
// Fill in the datetimes fields including the datetime_all array field with
// the appropriate dates and times
//
// solrRecord: The place to put the SOLR fields.
// vprRecord: The record in VPR format.
//----------------------------------------------------------------------------
function setDateTimes(solrRecord, vprRecord) {

	setStringFromSimple(solrRecord, 'reference_date_time', vprRecord, 'referenceDateTime');

	setStringFromSimple(solrRecord, 'visit_date_time', vprRecord, 'visitDateTime');

	setStringFromSimple(solrRecord, 'observed', vprRecord, 'observed');

	setStringFromSimple(solrRecord, 'resulted', vprRecord, 'resulted');

	setStringFromSimple(solrRecord, 'entered', vprRecord, 'entered');

	setStringFromSimple(solrRecord, 'updated', vprRecord, 'updated');

	setStringFromSimple(solrRecord, 'resolved', vprRecord, 'resolved');

	setStringFromSimple(solrRecord, 'onset', vprRecord, 'onset');

	setStringFromSimple(solrRecord, 'stopped', vprRecord, 'stopped');

	setStringFromSimple(solrRecord, 'overall_start', vprRecord, 'overallStart');

	setStringFromSimple(solrRecord, 'overall_stop', vprRecord, 'overallStop');

	setStringFromSimple(solrRecord, 'administered_date_time', vprRecord, 'administeredDateTime');

	setStringFromSimple(solrRecord, 'procedure_date_time', vprRecord, 'procedureDateTime');

	setStringFromSimple(solrRecord, 'order_start_date_time', vprRecord, 'start');

	setStringFromSimple(solrRecord, 'health_factor_date_time', vprRecord, 'healthFactorDateTime');

	setStringFromSimple(solrRecord, 'document_entered', vprRecord, 'documentEntered');

	setStringFromSimple(solrRecord, 'obs_entered', vprRecord, 'obsEntered');
}

module.exports.setSimpleFromSimple = setSimpleFromSimple;
module.exports.setStringFromValue = setStringFromValue;
module.exports.setStringFromSimple = setStringFromSimple;
module.exports.addStringFromSimple = addStringFromSimple;
module.exports.setStringArrayFromSimple = setStringArrayFromSimple;
module.exports.setStringArrayFromObjectArrayField = setStringArrayFromObjectArrayField;
module.exports.setStringArrayFromObjectArrayFields = setStringArrayFromObjectArrayFields;
module.exports.setStringArrayFromObjectArrayArrayField = setStringArrayFromObjectArrayArrayField;
module.exports.setStringFromPrimaryProviders = setStringFromPrimaryProviders;
module.exports.setCommonFields = setCommonFields;


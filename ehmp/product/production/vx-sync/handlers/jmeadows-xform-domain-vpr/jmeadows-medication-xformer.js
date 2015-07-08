'use strict';

var _ = require('underscore');
var uidUtils = require(global.VX_UTILS + 'uid-utils');
var xformUtils = require(global.VX_UTILS + 'xform-utils');
var moment = require('moment');

/*
    dodMedicationToVPR
    Transforms a single medication event from DOD to VPR format

    Parameters:
    dodMedication - a single medication in dod format, transliterated directly to JSON
    edipi - the patient's edipi, required for generating the uid

    Returns:
    vprMedication - a single medication object in VPR format
*/

function dodMedicationToVPR(dodMedication, edipi){
    var vprMedication = {};


    vprMedication.codes = xformUtils.transformCodes(dodMedication.codes);
    vprMedication.medStatus=dodMedication.active;
    vprMedication.medType=dodMedication.medType;
    vprMedication.patientInstruction=dodMedication.comment;
    vprMedication.productFormName=dodMedication.drugName;
    vprMedication.productFormCode=dodMedication.medId;
    vprMedication.name=dodMedication.drugName;
    vprMedication.facilityName='DOD';
    vprMedication.facilityCode='DOD';
    vprMedication.sig=dodMedication.sigCode;
	vprMedication.uid=uidUtils.getUidForDomain('med', 'DOD', edipi, dodMedication.cdrEventId);
    vprMedication.pid='DOD;'+edipi;

    if(!_.isNull(dodMedication.active)){
    	vprMedication.vaStatus=dodMedication.active;
    }
    else{
    	vprMedication.vaStatus='Unknown';
    }

    if(!_.isNull(dodMedication.fillOrderDate)){
		vprMedication.overallStart=moment(dodMedication.fillOrderDate, 'x').format('YYYYMMDDHHmmss');
    }

 	if(!_.isNull(dodMedication.stopDate)){
    	vprMedication.overallStop=moment(dodMedication.stopDate, 'x').format('YYYYMMDDHHmmss');
 	}

    if(dodMedication.medType && (dodMedication.medType.toUpperCase().valueOf()=='I' || dodMedication.medType.toUpperCase().valueOf()=='O'
       ||dodMedication.medType.toUpperCase().valueOf()=='N' || dodMedication.medType.toUpperCase().valueOf()=='V'
    	||dodMedication.medType.toUpperCase().valueOf()=='IMO' || dodMedication.medType.toUpperCase().valueOf()=='SUPPLY'
    	||dodMedication.medType.toUpperCase().valueOf()=='UNKNOWN')){
    	vprMedication.vaType=dodMedication.medType.toUpperCase();
    }
    else{
    	vprMedication.vaType='UNKNOWN';
    }

    vprMedication.fills = _.map(dodMedication.prescriptionFills, function(fill){
        return {
            dispenseDate: moment(fill.dispenseDate, 'x').format('YYYYMMDDHHmmss'),
            quantityDispensed: fill.dispensingQuantity,
            dispensingPharmacy: fill.dispensingPharmacy
        };
    });

    vprMedication.products=_.map([dodMedication], function(){
    	return{
    		suppliedName: dodMedication.drugName
    	};
    });

    vprMedication.orders=_.map([dodMedication],function(){
        if (dodMedication.orderingProvider && dodMedication.orderingProvider.name) {
            return {
                daysSupply: dodMedication.daysSupply,
                quantityOrdered: dodMedication.quantity,
                fillsRemaining: dodMedication.refills,
                providerName: dodMedication.orderingProvider.name
            };
        }else {
            return {
                daysSupply: dodMedication.daysSupply,
                quantityOrdered: dodMedication.quantity,
                fillsRemaining: dodMedication.refills
            };
        }
    });

    return vprMedication;
}

module.exports = dodMedicationToVPR;
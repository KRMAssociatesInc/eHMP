'use strict';

var helpers = require('../utils/helpers.js'),
    rdk = require('../../../rdk/rdk'),
    nullchecker = rdk.utils.nullchecker,
    fhirUtils = require('../utils/fhirUtils'),
    //var utils = require('../utils/fhirUtils.js');
    _ = rdk.utils.underscore,
    referralmap = {
        status: {
            'ACTIVE': 'active',
            'CANCELLED': 'cancelled',
            'EXPIRED': 'cancelled',
            'COMPLETE': 'completed',
            'SCHEDULED': 'sent',
            _DEFAULT_: 'draft'
        },
        encounter_status: {
            'SCHEDULED': 'planned',
            'DISCONTINUED': 'cancelled',
            'COMPLETE': 'finished',
            'HOLD': 'onleave',
            'EXPIRED': 'cancelled',
            _DEFAULT_: 'planned'
        },
        encounter_class: {
            'urn:va:patient-class:AMB': 'ambulatory',
            'urn:va:patient-class:INP': 'inpatient',
            _DEFAULT_: 'ambulatory'

        }
    };

_.mixin({
    compactObject: function(o) {
        _.each(o, function(v, k) {
            if (!v || (JSON.stringify(o[k]) === '{}')) {
                delete o[k];
            }
        });
        return o;
    }
});


function objectFactory(objType, item) {
    var obj = new FactoryObject();
    if (obj[objType]) {
        return obj[objType](item);
    } else {
        return null;
    }
}
module.exports.referralrequestFactory = objectFactory;


var FactoryObject = function() {};

FactoryObject.prototype = {
    ReferralRequestItem: BuildItem
};


function BuildItem(item) {
    var contained_and_refs = new BuildContained_and_refs(item);
    var ret = {
        _id: item.uid,
        text: item.summary,
        resourceType: 'ReferralRequest',
        status: referralmap.status[item.statusName] || referralmap.status._DEFAULT_,
        identifier: {
            system: 'urn:oid:2.16.840.1.113883.6.233',
            value: item.uid
        },
        type: {
            text: item.consultProcedure
        },
        speciality: {
            text: item.service
        },
        priority: {
            text: item.urgency
        },
        subject: {
            reference: 'Patient/' + item.pid
        },
        requester: {
            reference: 'Patient/' + item.pid
        },
        recipient: {
            reference: '#' + _.findWhere(contained_and_refs, {
                resourceType: 'Practitioner'
            })._id
        },
        encounter: {
            reference: '#' + _.findWhere(contained_and_refs, {
                resourceType: 'Encounter'
            })._id
        },
        dateSent: fhirUtils.convertToFhirDateTime(item.dateTime),
        reason: {
            text: item.reason
        },
        serviceRequested: {
            text: item.service
        },
        contained: contained_and_refs,
        extension: new BuildExtensions(item)
    };
    return _.compactObject(ret);
}


function BuildContained_and_refs(item) {
    var contained = [];
    var location = new BuildLocation(item);
    var enc = new BuildEncounter(item);
    //add location reference
    enc.location = {
        reference: '#' + location.locationId
    };
    contained.push(location.location);
    contained.push(enc);
    contained.push(new BuildPractitioner(item));
    return contained;
}

function BuildPractitioner(item) {

    return {
        resourceType: 'Practitioner',
        _id: helpers.generateUUID(),
        name: item.providerName,
        identifier: {
            value: item.providerUid,
            system: 'urn:oid:2.16.840.1.113883.6.233'
        }
    };

}

function BuildLocation(item) {
    var locationId = helpers.generateUUID();
    this.location = {
        resourceType: 'Location',
        _id: locationId,
        Name: item.facilityName,
        identifier: {
            value: item.facilityCode,
            system: 'urn:oid:2.16.840.1.113883.6.233'
        }
    };
    this.locationId = locationId;
    return this;
}

function BuildEncounter(item) {
    return {
        resourceType: 'Encounter',
        _id: helpers.generateUUID(),
        text: {
            status: 'generated',
            div: '<div>Encounter with patient ' + item.pid + '</div>'
        },
        status: referralmap.encounter_status[item.statusName] || referralmap.encounter_status._DEFAULT_,
        class: referralmap.encounter_class[item.patientClassCode] || referralmap.encounter_class._DEFAULT_
    };
}


function BuildExtensions(obj) {
    var ret = [];

    for (var i = 0, k = Object.keys(obj), l = k.length; i < l; i++) {
        var ext = new Extension(obj, k[i]);
        if (!helpers.isEmpty(ext)) {
            if (ext instanceof Array) {
                for (var j = ext.length - 1; j >= 0; j--) {
                    ret.push(ext[j]);
                }
            } else {
                ret.push(ext);
            }
        }
    }
    return ret;

}

function Extension(item, key) {
    switch (key) {
        case 'results':
            item[key][0].isResult = true;
            return new BuildExtensions(item[key][0]);
        case 'localTitle':
        case 'summary':
        case 'uid':
            if (item.isResult && nullchecker.isNotNullish(item[key])) {
                this.url = 'http://vistacore.us/fhir/extensions/consult#results_' + key;
                this.valueString = item[key];
            }
            break;
        case 'orderUid':
        case 'orderName':
        case 'localId':
        case 'patientClassName':
        case 'provisionalDx':
            if (nullchecker.isNotNullish(item[key])) {
                this.url = 'http://vistacore.us/fhir/extensions/consult#' + key;
                this.valueString = item[key];
            }
            break;
        default:
            break;
    }
    return this;
}

'use strict';

var helpers = require('../utils/helpers.js');
var rdk = require('../../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var fhirUtils = require('../utils/fhirUtils');
//var utils = require('../utils/fhirUtils.js');
var _ = rdk.utils.underscore;


function objectFactory(objType, item) {
    var obj = new FactoryObject();
    if (obj[objType]) {
        return obj[objType](item);
    } else {
        return null;
    }
}
module.exports.conditionFactory = objectFactory;


var FactoryObject = function() {};

FactoryObject.prototype = {
    ConditionItem: BuildConditionItem
};


function BuildConditionItem(item) {
    var contained_and_refs = new BuildContained_and_refs(item);
    var ret = {
        _id: item.uid,
        resourceType: 'Condition',
        status: 'confirmed',
        category: new BuildCategory(item),
        stage: new BuildStage(item),
        subject: {
            reference: item.pid
        },
        text: item.problemText,
        code: new BuildCode(item),
        asserter: {
            reference: '#' + _.findWhere(contained_and_refs, {
                resourceType: 'Practitioner'
            })._id,
            display: item.providerName
        },
        dateAsserted: fhirUtils.convertToFhirDateTime(item.entered),
        onsetDate: fhirUtils.convertToFhirDateTime(item.onset),
        contained: contained_and_refs,
        extension: new BuildExtensions(item)
    };
    if (nullchecker.isNotNullish(item.locationUid)) {
        ret.provider = {
            reference: '#' + item.locationUid
        };
    }
    if (nullchecker.isNotNullish(item.resolved)) {
        ret.abatementDate = fhirUtils.convertToFhirDateTime(item.resolved);
    }
    return ret;
}


function BuildContained_and_refs(item) {
    var contained = [];
    contained.push(new BuildEncounter(item));
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

function BuildEncounter(item) {
    return {
        resourceType: 'Encounter',
        text: {
            status: 'generated',
            div: '<div>Encounter with patient ' + item.pid + '</div>'
        },
        location: [{
            resourceType: 'Location',
            _id: item.locationUid,
            Name: item.facilityName,
            identifier: {
                value: item.facilityCode,
                system: 'urn:oid:2.16.840.1.113883.6.233'
            }
        }]

    };
}



function BuildCategory() {
    return {
        coding: [{
            code: 'diagnosis',
            system: '2.16.840.1.113883.4.642.2.224'
        }]
    };
}


function BuildStage(item) {
    return {
        summary: item.summary
    };
}

function BuildCode(item) {
    var coding = [{
        system: 'urn:oid:2.16.840.1.113883.6.233',
        code: item.icdCode,
        display: item.icdName
    }];
    if (item.codes && (item.codes instanceof Array)) {
        for (var i = 0; i < item.codes.length; i++) {
            coding.push(item.codes[i]);
        }
    }
    return {
        coding: coding
    };
}

function BuildExtensions(obj) {
    var ret = [];
    //if it doesn't exist build it
    for (var i = 0, k = Object.keys(obj), l = k.length; i < l; i++) {
        var ext = new Extension(obj, k[i]);
        if (!helpers.isEmpty(ext) && k[i] !== 'summary') {
            ret.push(ext);
        }
    }

    return ret;

}

function buildCommentExtension(item) {
    var div = '<div><ul>';
    if (item && (item instanceof Array) && item.length > 0) {
        for (var i = 0, k = Object.keys(item[0]); i < k.length; i++) {
            div += '<li>' + k[i] + ':' + item[0][k[i]] + '</li>';
        }

    }
    div += '</ul></div>';
    return div;
}

function Extension(item, key) {
    switch (key) {
        case 'serviceConnected':
            this.url = 'http://vistacore.us/fhir/extensions/condition#' + key;
            this.valueBoolean = item[key];
            break;
        case 'updated':
            this.url = 'http://vistacore.us/fhir/extensions/condition#' + key;
            this.valueDateTime = fhirUtils.convertToFhirDateTime(item[key]);
            break;
        case 'comments':
            this.url = 'http://vistacore.us/fhir/extensions/condition#' + key;
            this.valueString = buildCommentExtension(item[key]);
            break;

        case 'statusCode':
        case 'statusName':
        case 'statusDisplayName':
        case 'service':
            this.url = 'http://vistacore.us/fhir/extensions/condition#' + key;
            this.valueString = item[key];
            break;
        default:
            break;
    }
    return this;

}

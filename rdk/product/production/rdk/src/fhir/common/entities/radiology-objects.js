'use strict';
var helpers = require('../utils/helpers.js');
var rdk = require('../../../core/rdk');
var utils = require('../utils/fhir-converter.js');
var _ = rdk.utils.underscore;

function examstatusMap(jdsstatus) {
    var statusmap = {
        'COMPLETE': 'final',
        'TRANSCRIBED': 'partial',
        'WAITING FOR EXAM': 'registered',
        'CANCELLED': 'cancelled',
        'EXAMINED': 'partial'
    };
    return (statusmap[jdsstatus] || 'unknown');
}


function radiologyFactory(objType, item) {
    var obj = new RadiologyObject();
    if (obj[objType]) {
        return obj[objType](item);
    } else {
        return null;
    }
}

var RadiologyObject = function() {

};

RadiologyObject.prototype = {
    text: BuildText,
    radiologyReportItem: RadiologyReportItem,
    entryitem: BuildEntryItem,
    extension: BuildExtensions,
    name: BuildName,
    status: BuildStatus,
    issued: BuildIssued,
    subject: BuildSubject,
    serviceCategory: BuildServiceCategory,
    diagnosticDateTime: BuildDiagnosticDateTime,
    identifier: BuildIdentifier,
    codedDiagnosis: BuildCodedDiagnosis,
    contained_and_ref: BuildContained_and_ref

};



function BuildEntryItem(item) {
    this.title = 'diagnosticreport for patient [' + item.fhirMeta._pid + ']';
    this.id = item.fhirMeta.originalUrl;
    this.link = [{
        rel: 'self',
        href: item.fhirMeta._protocol + '://' + item.fhirMeta._host + item.fhirMeta._originalUrl
    }];
    this.updated = utils.convertDate2FhirDateTime(new Date());
    this.published = utils.convertDate2FhirDateTime(new Date());
    this.author = [{
        name: 'eHMP',
        uri: 'https://ehmp.vistacore.us'
    }];
    this.content = new RadiologyReportItem(item);
    return this;
}

function BuildStatus(item) {
    this.status = examstatusMap(item.statusName);
    return this;
}

function BuildName(item) {
    this.text = item.name;
    return this;
}

function BuildIssued(item) {
    this.issued = utils.convertToFhirDateTime(item.dateTime);
    return this;
}

function BuildDiagnosticDateTime(item) {
    this.diagnosticDateTime = utils.convertToFhirDateTime(item.dateTime);
    return this;
}

function RadiologyReportItem(item) {
    var c_and_ref = new radiologyFactory('contained_and_ref', item);
    this.resourceType = 'DiagnosticReport';
    this.extension = new radiologyFactory('extension', item);
    this.contained = c_and_ref.contained;
    this.result = c_and_ref.result;
    this.performer = c_and_ref.performer;
    this.requestDetail = c_and_ref.requestDetail;
    this.name = new radiologyFactory('name', item);
    this.status = new radiologyFactory('status', item).status;
    this.issued = new radiologyFactory('issued', item).issued;
    this.identifier = new radiologyFactory('identifier', item);
    this.serviceCategory = new radiologyFactory('serviceCategory', item);
    this.diagnosticDateTime = new radiologyFactory('diagnosticDateTime', item).diagnosticDateTime;
    this.codedDiagnosis = new radiologyFactory('codedDiagnosis', item);
    this.subject = new radiologyFactory('subject', item);
    //
    this.text = new radiologyFactory('text', this);
    return this;
}

function BuildContained_and_ref(obj) {
    var org = new CItemOrganization(obj),
        obs = new CItemObservation(obj),
        dio = new CItemDiagnosticOrder(obj);

    this.contained = [];
    this.contained.push(org);
    this.contained.push(obs);
    this.contained.push(dio);
    this.result = [{
        reference: '#' + obs._id,
        display: obj.typeName
    }];
    this.performer = {
        reference: '#' + org._id,
        display: obj.facilityName
    };
    this.requestDetail = {
        reference: '#' + dio._id
    };
    return this;
}

function BuildText(obj) {
    var div = [],
        od = '<div>',
        cd = '</div>';
    this.status = 'generated';
    div.push(od);
    div.push(od + 'Name: ' + obj.name.text + cd);
    div.push(od + 'Status: ' + obj.status + cd);
    div.push(od + 'Report Released: ' + obj.issued + cd);
    div.push(od + 'Subject: ' + obj.subject.reference + cd);
    div.push(od + 'Performer: ' + obj.performer.display + cd);

    var org_ident = _.findWhere(obj.contained, {
        resourceType: 'Organization'
    }).identifier;
    div.push(od + 'Organization Identifier System: ' + org_ident.system + cd);
    div.push(od + 'Organization Identifier Value: ' + org_ident.value + cd);
    div.push(od + 'Identifier System: ' + obj.identifier.system + cd);
    div.push(od + 'Identifier Value: ' + obj.identifier.value + cd);
    var sc_coding = (obj.serviceCategory.coding[0] || {
        system: '',
        code: '',
        display: ''
    });
    div.push(od + 'Service Category System: ' + sc_coding.system + cd);
    div.push(od + 'Service Category Code: ' + sc_coding.code + cd);
    div.push(od + 'Service Category Display: ' + sc_coding.display + cd);
    div.push(od + 'Diagnostic Date: ' + obj.diagnosticDateTime + cd);

    for (var i = 0, l = obj.extension.length; i < l; i++) {
        div.push(od + 'Extension Url: ' + obj.extension[i].url);
        div.push(od + 'Extension Value: ' + obj.extension[i].valueString);
    }

    div.push(od + 'Result Text: ' + (obj.result[0] || {
        display: ''
    }).display + cd);
    var obs_coding = (_.findWhere(obj.contained, {
        resourceType: 'Observation'
    }).name.coding[0] || {
        system: '',
        code: '',
        display: ''
    });
    div.push(od + 'Result Name System: ' + obs_coding.system + cd);
    div.push(od + 'Name Code: ' + obs_coding.code + cd);
    div.push(od + 'Name Display: ' + obs_coding.display + cd);
    div.push(od + 'Conclusion:' + cd);
    div.push(od + 'Coded Diagnostic Text: ' + (obj.codedDiagnosis[0] || {
        text: ''
    }).text + cd);
    this.div = div.join('');
    return this;
}

function CItemObservation(obj) {
    this.resourceType = 'Observation';
    this._id = helpers.generateUUID();
    this.name = {
        coding: [{
            system: 'CPT OID: 2.16.840.1.113883.6.12',
            code: 'None',
            display: obj.typeName
        }],
        text: obj.name
    };
    /*    this.item = [{
        code: {
            coding: [{
                system: 'CPT OID: 2.16.840.1.113883.6.12',
                code: 'None',
                display: obj.typeName
            }],
            text: obj.name
        }
    }];*/
    return this;
}

function BuildCodedDiagnosis(obj) {
    var o = obj.diagnosis,
        ret = [];
    if (o && (o instanceof Array)) {
        for (var i = 0, l = o.length; i < l; i++) {
            ret.push({
                text: o[i].code
            });
        }
        return ret;
    }
}

function BuildIdentifier(obj) {
    this.system = 'urn:oid:2.16.840.1.113883.6.233';
    this.value = obj.uid;
    return this;
}

function BuildServiceCategory() {
    this.coding = [{
        system: 'http://hl7.org/fhir/v2/0074',
        code: 'RAD',
        display: 'Radiology'
    }];
    this.text = 'Radiology';
    return this;
}

function BuildSubject(obj) {
    this.reference = 'Patient/' + obj.fhirMeta._pid;
    this.display = obj.pid;
    return this;
}



function BuildExtensions(obj) {
    var ret = [];
    //if it doesn't exist build it
    for (var i = 0, k = Object.keys(obj), l = k.length; i < l; i++) {
        var ext = new Extension(obj, k[i]);
        if (!helpers.isEmpty(ext)) {
            ret.push(ext);
        }
    }
    return ret;

}

function Extension(item, key) {
    switch (key) {
        //special cases
        case 'diagnosis':
            this.url = 'http://vistacore.us/fhir/extensions/rad#primary';
            this.valueString = false;
            if (item[key] instanceof Array) {
                for (var i = 0, l = item[key].length; i < l; i++) {
                    this.valueString = this.valueString || item[key][i].primary;
                    if (this.valueString) {
                        break;
                    }
                }
            }
            break;
        case 'activity':
            if (item[key] instanceof Array) {
                for (var ii = 0, ll = item[key].length; ii < ll; ii++) {
                    for (var jj = 0, oo = Object.keys(item[key][ii]), ol = oo.length; jj < ol; jj++) {
                        return new Extension(item[key][ii], oo[jj]);
                    }
                }
            }
            break;
        case 'providers':
            if (item[key] instanceof Array) {
                return new Extension(item[key][0], 'providerUid');
            }
            break;

        case 'case':
            this.url = 'http://vistacore.us/fhir/extensions/rad#caseId';
            this.valueString = item[key];
            break;

            //regular urls
        case 'locationName':
        case 'statusName':
        case 'encounterUid':
        case 'encounterName':
        case 'hasImages':
        case 'imagingTypeUid':
        case 'imageLocation':
        case 'providerUid':
        case 'providerName':
        case 'locationUid':
        case 'localId':
        case 'verified':
        case 'orderUid':
        case 'comment':
        case 'device':
        case 'entered':
        case 'enteredBy':
        case 'forwardedFrom':
        case 'name':
        case 'responsible':
        case 'resultUid':
        case 'attention':
        case 'consultProcedure':
        case 'fromService':
        case 'lastAction':
        case 'place':
            this.url = 'http://vistacore.us/fhir/extensions/rad#' + key;
            this.valueString = item[key];
            break;
        default:
            break;
    }
    return this;

}

function CItemOrganization(obj) {
    this.resourceType = 'Organization';
    this._id = helpers.generateUUID();
    this.identifier = [{
        system: 'urn:oid:2.16.840.1.113883.6.233',
        value: obj.facilityCode
    }];
    this.name = obj.facilityName;
    return this;
}



function CItemDiagnosticOrder(obj) {
    this.resourceType = 'DiagnosticOrder';
    this._id = helpers.generateUUID();
    this.subject = new BuildSubject(obj);
    this.item = [{
        code: {
            coding: [{
                system: 'CPT OID: 2.16.840.1.113883.6.12',
                code: 'None',
                display: obj.typeName
            }],
            text: obj.name
        }
    }];
    return this;
}



module.exports.radiologyFactory = radiologyFactory;

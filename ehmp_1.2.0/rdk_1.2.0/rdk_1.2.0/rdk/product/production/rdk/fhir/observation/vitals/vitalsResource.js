'use strict';
var rdk = require('../../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var querystring = require('querystring');
var errors = require('../../common/errors.js');
var helpers = require('../../common/utils/helpers.js');
var fhirUtils = require('../../common/utils/fhirUtils');

function getVitalsData(req, pid, limit, callback) {
    var config = req.app.config;
    var jdsQuery = {};
    if (limit) {
        jdsQuery.limit = limit;
    }
    var jdsPath = '/vpr/' + pid + '/find/vital' + '?' + querystring.stringify(jdsQuery);
    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching pid=' + pid + ' - ' + (error.message || error), error));
        } else {
            var obj = JSON.parse(result);
            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                if (errors.isNotFound(obj)) {
                    return callback(new errors.NotFoundError('Object not found', obj));
                }
            }

            return callback(new Error('There was an error processing your request. The error has been logged.'));
        }
    });
}

function convertToFhir(result, req, limit) {
    var pid = req.query['subject.identifier'];
    var link = 'http://' + req._remoteAddress + req.url; //HTTPS sau HTTP?

    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.title = 'Observation with subject identifier \'' + pid + '\'';
    fhirResult.id = 'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    var now = new Date();
    fhirResult.updated = now.getFullYear() + '-' + ('0' + fhirUtils.generateMonth(now)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2) + '.000-00:00';
    fhirResult.author = [{
        'name': 'eHMP',
    }];
    fhirResult.entry = [];

    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].typeName !== 'BLOOD PRESSURE') {
            createVital(items[i], fhirResult.entry, req._remoteAddress, fhirResult.updated);
        } else {
            createVitalBP(items[i], fhirResult.entry, req._remoteAddress, fhirResult.updated);
        }
    }

    if (!nullchecker.isNullish(limit)) {
        fhirResult.entry = _.first(fhirResult.entry, limit);
    }
    fhirResult.totalResults = fhirResult.entry.length;
    return fhirResult;
}

function createVital(jdsItem, fhirItems, host, updated) {
    var fhirItem = {};
    fhirItem.title = 'observation for patient [' + jdsItem.pid + ']';
    fhirItem.id = 'observation/' + jdsItem.pid + '/' + jdsItem.uid;
    fhirItem.link = [{
        'rel': 'self',
        'href': 'https://' + host + '/fhir/observation/@' + jdsItem.uid //HTTPS sau HTTP?
    }];
    fhirItem.updated = updated;
    fhirItem.published = updated;
    fhirItem.author = [{
        'name': 'eHMP',
    }];
    fhirItem.content = {};
    fhirItem.content.resourceType = 'Observation';
    fhirItem.content.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };
    var orgUid = helpers.generateUUID();
    fhirItem.content.contained = [{
        'resourceType': 'Organization',
        '_id': orgUid,
        'identifier': [{
            'label': 'facility-code',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName
    }];
    fhirItem.content.name = {};
    fhirItem.content.name.coding = [{
        'system': 'urn:oid:2.16.840.1.113883.6.233',
        'code': jdsItem.typeCode,
        'display': jdsItem.typeName
    }, {
        'system': jdsItem.codes[0].system,
        'code': jdsItem.codes[0].code,
        'display': jdsItem.codes[0].display
    }];
    fhirItem.content.valueQuantity = {};
    if (jdsItem.result !== undefined) {
        fhirItem.content.valueQuantity.value = Number(jdsItem.result);
    }
    if (jdsItem.units !== undefined && jdsItem.units !== '') {
        fhirItem.content.valueQuantity.units = jdsItem.units;
    }

    if (jdsItem.observed !== undefined) {
        fhirItem.content.appliesDateTime = fhirUtils.convertToFhirDateTime(jdsItem.observed);
    }
    if (jdsItem.resulted !== undefined) {
        fhirItem.content.issued = jdsItem.resulted.toString().substring(0, 4) + '-' + jdsItem.resulted.toString().substring(4, 6) + '-' + jdsItem.resulted.toString().substring(6, 8) + 'T' + jdsItem.resulted.toString().substring(8, 10) + ':' +
            jdsItem.resulted.toString().substring(10, 12) + ':' + jdsItem.resulted.toString().substring(12, 14) + '-00:00';
    }
    fhirItem.content.status = 'final';
    fhirItem.content.reliability = 'unknown';
    fhirItem.content.identifier = {
        'use': 'official',
        'label': 'uid',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    };
    var splitUid = jdsItem.uid.split(':');
    if (splitUid.length > 5) {
        fhirItem.content.subject = {
            'reference': 'Patient/' + splitUid[4]
        };
    }
    fhirItem.content.performer = [{
        'reference': orgUid,
        'display': jdsItem.facilityName
    }];
    if (jdsItem.low !== undefined || jdsItem.high !== undefined) {
        fhirItem.content.referenceRange = [];
        fhirItem.content.referenceRange.push({});
        if (jdsItem.low !== undefined) {
            var lowReferenceFhir = {};
            lowReferenceFhir = {
                'value': Number(jdsItem.low)
            };
            if (jdsItem.units !== undefined && jdsItem.units !== '') {
                lowReferenceFhir.units = jdsItem.units;
            }
            fhirItem.content.referenceRange[0].low = {};
            fhirItem.content.referenceRange[0].low = lowReferenceFhir;
        }
        if (jdsItem.high !== undefined) {
            var highReferenceFhir = {};
            highReferenceFhir = {
                'value': Number(jdsItem.high)
            };
            if (jdsItem.units !== undefined && jdsItem.units !== '') {
                highReferenceFhir.units = jdsItem.units;
            }

            fhirItem.content.referenceRange[0].high = {};
            fhirItem.content.referenceRange[0].high = highReferenceFhir;
        }
        fhirItem.content.referenceRange[0].meaning = {};
        fhirItem.content.referenceRange[0].meaning.coding = [];
        fhirItem.content.referenceRange[0].meaning.coding.push(fhirUtils.generateReferenceMeaning(jdsItem.typeName));
    }

    fhirItems.push(fhirItem);
}

function createVitalBP(jdsItem, fhirItems, host, updated) {
    var fhirItemSys = {};
    fhirItemSys.content = {};

    fhirItemSys.title = 'observation for patient [' + jdsItem.pid + ']';
    fhirItemSys.id = 'observation/' + jdsItem.pid + '/' + jdsItem.uid;
    fhirItemSys.link = [{
        'rel': 'self',
        'href': 'https://' + host + '/fhir/observation/@' + jdsItem.uid //HTTPS sau HTTP?
    }];
    fhirItemSys.updated = updated;
    fhirItemSys.published = updated;
    fhirItemSys.author = [{
        'name': 'eHMP',
    }];

    var orgUid = helpers.generateUUID();
    fhirItemSys.content.contained = [{
        'resourceType': 'Organization',
        '_id': orgUid,
        'identifier': [{
            'label': 'facility-code',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName
    }];

    fhirItemSys.content.valueQuantity = {};


    if (jdsItem.units !== undefined && jdsItem.units !== '') {
        fhirItemSys.content.valueQuantity.units = jdsItem.units;
    }

    if (jdsItem.observed !== undefined) {
        fhirItemSys.content.appliesDateTime = jdsItem.observed.toString().substring(0, 4) + '-' + jdsItem.observed.toString().substring(4, 6) + '-' + jdsItem.observed.toString().substring(6, 8) + 'T' + jdsItem.observed.toString().substring(8, 10) +
            ':' + jdsItem.observed.toString().substring(10, 12) + ':00';
    }
    if (jdsItem.resulted !== undefined) {
        fhirItemSys.content.issued = jdsItem.resulted.toString().substring(0, 4) + '-' + jdsItem.resulted.toString().substring(4, 6) + '-' + jdsItem.resulted.toString().substring(6, 8) + 'T' + jdsItem.resulted.toString().substring(8, 10) + ':' +
            jdsItem.resulted.toString().substring(10, 12) + ':' + jdsItem.resulted.toString().substring(12, 14) + '-00:00';
    }
    fhirItemSys.content.status = 'final';
    fhirItemSys.content.reliability = 'unknown';
    fhirItemSys.content.identifier = {
        'use': 'official',
        'label': 'uid',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    };
    var splitUid = jdsItem.uid.split(':');
    if (splitUid.length > 5) {
        fhirItemSys.content.subject = {
            'reference': 'Patient/' + splitUid[4]
        };
    }
    fhirItemSys.content.performer = [{
        'reference': orgUid,
        'display': jdsItem.facilityName
    }];


    //deep copy
    var fhirItemDia = JSON.parse(JSON.stringify(fhirItemSys));
    //fhirItemDia.content={};
    fhirItemDia.content.valueQuantity = {};

    //build differences
    var splitValues = jdsItem.result.split('/');
    var splitLow = [],
        splitHigh = [];
    if (jdsItem.low !== undefined) {
        splitLow = jdsItem.low.split('/');
    }
    if (jdsItem.high !== undefined) {
        splitHigh = jdsItem.high.split('/');
    }
    var divDate = '';
    if (jdsItem.observed !== undefined) {
        divDate = ((jdsItem.observed.toString().substring(6, 8)[0] === '0') ? jdsItem.observed.toString().substring(7, 8) : jdsItem.observed.toString().substring(6, 8)) + '-' + fhirUtils.generateMonthName(jdsItem.observed.toString().substring(4, 6)) + ' ' + jdsItem.observed.toString().substring(0, 4) + ' ' +
            ((jdsItem.observed.toString().substring(8, 10)[0] === '0') ? jdsItem.observed.toString().substring(9, 10) : jdsItem.observed.toString().substring(8, 10)) + ':' + ((jdsItem.observed.toString().substring(10, 12)[0] === '0') ? jdsItem.observed.toString().substring(11, 12) : jdsItem.observed.toString().substring(10, 12)) + ' : ';
    }

    fhirItemSys.content.resourceType = 'Observation';
    fhirItemSys.content.text = {
        'status': 'generated',
        'div': '<div>' + divDate + 'Systolic blood pressure ' + splitValues[0].toString() + ' ' + jdsItem.units + '</div>'
    };


    fhirItemDia.content.resourceType = 'Observation';
    fhirItemDia.content.text = {
        'status': 'generated',
        'div': '<div>' + divDate + 'Diastolic blood pressure ' + splitValues[1].toString() + ' ' + jdsItem.units + '</div>'
    };

    fhirItemSys.content.name = {};
    fhirItemSys.content.name.coding = [];
    fhirItemSys.content.name.coding.push(fhirUtils.generateResultMeaning('BLOOD PRESSURE SYSTOLIC'));

    fhirItemDia.content.name = {};
    fhirItemDia.content.name.coding = [];
    fhirItemDia.content.name.coding.push(fhirUtils.generateResultMeaning('BLOOD PRESSURE DIASTOLIC'));

    if (splitValues.length > 1) {
        fhirItemSys.content.valueQuantity.value = Number(splitValues[0]);
        fhirItemSys.content.valueQuantity.units = jdsItem.units;
        fhirItemDia.content.valueQuantity.value = Number(splitValues[1]);
        fhirItemDia.content.valueQuantity.units = jdsItem.units;
    }

    if (splitLow.length > 1 && splitHigh.length > 1) {
        fhirItemSys.content.referenceRange = [];
        fhirItemSys.content.referenceRange.push({});

        var lowReferenceFhir = {};
        lowReferenceFhir = {
            'value': Number(splitLow[0])
        };
        if (jdsItem.units !== undefined && jdsItem.units !== '') {
            lowReferenceFhir.units = jdsItem.units;
        }

        fhirItemSys.content.referenceRange[0].low = {};
        fhirItemSys.content.referenceRange[0].low = lowReferenceFhir;

        var highReferenceFhir = {};
        highReferenceFhir = {
            'value': Number(splitHigh[0])
        };

        if (jdsItem.units !== undefined && jdsItem.units !== '') {
            highReferenceFhir.units = jdsItem.units;
        }

        fhirItemSys.content.referenceRange[0].high = {};
        fhirItemSys.content.referenceRange[0].high = highReferenceFhir;

        fhirItemSys.content.referenceRange[0].meaning = {};
        fhirItemSys.content.referenceRange[0].meaning.coding = [];
        fhirItemSys.content.referenceRange[0].meaning.coding.push(fhirUtils.generateReferenceMeaning('BLOOD PRESSURE SYSTOLIC'));

        fhirItemDia.content.referenceRange = [];
        fhirItemDia.content.referenceRange.push({});

        lowReferenceFhir = {};
        lowReferenceFhir = {
            'value': Number(splitLow[1])
        };
        if (jdsItem.units !== undefined && jdsItem.units !== '') {
            lowReferenceFhir.units = jdsItem.units;
        }
        fhirItemDia.content.referenceRange[0].low = {};
        fhirItemDia.content.referenceRange[0].low = lowReferenceFhir;

        highReferenceFhir = {};
        highReferenceFhir = {
            'value': Number(splitHigh[1])
        };
        if (jdsItem.units !== undefined && jdsItem.units !== '') {
            highReferenceFhir.units = jdsItem.units;
        }
        fhirItemDia.content.referenceRange[0].high = {};
        fhirItemDia.content.referenceRange[0].high = highReferenceFhir;

        fhirItemDia.content.referenceRange[0].meaning = {};
        fhirItemDia.content.referenceRange[0].meaning.coding = [];
        fhirItemDia.content.referenceRange[0].meaning.coding.push(fhirUtils.generateReferenceMeaning('BLOOD PRESSURE DIASTOLIC'));
    }


    //push both items
    fhirItems.push(fhirItemSys);
    fhirItems.push(fhirItemDia);
}

module.exports.convertToFhir = convertToFhir;
module.exports.getVitalsData = getVitalsData;

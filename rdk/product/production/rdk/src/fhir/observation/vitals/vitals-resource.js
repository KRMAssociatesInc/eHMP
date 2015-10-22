'use strict';
var rdk = require('../../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var errors = require('../../common/errors.js');
var helpers = require('../../common/utils/helpers.js');
var fhirUtils = require('../../common/utils/fhir-converter');
var fhirToJDSSearch = require('../../common/utils/fhir-to-jds-search');
var fhirResource = require('../../common/entities/fhir-resource');


function buildJDSPath(pid, params) {
    var jdsPath = '/vpr/' + pid + '/find/vital';
    var query = [];
    var searchQuery = buildSearchQuery(params);

    // search queries
    if (nullchecker.isNotNullish(searchQuery)) {
        query.push(searchQuery);
    }
    // common parameters
    query = query.concat(fhirToJDSSearch.buildCommonQueryParams(params));

    // add filter queries to path
    if (query.length > 0) {
        jdsPath += '?' + query.join('&');
    }

    return jdsPath;
}

function buildSearchQuery(params) {
    var query = [];
    var dateQuery;

    // system & code
    if (nullchecker.isNotNullish(params.code)) {
        query.push(fhirToJDSSearch.buildCodeAndSystemQuery(params.code));
    }
    // date
    if (nullchecker.isNotNullish(params.date)) {
        dateQuery = fhirToJDSSearch.buildDateQuery(params.date, 'observed');
        if (dateQuery) {
            query.push(dateQuery);
        }
    }
    return fhirToJDSSearch.buildSearchQueryString(query);
}

function getJDSErrorMessage(error) {
    var msg = '';

    if (nullchecker.isNotNullish(error.errors)) {
        msg = _.reduce(error.errors, function(memo, e) {
            if (memo && memo.length > 0) {
                memo += ', ';
            }
            memo += e.domain + ' :: ' + e.message;
            return memo;
        }, '');
    }
    return msg;
}

function getVitalsData(appConfig, logger, pid, params, callback) {
    // check for required pid param
    if (nullchecker.isNullish(pid)) {
        return callback(new Error('Missing required parameter: pid'));
    }

    var jdsPath = buildJDSPath(pid, params);
    var options = _.extend({}, appConfig.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: logger,
        options: options
    };

    rdk.utils.http.fetch(appConfig, httpConfig, function(error, result) {
        var internalError = 'There was an error processing your request. The error has been logged.';
        logger.debug('callback from fetch()');

        if (error) {
            callback(new errors.HTTPError(rdk.httpstatus.internal_server_error, 'Error fetching pid=' + pid + ' - ' + (error.message || error)));
        } else {
            var obj = JSON.parse(result);

            if ('data' in obj) {
                return callback(null, obj);
            } else if ('error' in obj) {
                logger.error('Observation::getVitalsData: ' + obj.error.code + ' - ' + getJDSErrorMessage(obj.error));
                return callback(new errors.HTTPError(rdk.httpstatus.internal_server_error, internalError));
            }
            logger.error('Observation::getVitalsData: Empty response from JDS.');
            return callback(new errors.HTTPError(rdk.httpstatus.internal_server_error, internalError));
        }
    });
}

function getFhirItems(result, req) {

    var fhirResult = {};
    fhirResult = convertToFhir(result, req);

    var fhirItems = [];
    fhirItems = fhirResult.entry;

    return fhirItems;
}

function convertToFhir(result, req) {
    var link = 'http://' + req._remoteAddress + req.url; //HTTPS sau HTTP?

    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.type = 'collection';
    //fhirResult.title = 'Observation with subject identifier \'' + pid + '\'';
    fhirResult.id = 'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    var now = new Date();
    fhirResult.meta = {
        'lastUpdated': now.getFullYear() + '-' + ('0' + fhirUtils.generateMonth(now)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2) + '.000-00:00'
    };

    //    fhirResult.updated = now.getFullYear() + '-' + ('0' + fhirUtils.generateMonth(now)).slice(-2) + '-' + ('0' + now.getDate()).slice(-2) + 'T' + ('0' + now.getHours()).slice(-2) + ':' + ('0' + now.getMinutes()).slice(-2) + ':' + ('0' + now.getSeconds()).slice(-2) + '.000-00:00';
    //    fhirResult.author = [{
    //        'name': 'eHMP',
    //        'uri': 'https://ehmp.vistacore.us'
    //    }];
    fhirResult.entry = [];

    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        if (items[i].typeName !== 'BLOOD PRESSURE') {
            createVital(items[i], fhirResult.entry, req._remoteAddress, fhirResult.updated);
        } else {
            createVitalBP(items[i], fhirResult.entry, req._remoteAddress, fhirResult.updated);
        }
    }

    fhirResult.total = result.data.totalItems;
    return fhirResult;
}

function createVital(jdsItem, fhirItems /*, host, updated*/ ) {
    var fhirItem = {};

    fhirItem.resource = {};
    fhirItem.resource.resourceType = 'Observation';
    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };
    var orgUid = helpers.generateUUID();

    //------------------------------------------
    //   TODO:  Investigate
    //   WHY ARE WE ONLY PULLING one code set?
    //   WHAT if JDS returns more?
    //------------------------------------------
    fhirItem.resource.code = {};
    fhirItem.resource.code.coding = [{
        'system': 'urn:oid:2.16.840.1.113883.6.233',
        'code': jdsItem.typeCode,
        'display': jdsItem.typeName
    }, {
        'system': jdsItem.codes[0].system,
        'code': jdsItem.codes[0].code,
        'display': jdsItem.codes[0].display
    }];

    //RESOURCE.VALUE
    fhirItem.resource.valueQuantity = {};
    if (jdsItem.result !== undefined) {
        fhirItem.resource.valueQuantity.value = Number(jdsItem.result);
    }
    if (jdsItem.units !== undefined && jdsItem.units !== '') {
        fhirItem.resource.valueQuantity.units = jdsItem.units;
    }

    // RESOURCE.APPLIESDATETIME
    if (jdsItem.observed !== undefined) {
        fhirItem.resource.appliesDateTime = fhirUtils.convertToFhirDateTime(jdsItem.observed);
    }

    if (jdsItem.resulted !== undefined) {
        fhirItem.resource.issued = jdsItem.resulted.toString().substring(0, 4) + '-' + jdsItem.resulted.toString().substring(4, 6) + '-' + jdsItem.resulted.toString().substring(6, 8) + 'T' + jdsItem.resulted.toString().substring(8, 10) + ':' +
            jdsItem.resulted.toString().substring(10, 12) + ':' + jdsItem.resulted.toString().substring(12, 14) + '-00:00';
    }
    fhirItem.resource.status = 'final';
    fhirItem.resource.reliability = 'unknown';
    fhirItem.resource.identifier = [{
        'use': 'official',
        //'label': 'uid',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    }];
    var splitUid = jdsItem.uid.split(':');
    if (splitUid.length > 5) {
        fhirItem.resource.subject = {
            'reference': 'Patient/' + splitUid[4]
        };
    }
    fhirItem.resource.performer = [{
        'reference': orgUid,
        'display': jdsItem.facilityName
    }];

    //================================
    // SET ORGANIZATION REFERENCE
    //================================
    fhirItem.resource.contained = [];
    var organization = new fhirResource.Organization(orgUid);
    organization.identifier = [{
        'system': 'urn:oid:2.16.840.1.113883.6.233',
        'value': jdsItem.facilityCode
    }];
    organization.name = jdsItem.facilityName;
    fhirItem.resource.contained.push(organization);

    if (jdsItem.low !== undefined || jdsItem.high !== undefined) {
        fhirItem.resource.referenceRange = [];
        fhirItem.resource.referenceRange.push({});
        if (jdsItem.low !== undefined) {
            var lowReferenceFhir = {};
            lowReferenceFhir = {
                'value': Number(jdsItem.low)
            };
            if (jdsItem.units !== undefined && jdsItem.units !== '') {
                lowReferenceFhir.units = jdsItem.units;
            }
            fhirItem.resource.referenceRange[0].low = {};
            fhirItem.resource.referenceRange[0].low = lowReferenceFhir;
        }
        if (jdsItem.high !== undefined) {
            var highReferenceFhir = {};
            highReferenceFhir = {
                'value': Number(jdsItem.high)
            };
            if (jdsItem.units !== undefined && jdsItem.units !== '') {
                highReferenceFhir.units = jdsItem.units;
            }

            fhirItem.resource.referenceRange[0].high = {};
            fhirItem.resource.referenceRange[0].high = highReferenceFhir;
        }
        fhirItem.resource.referenceRange[0].meaning = {};
        fhirItem.resource.referenceRange[0].meaning.coding = [];
        fhirItem.resource.referenceRange[0].meaning.coding.push(fhirUtils.generateReferenceMeaning(jdsItem.typeName));
    }

    fhirItems.push(fhirItem);
}

/**
 * setContainedItemsAndRelatedReferences
 *
 * @param fhirItem
 * @param orgUid
 * @param jdsItem
 */
function setBPContainedItemsAndRelatedReferences(fhirItem, orgUid, jdsItem) {
    var quantityValue;
    var splitValues;
    var fhirContained = fhirItem.contained;
    var fhirRelated = fhirItem.related;

    //================================
    // SET ORGANIZATION REFERENCE
    //================================
    var organization = new fhirResource.Organization(orgUid);
    organization.identifier = [{
        'system': 'urn:oid:2.16.840.1.113883.6.233',
        'value': jdsItem.facilityCode
    }];
    organization.name = jdsItem.facilityName;
    fhirContained.push(organization);

    //====================================================================
    // SET BP RELATED OBSERVATIONs
    // Check for BP code in code[] before setting related and contained BP
    // loop thru all codes and flag if found LOINC code for BP:  55284-4
    //====================================================================
    var i;
    for (i = 0; i < jdsItem.codes.length; i++) {

        if (jdsItem.codes[i].code === '55284-4') {

            //===================================
            // SET BP SYSTOLIC CONTAINED RESOURCE
            //===================================
            // CREATE A related REFERENCE ATTRIBUTE TO THE OBSVERATION SYSTOLIC RESOURCE
            var related = new fhirResource.RelatedResource('has-component', '#systolic', null);
            fhirRelated.push(related);

            quantityValue = null;
            splitValues = jdsItem.result.split('/');
            if (splitValues.length > 1 && jdsItem.units !== undefined && jdsItem.units !== '') {
                quantityValue = splitValues[0];
            }

            //----------------------------------------------------------
            // PREP referenceRange TO NEW BP SYSTOLIC CONTAINED RESOURCE
            //----------------------------------------------------------
            var splitLow = [],
                splitHigh = [];
            if (jdsItem.low !== undefined) {
                splitLow = jdsItem.low.split('/');
            }
            if (jdsItem.high !== undefined) {
                splitHigh = jdsItem.high.split('/');
            }

            //----------------------------------------------------------
            // CREATE AN OBSVERATION SYSTOLIC RESOURCE
            //----------------------------------------------------------
            var systolic = createContainedForRelatedObsv(
                jdsItem, 'BLOOD PRESSURE SYSTOLIC', quantityValue, 'Systolic', splitLow[0], splitHigh[0]);

            //----------------------------------------------------------
            // ADD THE CONTAINED OBSV SYSTOLIC RESOURCE TO THE CONTAINED ATTRIBUTE
            //----------------------------------------------------------
            fhirContained.push(systolic);

            //================================
            // SET BP DIASTOLIC REFERENCE
            //================================
            // CREATE A related REFERENCE ATTRIBUTE TO THE OBSVERATION DIASTOLIC RESOURCE
            related = new fhirResource.RelatedResource('has-component', '#diastolic', null);
            fhirRelated.push(related);

            // CREATE AN OBSVERATION DIASTOLIC RESOURCE
            quantityValue = null;
            splitValues = jdsItem.result.split('/');
            if (splitValues.length > 1 && jdsItem.units !== undefined && jdsItem.units !== '') {
                quantityValue = splitValues[1];
            }

            var diastolic = createContainedForRelatedObsv(
                jdsItem, 'BLOOD PRESSURE DIASTOLIC', quantityValue, 'Diastolic', splitLow[1], splitHigh[1]);

            //ADD THE OBSVERATION DIASTOLIC RESOURCE TO THE CONTAINED ATTRIBUTE
            fhirContained.push(diastolic);

            break;
        }
    }

}
/**
 * Build a Contained Obsv Resource for BP Systolic info.
 * referenceFlag = ['BLOOD PRESSURE SYSTOLIC' | 'BLOOD PRESSURE DIASTOLIC']
 *
 */
function createContainedForRelatedObsv(jdsItem, referenceFlag, value, comments, splitLow, splitHigh) {
    //PREP code
    var coding = [];
    coding.push(fhirUtils.generateResultMeaning(referenceFlag));
    var code = {
        'coding': coding
    };

    //PREP valueQuantity
    var valueQuantityValues = {
        'value': Number(value),
        'units': jdsItem.units
    };
    //PREP comment, id, and identifier value
    var id = null;
    if (nullchecker.isNotNullish(comments)) {
        id = comments.toLowerCase();
    }

    //CREATE obsveration resource for contained entry
    var obsv = new fhirResource.Observation(id, code, 'final', 'unknown', valueQuantityValues, 'Quantity');

    //SET comments and identifier
    obsv.comments = comments;
    obsv.identifier = [{
        'value': id
    }];

    //SET issued date
    if (jdsItem.resulted !== undefined) {
        obsv.issued = jdsItem.resulted.toString().substring(0, 4) + '-' + jdsItem.resulted.toString().substring(4, 6) + '-' + jdsItem.resulted.toString().substring(6, 8) + 'T' + jdsItem.resulted.toString().substring(8, 10) + ':' +
            jdsItem.resulted.toString().substring(10, 12) + ':' + jdsItem.resulted.toString().substring(12, 14) + '-00:00';
    }



    obsv.referenceRange = [];
    obsv.referenceRange.push({});
    var lowReferenceFhir = {};
    lowReferenceFhir = {
        'value': Number(splitLow)
    };
    if (jdsItem.units !== undefined && jdsItem.units !== '') {
        lowReferenceFhir.units = jdsItem.units;
    }
    obsv.referenceRange[0].low = {};
    obsv.referenceRange[0].low = lowReferenceFhir;
    var highReferenceFhir = {};
    highReferenceFhir = {
        'value': Number(splitHigh)
    };
    if (jdsItem.units !== undefined && jdsItem.units !== '') {
        highReferenceFhir.units = jdsItem.units;
    }
    obsv.referenceRange[0].high = highReferenceFhir;
    obsv.referenceRange[0].meaning = {
        coding: [
            fhirUtils.generateReferenceMeaning(referenceFlag)
        ]
    };
    return obsv;
}


/**
 * createVitalBP
 *
 * @param jdsItem
 * @param fhirItems
 * @param host
 * @param updated
 */
function createVitalBP(jdsItem, fhirItems) {
    var fhirItem = {};

    fhirItem.resource = {};
    var orgUid = helpers.generateUUID();

    var divDate = '';
    if (jdsItem.observed !== undefined) {
        divDate = ((jdsItem.observed.toString().substring(6, 8)[0] === '0') ? jdsItem.observed.toString().substring(7, 8) : jdsItem.observed.toString().substring(6, 8)) + '-' + fhirUtils.generateMonthName(jdsItem.observed.toString().substring(4, 6)) + ' ' + jdsItem.observed.toString().substring(0, 4) + ' ' +
            ((jdsItem.observed.toString().substring(8, 10)[0] === '0') ? jdsItem.observed.toString().substring(9, 10) : jdsItem.observed.toString().substring(8, 10)) + ':' + ((jdsItem.observed.toString().substring(10, 12)[0] === '0') ? jdsItem.observed.toString().substring(11, 12) : jdsItem.observed.toString().substring(10, 12)) + ' : ';
    }

    //------------------------------------------
    // SETTING RESOURCETYPE and TEXT
    //------------------------------------------
    fhirItem.resource.resourceType = 'Observation';
    fhirItem.resource.text = {
        'status': 'generated',
        'div': '<div>' + divDate + jdsItem.codes[0].display + ' ' + jdsItem.result.toString() + ' ' + jdsItem.units + '</div>'
    };

    //------------------------------------------
    // SETTING PARENT CODES and RESULT VALUE
    //------------------------------------------
    fhirItem.resource.code = {};
    fhirItem.resource.code.coding = [];
    fhirItem.resource.code.coding.push(jdsItem.codes[0]);

    fhirItem.resource.valueString = jdsItem.result;

    //------------------------------------------
    // SETTING DATES
    //------------------------------------------
    if (jdsItem.observed !== undefined) {
        fhirItem.resource.appliesDateTime = jdsItem.observed.toString().substring(0, 4) + '-' + jdsItem.observed.toString().substring(4, 6) + '-' + jdsItem.observed.toString().substring(6, 8) + 'T' + jdsItem.observed.toString().substring(8, 10) +
            ':' + jdsItem.observed.toString().substring(10, 12) + ':00';
    }

    if (jdsItem.resulted !== undefined) {
        fhirItem.resource.issued = jdsItem.resulted.toString().substring(0, 4) + '-' + jdsItem.resulted.toString().substring(4, 6) + '-' + jdsItem.resulted.toString().substring(6, 8) + 'T' + jdsItem.resulted.toString().substring(8, 10) + ':' +
            jdsItem.resulted.toString().substring(10, 12) + ':' + jdsItem.resulted.toString().substring(12, 14) + '-00:00';
    }
    fhirItem.resource.status = 'final';
    fhirItem.resource.reliability = 'unknown';

    //------------------------------------------
    //SET ITEM UID
    //------------------------------------------
    fhirItem.resource.identifier = [{
        'use': 'official',
        'system': 'http://vistacore.us/fhir/id/uid',
        'value': jdsItem.uid
    }];

    //------------------------------------------
    //SET PATIENT ID
    //------------------------------------------
    var splitUid = jdsItem.uid.split(':');
    if (splitUid.length > 5) {
        fhirItem.resource.subject = {
            'reference': 'Patient/' + splitUid[4]
        };
    }

    //------------------------------------------
    //SET PERFORMER
    //------------------------------------------
    fhirItem.resource.performer = [{
        'reference': orgUid,
        'display': jdsItem.facilityName
    }];

    //------------------------------------------
    // SETTING CONTAINED ITEMS
    //------------------------------------------
    fhirItem.resource.related = [];
    fhirItem.resource.contained = [];
    setBPContainedItemsAndRelatedReferences(fhirItem.resource, orgUid, jdsItem);

    //------------------------------------------
    // ADD created BP vital into parent entry list
    //------------------------------------------
    fhirItems.push(fhirItem);
}

module.exports.convertToFhir = convertToFhir;
module.exports.getVitalsData = getVitalsData;
module.exports.getFhirItems = getFhirItems;

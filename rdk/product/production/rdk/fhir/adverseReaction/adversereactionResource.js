/*jslint node: true */
'use strict';
var ao = require('../common/entities/allergyObjects.js');
var errors = require('../common/errors.js');
var helpers = require('../common/utils/helpers.js');
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var querystring = require('querystring');
var fhirUtils = require('../common/utils/fhirUtils');

//TO DO:
// As JSON.parse and JSON.stringify work in a blocking manner perhaps we should switch to a streaming parser as this one:
// https://github.com/dominictarr/JSONStream



var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        uid: {
            required: false,
            description: 'must be a uid inside the data of this patient'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        }
    }
};

var apiDocs = {
    spec: {
        path: '/fhir/adverseReaction',
        nickname: 'fhir-adversereaction',
        summary: 'Converts a vpr allergy resource into a FHIR adversereaction resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.commonParams.uid(false),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
    return [{
        name: 'adversereactions',
        path: '',
        get: getAdverseReactions,
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
}


function getAdverseReactions(req, res, next) {

    getAllergyData(req, 'allergy', function(err, inputJSON) {

        if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {
            res.send(200, processJSON(inputJSON, req));
        }
    }, next);

}

function processJSON(inputJSON, req) {

    var pid = req.query['subject.identifier'];
    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.title = 'Adversereaction with subject identifier \'' + pid + '\'';
    fhirResult.id = 'urn:uuid:' + helpers.generateUUID();
    fhirResult.link = [{
        'rel': 'self',
        'href': link
    }];

    var now = new Date();
    fhirResult.updated = fhirUtils.convertDate2FhirDateTime(now);
    fhirResult.author = [{
        'name': 'eHMP',
    }];

    var items = inputJSON.data.items;
    fhirResult.entry = [];

    for (var i = 0; i < items.length; i++) {
        fhirResult.entry.push(createReaction(items[i], req, fhirResult.updated));
    }
    fhirResult.totalResults = fhirResult.entry.length;
    return fhirResult;
}

function getAllergyData(req, domain, callback, next) {

    var pid = req.param('subject.identifier');
    var uid = req.param('uid');
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var config = req.app.config;

    if (nullchecker.isNullish(pid)) {
        return next();
    }
    var jdsResource;
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (uid) {
        jdsQuery.filter = 'like("uid","' + uid + '")';
    }

    jdsResource = '/vpr/' + pid + '/find/' + domain;
    var jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
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

function createReaction(item, req, updated) {
    var fhirItem = {};
    fhirItem.title = 'adversereaction for patient [' + item.pid + ']';
    fhirItem.id = 'adversereaction/' + item.pid + '/' + item.uid;
    fhirItem.link = [{
        'rel': 'self',
        'href': req.protocol + '://' + req.headers.host + '/fhir/adversereaction/@' + item.uid
    }];
    fhirItem.updated = updated;
    fhirItem.published = updated;
    fhirItem.author = [{
        'name': 'eHMP',
    }];
    fhirItem.content = {};

    var advReaction = ao.allergyFactory('Reaction');
    var extension = ao.allergyFactory('Extension', 'DateTime');
    var patient = ao.allergyFactory('Patient');
    var practitioner = ao.allergyFactory('Practitioner');
    var sub = ao.allergyFactory('Substance');
    var exposure = ao.allergyFactory('Exposure');
    var ident = ao.allergyFactory('Identifier');

    //extension

    //datetime
    extension.url = 'http://vistacore.us/fhir/profiles/@main#entered-datetime';
    extension.valueDateTime = fhirUtils.convertToFhirDateTime(item.entered);
    advReaction.extension.push(extension);

    //reactiontype
    extension = ao.allergyFactory('Extension', 'ReactionNature');
    extension.url = 'http://vistacore.us/fhir/profiles/@main#reaction-nature';
    extension.valueString = 'allergy';
    advReaction.extension.push(extension);

    //summary
    advReaction.text.status = 'generated';
    advReaction.text.div = '<div>' + item.summary + '</div>';

    //patient
    patient.identifier.label = item.pid;
    advReaction.contained.push(patient);

    //practitioner
    practitioner.id = helpers.generateUUID(); //generated
    practitioner.name.text = item.originatorName;
    practitioner.location.identifier.label = item.facilityName;
    practitioner.location.identifier.value = item.facilityCode;
    advReaction.contained.push(practitioner);

    //substance
    sub.id = helpers.generateUUID();
    sub.text.status = 'generated';
    sub.text.div = '<div>' + item.summary + '</div>';
    item.products.forEach(function(product) {
        var coding = ao.allergyFactory('Coding');
        if (nullchecker.isNotNullish(product.vuid)) {
            coding.system = 'urn:oid:2.16.840.1.113883.6.233';
            coding.code = product.vuid;
            coding.display = product.name;
            sub.type.text = product.name;
            sub.type.coding.push(coding);
        }
    });

    if (item.hasOwnProperty('codes')) {
        item.codes.forEach(function(codeitem) {
            var coding = ao.allergyFactory('Coding');
            coding.system = codeitem.system;
            coding.code = codeitem.code;
            coding.display = codeitem.display;
            sub.type.coding.push(coding);

        });
    }
    advReaction.contained.push(sub);

    //exposure
    exposure.substance.reference = sub.id;
    advReaction.exposure.push(exposure);

    //identifier
    ident.value = item.uid;
    advReaction.identifier.push(ident);

    //symptoms
    if (item.hasOwnProperty('reactions')) {
        item.reactions.forEach(function(reaction) {
            var symptom = ao.allergyFactory('Symptom');
            if (nullchecker.isNotNullish(reaction.vuid)) {

                symptom.code.text = reaction.name;
                var coding = ao.allergyFactory('Coding');
                coding.system = 'urn:oid:2.16.840.1.113883.6.233';
                coding.code = reaction.vuid;
                coding.display = reaction.name;
                symptom.code.coding = coding;
                if ((item.observations) && (item.observations.length > 0)) {
                    symptom.severity = item.observations[0].severity; //issue: there may be multiple obs per reaction
                }
                advReaction.symptom.push(symptom);
            }

        });
    } else {
        delete advReaction.symptom;
    }

    //misc fields
    if ((item.observations) && (item.observations.length > 0)) {
        advReaction.date = fhirUtils.convertToFhirDateTime(item.observations[0].date); //issue: there may be multiple obs per reaction
    }
    advReaction.subject.reference = item.uid;
    advReaction.didNotOccurFlag = false;
    advReaction.recorder.reference = practitioner.id;
    fhirItem.content = advReaction;
    return fhirItem;
}



module.exports.getResourceConfig = getResourceConfig;
module.exports.convertToFhir = processJSON;

'use strict';
var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;
var vitals = require('./vitals/vitals-resource.js');
var observationUtils = require('./observation-validate-params.js');

var apiDocs = {
    spec: {
        path: '/fhir/patient/{id}/observation',
        nickname: 'fhir-patient-observation',
        summary: 'Converts a vpr \'vitals\' resource into a FHIR \'observation\' resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.pid,
            rdk.docs.commonParams.fhir._count,
            rdk.docs.swagger.paramTypes.query('code', 'Code and/or system of the observation type (e.g. http://loinc.org|8310-5)', 'string', false),
            rdk.docs.swagger.paramTypes.query('date', 'Obtained date/time (e.g. date=>2015/01/15)', 'string', false),
        ],
        responseMessages: []
    }
};

var parameters = {
    get: {
        _count: {
            required: false,
            regex: /\d+/,
            description: 'Show this many results'
        },
        code: {
            required: false,
            description: 'Code and/or system of the observation type (e.g. http://loinc.org|8310-5)'
        },
        date: {
            required: false,
            description: 'Obtained date/time (e.g. date=>2015/01/15)'
        }
    }
};

function getResourceConfig() {
    return [{
        name: 'observation',
        path: '',
        apiDocs: apiDocs,
        get: getObservation,
        healthcheck: {
            dependencies: ['patientrecord', 'jds', 'solr', 'jdsSync', 'authorization']
        },
        parameters: parameters,
        permissions: [],
        interceptors: {
            fhirPid: true
        },
        permitResponseFormat: true
    }];
}

function limitFHIRResultByCount(fhirBundle, countStr) {
    if (nullchecker.isNotNullish(countStr)) {
        var count  = parseInt(countStr);
        fhirBundle.entry = _.first(fhirBundle.entry, count);
    }
}

/**
 * @api {get} /fhir/patient/{id}/observation Get Observation
 * @apiName getObservation
 * @apiGroup Observation
 * @apiParam {Number} [_count] The number of results to show.
 * @apiParam {String} [code] a tokenized value containing a single field, or 2 pipe separated fields called 'system' and 'code'.  The system field (left side of pipe) and pipe is optional and may be omitted. If the system field is empty and the pipe is included, it is implied that the field should not exist in the results.  Multiple codes can be specified, by joining with a comma, which signifies an OR clause.  (Valid examples: [code=8310-5] [code=http://loinc.org|8310-5] [code=9279-1,8310-5] [code=http://loinc.org|9279-1,8310-5] [code=http://loinc.org|9279-1,http://loinc.org|8310-5] [code=|8310-5] [code=8310-5,|9279-1] @see http://www.hl7.org/FHIR/2015May/search.html#token
 * @apiParam {String} [date] Obtained date/time. The prefixes >, >=, <=, < and != may be used on the parameter value (e.g. date=>2015-01-15). The following date formats are permitted: yyyy-mm-ddThh:mm:ss (exact date search), yyyy-mm-dd (within given day), yyyy-mm (within given month), yyyy (within given year). A single date parameter can be used for an exact date search (e.g. date=2015-01-26T08:30:00) or an implicit range (e.g. date=2015-01, searches all dates in January 2015). Two date parameters can be used to specify an explicitly bounded range. When using a pair of date parameters, the parameters should bind both ends of the range. One should have a less-than operator (<, <=) while the other a greater-than operator (>, >=). Consult the <a href="http://www.hl7.org/FHIR/2015May/search.html#date">FHIR DSTU2 API</a> documentation for more information.
 *
 * @apiDescription Converts a vpr \'vitals\' resource into a FHIR \'observation\' resource.
 *
 * @apiExample {js} Request Examples:
 *      // Limiting results count
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?_count=1
 *
 *      // Exact date search
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=2015-01-26T13:45:00
 *
 *      // Observations on a day
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=2015-01-26
 *
 *      // Observations on a month
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=2015-01
 *
 *      // Observations on a year
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=2015
 *
 *      // Observations outside a date range (e.g. observations not occuring on January 2015)
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=!=2015-01
 *
 *      // Explicit date range
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?date=>=2014-06&date=<=2014-09-20
 *
 *      // Observations of a particular code
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?code=9279-1
 *
 *      // Observations of a particular code and system
 *      http://10.4.4.1:8888/resource/fhir/patient/9E7A;253/observation?code=http://loinc.org|9279-1
 *
 * @apiSuccess {json} data Json object conforming to the <a href="http://www.hl7.org/FHIR/2015May/observation.html">Observation FHIR DTSU2 specification</a>.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "resourceType": "Bundle",
 *     "type": "collection",
 *     "id": "urn:uuid:1e89fe8a-339c-48e3-ba5a-58ee064fb14b",
 *     "link": [
 *         {
 *             "rel": "self",
 *             "href": "http://10.4.4.1/resource/fhir/patient/9E7A;253/observation?date=%3E2015-01-26T01:20:00Z&code=http://loinc.org|8310-5&_count=1"
 *         }
 *     ],
 *     "meta": {
 *         "lastUpdated": "2015-06-18T14:38:50.000-00:00"
 *     },
 *     "entry": [
 *         {
 *             "resource": {
 *                 "resourceType": "Observation",
 *                 "text": {
 *                     "status": "generated",
 *                     "div": "<div>TEMPERATURE 98.2 F</div>"
 *                 },
 *                 "contained": [
 *                     {
 *                         "resourceType": "Organization",
 *                         "_id": "481de831-8896-4331-ab52-c9f7cdc78348",
 *                         "identifier": [
 *                             {
 *                                 "system": "urn:oid:2.16.840.1.113883.6.233",
 *                                 "value": "998"
 *                             }
 *                         ],
 *                         "name": "ABILENE (CAA)"
 *                     }
 *                 ],
 *                 "code": {
 *                     "coding": [
 *                         {
 *                             "system": "urn:oid:2.16.840.1.113883.6.233",
 *                             "code": "urn:va:vuid:4500638",
 *                             "display": "TEMPERATURE"
 *                         },
 *                         {
 *                             "system": "http://loinc.org",
 *                             "code": "8310-5",
 *                             "display": "BODY TEMPERATURE"
 *                         }
 *                     ]
 *                 },
 *                 "valueQuantity": {
 *                     "value": 98.2,
 *                     "units": "F"
 *                 },
 *                 "appliesDateTime": "2015-02-24T22:40:00",
 *                 "issued": "2015-02-25T15:23:27-00:00",
 *                 "status": "final",
 *                 "reliability": "unknown",
 *                 "identifier": {
 *                     "use": "official",
 *                     "system": "http://vistacore.us/fhir/id/uid",
 *                     "value": "urn:va:vital:9E7A:253:28425"
 *                 },
 *                 "subject": {
 *                     "reference": "Patient/253"
 *                 },
 *                 "performer": [
 *                     {
 *                         "reference": "481de831-8896-4331-ab52-c9f7cdc78348",
 *                         "display": "ABILENE (CAA)"
 *                     }
 *                 ],
 *                 "referenceRange": [
 *                     {
 *                         "low": {
 *                             "value": 95,
 *                             "units": "F"
 *                         },
 *                         "high": {
 *                             "value": 102,
 *                             "units": "F"
 *                         },
 *                         "meaning": {
 *                             "coding": [
 *                                 {
 *                                     "system": "http://snomed.info/id",
 *                                     "code": "87273009",
 *                                     "display": "Normal Temperature"
 *                                 }
 *                             ]
 *                         }
 *                     }
 *                 ]
 *             }
 *         }
 *     ],
 *     "total": 2
 * }
 *
 * @apiError (Error 400) Invalid parameter values.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *      Invalid parameter values.
 * }
 */
function getObservation(req, res) {
    var pid = req.query.pid;
    var params = {
        _count: req.query._count,
        date: req.query.date,
    };

    if (nullchecker.isNullish(pid)) {
        return res.status(rdk.httpstatus.bad_format).send('Missing required parameter: pid');
    }

    if (nullchecker.isNotNullish(req.query.code)) {
        params.code = req.query.code;
    }

    if (!observationUtils.validParams(params)) {
        return res.status(rdk.httpstatus.bad_request).send('Invalid parameter values.');
    }

    vitals.getVitalsData(req.app.config, req.logger, pid, params, function(err, inputJSON) {
        if (nullchecker.isNotNullish(err)) {
            res.status(err.code).send(err.message);
        } else {
            var fhirBundle = vitals.convertToFhir(inputJSON, req);
            limitFHIRResultByCount(fhirBundle, params._count);
            res.status(rdk.httpstatus.ok).send(fhirBundle);
        }
    });
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.getObservation = getObservation;

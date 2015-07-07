'use strict';
var rdk = require('../../rdk/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var helpers = require('../common/utils/helpers.js');
var fhirUtils = require('../common/utils/fhirUtils');
var errors = require('../common/errors.js');
var querystring = require('querystring');

var parameters = {
    get: {
        'subject.identifier': {
            required: true,
            description: 'patient id'
        },
        type: {
            required: false,
            description: 'all documents if not present. Discharge summary notes if equals to \'34745-0\'. For all others use \'34765-8\' '
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

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        interceptors: {
            synchronize: true
        },
        parameters: parameters,
        apiDocs: apiDocs,
        get: getComposition,
        permissions: [],
        healthcheck: {
            dependencies: ['patientrecord','jds','solr','authorization']
        }
    }];
};

var apiDocs = {
    spec: {
        path: '/fhir/composition',
        nickname: 'fhir-composition',
        summary: 'Converts a vpr document into a composition FHIR resource.',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.si,
            rdk.docs.swagger.paramTypes.query('type', 'type', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

function getComposition(req, res, next) {

    var pid = req.query['subject.identifier'];
    var type = req.param('type');
    if (nullchecker.isNullish(pid)) {
        return next();
    }
    getCompositionData(req, pid, type, function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.send(rdk.httpstatus.internal_server_error, 'There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.send(rdk.httpstatus.not_found, err.error);
        } else if (err) {
            res.send(rdk.httpstatus.internal_server_error, err.message);
        } else {

            var outJSON = {};
            outJSON = convertToFhir(inputJSON, req);

            res.send(200, outJSON);
        }
    });
}

function convertToFhir(result, req) {
    var pid = req.query['subject.identifier'];
    var link = req.protocol + '://' + req.headers.host + req.originalUrl;
    var fhirResult = {};
    fhirResult.resourceType = 'Bundle';
    fhirResult.title = 'Observation with subject identifier \'' + pid + '\'';
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
    fhirResult.entry = [];
    var items = result.data.items;
    for (var i = 0; i < items.length; i++) {
        createNote(items[i], fhirResult.entry, req, fhirResult.updated);
    }
    fhirResult.totalResults=fhirResult.entry.length;
    return fhirResult;
}

function createNote(jdsItem, fhirItems, req, updated) {

    var fhirItem = {},
        date;
    fhirItem.title = 'composition for patient [' + jdsItem.pid + ']';
    fhirItem.id = 'composition/' + jdsItem.pid + '/' + jdsItem.uid;
    fhirItem.link = [{
        'rel': 'self',
        'href': req.protocol + '://' + req.headers.host + '/fhir/composition/@' + jdsItem.uid
    }];
    fhirItem.updated = updated;
    fhirItem.published = updated;
    fhirItem.author = [{
        'name': 'eHMP',
    }];
    fhirItem.content = {};
    fhirItem.content.resourceType = 'Composition';


    fhirItem.content.extension = [];
    var ext = {};
    if (jdsItem.entered !== undefined) {
        date = fhirUtils.convertToFhirDateTime(jdsItem.entered);
        ext = {
            'url': 'http://vistacore.us/fhir/profiles/@main#entered',
            'valueDateTime': date
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.documentTypeCode !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/profiles/@main#document-type-code',
            'valueString': jdsItem.documentTypeCode
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.documentTypeName !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/profiles/@main#document-type-name',
            'valueString': jdsItem.documentTypeName
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.interdisciplinaryType !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/profiles#interdisciplinaryType',
            'valueString': jdsItem.interdisciplinaryType
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.isInterdisciplinary !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/profiles#isInterdisciplinary',
            'valueBoolean': jdsItem.isInterdisciplinary === 'true' ? true : false
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.dodComplexNoteUri !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/notes#dodComplexNoteUri',
            'valueString': jdsItem.dodComplexNoteUri
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.sensitive !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/profiles#sensitive',
            'valueBoolean': jdsItem.sensitive
        };
        fhirItem.content.extension.push(ext);
    }

    if (jdsItem.subject !== undefined) {
        ext = {
            'url': 'http://vistacore.us/fhir/extensions/notes#subject',
            'valueString': jdsItem.subject
        };
        fhirItem.content.extension.push(ext);
    }


    fhirItem.content.text = {
        'status': 'generated',
        'div': '<div>' + jdsItem.summary + '</div>'
    };

    fhirItem.content.contained = [];
    var orgUid = helpers.generateUUID();
    fhirItem.content.contained.push({
        'resourceType': 'Organization',
        '_id': orgUid,
        'identifier': [{
            'label': 'facility-code',
            'value': jdsItem.facilityCode
        }],
        'name': jdsItem.facilityName,
        'text': {
            'div': '<div>' + jdsItem.facilityName + '</div>',
            'status': 'generated'
        }
    });

    var contained = {},
        signerId, id = {};
    var numOfClinician = jdsItem.clinicians ? jdsItem.clinicians.length : 0;
    for (var i = 0; i < numOfClinician; i++) {
        orgUid = helpers.generateUUID();
        contained = {};
        contained.resourceType = 'Practitioner';
        contained._id = orgUid;
        contained.extension = [];

        if (jdsItem.clinicians[i].signature !== undefined) {
            ext = {
                'url': 'http://vistacore.us/fhir/profiles#signature',
                'valueString': jdsItem.clinicians[i].signature
            };
            contained.extension.push(ext);
        }
        if (jdsItem.clinicians[i].signedDateTime !== undefined) {
            date = fhirUtils.convertToFhirDateTime(jdsItem.clinicians[i].signedDateTime);
            ext = {
                'url': 'http://vistacore.us/fhir/profiles#signedDateTime',
                'valueDateTime': date
            };
            contained.extension.push(ext);
        }
        if (jdsItem.clinicians[i].summary !== undefined) {
            ext = {
                'url': 'http://vistacore.us/fhir/profiles#summary',
                'valueString': jdsItem.clinicians[i].summary
            };
            contained.extension.push(ext);
        }
        contained.name = {};
        contained.name.text = jdsItem.clinicians[i].displayName;
        if (jdsItem.clinicians[i].uid !== undefined) {
            contained.identifier = [];
            id = {};
            id.label = 'uid';
            id.value = jdsItem.clinicians[i].uid;
            contained.identifier.push(id);
        }
        if (jdsItem.clinicians[i].role !== undefined) {
            contained.role = {};
            contained.role.code = {};
            contained.role.code.text = jdsItem.clinicians[i].role;
            if (jdsItem.clinicians[i].role === 'S') {
                signerId = orgUid;
            }
        }
        fhirItem.content.contained.push(contained);
    }

    fhirItem.content.subject = {
        'reference': 'Patient/' + jdsItem.pid
    };
    if (jdsItem.text !== undefined) {
        var observationUid = helpers.generateUUID();
        contained = {};
        contained.resourceType = 'Observation';
        contained._id = observationUid;
        contained.status = 'final';
        contained.reliability = 'ok';
        contained.name = {};
        contained.name.text = jdsItem.documentTypeName;
        contained.valueString = "";
        if (jdsItem.text[0] && jdsItem.text[0].content) {
            contained.valueString = jdsItem.text[0].content;
        }

        contained.text = {
            'status': 'generated',
            'div': '<div>' + jdsItem.text[0].content + '</div>'
        };
        fhirItem.content.contained.push(contained);

        fhirItem.content.section = {};
        if (jdsItem.localTitle !== undefined) {
            fhirItem.content.section.title = jdsItem.localTitle;
        }
        if (jdsItem.localId !== undefined) {
            fhirItem.content.section.code = {};
            fhirItem.content.section.code.text = jdsItem.localId;
        }
        fhirItem.content.section.content = {
            'reference': 'Observation/' + observationUid,
        };


        fhirItem.content.author = [];
        if (jdsItem.text[0].clinicians !== undefined) {
            for (i = 0; i < jdsItem.text[0].clinicians.length; i++) {
                orgUid = helpers.generateUUID();
                contained = {};
                contained.resourceType = 'Practitioner';
                contained._id = orgUid;
                contained.extension = [];

                if (jdsItem.text[0].clinicians[i].signature !== undefined) {
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#practitionerSignature',
                        'valueString': jdsItem.text[0].clinicians[i].signature
                    };
                    contained.extension.push(ext);
                }
                if (jdsItem.text[0].clinicians[i].signedDateTime !== undefined) {
                    date = fhirUtils.convertToFhirDateTime(jdsItem.text[0].clinicians[i].signedDateTime);
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#practitionerSignedDateTime',
                        'valueDateTime': date
                    };
                    contained.extension.push(ext);
                }
                if (jdsItem.text[0].clinicians[i].summary !== undefined) {
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#documentClinicianSummary',
                        'valueString': jdsItem.text[0].clinicians[i].summary
                    };
                    contained.extension.push(ext);
                }

                if (jdsItem.text[0].status !== undefined) {
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#practitionerStatus',
                        'valueString': jdsItem.text[0].status
                    };
                    contained.extension.push(ext);
                }

                if (jdsItem.text[0].summary !== undefined) {
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#documentTextSummary',
                        'valueString': jdsItem.text[0].summary
                    };
                    contained.extension.push(ext);
                }

                if (jdsItem.text[0].dateTime !== undefined) {
                    date = fhirUtils.convertToFhirDateTime(jdsItem.text[0].dateTime);
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#documentTextDateTime',
                        'valueDateTime': date
                    };
                    contained.extension.push(ext);
                }

                if (observationUid !== undefined) {
                    ext = {
                        'url': 'http://vistacore.us/fhir/extensions/notes#practitionerContent'
                    };
                    ext.valueResource = {
                        'reference': 'Observation/' + observationUid
                    };
                    contained.extension.push(ext);
                }

                contained.name = {};
                contained.name.text = jdsItem.text[0].clinicians[i].displayName;
                if (jdsItem.text[0].clinicians[i].uid !== undefined) {
                    contained.identifier = [];
                    id = {};
                    id.label = 'uid';
                    id.value = jdsItem.text[0].clinicians[i].uid;
                    contained.identifier.push(id);
                }
                if (jdsItem.text[0].clinicians[i].role !== undefined) {
                    contained.role = {};
                    contained.role.code = {};
                    contained.role.code.text = jdsItem.text[0].clinicians[i].role;
                }

                fhirItem.content.contained.push(contained);
                var auth = {};
                auth.reference = 'Practitioner/' + orgUid;
                auth.display = jdsItem.text[0].clinicians[i].displayName;
                fhirItem.content.author.push(auth);
            }
        }
    }

    if (jdsItem.encounterUid !== undefined) {
        orgUid = helpers.generateUUID();
        contained = {};
        contained.resourceType = 'Encounter';
        contained._id = orgUid;
        if (jdsItem.urgency !== undefined) {
            contained.priority = {};
            contained.priority.code = {};
            contained.priority.code.text = jdsItem.urgency;
        }

        contained.text = {
            'status': 'generated',
            'div': '<div>' + jdsItem.encounterName + '</div>'
        };

        fhirItem.content.contained.push(contained);

        var enc = {};
        enc.reference = 'Encounter/' + orgUid;
        enc.display = jdsItem.encounterName;
        fhirItem.content.encounter = enc;

        contained.identifier = [];
        id = {};
        id.label = 'uid';
        id.value = jdsItem.encounterUid;
        contained.identifier.push(id);

    }

    fhirItem.content.identifier = {};
    fhirItem.content.identifier.value = jdsItem.uid;
    fhirItem.content.identifier.use = 'official';

    fhirItem.content.date = fhirUtils.convertToFhirDateTime(jdsItem.referenceDateTime);

    fhirItem.content.type = {};
    fhirItem.content.type.coding = [];
    var type = {};
    type.system = 'http://loinc.org';
    if (jdsItem.kind === 'Discharge Summary' || jdsItem.kind === 'Discharge Summarization Note') {
        type.code = '34745-0';
        type.display = 'Discharge summary';
    } else {
        type.code = '34765-8';
        type.display = 'General medicine Note';
    }
    fhirItem.content.type.coding.push(type);
    fhirItem.content.type.text = jdsItem.documentTypeName;

    fhirItem.content.class = {};
    if (jdsItem.documentClass !== undefined) {
        fhirItem.content.class.text = jdsItem.documentClass;
    } else {
        fhirItem.content.class.text = 'Clinical Note';
    }
    fhirItem.content.title = jdsItem.localTitle;

    if (jdsItem.status !== undefined) {
        switch (jdsItem.status) {
            case 'ACTIVE':
                {
                    fhirItem.content.status = 'PRELIMINARY';
                }
                break;
            case 'COMPLETED':
                {
                    fhirItem.content.status = 'FINAL';
                }
                break;
            case 'N/A':
                {
                    fhirItem.content.status = 'APPENDED';
                }
                break;
            case 'AMENDED':
                {
                    fhirItem.content.status = 'AMENDED';
                }
                break;
            case 'RETRACTED':
                {
                    fhirItem.content.status = 'RETRACTED';
                }
                break;
        }
    }

    fhirItem.content.confidentiality = {};
    fhirItem.content.confidentiality.system = 'http://hl7.org/fhir/v3/vs/Confidentiality';
    fhirItem.content.confidentiality.code = 'N';
    fhirItem.content.confidentiality.display = 'normal';

    fhirItem.content.attester = {};
    if (jdsItem.signedDateTime !== undefined) {
        fhirItem.content.attester.time = fhirUtils.convertToFhirDateTime(jdsItem.signedDateTime);
    }
    fhirItem.content.attester.mode = 'professional';
    if (jdsItem.signerUid) {
        fhirItem.content.attester.party = {
            'reference': 'Practitioner/' + signerId,
            'display': jdsItem.signerDisplayName
        };
    }



    fhirItems.push(fhirItem);
}

function getCompositionData(req, pid, type, callback) {
    var config = req.app.config;
    var jdsResource, jdsPath;
    var start = req.param('start') || 0;
    var limit = req.param('limit');
    var jdsQuery = {
        start: start
    };
    if (limit) {
        jdsQuery.limit = limit;
    }
    if (type === undefined) {
        jdsResource = '/vpr/' + pid + '/index/document/';
    } else if ((nullchecker.isNotNullish(type) && type === '34745-0')) {
        jdsResource = '/vpr/' + pid + '/index/document/?filter=in(kind,%5B%22Discharge%20Summary%22,%22Discharge%20Summarization%20Note%22%5D)';
    } else if ((nullchecker.isNotNullish(type) && type === '34765-8')) {
        jdsResource = '/vpr/' + pid + '/index/document/?filter=not(in(kind,%5B%22Discharge%20Summary%22,%22Discharge%20Summarization%20Note%22%5D))';
    }
    if (jdsResource !== undefined && jdsResource.indexOf('?') > -1) {
        jdsPath = jdsResource + '&' + querystring.stringify(jdsQuery);
    } else {
        jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);
    }
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

module.exports.getCompositionData = getCompositionData;
module.exports.getResourceConfig = getResourceConfig;
module.exports.getComposition = getComposition;
module.exports.convertToFhir = convertToFhir;

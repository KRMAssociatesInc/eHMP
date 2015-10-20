'use strict';
var rdk = require('../../core/rdk');
var nullchecker = rdk.utils.nullchecker;
var _ = rdk.utils.underscore;
var localPath = {};
var errors = require('../common/errors.js');
var helpers = require('../common/utils/helpers.js');

var apiDocs = {
    spec: {
        path: '/fhir/patient/{id}',
        nickname: 'fhir-patient-demographics',
        summary: 'Get demographics for a patient',
        notes: '',
        method: 'GET',
        parameters: [
            rdk.docs.commonParams.fhir.pid
        ],
        responseMessages: []
    }
};

var getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        get: getPatientDemographics,
        apiDocs: apiDocs,
        healthcheck: {
            dependencies: ['patientrecord', 'solr', 'jds', 'jdsSync', 'authorization']
        },
        permissions: [],
        permitResponseFormat: true
    }];
};


function getPatientDemographics(req, res, next) {
    //res.send(convertToFhir(result));

    var uid = req.param('id');
    if (nullchecker.isNullish(uid)) {
        return next();
    }

    getDemographicsData(req, 'patient', function(err, inputJSON) {
        if (err instanceof errors.FetchError) {
            req.logger.error(err.message);
            res.status(rdk.httpstatus.internal_server_error).send('There was an error processing your request. The error has been logged.');
        } else if (err instanceof errors.NotFoundError) {
            res.status(rdk.httpstatus.not_found).send(err.error);
        } else if (err) {
            res.status(rdk.httpstatus.internal_server_error).send(err.message);
        } else {

            var outJSON = {};
            //var items = inputJSON.data.items;

            outJSON = convertToFhir(inputJSON);

            res.status(200).send(outJSON);
        }
    });
}

function getDemographicsData(req, domain, callback) {
    var uid = req.param('id');
    var jdsPath;

    var regex = /[^:]+:[^:]+:[^:]+:([^:]+:[^:]+):[^:]*/;
    var match = uid.match(regex);
    if (match && match.length === 2) {
        jdsPath = '/vpr/uid/' + uid;
    } else {
        jdsPath = '/vpr/pid/' + uid;
    }
    var config = req.app.config;
    localPath = req._remoteAddress;

    var options = _.extend({}, config.jdsServer, {
        path: jdsPath,
        method: 'GET'
    });
    var httpConfig = {
        protocol: 'http',
        logger: req.logger,
        options: options
    };

    rdk.utils.http.fetch(req.app.config, httpConfig, function(error, result) {
        req.logger.debug('callback from fetch()');
        if (error) {
            callback(new errors.FetchError('Error fetching uid=' + uid + ' - ' + (error.message || error), error));
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


function convertToFhir(result) {
    var data = result.data.items[0],
        i;

    var managingOrgId;
    if (data.homeFacility !== undefined && data.homeFacility.localPatientId !== undefined) {
        managingOrgId = data.homeFacility.localPatientId;
    } else {
        managingOrgId = helpers.generateUUID();
    }


    var genderItem;
    if (data.genderCode !== undefined) {
        switch (data.genderCode) {
            case 'urn:va:pat-gender:M':
                {
                    genderItem = 'male';
                }
                break;
            case 'urn:va:pat-gender:F':
                {
                    genderItem = 'female';
                }
                break;
            case 'urn:va:pat-gender:U':
                {
                    genderItem = 'unknown';
                }
                break;
        }
    }


    var fhirResult = {
        'resourceType': 'Patient',
        'extension': [{
            'url': 'http://vistacore.us/fhir/profiles/@main#service-connected',
            'valueCoding': {
                'code': (data.serviceConnected) ? 'Y' : 'N',
                'display': 'Service Connected'
            }
        }, {
            'url': 'http://vistacore.us/fhir/profiles/@main#sensitive',
            'valueBoolean': data.sensitive !== undefined ? data.sensitive : ''
        }],
        'text': {
            'status': 'generated',
            'div': '<div>' + (data.fullName || '') + '. SSN: ' + (data.ssn || '') + '</div>'
        },
        'identifier': [{
            'use': 'official',
            //'label': 'ssn',
            'system': 'http://hl7.org/fhir/sid/us-ssn',
            'value': data.ssn || ''
        }, {
            //'label': 'uid',
            'system': 'http://vistacore.us/fhir/id/uid',
            'value': data.uid || ''
        }, {
            //'label': 'dfn',
            'system': 'http://vistacore.us/fhir/id/dfn',
            'value': (data.localId !== undefined) ? data.localId.toString() : ''
        }, {
            //'label': 'pid',
            'system': 'http://vistacore.us/fhir/id/pid',
            'value': data.pid || ''
        }, ],
        'name': [{
            'use': 'official',
            'text': data.fullName || '',
            'family': [
                data.familyName || ''
            ],
            'given': [
                data.givenNames || ''
            ]
        }],

        'gender': genderItem,

        'birthDate': (data.birthDate !== undefined && data.birthDate !== '') ? data.birthDate.toString().substring(0, 4) + '-' + data.birthDate.toString().substring(4, 6) + '-' + data.birthDate.toString().substring(6, 8) : '',
    };


    var fhirReligion = {};
    if (data.religionCode !== undefined) {
        fhirReligion.url = 'http://vistacore.us/fhir/profiles/@main#religion';
        fhirReligion.valueCoding = {};
        fhirReligion.valueCoding.code = data.religionCode;
        fhirReligion.valueCoding.display = data.religionName;
        fhirResult.extension.push(fhirReligion);
    }


    if (data.scPercent !== undefined) {
        var fhirServiceConnectedPercent = {
            'url': 'http://vistacore.us/fhir/profiles/@main#service-connected-percent',
            'valueQuantity': {
                'value': data.scPercent,
                'units': '%'
            }
        };
        fhirResult.extension.push(fhirServiceConnectedPercent);
    }

    if (data.homeFacility !== undefined && data.homeFacility.code !== undefined) {
        var fhirContained = {
            'resourceType': 'Organization',
            'id': managingOrgId,
            'identifier': [{
                //'label': 'facility-code',
                'system': 'urn:oid:2.16.840.1.113883.6.233',
                'value': (data.homeFacility !== undefined && data.homeFacility.code !== undefined) ? data.homeFacility.code : ''
            }],
            'name': (data.homeFacility !== undefined && data.homeFacility.name !== undefined) ? data.homeFacility.name : ''
        };
        fhirResult.contained = [];
        fhirResult.contained.push(fhirContained);

        fhirResult.managingOrganization = {};
        fhirResult.managingOrganization.reference = '#' + managingOrgId;

    }

    var telecomFhir = [];
    if (data.telecom !== undefined) {
        for (i = 0; i < data.telecom.length; i++) {
            var t = {};
            if (data.telecom[i].use !== undefined && data.telecom[i].use === 'WP') {
                t.use = 'work';
            } else if (data.telecom[i].use !== undefined && data.telecom[i].use === 'H') {
                t.use = 'home';
            }
            t.system = 'phone';
            t.value = data.telecom[i].value || '';
            telecomFhir.push(t);
        }
        if (telecomFhir.length > 0) {
            fhirResult.telecom = telecomFhir;
        }
    }

    //home | work | temp | old - purpose of this address
    var addressFhir = [];
    if (data.address !== undefined) {
        for (i = 0; i < data.address.length; i++) {
            var a = {};

            if (data.address[i].use !== undefined && data.address[i].use === 'WP') {
                a.use = 'work';
            } else if (data.address[i].use !== undefined && data.address[i].use === 'H') {
                a.use = 'home';
            }

            a.line = [];
            if (data.address[i].line1 !== undefined) {
                a.line.push(data.address[i].line1);
            }
            if (data.address[i].line2 !== undefined) {
                a.line.push(data.address[i].line2);
            }
            a.city = data.address[i].city || '';
            a.state = data.address[i].state || '';
            a.postalCode = data.address[i].postalCode || '';

            addressFhir.push(a);
        }
        if (addressFhir.length > 0) {
            fhirResult.address = addressFhir;
        }
    }


    var contactFhir = [];
    if (data.contact !== undefined) {
        for (i = 0; i < data.contact.length; i++) {
            var c = {};
            c.relationship = [];

            var coding = {};
            coding.coding = [];
            var codingItem = {};
            codingItem.system = 'http://hl7.org/fhir/patient-contact-relationship';
            if (data.contact[i].typeCode !== undefined) {
                switch (data.contact[i].typeCode) {
                    case 'urn:va:pat-contact:NOK':
                        {
                            codingItem.code = 'family';
                        }
                        break;
                    case 'urn:va:pat-contact:ECON':
                        {
                            codingItem.code = 'emergency';
                        }
                        break;
                }
            }
            codingItem.display = data.contact[i].typeName || '';
            coding.coding.push(codingItem);
            c.relationship.push(coding);
            c.relationship[c.relationship.length - 1].text = data.contact[i].typeName || '';

            c.name = {};
            c.name.use = 'usual';
            c.name.text = data.contact[i].name || '';

            contactFhir.push(c);
        }
        if (contactFhir.length > 0) {
            fhirResult.contact = contactFhir;
        }
    }



    var maritalStatusFhir = {};
    maritalStatusFhir.coding = [];
    if (data.maritalStatusCode !== undefined) {
        var m = {};
        m.system = 'http://hl7.org/fhir/v3/MaritalStatus';

        switch (data.maritalStatusCode) {
            case 'urn:va:pat-maritalStatus:D':
                {
                    m.code = 'D';
                    m.display = 'Divorced';
                }
                break;
            case 'urn:va:pat-maritalStatus:U':
                {
                    m.code = 'UNK';
                    m.display = 'unknown';
                }
                break;
            case 'urn:va:pat-maritalStatus:S':
                {
                    m.code = 'S';
                    m.display = 'Never Married';
                }
                break;
            case 'urn:va:pat-maritalStatus:M':
                {
                    m.code = 'M';
                    m.display = 'Married';
                }
                break;
            case 'urn:va:pat-maritalStatus:L':
                {
                    m.code = 'L';
                    m.display = 'Legally Separated';
                }
                break;
            case 'urn:va:pat-maritalStatus:W':
                {
                    m.code = 'W';
                    m.display = 'Widowed';
                }
                break;
        }
        maritalStatusFhir.coding.push(m);
    }

    if (maritalStatusFhir.coding.length > 0) {
        fhirResult.maritalStatus = maritalStatusFhir;
    }
    var identifierFhir;
    if (data.lrdfn !== undefined) {
        identifierFhir = {
            //'label': 'lrdfn',
            'system': 'http://vistacore.us/fhir/id/lrdfn',
            'value': (data.lrdfn !== undefined) ? data.lrdfn.toString() : ''
        };
        fhirResult.identifier.push(identifierFhir);
    }
    if (data.icn !== undefined) {
        identifierFhir = {
            //'label': 'icn',
            'system': 'http://vistacore.us/fhir/id/icn',
            'value': data.icn || ''
        };
        fhirResult.identifier.push(identifierFhir);
    }

    return fhirResult;
}



module.exports.getResourceConfig = getResourceConfig;
module.exports.convertToFhir = convertToFhir;

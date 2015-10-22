'use strict';
var _ = require('underscore');
var rdk = require('../../core/rdk');
var fs = require('fs');
var util = require('util');
var crypto = require('crypto');
var moment = require('moment');
var searchUtil = require('./results-parser');
var _s = require('underscore.string');
var parseString = require('xml2js').parseString;
var http = require('../../utils/http');
var mvi = require('../../subsystems/mvi-subsystem');
var maskPtSelectSsn = require('./search-mask-ssn').maskPtSelectSsn;

// below: _ exports for unit testing only
module.exports._checkInvalidGlobalSearchParameters = checkInvalidGlobalSearchParameters;
module.exports._parseGlobalSearchResults = parseGlobalSearchResults;
module.exports._queryGlobalSearch = queryGlobalSearch;


var xml_1305_ssn = fs.readFileSync(__dirname + '/xml/1305-ssn.xml').toString();
var xml_1305_dob = fs.readFileSync(__dirname + '/xml/1305-dob.xml').toString();
var xml_1305_fullName = fs.readFileSync(__dirname + '/xml/1305-fullName.xml').toString();
var xml_1305_firstName = fs.readFileSync(__dirname + '/xml/1305-firstName.xml').toString();
var xml_1305_lastName = fs.readFileSync(__dirname + '/xml/1305-lastName.xml').toString();
var xml_1305 = fs.readFileSync(__dirname + '/xml/1305.xml').toString();

module.exports.apiDocs = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.swagger.paramTypes.query('name.last', 'patient last name', 'string', true),
            rdk.docs.swagger.paramTypes.query('name.first', 'patient first name', 'string', false),
            rdk.docs.swagger.paramTypes.query('ssn', 'patient full social security number', 'string', false),
            rdk.docs.swagger.paramTypes.query('date.birth', 'patient date of birth in mm/dd/yyyy format', 'string', false)  // todo: pattern
        ],
        responseMessages: []
    }
};

module.exports.getGlobalSearch = function(req, res) {
    req.logger.info('global search invoked');
    var config = req.app.config;
    var params = getGlobalSearchParams(req);
    req.logger.debug('received parameters ' + JSON.stringify(params));
    var errorMessage = checkInvalidGlobalSearchParameters(params);
    if (errorMessage) {
        res.status(rdk.httpstatus.not_acceptable).rdkSend(errorMessage);
    } else {
        queryGlobalSearch(config, params, req, res, parseGlobalSearchResults);
    }
};

function getGlobalSearchParams(req) {
    var params = {};
    params.fname = req.query['name.first'] || req.body['name.first'];
    params.lname = req.query['name.last'] || req.body['name.last'];
    params.ssn = req.query.ssn || req.body.ssn;
    params.dob = req.query['date.birth'] || req.body['date.birth'];
    if (params.fname) {
        params.fname = params.fname.toUpperCase();
    }
    if (params.lname) {
        params.lname = params.lname.toUpperCase();
    }
    return params;
}

function queryGlobalSearch(config, queryParams, request, response, next) {
    if (config.mvi.protocol !== 'http' && config.mvi.protocol !== 'https') {
        return;
    }

    //fill in query parameters
    var query = '';

    var querySub = {};

    if (queryParams.ssn) {
        query += xml_1305_ssn;
        querySub.ssn = queryParams.ssn.replace(/-/g, '');
    }
    if (queryParams.dob) {
        query += xml_1305_dob;
        querySub.dob = queryParams.dob.format('YYYYMMDD');
    }

    if (queryParams.fname || queryParams.lname) {
        if (queryParams.fname && queryParams.lname) {
            query += xml_1305_fullName;
            querySub.lname = queryParams.lname;
            querySub.fname = queryParams.fname;
        } else if (queryParams.fname) {
            query += xml_1305_firstName;
            querySub.fname = queryParams.fname;
        } else //if(queryParams.lname)
        {
            query += xml_1305_lastName;
            querySub.lname = queryParams.lname;
        }
    }
    query = _s.sprintf(query, querySub);
    querySub = {
        firstname: request.session.user.firstname || '',
        lastname: request.session.user.lastname || '',
        query: query,
        sender: config.mvi.senderCode,
        msgID: crypto.randomBytes(8).toString('hex') //16 bit ID small enough to be easily spoofed
    };
    var soapRequest = _s.sprintf(xml_1305, querySub);
    //invoke service
    var httpConfig = mvi.getMVIHttpConfig(config, request.logger);

    try {
        http.post(soapRequest, config, httpConfig, function(statusCode, data) {
            if (statusCode !== undefined) {
                request.logger.error('Received error response from MVI');
                response.status(500).rdkSend({
                    'data': {
                        'items': []
                    },
                    message: 'Cannot connect to MVI.'
                });
                return;
            } else {
                parseString(data, function(err, result) {
                    if (!err) {
                        request.logger.info('MVI Result: ' + JSON.stringify(result));
                        response.rdkSend(next(searchUtil.retrieveObjFromTree(result, ['Envelope', 'Body', 0, 'PRPA_IN201306UV02', 0]),request)); //throw away soap envelope
                    } else {
                        request.logger.debug(util.inspect(err));
                    }
                    return;
                });
            }
        });
    } catch (err) {
        response.status(500).rdkSend({
            'data': {
                'items': []
            },
            message: 'Cannot connect to MVI.'
        });
    }
}


function parseGlobalSearchResults(results, request) {
    try {
        var msg = '';
        var acknowledgementDetail = '';
        var patientList = [];
        var responseCode = searchUtil.retrieveObjFromTree(results, ['controlActProcess', 0, 'queryAck', 0, 'queryResponseCode', 0, '$', 'code']);
        if (responseCode !== undefined && responseCode.length > 0) {
            if (responseCode === 'QE') { //Too Many results found return code from MVI
                msg = 'Search returned too many results please refine your search criteria and try again.';
                return {
                    'data': {
                        'items': []
                    },
                    'msg': msg
                };
            }
            if (responseCode === 'NF') { //No Results Found return code from MVI
                msg = 'No results were found.';
                return {
                    'data': {
                        'items': []
                    },
                    'msg': msg
                };
            }
            if (responseCode === 'AE') {  //MVI Application Error
                var typeCode = searchUtil.retrieveObjFromTree(results, ['acknowledgement', 0, 'typeCode', 0,  '$', 'code']);
                //Need to check to see if the typeCode is 'AR'. If it is then their is a system error on the MVI side that should be displayed to the user. Other wise it is
                // an Application or Data Error and the user should be told to retry.
                if (typeCode === 'AR') {

                    acknowledgementDetail = searchUtil.retrieveObjFromTree(results, ['acknowledgement', 0, 'acknowledgementDetail', 0,  'text', 0]);
                    request.logger.warn('The VA MVI Application experienced a system error: ' + acknowledgementDetail);
                    msg = 'The VA MVI Application experienced a system error. Please try again later.';
                    return {
                        'data': {
                            'items': []
                        },
                        'msg': msg
                    };
                }
                else
                {
                    acknowledgementDetail = searchUtil.retrieveObjFromTree(results, ['acknowledgement', 0, 'acknowledgementDetail', 0,  'text', 0]);
                    request.logger.warn('No results were found due to a VA MVI Application or Data error: ' + acknowledgementDetail);
                    msg = 'No results were found due to a VA MVI Application or Data error. Please modify your search and try again.';
                    return {
                        'data': {
                            'items': []
                        },
                        'msg': msg
                    };
                }
            }
        }
        var patients = results.controlActProcess[0].subject;
        if (patients !== null && patients !== undefined) {
            if (_.isArray(patients)) {
                _.each(patients, function(data) {
                    patientList.push(parseGlobalPatient(data,request));
                });
            } else {
                patientList.push(parseGlobalPatient(patients,request));
            }
        } else {
            msg = 'No results were found.';
        }
        return maskPtSelectSsn({
            'data': {
                'items': patientList
            },
            'msg': msg
        });
    } catch (e) {
        console.log(e);
        return {
            'msg': 'Cannot connect to MVI.'
        };
    }
}

function parseGlobalPatient(searchResult,request) {
    var patient = {};
    var patientPerson = searchUtil.retrieveObjFromTree(searchResult, ['registrationEvent', 0, 'subject1', 0, 'patient', 0, 'patientPerson', 0]);

    var patientName = patientPerson.name;
    if (_.isArray(patientName)) {
        _.each(patientName, function(name) {
            if (name.$.use === 'L') {   //L value in the 'use' field means it is the known name, not an alias name, this is here to handle the case where an Alias exists
                if (name.given[0] !== undefined) {
                    patient.givenNames = name.given[0]; //Only assign the given name if it exists. Just in case as we saw once case it was not their for a record
                }
                patient.familyName = name.family[0];
            }
        });
    } else if (patientName.$.use === 'L') {  //L value in the 'use' field means it is the known name, not an alias name
        if (patientName.given[0] !== undefined) {
            patient.givenNames = patientName.given[0]; //Only assign the given name if it exists. Just in case as we saw once case it was not their for a record
        }
        patient.familyName = patientName.family[0];
    } else {
        //This should never occur according the the MVI specification
        request.logger.warn('No Name record with use as L found for this patient. Putting Unknown in First and Last Name.');
        patient.givenNames = 'Unknown';
        patient.familyName = 'Unknown';
    }
    patient.genderCode = patientPerson.administrativeGenderCode[0].$.code;
    var otherID = patientPerson.asOtherIDs[0];
    if (_.isArray(otherID)) {
        _.each(otherID, function(data) {
            if (data.$.classCode === 'SSN') {
                patient.ssn = data.id[0].$.extension;
            }
        });
    } else if (otherID.$.classCode === 'SSN') {
        patient.ssn = otherID.id[0].$.extension;
    } else {
        request.logger.warn('No SSN found in the MVI record that was returned.');
    }
    patient.birthDate = patientPerson.birthTime[0].$.value;

    if (patientPerson.addr && patientPerson.addr.length > 0) {
        patient.address = [{
            city: patientPerson.addr[0].city[0] || '',
            line1: patientPerson.addr[0].streetAddressLine[0] || '',
            state: patientPerson.addr[0].state[0] || '',
            use: patientPerson.addr[0].$.use || '',
            zip: patientPerson.addr[0].postalCode[0] || ''
        }];
    }

    if (patientPerson.telecom && patientPerson.telecom.length > 0) {
        patient.telecom = [{
            use: patientPerson.telecom[0].$.use || '',
            value: patientPerson.telecom[0].$.value || ''
        }];
    }

    //patient.dateAdmitted
    patient.id = searchUtil.retrieveObjFromTree(searchResult, ['registrationEvent', 0, 'subject1', 0, 'patient', 0, 'id', 0, '$', 'extension']);

    return searchUtil.transformPatient(patient);
}


function checkInvalidGlobalSearchParameters(params) {
    if ((params.lname === undefined) || (params.ssn === undefined && params.dob === undefined && params.fname === undefined)) {
        //invalid combination of parameters
        return 'At least two fields are required to perform a search. Last Name is required.';
    }
    var nameRegex = /^[- ,A-Z']+$/;
    var ssnRegex = /^(\d{3})-?(\d{2})-?(\d{4})$/;
    var dateRegex = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;

    if (!nameRegex.test(params.lname)) {
        //last name is empty or contains unknown characters
        if (params.lname.length === 0) {
            return 'Last Name is required.';
        } else {
            return 'Last Name contains illegal characters.';
        }
    }
    if (params.fname !== undefined && !nameRegex.test(params.fname)) {
        //first name is contains unknown characters
        return 'First Name contains illegal characters.';
    }
    if (params.ssn !== undefined && !ssnRegex.test(params.ssn)) {
        //ssn in unknown format
        return 'SSN is invalid.';
    }
    if (params.dob !== undefined) {
        if (dateRegex.test(params.dob)) {
            var dte = moment(params.dob, 'MM/DD/YYYY');
            if (!dte.isValid()) {
                //not a valid date
                return 'Date of Birth is not a valid date. It should be in MM/DD/YYYY format.';
            }
            params.dob = dte;
        } else {
            //date in incorrect format
            return 'Date of Birth needs to be in MM/DD/YYYY format.';
        }
    }
    return false;
}

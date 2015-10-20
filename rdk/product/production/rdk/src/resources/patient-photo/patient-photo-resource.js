'use strict';
var rdk = require('../../core/rdk');
var _ = require('underscore');
var http = require('../../utils/http');
var fs = require('fs');
var _s = require('underscore.string');
var parseString = require('xml2js').parseString;
var mvi = require('../../subsystems/mvi-subsystem');
var crypto = require('crypto');
var moment = require('moment');
var searchUtil = require('../patient-search/results-parser');
// The base64 encoded gender-neutral image to return when a patient photo is not found in VHIC
var genderNeutralEncodedImageString = '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';
var apiDocs = {
    spec: {
        summary: 'Get patient photo from VHIC',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid
        ],
        responseMessages: []
    }
};

function getResourceConfig() {
        return [{
            name: 'getPatientPhoto',
            path: '',
            get: getPatientPhoto,
            interceptors: {
                operationalDataCheck: false,
                synchronize: false
            },
            description: 'Get patient photo from VHIC',
            parameters: {
                get: {
                    pid: {
                        required: true,
                        description: 'the patient ICN (integration control number), for example 4325678V4325678'
                    }
                }
            },
            permissions: [],
            apiDocs: apiDocs,
            permitResponseFormat: true
        }];
    }
    /**
     * Retrieves a patient photo from VHIC based on the given patient ICN.
     *
     * @param  {Object} req - default Express request
     * @param  {Object} res - default Express response
     *
     * @return undefined
     *
     * 200 if user has access,
     * 308 if user needs to BTG,
     * 403 if unauthorized.
     */
function getPatientPhoto(req, res) {
    // Set audit log parameters
    req.audit.dataDomain = 'Patient Photo';
    req.audit.logCategory = 'PATIENT_PHOTO';
    // Get the requested ICN from the "pid" field in the request
    var requestedICN = req.param('pid');
    if (typeof requestedICN === 'undefined') {
        res.send(rdk.httpstatus.bad_request, 'Missing parameter. Please include a pid parameter.');
    }
    //Build the full ICN patient identifier so we can pass it into MVI
    requestedICN += '^NI^200M^USVHA';
    // Get the application configuration from the request
    var config = req.app.config;
    // Check to see if the MVI protocol is configured correctly
    var mviProtocol = config.mvi.protocol;
    if (mviProtocol === 'http' || mviProtocol === 'https') {
        // Get the MVI HTTP configuration
        var mviHttpConfig = mvi.getMVIHttpConfig(config, req.logger);
        // Define the substitution values to use for the MVI query
        var mviQuerySub = {
            time: moment().format('YYYYMMDDHHmmss'),
            id: requestedICN,
            firstname: req.session.user.firstname || '',
            lastname: req.session.user.lastname || '',
            sender: config.mvi.senderCode,
            msgID: crypto.randomBytes(8).toString('hex')
        };
        // Load the MVI SOAP request XML
        var xml_1309 = fs.readFileSync(__dirname + '/xml/1309.xml').toString();
        // Replace the variables inside the XML with the corresponding substitution values
        // to build the MVI SOAP request
        var mviSoapRequest = _s.sprintf(xml_1309, mviQuerySub);
        try {
            // Send the SOAP request to MVI
            http.post(mviSoapRequest, config, mviHttpConfig, function(statusCode, data) {
                if (statusCode === undefined) {
                    var vhicId;
                    parseString(data, function(err, result) {
                        if (!err) {
                            // Get the id element out of the MVI SOAP response
                            if (JSON.stringify(result).indexOf('subject1') > -1) {
                                var idObjectFromTree = searchUtil.retrieveObjFromTree(result, ['Envelope', 'Body', 0, 'PRPA_IN201310UV02', 0, 'controlActProcess', 0, 'subject', 0, 'registrationEvent', 0, 'subject1', 0, 'patient', 0, 'id']);
                                // Create a map of the patient ids that are in the SOAP response
                                var idList = _.map(idObjectFromTree, function(value) {
                                    return value.$.extension;
                                });
                                // Iterate through the idList to find the VHIC id
                                for (var i = 0; i < idList.length; i++) {
                                    var idType = searchUtil.determineIDType(idList[i]);
                                    if (idType === 'VHIC') {
                                        vhicId = idList[i];
                                    }
                                }
                                if (_.isString(vhicId)) {
                                    var vhicIdOnly = vhicId.split('^');
                                    vhicIdOnly = vhicIdOnly[0];
                                    if (_.isString(vhicIdOnly)) {
                                        // Check to see if the VHIC protocol is configured correctly
                                        var vhicProtocol = config.vhic.protocol;
                                        if (vhicProtocol === 'http' || vhicProtocol === 'https') {
                                            // Get the VHIC HTTP configuration
                                            var vhicHttpConfig = getVHICHttpConfig(config, req.logger);
                                            // Define the substitution values to use for the VHIC query
                                            var vhicQuerySub = {
                                                time: moment().format('YYYYMMDDHHmmss'),
                                                id: requestedICN,
                                                firstname: req.session.user.firstname || '',
                                                lastname: req.session.user.lastname || '',
                                                sender: config.vhic.senderCode,
                                                msgID: crypto.randomBytes(8).toString('hex'),
                                                cardid: vhicIdOnly
                                            };
                                            // Load the VHIC SOAP request XML
                                            var xml_vhic = fs.readFileSync(__dirname + '/xml/vhic.xml').toString();
                                            // Replace the variables inside the XML with the corresponding substitution values
                                            // to build the VHIC SOAP request
                                            var vhicSoapRequest = _s.sprintf(xml_vhic, vhicQuerySub);
                                            if (config.vhic.host) {
                                                //Send the soap request to VHIC
                                                sendSoapRequestToVhic(vhicSoapRequest, vhicHttpConfig, req, res);
                                            } else {
                                                res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                                            }
                                        } else {
                                            req.logger.warn('The VHIC endpoint was not configured correctly.');
                                            res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                                        }
                                    } else {
                                        req.logger.warn('The VHIC ID could not be parsed.');
                                        res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                                    }
                                } else {
                                    req.logger.warn('The MVI did not return a VHIC ID.');
                                    res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                                }
                            } else {
                                req.logger.warn('The MVI did not return any patient IDs.');
                                res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                            }
                        } else {
                            req.logger.warn('A problem occurred while attempting to parse results from MVI: ' + err);
                            res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                        }
                    });
                } else {
                    req.logger.warn('Received error response from MVI when attempting a POST request. ' + statusCode);
                    res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                }
            });
        } catch (err) {
            req.logger.warn('Received error response from MVI. ' + err);
            res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
        }
    } else {
        res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
    }
}

function sendSoapRequestToVhic(vhicSoapRequest, vhicHttpConfig, req, res) {
    try {
        // Send the SOAP request to VHIC
        http.post(vhicSoapRequest, req.app.config, vhicHttpConfig, function(statusCode, data) {
            if (statusCode === undefined) {
                var results;
                var patientPhoto;
                parseString(data, function(err, result) {
                    if (!err) {
                        results = searchUtil.retrieveObjFromTree(result, ['Envelope', 'Body', 0, 'getVeteranPicturesResponse', 0, 'return', 0, 'results', 0]);
                        if (_.has(results, "picture")) {
                            patientPhoto = results.picture[0];
                            res.status(rdk.httpstatus.ok).send(JSON.stringify(patientPhoto).replace('"', '').replace('"', ''));
                            return;
                        }
                    }
                    res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
                });
            } else {
                req.logger.warn('Received error response from VHIC: ' + statusCode);
                res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
            }
        });
    } catch (err) {
        req.logger.warn('Received error response from VHIC. ' + err);
        res.status(rdk.httpstatus.ok).send(genderNeutralEncodedImageString);
    }
}

function getVHICHttpConfig(config, logger) {
    var path;
    var httpConfig = {
        protocol: config.vhic.protocol,
        logger: logger,
        options: {
            hostname: config.vhic.host,
            port: config.vhic.port,
            method: 'POST',
            path: config.vhic.search.path, // search.path and sync.path are the same in config
            headers: {
                'Content-Type': 'text/xml; charset=utf-8'
            }
        }
    };
    if (config.vhic.options) {
        _.extend(httpConfig.options, config.vhic.options);
    }
    try {
        if (httpConfig.options.key) {
            path = httpConfig.options.key;
            httpConfig.options.key = fs.readFileSync(path);
        }
        if (httpConfig.options.cert) {
            path = httpConfig.options.cert;
            httpConfig.options.cert = fs.readFileSync(path);
        }
    } catch (e) {
        if (logger) {
            logger.error('Error reading certificate for VHIC');
        } else {
            console.log('Error reading certificate information for VHIC');
        }
    }
    return httpConfig;
}
module.exports.getResourceConfig = getResourceConfig;
module.exports.getPatientPhoto = getPatientPhoto;

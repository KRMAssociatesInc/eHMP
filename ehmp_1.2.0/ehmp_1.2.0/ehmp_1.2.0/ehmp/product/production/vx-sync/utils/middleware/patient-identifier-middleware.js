'use strict';

require('../../env-setup');

var _ = require('underscore');
var format = require('util').format;

var inspect = require('../inspect');
var idUtil = require('../patient-identifier-utils');
var logUtil = require('../log');

var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');

var IDENTIFIER_QS_TYPES = ['dod', 'pid', 'icn'];

function PatientIdentifierAPI(setLog, setConfig, jdsClient) {
    if (!(this instanceof PatientIdentifierAPI)) { return new PatientIdentifierAPI(setLog, setConfig, jdsClient); }
    this.jdsClient = jdsClient || new JdsClient(setLog, setConfig);
    this.log = logUtil.getAsChild('patient-identifier-util', setLog);
    this.config = setConfig;

    this.validatePatientIdentifier = validatePatientIdentifier.bind(this);
    this.getJPID = getJPID.bind(this);
    this.createJPID = createJPID.bind(this);
}

/**
 * Middleware to validate the patient identifier in the query string
 */
var validatePatientIdentifier = function(req, res, next) {
    var self = this;
    self.log.debug('validatePatientIdentifier()');

    var idList = _.filter(IDENTIFIER_QS_TYPES, function(type) {
        return !_.isUndefined(req.param(type));
    });

    self.log.debug('Identifier parameters found:');
    self.log.debug(inspect(idList));

    if (idList.length > 1) {
        return res.status(400).send('Please limit your request to one patient identifier.');
    }

    if (idList.length === 0) {
        return res.status(400).send('Please provide one valid patient identifier.');
    }

    var idType = _.first(idList);
    var idValue = req.param(idType);

    if (idValue.length < 1) {
        return res.status(400).send(format('No value was given for the query parameter %s', idType));
    }

    if (!idUtil.isIdFormatValid(idType, idValue)) {
        return res.status(400).send(format('The value "%s" for patient id type "%s" was not in a valid format', idValue, idType));
    }

    if (idType === 'icn') {
        self.jdsClient.getOperationalDataPtSelectByIcn(idValue, function(err, result, body) {
            if (!err){
               var patientIdentifiers = _.map(body.data.items, function(item){
                    return {type:'pid', value: item.pid};
               });

                if (patientIdentifiers.length > 0) {
                    self.log.debug('Converting ICN: ' + idValue + ' to PID: ' + patientIdentifiers[0].value);
                    idType = patientIdentifiers[0].type;
                    idValue = patientIdentifiers[0].value;
                }
            }

            req.patientIdentifier = idUtil.create(idType, idValue);

            self.log.debug('Generated patientIdentifier object');
            self.log.debug(inspect(req.patientIdentifier));

            next();
        });
    } else {
        req.patientIdentifier = idUtil.create(idType, idValue);

        self.log.debug('Generated patientIdentifier object');
        self.log.debug(inspect(req.patientIdentifier));

        next();
    }
};

/**
 * Middleware to retrieve the JPID
 */
var getJPID = function(req, res, next) {
    var self = this;
    self.log.debug('getJPID()');
    var jdsIdentifierRequest = { 'patientIdentifier': req.patientIdentifier };
    self.jdsClient.getPatientIdentifier(jdsIdentifierRequest, function(error, response, result) {
        var idValue = req.patientIdentifier.value;
        if (response.statusCode === 404) {
            self.log.debug('jpid not found');
            req.jpid = false;
            next();
        } else if (error || response.statusCode !== 200) {
            self.log.debug(response.statusCode + ' Error retrieving JPID for patient identifier: ' + idValue);
            self.log.debug(inspect(response));
            res.status(response.statusCode).json(result);
        } else {
            self.log.debug('JPID found: ', result);
            req.jpid = result.jpid;
            req.identifiers = result.patientIdentifiers;

            next();
        }
    });
};

/**
 * Middleware to create a JPID
 */
var createJPID = function(req, res, next) {
    var self = this;
    self.log.debug('createJPID()');

    if (req.jpid !== false) { return next(); }

    var jdsStoreRequest = {
        'patientIdentifiers': [
            req.patientIdentifier.value
        ]
    };

    self.jdsClient.storePatientIdentifier(jdsStoreRequest, function(error, response) {
        if (error) { self.log.debug(error, response); }
        self.log.debug('JPID Generated:');
        self.getJPID(req, res, next);
    });
};

module.exports = PatientIdentifierAPI;
PatientIdentifierAPI._tests = {
    '_validatePatientIdentifier': validatePatientIdentifier,
    '_getJPID': getJPID,
    '_createJPID': createJPID
};
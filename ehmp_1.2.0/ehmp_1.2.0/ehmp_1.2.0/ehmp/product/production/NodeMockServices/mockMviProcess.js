/*jslint node: true */
'use strict';

var config = require('./config.js');
var bunyan = require('bunyan');
var path = require('path');
var logger = bunyan.createLogger(config.logger);
var _ = require('lodash');
var async = require('async');
var mockMvi1305 = require('./mockMvi1305.js');
var mockMvi1309 = require('./mockMvi1309.js');
var libxmljs = require("libxmljs");

var data_path = '/data/';
var data_file_extension = '.xml';

function getElement(xmlDoc, path, namespace) {
    try {
        return xmlDoc.get(path, namespace).text();
    }
    catch (err) {
        return "";
    }
}

function getAttribute(xmlDoc, path, namespace) {
    try {
        return xmlDoc.get(path, namespace).value();
    }
    catch (err) {
        return "";
    }
}

function fetchMviData(req, res) {
    var filePath = "mvi/";

    // BH: Should these really be initialized to default values like this?
    var lastName = 'EIGHT';
    var firstName = 'PATIENT';
    var dob = '19350407';
    var ssn = '';
    var patientId = '10108V420871^NI^200M^USVHA';

    var body = "";
    req.on('data', function(data) {
        logger.trace('fetchMviData: received soap message content: ' + data.toString());
        body = body + data.toString();
    });

    //Once the data has finished uploading to the server...
    req.on('end', function(data) {
        //Check to see if they sent us a POST without any body.
        if (body === null || body === '' || body === undefined) {
            res.status(404).end("Did you forget to send a PRPA_IN201305UV02 or PRPA_IN201309UV02 message, the body was empty");
            return;
        }

        //Parse that data into an XML object.
        var xmlDoc = null;
        try {
            xmlDoc = libxmljs.parseXmlString(body);
        }
        catch (err) {
            var s = 'Problem parsing XML Soap Message: ' + err;
            logger.warn(s);
            res.status(404).end(s);
            return;
        }

        var namespace = { soapenv: 'http://schemas.xmlsoap.org/soap/envelope/', vaww: 'http://vaww.oed.oit.domain' };
        var path1305 = '//soapenv:Envelope/soapenv:Body/vaww:PRPA_IN201305UV02';
        var path1309 = '//soapenv:Envelope/soapenv:Body/vaww:PRPA_IN201309UV02';

        //Determine whether we are a 1305 message or a 1309 message
        var message1305 = xmlDoc.get(path1305, namespace); //If not undefined, we are a "Search Person (Attended)" message
        var message1309 = xmlDoc.get(path1309, namespace); //If not undefined, we are a "Get Corresponding IDs" message

        if (message1305 !== undefined) {
            //Since we are a 1305 message, retrieve the lastName, firstName, dob, and ssn from the message sent to us.
            lastName = getElement(xmlDoc, '//livingSubjectName/value/family');
            firstName = getElement(xmlDoc, '//livingSubjectName/value/given');
            dob = getAttribute(xmlDoc, '//livingSubjectBirthTime/value/@value');
            ssn = getAttribute(xmlDoc, '//livingSubjectId/value/@extension');

            //Now, see which message file to return based off of our criteria.
            filePath += "1305/" + mockMvi1305.fetchMvi1305FileName(lastName, firstName, dob, ssn);
        }
        else if (message1309 !== undefined) {
            patientId = xmlDoc.get('//patientIdentifier/value').attr('extension').value();

            //Now, see which message file to return based off of our criteria.
            logger.debug('fetchMviData: looking up patient id: ' + patientId);
            filePath += "1309/" + mockMvi1309.fetchMvi1309FileName(patientId);
        }
        else {
            //We weren't a 1305 or a 1309 message, let them know.
            res.status(404).end("You did not send a PRPA_IN201305UV02 or PRPA_IN201309UV02 message, you sent something else");
            return;
        }

        //We have the full path and name of the file, add the extension to it so we can send it.
        filePath += data_file_extension;
        logger.debug('fetchMviData: sending file ' + filePath);

        //Add a timestamp to the header and set the root directory to find the file from.
        var options = {
            root: path.join(__dirname , data_path),
            headers: {
                'x-timestamp': Date.now(),
                'Content-Type': 'text/xml'
            }
        };

        //Send the file back to them.
        res.sendFile(filePath, options, function (err) {
            if (err) {
                logger.error(err);
                res.status(404).end("Problem sending file: " + err);
            } else {
                logger.debug(filePath + ' sent');
            }
        });
    });

}

module.exports.fetchMviData = fetchMviData;

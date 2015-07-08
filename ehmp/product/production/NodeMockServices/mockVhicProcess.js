/*jslint node: true */
'use strict';

var config = require('./config.js');
var bunyan = require('bunyan');
var logger = bunyan.createLogger(config.logger);
var _ = require('lodash');
var mockVhic = require('./mockVhic.js');
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

/**
 * Mimicks the behavior of the VHIC CardPictureService which returns a
 * veteran's VHIC card photo based on a veteran's card id. This function
 * takes in a SOAP request that contains a veteran's cardId and returns
 * a SOAP response that contains the veteran's card photo.
 *
 * @param  {Object} req - default Express request
 * @param  {Object} res - default Express response
 * @returns undefined
 */
function fetchVhicData(req, res) {
    var filePath = "/vhic/";
    var veteranCardId = "";
    var siteId = "";
    var body = "";

    req.on('data', function(data) {
        body = data.toString();
        logger.info("body = " + body);

        //Parse the soap message into an XML object.
        var xmlDoc = null;
        try {
            xmlDoc = libxmljs.parseXmlString(body);
            logger.info("xmlDoc = " + xmlDoc);
        }
        catch (err) {
            res.status(404).end("Problem parsing XML Soap Message: " + err);
            return;
        }

        //Define the anticipated XML namespaces.
        var namespace = { soap: 'http://www.w3.org/2003/05/soap-envelope', vhic: 'http://cardpictureservice.vic.va.domain/'};

        //Define the path to the getVeteranPictures message element.
        var pathGetVeteranPictures = '//soap:Envelope/soap:Body/vhic:getVeteranPictures';

        //Define the path to the message element that contains parameters for searching for patient photos.
        var getVeteranPicturesCritiera = xmlDoc.get(pathGetVeteranPictures, namespace);
        logger.info("getVeteranPicturesCritiera = " + getVeteranPicturesCritiera);

        if (getVeteranPicturesCritiera !== undefined) {
            //Get the veteran's card id.
            veteranCardId = getElement(xmlDoc, pathGetVeteranPictures + '/request/cardIds', namespace);
            logger.info("veteranCardId = " + veteranCardId);

            //Now, see which message file to return based off of our criteria.
            filePath += mockVhic.fetchVhicPhotoFileName(veteranCardId);
            logger.info("filePath = " + filePath);
        }
        else {
            res.status(404).end("The SOAP message did not contain a valid 'getVeteranPictures' element.");
            return;
        }

        //We have the full path and name of the file, add the extension to it so we can send it.
        filePath += data_file_extension;

        //Add a timestamp to the header and set the root directory to find the file from.
        var options = {
            root: __dirname + data_path,
            headers: {
                'x-timestamp': Date.now()
            }
        };

        //Send the patient photo.
        res.sendFile(filePath, options, function (err) {
            if (err) {
                logger.error(err);
                res.status(404).end("Problem sending patient photo: " + err);
            } else {
                logger.debug(filePath + ' sent');
            }
        });
    });
}

module.exports.fetchVhicData = fetchVhicData;

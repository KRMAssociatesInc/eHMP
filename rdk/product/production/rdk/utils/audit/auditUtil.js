/*jslint node: true */
'use strict';

var _ = require('underscore');

/**
 * Appends messages to the additonalMessages field of audit.
 * Creates the additionalMessages field if nonexistant.
 * If the Key already exists, the message will be appended to the array.
 * @param {JSON} req the request object holding the audit field
 * @param {String} The Key of the JSON object to append
 * @param {String} message the JSON object to be appended to the additionalMessages field
 */
function addAdditionalMessage(req, key, message) {

    //If additionalMessages does not exist, create it
    if (!req.audit.hasOwnProperty('additionalMessages')) {
        req.audit.additionalMessages = {};
    }

    //Check if the existing key exists in additional messages, otherwise append a new JSON object
    if (req.audit.additionalMessages.hasOwnProperty(key)) {

        //if the key is already an array, push the message, otherwise convert the string to an array
        if (isArray(req.audit.additionalMessages.key)) {
            req.audit.additionalMessages.key.push(message);
        } else {
            var newArray = [];
            newArray.push(req.audit.additionalMessages[key]);
            newArray.push(message);
            req.audit.additionalMessages[key] = newArray;
        }
    } else {

        var appendingMessage = {};
        appendingMessage[key] = message;
        _.extend(req.audit.additionalMessages, appendingMessage);
    }
}

/**
 * Returns whether or not an object is an array
 * @param  {[type]}  object The object in question
 * @return {Boolean} true if the object is of an array type, otherwise false
 */
function isArray(object) {
    return Object.prototype.toString.call(object) === '[object Array]';
}

module.exports.addAdditionalMessage = addAdditionalMessage;

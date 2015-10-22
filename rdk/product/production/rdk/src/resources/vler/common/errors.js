'use strict';
var rdk = require('../../../core/rdk');

FetchError.prototype = Error.prototype;
NotFoundError.prototype = Error.prototype;

function FetchError(message, error) {
    this.name = 'FetchError';
    this.error = error;
    this.message = message;
}

function NotFoundError(message, error) {
    this.name = 'NotFoundError';
    this.error = error;
    this.message = message;
}

function isNotFound(obj) {
    return ('code' in obj.error && String(obj.error.code) === String(rdk.httpstatus.not_found));
}


module.exports.FetchError = FetchError;
module.exports.NotFoundError = NotFoundError;
module.exports.isNotFound = isNotFound;

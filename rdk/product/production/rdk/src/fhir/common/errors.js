'use strict';
var rdk = require('../../core/rdk');

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

// TODO: Refactor all other error instances. JDS returns proper HTTP error codes.
// There's no need to add another layer of error classes.

function HTTPError(code, msg) {
    this.code = code;
    this.message = msg;
}

module.exports.HTTPError = HTTPError;

'use strict';

function DummyResponse() {}
DummyResponse.prototype.status = function(statusCode) {
    this.statusCode = statusCode;
    return this;
};
DummyResponse.prototype.send = function(responseText) {
    this.response = responseText;
    return this;
};
DummyResponse.prototype.json = function(responseObj) {
    return this.send(responseObj);
};

module.exports = DummyResponse;
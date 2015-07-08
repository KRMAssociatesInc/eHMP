'use strict';

function DummyRequest(requestParameters) {
    if (!(this instanceof DummyRequest)) {
        return new DummyRequest({});
    }
    this.parameters = requestParameters || {};
}

DummyRequest.prototype.param = function(requestParameter) {
    return this.parameters[requestParameter];
};

module.exports = DummyRequest;
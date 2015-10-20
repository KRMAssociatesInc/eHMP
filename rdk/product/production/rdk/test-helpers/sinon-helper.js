'use strict';

global.sinon = require('sinon');  // allows use of sinon outside of unit tests
beforeEach(function() {
    global.sinon = require('sinon').sandbox.create();
});

afterEach(function() {
    global.sinon = sinon.restore();
});

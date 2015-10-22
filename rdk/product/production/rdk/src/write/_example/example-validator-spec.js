'use strict';

var validator = require('./example-validator');

describe('example validator', function() {
    var writebackContext;
    beforeEach(function() {
        writebackContext = {};
        writebackContext.model = {};
    });
    it('identifies bad creates', function(done) {
        writebackContext.model.badCreate = true;
        validator.create(writebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });
    it('identifies good creates', function(done) {
        writebackContext.model.goodUpdate = true;
        validator.create(writebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });
    it('identifies bad updates', function(done) {
        writebackContext.model.badUpdate = true;
        validator.update(writebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });
    it('identifies good updates', function(done) {
        writebackContext.model.goodUpdate = true;
        validator.update(writebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });
});

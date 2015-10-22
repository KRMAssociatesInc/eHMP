'use strict';

var validator = require('./orders-common-validator');

describe('write-back orders common validator', function() {
    var editWritebackContext;

    beforeEach(function() {
        editWritebackContext = {};
        editWritebackContext.resourceId = 12345;
    });

    it('identifies good edit', function(done) {
        validator.edit(editWritebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });

    it('identifies bad edit', function(done) {
        delete editWritebackContext.resourceId;
        validator.edit(editWritebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });

});

'use strict';

var validator = require('./orders-lab-validator');

describe('write-back orders lab validator', function() {
    var createWritebackContext;
    var updateWritebackContext;
    var discontinueWritebackContext;

    beforeEach(function() {
        createWritebackContext = {};
        createWritebackContext.model = {
            "dfn": "100615",
            "provider": "10000000231",
            "location": "285",
            "orderDialog": "LR OTHER LAB TESTS",
            "displayGroup": "6",
            "quickOrderDialog": "2",
            "inputList": [{
                "inputKey": "4",
                "inputValue": "350"
            }, {
                "inputKey": "126",
                "inputValue": "1"
            }, {
                "inputKey": "127",
                "inputValue": "72"
            }, {
                "inputKey": "180",
                "inputValue": "9"
            }, {
                "inputKey": "28",
                "inputValue": "SP"
            }, {
                "inputKey": "6",
                "inputValue": "TODAY"
            }, {
                "inputKey": "29",
                "inputValue": "28"
            }],
            "localId": "12519",
            "uid": "urn:va:order:9E7A:100615:12519",
            "kind": "Laboratory"
        };
        updateWritebackContext = {};
        updateWritebackContext.model = {
            "dfn": "100615",
            "provider": "10000000231",
            "location": "285",
            "orderDialog": "LR OTHER LAB TESTS",
            "displayGroup": "6",
            "quickOrderDialog": "2",
            "orderId": "38479;1",
            "inputList": [{
                "inputKey": "4",
                "inputValue": "350"
            }, {
                "inputKey": "126",
                "inputValue": "1"
            }, {
                "inputKey": "127",
                "inputValue": "72"
            }, {
                "inputKey": "180",
                "inputValue": "2"
            }, {
                "inputKey": "28",
                "inputValue": "SP"
            }, {
                "inputKey": "6",
                "inputValue": "TODAY"
            }, {
                "inputKey": "29",
                "inputValue": "28"
            }],
            "orderCheckList": [{
                "orderCheck": "NEW^11^2^Duplicate order: 11-DEOXYCORTISOL BLOOD   SERUM SP *UNSIGNED*  [UNRELEASED]"
            }],
            "localId": "12519",
            "uid": "urn:va:order:9E7A:100615:12519",
            "kind": "Laboratory"
        };
        discontinueWritebackContext = {};
        discontinueWritebackContext.model = {
            "orderId": "38479;1",
            "provider": "10000000231",
            "location": "285",
            "localId": "12519",
            "uid": "urn:va:order:9E7A:100615:12519",
            "kind": "Laboratory"
        };
    });

    it('identifies good creates', function(done) {
        validator.create(createWritebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });

    it('identifies bad creates', function(done) {
        delete createWritebackContext.model['dfn'];
        validator.create(createWritebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });

    it('identifies good updates', function(done) {
        validator.update(updateWritebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });

    it('identifies bad updates', function(done) {
        delete updateWritebackContext.model['orderId'];
        validator.update(updateWritebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });

    it('identifies good discontinue', function(done) {
        validator.discontinue(discontinueWritebackContext, function(err) {
            expect(err).to.be.falsy();
            done();
        });
    });

    it('identifies bad discontinue', function(done) {
        delete discontinueWritebackContext.model['orderId'];
        validator.discontinue(discontinueWritebackContext, function(err) {
            expect(err).to.be.truthy();
            done();
        });
    });

});

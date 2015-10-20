'use strict';

var validateResponseFormat = require('./validate-response-format');

describe('Tests validateResponseFormat', function() {

    var callback;
    var req;
    var res;

    beforeEach(function() {
        callback = sinon.spy();
        req = {};
        req.logger = sinon.stub(require('bunyan').createLogger(
            {name: 'validate-response-format-spec.js'}
        ));
        res = {};
    });

    it('rejects string bodies', function() {
        var body = 'Hello, world';
        var error = 'response payload must be an object';
        checkValidation(body, error);
    });

    it('supports JSON string bodies', function() {
        var body = '{"message":"Hello, world", "status": 200}';
        checkValidation(body, null);
    });

    it('doesn\'t validate if permitResponseFormat is set', function() {
        req.permitResponseFormat = true;
        var body = 'Hello, world';
        checkValidation(body, null);
    });

    it('doesn\'t validate if permitResponseFormat is set in the config', function() {
        req._resourceConfigItem = {permitResponseFormat: true};
        var body = 'Hello, world';
        checkValidation(body, null);
    });

    it('rejects empty bodies', function() {
        var error = 'response payload must be an object';
        checkValidation(null, error);
    });

    it('rejects array bodies', function() {
        var body = ['one', 'two'];
        var error = 'response payload must not be an array';
        checkValidation(body, error);
    });

    it('rejects empty root objects', function() {
        var body = {};
        var error = 'response payload must contain a "status" field that echoes the response statusCode';
        checkValidation(body, error);
    });

    it('allows objects with only a "status" field', function() {
        var body = {status: 200};
        checkValidation(body, null);
    });

    it('requires a "status" field', function() {
        var body = {data: 'Bob'};
        var error = 'response payload must contain a "status" field that echoes the response statusCode';
        checkValidation(body, error);
    });

    it('rejects "status" fields that aren\'t numbers', function() {
        var body = {data: 'Bob', status: 'hi'};
        var error = 'response payload\'s "status" field must be a number';
        checkValidation(body, error);
    });

    it('rejects "status" fields that don\'t match the response statusCode', function() {
        var body = {data: 'Bob', status: 200};
        var error = 'response payload\'s "status" field must match the response\'s statusCode';
        res.statusCode = 500;
        checkValidation(body, error);
    });

    it('rejects non-object "data" fields', function() {
        var body = {data: 'Bob', status: 200};
        var error = 'response payload\'s "data" field must be an object';
        checkValidation(body, error);
    });

    it('requires "message" to be a string', function() {
        var body = {message: {}, status: 200};
        var error = 'response payload\'s "message" field must be a string';
        checkValidation(body, error);
    });

    function checkValidation(body, error) {
        validateResponseFormat(req, res, body, callback);
        expect(callback.calledWith(error, req, res, body)).to.be.true();
        if (error) {
            expect(req.logger.error.called).to.be.true();
        } else {
            expect(req.logger.error.called).to.be.false();
        }
    }
});

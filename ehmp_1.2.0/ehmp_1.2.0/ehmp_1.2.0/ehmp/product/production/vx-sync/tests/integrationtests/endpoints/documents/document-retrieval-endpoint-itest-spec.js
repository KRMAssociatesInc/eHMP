'use strict';

require('../../../../env-setup');

var config = require(global.VX_ROOT + 'worker-config');
var request = require('request');
var fsUtil = require(global.VX_UTILS + 'fs-utils');
var _ = require('underscore');
var path = require('path');
var vx_sync_ip = require(global.VX_INTTESTS + 'test-config');
var val = require(global.VX_UTILS + 'object-utils').getProperty;

var query = {
    dir: 'f980f325b04d8f18f4fd73bb', //This dir name is shorter than expected so not to conflict with real data
    file: 'dummyDocument.rtf'
};

var httpConfig = {
    path: '/documents',
    method: 'GET',
    port: 8089,
    host: vx_sync_ip,
    qs: _.clone(query),
    url: 'http://' + vx_sync_ip + ':8089/documents',
    timeout: 60000
};

describe('document-retrieval-endpoint.js', function() {
    // disabled for integration VM testing
    // TODO: fix and reenable
    xit('Config doesn\'t contain test data', function() {
        expect(config.documentStorage.publish.path).not.toMatch(/test/);
    });
    it('POST to GET endpoint', function() {
        var testConfig = _.extend({}, httpConfig);
        testConfig.method = 'POST';
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(err).toBeFalsy();
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(404); //should be 405, but express returns 404 for wrong HTTP verb
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('Missing all query parameters', function() {
        var testConfig = _.extend({}, httpConfig);
        delete testConfig.qs;
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(400);
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('Missing dir query parameter', function() {
        var testConfig = _.extend({}, httpConfig);
        delete testConfig.qs.dir;
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(400);
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('Missing file query parameter', function() {
        var testConfig = _.extend({}, httpConfig);
        delete testConfig.qs.file;
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(400);
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('Malformatted dir parameter', function() {
        var testConfig = _.extend({}, httpConfig);
        testConfig.qs.dir = '../../../../etc/pwd';
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(403); //intercepted by express
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('Malformatted file parameter', function() {
        var testConfig = _.extend({}, httpConfig);
        testConfig.qs.file = '&*#)@$$#)@';
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(400);
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });
    it('File not found', function() {
        var testConfig = _.extend({}, httpConfig);
        testConfig.qs.dir = 'abcdef123';
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(404);
                httpConfig.qs = _.clone(query);
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
    });

    // Can't do this test against the VM, so it is disabled for now
    // TODO: rewrite meaningfully for VM
    xit('HTML File retrieved', function() {
        var filePath = config.documentStorage.publish.path + '/' + query.dir + '/test.html';
        filePath = path.resolve(filePath);
        runs(function() {
            fsUtil.copyFile('./tests/data/documents/test.html', filePath, function() {});
        });
        httpConfig.qs.file = 'test.html';
        waitsFor(function() {
            var file = filePath;
            var exists = fsUtil.fileExistsSync(file);
            return exists;
        }, 'File copy', 2000);

        var complete = false;
        runs(function() {
            request(httpConfig, function(err, response, body) {
                expect(response).toBeDefined();
                expect(val(response, 'statusCode')).toEqual(200);
                expect(val(response, 'headers', 'content-type')).toBe('text/html; charset=UTF-8');
                expect(body).toBeTruthy();
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
        runs(function() {
            fsUtil.deleteFile(filePath);
        });
    });
    xit('Other File type retrieved', function() {
        var filePath = config.documentStorage.publish.path + '/' + query.dir + '/BeanStalk-protocol.pdf';
        filePath = path.resolve(filePath);
        runs(function() {
            fsUtil.copyFile('./tests/data/documents/BeanStalk-protocol.pdf', filePath, function() {});
        });
        query.file = 'BeanStalk-protocol.pdf';
        waitsFor(function() {
            var file = filePath;
            var exists = fsUtil.fileExistsSync(file);
            return exists;
        }, 'File copy', 2000);

        var testConfig = _.extend({}, httpConfig);
        var complete = false;
        runs(function() {
            request(testConfig, function(err, response, body) {
                expect(val(response, 'statusCode')).toEqual(200);
                expect(body).toBeTruthy();
                complete = true;
            });
        });
        waitsFor(function() {
            return complete;
        }, 'HTTP request for document', 4000);
        runs(function() {
            fsUtil.deleteFile(filePath);
        });
    });
    beforeEach(function() {
        httpConfig.qs = _.clone(query);
    });
});
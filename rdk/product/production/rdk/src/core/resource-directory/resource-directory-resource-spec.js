'use strict';

var resourceDirectoryResource = require('./resource-directory-resource');
var ResourceRegistry = require('./resource-registry');
var express = require('express');

describe('resourceDirectoryResource', function() {
    var req;
    var resourceConfig;
    beforeEach(function() {
        resourceConfig = resourceDirectoryResource.getResourceConfig();
        req = {};
        req.app = {};
        req.app.resourceRegistry = new ResourceRegistry();
        req.app.resourceRegistry.register({
            title: 'test',
            path: '/test'
        });
        req.audit = {};
        req.get = function() {
            return 'localhost';
        };
    });

    it('has relative and absolute endpoints corresponding html endpoints', function() {
        expect(resourceConfig).to.have.length(4);
        expect(resourceConfig[0].name).to.equal('');
        expect(resourceConfig[0].path).to.equal('');
        expect(resourceConfig[1].name).to.equal('html');
        expect(resourceConfig[1].path).to.equal('/html');
        expect(resourceConfig[2].name).to.equal('cors');
        expect(resourceConfig[2].path).to.equal('cors');
        expect(resourceConfig[3].name).to.equal('cors-html');
        expect(resourceConfig[3].path).to.equal('cors/html');
    });

    it('works with relative paths', function(done) {
        req.url = '/resource/resourcedirectory';
        var configItem = resourceConfig[0];
        var res = {};
        res.type = function(type) {
            expect(type).to.equal('application/json');
            return this;
        };
        res.rdkSend = function(serializedResources) {
            expect(JSON.parse.bind(null, serializedResources)).not.to.throw();
            var resources = JSON.parse(serializedResources);
            expect(resources.link[0].href).not.to.startWith('http');
            expect(resources.link[0].href).to.startWith('/');
            done();
        };
        configItem.get(req, res);
    });
    it('works with relative html paths', function(done) {
        req.url = '/resource/resourcedirectory/html';
        var configItem = resourceConfig[1];
        var res = {};
        sinon.stub(express, 'static', function() {
            return function() {
                expect(express.static.called).to.be.true();
                done();
            };
        });
        configItem.get(req, res);
    });
    it('works with cors paths', function(done) {
        req.url = '/resource/resourcedirectory/cors';
        var configItem = resourceConfig[2];
        req.app.config = {};
        req.app.config.externalProtocol = 'hppt';
        var res = {};
        res.type = function(type) {
            expect(type).to.equal('application/json');
            return this;
        };
        res.rdkSend = function(serializedResources) {
            expect(JSON.parse.bind(null, serializedResources)).not.to.throw();
            var resources = JSON.parse(serializedResources);
            expect(resources.link[0].href).to.startWith('hppt');
            expect(resources.link[0].href).not.to.startWith('/');
            done();
        };
        configItem.get(req, res);
    });
    it('works with cors html paths', function(done) {
        req.url = '/resource/resourcedirectory/cors/html';
        var configItem = resourceConfig[3];
        var res = {};
        sinon.stub(express, 'static', function() {
            return function() {
                expect(express.static.called).to.be.true();
                done();
            };
        });
        configItem.get(req, res);
    });
});

'use strict';
var userResource = require('./user-resource');
var rdk = require('../../core/rdk');
var httpMocks = require('node-mocks-http');
var _ = require('underscore');
var mockMongo = sinon.mock(rdk.utils.mongoStore);
var querystring = require('querystring');
var nock = require('nock');
rdk.utils.mongoStore.initialize;

describe('User resource', function() {
    it('tests that getResourceConfig() is setup correctly for user info', function() {
        var resources = userResource.getResourceConfig()[0];

        expect(resources.name).to.equal('userinfo');
        expect(resources.path).to.equal('/info');
        expect(resources.healthcheck).not.to.be.undefined();
        expect(resources.get).not.to.be.undefined();
        expect(resources.apiDocs).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for get user list', function() {
        var resources = userResource.getResourceConfig()[1];

        expect(resources.name).to.equal('userlist');
        expect(resources.path).to.equal('/list');
        expect(resources.healthcheck).not.to.be.undefined();
        expect(resources.get).not.to.be.undefined();
        expect(resources.apiDocs).not.to.be.undefined();
    });
});

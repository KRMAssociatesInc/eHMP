'use strict';
var rolesResource = require('./roles-resource');
var roles = require('../../subsystems/pdp/roles');
var rdk = require('../../core/rdk');
var edit = require('./edit');
var httpMocks = require('node-mocks-http');
var _ = require('underscore');

describe('Roles resources', function() {
    it('tests that getResourceConfig() is setup correctly for edit roles', function() {
        var resources = rolesResource.getResourceConfig()[0];

        expect(resources.name).to.equal('edit');
        expect(resources.path).to.equal('/edit');
        expect(resources.healthcheck).not.to.be.undefined();
        expect(resources.parameters).not.to.be.undefined();
        expect(resources.parameters.post).not.to.be.undefined();
        expect(resources.parameters.post.user).not.to.be.undefined();
        expect(resources.parameters.post.user.required).to.be.true();
        expect(resources.parameters.post.roles).not.to.be.undefined();
        expect(resources.parameters.post.roles.required).to.be.true();
        expect(resources.post).not.to.be.undefined();
        expect(resources.apiDocs).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for get user roles', function() {
        var resources = rolesResource.getResourceConfig()[1];

        expect(resources.name).to.equal('getUserRoles');
        expect(resources.path).to.equal('/getUserRoles');
        expect(resources.healthcheck).not.to.be.undefined();
        expect(resources.parameters).not.to.be.undefined();
        expect(resources.parameters.get).not.to.be.undefined();
        expect(resources.parameters.get.uid).not.to.be.undefined();
        expect(resources.parameters.get.uid.required).to.be.true();
        expect(resources.get).not.to.be.undefined();
        expect(resources.apiDocs).not.to.be.undefined();
    });

    it('tests that getResourceConfig() is setup correctly for list roles', function() {
        var resources = rolesResource.getResourceConfig()[2];

        expect(resources.name).to.equal('list');
        expect(resources.path).to.equal('/list');
        expect(resources.healthcheck).not.to.be.undefined();
        expect(resources.get).not.to.be.undefined();
        expect(resources.apiDocs).not.to.be.undefined();
    });
});

describe('Roles resource calls', function() {
    var req;
    var res;
    var spyStatus;
    beforeEach(function() {
        req = {};
        res = httpMocks.createResponse();
        spyStatus = sinon.spy(res, 'status');
    });
    afterEach(function() {
        spyStatus.reset();
    });
    it('request list of roles returns list', function(done) {
        var resources = rolesResource.getResourceConfig()[2];
        res.rdkSend = function(result) {
            expect(result.data).to.be.an(Array);
            expect(result.data).to.eql(_.toArray(_.clone(roles)));
            expect(spyStatus.withArgs(rdk.httpstatus.ok).called).to.be.true();
            done();
        }
        resources.get(req, res);
    });
});

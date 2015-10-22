'use strict';

var patientListResource = require('./patient-list-resource');

describe('CDS Patient List Resource', function() {
    var resources = patientListResource.getResourceConfig();
    var interceptors = {
        audit: true,
        metrics: true,
        authentication: true,
        operationalDataCheck: false,
        pep: false,
        synchronize: false
    };

    it('has 13 endpoints configured', function() {
        expect(resources.length).to.equal(13);
    });

    it('has correct configuration for Criteria get ', function() {
        var r = resources[0];
        expect(r.name).to.equal('CDS-criteria-get');
        expect(r.path).to.equal('/criteria');
        expect(r.get).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.id).not.to.be.undefined();
        expect(r.parameters.get.name).not.to.be.undefined();
    });
    it('has correct configuration for Criteria post ', function() {
        var r = resources[1];
        expect(r.name).to.equal('CDS-criteria-post');
        expect(r.path).to.equal('/criteria');
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).to.be.undefined();
    });
    it('has correct configuration for Criteria delete ', function() {
        var r = resources[2];
        expect(r.name).to.equal('CDS-criteria-delete');
        expect(r.path).to.equal('/criteria');
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.id).not.to.be.undefined();
    });

    it('has correct configuration for Definition get ', function() {
        var r = resources[3];
        expect(r.name).to.equal('CDS-definition-get');
        expect(r.path).to.equal('/definition');
        expect(r.get).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.id).not.to.be.undefined();
        expect(r.parameters.get.name).not.to.be.undefined();
    });
    it('has correct configuration for Definition post ', function() {
        var r = resources[4];
        expect(r.name).to.equal('CDS-definition-post');
        expect(r.path).to.equal('/definition');
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).to.be.undefined();
    });
    it('has correct configuration for Definition delete ', function() {
        var r = resources[5];
        expect(r.name).to.equal('CDS-definition-delete');
        expect(r.path).to.equal('/definition');
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.id).not.to.be.undefined();
    });

    it('has correct configuration for Definition copy ', function() {
        var r = resources[6];
        expect(r.name).to.equal('CDS-definition-copy');
        expect(r.path).to.equal('/definition/copy');
        expect(r.get).to.be.undefined();
        expect(r.post).not.to.be.undefined();
        expect(r.delete).to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.post).not.to.be.undefined();
        expect(r.parameters.post.id).not.to.be.undefined();
        expect(r.parameters.post.name).not.to.be.undefined();
        expect(r.parameters.post.newname).not.to.be.undefined();
    });

    it('has correct configuration for Patientlist get ', function() {
        var r = resources[7];
        expect(r.name).to.equal('CDS-patientlist-get');
        expect(r.path).to.equal('/list');
        expect(r.get).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.id).not.to.be.undefined();
        expect(r.parameters.get.name).not.to.be.undefined();
    });
    it('has correct configuration for Patientlist post ', function() {
        var r = resources[8];
        expect(r.name).to.equal('CDS-patientlist-post');
        expect(r.path).to.equal('/list');
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).to.be.undefined();
    });
    it('has correct configuration for Patientlist delete ', function() {
        var r = resources[9];
        expect(r.name).to.equal('CDS-patientlist-delete');
        expect(r.path).to.equal('/list');
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.id).not.to.be.undefined();
    });

    it('has correct configuration for Patientlist add ', function() {
        var r = resources[10];
        expect(r.name).to.equal('CDS-patientlist-add');
        expect(r.path).to.equal('/list/patients');
        expect(r.get).to.be.undefined();
        expect(r.post).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.post).not.to.be.undefined();
        expect(r.parameters.post.id).not.to.be.undefined();
        expect(r.parameters.post.pid).not.to.be.undefined();
    });
    it('has correct configuration for Patientlist remove ', function() {
        var r = resources[11];
        expect(r.name).to.equal('CDS-patientlist-remove');
        expect(r.path).to.equal('/list/patients');
        expect(r.get).to.be.undefined();
        expect(r.delete).not.to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.delete).not.to.be.undefined();
        expect(r.parameters.delete.id).not.to.be.undefined();
        expect(r.parameters.delete.pid).not.to.be.undefined();
    });

    it('has correct configuration for Patientlist copy ', function() {
        var r = resources[12];
        expect(r.name).to.equal('CDS-patientlist-copy');
        expect(r.path).to.equal('/list/copy');
        expect(r.get).to.be.undefined();
        expect(r.post).not.to.be.undefined();
        expect(r.delete).to.be.undefined();
        expect(r.interceptors).to.eql(interceptors);
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.post).not.to.be.undefined();
        expect(r.parameters.post.id).not.to.be.undefined();
        expect(r.parameters.post.name).not.to.be.undefined();
        expect(r.parameters.post.newname).not.to.be.undefined();
    });
});

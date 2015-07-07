'use strict';

var patientListResource = require('../resources/patientlist/patientlistResource');

describe('CDS Patient List Resource', function () {
	var resources = patientListResource.getResourceConfig();

	it('has four endpoints configured', function () {
		expect(resources.length).toBe(4);
	});

    it('has correct configuration for Criteria ', function () {
        var r = resources[0];
        expect(r.name).toEqual('Criteria');
        expect(r.path).toEqual('/criteria');
        expect(r.get).toBeDefined();
        expect(r.post).toBeDefined();
        expect(r.delete).toBeDefined();
        expect(r.interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(r.healthcheck).toBeDefined();
        expect(r.parameters).toBeDefined();
        expect(r.parameters.get).toBeDefined();
        expect(r.parameters.get.id).toBeDefined();
        expect(r.parameters.get.name).toBeDefined();
        expect(r.parameters.delete).toBeDefined();
        expect(r.parameters.delete.id).toBeDefined();
    });

    it('has correct configuration for Definition ', function () {
        var r = resources[1];
        expect(r.name).toEqual('Definition');
        expect(r.path).toEqual('/definition');
        expect(r.get).toBeDefined();
        expect(r.post).toBeDefined();
        expect(r.delete).toBeDefined();
        expect(r.interceptors).toEqual({
            pep: false,
            operationalDataCheck: false
        });
        expect(r.healthcheck).toBeDefined();
        expect(r.parameters).toBeDefined();
        expect(r.parameters.get).toBeDefined();
        expect(r.parameters.get.id).toBeDefined();
        expect(r.parameters.get.name).toBeDefined();
        expect(r.parameters.delete).toBeDefined();
        expect(r.parameters.delete.id).toBeDefined();
    });

    it('has correct configuration for Patientlist ', function () {
		var r = resources[2];
		expect(r.name).toEqual('Patientlist');
		expect(r.path).toEqual('/list');
		expect(r.get).toBeDefined();
        expect(r.post).toBeDefined();
        expect(r.delete).toBeDefined();
		expect(r.interceptors).toEqual({
		    pep: false,
		    operationalDataCheck: false
		});
		expect(r.healthcheck).toBeDefined();
		expect(r.parameters).toBeDefined();
		expect(r.parameters.get).toBeDefined();
		expect(r.parameters.get.id).toBeDefined();
        expect(r.parameters.get.name).toBeDefined();
        expect(r.parameters.delete).toBeDefined();
        expect(r.parameters.delete.id).toBeDefined();
	});

	it('has correct configuration for Patientlist Add/Remove ', function () {
		var r = resources[3];
		expect(r.name).toEqual('PatientListAddRemove');
		expect(r.path).toEqual('/list/patients');
		expect(r.get).toBeUndefined();
        expect(r.post).toBeDefined();
        expect(r.delete).toBeDefined();
		expect(r.interceptors).toEqual({
		    pep: false,
		    operationalDataCheck: false
		});
		expect(r.healthcheck).toBeDefined();
		expect(r.parameters).toBeDefined();
        expect(r.parameters.post).toBeDefined();
        expect(r.parameters.post.id).toBeDefined();
        expect(r.parameters.post.pid).toBeDefined();
        expect(r.parameters.delete).toBeDefined();
        expect(r.parameters.delete.id).toBeDefined();
        expect(r.parameters.delete.pid).toBeDefined();
	});

});

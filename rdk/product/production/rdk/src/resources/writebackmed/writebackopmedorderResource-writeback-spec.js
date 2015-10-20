'use strict';

var writebacksaveopmedorder = require('./writebackopmedorderResource');

var saveMedJSON = {
    'ien': 100615,
    'provider': 10000000226,
    'location': 23,
    'orderDialog': 'PSO OERR',
    'displayGroup': 4,
    'quickOrderDialog': 147,
    'ORDIALOG': {
        'medIEN': 3500,
        'strength': '20MG',
        'drugIEN': 1713,
        'doseString': '20&MG&1&TABLET&20MG&1713&20&MG',
        'dose': '20MG',
        'routeIEN': '1',
        'schedule': 'EVERY DAY',
        'supply': '30',
        'quantity': '30',
        'refills': '1',
        'pickup': 'W',
        'priority': '9',
        'instructions': 'TAKE ONE TABLET BY MOUTH EVERY DAY',
        'comment': 'Test Case 1 - Simvastatin',
        'ORCHECK': 0,
        'ORTS': 0
    }
};

describe('Outpatient Med Order Save Resource', function() {
    it('tests that getResourceConfig() is setup correctly', function() {
        var resources = writebacksaveopmedorder.getResourceConfig();

        expect(resources[0].name).to.equal('save');
        expect(resources[0].path).to.equal('/save');
        expect(resources[0].healthcheck).not.to.be.undefined();
    });
});

describe('Outpatient Med Order Save Verification', function() {
    var result;
    afterEach(function() {
        saveMedJSON.ien = 100615;
        saveMedJSON.provider = 10000000226;
        saveMedJSON.location = 23;
        saveMedJSON.orderDialog = 'PSO OERR';
        saveMedJSON.ORDIALOG.medIEN = 3500;
        saveMedJSON.ORDIALOG.dose = '20MG';
        saveMedJSON.ORDIALOG.routeIEN = '1';
        saveMedJSON.ORDIALOG.schedule = 'EVERY DAY';
        saveMedJSON.ORDIALOG.quantity = '30';
    });

    it('tests valid order record', function() {
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.true();
        expect(result.errMsg.length).to.equal(0);
    });

    it('tests missing patient ien', function() {
        delete saveMedJSON.ien;
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests empty patient IEN', function() {
        saveMedJSON.ien = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests missing provider IEN', function() {
        delete saveMedJSON.provider;
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests empty provider', function() {
        saveMedJSON.provider = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests missing location IEN', function() {
        delete saveMedJSON.location;
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests empty location', function() {
        saveMedJSON.location = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests missing order dialog', function() {
        delete saveMedJSON.orderDialog;
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests empty order dialog', function() {
        saveMedJSON.orderDialog = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests medication IEN is required', function() {
        delete saveMedJSON.ORDIALOG.medIEN;
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRequired data is missing.\n');
    });

    it('tests Dosage may not be numeric only', function() {
        saveMedJSON.ORDIALOG.dose = '20';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nDosage may not be numeric only.\n');
    });

    it('tests Route must be entered', function() {
        saveMedJSON.ORDIALOG.routeIEN = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nRoute must be entered.\n');
    });

    it('tests Schedule must be entered', function() {
        saveMedJSON.ORDIALOG.schedule = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nSchedule must be entered.\n');
    });

    it('tests valid quantity', function() {
        saveMedJSON.ORDIALOG.quantity = '0';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nUnable to validate quantity.\n');
    });

    it('tests valid days supply', function() {
        saveMedJSON.ORDIALOG.supply = '';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nDays Supply is an invalid number.\n');
    });

    it('tests zero days supply', function() {
        saveMedJSON.ORDIALOG.supply = '0';
        result = writebacksaveopmedorder.verifyInput(saveMedJSON);
        expect(result.valid).to.be.false();
        expect(result.errMsg).to.equal('This order cannot be saved for the following reason(s):\nDays Supply may not be less than 1.\n');
    });

});

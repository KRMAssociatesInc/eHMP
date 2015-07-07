/*jslint node: true */
'use strict';

var writebacksavemedication = require('../resources/writebackmed/writebackmedicationsaveResource');

var saveMedJSON = {
    'displayGroup': 48,
    'quickOrderDialog': 389,
    'ORDIALOG': {
        'medIEN': 1349,
        'strength': '500MG',
        'drugIEN': 639,
        'doseString': '500&MG&1&CAPSULE&500MG&639&500&MG',
        'dose': '500MG',
        'unit': 1,
        'schedule': 'NOw',
        'instructions': 'Take one tablet by mouth now',
        'comment': 'this comment',
        'definedComments': [
            'Non-VA medication not recommended by VA provider. ',
            'Non-VA medication recommended by VA provider. '
        ],
        'ORCHECK': 0,
        'ORTS': 9,
        'date': 20140818134015
    }
};

describe('writebacksavemedication', function() {
    describe('call function verifyInput', function() {

        it('tests missing ien', function() {
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests empty ien', function() {
            saveMedJSON.ien = '';
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests missing provider', function() {
            saveMedJSON.ien = 10022;
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests empty provider', function() {
            saveMedJSON.provider = '';
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests missing location', function() {
            saveMedJSON.provider = 10000000226;
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests empty location', function() {
            saveMedJSON.location = '';
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests missing orderDialog', function() {
            saveMedJSON.location = 10000000226;
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests empty orderDialog', function() {
            saveMedJSON.orderDialog = '';
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).not.toBe(true);
        });

        it('tests valid input', function() {
            saveMedJSON.orderDialog = 'PSH OERR';
            expect(writebacksavemedication.verifyInput(saveMedJSON).valid).toBe(true);
        });

    });
});

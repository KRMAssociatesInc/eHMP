/*jslint node: true */
'use strict';

var writebacksavevitals = require('../resources/vitals/writebackvitalssaveResource');

describe('writebackvitalssaveResource', function() {
    describe('call function verifyInput', function() {

        it('tests missing dateTime', function() {
            expect(writebacksavevitals.verifyInput(saveVitalsJSON).valid).not.toBe(true);
        });
        it('tests valid input', function() {
            saveVitalsJSON.dateTime = '20141029080000';
            expect(writebacksavevitals.verifyInput(saveVitalsJSON).valid).toBe(false);
        });
    });
});

var saveVitalsJSON = {
    'dfn': '3',
    //'duz' : '10000000224',
    'locIEN': '67',
    'vitals': [{
        'fileIEN': '1',
        'reading': '80/30',
        'qualifiers': ['23', '59', '100']
    }, {
        'fileIEN': '3',
        'reading': '57',
        'qualifiers': ['47', '50']
    }]
};

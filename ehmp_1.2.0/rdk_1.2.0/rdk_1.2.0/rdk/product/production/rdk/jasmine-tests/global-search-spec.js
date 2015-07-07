'use strict';

var search = require('../resources/patientsearch/globalSearch');

describe('Global Search', function() {
    describe('Parameter Validation', function() {
        it('No Search Params', function() {
            expect(search._checkInvalidGlobalSearchParameters({})).toBeTruthy();
        });

        it('Singular Search Param', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'KDUEKS'
            })).toBeTruthy();
        });

        it('Last Name contains illegal characters', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'kdjs!',
                fname: 'KDSJLD'
            })).toBeTruthy();
        });

        it('First Name contains illegal characters', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                fname: 'kdjs!@',
                lname: 'KDSJLD'
            })).toBeTruthy();
        });

        it('First Name and Last Name are lower case', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                fname: 'kdfjies',
                lname: 'asdkeisld'
            })).toBeTruthy();
        });

        it('First Name contains spaces', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                fname: 'KDF JIES',
                lname: 'DSKEIS'
            })).toBeFalsy();
        });

        it('Last Name not provided', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                fname: 'SKLDJSF',
                ssn: '123456789'
            })).toBeTruthy();
        });

        it('SSN invalid format', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                ssn: '1234a3k2i'
            })).toBeTruthy();
        });

        it('SSN too short', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                ssn: '1234'
            })).toBeTruthy();
        });

        it('DoB wrong format (no delimiter)', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02061974'
            })).toBeTruthy();
        });

        it('DoB wrong format (incorrect delimiter)', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02-06-1974'
            })).toBeTruthy();
        });

        it('DoB impossible date', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02/40/1974'
            })).toBeTruthy();
        });

        it('DoB field incorrect order', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '1945/05/10'
            })).toBeTruthy();
        });

        xit('DoB unreasonable historical date', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '01/01/1645'
            })).toBeTruthy();
        });
        xit('DoB unreasonable future date', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '01/01/2453'
            })).toBeTruthy();
        });

        it('DoB unknown default value', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '01/01/1910'
            })).toBeFalsy();
        });

        it('DoB missing zero padded month', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '1/01/1910'
            })).toBeFalsy();
        });

        it('DoB missing zero padded day', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '01/1/1910'
            })).toBeFalsy();
        });

        it('DoB missing zero padded month and day', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '1/1/1910'
            })).toBeFalsy();
        });

        it('DoB two digit year', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02/11/99'
            })).toBeTruthy();
        });

        it('Extra parameter', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02/11/1999',
                foo: 'bar'
            })).toBeFalsy();
        });

        it('All parameters', function() {
            expect(search._checkInvalidGlobalSearchParameters({
                lname: 'DSFJLDK',
                dob: '02/11/1999',
                fname: 'DKSLDE',
                ssn: '987654321'
            })).toBeFalsy();
        });
    });

});

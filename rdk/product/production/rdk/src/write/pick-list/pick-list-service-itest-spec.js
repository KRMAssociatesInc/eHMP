'use strict';

var request = require("request");
var pickListSource = '/resource/write-pick-list?accessCode=pu1234&verifyCode=pu1234!!&site=C877&type=';
var base_url = 'http://'+process.env.RDK_IP+':'+process.env.PICK_LIST_PORT+pickListSource;
var pki = 'pki-enabled';
var allergySymptoms = 'allergies-symptoms';
var vitals = 'vitals';
var medicationSchedules = 'medication-schedules';
var medicationDefault = 'medication-defaults&pharmacyType=O&outpatientDfn=2533&locationIen=100';
var medicationOrders = 'medication-orders&ien=64&first=1&last=100';
var labOrderSpecimen = 'lab-order-specimens&searchString=ABC';
var printerDevices = 'printer-devices&searchString=ABC';
var allergiesMatch = 'allergies-match&searchString=ABC';
var medicationOrderDefault = 'medication-order-defaults&ien=64&pharmacyType=O&outpatientDfn=2533&needPatientInstructions=false&pkiEnabled=true';
var medicationIndex = 'medication-index&searchString=ABC&ien=64';
var medicationList = 'medication-list&searchString=ABC';
var problemsLex = 'problems-lex&view=CLF&searchString=ABC';
var progressNotesTitles = 'progress-notes-titles&class=3';

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

var mockHandlerCallback = {
    callback: function(error, response) {
    }
};

//TODO: CHANGE TO DESCRIBE WHEN THIS IS WORKING
xdescribe('Pick list service', function() {
    beforeEach(function () {
        spyOn(mockHandlerCallback, 'callback');
    });

    it('returns status code 200 and valid JSON for GET pki', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+pki, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET allergy symptoms', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+allergySymptoms, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET vitals', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+vitals, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication schedules', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationSchedules, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication defaults', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationDefault, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication orders', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationOrders, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });


    it('returns status code 200 and valid JSON for GET lab order specimen', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+labOrderSpecimen, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET printer devices', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+printerDevices, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET allergies match', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+allergiesMatch, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication order default', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationOrderDefault, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication list', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationList, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET medication index', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+medicationIndex, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET problems lex', function() {
        var done = false;
        var response = null;
        var error = null;


        runs(function () {
            request.get(base_url+problemsLex, function(err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

    it('returns status code 200 and valid JSON for GET progress notes titles', function() {
        var done = false;
        var response = null;
        var error = null;


        runs (function () {
            request.get(base_url+progressNotesTitles, function (err, result) {
                response = result;
                error = err;
                done = true;
            });
        });

        waitsFor(function () {
            return done;
        }, 'Callback not called', 10000);

        runs(function () {
            expect(response).not.toBe(null);
            expect(response).not.toBe(undefined);
            expect(response.statusCode).toBe(200);
            expect(IsJsonString(response.body)).toBe(true);
        });
    });

});



/*jslint node: true */
'use strict';

var emulateJdsResponse = require('../outerceptors/emulateJdsResponse');

describe('Tests emulateJdsResponse', function() {

    var callback;
    var defaultItems = [{foo: 'foo'}, {bar: 'bar'}];

    beforeEach(function() {
        var cbObj = {
            callback: function() {}
        };
        spyOn(cbObj, 'callback');
        callback = cbObj.callback;
    });

    it('basic test with empty items and no paging', function() {
        var req = buildRequest();
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 0,
                currentItemCount: 0,
                items: []
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with some items and no paging', function() {
        var req = buildRequest();
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: defaultItems.length,
                currentItemCount: defaultItems.length,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid limit that is less than number of items', function() {
        var req = buildRequest({ limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 5,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 0,
                pageIndex: 0,
                totalPages: 3,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid limit that is greater than number of items', function() {
        var req = buildRequest({ limit: '10' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 6,
                currentItemCount: defaultItems.length,
                itemsPerPage: 10,
                startIndex: 0,
                pageIndex: 0,
                totalPages: 1,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid start', function() {
        var req = buildRequest({ start: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 4,
                currentItemCount: defaultItems.length,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid start (0) and limit', function() {
        var req = buildRequest({ start: '0', limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 0,
                pageIndex: 0,
                totalPages: 5,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid start (4) and limit', function() {
        var req = buildRequest({ start: '4', limit: '2'});
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 4,
                pageIndex: 2,
                totalPages: 5,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test start=-1 is interpreted as start=0', function() {
        var req = buildRequest({ start: '-1', limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 0,
                pageIndex: 0,
                totalPages: 5,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with valid start and limit, where start is not aligned to a page boundary', function() {
        var req = buildRequest({ start: '5', limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 5,
                pageIndex: 2,
                totalPages: 5,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test invalid start values are ignored', function() {
        var req = buildRequest({ start: 'non-numeric value', limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: defaultItems.length,
                itemsPerPage: 2,
                startIndex: 0,
                pageIndex: 0,
                totalPages: 5,
                items: defaultItems
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });

    it('test with start > total number of items', function() {
        var req = buildRequest({ start: '20', limit: '2' });
        var expectedOutput = {
            data: {
                updated: 20150106041850,
                totalItems: 10,
                currentItemCount: 0,
                itemsPerPage: 2,
                startIndex: 20,
                pageIndex: 10,
                totalPages: 5,
                items: []
            },
            apiVersion: '1.0'
        };
        emulateJdsResponse(req, buildResponseBody(expectedOutput), callback);
        expect(callback).toHaveBeenCalledWith(null, req, expectedOutput);
    });
});

function buildResponseBody(expectedOutput) {
    return {
        updated: expectedOutput.data.updated,
        totalItems: expectedOutput.data.totalItems,
        items: expectedOutput.data.items
    };
}

function buildRequest(params) {
    params = params || {};
    return {
        param: function(field) {
            if (field === 'start') {
                return params.start;
            }
            if (field === 'limit') {
                return params.limit;
            }
        }
    };
}

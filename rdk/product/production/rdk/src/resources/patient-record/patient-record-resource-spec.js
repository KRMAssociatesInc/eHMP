/*jslint node: true*/
'use strict';

var asu = require('../../subsystems/asu/asu-process');
var rdk = require('../../core/rdk');
var jds = rdk.utils.jds;
var patientrecordResource = require('./patient-record-resource');
var httpMocks = require('node-mocks-http');

describe('Verify JdsQuery created', function() {
    it('with undefined values', function() {
        var jdsQuery = new patientrecordResource._JdsQuery(undefined, '', null, undefined, undefined);

        expect(jdsQuery.start).to.be(0);
        expect(jdsQuery.limit).to.be.undefined();
        expect(jdsQuery.order).to.be.undefined();
        expect(jdsQuery.filter).to.be.undefined();
    });
    it('with all values set to something valid', function() {
        var jdsQuery = new patientrecordResource._JdsQuery(1, 10, 'localTitle', '9E23', [['like', 'localTitle', 'Drug']]);

        expect(jdsQuery.start).to.be(1);
        expect(jdsQuery.limit).to.be(10);
        expect(jdsQuery.order).to.be('localTitle');
        expect(jdsQuery.filter).to.be("like(\"localTitle\",\"Drug\"),like(\"uid\",\"9E23\")");
    });
});

describe('Verify No Data', function() {
    it('when details is nullish', function() {
        expect(patientrecordResource._noData('')).to.be.true();
        expect(patientrecordResource._noData()).to.be.true();
        expect(patientrecordResource._noData(null)).to.be.true();
    });
    it('when data in details in nullish', function() {
        expect(patientrecordResource._noData({data: ''})).to.be.true();
        expect(patientrecordResource._noData({})).to.be.true();
        expect(patientrecordResource._noData({data: null})).to.be.true();
    });
    it('when data items in details in nullish', function() {
        expect(patientrecordResource._noData({data: {items: ''}})).to.be.true();
        expect(patientrecordResource._noData({data: {}})).to.be.true();
        expect(patientrecordResource._noData({data: {items: null}})).to.be.true();
    });
    it('when data items is empty in details', function() {
        expect(patientrecordResource._noData({data: {items: []}})).to.be.true();
    });
});

describe('Verify filter docs by asu permissions', function() {
    var logger, req, mock;

    beforeEach(function(done) {
        logger = sinon.stub(require('bunyan').createLogger({
            name: 'patient-record-resource-spec.js'
        }));
        req = {};
        req.logger = logger;
        req.audit = {};
        req.param = {};
        req.query = {};
        req.query.order = '';
        req.interceptorResults = {};
        req.interceptorResults.jdsFilter = {};
        req.interceptorResults.jdsFilter.filter = [];

        done();
    });

    afterEach(function(done) {
        if (mock) {
            asu.getAsuPermission.restore();
            mock = undefined;
        }
        done();
    });

    it('skip asu check for item if documentDefUid is undefined', function(done) {
        var dataItems = {data: {items: [{localTitle: 'one'}]}};
        mock = sinon.spy(asu, "getAsuPermission");

        patientrecordResource._filterDocuments(req, dataItems, function(err, results) {
            expect(results).must.eql([{localTitle: 'one'}]);
        });

        expect(mock.callCount).to.be(0);
        done();
    });

    it('does not return item if there is asu permission check error', function(done) {
        var dataItems = {data: {items: [{documentDefUid: '1', localTitle: 'one'}]}};
        mock = sinon.stub(asu, "getAsuPermission", function (req, dataItems, callback) {
            return callback('error');
        });

        patientrecordResource._filterDocuments(req, dataItems, function(err, results) {
            expect(results).must.eql([]);
        });

        expect(mock.callCount).to.be(1);
        done();
    });

    it('returns item if has asu permission', function(done) {
        var dataItems = {data: {items: [{documentDefUid: '1', localTitle: 'one'}]}};
        mock = sinon.stub(asu, "getAsuPermission", function (req, dataItems, callback) {
            return callback(false, 'true');
        });

        patientrecordResource._filterDocuments(req, dataItems, function(err, results) {
            expect(results).must.eql([{documentDefUid: '1', localTitle: 'one'}]);
        });

        expect(mock.callCount).to.be(1);
        done();
    });

    it('does not return item if does not have asu permission', function(done) {
        var dataItems = {data: {items: [{documentDefUid: '1', localTitle: 'one'}]}};
        mock = sinon.stub(asu, "getAsuPermission", function (req, dataItems, callback) {
            return callback(false, 'false');
        });

        patientrecordResource._filterDocuments(req, dataItems, function(err, results) {
            expect(results).must.eql([]);
        });

        expect(mock.callCount).to.be(1);
        done();
    });

    it('with 3 items and has asu permission for 2 items', function(done) {
        var dataItems = {data: {items: [
            {documentDefUid: '1', localTitle: 'one'},
            {documentDefUid: '2', localTitle: 'two'},
            {documentDefUid: '3', localTitle: 'three'}
        ]}};
        mock = sinon.stub(asu, "getAsuPermission", function (req, dataItems, callback) {
            if (dataItems.data.items[0].documentDefUid === '2') {
                return callback(false, 'false');
            }
            return callback(false, 'true');
        });

        patientrecordResource._filterDocuments(req, dataItems, function (err, results) {
            expect(results).must.eql([
                {documentDefUid: '1', localTitle: 'one'},
                {documentDefUid: '3', localTitle: 'three'}
            ]);
        });

        expect(mock.callCount).to.be(3);

        done();
    });
});

describe('Verify getDomain', function() {
    var logger, req, mockJds, next, res, spyStatus;

    beforeEach(function(done) {
        logger = sinon.stub(require('bunyan').createLogger({
            name: 'patient-record-resource-spec.js'
        }));
        req = {};
        req.logger = logger;
        req.audit = {};
        req.params = {};
        req.params.callType = 'modal';
        req.params.vler_uid = 'urn:va:order:9E7A:227:16682';
        req.params.pid = '11016V630869';
        req.param = function(name, defaultValue){
            if (null != this.params[name] && this.params.hasOwnProperty(name)) return this.params[name];
            return defaultValue;
        };
        req.query = {}
        req.query.order = '';
        req.interceptorResults = {};
        req.interceptorResults.jdsFilter = {};
        req.interceptorResults.jdsFilter.filter = [];

        next = sinon.spy();
        res = httpMocks.createResponse();
        spyStatus = sinon.spy(res, 'status');

        done();
    });

    afterEach(function(done) {
        if (mockJds) {
            jds.getPatientDomainData.restore();
            mockJds = undefined;
        }
        next.reset();
        spyStatus.reset();
        done();
    });

    it('skipped if pid param not set', function(done) {
        req.params.pid = undefined;

        patientrecordResource._getDomain('allergies', 'document-view', req, res, next);

        expect(next.callCount).to.be(1);
        done();
    });

    it('returns a failure response when jds query fails with an error', function(done) {
        mockJds = sinon.stub(jds, "getPatientDomainData", function (req, pid, index, jdsQuery, vlerQuery, callback) {
            return callback('error', {}, 404);
        });

        function tester(response) {
            expect(spyStatus.withArgs(404).called).to.be.true();
            expect(response).to.be('error');
            done();
        }
        res.rdkSend = tester;

        patientrecordResource._getDomain('allergies', 'document-view', req, res, next);
    });

    it('returns no data if no data is returned from jds', function(done) {
        mockJds = sinon.stub(jds, "getPatientDomainData", function (req, pid, index, jdsQuery, vlerQuery, callback) {
            return callback(null, {data: {items: []}}, 200);
        });

        function tester(response) {
            expect(spyStatus.withArgs(200).called).to.be.true();
            expect(response).must.eql({data: {items: []}});
            done();
        }
        res.rdkSend = tester;

        patientrecordResource._getDomain('allergies', 'document-view', req, res, next);
    });

    it('returns non document view data from jds', function(done) {
        mockJds = sinon.stub(jds, "getPatientDomainData", function (req, pid, index, jdsQuery, vlerQuery, callback) {
            return callback(null, {data: {items: [{localTitle: 'one'}]}}, 200);
        });

        function tester(response) {
            expect(spyStatus.withArgs(200).called).to.be.true();
            expect(response).must.eql({data: {items: [{localTitle: 'one'}]}});
            done();
        }
        res.rdkSend = tester;

        patientrecordResource._getDomain('allergies', 'sync', req, res, next);
    });

    it('returns document view data from jds', function(done) {
        mockJds = sinon.stub(jds, "getPatientDomainData", function (req, pid, index, jdsQuery, vlerQuery, callback) {
            return callback(null, {data: {items: [{localTitle: 'two'}]}}, 200);
        });

        function tester(response) {
            expect(spyStatus.withArgs(200).called).to.be.true();
            expect(response).must.eql([{localTitle: 'two'}]);
            done();
        }
        res.rdkSend = tester;

        patientrecordResource._getDomain('allergies', 'document-view', req, res, next);
    });
});

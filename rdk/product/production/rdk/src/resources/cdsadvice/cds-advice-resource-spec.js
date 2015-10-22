'use strict';

var _ = require('lodash');
var rdk = require('../../core/rdk');
var cdsAdviceResource = require('./cds-advice-resource');
var cdsAdviceList = require('./get-cds-advice-list');
var async = require('async');

var cdsAdviceDetail = require('./get-cds-advice-detail');
var cdsUtil = require('./cds-util');
var VistaJS = require('../../VistaJS/VistaJS');

var cdsWorkProduct = require('../cds-work-product/cds-work-product');

var mockReqResUtil = (function() {
    var logger = {
        trace: function() {
        },
        debug: function() {
        },
        info: function() {
        },
        warn: function() {
        },
        error: function() {
        },
        fatal: function() {
        }
    };

    var res = {
        status: function() {
            return this;
        },
        rdkSend: function() {
            return this;
        },
        end: function() {
            return this;
        }
    };

    function createReqWithParam(map) {
        map = map || {};
        var req = {
            param: (function param(map, name, defaultValue) {
                if (_.has(map, name)) {
                    return map[name] !== null ? String(map[name]) : null;
                }

                if (defaultValue !== undefined && defaultValue !== null) {
                    String(defaultValue);
                }

                return defaultValue;
            }).bind(null, map),

            query: map,
            logger: logger,
            audit: {},
            app: {
                config: {
                    rpcConfig: {
                        context: 'HMP UI CONTEXT',
                        siteHash: '9E7A'
                    },
                    vistaSites: {}
                }
            },
            session: {
                user: {
                    site: '9E7A'
                }
            }
        };
        return req;
    }

    return {
        createRequestWithParam: createReqWithParam,
        response: res
    };
})();

describe('CDS Advice Resource', function() {
    var resources = cdsAdviceResource.getResourceConfig();

    var res = mockReqResUtil.response;

    beforeEach(function() {
        sinon.spy(res, 'status');
        sinon.spy(res, 'rdkSend');
    });

    it('has three endpoints configured', function() {
        expect(resources.length).to.equal(3);
    });

    it('has correct configuration for \'list\' endpoint', function() {
        var r = resources[0];
        expect(r.name).to.equal('list');
        expect(r.path).to.equal('/list');
        //expect(r.interceptors).toBeUndefined();
        expect(r.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.pid).not.to.be.undefined();
        expect(r.parameters.get.use).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
    });

    it('has correct configuration for \'detail\' endpoint', function() {
        var r = resources[1];
        expect(r.name).to.equal('detail');
        expect(r.path).to.equal('/detail');
        //expect(r.interceptors).toBeUndefined();
        expect(r.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.parameters).not.to.be.undefined();
        expect(r.parameters.get).not.to.be.undefined();
        expect(r.parameters.get.pid).not.to.be.undefined();
        expect(r.parameters.get.id).not.to.be.undefined();
        expect(r.parameters.get.use).not.to.be.undefined();
        expect(r.get).not.to.be.undefined();
    });
    it('has correct configuration for \'readStatus\' endpoint', function() {
        var r = resources[2];
        expect(r.name).to.equal('readStatus');
        expect(r.path).to.equal('/:id/status/read/:value');
        //expect(r.interceptors).toBeUndefined();
        expect(r.interceptors).to.eql({
            audit: true,
            metrics: true,
            authentication: true,
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        });
        expect(r.healthcheck).not.to.be.undefined();
        expect(r.put).not.to.be.undefined();
    });

    describe('List endpoint HTTP response codes', function() {
        it('responds HTTP Bad Request when required parameters are missing', function() {
            sinon.stub(async, 'parallel', function(fcnArray, callback) {
                callback(null, [
                    [], // cds advice mock empty results
                    [], // clinical reminders mock empty results
                    [] // cds work products mock empty results
                ]);
            });

            cdsAdviceList.getCDSAdviceList(mockReqResUtil.createRequestWithParam({}), res); // missing pid and use params
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceList.getCDSAdviceList(mockReqResUtil.createRequestWithParam({
                pid: 'somepid'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceList.getCDSAdviceList(mockReqResUtil.createRequestWithParam({
                use: 'someUse'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceList.getCDSAdviceList(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        });
    });

    describe('Detail endpoint HTTP response codes', function() {
        it('responds HTTP Not Found if DFN cannot be resolved', function() {
            sinon.stub(cdsUtil, 'getDFN', function(req, pid, callback) {
                return callback(new Error('There was an error processing your request.'));
            });

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.not_found)).to.be.true();

        });

        it('responds HTTP Not Found if not details are found', function() {
            sinon.stub(cdsUtil, 'getDFN', function(req, pid, callback) {
                return callback('cachedDFN');
            });
            sinon.stub(VistaJS, 'callRpc', function(logger, config, rpc, params, callback) {
                return callback(null /*error*/, null /*result*/);
            });

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.not_found)).to.be.true();
        });

        it('responds HTTP Not Found if there are errors retrieving details', function() {
            sinon.stub(cdsUtil, 'getDFN', function(req, pid, callback) {
                return callback('cachedDFN');
            });
            sinon.stub(VistaJS, 'callRpc', function(logger, config, rpc, params, callback) {
                return callback(new Error('something bad happened') /*error*/, null /*result*/);
            });

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.not_found)).to.be.true();
        });

        it('responds HTTP Bad Request when required parameters are missing', function() {
            sinon.stub(cdsUtil, 'getDFN', function(req, pid, callback) {
                return callback('cachedDFN');
            });
            sinon.stub(VistaJS, 'callRpc', function(logger, config, rpc, params, callback) {
                return callback(null /*error*/, 'some details...' /*result*/);
            });

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                use: 'someUse'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                pid: 'somepid',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({
                use: 'someUse',
                id: 'someAdviceId'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceDetail.getCDSAdviceDetail(mockReqResUtil.createRequestWithParam({}), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();
        });
    });

    describe('setReadStatus endpoint HTTP response codes', function() {
        it('responds HTTP Not Found if there is no Work Product with that id', function() {
            sinon.stub(cdsWorkProduct, 'setReadStatus', function(id, readStatus, provider, callback) {
                return callback(null /*body*/, 'Work Product not found!' /*error*/);
            });

            cdsAdviceList.setReadStatus(mockReqResUtil.createRequestWithParam({
                id: 'someid',
                value: 'true'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.not_found)).to.be.true();
        });

        it('responds HTTP Bad Request when required parameters are missing', function() {
            sinon.stub(cdsWorkProduct, 'setReadStatus', function(id, readStatus, provider, callback) {
                return callback('Read Status updated!' /*body*/, null /*error*/);
            });

            cdsAdviceList.setReadStatus(mockReqResUtil.createRequestWithParam({
                id: 'someid',
                value: 'true'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();

            cdsAdviceList.setReadStatus(mockReqResUtil.createRequestWithParam({
                value: 'true'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceList.setReadStatus(mockReqResUtil.createRequestWithParam({
                id: 'someid'
            }), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();

            cdsAdviceList.setReadStatus(mockReqResUtil.createRequestWithParam({}), res);
            expect(res.status.calledWith(rdk.httpstatus.bad_request)).to.be.true();
        });
    });
});

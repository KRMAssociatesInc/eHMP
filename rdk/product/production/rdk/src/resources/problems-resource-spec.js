'use strict';

var _ = require('lodash');
var rdk = require('../core/rdk');
var VistaJS = require('../VistaJS/VistaJS');
var problemsResource = require('./problems-resource');

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

var res = mockReqResUtil.response;

function spyOnRpc(searchTerm, uncoded, error, rpcResponse) {
    sinon.stub(VistaJS, 'callRpc', function(logger, rpcConfig, rpcName, rpcParams, rpcCallback) {
        expect(rpcParams[0]).to.eql(searchTerm);
        var codedParam = uncoded ? 'CLF' : 'PLS';
        expect(rpcParams[1]).to.equal(codedParam);
        expect(rpcParams[2]).to.equal(0);
        rpcCallback(error, rpcResponse);
    });

    sinon.spy(res, 'status');
    sinon.spy(res, 'rdkSend');
}

describe('Get problem list endpoint', function() {
    it('returns "No Data" when there are no search results found', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, '');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: 'No data'
            }
        })).to.be.true();
    });

    it('returns "No Data" when code search fails', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, 'Code search failed');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: 'No data'
            }
        })).to.be.true();
    });

    it('returns "Search is unsupported" when RPC states to try a different search', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, 'Please try a different search');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.internal_server_error)).to.be.true();
        expect(res.rdkSend.calledWith('Search is unsupported')).to.be.true();
    });

    it('returns the error code when an unexpected error occurs', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, 'an unexpected error occurred', null);
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.internal_server_error)).to.be.true();
        expect(res.rdkSend.calledWith('an unexpected error occurred')).to.be.true();
    });

    it('returns coded problems from VISTA', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'diabetes'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: [{
                    problemNumber: '7130783',
                    problem: 'Diabetes mellitus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '73211009',
                    problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                }, {
                    problemNumber: '7027801',
                    problem: 'Diabetes insipidus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '15771004',
                    problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                }, {
                    problemNumber: '7234767',
                    problem: 'FH: Diabetes mellitus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '160303001',
                    problemText: 'FH: Diabetes mellitus ICD-10CM:(R69)'
                }]
            }
        })).to.be.true();
    });

    it('returns coded problems from VISTA', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'diabetes',
            uncoded: 'true'
        });

        spyOnRpc('diabetes', true, null, '7358833^Renal diabetes^R69^521774^SNOMED CT^236367002^354316011^ICD-10-CM\r\n7572717^Bronze diabetes^R69^521774^SNOMED CT^399144008^1778601012^ICD-10-CM\r\n2 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: [{
                    problemNumber: '7358833',
                    problem: 'Renal diabetes',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '236367002',
                    problemText: 'Renal diabetes ICD-10CM:(R69)'
                }, {
                    problemNumber: '7572717',
                    problem: 'Bronze diabetes',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '399144008',
                    problemText: 'Bronze diabetes ICD-10CM:(R69)'
                }]
            }
        })).to.be.true();
    });

    it('tests limit parameter functions properly', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'diabetes',
            limit: '2'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: [{
                    problemNumber: '7130783',
                    problem: 'Diabetes mellitus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '73211009',
                    problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                }, {
                    problemNumber: '7027801',
                    problem: 'Diabetes insipidus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '15771004',
                    problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                }]
            }
        })).to.be.true();
    });

    it('tests limit parameter of zero returns all records', function() {
        var req = mockReqResUtil.createRequestWithParam({
            query: 'diabetes',
            limit: '0'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc.called).to.be.true();
        expect(res.status.calledWith(rdk.httpstatus.ok)).to.be.true();
        expect(res.rdkSend.calledWith({
            data: {
                items: [{
                    problemNumber: '7130783',
                    problem: 'Diabetes mellitus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '73211009',
                    problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                }, {
                    problemNumber: '7027801',
                    problem: 'Diabetes insipidus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '15771004',
                    problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                }, {
                    problemNumber: '7234767',
                    problem: 'FH: Diabetes mellitus',
                    icd: 'R69',
                    lexiconCode: 'R69^521774',
                    snomed: '160303001',
                    problemText: 'FH: Diabetes mellitus ICD-10CM:(R69)'
                }]
            }
        })).to.be.true();
    });
});

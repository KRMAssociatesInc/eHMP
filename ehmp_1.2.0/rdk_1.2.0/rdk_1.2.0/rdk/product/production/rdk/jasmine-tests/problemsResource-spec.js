/*jslint node: true */
'use strict';

var _ = require('underscore');
var rdk = require('../rdk/rdk');
var VistaJS = require('../VistaJS/VistaJS');
var problemsResource = require('../resources/problems/problemsResource');

var logger = {
    trace: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    fatal: function() {}
};

var rpcCallback = function(error, result){};

var res = {
    status: function(){return this;},
    send: function(){return this;}
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

function spyOnRpc(searchTerm, uncoded, error, rpcResponse){
     spyOn(VistaJS, 'callRpc').andCallFake(function(logger, rpcConfig, rpcName, rpcParams, rpcCallback){
        expect(rpcParams[0]).toBe(searchTerm);
        var codedParam = uncoded ? 'CLF' : 'PLS';
        expect(rpcParams[1]).toBe(codedParam);
        expect(rpcParams[2]).toBe(0);
        rpcCallback(error, rpcResponse);
    });

    spyOn(res, 'status').andCallThrough();
    spyOn(res, 'send').andCallThrough();
}

describe('Get problem list endpoint', function() {
     it('returns "No Data" when there are no search results found', function() {
        var req = createReqWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, '');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: { items : 'No data' }
            }
        );
    });

    it('returns "No Data" when code search fails', function() {
        var req = createReqWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, 'Code search failed');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: { items : 'No data' }
            }
        );
    });

    it('returns "Search is unsupported" when RPC states to try a different search', function() {
        var req = createReqWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, null, 'Please try a different search');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.internal_server_error);
        expect(res.send).toHaveBeenCalledWith('Search is unsupported');
    });

    it('returns the error code when an unexpected error occurs', function() {
        var req = createReqWithParam({
            query: 'xyz123'
        });

        spyOnRpc('xyz123', false, 'an unexpected error occurred', null);
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.internal_server_error);
        expect(res.send).toHaveBeenCalledWith('an unexpected error occurred');
    });

    it('returns coded problems from VISTA', function() {
        var req = createReqWithParam({
            query: 'diabetes'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: {
                    items: [
                        {
                            problemNumber: '7130783',
                            problem: 'Diabetes mellitus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '73211009',
                            problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7027801',
                            problem: 'Diabetes insipidus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '15771004',
                            problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7234767',
                            problem: 'FH: Diabetes mellitus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '160303001',
                            problemText: 'FH: Diabetes mellitus ICD-10CM:(R69)'
                        }
                    ]
                }
            }
        );
    });

    it('returns coded problems from VISTA', function() {
        var req = createReqWithParam({
            query: 'diabetes',
            uncoded: 'true'
        });

        spyOnRpc('diabetes', true, null, '7358833^Renal diabetes^R69^521774^SNOMED CT^236367002^354316011^ICD-10-CM\r\n7572717^Bronze diabetes^R69^521774^SNOMED CT^399144008^1778601012^ICD-10-CM\r\n2 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: {
                    items: [
                        {
                            problemNumber: '7358833',
                            problem: 'Renal diabetes',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '236367002',
                            problemText: 'Renal diabetes ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7572717',
                            problem: 'Bronze diabetes',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '399144008',
                            problemText: 'Bronze diabetes ICD-10CM:(R69)'
                        }
                    ]
                }
            }
        );
    });

    it('tests limit parameter functions properly', function(){
        var req = createReqWithParam({
            query: 'diabetes',
            limit: '2'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: {
                    items: [
                        {
                            problemNumber: '7130783',
                            problem: 'Diabetes mellitus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '73211009',
                            problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7027801',
                            problem: 'Diabetes insipidus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '15771004',
                            problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                        }
                    ]
                }
            }
        );
    });

    it('tests limit parameter of zero returns all records', function(){
        var req = createReqWithParam({
            query: 'diabetes',
            limit: '0'
        });

        spyOnRpc('diabetes', false, null, '7130783^Diabetes mellitus^R69^521774^SNOMED CT^73211009^121589010^ICD-10-CM\r\n7027801^Diabetes insipidus^R69^521774^SNOMED CT^15771004^26721014^ICD-10-CM\r\n7234767^FH: Diabetes mellitus^R69^521774^SNOMED CT^160303001^249794016^ICD-10-CM\r\n3 matches found');
        problemsResource.getProblems(req, res);
        expect(VistaJS.callRpc).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(rdk.httpstatus.ok);
        expect(res.send).toHaveBeenCalledWith(
            {
                data: {
                    items: [
                        {
                            problemNumber: '7130783',
                            problem: 'Diabetes mellitus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '73211009',
                            problemText: 'Diabetes mellitus ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7027801',
                            problem: 'Diabetes insipidus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '15771004',
                            problemText: 'Diabetes insipidus ICD-10CM:(R69)'
                        },
                        {
                            problemNumber: '7234767',
                            problem: 'FH: Diabetes mellitus',
                            icd: 'R69',
                            lexiconCode: 'R69^521774',
                            snomed: '160303001',
                            problemText: 'FH: Diabetes mellitus ICD-10CM:(R69)'
                        }
                    ]
                }
            }
        );
    });
});

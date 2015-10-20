'use strict';

require('../../../env-setup');

var RpcParameter = require('vista-js').RpcParameter;
var RpcCall = require('vista-js').RpcCall;
var _flattenAndRemoveNullishValues = require('vista-js').RpcCall._flattenAndRemoveNullishValues;
var _processParamList = require('vista-js').RpcCall._processParamList;

describe('RpcCall.js', function() {
    describe('RpcCall()', function() {
        it('tests calling as function creates new instance', function() {
            /* jshint ignore:start */
            var c = RpcCall('value', 'literal');
            expect(c instanceof RpcCall).toBe(true);
            /* jshint ignore:end */
        });

        it('tests attributes are set correctly', function() {
            var c = new RpcCall('rpcName', 'params');
            expect(c.rpcName).toEqual('rpcName');
            expect(c.params).toEqual('params');
        });
    });


    describe('isRpcCall()', function() {
        it('tests it identifies real instance', function() {
            var r = new RpcCall();
            expect(RpcCall.isRpcCall(r)).toBe(true);
        });

        it('tests it rejects reference to function', function() {
            expect(RpcCall.isRpcCall(RpcCall)).toBe(false);
        });

        it('tests it rejects null', function() {
            expect(RpcCall.isRpcCall(null)).toBe(false);
        });

        it('tests it rejects undefined', function() {
            expect(RpcCall.isRpcCall(null)).toBe(false);
        });

        it('tests it rejects an object', function() {
            expect(RpcCall.isRpcCall({})).toBe(false);
        });

        it('tests it rejects a string', function() {
            expect(RpcCall.isRpcCall('test')).toBe(false);
        });

        it('tests it rejects a number', function() {
            expect(RpcCall.isRpcCall(1)).toBe(false);
        });

        it('tests it rejects an array', function() {
            expect(RpcCall.isRpcCall([])).toBe(false);
        });

        it('tests it rejects an array of RpcCalls', function() {
            expect(RpcCall.isRpcCall([new RpcCall(), new RpcCall()])).toBe(false);
        });
    });


    describe('processParamList()', function() {
        var params = _processParamList(['string', 1, {
                '"param"': 'value'
            },
            RpcParameter.encrypted('test')
        ]);

        it('tests undefined and null', function() {
            expect(_processParamList()).toEqual([]);
            expect(_processParamList(null)).toEqual([]);
        });

        it('tests string', function() {
            expect(params[0].value).toEqual('string');
            expect(params[0].type).toEqual('literal');
            expect(RpcParameter.isRpcParameter(params[0])).toBe(true);
        });

        it('tests number', function() {
            expect(params[1].value).toEqual('1');
            expect(params[1].type).toEqual('literal');
            expect(RpcParameter.isRpcParameter(params[1])).toBe(true);
        });

        it('tests object', function() {
            expect(params[2].value).toEqual({
                '"param"': 'value'
            });
            expect(params[2].type).toEqual('list');
            expect(RpcParameter.isRpcParameter(params[1])).toBe(true);
        });

        it('tests RpcParameter', function() {
            expect(params[3].value).toEqual('test');
            expect(params[3].type).toEqual('encrypted');
            expect(RpcParameter.isRpcParameter(params[3])).toBe(true);
        });
    });

    describe('flattenAndRemoveNullishValues()', function() {
        it('verify null and undefined returns empty array', function() {
            expect(_flattenAndRemoveNullishValues()).toEqual([]);
            expect(_flattenAndRemoveNullishValues(null)).toEqual([]);
        });

        it('verify non-array translated to single-element array', function() {
            expect(_flattenAndRemoveNullishValues('test')).toEqual(['test']);
        });

        it('verify nested arrays are flattened', function() {
            expect(_flattenAndRemoveNullishValues(['test1', ['test2', 'test3']])).toEqual(['test1', 'test2', 'test3']);
            expect(_flattenAndRemoveNullishValues(['test1', ['test2', ['test3']], 'test4'])).toEqual(['test1', 'test2', 'test3', 'test4']);
        });

        it('verify null and undefined values are removed', function() {
            expect(_flattenAndRemoveNullishValues(['test1', [null, 'test3']])).toEqual(['test1', 'test3']);
            expect(_flattenAndRemoveNullishValues(['test1', [undefined, ['test3']], null])).toEqual(['test1', 'test3']);
        });
    });

    describe('create()', function() {
        it('tests empty array or no parameters returns undefined', function() {
            expect(RpcCall.create([])).toBeUndefined();
            expect(RpcCall.create([null])).toBeUndefined();
            expect(RpcCall.create([''])).toBeUndefined();
            expect(RpcCall.create()).toBeUndefined();
            expect(RpcCall.create(null)).toBeUndefined();
            expect(RpcCall.create('')).toBeUndefined();
        });

        it('tests array with only rpcName defined', function() {
            var call = RpcCall.create(['RpcName']);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params).toEqual([]);
        });

        it('tests array with single parameter', function() {
            var call = RpcCall.create(['RpcName', 'string']);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(1);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
        });

        it('tests array with two parameters', function() {
            var call = RpcCall.create(['RpcName', 'string1', 'string2']);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[1])).toBe(true);
            expect(call.params[1].type).toEqual('literal');
        });

        it('tests array with array of two parameters', function() {
            var call = RpcCall.create(['RpcName', ['string1', 'string2']]);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[1])).toBe(true);
            expect(call.params[1].type).toEqual('literal');
        });

        it('tests only rpcName defined', function() {
            var call = RpcCall.create('RpcName');
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params).toEqual([]);
        });

        it('tests rpcName with single parameter', function() {
            var call = RpcCall.create('RpcName', 'string');
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(1);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
        });

        it('tests rpcName with two parameters', function() {
            var call = RpcCall.create('RpcName', 'string1', 'string2');
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[1])).toBe(true);
            expect(call.params[1].type).toEqual('literal');
        });

        it('tests rpcName with array of two parameters', function() {
            var call = RpcCall.create('RpcName', ['string1', 'string2']);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[0])).toBe(true);
            expect(call.params[0].type).toEqual('literal');
            expect(call.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call.params[1])).toBe(true);
            expect(call.params[1].type).toEqual('literal');
        });

        it('tests single parameter', function() {
            var call = RpcCall.create('RpcName', ['string', 1], {
                '"param"': 'value'
            }, [
                [RpcParameter.encrypted('test')]
            ]);
            expect(call.rpcName).toEqual('RpcName');
            expect(call.params[0].value).toEqual('string');
            expect(call.params[1].value).toEqual('1');
            expect(call.params[2].value).toEqual({
                '"param"': 'value'
            });
            expect(call.params[3].value).toEqual('test');
        });

        it('tests RpcCall is passed in', function() {
            var call = RpcCall.create('RpcName', 'string1', 'string2');
            var call2 = RpcCall.create(call);
            expect(call2.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call2.params[0])).toBe(true);
            expect(call2.params[0].type).toEqual('literal');
            expect(call2.params.length).toEqual(2);
            expect(RpcParameter.isRpcParameter(call2.params[1])).toBe(true);
            expect(call2.params[1].type).toEqual('literal');
        });
    });
});


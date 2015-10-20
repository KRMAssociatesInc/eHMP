'use strict';

require('../../../env-setup');

var RpcParameter = require('vista-js').RpcParameter;

describe('RpcParameter.js', function() {
    describe('RpcParameter constructor', function() {
        it('tests calling as function creates new instance', function() {
            /* jshint ignore:start */
            var r = RpcParameter('value', 'literal');
            expect(r instanceof RpcParameter).toBe(true);
            /* jshint ignore:end */
        });

        it('tests null attributes function is undefined', function() {
            var r = new RpcParameter('value', 'literal');
            expect(r.attributes).toEqual({});
        });

        it('tests instance attributes are set correctly', function() {
            var r = new RpcParameter('value', 'literal', {
                test: 'test'
            });
            expect(r.value).toEqual('value');
            expect(r.type).toEqual('literal');
            expect(r.attributes).toEqual({
                test: 'test'
            });
        });
    });


    describe('isRpcParameter()', function() {
        it('tests it identifies real instance', function() {
            var r = new RpcParameter();
            expect(RpcParameter.isRpcParameter(r)).toBe(true);
        });

        it('tests it rejects reference to function', function() {
            expect(RpcParameter.isRpcParameter(RpcParameter)).toBe(false);
        });

        it('tests it rejects null', function() {
            expect(RpcParameter.isRpcParameter(null)).toBe(false);
        });

        it('tests it rejects undefined', function() {
            expect(RpcParameter.isRpcParameter(null)).toBe(false);
        });

        it('tests it rejects an object', function() {
            expect(RpcParameter.isRpcParameter({})).toBe(false);
        });

        it('tests it rejects a string', function() {
            expect(RpcParameter.isRpcParameter('test')).toBe(false);
        });

        it('tests it rejects a number', function() {
            expect(RpcParameter.isRpcParameter(1)).toBe(false);
        });

        it('tests it rejects an array', function() {
            expect(RpcParameter.isRpcParameter([])).toBe(false);
        });

        it('tests it rejects an array of RpcParameters', function() {
            expect(RpcParameter.isRpcParameter([new RpcParameter(), new RpcParameter()])).toBe(false);
        });
    });


    describe('parameter creation functions', function() {
        it('tests literal()', function() {
            var r = RpcParameter.literal('value');
            expect(RpcParameter.isRpcParameter(r)).toBe(true);
            expect(r.type).toEqual('literal');
            expect(r.value).toEqual('value');
            expect(r.attributes).toEqual({});
        });

        it('tests list()', function() {
            var r = RpcParameter.list('value');
            expect(RpcParameter.isRpcParameter(r)).toBe(true);
            expect(r.type).toEqual('list');
            expect(r.value).toEqual('value');
            expect(r.attributes).toEqual({});
        });

        it('tests reference()', function() {
            var r = RpcParameter.reference('value');
            expect(RpcParameter.isRpcParameter(r)).toBe(true);
            expect(r.type).toEqual('reference');
            expect(r.value).toEqual('value');
            expect(r.attributes).toEqual({});
        });

        it('tests encrypted()', function() {
            var r = RpcParameter.encrypted('value', 1, 2);
            expect(RpcParameter.isRpcParameter(r)).toBe(true);
            expect(r.type).toEqual('encrypted');
            expect(r.value).toEqual('value');
            expect(r.attributes).toEqual({
                assocIndex: 1,
                idIndex: 2
            });
        });
    });
});
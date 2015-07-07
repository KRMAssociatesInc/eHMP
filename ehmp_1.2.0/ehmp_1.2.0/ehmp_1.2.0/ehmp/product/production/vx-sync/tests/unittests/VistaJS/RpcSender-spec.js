'use strict';

require('../../../env-setup');

var RpcSender = require(global.VX_VISTAJS + 'RpcSender');

var extractSecurityErrorMessage = RpcSender.extractSecurityErrorMessage;
var parseMessage = RpcSender.parseMessage;
var _createResponse = RpcSender._createResponse;
var _extractAndPad = RpcSender._extractAndPad;
var makeVisible = RpcSender.makeVisible;
var stripEOTs = RpcSender.stripEOTs;


var EOT = RpcSender.EOT;
// var NUL = RpcSender.NUL;
// var SOH = RpcSender.SOH;
// var ENQ = RpcSender.ENQ;

// var undefMsg = RpcSender._undefMsg;
// var nullMsg = RpcSender._nullMsg;
// var shortMsg = RpcSender._shortMsg;
// var securityMsg = RpcSender._securityMsg;
// var appMsg = RpcSender._appMsg;
// var truncMsg = RpcSender._truncMsg;
// var merrMsg = RpcSender._merrMsg;


describe('RpcSender.js', function() {
	describe('stripEOTs()', function() {
		it('tests undefined', function() {
			expect(stripEOTs(undefined)).toBeUndefined();
		});

		it('tests null', function() {
			expect(stripEOTs(null)).toBeNull();
		});

		it('tests no EOT', function() {
			expect(stripEOTs('test')).toEqual('test');
		});

		it('tests only EOT', function() {
			expect(stripEOTs(EOT)).toEqual('');
		});

		it('tests empty string', function() {
			expect(stripEOTs('')).toEqual('');
		});

		it('tests string ending with EOT', function() {
			expect(stripEOTs('test' + EOT)).toEqual('test');
		});

		it('tests string with EOT in middle', function() {
			expect(stripEOTs('test' + EOT + 'test')).toEqual('testtest');
		});

		it('tests string ending with multiple EOTs', function() {
			expect(stripEOTs('test' + EOT + 'test' + EOT)).toEqual('testtest');
		});
	});


	describe('extractSecurityErrorMessage()', function() {
		it('tests undefined', function() {
			expect(extractSecurityErrorMessage(undefined)).toEqual('');
		});

		it('tests null', function() {
			expect(extractSecurityErrorMessage(null)).toEqual('');
		});

		it('tests empty string', function() {
			expect(extractSecurityErrorMessage('')).toEqual('');
		});

		it('tests only length byte', function() {
			expect(extractSecurityErrorMessage('\u0004')).toEqual('');
		});

		it('tests fewer characters than header', function() {
			expect(extractSecurityErrorMessage('\u0010' + 'test')).toEqual('test');
		});

		it('tests more characters than header', function() {
			expect(extractSecurityErrorMessage('\u0004' + 'testTest')).toEqual('test');
		});

		it('tests ends with EOT', function() {
			expect(extractSecurityErrorMessage('\u0005' + 'test' + EOT)).toEqual('test');
		});

		it('tests exact match', function() {
			expect(extractSecurityErrorMessage('\u0004' + 'test')).toEqual('test');
		});
	});

	describe('createResponse()', function() {
		it('tests all undefined and null', function() {
			expect(_createResponse()).toEqual({ response: undefined });
			expect(_createResponse(null, null)).toEqual({ response: null });
		});

		it('tests only response message', function() {
			expect(_createResponse('test')).toEqual({ response: 'test' });
		});

		it('tests only simple error message', function() {
			expect(_createResponse(undefined, 'error')).toEqual({ response: undefined, error: 'error' });
			expect(_createResponse(null, 'error')).toEqual({ response: null, error: 'error' });
		});

		it('tests only simple error message', function() {
			expect(_createResponse(undefined, 'error')).toEqual({ response: undefined, error: 'error' });
		});

		it('tests response message and simple error message', function() {
			expect(_createResponse('response', 'error')).toEqual({ response: 'response', error: 'error' });
		});

		it('tests response message and format error message', function() {
			expect(_createResponse('response', 'error %s', 'test')).toEqual({ response: 'response', error: 'error test' });
			expect(_createResponse('response', 'error %s', 'test1', 'test2')).toEqual({ response: 'response', error: 'error test1 test2' });
			expect(_createResponse('response', 'error %s:%s', 'test1', 'test2')).toEqual({ response: 'response', error: 'error test1:test2' });
		});

		it('tests no response message and format error message', function() {
			expect(_createResponse(undefined, 'error %s:%s', 'test1', 'test2')).toEqual({ response: undefined, error: 'error test1:test2' });
			expect(_createResponse(null, 'error %s:%s', 'test1', 'test2')).toEqual({ response: null, error: 'error test1:test2' });
		});
	});

	describe('extractAndPad()', function() {
		it('test padding', function() {
			expect(_extractAndPad('ABC', 2)).toEqual('0043');
		});
	});

	describe('makeVisible()', function() {
		it('test all undefined and null', function(){
			expect(makeVisible()).toEqual('');
			expect(makeVisible(null)).toEqual('');
			expect(makeVisible(null, null)).toEqual('');
		});

		it('test default open and close', function(){
			var str1 = 'abc\n';
			var str2 = '\u0000abc\u0004';
			expect(makeVisible(str1)).toEqual('abc[' + str1.charCodeAt(3) + ']');
			expect(makeVisible(str2)).toEqual('[0]abc[4]');
		});

		it('test specified open and close', function(){
			var str1 = 'abc\n';
			var str2 = '\u0000abc\u0004';
			expect(makeVisible(str1, '/', '!')).toEqual('abc/' + str1.charCodeAt(3) + '!');
			expect(makeVisible(str2, '/', '!')).toEqual('/0!abc/4!');
		});
	});

	describe('parseMessage()', function() {
		it('tests undefined', function() {
			expect(parseMessage(undefined)).toEqual({
				error: 'response was undefined',
				response: undefined
			});
		});

		it('tests null', function() {
			expect(parseMessage(null)).toEqual({
				error: 'response was null',
				response: null
			});
		});

		it('tests response < 3 characters', function() {
			expect(parseMessage('\u0034')).toEqual({
				error: 'response too short (length: 1)',
				response: '\u0034'
			});
		});

		it('tests security error with message', function() {
			expect(parseMessage('\u0004test')).toEqual({
				error: 'VistA SECURITY error (byte 0 was \'\\u0004\'): test',
				response: '\u0004test'
			});
		});

		it('tests security error with message with EOT at end', function() {
			expect(parseMessage('\u0004test\u0004')).toEqual({
				error: 'VistA SECURITY error (byte 0 was \'\\u0004\'): test',
				response: '\u0004test\u0004'
			});
		});

		it('tests security error with message too short', function() {
			expect(parseMessage('\u0010test')).toEqual({
				error: 'VistA SECURITY error (byte 0 was \'\\u0010\'): test',
				response: '\u0010test'
			});
		});

		it('tests application error', function() {
			expect(parseMessage('\u0000\u0001test')).toEqual({
				error: 'VistA APPLICATION error (byte 1 was \'\\u0001\')',
				response: '\u0000\u0001test'
			});
		});

		it('tests "M  ERROR" error', function() {
			expect(parseMessage('\u0000\u0000M  ERROR' + EOT)).toEqual({
				error: '"M  ERROR" returned by server',
				response: 'M  ERROR'
			});
		});

		it('tests "M  ERROR" error with extra', function() {
			expect(parseMessage('\u0000\u0000M  ERRORtest' + EOT)).toEqual({
				error: '"M  ERROR" returned by server',
				response: 'M  ERRORtest'
			});
		});

		it('tests valid response', function() {
			expect(parseMessage('\u0000\u0000ValidResponse' + EOT)).toEqual({
				response: 'ValidResponse'
			});
		});

		it('tests valid response with EOT in middle', function() {
			expect(parseMessage('\u0000\u0000Valid' + EOT + 'Response' + EOT)).toEqual({
				response: 'ValidResponse'
			});
		});

		it('tests valid empty response', function() {
			expect(parseMessage('\u0000\u0000' + EOT)).toEqual({
				response: ''
			});
		});
	});
});

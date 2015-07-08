///*jslint node: true */
//'use strict';
//
//var asu = require('../subsystems/asu/asuProcess');
//var http = require('../utils/http-wrapper/http');
//
//describe('ASU evaluate facade:', function() {
//    var logger = {
//        info : function(data) {
//            console.log(data);
//        },
//        error : function(data) {
//            console.log(data);
//        }
//    };
//	var jsonParams = {
//		test : 'foo'
//	};
//	var httpConfig = {
//		timeoutMillis : 30000,
//		protocol : 'http',
//		options : {
//			path : '/asu/test',
//			method : 'POST',
//			host : 'localhost',
//			port : 8897
//		}
//	};
//
//	var httpResponse = {
//        json : function(param) {
//        },
//        send : function() {
//        }
//    };
//
//	it('Test evaluate() triggers http post to configured HTTP values', function() {
//		spyOn(http, 'post');
//		asu.evaluate(jsonParams, httpConfig, httpResponse, logger);
//
//		expect(http.post).toHaveBeenCalledWith(jsonParams, httpConfig,
//				jasmine.any(Function));
//	});
//
//	it('Test _evaluateFinished() writes error response if error is encountered', function() {
//		spyOn(httpResponse, 'send');
//		var paramsAsString = JSON.stringify(jsonParams);
//		// Test sending null error
//		asu._evaluateFinished('error encountered in test', [paramsAsString], httpResponse, logger);
//		expect(httpResponse.send).toHaveBeenCalledWith(500, 'error encountered in test');
//	});
//
//	it('Test _evaluateFinished() writes HTTP response with given data if no error', function() {
//		spyOn(httpResponse, 'json');
//		var paramsAsString = JSON.stringify(jsonParams);
//		// Test sending undefined error
//		asu._evaluateFinished(undefined, [paramsAsString], httpResponse, logger);
//		expect(httpResponse.json).toHaveBeenCalledWith(jsonParams);
//	});
//
//	it('Test _evaluateFinished() writes HTTP response with given data if no error', function() {
//		spyOn(httpResponse, 'json');
//		var paramsAsString = JSON.stringify(jsonParams);
//		// Test sending null error
//		asu._evaluateFinished(null, [paramsAsString], httpResponse, logger);
//		expect(httpResponse.json).toHaveBeenCalledWith(jsonParams);
//	});
//});

/*jslint node: true*/
'use strict';

var request = require('request');
var discontinueReasonUrl = 'http://10.4.4.105:8888/writeback/med/discontinuereason';
var orderPresetsUrl = 'http://10.4.4.105:8888/writeback/med/orderpresets';

describe('NonVA med resource test', function() {
    it('tests that nonVA med discontinue reasons are returned', function() {
        var result;

        runs(function() {
            request(discontinueReasonUrl, function(error, response, body) {
                result = {};
                if (error) {
                    result.error = error;
                } else {
                    result.error = error;
                    result.response = response;
                    result.body = body;
                }
            }).qs().auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return result;
        }, 'returns vital', 10000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
            expect(result.body).toEqual('{"data":{"items":[{"id":"7","name":"Duplicate Order"},{"id":"16","name":"Entered in error"},{"id":"17","name":"Per Policy"},{"id":"14","name":"Requesting Physician Cancelled"}],"success":true}}');
        });
    });

    it('tests the order presets', function() {
        var result,
            requestPayload = {
                'param': '{"orderien":"18048;1"}'
            };

        runs(function() {
            request(orderPresetsUrl, function(error, response, body) {
                result = {};
                if (error) {
                    result.error = error;
                } else {
                    result.error = error;
                    result.response = response;
                    result.body = body;
                }
            }).qs(requestPayload).auth('9E7A;pu1234', 'pu1234!!');
        });

        waitsFor(function() {
            return result;
        }, 'returns vital', 10000);

        runs(function() {
            expect(result.error).toBeFalsy();
            expect(result.response.statusCode).toBe(200);
            expect(result.body).toEqual('{"data":{"items":[{"orderable":{"entryien":"4","instance":"1","values":{"internal":"3855","external":"ASPIRIN TAB,EC "},"displayvalue":"ASPIRIN TAB,EC "},"comment":{"entryien":"15","instance":"1","values":{}},"instr":{"entryien":"136","instance":"1","values":{"internal":"81MG","external":"81MG"},"displayvalue":"81MG"},"route":{"entryien":"137","instance":"1","values":{"internal":"1","external":"ORAL (BY MOUTH)"},"displayvalue":"ORAL (BY MOUTH)"},"drug":{"entryien":"138","instance":"1","values":{"internal":"872","external":"ASPIRIN 81MG EC TAB"},"displayvalue":"ASPIRIN 81MG EC TAB"},"schedule":{"entryien":"170","instance":"1","values":{"internal":"QAM","external":"QAM"},"displayvalue":"QAM"},"strength":{"entryien":"384","instance":"1","values":{"internal":"81MG","external":"81MG"},"displayvalue":"81MG"},"sig":{"entryien":"385","instance":"1","values":{"text":"TAKE ONE TABLET BY MOUTH EVERY MORNING"},"displayvalue":"TAKE ONE TABLET BY MOUTH EVERY MORNING"},"dose":{"entryien":"386","instance":"1","values":{"internal":"81&MG&1&TABLET&81MG&872&81&MG","external":"81&MG&1&TABLET&81MG&872&81&MG"},"displayvalue":"81&MG&1&TABLET&81MG&872&81&MG"},"statements":{"entryien":"1615","instance":"1","values":{"text":"Non-VA medication recommended by VA provider.  "},"displayvalue":"Non-VA medication recommended by VA provider.  "}}],"success":true}}');
        });
    });
});

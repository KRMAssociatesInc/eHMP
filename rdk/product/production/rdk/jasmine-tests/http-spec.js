/*jslint node: true */
'use strict';

var nock = require('nock');
var httpUtil = require('../utils/http-wrapper/http');

var logger = {
    trace: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    fatal: function() {}
};


describe('http', function() {
    describe('fetch', function() {
        it('tests that http correctly handles a successful call', function() {
            var config = {
                protocol: 'http',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 8080,
                    path: '/info',
                    method: 'GET'
                }
            };

            var done = false;
            var error;
            nock('http://127.0.0.1:8080')
                .get('/info')
                .reply(200, 'Hello World');

            var test = {
                callback: function(err) {
                    done = true;
                    error = err;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.fetch(config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalledWith(undefined, 'Hello World', 200);
                expect(error).not.toBeDefined();
            });

            nock.cleanAll();
        });

        it('tests that http correctly handles a unsuccessful call', function() {
            var config = {
                protocol: 'httpx',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 8080,
                    path: '/info',
                    method: 'GET'
                }
            };
            var done = false;
            var error;

            var test = {
                callback: function(err) {
                    error = err;
                    done = true;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.fetch(config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalled();
                expect(error).toBeDefined();
            });
        });
    });

    describe('JSON POST', function() {
        it('accepts stringified JSON content', function() {
            var config = {
                protocol: 'http',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 8080,
                    path: '/info',
                    method: 'POST'
                }
            };

            var done = false;
            var error;
            nock('http://127.0.0.1:8080')
                .post('/info', {
                    test: 'test'
                })
                .reply(200, 'JSON Passed');

            var test = {
                callback: function(err) {
                    done = true;
                    error = err;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.postJSONObject('{\"test\":\"test\"}', config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalledWith(undefined, 'JSON Passed');
                expect(error).not.toBeDefined();
            });

            nock.cleanAll();
        });

        it('adds content type/length headers', function() {
            var config = {
                protocol: 'http',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 8080,
                    path: '/info',
                    method: 'POST'
                }
            };

            var jsonObj = {
                header: 'header'
            };

            var done = false;
            var error;
            nock('http://127.0.0.1:8080', {
                reqheaders: {
                    'Content-Type': 'application/json',
                    'Content-Length': (Buffer.byteLength(JSON.stringify(jsonObj))).toString()
                }
            })
                .post('/info', jsonObj)
                .reply(200, 'JSON Passed');

            var test = {
                callback: function(err) {
                    done = true;
                    error = err;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.postJSONObject(jsonObj, config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalledWith(undefined, 'JSON Passed');
                expect(error).not.toBeDefined();
            });

            nock.cleanAll();
        });

        it('returns results from valid endpoint', function() {
            var config = {
                protocol: 'http',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 8080,
                    path: '/info',
                    method: 'POST'
                }
            };

            var done = false;
            var error;
            nock('http://127.0.0.1:8080')
                .post('/info', {
                    test: 'test'
                })
                .reply(200, 'JSON Passed');

            var test = {
                callback: function(err) {
                    done = true;
                    error = err;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.postJSONObject({
                test: 'test'
            }, config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalledWith(undefined, 'JSON Passed');
                expect(error).not.toBeDefined();
            });

            nock.cleanAll();
        });

        it('returns error from invalid endpoint', function() {
            var config = {
                protocol: 'http',
                logger: logger,
                options: {
                    host: '127.0.0.1',
                    port: 6666,
                    path: '/info',
                    method: 'POST'
                }
            };
            var done = false;
            var error;

            var test = {
                callback: function(err) {
                    error = err;
                    done = true;
                }
            };

            spyOn(test, 'callback').andCallThrough();
            jasmine.createSpy('callback');

            httpUtil.postJSONObject({
                test: 'test'
            }, config, test.callback);

            waitsFor(function() {
                return done;
            }, '"done" should be true', 1000);

            runs(function() {
                expect(test.callback).toHaveBeenCalled();
                expect(error).toBeDefined();
            });
        });

    });
});

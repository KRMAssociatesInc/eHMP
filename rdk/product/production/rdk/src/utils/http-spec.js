'use strict';

var metrics = require('./metrics/metrics');
var nock = require('nock');
var httpUtil = require('./http');

var logger = {
    trace: function() {},
    debug: function() {},
    info: function() {},
    warn: function() {},
    error: function() {},
    fatal: function() {}
};

var appConfig = {
    timeoutMillis: 120000
};

describe('http', function() {
    beforeEach(function() {
        nock.cleanAll();
        nock.disableNetConnect();
    });
    describe('fetch', function() {
        var logger;
        var app;

        beforeEach(function() {
            app = {
                logger: logger,
                config: {
                    mvi: {
                        host: '10.10.01.101'
                    },
                    hmpServer: {
                        host: ''
                    },
                    jdsServer: {
                        host: ''
                    },
                    jbpm: {
                        host: ''
                    },
                    solrServer: {
                        host: ''
                    },
                    vistaSites: {
                        '9E7A': {
                            name: 'PANORAMA',
                            host: '10.2.2.101'
                        }
                    }
                }
            };

            metrics.initialize(app);
        });

        afterEach(function() {
            clearInterval(metrics.memoryUsageTimerId);
        });

        it('tests that http correctly handles a successful call', function(done) {
            this.timeout(1000);
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

            nock('http://127.0.0.1:8080')
                .get('/info')
                .reply(200, 'Hello World');

            httpUtil.fetch(appConfig, config, function(err, response, status) {
                expect(err).to.be.falsy();
                expect(response).to.equal('Hello World');
                expect(status).to.equal(200);
                done();
            });
            nock.cleanAll();
        });

        it('tests that http correctly handles a unsuccessful call', function(done) {
            this.timeout(1000);
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
            httpUtil.fetch(appConfig, config, function(err) {
                expect(err).to.be.truthy();
                done();
            });
        });
    });

    describe('JSON POST', function() {
        it('accepts stringified JSON content', function(done) {
            this.timeout(1000);
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
            nock('http://127.0.0.1:8080')
                .post('/info', {
                    test: 'test'
                })
                .reply(200, 'JSON Passed');

            httpUtil.postJSONObject('{\"test\":\"test\"}', appConfig, config, function(err, response) {
                expect(err).to.be.falsy();
                expect(response).to.equal('JSON Passed');
                done();
            });
            nock.cleanAll();
        });

        it('adds content type/length headers', function(done) {
            this.timeout(1000);
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
            nock('http://127.0.0.1:8080', {
                    reqheaders: {
                        'Content-Type': 'application/json',
                        'Content-Length': (Buffer.byteLength(JSON.stringify(jsonObj))).toString()
                    }
                })
                .post('/info', jsonObj)
                .reply(200, 'JSON Passed');

            httpUtil.postJSONObject(jsonObj, appConfig, config, function(err, response) {
                expect(err).to.be.falsy();
                expect(response).to.equal('JSON Passed');
                done();
            });

            nock.cleanAll();
        });

        it('returns results from valid endpoint', function(done) {
            this.timeout(1000);
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
            nock('http://127.0.0.1:8080')
                .post('/info', {
                    test: 'test'
                })
                .reply(200, 'JSON Passed');

            httpUtil.postJSONObject({
                test: 'test'
            }, appConfig, config, function(err, response) {
                expect(err).to.be.falsy();
                expect(response).to.equal('JSON Passed');
                done();
            });

            nock.cleanAll();
        });

        it('returns error from invalid endpoint', function(done) {
            this.timeout(1000);
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
            httpUtil.postJSONObject({
                test: 'test'
            }, appConfig, config, function(err) {
                expect(err).to.be.truthy();
                done();
            });
        });
    });
});

'use strict';

require('../../../env-setup');

var _ = require('underscore');

var RpcClient = require(global.VX_VISTAJS + 'RpcClient').RpcClient;
var RpcSerializer = require(global.VX_VISTAJS + 'RpcSerializer').RpcSerializer;

var parseMessage = require(global.VX_VISTAJS + 'RpcSender').parseMessage;

var logger = {
    trace: _.noop,
    debug: _.noop,
    info: _.noop,
    warn: _.noop,
    error: _.noop,
    fatal: _.noop
};

var config = {
    host: '10.2.2.102',
    port: 9210,
    accessCode: 'pu1234',
    verifyCode: 'pu1234!!',
    context: 'VPR UI CONTEXT',
    localIP: '127.0.0.1',
    localAddress: 'localhost',
    connectTimeout: 3000,
    sendTimeout: 10000
};

function testCommand(command, sentError, sentResult, expectedError, expectedResult) {
    var testError;
    var testResult;
    var called = false;

    function callback(error, result) {
        called = true;
        testError = error;
        testResult = result;
    }

    var instance = {
        logger: logger,
        config: config,
        sender: {
            send: function send(string, callback) {
                callback(sentError, sentResult);
            },
            close: _.noop
        }
    };

    command.call(instance, callback);

    waitsFor(function() {
        return called;
    }, 'should be called', 1000);

    runs(function() {
        expect(testError).toEqual(expectedError);
        expect(testResult).toEqual(expectedResult);
    });
}

var greeting = {
    pattern: new RegExp('^\\[XWB\\]10304\u000ATCPConnect500140009127\\.0\\.0\\.1ff00010f00140009localhostff\u0004$'),
    response: '\u0000\u0000accept\u0004'
};

var signon = {
    pattern: new RegExp('^\\[XWB\\]11302\u00051\\.108\u0010XUS SIGNON SETUP54f\u0004$'),
    response: '\u0000\u0000localhost.localdomain\u000D\u000AROU\u000D\u000AVISTA\u000D\u000A/dev/null:16898\u000D\u000A5\u000D\u000A0\u000D\u000AVISTA.LOCAL.US\u000D\u000A0\u000D\u000A\u0004'
};

var verify = {
    pattern: new RegExp('^\\[XWB\\]11302\u00051\\.108\u000BXUS AV CODE50017.{17}f\u0004$'),
    response: '\u0000\u000010000000226\u000D\u000A0\u000D\u000A0\u000D\u000A\u000D\u000A0\u000D\u000A0\u000D\u000A\u000D\u000AGood evening USER,PANORAMA\u000D\u000A     You last signed on yesterday at 15:59\u000D\u000A\u0004'
};

var context = {
    pattern: new RegExp('^\\[XWB\\]11302\u00051\\.108\u0012XWB CREATE CONTEXT50016.{16}f\u0004$'),
    response: '\u0000\u00001\u0004'
};

/* jshint ignore:start */
var execute = {
    pattern: new RegExp('^\\[XWB\\]11302\u00051\\.108\u000DORWU USERINFO54f\u0004$'),
    response: '\u0000\u000010000000226^USER,PANORAMA^3^1^1^3^0^4000^20^1^1^20^KODAK.VISTACORE.US^0^180^^^^0^0^^1^0^500^^0\u0004'
};

var signoff = {
    pattern: new RegExp('^\\[XWB\\]10304\u0005#BYE#\u0004$'),
    response: '\u0000\u0000#BYE#\u0004'
};
/* jshint ignore:end */

var dummySender = {
    count: 0,
    reqRes: [],
    connect: function(callback) {
        callback(null, 'connected');
    },
    send: function send(string, callback) {
        var curr = this.reqRes[this.count];
        if (!curr) {
            this.count = 0;
            return callback('error');
        }

        if (!curr.pattern.test(string)) {
            this.count = 0;
            return callback(null, '\u0000\u0001Application Error\u0004');
        }

        this.count++;
        var response = parseMessage(curr.response);
        callback(response.error, response.response);
    },
    close: _.noop
};

describe('RpcClient.js', function() {
    describe('greetingCommand()', function() {
        it('verify error triggers callback error', function() {
            testCommand(RpcClient.prototype.greetingCommand, 'error', 'result', 'error', 'result');
        });

        it('verify invalid response string triggers callback error', function() {
            testCommand(RpcClient.prototype.greetingCommand, null, 'xaccept', 'Response to greeting was invalid', 'xaccept');
        });

        it('verify no error triggers callback result', function() {
            testCommand(RpcClient.prototype.greetingCommand, null, 'accept', null, 'HANDSHAKE SUCCESSFUL');
        });
    });

    describe('buildSignonCallback()', function() {
        it('verify error triggers callback error', function() {
            testCommand(RpcClient.prototype.signonCommand, 'error', 'result', 'error', 'result');
        });

        it('verify invalid response string triggers callback error', function() {
            testCommand(RpcClient.prototype.signonCommand, null, '', 'No response to signon callback', null);
        });

        xit('verify no error triggers callback result', function() {
            testCommand(RpcClient.prototype.signonCommand, null, 'anything', null, 'SIGNON SETUP SUCCESSFUL');
        });
    });

    describe('buildVerifyCallback()', function() {
        it('verify error triggers callback error', function() {
            testCommand(RpcClient.prototype.verifyCommand, 'error', 'result', 'error', 'result');
        });

        it('verify invalid response string triggers callback error', function() {
            testCommand(RpcClient.prototype.verifyCommand, null, '', 'No response to login request', null);
        });

        it('verify no DUZ triggers callback error', function() {
            testCommand(RpcClient.prototype.verifyCommand, null, '0\r\n0', 'No DUZ returned from login request', '0\r\n0');
        });

        it('verify no error triggers callback result', function() {
            testCommand(RpcClient.prototype.verifyCommand, null, '10000217\r\n0', null, {
                accessCode: config.accessCode,
                verifyCode: config.verifyCode,
                duz: '10000217'
            });
        });
    });

    describe('buildContextCallback()', function() {
        it('verify error triggers callback error', function() {
            testCommand(RpcClient.prototype.contextCommand, 'error', 'result', 'error', 'result');
        });

        it('verify invalid response string triggers callback error', function() {
            testCommand(RpcClient.prototype.contextCommand, null, '0', 'Authorization error', '0');
        });

        it('verify valid response string triggers callback result', function() {
            testCommand(RpcClient.prototype.contextCommand, null, '1', null, config.context);
        });
    });

    describe('buildSignOffCallback()', function() {
        it('verify error triggers callback error', function() {
            testCommand(RpcClient.prototype.signoffCommand, 'error', 'result', 'error', 'result');
        });

        it('verify no error triggers callback result', function() {
            testCommand(RpcClient.prototype.signoffCommand, null, 'result', null, 'SIGNOFF SUCCESSFUL');
        });
    });

    describe('isClient()', function() {
        it('verify RpcClient passes', function() {
            var client = new RpcClient(logger, config);
            expect(RpcClient.isClient(client)).toBe(true);
        });

        it('verify correct signature passes', function() {
            expect(RpcClient.isClient({
                connect: _.noop,
                execute: _.noop,
                close: _.noop
            })).toBe(true);

            expect(RpcClient.isClient({
                connect: _.noop,
                execute: _.noop,
                close: _.noop,
                foo: _.noop,
                bar: 'bar'
            })).toBe(true);
        });

        it('verify undefined, null, and incorrect signatures/types fail', function() {
            expect(RpcClient.isClient()).toBe(false);
            expect(RpcClient.isClient(null)).toBe(false);
            expect(RpcClient.isClient({})).toBe(false);
            expect(RpcClient.isClient('')).toBe(false);
            expect(RpcClient.isClient({
                connect: _.noop,
                execute: _.noop,
                close: 'foo'
            }));
            expect(RpcClient.isClient({
                connect: _.noop,
                execute: _.noop
            }));
        });
    });

    describe('RpcClient.create()', function() {
        it('verify instance created', function() {
            var client = RpcClient.create(logger, config);
            expect(client instanceof RpcClient).toBe(true);
            expect(client.logger).toBe(logger);
            expect(client.config).toBe(config);
        });
    });

    describe('RpcClient.execute()', function() {
        var testError;
        var testResult;
        var called;
        var client;
        var execute;

        beforeEach(function() {
            testError = undefined;
            testResult = undefined;
            called = false;

            client = {
                logger: logger,
                config: config,
                sender: {
                    send: function(rpcString, callback) {
                        callback(null, rpcString);
                    }
                }
            };

            execute = RpcClient.prototype.execute.bind(client);
        });

        it('test no arguments throws exception', function() {
            expect(execute).toThrow();
        });

        it('test not connected', function() {
            delete client.sender;

            execute('XUS SIGNON SETUP', function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toEqual('RpcClient is not connected to the Vista server');
                expect(testResult).toBeUndefined();
            });
        });

        it('test insufficient arguments', function() {
            execute(function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toEqual('Insufficient number of arguments');
                expect(testResult).toBeUndefined();
            });
        });

        it('test invalid arguments', function() {
            execute('', function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toEqual('Invalid arguments for rpcCall');
                expect(testResult).toBeUndefined();
            });
        });

        it('test valid arguments', function() {
            var rpcCmd = 'XUS SIGNON SETUP';

            execute(rpcCmd, function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toBeNull();
                expect(testResult).toEqual(RpcSerializer.buildRpcString(rpcCmd));
            });
        });
    });

    describe('RpcClient.close()', function() {
        var testError;
        var testResult;
        var called;
        var client;
        var close;

        beforeEach(function() {
            testError = undefined;
            testResult = undefined;
            called = false;

            client = {
                logger: logger,
                config: config,
                sender: {
                    send: function(rpcString, callback) {
                        callback(null, rpcString);
                    },
                    close: _.noop
                },
                signoffCommand: function(callback) {
                    callback(null, 'SIGNOFF SUCCESSFUL');
                }
            };

            close = RpcClient.prototype.close.bind(client);
        });

        xit('test no arguments throws exception', function() {
            expect(close).toThrow();
        });

        it('test not connected', function() {
            client.sender = null;

            close(function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toBeUndefined();
                expect(testResult).toBeUndefined();
            });
        });

        it('test valid signoff', function() {
            close(function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            });

            expect(client.sender).toBeNull();

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toBeNull();
                expect(testResult).toEqual('SIGNOFF SUCCESSFUL');
            });
        });
    });

    describe('RpcClient.connect()', function() {
        it('verify connection', function() {
            var user = {
                accessCode: 'pu1234',
                verifyCode: 'pu1234!!',
                duz: '10000000226'
            };

            var reqRes = [greeting, signon, verify, context];
            dummySender.reqRes = reqRes;
            dummySender.count = 0;

            var client = new RpcClient(logger, config);
            client.createSender = function() {
                this.sender = dummySender;
            };

            var testError;
            var testResult;
            var called = false;

            var testCallback = function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            };

            client.connect(testCallback);

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toBeNull();
                expect(testResult).toEqual(user);
            });
        });
    });

    describe('authenticate()', function() {
        it('verify authenticate() calls connect() and close()', function() {
            var user = {
                accessCode: 'pu1234',
                verifyCode: 'pu1234!!',
                duz: '10000000226'
            };

            var connectCalled = false;
            var closeCalled = false;

            var mockClient = {
                logger: logger,
                config: config,
                connect: function(callback) {
                    connectCalled = true;
                    callback(null, user);
                },
                execute: _.noop,
                close: function(callback) {
                    callback = callback || function() {};
                    closeCalled = true;
                    callback();
                }
            };

            var testError;
            var testResult;
            var called = false;

            var testCallback = function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            };

            RpcClient.authenticate(mockClient, testCallback);

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);


            runs(function() {
                expect(testError).toBeNull();
                expect(testResult).toEqual(user);
            });
        });
    });

    describe('callRpc()', function() {
        it('verify callRpc() calls connect(), execute(), and close()', function() {
            var user = {
                accessCode: 'pu1234',
                verifyCode: 'pu1234!!',
                duz: '10000000226'
            };
            var response = '10000000226^USER,PANORAMA^3^1^1^3^0^4000^20^1^1^20^KODAK.VISTACORE.US^0^180^^^^0^0^^1^0^500^^0';
            var connectCalled = false;
            var closeCalled = false;

            var mockClient = {
                logger: logger,
                config: config,
                connect: function(callback) {
                    connectCalled = true;
                    callback(null, user);
                },
                execute: function(rpcCall, parameters, callback) {
                    callback(null, response);
                },
                close: function(callback) {
                    callback = callback || function() {};
                    closeCalled = true;
                    callback();
                }
            };

            var testError;
            var testResult;
            var called = false;

            var testCallback = function(error, result) {
                called = true;
                testError = error;
                testResult = result;
            };

            RpcClient.callRpc(mockClient, 'ORWU USERINFO', testCallback);

            waitsFor(function() {
                return called;
            }, 'should be called', 1000);

            runs(function() {
                expect(testError).toBeNull();
                expect(testResult).toEqual(response);
            });
        });
    });
});
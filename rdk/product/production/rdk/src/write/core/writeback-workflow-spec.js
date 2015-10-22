'use strict';

var writebackWorkflow = require('./writeback-workflow');
var jdsDirectWriter = require('./jds-direct-writer');
var httpUtil = require('../../core/rdk').utils.http;
var _ = require('lodash');

describe('writeback workflow', function() {
    var logger;
    var req;
    beforeEach(function(done) {
        logger = sinon.stub(require('bunyan').createLogger({
            name: 'writeback-workflow-spec.js'
        }));
        req = {};
        req.logger = logger;
        req.app = {};
        req.app.config = {};
        req.session = {};
        req.session.user = {};
        req.body = {};
        req.param = _.identity;

        done();
    });
    describe('getVistaConfig', function() {
        it('gets the vista config for a request', function() {
            var appConfig = {};
            appConfig.vistaSites = {};
            appConfig.vistaSites.C877 = {
                name: 'My Vista Site'
            };
            appConfig.rpcConfig = {};
            appConfig.rpcConfig.context = 'rpcContext';
            var user = {};
            user.site = 'C877';
            user.accessCode = 'accessCode';
            user.verifyCode = 'verifyCode';

            expect(writebackWorkflow._getVistaConfig(logger, appConfig, user)).to.eql({
                context: appConfig.rpcConfig.context,
                accessCode: user.accessCode,
                verifyCode: user.verifyCode,
                name: appConfig.vistaSites[user.site].name
            });
        });
        it('handles an invalid app config', function() {
            var appConfig = {};
            appConfig.rpcConfig = {};
            appConfig.rpcConfig.context = 'rpcContext';
            var user = {};
            user.site = 'C877';
            user.accessCode = 'accessCode';
            user.verifyCode = 'verifyCode';

            expect(writebackWorkflow._getVistaConfig(logger, appConfig, user)).to.eql({
                context: appConfig.rpcConfig.context,
                accessCode: user.accessCode,
                verifyCode: user.verifyCode
            });
        });
        it('handles an invalid user', function() {
            var appConfig = {};
            appConfig.vistaSites = {};
            appConfig.vistaSites.C877 = {
                name: 'My Vista Site'
            };
            appConfig.rpcConfig = {};
            appConfig.rpcConfig.context = 'rpcContext';
            var user = {};

            expect(writebackWorkflow._getVistaConfig(logger, appConfig, user)).to.eql({
                context: appConfig.rpcConfig.context,
                accessCode: undefined,
                verifyCode: undefined
            });
        });
    });

    describe('writebackWorkflow', function() {
        it('runs a series of tasks', function(done) {
            var taskCount = 0;
            var res = {};
            res.status = function(status) {
                expect(status).to.equal(200);
                return this;
            };
            res.rdkSend = function(body) {
                expect(taskCount).to.equal(2);
                expect(body).to.eql({
                    status: 200,
                    data: {test: true}
                });
                done();
            };
            var tasks = [
                function(writebackContext, callback) {
                    taskCount++;
                    callback(null);
                },
                function(writebackContext, callback) {
                    taskCount++;
                    writebackContext.vprResponse = {test: true};
                    callback(null);
                }
            ];
            writebackWorkflow(req, res, tasks);
        });
        it('handles when the tasks do not set a vprResponse', function(done) {
            var taskCount = 0;
            var res = {};
            res.status = function(status) {
                expect(status).to.equal(500);
                return this;
            };
            res.rdkSend = function(body) {
                expect(taskCount).to.equal(1);
                expect(body).to.have.keys(['error']);
                done();
            };
            var tasks = [function(writebackContext, callback) {
                taskCount++;
                callback(null);
            }];
            writebackWorkflow(req, res, tasks);
        });
        it('handles when a tasks calls back an error', function(done) {
            var res = {};
            res.status = function(status) {
                expect(status).to.equal(500);
                return this;
            };
            res.rdkSend = function(body) {
                expect(body).to.have.keys(['error']);
                expect(req.logger.error.called).to.be.true();
                done();
            };
            var tasks = [function(writebackContext, callback) {
                callback({error: 'An error happened'});
            }];
            writebackWorkflow(req, res, tasks);
        });
        it('elevates elevated tasks', function(done) {
            sinon.stub(httpUtil, 'post').callsArgWith(3, new Error('alter the response message field'));
            req.app.config.vxSyncWritebackServer = {};
            req.app.config.vxSyncWritebackServer.host = null;
            req.app.config.vxSyncWritebackServer.port = null;
            var res = {};
            res.status = function() {
                return this;
            };
            res.rdkSend = function(body) {
                expect(body.message).to.equal('Error calling the VX-Sync writeback endpoint');
                done();
            };
            var tasks = [
                function(writebackContext, callback) {
                    writebackContext.vprModel = {test: true};
                    writebackContext.vprResponse = {test: true};
                    callback();
                },
                jdsDirectWriter
            ];
            writebackWorkflow(req, res, tasks);
        });
        it('sets the status specified by the resource', function(done) {
            var res = {};
            res.status = function(status) {
                expect(status).to.equal(234);
                return this;
            };
            res.rdkSend = function() {
                done();
            };
            var tasks = [function(writebackContext, callback) {
                writebackContext.vprResponse = {test: true};
                writebackContext.vprResponseStatus = 234;
                callback(null);
            }];
            writebackWorkflow(req, res, tasks);
        });
    });
});

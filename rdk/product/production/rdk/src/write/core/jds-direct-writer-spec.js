'use strict';

var jdsDirectWriter = require('./jds-direct-writer');
var httpUtil = require('../../core/rdk').utils.http;
var nock = require('nock');
nock.cleanAll();

describe('jds-direct-writer', function() {
    var logger;
    beforeEach(function() {
        logger = sinon.stub(require('bunyan').createLogger({
            name: 'jds-direct-writer'
        }));
        nock('http://localhost:8080').post('/writeback').reply(200, {});
    });
    it('warns when no vprModel is set', function(done) {
        var writebackContext = {
            logger: logger,
            vprModel: null
        };
        var vxSyncResponse = {};
        jdsDirectWriter(writebackContext, vxSyncResponse, function(error) {
            expect(writebackContext.logger.warn.called).to.be.true();
            expect(error).to.be.undefined();
            done();
        });
    });
    it('posts the model to the vx-sync writeback wrapper', function(done) {
        var writebackContext = {
            logger: logger,
            vprModel: {},
            appConfig: {
                vxSyncWritebackServer: {
                    host: 'localhost',
                    port: '8080'
                }
            }
        };
        var vxSyncResponse = {};
        jdsDirectWriter(writebackContext, vxSyncResponse, function(error) {
            expect(writebackContext.logger.warn.called).not.to.be.true();
            expect(error).to.be.falsy();
            done();
        });
    });
    it('posts multiple models to the vx-sync writeback wrapper', function(done) {
        var writebackContext = {
            logger: logger,
            vprModel: [{first: '1'}, {second: '2'}],
            appConfig: {
                vxSyncWritebackServer: {
                    host: 'localhost',
                    port: '8080'
                }
            }
        };
        var actualVprModels = [];
        sinon.stub(httpUtil, 'post', function(vprModel, appConfig, requestConfig, callback) {
            actualVprModels.push(vprModel);
            callback();
        });
        var vxSyncResponse = {};
        jdsDirectWriter(writebackContext, vxSyncResponse, function(error) {
            expect(writebackContext.logger.warn.called).not.to.be.true();
            expect(actualVprModels).to.eql(writebackContext.vprModel);
            expect(error).to.be.falsy();
            done();
        });
    });
    it('warns on error when posting the model to the vx-sync writeback wrapper', function(done) {
        nock.cleanAll();  // The call is not mocked anymore
        var writebackContext = {
            logger: logger,
            vprModel: {},
            appConfig: {
                vxSyncWritebackServer: {
                    host: 'localhost',
                    port: '8080'
                }
            }
        };
        var vxSyncResponse = {};
        jdsDirectWriter(writebackContext, vxSyncResponse, function(error) {
            expect(writebackContext.logger.warn.called).to.be.true();
            expect(error).to.be.falsy();
            done();
        });
    });
});

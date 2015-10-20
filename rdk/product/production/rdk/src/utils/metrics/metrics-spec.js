'use strict';

var metrics = require('./metrics');
var MetricsData = require('./metrics-data');

describe('Metrics spec', function() {
    var logger;
    var app;

    beforeEach(function() {

        logger = sinon.stub(require('bunyan').createLogger({
            name: 'metrics-spec.js'
        }));
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

    it('handle outgoing start without req options', function() {
        var data = metrics.handleOutgoingStart({}, logger);


        expect(logger.info.calledWith({metrics: {}}, 'metrics: no options defined')).to.be.true();
        expect(data.isType("outgoing"));
    });

    it('handle outgoing start without req options.host', function() {
        var data = metrics.handleOutgoingStart({
            options: {}
        }, logger);

        expect(logger.info.calledWith({metrics: {}}, 'metrics: no host defined')).to.be.true();
        expect(data.isType("outgoing"));
    });

    it('handle outgoing start with unknown host', function() {
        var data = metrics.handleOutgoingStart({
            options: {
                host: '1.1.1.1'
            }
        }, logger);

        expect(data.isType("outgoing"));
        expect(data.hostName).to.equal("UNKNOWN");
    });

    it('handle outgoing start with mvi host', function() {
        var data = metrics.handleOutgoingStart({
            options: {
                host: '10.10.01.101'
            }
        }, logger);

        expect(data.isType("outgoing"));
        expect(data.hostName).to.equal("mvi");
    });

    it('handle outgoing start with 9E7A vista host', function() {
        var data = metrics.handleOutgoingStart({
            options: {
                host: '10.2.2.101'
            }
        }, logger);

        expect(data.isType("outgoing"));
        expect(data.hostName).to.equal("PANORAMA");
    });

    it('handle incoming start', function() {
        var data = metrics.handleIncomingStart({}, logger);

        expect(data.isType("incoming"));
        expect(data.hostName).to.equal("UNKNOWN");
    });

    it('handle finish does not log invalid metric data', function() {
        metrics.handleFinish({}, logger);

        expect(logger.info.called).to.be.false();
    });

    it('handle finish does not log null metric data', function() {
        metrics.handleFinish(null, logger);

        expect(logger.info.called).to.be.false();
    });

    it('handle finish logs metric data', function() {
        var data = new MetricsData('incomming', null);
        metrics.handleFinish(data, logger);

        expect(logger.info.called).to.be.true();
        expect(data.result).to.equal("success");
    });

    it('handle error does not log invalid metric data', function() {
        metrics.handleError({}, logger);

        expect(logger.info.called).to.be.false();
    });

    it('handle error does not log null metric data', function() {
        metrics.handleError(null, logger);

        expect(logger.info.called).to.be.false();
    });

    it('handle error logs metric data', function() {
        metrics.handleError(new MetricsData('incomming', null), logger);

        expect(logger.info.called).to.be.true();
    });
});

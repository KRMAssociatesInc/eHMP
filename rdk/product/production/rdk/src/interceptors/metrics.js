'use strict';

var metrics = require('../utils/metrics/metrics');

module.exports = function(req, res, next) {
    var logger = req.logger;
    logger.info('metrics invoked');
    var metricData = metrics.handleIncomingStart(req, logger);

    function onFinish() {
        metrics.handleFinish(metricData, logger);
    }

    function onClose() {
        req.logger.info('METRICS: CALL CLOSED: '+new Date().getTime());
    }

    res.on('finish', onFinish);
    res.on('close', onClose);
    next();
};

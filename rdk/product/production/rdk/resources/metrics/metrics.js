/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var httpUtil = require('../../utils/http-wrapper/http');
var util = require('util');
var cfg = require('./config');
var metStore = cfg.MetricListener;
var errorMetricData = 'Metrics: error calling metric data service - ';

var config = {
        timeoutMillis: 50000,
        protocol: 'http',
        options: {
            host: metStore.host,
            port: metStore.port,
            path: metStore.path //,
            //method: metStore.method
        }
    };

/*
 * Validate the the required parameters are passed and that the parameters passed are correct
 */
function invalidMetricSearchParameters(req) {
    req.logger.debug('TEST: ' + req.param.metricId);
    if ((req.query.metricId !== undefined) && (req.query.startPeriod !== undefined)) {
        var metricIdRegex = /^.{3,}$/;   // minimum 3 chars? /^\d+$/;
        var dateTimeRegex = /^\d+$/;
        var granularityRegex = /(15s|1m|15m|1h|8h|1d|1w|1y)/;
        var originRegex = /^.{1,}$/;   // minimum 1 chars?;

        // just a string for the demo
        if (!metricIdRegex.test(req.query.metricId)) {
            return 'Metric id contains illegal characters.';
        }
        if (!dateTimeRegex.test(req.query.startPeriod)) {
            return 'Start time contains illegal characters.';
        }
        if (req.query.endPeriod !== undefined && !dateTimeRegex.test(req.query.endPeriod)) {
            return 'End time contains illegal characters.';
        }
        if (req.query.granularity !== undefined && !granularityRegex.test(req.query.granularity)) {
            return 'Only a granularity from the following enum list is supported: [15s, 1m, 15m, 1h, 8h, 1d, 1w, 1y].';
        }
        if (req.query.origin !== undefined && !originRegex.test(req.query.origin)) {
            return 'origin contains illegal characters.';
        }
        return false;
    } else {
        //not enough parameters to search...
        return 'Error: You must enter a valid {metricId | startPeriod}';
    }
}

function invalidDashboardParameters(req) {
    if (req.param('dashboardId') !== undefined) {
//        var dashboardIdRegex = /^\d+$/;
//
//        if (req.param('dashboardId') !== undefined && !dashboardIdRegex.test(req.param('dashboardId'))) {
//            return 'Dashboard id contains illegal characters.';
//        }
        return false;
    } else {
    //not enough parameters to search...
        return 'Error: You must enter a provide a valid {dashboardId}';
    }
}

function invalidDeleteMetricGroupParameters(req) {
    if (req.param('metricGroupId') !== undefined) {
//        var metricGroupIdRegex = /^\d+$/;
//
//        if (req.param('metricGroupId') !== undefined && !metricGroupIdRegex.test(req.param('metricGroupId'))) {
//            return 'MetricGroupId id contains illegal characters.';
//        }
        return false;
    } else {
        //not enough parameters to search...
        return 'Error: You must enter a provide a valid {MetricGroupId}';
    }
}

//function invalidmetricToGroupParameters(req) {
//    if ((req.param('metricGroupId') !== undefined && req.param('metricId') !== undefined)) {
//
//        var idRegex = /^\d+$/;
//
//        if (!idRegex.test(req.param('metricGroupId'))) {
//            return 'MetricGroupId id contains illegal characters.';
//        }
//        if (!idRegex.test(req.param('metricId'))) {
//            return 'MetricId id contains illegal characters.';
//        }
//        return false;
//    } else {
//        //not enough parameters to search...
//        return 'Error: You must enter a provide a valid {MetricGroupId}';
//    }
//}

var content = {
};

module.exports.getMetricSearch = function (req, res) {
    req.logger.debug('Metrics GET getMetricSearch called');

    var msg = invalidMetricSearchParameters(req);
    if (msg) {
        res.status(rdk.httpstatus.bad_request).send(msg);

    } else {

        config.logger = req.logger;
        config.options.method = 'GET';
        var path = '/?metricId=' +  req.query.metricId + '&startPeriod=' + req.query.startPeriod;
        if (req.query.endPeriod !== undefined) {
            path += '&endPeriod=' + req.query.endPeriod;
        }
        if (req.query.granularity !== undefined) {
            path += '&granularity=' + req.query.granularity;
        }
        if (req.query.origin !== undefined) {
            path += '&origin=' + req.query.origin;
        }
        config.options.path = '/metric' + path;

        httpUtil.fetch(config, function (err, response) {
            req.logger.debug('callback from fetch()');

            if (err) {
                // there was an error calling the metric data service
                req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
                res.status(rdk.httpstatus.internal_server_error).json(err);
                return;
            }

            // aggregation currently done in the cds-data layer
            //var payload = JSON.stringify({
            //    'payload' : response
            //});

            res.status(rdk.httpstatus.ok).send(response);
        });
    }
};

function getKeyValue(obj) {
    var property;
    if (obj !== null) {
        for (property in obj) {
            if (property !== undefined) {
                return property + ':' + obj[property];
            }
        }
    }
    return 'BAD OBJECT';
}

// Origins

module.exports.getOrigins = function (req, res) {
    req.logger.debug('Metrics GET getOrigins called');

    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/origins/';

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

// DASHBOARD ....

module.exports.getUserDashBoards = function (req, res) {
    req.logger.debug('Metrics GET getDashboards called');

    var uid = getKeyValue(req.session.user.duz);
    if (req.query.userId !== undefined) {
        uid = req.query.userId;
    }

    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/dashboards/' + uid;

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.getDashBoard = function (req, res) {
    req.logger.debug('Metrics GET getDashboard called');

    var msg = invalidDashboardParameters(req);
    if (msg) {
        res.status(rdk.httpstatus.bad_request).send(msg);
    } else {

        config.logger = req.logger;
        config.options.method = 'GET';
        config.options.path = '/metric/dashboard/' + req.param('dashboardId');

        httpUtil.fetch(config, function (err, response) {
            req.logger.debug('callback from fetch()');

            if (err) {
                // there was an error calling the metric data service
                req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
                res.status(rdk.httpstatus.internal_server_error).json(err);
                return;
            }
            res.status(rdk.httpstatus.ok).send(response);
        });
    }
};

module.exports.createDashboard = function (req, res) {
    req.logger.debug('Metrics POST createDashboard called');

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/dashboard';

    content = req.body;
    content.userId = getKeyValue(req.session.user.duz);

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from post()');

        if (err) {
            // there was an error calling the invocationserver
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.updateDashboard = function (req, res) {
    req.logger.debug('Metrics PUT updateDashboard called');

    config.logger = req.logger;
    config.options.method = 'PUT';
    config.options.path = '/metric/dashboard/' + req.param('dashboardId');

    content = req.body;

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from put()');

        if (err) {
            // there was an error calling the invocationserver
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.deleteDashboard = function (req, res) {
    req.logger.debug('Metrics DELETE deleteDashboard called');

    var dashboardId = req.param('dashboardId');

    var msg = invalidDashboardParameters(req);
    if (msg) {
        res.status(rdk.httpstatus.bad_request).send(msg);

    } else {

        config.logger = req.logger;
        config.options.method = 'DELETE';
        config.options.path = '/metric/dashboard/' + dashboardId;
        content = {};

        httpUtil.post(content, config, function (err, response) {
            req.logger.debug('callback from post()');

            if (err) {
                // there was an error calling the invocationserver
                req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
                res.status(rdk.httpstatus.internal_server_error).json(err);
                return;
            }
            res.status(rdk.httpstatus.ok).send(response);
        });
    }
};

// GROUPS ...

module.exports.getMetricGroups = function (req, res) {
    req.logger.debug('Metrics GET getMetricGroups called');

    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/groups';

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.createMetricGroup = function (req, res) {
    req.logger.debug('Metrics POST createMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.vistaKeys[]

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/groups';
    content = req.body;

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from post()');

        if (err) {
            // there was an error calling the invocationserver
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.updateMetricGroup = function (req, res) {
    req.logger.debug('Metrics POST createMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.???

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/groups';
    content = req.body;

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from post()');

        if (err) {
            // there was an error calling the invocationserver
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.deleteMetricGroup = function (req, res) {
    req.logger.debug('Metrics DELETE deleteMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.???

    var metricGroupId = req.param('id');

    var msg = invalidDeleteMetricGroupParameters(req);
    if (msg) {
        res.status(rdk.httpstatus.bad_request).send(msg);
    } else {
        config.logger = req.logger;
        config.options.method = 'DELETE';
        config.options.path = '/metric/group/' + metricGroupId;
        content = {};

        httpUtil.post(content, config, function (err, response) {
            req.logger.debug('callback from post()');

            if (err) {
                // there was an error calling the invocationserver
                req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
                res.status(rdk.httpstatus.internal_server_error).json(err);
                return;
            }

            response = JSON.parse(response);
            res.status(rdk.httpstatus.ok).send(metricGroupId);
        });
    }
};

// DEFINITIONS ...

module.exports.getMetricDefinitions = function (req, res) {
    req.logger.debug('Metrics GET getMetricDefinitions called');

    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/definitions';

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.createMetricDefinitions = function (req, res) {
    req.logger.debug('Metrics POST createDashboard called');

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/definitions';
    content = req.body;

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from post()');

        if (err || !response) {
            // there was an error calling the invocationserver
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

// ROLES ...

module.exports.getRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/roles';

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.updateRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/roles';
    content = req.body;

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

// USER ROLES ...

module.exports.getUserRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    var uid = getKeyValue(req.session.user.duz);
    config.logger = req.logger;
    config.options.method = 'GET';
    config.options.path = '/metric/userRoles/' + uid;

    httpUtil.fetch(config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

module.exports.updateUserRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    config.logger = req.logger;
    config.options.method = 'POST';
    config.options.path = '/metric/userRoles';
    content = req.body;
    content.userId = getKeyValue(req.session.user.duz);

    httpUtil.post(content, config, function (err, response) {
        req.logger.debug('callback from fetch()');

        if (err) {
            // there was an error calling the metric data service
            req.logger.debug(errorMetricData + util.inspect(err, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).json(err);
            return;
        }
        res.status(rdk.httpstatus.ok).send(response);
    });
};

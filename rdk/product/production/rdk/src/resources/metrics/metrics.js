'use strict';

var rdk = require('../../core/rdk');
var httpUtil = require('../../utils/http');
var util = require('util');
var cfg = require('./config');
var metStore = cfg.MetricListener;
var errorMetricData = 'Metrics: error calling metric data service - ';

var request = require('request');

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

// set up the packages we need
var express = require('express');
var bodyParser = require('body-parser');
//var config = require('./config');
var mdb = cfg.MongoDbListener;
var met = cfg.Metrics;
var defs = cfg.Defined_Metric_Definitions;
var grps = cfg.Defined_Metric_Groups;
var cnfs = cfg.Defined_Metric_Config;

// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':' + mdb.port + '/' + met.dbname);
var ObjectID = require('mongoskin').ObjectID;

var app = express();
app.use(bodyParser.json());

var definitionName = [];
var definitionId = [];

var msgBodyError = 'Message body cannot be empty and must contain valid JSON';
var idParamErorr = 'Argument passed in must be a single String of 12 bytes or a string of 24 hex characters';
var notFoundError = 'Not Found';

db.open(function (err) {
    if (!err) {
        console.log("Connected to 'metric' database");

        db.collection('definitions').remove({}, function (err, result) {
            // console.log('err: ' + err + ' result: ' + result);
        });
        for (var i = 0; i < defs.length; i++) {
            var d = defs[i];
            db.collection('definitions').update({_id: d._id}, d, {upsert: true}, function (err, result) {
                // console.log('err: ' + err + ' result: ' + result);
            });
            definitionName[d.name] = i;
            definitionId[d._id] = i;
        }
        console.log("Definitions updated");

        for (var i = 0; i < grps.length; i++) {
            var d = grps[i];
            db.collection('groups').update({name: d.name}, d, {upsert: true}, function (err, result) {
                // console.log('err: ' + err + ' result: ' + result);
            });
        }
        console.log("Groups updated");
    }
});


// format json object
function formatjson(j) {
    var cache = [];
    var r = JSON.stringify(j, function(key, value) {
        if (typeof value === 'object' && value !== null) {
            if (cache.indexOf(value) !== -1) {
                // Circular reference found, discard key
                return;
            }
            // Store value in our collection
            cache.push(value);
        }
        return value;
    },2);
    cache = null; // Enable garbage collection
    return r;
}

// Checks if a string, such as a message body, is a valid JSON object
function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

/*
 * Validate the the required parameters are passed and that the parameters passed are correct
 */
function invalidMetricSearchParameters(req) {
    req.logger.debug('TEST: ' + req.param.metricId);
    if ((req.query.metricId !== undefined) && (req.query.startPeriod !== undefined)) {
        var metricIdRegex = /^.{1,}$/;   // minimum 3 chars? /^\d+$/;     either a name or an id
        var dateTimeRegex = /^\d+$/;
        var granularityRegex = /^\d+$/;
        var originRegex = /^.{1,}$/;   // minimum 1 chars?;
        var invocationTypeRegex = /^.{1,}$/;   // minimum 1 chars?;

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
            return 'A granularity is a whole number in milliseconds.';
        }
        if (req.query.origin !== undefined && !originRegex.test(req.query.origin)) {
            return 'origin contains illegal characters.';
        }
        if (req.query.invocationType !== undefined && !invocationTypeRegex.test(req.query.invocationType)) {
            return 'invocationType contains illegal characters.';
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


/*
 * Creates an aggregating query pipeline for MongoDB. Granularity is a required
 * value for this type of query.
 */
function createAggregatedQuery(query) {

    console.log('Create Aggregated Query: ' + formatjson(query));

    var match = {
            $match: {
                'time': {
                    $gt: query.startPeriod
                }
            }
    };

    if (query.endPeriod) {
        match.$match.time.$lt = query.endPeriod;
    }
    if (query.origin) {
        match.$match.origin = query.origin;
    }
    if (query.type) {
        match.$match.type = query.type;
    }
    if (query.invocationType) {
        match.$match.invocationType = query.invocationType;
    }
    if (query.event === undefined) {
        match.$match.name = query.name;
    } else {
        match.$match.event = query.event;
    }

    if (!query.granularity) {
        query.granularity = 1;
    }
    // if we're rounding the grouping based on granularity, we should also round the start period match
    match.$match.time.$gt = roundToGranularity(query.startPeriod, query.granularity);

    var group = {
            '$group': {
                '_id': {
                    'time': {
                        '$subtract': [
                                      '$time',
                                      { '$mod': [ '$time', Number(query.granularity) ] }  // granularity
                                                                                            // in
                                                                                            // ms...
                                      ]
                    }
                },
            }
        };

    var agt = query.aggregation;
    for (var i = 0; i < agt.length; i++) {
        group.$group[agt[i]] = {};
        if (agt[i] === 'count') {
            group.$group[agt[i]]['$sum'] = 1;
        } else {
            group.$group[agt[i]]['$'+agt[i]] = '$' + query.property;
        }
    }

    var sort = { $sort: { '_id.time' : -1 } }; // descending chronological
                                                // order
    var limit = { $limit: 500 }; // 500 record max, per documentation.
    var project = { $project : { _id: 0, datetime:'$_id.time', count: 1, min: 1 , max: 1, avg: 1, sum: 1} };

    // console.log('Create Aggregated Query: ' + formatjson({ match_$gt: toISOString(match.$match.time.$gt), match_$lt: toISOString(match.$match.time.$lt) }));

    return [match, group, sort, limit, project];
}

/*
 * Creates an count query pipeline for MongoDB
 */
function createQuery(query) {

    console.log('Create Event Query: ' + formatjson(query));

    var match = {
           $match: {
               'time': {
                   $gt: query.startPeriod
               }
           }
       };

    if (query.endPeriod) {
        match.$match.time.$lt = query.endPeriod;
    }
    if (query.origin) {
        match.$match.origin = query.origin;
    }
    if (query.type) {
        match.$match.type = query.type;
    }
    if (query.invocationType) {
        match.$match.invocationType = query.invocationType;
    }
    if (query.event === undefined) {
        match.$match.name = query.name;
    } else {
        match.$match.event = query.event;
    }

    if (query.granularity) {
        // if we're rounding the grouping based on granularity, we should also round the start period match
        match.$match.time.$gt = roundToGranularity(query.startPeriod, query.granularity);
        var group = {
                '$group': {
                    '_id': {
                        'time': {
                            '$subtract': [
                                          '$time',
                                          { '$mod': [ '$time', Number(query.granularity) ] }
                                          ]
                        }
                    },
                    'count': {'$sum' : 1}
               }
        };
    }

    var sort = { $sort: { '_id.time' : -1 } };
    var limit = { $limit: 500 };
    var project = { $project : { _id: 0, count: 1 , datetime: '$_id.time' } };

    if (query.granularity) {
        return [match, group, sort, limit, project];
    }
    return [match, sort, limit, project];
}


function getMetricDefinition(metricId) {

    try {
        if (isNaN(metricId)) {
            return defs[definitionName[metricId]];
        }
        return defs[definitionId[metricId]];
    } catch (e) {
        return null;
    }
}

/**
 * Adds the missing time interval metrics results with null values for a given time range.
 *
 * @param startPeriod {Number} Epoch time representation of the start of the time period.
 * @param endPeriod {Number} Epoch time representation of the end of the time period.
 * @param granularity {Number} The time step size in milliseconds.
 * @param list {Array} The list of metric items to check for missing time steps.
 * @returns {Array} A list of metrics padded with null values for the missing time steps.
 */
function padMissingValues(startPeriod, endPeriod, granularity, list) {
    if (!list) {
        list = [];
    }

    // round start/end periods to line up with granularity
    var roundedStartTime = roundToGranularity(startPeriod, granularity);
    var roundedEndTime = roundToGranularity(endPeriod, granularity);

    // the last time slot should happen before the end period
    var timeSlot = roundedEndTime < endPeriod ? roundedEndTime : (endPeriod - granularity);
    var listIdx = 0;
    var paddedList = [];

    // The list of metrics is sorted decreasing time. We start
    // at the end and work our way backwards to the start of the time range.
    while (timeSlot >= roundedStartTime) {
        var item = listIdx < list.length ? list[listIdx] : null;

        if (!item || timeSlot > item.datetime) {
            paddedList.push({ count: null, min: null, max: null, avg: null, sum: null, datetime: timeSlot, isoDate: toISOString(timeSlot) });
        }
        else {
            item.isoDate = toISOString(item.datetime);
            paddedList.push(item);
            listIdx++;
        }
        timeSlot -= granularity;
    }
    return paddedList;
}


/**
 * Rounds a given epoch to align with a given granularity.
 *
 * @param {Number} epoch Epoch (unix time).
 * @param {Number} granularity Granularity in milliseconds.
 * @returns {Number} Returns an epoch that aligns with the given granularity.
 */
function roundToGranularity(epoch, granularity) {
    return epoch - (epoch % granularity);
}

/**
 * Converts an epoch time to its corresponding UTC ISO 8601 string.
 *
 * @param {Number} epoch Unix epoch time to convert.
 * @returns {String}
 */
function toISOString(epoch) {
    return  (new Date(epoch)).toISOString();
}

/**
 * @api {get} /metrics Get Metrics
 * @apiName GetMetrics
 * @apiGroup Metrics
 * @apiDescription Returns a list of metric data points. Points will contain a sequence of values
 * over time which can be turned into a chart.
 * @apiParam {String} metricId The id of the type of metric to be displayed
 * @apiParam {long} startPeriod the beggining range of when a queried metric is captured (Unix time in milliseconds)
 * @apiParam {long} endPeriod the end range of when a queried metric is captured (Unix time in milliseconds)
 * @apiParam {long} granularity the length of time in milliseconds in which metrics are aggregated
 * @apiParam {String} [origin] Used to filter by using the name of the source from where a metric originated
 * @apiParam {String="Direct","Background"} [invocationType] describes how a metric is generated
 * @apiExample {js} Example usage:
 * curl -i http://10.4.4.105:8888/resource/metrics/metrics?metricId=1&startPeriod=1431607947079&endPeriod=1431636747079&granularity=3600000&origin=SystemA&invocationType=Direct
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Undefined Metric Requested."
 *     }
 * @apiSuccess {json} payload Json object containing a list of all datapoint values
 * @apiSuccessExample {json} GetMetrics-Response
 * {
 *  "payload": [
 *    {
 *      "datetime": 1431633600000,
 *      "count": 19,
 *      "min": 0.0,
 *      "max": 0.0,
 *      "sum": 0.0
 *    }
 *   ]
 * }
 */
module.exports.getMetricSearch = function (req, res) {
    req.logger.debug('Metrics GET getMetricSearch called');

    var msg = invalidMetricSearchParameters(req);
    if (msg) {
        res.status(rdk.httpstatus.bad_request).rdkSend(msg);

    } else {

        var metricId = req.query.metricId;
        var query = getMetricDefinition(metricId);
        if (!query) {
            var msg = 'Undefined Metric Requested.';
            res.status(400).send({status: 400, error: msg});
            return;
        }

        query.startPeriod  = +req.query.startPeriod;
        query.endPeriod  = null;
        query.granularity  = null;
        query.origin = null;
        query.invocationType = null;

        if (req.query.endPeriod) {
            query.endPeriod = +req.query.endPeriod;
        }
        if (req.query.granularity) {
            if (+req.query.granularity > 0) {
                query.granularity = +req.query.granularity;
            }
        }
        if (req.query.origin) {
            query.origin = req.query.origin;
        }
        if (req.query.invocationType) {
            query.invocationType = req.query.invocationType;
        }

        var pipeline;
        // this assumes that 'event type call metrics' defined as only having the count defined.
        if (query.aggregation.length > 1) {
            pipeline = createAggregatedQuery(query);
        } else {
            pipeline = createQuery(query);
        }

        console.log('Executing: db.collection(query.collection).aggregate(pipeline)');
        console.log('collection: ' + query.collection);
        console.log('Pipeline: \n' + formatjson(pipeline));

        db.collection(query.collection).aggregate(pipeline, function (err, result) {
            if (err === null) {
                res.status(200).send({ status: 200, payload: padMissingValues(query.startPeriod, query.endPeriod, query.granularity, result) });
            }
            else {
                res.status(404).send({ status: 404, error: err });
            }
            console.log('Error: ' + err);
            console.log('Result count: ' + (result ? result.length : 0));
        });

//        var path = '?metricId=' +  req.query.metricId + '&startPeriod=' + req.query.startPeriod;
//
//        if (req.query.endPeriod !== undefined) {
//            path += '&endPeriod=' + req.query.endPeriod;
//        }
//        if (req.query.granularity !== undefined) {
//            path += '&granularity=' + req.query.granularity;
//        }
//        if (req.query.origin !== undefined) {
//            path += '&origin=' + req.query.origin;
//        }
//        if (req.query.invocationType !== undefined) {
//            path += '&invocationType=' + req.query.invocationType;
//        }
//
//        var url = 'http://' + config.options.host + ':' + config.options.port + '/metric/' + path;
//
//        request.get({
//            url : url,
//            timeout : config.timeoutMillis
//        }, function(error, response, body) {
//            // NOTE: If we use the response object above for anything - it's
//            // massive. Look at it in detail and make sure you actually need it.
//            req.logger.debug('callback from get()');
//            if (error) {
//                req.logger.debug(errorMetricData + util.inspect(error, {depth: null}));
//                res.status(rdk.httpstatus.internal_server_error).rdkSend(error);
//            }
//        }).pipe(res);
    }
};

//function getKeyValue(obj) {
//    var property;
//    if (obj !== null) {
//        for (property in obj) {
//            if (property !== undefined) {
//                return property + ':' + obj[property];
//            }
//        }
//    }
//    return 'BAD OBJECT';
//}

// Config

/**
* @apiIgnore Not needed.
*/
module.exports.getConfig = function (req, res) {
    req.logger.debug('Metrics GET getConfig called');

    var url = 'http://' + config.options.host + ':' + config.options.port + '/metric/config/';

    request.get({
        url : url,
        timeout : config.timeoutMillis
    }, function(error, response, body) {
        req.logger.debug('callback from GET getConfig()');
        // NOTE: If we use the response object above for anything - it's
        // massive. Look at it in detail and make sure you actually need it.
        if (error) {
            req.logger.debug(errorMetricData + util.inspect(error, {depth: null}));
            res.status(rdk.httpstatus.internal_server_error).rdkSend(error);
        }
    }).pipe(res);
};

// DASHBOARD ....

/**
 * @api {get} /dashboards/:userId Get All Dashboards
 * @apiName GetDashboards
 * @apiGroup Dashboards
 * @apiDescription Gets a list of dashboards that were saved by an associated user. A dashboard is an object which contains settings
 * for charts which can be displayed visually. This list will only contain dashboard metadata, and will not store chart details. This is
 * useful for populating a selection list of dashboards.  To load an entire dashboard, see @GetDashboard
 * @apiParam {String} userId The id of the type of metric to be displayed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload Json object containing a list of all user dashboards
 * @apiSuccessExample {json} GetDashboards-Response:
 * {
 *  "payload": {
 *   "_id": "5554c5f4e17664dc31573ae9",
 *    "userId": "testuser",
 *    "name": "New Dashboard",
 *    "description": "This is a dashboard example",
 *    "dashboardSettings": {
 *      "startPeriod": 0,
 *      "endPeriod": 0,
 *      "periodSelected": false,
 *      "granularitySelected": false
 *    }
 *  }
 * }
 */
module.exports.getUserDashBoards = function (req, res) {
    req.logger.debug('Metrics GET getDashboards called');

    //TODO - get the authenticated user
//    var uid = req.param('userIdParam');         //TODO make this a header param
    //    var uid = req.session.user.username; //getKeyValue(req.session.user.duz);
//    if (req.query.userId !== undefined) {
//        uid = req.query.userId;
//    }

    var userId = req.param('userIdParam');
    if (userId === 'all') {
        db.collection('dashboards').find().toArray(function (err, result) {
        	if(err === null){
            	if(result === null){
            		res.status(404).send({ status: 404, error: notFoundError });
            	}
            	else{
            		res.status(200).send({ status: 200, payload: result });;
            	}
        	}
        	else{
        		res.status(404).send({ status: 404, error: err });
        	}
        });
    } else {
        db.collection('dashboards').find({userId: userId}).toArray(function (err, result) {
        	if(err === null){
            	if(result === null){
            		res.status(404).send({ status: 404, error: notFoundError });
            	}
            	else{
            		res.status(200).send({ status: 200, payload: result });;
            	}
        	}
        	else{
        		res.status(404).send({ status: 404, error: err });
        	}
        });
    }
};

/**
 * @api {get} /dashboard/:dashboardId Get Dashboard
 * @apiName GetDashboard
 * @apiGroup Dashboards
 * @apiDescription Gets a complete dashboard that was saved by an associated user.  A dashboard serves as a container for
 * visual information - collected metrics that can be displayed as a chart
 * @apiParam {String} dashboardId The id of the type of metric to be displayed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload Json object containing a list of all user dashboards
 * @apiSuccessExample {json} GetDashboard-Response
 * {
 * "_id": "5554c5f4e17664dc31573ae9",
 * "userId": "testuser",
 * "name": "New Dashboard",
 * "description": "This is a dashboard example",
 * "dashboardSettings": {
 *    "startPeriod": 1431534434120,
 *    "endPeriod": 1431620834120,
 *    "periodSelected": true,
 *    "granularitySelected": true,
 *     "period": "D1",
 *     "granularity": "H8",
 *     "hours": "1",
 *     "minutes": "00",
 *      "amPm": "AM"
 *  },
 *  "charts": [
 *    {
 *      "title": "Session Count Chart",
 *      "period": "D1",
 *      "startPeriod": 1431534434113,
 *      "endPeriod": 1431620834113,
 *      "granularity": "H8",
 *      "metricGroupId": "SessionCount",
 *      "selectedMetaDefinitions": [
 *        {
 *          "name": "SessionCount",
 *          "methodName": "avg",
 *          "definitionId": "1"
 *        },
 *        {
 *          "name": "SessionCount",
 *          "methodName": "count",
 *         "definitionId": "1"
 *        }
 *      ],
 *      "chartType": "COMBO",
 *      "liveUpdates": false,
 *      "hours": "1",
 *      "minutes": "00",
 *      "amPm": "AM"
 *    }
 *  ]
 *}
 */
module.exports.getDashBoard = function (req, res) {
    req.logger.debug('Metrics GET getDashboard called');

//    var msg = invalidDashboardParameters(req);
//    if (msg) {
//        res.status(rdk.httpstatus.bad_request).rdkSend(msg);
//    } else {

        var id = req.param('dashboardId');
        if(ObjectID.isValid(id) == false){
            res.status(400).send({status: 400, error: idParamErorr});
            return;
        }

        db.collection('dashboards').findOne({_id: new ObjectID(id)}, function (err, result) {
            if(err === null){
                if(result === null){
                    res.status(404).send({ status: 404, error: notFoundError });
                }
                else{
                    res.status(200).send({ status: 200, payload: result });;
                }
            }
            else{
                res.status(404).send({ status: 404, error: err });
            }
        });
//    }
};

/**
 * @api {post} /dashboard Create Dashboard
 * @apiName CreateDashboard
 * @apiGroup Dashboards
 * @apiDescription Creates a new dashboard.  Once a dashboard is created, it can be updated to have charts assigned to it.
 * @apiParam {Dashboard} PostBody dashbooard
 * @apiParamExample {json} Dashboard-Example:
 * {
 *     "userId": "testuser",
 *     "name": "New Dashboard",
 *     "description": "This is a dashboard example",
 * }
 * @apiSuccess (201) {json} payload the dashboard how it exists after it was initialized (id created) and persisted
 * @apiSuccessExample {json} CreateDashboard-Response
 *{
 *    "payload": [
 *        {
 *            "userId": "testuser",
 *            "name": "New Dashboard",
 *            "description": "This is a dashboard example",
 *            "_id": "5567648f4ecbd1dcf18df799"
 *        }
 *    ]
 *}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Message body cannot be empty and must contain valid JSON"
 *     }
 */
module.exports.createDashboard = function (req, res) {
    req.logger.debug('Metrics POST createDashboard called');

    var dashboard = req.body;
    if(dashboard === null || Object.keys(dashboard).length === 0){
    	res.status(400).send({status: 400, error: msgBodyError});
    	return;
    }

    db.collection('dashboards').insert(dashboard, function (err, result) {
    	if(err === null){
    		res.status(201).send({ status: 201, payload: result });;
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @api {put} /dashboard/:dashboardId Update Dashboard
 * @apiName UpdateDashboard
 * @apiGroup Dashboards
 * @apiDescription Updates an existing dashboard
 * @apiParam {String} dashboardId the id of the dashboard to be updated
 * @apiParamExample {json} UpdateDashboard-PutBody
 * {
 * "_id": "5554c5f4e17664dc31573ae9",
 * "userId": "testuser",
 * "name": "New Dashboard",
 * "description": "This is a dashboard example",
 * "dashboardSettings": {
 *    "startPeriod": 1431534434120,
 *    "endPeriod": 1431620834120,
 *    "periodSelected": true,
 *    "granularitySelected": true,
 *     "period": "D1",
 *     "granularity": "H8",
 *     "hours": "1",
 *     "minutes": "00",
 *      "amPm": "AM"
 *  },
 *  "charts": [
 *    {
 *      "title": "Session Count Chart",
 *      "period": "D1",
 *      "startPeriod": 1431534434113,
 *      "endPeriod": 1431620834113,
 *      "granularity": "H8",
 *      "metricGroupId": "SessionCount",
 *      "selectedMetaDefinitions": [
 *        {
 *          "name": "SessionCount",
 *          "methodName": "avg",
 *          "definitionId": "1"
 *        },
 *        {
 *          "name": "SessionCount",
 *          "methodName": "count",
 *         "definitionId": "1"
 *        }
 *      ],
 *      "chartType": "COMBO",
 *      "liveUpdates": false,
 *      "hours": "1",
 *      "minutes": "00",
 *      "amPm": "AM"
 *    }
 *  ]
 *}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Message body cannot be empty and must contain valid JSON"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload the integer value of 1
 * @apiSuccessExample {json} UpdateDashboard-Response
 * {
 *  "payload":1
 * }
 */
module.exports.updateDashboard = function (req, res) {
    req.logger.debug('Metrics PUT updateDashboard called');

    var id = req.param('dashboardId');
    if(ObjectID.isValid(id) == false){
    	res.status(400).send({status: 400, error: idParamErorr});
    	return;
    }

    var dashboard = req.body;
    if(dashboard === null || Object.keys(dashboard).length === 0 || IsJsonString(dashboard)){
    	res.status(400).send({status: 400, error: msgBodyError});
    	return;
    }

    delete dashboard._id;
    db.collection('dashboards').update({_id: ObjectID(id)}, dashboard, {}, function (err, result) {
    	if(err === null){
        	if(result === null || result === 0){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @api {delete} /dashboard:dashboardId Delete Dashboard
 * @apiName DeleteDashboard
 * @apiGroup Dashboards
 * @apiDescription Deletes a dashboard
 * @apiParam {String} dashboardId The id of the dashboard to be deleted
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload An integer value of 1
 * @apiSuccessExample {json} DeleteDashboard-Response
 * {
 *  "payload":1
 * }
 */
module.exports.deleteDashboard = function (req, res) {
    req.logger.debug('Metrics DELETE deleteDashboard called');

//    var dashboardId = req.param('dashboardId');
//
//    var msg = invalidDashboardParameters(req);
//    if (msg) {
//        res.status(rdk.httpstatus.bad_request).rdkSend(msg);
//
//    } else {

        var id = req.param('dashboardId');
        if(ObjectID.isValid(id) == false){
            res.status(400).send({status: 400, error: idParamErorr});
            return;
        }

        db.collection('dashboards').remove({_id: new ObjectID(id)}, function (err, result) {
            if(err === null){
                if(result === null || result === 0){
                    res.status(404).send({ status: 404, error: notFoundError });
                }
                else{
                    res.status(200).send({ status: 200, payload: result });;
                }
            }
            else{
                res.status(404).send({ status: 404, error: err });
            }
        });
};

// GROUPS ...

/**
 * @api {get} /groups Get Groups
 * @apiName GetGroups
 * @apiGroup Groups
 * @apiDescription Gets a list of metric groups.  Groups functions are for convenience. Metric clients can choose
 * how to use these groups, if at all
 * @apiSuccess {json} payload Json object containing a list of all groups
 * @apiSuccessExample {json} GetGroups-Response
 * {
 * "payload": [
 *    {
 *      "_id": "54d46c139bb12bc802bb92cc",
 *      "name": "All Metrics",
 *      "description": "A list of all metric definitions currently available",
 *      "metricList": [
 *        "SessionCount",
 *        "Execution_Begin",
 *        "Invocation_Begin",
 *        "Summary_Total"
 *      ]
 *    }
 *  ]
 *}
 */
module.exports.getMetricGroups = function (req, res) {
    req.logger.debug('Metrics GET getMetricGroups called');

    db.collection('groups').find().toArray(function (err, result) {
    	if(err === null){
        	if(result === null){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @api {post} /groups Create Group
 * @apiName CreateGroups
 * @apiGroup Groups
 * @apiDescription Creates a new metric group
 * @apiParamExample {json} CreateGroup-PostBody
 *{
 *  "name": "test Metrics group",
 *  "description": "This group contains test metrics",
 *              "metricList": [
 *                "SessionCount",
 *                "Execution_Begin",
 *                "Invocation_Begin",
 *                "Summary_Total"
 *            ]
 *}
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Message body cannot be empty and must contain valid JSON"
 *     }
 * @apiSuccess (201) {json} payload the group how it exists after it gets initialized (id created) and persisted
 * @apiSuccessExample {json} CreateGroup-Response
 *{
 *    "payload": [
 *        {
 *            "name": "test Metrics group",
 *            "description": "This group contains test metrics",
 *            "metricList": [
 *                "SessionCount",
 *                "Execution_Begin",
 *                "Invocation_Begin",
 *                "Summary_Total"
 *            ],
 *            "_id": "556763204ecbd1dcf18df798"
 *        }
 *    ]
 *}
 */
module.exports.createMetricGroup = function (req, res) {
    req.logger.debug('Metrics POST createMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.vistaKeys[]

    var group = req.body;
    if(group === null || Object.keys(group).length === 0){
    	res.status(400).send({error: msgBodyError});
    	return;
    }

    db.collection('groups').insert(group, function (err, result) {
    	if(err === null){
        	if(result === null){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(201).send({ status: 201, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @apiIgnore 1) this is an admin function 2) the implementation is missing on CDSInvocation 3) as a workaround a group can be deleted and recreated
 * @api {post} /groups Update Group
 * @apiName UpdateGroups
 * @apiGroup Groups
 * @apiDescription Updates a metric group
 * @apiParamExample {json} UpdateGroup-PostBody
 * {
 *  "_id": 4
 *  "name": "Example Group",
 *  "description": "This is an example group",
 *  "metricList": [
 *    "0",
 *    "1",
 *    "2"
 *  ]
 * }
 * @apiError (400) ErrorMessage bad request
 * @apiError (404) ErrorMessage not found
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Message body cannot be empty and must contain valid JSON"
 *     }
 * @apiSuccess {json} payload Json object containing a list of all groups
 * @apiSuccess {json} payload the integer value of 1
 * @apiSuccessExample {json} UpdateGroup-Response
 * {
 *  "payload":1
 * }
 */
module.exports.updateMetricGroup = function (req, res) {
    req.logger.debug('Metrics POST createMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.???

//    content = req.body;
//    var url = 'http://' + config.options.host + ':' + config.options.port + '/metric/groups/' + req.param('metricGroupId');
//
//    request.put({
//        url : url,
//        timeout : config.timeoutMillis,
//        json : content
//    }, function(error, response, body) {
//        req.logger.debug('callback from PUT createMetricGroup()');
//        if (error) {
//            // there was an error calling the invocationserver
//            req.logger.debug(errorMetricData + util.inspect(error, {depth: null}));
//            res.status(rdk.httpstatus.internal_server_error).rdkSend(error);
//        }
//    }).pipe(res);
};

/**
 * @api {delete} /groups/:metricGroupId Delete Group
 * @apiName DeleteGroup
 * @apiGroup Groups
 * @apiDescription Delete Group
 * @apiParam {String} metricGroupId the id of the group to be deleted
 * @apiError (400) ErrorMessage bad request
 * @apiError (404) ErrorMessage not found
 * @apiSuccess {json} payload An integer value of 1
 * @apiSuccessExample {json} DeleteGroup-Response
 * {
 *  "payload":1
 * }
 */
module.exports.deleteMetricGroup = function (req, res) {
    req.logger.debug('Metrics DELETE deleteMetricGroup called');

    //TODO:  ADMIN FUNCTION ONLY - check user using auth
    // req.session.user.???

    var id = req.param('metricGroupId');
    if(ObjectID.isValid(id) == false){
    	res.status(400).send({status: 400, error: idParamErorr});
    	return;
    }

    id = new ObjectID(id);
    db.collection('groups').remove({_id: id}, function (err, result) {
    	if(err === null){
        	if(result === null || result === 0){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

// DEFINITIONS ...

/**
 * @api {get} /definitions Get Definitions
 * @apiName GetDefinitions
 * @apiGroup Definitions
 * @apiDescription Returns a static list of the metrics that are supported by this service, along with additional clarifying information,
 * including a description of that metric and the attributes of the type of charts that it can support. The reason they are
 * static is because unique, back end logic must be written to capture and process each metric
 * @apiSuccess {json} payload Json object containing a list of all metric definitions
 * @apiSuccessExample {json} GetDefinitions-Response
 * {
 *  "payload": [
 *    {
 *      "_id": "8",
 *      "name": "Summary_Total",
 *      "description": "Summary, total timings report.",
 *      "unitOfMeasure": "Count",
 *      "updateInterval": 15000,
 *      "aggregation": [
 *        "count",
 *        "min",
 *        "max",
 *        "avg",
 *        "sum"
 *      ],
 *      "origins": [
 *        "EngineOne",
 *        "SystemB"
 *      ],
 *      "invocationTypes": [
 *        "Direct",
 *        "Background"
 *      ],
 *      "type": "invoke",
 *      "event": "summary",
 *      "property": "timings.total",
 *      "collection": "metrics"
 *    }
 *  ]
 *}
 */
module.exports.getMetricDefinitions = function (req, res) {
    req.logger.debug('Metrics GET getMetricDefinitions called');

    db.collection('definitions').find().toArray(function (err, result) {
    	if(err === null){
        	if(result === null){
                req.logger.debug({ status: 404, error: notFoundError });
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
                req.logger.debug({ status: 200, payload: result });
        		res.status(200).send({ status: 200, payload: result });
        	}
    	}
    	else{
            req.logger.debug({ status: 404, error: err });
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @apiIgnore - TODO - restrict method access to some sort of admin role
 * @api {get} /definitions Create Definition
 * @apiName CreateDefinitions
 * @apiGroup Definitions
 * @apiDescription TODO - restrict this method to an admin role
 * @apiSuccess (201) {json} payload the genereated id of the new definition
 * @apiSuccessExample {json} CreateDefinition-Response
 * {
 *  "payload":<new_definition_id>
 * }
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 */
module.exports.createMetricDefinitions = function (req, res) {
    req.logger.debug('Metrics POST createDefinition called');

    var metDef = req.body;
    if(metDef === null || Object.keys(metDef).length === 0){
    	res.status(400).send({status: 400, error: msgBodyError});
    	return;
    }

    db.collection('definitions').insert(metDef, function (err, result) {
    	if(err === null){
    		res.status(201).send({ status: 201, payload: result });
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @apiIgnore - TODO - restrict method access to some sort of admin role
 * @api {get} /definitions Delete Definition
 * @apiName DeleteDefinitions
 * @apiGroup Definitions
 * @apiDescription TODO - restrict this method to an admin role
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload 1
 * @apiSuccessExample {json} CreateDefinition-Response
 * {
 *  "payload": 1
 * }
 */
module.exports.deleteMetricDefinition = function (req, res) {
    req.logger.debug('Metrics POST deleteDefinition called');

    //TODO - standardize the way IDs are used for definitions
    var id = req.param('definitionId');
    if(ObjectID.isValid(id) == false){
    	res.status(400).send({status: 400, error: idParamErorr});
    	return;
    }

    id = new ObjectID(id);
    db.collection('definitions').remove({_id: id}, function (err, result) {
    	if(err === null){
        	if(result === null || result === 0){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};


// ROLES ...

/**
 * @api {get} /roles Get Roles
 * @apiName GetRoles
 * @apiGroup Roles
 * @apiDescription Gets a list of roles
 * @apiSuccess {json} payload Json object containing a list of all roles
 * @apiSuccessExample {json} GetRoles-Response
 * {
 *  "payload": [
 *    {
 *      "_id": "8",
 *      "name": "Admin",
 *      "description": "Admin has unrestricted privilege"
 *    }
 *  ]
 * }
 */
module.exports.getRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    db.collection('roles').find().toArray(function (err, result) {
    	if(err === null){
        	if(result === null){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @apiIgnore Has not been fully scoped and implemented
 * @api {post} /roles Update Role
 * @apiName UpdateRoles
 * @apiGroup Roles
 * @apiDescription Gets a list of roles supported by this system
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiParamExample
 * {
 *  "payload": [
 *    {
 *      "_id": "8",
 *      "name": "Admin",
 *      "description": "Admin has unrestricted privilege"
 *    }
 *  ]
 * }
 */
module.exports.updateRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    //TODO - CDS Invocation did not have an updateRoles method, this method appears to insert a list of roles instead.
    //This will need to be tested if a requirement for dashboard roles emerges
    var roles = req.body;
    if(roles === null || Object.keys(roles).length === 0){
    	res.status(400).send({status: 400, error: msgBodyError});
    	return;
    }

    db.collection('roles').insert(roles, function(err, result) {
    	if(err === null){
    		res.status(201).send({ status: 201, payload: result });;
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

// USER ROLES ...

/**
 * @apiIgnore Has not been fully scoped and implemented
 * @api {get} /userRoles/:userId Get Roles
 * @apiName GetUserRoles
 * @apiGroup UserRoles
 * @apiDescription Gets a list of roles associated to a particular user
 * @apiParam {String} userId The id of the type of metric to be displayed
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 */
module.exports.getUserRoles = function (req, res) {
    req.logger.debug('Metrics GET getRoles called');

    //TODO - this method will also need to be tested / examined more closely should requirements for user based roles emerge

    var id = req.param('userId');
    db.collection('userRoles').findOne({userId : id}, function (err, result) {
    	if(err === null){
        	if(result === null){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

/**
 * @apiIgnore Has not been fully scoped and implemented
 * @api {post} /userRoles Update Roles
 * @apiName GetUserRoles
 * @apiGroup UserRoles
 * @apiDescription Updates roles associated with a user
 *     HTTP/1.1 400 Bad Request
 *     {
 *       "error": "Argument passed in must be a single String of 12 bytes or a string of 24 hex characters"
 *     }
 * @apiErrorExample {json} Error-Response:
 *     HTTP/1.1 404 Not Found
 *     {
 *       "error": "Not Found"
 *     }
 * @apiSuccess {json} payload Json object containing a list of all roles
 */
module.exports.updateUserRoles = function (req, res) {
    req.logger.debug('Metrics GET updateRoles called');

    // var id = req.param('userId');

    //TODO - this method will also need to be tested / examined more closely should requirements for user based roles emerge    var userRole = req.body;
    if(userRole === null || Object.keys(userRole).length === 0){
    	res.status(400).send({status: 400, error: 'Message body cannot be empty and must contain valid JSON'});
    	return;
    }

    db.collection('userRoles').update({userId: userRole.userId}, userRole, {upsert:true}, function(err, result) {
    	if(err === null){
        	if(result === null){
        		res.status(404).send({ status: 404, error: notFoundError });
        	}
        	else{
        		res.status(200).send({ status: 200, payload: result });;
        	}
    	}
    	else{
    		res.status(404).send({ status: 404, error: err });
    	}
    });
};

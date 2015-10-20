// engine.js
/*jslint node: true */
'use strict';

//set up the packages we need
var rdk = require('../../core/rdk');
//var bodyParser = require('body-parser');
// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Engine;
// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':'  + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});
var ObjectId = require('mongoskin').ObjectID;
var engCollection = cfg.collection;

var apiDocs = {};
apiDocs.get = {
    spec: {
        summary: 'Engine Registry resource',
        notes: 'Get engine registry',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of engine registry', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.post = {
    spec: {
        summary: 'Engine Registry resource',
        notes: 'Create an engine registry',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of engine registry', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.put = {
    spec: {
        summary: 'Engine Registry resource',
        notes: 'Update an engine registry(s)',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of engine registry', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.delete = {
    spec: {
        summary: 'Engine Registry resource',
        notes: 'Delete an excution request',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'id of engine registry', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of engine registry', // description
                'string', // type
                false // required
            )
        ]
    }
};

db.open(function (err) {
    if (!err) {
        console.log('Connected to \'' + cfg.dbname + '\' database');
    } else {
        console.error('ERROR connecting to \'' + cfg.dbname + '\' database' + ' Error was: ' + err);
    }
});

function testId(id) {
    var msg = null;
    var oid = null;
    try {
        oid = new ObjectId(id);
    } catch (err) {
        msg = err.message;
    }
    return msg;
}

/*
 * Return a named engine
 */
/**
 * @api {get} /engine/registry Request CDS Engine by name, id, filter
 *
 * @apiName getCDSEngine
 * @apiGroup CDS Engine
 *
 * @apiParam {String} [name] Engine name
 * @apiParam {String} [id] 24 digit HEX number doc id
 * @apiParam {json} [filter] A mongo db match specification, i.e. {"name":"engineOne", "type": "OpenCDS","environment.cpus":8}
 *
 * @apiSuccess (Success 200) {json[]} payload A CDSEngine array
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
    {
    "payload": [
        {
            "_id": "555f4edee2d9eceab4e53ec8",
            "name": "engineOne",
            "description": "engine one registry entry",
            "class": "com.cognitive.cds.invocation.model.EngineInfo",
            "type": "OpenCDS",
            "version": "2.0.5",
            "intent_sets": [],
            "environment": {
                "url": "http://10.2.2.48:8080/opencds-decision-support-service",
                "memory": 32,
                "cpus": 8,
                "java_version": 7,
                "webservice": "tomcat",
                "webservice_version": 7
            }
        }
    ]
    }
 *
 * @apiError (Error 404) payload The entry for id, name, filter not located
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "payload": null
 * }
 *
 */
module.exports.getCDSEngine = function (req, res) {
    req.logger.debug('CDS Engine Registry getCDSEngine called');
    //app.get('/engine/registry', function (req, res) {

    var id = null;
    var name = null;
    var filter = null;
    var sts = rdk.httpstatus.ok; //200;
    var msg = '';
    var match = {};

    if (req.query.name) {
        name = req.query.name;
    }
    if (req.query.id) {
        id = req.query.id;
        msg = testId(id);
        if (msg) {
            res.status(rdk.httpstatus.bad_request).rdkSend(msg);
            return;
        }
    }
    if (req.query.filter) {
        filter = req.query.filter;
    }

    if (id) {
        match._id = new ObjectId(id);
    } else if (name && name !== '*') {
        match.name = name;
    }
    if (filter) {   // Supports a mongo match object
        msg = null;
        try {
            match = JSON.parse(filter);
        } catch (err) {
            msg = err.message;
            res.status(rdk.httpstatus.bad_request).rdkSend({error: msg});
            return;
        }
    }
    db.collection(engCollection).find(match).toArray(function (err, result) {
        var msg = (err === null) ? result : { error: err };
        if (err === null && result.length === 0) {
            sts = rdk.httpstatus.not_found;
        }
        res.status(sts).rdkSend(msg);
    });
};

/*
 * Store engine
 */
/**
 * @api {post} /engine/registry Create CDS Engine registry entry
 *
 * @apiName postCDSEngine
 * @apiGroup CDS Engine
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content CDS Engine registry entry requires a name field
 *
 * @apiSuccess (Success 201) {json} payload Engine JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
    {
    "payload": [
        {
            "name": "engineOne",
            "description": "engine one registry entry",
            "class": "com.cognitive.cds.invocation.model.EngineInfo",
            "type": "OpenCDS",
            "version": "2.0.5",
            "intent_sets": [],
            "environment": {
                "url": "http://10.2.2.47:8080/opencds-decision-support-service",
                "memory": 32,
                "cpus": 8,
                "java_version": 7,
                "webservice": "tomcat",
                "webservice_version": 7
            },
            "_id": "555f4edee2d9eceab4e53ec8"
        }
    ]
    }
 *
 * @apiError (Error 400) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *     "error": "Missing required CDS engine registry entry name"
 * }
 * @apiError (Error 409) {json} error CDS Engine registry entry name exists
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *     "error": "CDS Engine registry entry exists, can not be created"
 * }
 *
 */
module.exports.postCDSEngine = function (req, res) {
    req.logger.debug('Engine Registry postCDSEngine called');
    //app.post('/engine/registry', function (req, res) {

    var sts = rdk.httpstatus.created;
    var msg = '';
    var engine = req.body;

    if (!engine || !engine.name) {     // What other properties should be validated???
        res.status(rdk.httpstatus.bad_request).rdkSend({error: 'Missing required CDS engine name'});
    } else {
        db.collection(engCollection).find({name: engine.name}).toArray(function (err, result) {
            if (!err && result.length > 0) {
                msg = 'CDS engine descriptor exists, can not be created';
                res.status(409).rdkSend({error: msg});
            } else {
                db.collection(engCollection).insert(engine, function(err, result) {
                    msg = (err === null) ? result : { error: err };
                    if (err) {
                        sts = rdk.httpstatus.bad_request;
                    }
                    res.status(sts).rdkSend(msg);
                });
            }
        });
    }
};

/*
 * update engine
 */
/**
 * @api {put} /engine/registry Modify CDS Engine registry entry
 *
 * @apiName putCDSEngine
 * @apiGroup CDS Engine
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Engine object
 *
 * @apiSuccess (Success 200) {json} payload update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Success
   {
    "payload": 1
   }
 *
 * @apiError (Error 400) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "error": "Missing required CDS engine name"
 * }
 * @apiError (Error 404) {json} error not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "error": "CDS Engine registry entry not found"
 * }
 */
module.exports.putCDSEngine = function (req, res) {
    req.logger.debug('Engine Registry putCDSEngine called');
    //app.put('/engine/registry', function (req, res) {

    var sts = rdk.httpstatus.ok;
    var msg = '';
    var engine = req.body;

    if (!engine || !engine.name) {
        res.status(rdk.httpstatus.bad_request).rdkSend({error: 'Missing required CDS Engine registration name'});
    } else {
        db.collection(engCollection).find({name: engine.name}).toArray(function(err, result) {
            if (err || result.length === 0) {
                res.status(rdk.httpstatus.not_found).rdkSend({error: 'CDS Engine registry entry not found'});
            } else {
                delete engine._id;
                db.collection(engCollection).update({name: engine.name}, engine, function (err, result) {
                    msg = (err === null) ? result : { error: err };
                    if (err) {
                        sts = rdk.httpstatus.bad_request;
                    }
                    res.status(sts).rdkSend(msg);
                });
            }
        });
    }
};

/*
 * Delete a engine
 */
/**
 * @api {delete} /engine/registry Delete CDS Engine registry entry by name or id
 *
 * @apiName deleteCDSEngine
 * @apiGroup CDS Engine
 *
 * @apiParam {String} [name] CDS engine name
 * @apiParam {Number} [id] 24 digit HEX number doc id
 *
 * @apiSuccess (Success 200) {Number} payload Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "payload": 1
 * }
 *
 * @apiError (Error 404) {Number} payload The specified engine entry was not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *     "payload": 0
 * }
 *
 */
module.exports.deleteCDSEngine = function (req, res) {
    req.logger.debug('Engine Registry deleteCDSEngine called');
    //app.delete('/engine/registry', function (req, res) {

    var sts = rdk.httpstatus.ok;
    var id = null;
    var name = null;
    var match = {};
    var msg = null;
    if (req.query.name) {
        name = req.query.name;
    }
    if (req.query.id) {
        id = req.query.id;
    }
    if (id) {
        msg = testId(id);
        if (!msg) {
            match._id = new ObjectId(id);
        } else {
            res.status(rdk.httpstatus.bad_request).rdkSend({error: msg});
            return;
        }
    } else if (name) {
        match.name = name;
    } else {
        res.status(rdk.httpstatus.bad_request).rdkSend({error: 'Either id or name parameter required'});
        return;
    }

    db.collection(engCollection).remove(match, function (err, result) {
        var msg = (err === null) ? result : { error: err };
        if (result === 0) {
            sts = rdk.httpstatus.not_found;
        }
        res.status(sts).rdkSend(msg);
    });
};
module.exports.apiDocs = apiDocs;

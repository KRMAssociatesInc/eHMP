// cdsexecute.js
/*jslint node: true */
/* jshint -W098 */
'use strict';

// set up the packages we need
var rdk = require('../../core/rdk');
// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.ExecuteRequest;
// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':'  + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});
var ObjectId = require('mongoskin').ObjectID;
var exereq = cfg.collection;

var apiDocs = {};
apiDocs.get = {
        spec: {
        summary: 'Execution Request resource',
        notes: 'Get execution request(s)',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of execution request', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.post = {
    spec: {
        summary: 'Execution Request resource',
        notes: 'Create an execution request',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of execution request', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.put = {
    spec: {
        summary: 'Execution Request resource',
        notes: 'Update an execution request',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of execution request', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.delete = {
    spec: {
        summary: 'Execution Request resource',
        notes: 'Delete an excution request',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'id of execution request', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of execution request', // description
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

// Execution Request

/*
 * Return a named request
 */
/**
 * @api {get} /execute/request[?name=name] Request CDS Job by name
 *
 * @apiName getCDSJob
 * @apiGroup CDS Scheduler
 *
 * @apiParam {String} name Request name
 * @apiParam {String} . Return all CDSjobs
 *
 * @apiSuccess (Success 200) {json[]} data A Request array
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": [
        {
            "_id": "551b4735c6d44fe18c9f14a9",
            "description": "The Descripiton",
            "execution": {
                "baseContext": {
                    "location": {
                        "codeSystem": null,
                        "entityType": "Location",
                        "id": "LocationId",
                        "name": "LocationName",
                        "type": "Clinic"
                    },
                    "specialty": {
                        "codeSystem": null,
                        "entityType": "Specialty",
                        "id": "SpecId",
                        "name": "SpecName",
                        "type": "Department"
                    },
                    "subject": null,
                    "user": {
                        "codeSystem": null,
                        "entityType": "User",
                        "id": "UserId",
                        "name": "TheUser",
                        "type": "Provider"
                    }
                },
                "subjectIds": [
                    "Patient:Id1",
                    "Patient:Id2",
                    "Patient:Id3"
                ],
                "subjectListReferences": [
                    {
                        "id": "ListId1",
                        "type": "Patient"
                    },
                    {
                        "id": "ListId2",
                        "type": "Patient"
                    }
                ],
                "target": {
                    "intentsSet": [
                        "Intent1",
                        "Intent2"
                    ],
                    "mode": "Normal",
                    "perceivedExecutionTime": null,
                    "supplementalMappings": [
                        {
                            "dataFormat": "FHIR",
                            "dataQueries": [
                                "http://www.rdk.gov/fhir/resource?id=\"{$Subject.Id}\""
                            ],
                            "engineName": "Engine1",
                            "rules": [
                                {
                                    "id": "Engine1-RuleId22",
                                    "properties": {
                                        "AProperty": "SomeValue"
                                    }
                                },
                                {
                                    "id": "Engine1-RuleId34",
                                    "properties": null
                                }
                            ]
                        }
                    ],
                    "type": "Background"
                }
            },
            "lastExecutionResult": null,
            "lastRun": 1443989700000,
            "name": "JobName",
            "owner": {
                "codeSystem": null,
                "entityType": "User",
                "id": "JobOwnerId",
                "name": "TheJobOwner",
                "type": "Administrator"
            }
        }
 *     ]
 * }
 *
 * @apiError (Error 404) data The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "data": null
 * }
 *
 */
module.exports.getCDSExecute = function (req, res) {
    req.logger.debug('ExecutionRequest getCDSExecution called');
    //app.get('/schedule/cdsjob/:name', function (req, res) {

    var sts = rdk.httpstatus.ok; //200;
    var msg = '';
    var match = {};
    var name = null;
    if (req.query && req.query.name) {
        name = req.query.name;
        if (!testId(name)) {
            match._id = new ObjectId(name);
        } else {
            match.name = name;
        }
    }

    db.collection(exereq).find(match).toArray(function (err, result) {
        var msg = (err === null) ? result : { error: err };
        if (err === null && result.length === 0) {
            sts = rdk.httpstatus.not_found;
        }
        res.status(sts).rdkSend(msg);
    });
};

/*
 * Store ExecutionRequest
 */
/**
 * @api {post} /execute/request Create ExecutionRequest Job
 *
 * @apiName postCDSJob
 * @apiGroup CDS Scheduler
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content CDS Job object requires a name: field
 *
 * @apiSuccess (Success 201) {json} data Job JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
{
    "data": [
        {
            "description": "The Descripiton",
            "execution": {
                "baseContext": {
                    "location": {
                        "codeSystem": null,
                        "entityType": "Location",
                        "id": "LocationId",
                        "name": "LocationName",
                        "type": "Clinic"
                    },
                    "specialty": {
                        "codeSystem": null,
                        "entityType": "Specialty",
                        "id": "SpecId",
                        "name": "SpecName",
                        "type": "Department"
                    },
                    "subject": null,
                    "user": {
                        "codeSystem": null,
                        "entityType": "User",
                        "id": "UserId",
                        "name": "TheUser",
                        "type": "Provider"
                    }
                },
                "subjectIds": [
                    "Patient:Id1",
                    "Patient:Id2",
                    "Patient:Id3"
                ],
                "subjectListReferences": [
                    {
                        "id": "ListId1",
                        "type": "Patient"
                    },
                    {
                        "id": "ListId2",
                        "type": "Patient"
                    }
                ],
                "target": {
                    "intentsSet": [
                        "Intent1",
                        "Intent2"
                    ],
                    "mode": "Normal",
                    "perceivedExecutionTime": null,
                    "supplementalMappings": [
                        {
                            "dataFormat": "FHIR",
                            "dataQueries": [
                                "http://www.rdk.gov/fhir/resource?id=\"{$Subject.Id}\""
                            ],
                            "engineName": "Engine1",
                            "rules": [
                                {
                                    "id": "Engine1-RuleId22",
                                    "properties": {
                                        "AProperty": "SomeValue"
                                    }
                                },
                                {
                                    "id": "Engine1-RuleId34",
                                    "properties": null
                                }
                            ]
                        }
                    ],
                    "type": "Background"
                }
            },
            "lastExecutionResult": null,
            "lastRun": 1443989700000,
            "name": "JobName2",
            "owner": {
                "codeSystem": null,
                "entityType": "User",
                "id": "JobOwnerId",
                "name": "TheJobOwner",
                "type": "Administrator"
            },
            "_id": "551d9319558b4790c93d5c77"
        }
    ]
}
 *
 * @apiError (Error 400) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *     "error": "Missing required name"
 * }
 * @apiError (Error 409) {json} error name exists
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *     "error": "CDS ExecutionRequest document 'Name' exists, can not be created"
 * }
 *
 */
module.exports.postCDSExecute = function (req, res) {
    req.logger.debug('ExecutionRequest postCDSExecution called');
    //app.post('/schedule/cdsjob', function (req, res) {

    var sts = rdk.httpstatus.created; //201;
    var msg = '';
    var job = req.body;

    if (!job || !job.name) {
        res.status(rdk.httpstatus.bad_request).rdkSend({error: 'Missing required Request name'});
    } else {
        db.collection(exereq).find({name: job.name}).toArray(function (err, result) {
            if (!err && result.length > 0) {
                res.status(rdk.httpstatus.conflict).rdkSend({error: 'CDS ExecutionRequest document \'' + job.name + '\' exists, can not be created'});
            } else {
                db.collection(exereq).insert(job, function (err, result) {
                    var msg = (err === null) ? result : { error: err };
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
 * update ExecutionRequest
 */
/**
 * @api {put} /execute/request Modify CDS Job
 *
 * @apiName putCDSExecute
 * @apiGroup CDS Scheduler
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content ExecuteRequest object
 *
 * @apiSuccess (Success 200) {json} data update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Success
   {
    "data": 1
   }
 *
 * @apiError (Error 400) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "error": "Missing required CDS name"
 * }
 * @apiError (Error 404) {json} error not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "error": "CDS ExecutionRequest document 'Name' does not "
 * }
 */
module.exports.putCDSExecute = function (req, res) {
    req.logger.debug('ExecutionRequest putCDSExecution called');
    //app.put('/schedule/cdsjob', function (req, res) {

    var sts = rdk.httpstatus.ok; //200;
    var msg = '';
    var job = req.body;

    if (!job || !job.name) {
        res.status(rdk.httpstatus.bad_request).rdkSend({error: 'Missing required CDS Request name'});
    } else {
        db.collection(exereq).find({name: job.name}).toArray(function (err, result) {
            if (err || result.length === 0) {
                res.status(rdk.httpstatus.conflict).rdkSend('CDS ExecutionRequest document \'' + job.name + '\' does not found');
            } else {
                delete job._id;
                db.collection(exereq).update({name: job.name}, job, function (err, result) {
                    var msg = (err === null) ? result : { error: err };
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
 * Delete an ExecutionRequest
 */
/**
 * @api {delete} //execute/request?name=name Delete CDS Job with 'name' (may use ID)
 *
 * @apiName deleteCDSJob
 * @apiGroup CDS Scheduler
 *
 * @apiParam {String} name CDS ExecutionRequest name
 * @apiParam {Number} [id] 24 digit HEX number doc id
 *
 * @apiSuccess (Success 200) {Number} data Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 404) {Number} data The specified ExecutionRequest was not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *     "data": 0
 * }
 *
 */
module.exports.deleteCDSExecute = function (req, res) {
    req.logger.debug('Execution Request deleteCDSExecution called');
    //app.delete('/schedule/cdsjob/:name', function (req, res) {

    var sts = rdk.httpstatus.ok; //200;
    var match = {};
    var name = null;
    if (req.query && req.query.name) {
        name = req.query.name;
    }
    if (!testId(name)) {
        match._id = new ObjectId(name);
    } else {
        match.name = name;
    }

    db.collection(exereq).remove(match, function (err, result) {
        var msg = (err === null) ? result : { error: err };
        if (result === 0) {
            sts = rdk.httpstatus.not_found;
        }
        res.status(sts).rdkSend(msg);
    });
};
module.exports.apiDocs = apiDocs;

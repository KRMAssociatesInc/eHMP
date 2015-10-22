'use strict';

//set up the packages we need
var rdk = require('../../core/rdk');
//var express = require('express');
//var bodyParser = require('body-parser');
//var nullchecker = rdk.utils.nullchecker;

// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Criteria;
var col = cfg.collection;

//Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':' + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});
var ObjectId = require('mongoskin').ObjectID;

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

function computeMatch(req) {
    var match = {};
//    Criteria is not scoped
//    match.scope = 'private';
//    match.owner = req.session.user.username;

    if (req.query.id) {
        match._id = req.query.id;
    } else if (req.query.name) {
        match.name = req.query.name;
    }
    return match;
}

var apiDocs = {};
apiDocs.get = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', false),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of definition',  // description
                'string',  // type
                false  // required
            )

        ],
        responseMessages: []
    }
};
apiDocs.post = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
                     rdk.docs.swagger.paramTypes.body('Criteria', 'Criteria', '', undefined, true)
                 ],
        responseMessages: []
    }
};
apiDocs.delete = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', false),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of Criteria',  // description
                'string',  // type
                false  // required
            )
        ],
        responseMessages: []
    }
};

///////////
//Criteria
///////////

/**
 * Retrieve Criteria used in creating a Patient list Definition
 *
 * @api {get} /resource/cds/patient/criteria[?id=id|name=name] Request Criteria
 *
 * @apiName getCriteria
 * @apiGroup Patient Criteria
 *
 * @apiParam {Number} [id]  Criteria id (24 digit HEX number), id has precedence over name
 * @apiParam {String} [name] Criteria name (if id not used)
 * @apiParam {String} . Return all criteria
 *
 * @apiSuccess (Success 200) {json[]} data A Criteria returned if id or name specified or array of all Criteria
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": [
 *         {
 *             "_id": "54fe3f92fe06852d22659b0d",
 *             "name": "Blood Pressure",
 *             "accessor": "vital:items[]:qualifiedName",
 *             "datatype": "integer",
 *             "piece": "2:/"
 *         }
 *     ]
 * }
 * @apiError (Error 404) . Criteria not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message:Criteria not found
 * }
 *
 */
module.exports.getCriteria = function(req, res) {

    var sts = rdk.httpstatus.ok;
    var msg = '';

    var match = computeMatch(req);
    if (match._id === 'all') {
        match = {};
    } else if (match._id) {
        msg = testId(match._id);
        if (!msg) {
            match._id = new ObjectId(match._id);
        } else {
            sts = rdk.httpstatus.bad_request;
            res.status(sts).rdkSend(msg);
            return;
        }
    }
    if (match.name || match._id) {
        db.collection(col).findOne(match, function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err === null && result === null) {
                sts = rdk.httpstatus.not_found;
                msg = 'Criteria not found';
            }
            res.status(sts).rdkSend(msg);
        });
    } else { // return multiple
        db.collection(col).find(match).toArray(function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err === null && result.length === 0) {
                sts = rdk.httpstatus.not_found;
                msg = 'Criteria(s) not found';
            }
            res.status(sts).rdkSend(msg);
        });
    }
};

/**
 * Create Criteria used in creating a Patient list Definition
 *
 * @api {post} /resource/cds/patient/criteria Create Criteria
 *
 * @apiName postCriteria
 * @apiGroup Patient Criteria
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Criteria object
 *
 * @apiSuccess (Success 201) {json} data Criteria JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *     "data":
 *     {
 *         "_id": "54fe3f92fe06852d22659b0d",
 *         "name": "Blood Pressure",
 *         "accessor": "vital:items[]:qualifiedName",
 *         "datatype": "integer",
 *         "piece": "2:/"
 *     }
 * }
 * @apiError (Error 400) {json} error Criteria document (request body) must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Criteria document (request body) must be defined
 * }
 * @apiError (Error 400) {json} error Criteria document can not have _id defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Criteria document can not have _id defined
 * }
 * @apiError (Error 400) {json} error Criteria name must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Criteria name must be defined
 * }
 * @apiError (Error 409) {json} error Criteria 'name' exists, can not be created
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *    status: 409
 *    message: Criteria 'name' exists, can not be created
 * }
 * @apiError (Error 500) {json} error A system or database error message was returned
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    status: 500
 *    message: system or database error message
 * }
 *
 *
 */
// Post to CDSInvocation MongoDB app /cds-data/criteria.js
module.exports.postCriteria = function(req, res) {

    var sts = rdk.httpstatus.created;
    var msg = '';
    var doc = req.body;

    if (!doc) {
        sts = rdk.httpstatus.bad_request; //400
        msg = 'Criteria document (request body) must be defined';
        res.status(sts).rdkSend(msg);
    } else if (doc._id !== undefined) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Criteria document can not have _id defined';
        res.status(sts).rdkSend(msg);
    } else if (!doc.name) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Criteria name must be defined';
        res.status(sts).rdkSend(msg);
    } else { // Verify the definition does not already exist
        doc.date = new Date();
        var match = {name: doc.name, scope: doc.scope, owner: doc.owner};
        db.collection(col).findOne(match, function (err, result) {
            if (result) {
                sts = rdk.httpstatus.bad_request;
                msg = 'Criteria \'' + doc.name + '\' exists, can not be created';
                res.status(sts).rdkSend(msg);
            } else {
                db.collection(col).insert(doc, function (err, result) {
                    var msg = (err === null) ? { data: result } : { error: err };
                    if (err) {
                        sts = rdk.httpstatus.internal_server_error;
                    }
                    res.status(sts).rdkSend(msg);
                });
            }
        });
    }
};

/**
 * Delete Criteria used in creating a Patient list Definition
 *
 * @api {delete} /resource/cds/patient/criteria[?id=id|name=name] Delete Criteria
 *
 * @apiName deleteCriteria
 * @apiGroup Patient Criteria
 *
 * @apiParam {Number} [id] 24 digit HEX number doc id
 * @apiParam {String} [name] Criteria name (if id not used)
 *
 * @apiSuccess (Success 200) {Number} data Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 404) . Criteria not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message:Criteria not found
 * }
 * @apiError (Error 400) {json} error Name or Id required
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id required
 * }
 *
 */
module.exports.deleteCriteria = function(req, res) {

    var sts = rdk.httpstatus.ok;
    var msg = '';

    var match = computeMatch(req);
    if (match._id) {
        msg = testId(match._id);
        if (!msg) {
            match._id = new ObjectId(match._id);
        } else {
            sts = rdk.httpstatus.bad_request;
            res.status(sts).rdkSend(msg);
            return;
        }
    }
    if (match.name || match._id) {
        db.collection(col).remove(match, function (err, result) {
            var msg = (err === null) ? { data: result } : { error: err };
            if (err !== null || result === 0) {
                sts = rdk.httpstatus.not_found;
                msg = 'Criteria not found';
            }
            res.status(sts).rdkSend(msg);
        });
    } else {
        sts = rdk.httpstatus.bad_request;
        msg = 'Name or Id required';
        res.status(sts).rdkSend(msg);
    }
};

module.exports.apiDocs = apiDocs;

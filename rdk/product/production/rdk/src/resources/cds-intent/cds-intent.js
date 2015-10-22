/*jslint node: true */
'use strict';

var rdk = require('../../core/rdk');

// set up the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var nullchecker = rdk.utils.nullchecker;

// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Intent;

// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':' + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});

var app = express();
app.use(bodyParser.json());

db.open(function(err) {
    if (!err) {
        console.log('Connected to \'' + cfg.dbname + '\' database');
    } else {
        console.log('ERROR connecting to \'' + cfg.dbname + '\' database');
    }
});

var apiDocs = {};
apiDocs.get = {
    spec: {
        summary: 'Intent resource',
        notes: 'Get intents',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of intent', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scope', // name
                'scope of intent', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scopeId', // name
                'scopeId of intent', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.post = {
    spec: {
        summary: 'Intent resource',
        notes: 'Create an intent',
        parameters: []
    }
};
apiDocs.put = {
    spec: {
        summary: 'Intent resource',
        notes: 'Update an intent',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of intent', // description
                'string', // type
                true // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scope', // name
                'scope of intent', // description
                'string', // type
                true // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scopeId', // name
                'scopeId of intent', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.delete = {
    spec: {
        summary: 'Intent resource',
        notes: 'Delete an intent',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'name', // name
                'name of intent', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scope', // name
                'scope of intent', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'scopeId', // name
                'scopeId of intent', // description
                'string', // type
                false // required
            )
        ]
    }
};

// Intent

/**
 * @api {get} //intent/registry Get Intent
 * @apiName GetIntent
 * @apiGroup Intent
 * @apiParam {String} [name] Intent name
 * @apiParam {String} [scope] Intent Scope
 * @apiParam {String} scopeId Intent Scope Id
 * @apiDescription Returns the intent or intents that match the uri query parameters.  The values for "name"
 * and "scope" are required.  For ease of use, these can be wildcarded by passing in a '*'.  This way we can
 * use this method to either get a single entity or return a list of entities which might be useful for testing
 * or other future uses.
 * @apiExample {js} Example usage:
 * curl -i http://10.4.4.105:8888/resource/cds/intent/registry?name=FirstEngine&scope=Enterprise
 * @apiSuccess {json} payload Json object containing a list of all datapoint values for the given uri parameters.
 * @apiSuccessExample {json} GetIntent-Response
 * HTTP/1.1 200 OK
 * {
 *   "status": 200,
 *   "payload": [
 *        {
 *            "description": "A Mock Intent",
 *            "globalName": "Enterprise//FirstEngine",
 *            "governance": null,
 *            "id": "",
 *            "invocations": [
 *                {
 *                    "dataFormat": "application/json+fhir",
 *                    "dataQueries": null,
 *                    "engineName": "engineOne",
 *                    "name": null,
 *                    "rules": [
 *                        {
 *                            "id": "genderAgeRule",
 *                            "properties": {
 *                                "delay": "10"
 *                            }
 *                        }
 *                    ]
 *                }
 *            ],
 *            "name": "FirstEngine",
 *            "scope": "Enterprise",
 *            "scopeId": null,
 *            "_id": "5567576e258aab97051eb64a"
 *        }
 *    ]
 * }
 */
module.exports.getIntent = function(req, res) {

    var sts = rdk.httpstatus.ok;

    var name = req.query.name;
    var scope = req.query.scope;
    var scopeId = req.query.scopeId;

    var match = {};
    if (name !== '*') {
        match.name = name;
    }
    if (scope !== '*') {
        match.scope = scope;
    }
    if(nullchecker.isNotNullish(scopeId)) {
        if (scopeId !== '*') { //if it's not wildcard, use it.  if it is a wildcard, let them all match
            match.scopeId = scopeId;
        }
    } else {
        match.scopeId = null;
    }

    db.collection('cdsintent').find(match).toArray(function (err, result) {
        var msg = (err === null) ? result : err ;
        if (err === null && result.length === 0) {
            sts = rdk.httpstatus.not_found;
            res.status(sts).send({status: sts, error: msg});
        } else {
            res.status(sts).send({status: sts, payload: msg});
        }
    });
};


/**
 * @api {post} /intent/registry Create Intent
 * @apiName CreateIntent
 * @apiGroup Intent
 * @apiDescription Returns the intent or intents that match the uri query parameters.  The values for "name"
 * and "scope" are required.  For ease of use, these can be wildcarded by passing in a '*'.  This way we can
 * use this method to either get a single entity or return a list of entities which might be useful for testing
 * or other future uses.
 * @apiSuccess (Success 201) {json} json echo of the created intent
 * @apiSuccessExample {json} GetIntent-Response
 * {
 *   "status": 201,
 *   "payload": [
 *        {
 *            "description": "A Mock Intent",
 *            "globalName": "Enterprise//FirstEngine",
 *            "governance": null,
 *            "id": "",
 *            "invocations": [
 *                {
 *                    "dataFormat": "application/json+fhir",
 *                    "dataQueries": null,
 *                    "engineName": "engineOne",
 *                    "name": null,
 *                    "rules": [
 *                        {
 *                            "id": "genderAgeRule",
 *                            "properties": {
 *                                "delay": "10"
 *                            }
 *                        }
 *                    ]
 *                }
 *            ],
 *            "name": "FirstEngine",
 *            "scope": "Enterprise",
 *            "scopeId": null,
 *            "_id": "5567576e258aab97051eb64a"
 *        }
 *    ]
 * }
 * @apiError MissingIntentName
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Internal Server Error
 * {
 *    "status": 400,
 *    "error": "Missing required intent name"
 * }
 * @apiError MissingIntentScope
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Internal Server Error
 * {
 *    "status": 400,
 *    "error": "Missing required intent scope"
 * }
 * @apiError IntentExists
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Internal Server Error
 * {
 *    "status": 409,
 *    "error": "An intent with that name/scope/scopeId combination exists, can not be created"
 * }
 */
module.exports.postIntent = function(req, res) {

    var sts = rdk.httpstatus.created;
    var intent = req.body;

    if (!intent || !intent.name) {
    	res.status(rdk.httpstatus.bad_request).send({status: rdk.httpstatus.bad_request, error: 'Missing required intent name'});
    } else if (!intent || !intent.scope) {
        res.status(rdk.httpstatus.bad_request).send({status: rdk.httpstatus.bad_request, error: 'Missing required intent scope'});
    } else {

        var match = {};
        match.name = intent.name;
        match.scope = intent.scope;
        if(nullchecker.isNotNullish(intent.scopeId)) {
            match.scopeId = intent.scopeId;
        } else {
            match.scopeId = null;
        }

        db.collection('cdsintent').find(match).toArray(function(err, result) {
            if (!err && result.length > 0) {
                res.status(rdk.httpstatus.conflict).send({status: rdk.httpstatus.conflict, error: 'An intent with that name/scope/scopeId combination exists, can not be created'});
            }
            else {

                db.collection('cdsintent').insert(intent, function(err, result) {
                    var msg = (err === null) ? result : err ;
                    if (err === null && result.length === 0) {
                        sts = rdk.httpstatus.not_found;
                        res.status(sts).send({status: sts, error: msg});
                    } else {
                        res.status(sts).send({status: sts, payload: msg});
                    }
                });
            }
        });
    }
};


/**
 * @api {put} //intent/registry Put Intent
 * @apiName PutIntent
 * @apiGroup Intent
 * @apiParam {String} name Intent name
 * @apiParam {String} scope Intent Scope
 * @apiParam {String} [scopeId] Intent Scope Id
 * @apiDescription Updates the specified intent record.  Note:  The parameters must match any
 * specified in the document.  Those fields essentially form a primary key for this record,
 * and changing them is essentially a new record, and not an update.
 * @apiSuccess {json} payload Json object containing a number indicating the number of records updated.
 * @apiSuccessExample {json} PutIntent-Response
 * HTTP/1.1 200 OK
 * {
 *    "status": 200,
 *    "payload": 1
 * }
 * @apiError MissingIntentName
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Internal Server Error
 * {
 *    "status": 400,
 *    "error": "Missing required intent name"
 * }
 * @apiError MissingIntentScope
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Internal Server Error
 * {
 *    "status": 400,
 *    "error": "Missing required intent scope"
 * }
 * @apiError IntentDoesNotExist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Internal Server Error
 * {
 *    "status": 400,
 *    "error": "Intent does not exist"
 * }
 */
module.exports.putIntent = function(req, res) {

    var sts = rdk.httpstatus.ok;
    var intent = req.body;

    var name = req.query.name;
    var scope = req.query.scope;
    var scopeId = req.query.scopeId;

    if(nullchecker.isNullish(name)) {
        res.status(rdk.httpstatus.bad_request).send({status: rdk.httpstatus.bad_request, error: 'Missing required intent name'});
    } else if(nullchecker.isNullish(scope)) {
        res.status(rdk.httpstatus.bad_request).send({status: rdk.httpstatus.bad_request, error: 'Missing required intent scope'});
    } else {

        var match = {};
        match.name = name;
        match.scope = scope;
        if(nullchecker.isNotNullish(scopeId)) {
            match.scopeId = scopeId;
        } else {
            match.scopeId = null;
        }

        db.collection('cdsintent').find(match).toArray(function(err, result) {
            if (err || result.length === 0) {
                res.status(rdk.httpstatus.conflict).send({status: rdk.httpstatus.conflict, error: 'Intent does not exist'});
            }
            else {
                delete intent._id;
                db.collection('cdsintent').update(match, intent, function(err, result) {
                    var msg = (err === null) ? result : err ;
                    if (err === null && result.length === 0) {
                        sts = rdk.httpstatus.not_found;
                        res.status(sts).send({status: sts, error: msg});
                    } else {
                        res.status(sts).send({status: sts, payload: msg});
                    }
                });
            }
        });
    }
};


/**
 * @api {delete} //intent/registry Delete Intent
 * @apiName DeleteIntent
 * @apiGroup Intent
 * @apiParam {String} [name] Intent name
 * @apiParam {String} [scope] Intent Scope
 * @apiParam {String} [scopeId] Intent Scope Id
 * @apiDescription Deletes the specified intent record.  Note:  The parameters must match any
 * specified in the document.  Those fields essentially form a primary key for this record, and changing
 * them is essentially a new record, and not an update.
 * @apiSuccess {json} payload Json object containing a number indicating the number of records updated.
 * @apiSuccessExample {json} DeleteIntent-Response
 * HTTP/1.1 200 OK
 * {
 *    "status": 200,
 *    "payload": 1
 * }
 */
module.exports.deleteIntent= function(req, res) {

    var sts = rdk.httpstatus.ok;
    var name = req.query.name;
    var scope = req.query.scope;
    var scopeId = req.query.scopeId;

    var match = {};
    match.name = name;
    match.scope = scope;
    if(nullchecker.isNotNullish(scopeId)) {
        match.scopeId = scopeId;
    } else {
        match.scopeId = null;
    }

    db.collection('cdsintent').remove(match, function (err, result) {
        var msg = (err === null) ? result : err ;
        if (err === null && result.length === 0) {
            sts = rdk.httpstatus.not_found;
            res.status(sts).send({status: sts, error: msg});
        } else {
            res.status(sts).send({status: sts, payload: msg});
        }
    });
};

/*
 * Index for intents
 *
 * Note: It's both sparse and unique - so we will still need to make sure required fields are present,
 * because scoptId is optional.  Unfortunately Mongo doesn't let us have only that 'column' set as sparse,
 * so we have to deal with that programmatically.
 */
db.collection('intents').ensureIndex( { name: 1, scope: 1, scopeId: 1 }, {sparse: true, unique: true}, function(error) {
  if (error) {
    console.log(error);
  }}
);

module.exports.apiDocs = apiDocs;

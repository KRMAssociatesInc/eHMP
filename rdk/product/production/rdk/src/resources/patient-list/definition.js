'use strict';

//set up the packages we need
var rdk = require('../../core/rdk');

// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Definition;
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
    match.scope = 'private';
    match.owner = req.session.user.username;

    if (req.query.id) {
        match._id = req.query.id;
    } else if (req.query.name) {
        match.name = req.query.name;
    }
    if (req.query['site.id']) {
        match.scope = 'site';
        match.owner = req.query['site.id'];
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
                     rdk.docs.swagger.paramTypes.body('Definition', 'Definition', '', undefined, true)
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
                'name of definition',  // description
                'string',  // type
                false  // required
            )

        ],
        responseMessages: []
    }
};
apiDocs.copy = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', false),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of definition',  // description
                'string',  // type
                null,  // default value
                false  // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'newname',  // name
                'name of new definition',  // description
                'string',  // type
                null,  // default value
                true  // required
            )
        ],
        responseMessages: []
    }
};

//////////////////////
//Definition Template
//////////////////////

/**
 * Retrieve Definition(s) used in the selection of patients
 *
 * @api {get} /resource/cds/patient/definition[?id=id|name=name] Request Definition
 *
 * @apiName getDefinition
 * @apiGroup Patient Definition
 *
 * @apiParam {Number} [id]  Definition id (24 digit HEX number), id has precedence over name
 * @apiParam {String} [name] Definition name (if id not used)
 * @apiParam {String} . Return all definitions for current owner
 *
 * @apiSuccess (Success 200) {json[]} data Array of one or more definitions
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": [
 *   {
 *       "name": "def one",
 *       "description": "user defined description of this definition template",
 *       "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *       "date": "2015-03-10T12:54:54.035Z",
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fee99e1e3bdef211534bbb"
 *   }
 *   ]
 * }
 * @apiError (Error 404) . Definition not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Definition not found
 * }
 *
 */
module.exports.getDefinition = function(req, res) {
    //console.log('GET Definition called');

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
                msg = 'Definition not found';
            }
            res.status(sts).rdkSend(msg);
        });
    } else { // return multiple
        db.collection(col).find(match).toArray(function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err === null && result.length === 0) {
                sts = rdk.httpstatus.not_found;
                msg = 'Definition(s) not found';
            }
            res.status(sts).rdkSend(msg);
        });
    }
};

/**
 * Create a Definition to be used in the selection of patients
 *
 * @api {post} /resource/cds/patient/definition Create Definition
 *
 * @apiName postDefinition
 * @apiGroup Patient Definition
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Definition object
 *
 * @apiSuccess (Success 201) {json} data Definition JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "data":
 *    {
 *       "name": "def one",
 *       "description": "user defined description of this definition template",
 *       "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *       "date": "2015-03-10T12:54:54.035Z",
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fee99e1e3bdef211534bbb"
 *   }
 * }
 *
 * @apiError (Error 400) {json} error Definition document (request body) must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Definition document (request body) must be defined
 * }
 * @apiError (Error 400) {json} error Scope must be specified using private (default), site or enterprise
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Scope must be specified using private (default), site or enterprise
 * }
 * @apiError (Error 400) {json} error Definition document can not have _id defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Definition document can not have _id defined
 * }
 * @apiError (Error 400) {json} error Definition name must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Definition name must be defined
 * }
 * @apiError (Error 409) {json} error Definition 'name' exists, can not be created
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *    status: 409
 *    message: Definition 'name' exists, can not be created
 * }
 * @apiError (Error 500) {json} error A system or database error message was returned
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    status: 500
 *    message: system or database error message
 * }
 *
 */

module.exports.postDefinition = function(req, res) {

    var sts = rdk.httpstatus.created;
    var msg = '';
    var doc = req.body;

    if (!doc) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Definition document (request body) must be defined';
        res.status(sts).rdkSend(msg);
    } else if (doc.scope && (doc.scope !== 'private' && doc.scope !== 'site' && doc.scope !== 'enterprise')) {
        sts = rdk.httpstatus.bad_request; //400
        msg = 'Scope must be specified using private (default), site or enterprise';
        res.status(sts).rdkSend(msg);
    } else if (doc._id !== undefined) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Definition document can not have _id defined';
        res.status(sts).rdkSend(msg);
    } else if (!doc.name) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Definition name must be defined';
        res.status(sts).rdkSend(msg);
    } else { // Verify the definition does not already exist
        doc.date = new Date();
        if (!doc.scope) {
            doc.scope = 'private';
            doc.owner = req.session.user.username;
        }
        var match = {name: doc.name, scope: doc.scope, owner: doc.owner};
        db.collection(col).findOne(match, function (err, result) {
            if (result) {
                sts = rdk.httpstatus.conflict;
                msg = 'Definition \'' + doc.name + '\' exists, can not be created';
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
 * Delete Definition used in the selection of patients
 *
 * Delete a definition document
 *
 * @api {delete} /resource/cds/patient/definition?[?id=id|name=name] Delete Definition (name or id)
 *
 * @apiName deleteDefinition
 * @apiGroup Patient Definition
 *
 * @apiParam {Number} [id] 24 digit HEX number doc id
 * @apiParam {String} [name] Definition name (if id not used)
 *
 * @apiSuccess (Success 200) {Number} data Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 404) {Number} data The specified definition was not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: null
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
module.exports.deleteDefinition = function(req, res) {

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
                msg = 'Definition not found';
            }
            res.status(sts).rdkSend(msg);
        });
    } else {
        sts = rdk.httpstatus.bad_request;
        msg = 'Name or Id required';
        res.status(sts).rdkSend(msg);
    }
};

/**
 * Copy a Definition used in the selection of patients
 *
 * @api {post} /resource/cds/patient/definition/copy?id=123&newname=somename Copy Definition
 *
 * @apiName copyDefinition
 * @apiGroup Patient Definition
 *
 * @apiParam {Number} [id] 24 digit HEX number doc id
 * @apiParam {String} [name] Definition name (if id not used)
 * @apiParam {String} newName new definition name
 *
 * @apiSuccess (Success 201) {json} data update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "data":
 *    {
 *       "name": "def one A",
 *       "description": "user defined description of this definition template",
 *       "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *       "date": "2015-03-10T12:54:54.035Z",
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fee99e1e3bdef211534bbb"
 *   }
 * }
 *
 * @apiError (Error 400) {json} error Name or Id required
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id required
 * }
 * @apiError (Error 404) data Source Definition not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Source  Definition not found
 * }
 * @apiError (Error 409) {json} error Definition 'name' exists, can not be created
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *    status: 409
 *    message: Definition 'name' exists, can not be created
 * }
 * @apiError (Error 500) {json} error A system or database error message was returned
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    status: 500
 *    message: system or database error message
 * }
 *
 */
module.exports.copyDefinition = function(req, res) {

    var sts = rdk.httpstatus.created;
    var msg = '';
    var newname = req.query.newname;

    var match = computeMatch(req);
    if ((!match.name && !match._id) || !newname) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Name or Id and a Newname required';
        res.status(sts).rdkSend(msg);
        return;
    }
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

    // retrieve source Definition document
    db.collection(col).findOne(match, function (err, patlst) {
        if (err || patlst === null) {
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            } else {
                sts = rdk.httpstatus.not_found;
                msg = 'Source Definition not found';
            }
            res.status(sts).rdkSend(msg);
            return;
        }

        // see it destination patient list document exists
        delete match._id;
        match.name = newname;
        db.collection(col).findOne(match, function (err, test) {
            if (test !== null || err) {
                if (err) {
                    sts = rdk.httpstatus.bad_request;
                    msg = err;
                } else {
                    sts = rdk.httpstatus.conflict;
                    msg = 'Definition document with name \'' + newname + '\' already exists';
                }
                res.status(sts).rdkSend(msg);
                return;
            }

            // create a new Definition based on result
            patlst.name = newname;
            delete patlst._id;
            db.collection(col).insert(patlst, function (err, result) {
                msg = (err === null) ? { data: result } : { error: err };
                if (err) {
                    sts = rdk.httpstatus.internal_server_error;
                }
                res.status(sts).rdkSend(msg);
            });
        });
    });
};

module.exports.apiDocs = apiDocs;

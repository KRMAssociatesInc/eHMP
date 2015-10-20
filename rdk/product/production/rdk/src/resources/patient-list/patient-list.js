'use strict';

//set up the packages we need
var rdk = require('../../core/rdk');
//var express = require('express');
//var bodyParser = require('body-parser');
//var nullchecker = rdk.utils.nullchecker;

// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Patientlist;
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
                'name of Patientlist',  // description
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
            rdk.docs.swagger.paramTypes.body('PatientList', 'Patient List', '', undefined, true)
        ],
        responseMessages: []
    }
};
apiDocs.delete = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', true),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of Patientlist',  // description
                'string',  // type
                false  // required
            )
        ],
        responseMessages: []
    }
};
apiDocs.add = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', false),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of Patientlist',  // description
                'string',  // type
                false  // required
            ),
            rdk.docs.commonParams.pid
        ],
        responseMessages: []
    }
};
apiDocs.remove = {
    spec: {
        summary: '',
        notes: '',
        parameters: [
            rdk.docs.commonParams.id('query', '', false),
            rdk.docs.swagger.paramTypes.query(
                'name',  // name
                'name of Patientlist',  // description
                'string',  // type
                false  // required
            ),
            rdk.docs.commonParams.pid
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
                'name of existing Patientlist',  // description
                'string',  // type
                false  // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'newname',  // name
                'name of new Patientlist',  // description
                'string',  // type
                true  // required
            )
        ],
        responseMessages: []
    }
};

///////////////
//Patient List
///////////////

/**
 * Retrieve Patientlist(s) used in processing
 *
 * @api {get} /resource/cds/patient/list[?id=id|name=name] Request Patientlist
 *
 * @apiName getPatientlist
 * @apiGroup Patient List
 *
 * @apiParam {Number} [id] Patientlist id (24 digit HEX number), id has precedence over name
 * @apiParam {String} [name] Patientlist name (if id not used)
 * @apiParam {String} . Return all Patientlists for current owner
 *
 * @apiSuccess (Success 200) {json[]} data Array of one or more Patientlists
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *   "data": [
 *   {
 *       "name": "pat list one",
 *       "definition": {
 *           "_id": "54f0d4a540d37300003a5711",
 *           "name": "def one",
 *           "description": "user defined description of this definition template",
 *           "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *           "date": "2015-02-27T20:33:41.308Z",
 *           "scope": "private",
 *           "owner": "9E7A;pu1234"
 *       },
 *       "date": "2015-03-10T00:53:19.531Z",
 *       "pidhistory": [
 *           {
 *               "timestamp": "2015-03-10T00:53:55.934Z",
 *               "pid": "12345V123",
 *               "add": true
 *           }
 *       ],
 *       "patients": [
 *           "12345V123"
 *       ],
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fe407fc9f41fad0fff5dc4"
 *   }
 *   ]
 * }
 *
 * @apiError (Error 400) message Specified _id not formatted correctly
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Argument passed in must be a single String of 12 bytes or a string of 24 hex characters
 * }
 * @apiError (Error 404) . The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "message": "Patientlist not found"
 * }
 *
 */
module.exports.getPatientlist = function (req, res) {

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
                msg = 'Patientlist not found';
            }
            res.status(sts).rdkSend(msg);
        });
    } else { // return multiple
        db.collection(col).find(match).toArray(function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err === null && result.length === 0) {
                sts = rdk.httpstatus.not_found;
                msg = 'Patientlist(s) not found';
            }
            res.status(sts).rdkSend(msg);
        });
    }
};

/**
 * Create Patientlist used in processing
 *
 * @api {post} /resource/cds/patient/list Create Patientlist
 *
 * @apiName postPatientlist
 * @apiGroup Patient List
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Patientlist object
 * @apiDescription The post passes the Patientlist in the content as a stringified json object
                   The header will include the content length, i.e. Content-Length = length
 *
 * @apiSuccess (Success 201) {json} data Patientlist JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *   "data":
 *     {
 *       "name": "pat list one",
 *       "definition": {
 *           "_id": "54f0d4a540d37300003a5711",
 *           "name": "def one",
 *           "description": "user defined description of this definition template",
 *           "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *           "date": "2015-02-27T20:33:41.308Z",
 *           "scope": "private",
 *           "owner": "9E7A;pu1234"
 *       },
 *       "date": "2015-03-10T00:53:19.531Z",
 *       "pidhistory": [],
 *       "patients": [],
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fe407fc9f41fad0fff5dc4"
 *     }
 * }
 *
 * @apiError (Error 400) message Patientlist document (request body) must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Patientlist document (request body) must be defined
 * }
 * @apiError (Error 400) message Scope must be specified using private (default), site or enterprise
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Scope must be specified using private (default), site or enterprise
 * }
 * @apiError (Error 400) message The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id and a Pid required
 * }
 * @apiError (Error 400) message Patientlist document can not have _id defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Patientlist document can not have _id defined
 * }
 * @apiError (Error 400) message Patientlist.definition must be defined
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Patientlist.definition must be defined
 * }
 * @apiError (Error 404) message Source Patientlist not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Source Patientlist not found
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
module.exports.postPatientlist = function (req, res) {

    var sts = rdk.httpstatus.created;
    var msg = '';
    var doc = req.body;

    if (!doc) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Patientlist document (request body) must be defined';
        res.status(sts).rdkSend(msg);
    } else if (doc.scope && (doc.scope !== 'private' && doc.scope !== 'site' && doc.scope !== 'enterprise')) {
        sts = rdk.httpstatus.bad_request; //400
        msg = 'Scope must be specified using private (default), site or enterprise';
        res.status(sts).rdkSend(msg);
    } else if (doc._id !== undefined) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Patientlist document can not have _id defined';
        res.status(sts).rdkSend(msg);
    } else if (!doc.name) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Patientlist name must be defined';
        res.status(sts).rdkSend(msg);
    } else if (!doc.definition) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Patientlist.definition must be defined';
        res.status(sts).rdkSend(msg);
    } else { // Verify the definition does not already exist
        doc.date = new Date();
        if (!doc.scope) {
            doc.scope = 'private';
            doc.owner = req.session.user.username;
        }
        doc.pidhistory = [];
        if (doc.patients === undefined) {
            doc.patients = [];
        }
        var match = {name: doc.name, scope: doc.scope, owner: doc.owner};
        db.collection(col).findOne(match, function (err, result) {
            if (result) {
                sts = rdk.httpstatus.bad_request;
                msg = 'Patientlist \'' + doc.name + '\' exists, can not be created';
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
 * Delete Patientlist used in processing
 *
 * @api {delete} /resource/cds/patient/list?id=id Delete Patientlist (name or id)
 * @apiName deletePatientlist
 * @apiGroup Patient List
 *
 * @apiParam {Number} [id] 24 digit HEX number doc id
 * @apiParam {String} [name] Patientlist name (if id not used)
 *
 * @apiSuccess (Success 200) {Number} data Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 400) message The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id and a Pid required
 * }
 * @apiError (Error 404) message Patientlist not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Patientlist not found
 * }
 *
 */
module.exports.deletePatientlist = function (req, res) {

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
                msg = 'Patientlist not found';
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
 * Add a patient to Patientlist
 *
 * @api {post} /resource/cds/patient/list/patients?id&pid Add Patient
 *
 * @apiName addPatient
 * @apiGroup Patient List
 *
 * @apiParam {Number} [id] - 24 digit HEX number doc id
 * @apiParam {String} [name] Patientlist name (if id not used)
 * @apiParam {String} pid Patient ID to be added
 *
 * @apiSuccess (Success 200) {json} data update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 400) message The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id and a Pid required
 * }
 * @apiError (Error 404) message Source Patientlist not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Source Patientlist not found
 * }
 *
 */
module.exports.addPatient = function (req, res) {

    var sts = rdk.httpstatus.ok;
    var msg = '';
    var pid = req.query.pid;

    // Find the patientlist
    var match = computeMatch(req);
    if ((!match.name && !match._id) || !pid) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Name or Id and a Pid required';
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

    db.collection(col).findOne(match, function (err, result) {
        if (err || result === null) {
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            } else {
                sts = rdk.httpstatus.not_found;
                msg = 'Source Patientlist not found';
            }
            res.status(sts).rdkSend(msg);
            return;
        }

        // Add patient, update change history
        if (result.patients.indexOf(pid) === -1) {
            result.patients.push(pid);
        }
        var obj = {timestamp: new Date(), pid: pid, add: true};
        result.pidhistory.push(obj);
        // update the patient list
        db.collection(col).update({_id: result._id}, result, function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            }
            res.status(sts).rdkSend(msg);
        });
    });
};

/**
 * Remove a patient from Patientlist
 *
 * @api {delete} /resource/cds/patient/list/patients?id=123&pid=abc Remove Patient
 *
 * @apiName removePatient
 * @apiGroup Patient List
 *
 * @apiParam {Number} [id] - 24 digit HEX number doc id
 * @apiParam {String} [name] Patientlist name (if id not used)
 * @apiParam {String} pid Patient ID to be removed
 *
 * @apiSuccess (Success 200) {json} data update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "data": 1
 * }
 *
 * @apiError (Error 400) message The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id and a Pid required
 * }
 * @apiError (Error 404) message Source Patientlist not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Source Patientlist not found
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
module.exports.removePatient = function (req, res) {

    var sts = rdk.httpstatus.ok;
    var msg = '';
    var pid = req.query.pid;

    // Find the patientlist
    var match = computeMatch(req);
    if ((!match.name && !match._id) || !pid) {
        sts = rdk.httpstatus.bad_request;
        msg = 'Name or Id and a Pid required';
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

    db.collection(col).findOne(match, function (err, result) {
        if (err || result === null) {
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            } else {
                sts = rdk.httpstatus.not_found;
                msg = 'Source Patientlist not found';
            }
            res.status(sts).rdkSend(msg);
            return;
        }

        // Remove patient id
        var i = result.patients.indexOf(pid);
        if (i >= 0) {
            result.patients.splice(i, 1);
        }
        var obj = {timestamp: new Date(), pid: pid, add: false};
        result.pidhistory.push(obj);
        db.collection(col).update({_id: result._id}, result, function (err, result) {
            msg = (err === null) ? { data: result } : { error: err };
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            }
            res.status(sts).rdkSend(msg);
        });
    });
};
/**
 * Copy a Patientlist
 *
 * @api {post} /resource/cds/patient/list/copy?id=123&newname=somename Copy PatientList
 *
 * @apiName copyPatientlist
 * @apiGroup Patient List
 *
 * @apiParam {Number} [id] 24 digit HEX number doc id
 * @apiParam {String} [name] Patientlist name (if id not used)
 * @apiParam {String} newname new Patientlist name
 *
 * @apiSuccess (Success 201) {json} data update count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "data":
 *   {
 *       "name": "pat list one A",
 *       "definition": {
 *           "_id": "54f0d4a540d37300003a5711",
 *           "name": "def one",
 *           "description": "user defined description of this definition template",
 *           "expression": "{and: [ {or: ['A.A','B.B'], {'A.A'} ]}",
 *           "date": "2015-02-27T20:33:41.308Z",
 *           "scope": "private",
 *           "owner": "9E7A;pu1234"
 *       },
 *       "date": "2015-03-10T00:53:19.531Z",
 *       "pidhistory": [],
 *       "patients": [],
 *       "scope": "private",
 *       "owner": "9E7A;pu1234",
 *       "_id": "54fe407fc9f41fad0fff5dc4"
 *   }
 * }
 *
 * @apiError (Error 400) message Error on request
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    status: 400
 *    message: Name or Id and a Newname required
 * }
 * @apiError (Error 404) message The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    status: 404
 *    message: Source Patientlist not found
 * }
 * @apiError (Error 409) message The new name specified already exists
 * @apiErrorExample Error-Response:
 * HTTP/1.1 409 Conflict
 * {
 *    status: 409
 *    message: Patientlist document with name 'newname' already exists
 * }
 * @apiError (Error 500) message Severe internal error
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *    status: 500
 *    message: Internal Server Error
 * }
 *
 */
module.exports.copyPatientlist = function (req, res) {

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

    // retrieve source Patientlist document
    db.collection(col).findOne(match, function (err, patlst) {
        if (err || patlst === null) {
            if (err) {
                sts = rdk.httpstatus.internal_server_error;
            } else {
                sts = rdk.httpstatus.not_found;
                msg = 'Source Patientlist not found';
            }
            res.status(sts).rdkSend(msg);
            return;
        }

        // see it destination Patient list document exists
        delete match._id;
        match.name = newname;
        db.collection(col).findOne(match, function (err, test) {
            if (test !== null || err) {
                if (err) {
                    sts = rdk.httpstatus.bad_request;
                    msg = err;
                } else {
                    sts = rdk.httpstatus.conflict;
                    msg = 'Patientlist document with name \'' + newname + '\' already exists';
                }
                res.status(sts).rdkSend(msg);
                return;
            }

            // create a new Patientlist based on result
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

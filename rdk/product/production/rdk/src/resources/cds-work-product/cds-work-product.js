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
var cfg = config.WorkProduct;

// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':' + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});

var ObjectId = require('mongoskin').ObjectID;

var app = express();
app.use(bodyParser.json());

//
// Database Init
//

function initDb() {

    db.collection('work').ensureIndex({
        provider: 1,
        type: 1,
        priority: 1
    }, {}, function (error) {
        if (error) {
            console.log(error);
        }
    });

    db.collection('subscriptions').ensureIndex({
        user: 1
    }, {
        unique: true
    }, function (error) {
        if (error) {
            console.log(error);
        }
    });

}

db.open(function (err) {
    if (!err) {
        console.log('Connected to \'' + cfg.dbname + '\' database');
        initDb();
    } else {
        console.log('ERROR connecting to \'' + cfg.dbname + '\' database');
    }
});


var apiDocs = {};
apiDocs.createWorkProduct = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Create work product',
        method: 'POST',
        parameters: []
    }
};
apiDocs.retrieveWorkProduct = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Get work product',
        method: 'GET',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'work product id', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.updateWorkProduct = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Update work product',
        method: 'PUT',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'work product id', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.deleteWorkProduct = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Delete work product',
        method: 'DELETE',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'work product id', // description
                'string', // type
                true // required
            )
        ]
    }
};
apiDocs.retrieveSubscriptions = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Retrieve subscription for user',
        method: 'GET'
    }
};
apiDocs.updateSubscriptions = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Insert/Update subscription for user',
        method: 'PUT'
    }
};
apiDocs.deleteSubscriptions = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Delete subscription for user',
        method: 'DELETE'
    }
};
apiDocs.retrieveInbox = {
    spec: {
        summary: 'Work Product resource',
        notes: 'Get inbox for user',
        method: 'GET'
    }
};


//
// Utility Methods
//

function testId(id) {
    var msg = null;
    try {
        var oid = new ObjectId(id); // jshint ignore:line
    } catch (err) {
        msg = err.message;
    }
    return msg;
}

function getKeyValue(obj) {
    var property;
    //nullchecker.isNotNullish(obj) ???
    //add: if (obj.hasOwnProperty(property)) ???
    if (obj !== null) {
        for (property in obj) {
            if (property !== undefined) {
                return property + ':' + obj[property];
            }
        }
    }
    return 'BAD OBJECT';
}

function formatForRDK(result) {
    var items = [];
    var resultArrayLength = result ? result.length : 0;
    var i, j, payloadArrayLength;
    var type;
    for (i = 0; i < resultArrayLength; i += 1) {
        //for now, we'll naively pull the first record in each set.
        if (result[i]._id) {
            type = result[i].workproduct.type;
            payloadArrayLength = result[i].workproduct.payload ? result[i].workproduct.payload.length : 0;
            for (j = 0; j < payloadArrayLength; j += 1) {
                //we're only adding the payload type that's relavent for this product.
                //other payload type(s) don't matter to us here.
                if (type === result[i].workproduct.payload[j].type) {

                    //workaround for demo...
                    if (result[i] && result[i].workproduct &&
                        result[i].workproduct.context &&
                        result[i].workproduct.context.subject &&
                        result[i].workproduct.context.subject.id) {
                        var pid = result[i].workproduct.context.subject.id;
                        result[i].workproduct.payload[j].data.patientName = pid;
                    }
                    //end workaround for demo...

                    //repurposing the id field to give us a work product id.  This is needed
                    //when the front end wants to request that this be marked as 'read', etc
                    result[i].workproduct.payload[j].data.id = result[i]._id;

                    items.push(result[i].workproduct.payload[j].data);
                }
            }
        }
    }
    var data = {};
    data.items = items;
    return data;
}

function workProductForClient(result) {
    //console.log('fmt for client: ' + JSON.stringify(result));
    var i;
    if (result instanceof Array) {
        var workproducts = [];
        var arrayLength = result.length;
        for (i = 0; i < arrayLength; i += 1) {
            if (result[i]._id) {
                result[i].workproduct.id = result[i]._id;
                workproducts.push(result[i].workproduct);
            }
        }
        return workproducts;
    }
    //id is overloaded here, so that we can refer back to the database id for this work product.
    if (result && result.workproduct && result._id) {
        result.workproduct.id = result._id;
        return result.workproduct;
    }

    //if all else fails, return nothing.
    return '';
}

/**
 * Specialty Codes (snomed)
 */
var SPECIALTY = {
    ALLERGY: 408439002,
    CRITICAL_CARE: 408478003,
    DERMATOLOGY: 394582007,
    ENDOCRINOLOGY: 394582007,
    FAMILY_MEDICINE: 419772000,
    GASTROENTEROLOGY: 394584008,
    GENERAL_SURGERY: 394294004,
    HEMATOLOGY_AND_ONCOLOGY: 394916005,
    INTERNAL_MEDCINE: 419192003,
    NEONATOLOGY: 408445005,
    NEUROLOGY: 56397003,
    OBGYN: 309367003,
    OPHTHALMOLOGY: 394813003,
    RHEUMATOLOGY: 394810000
};

var allSpecialties = [];
var key;
for (key in SPECIALTY) {
    if (SPECIALTY.hasOwnProperty(key)) {
        allSpecialties.push(SPECIALTY[key]);
    }
}

var defaultSubscriptions = {
    'specialty': allSpecialties,
    'priority': 'ALL', // Values can be: ALL (all), CRI (critical), URG (urgent: critical + high priorities)
    'type': [
        'P', // Proposal
        'A' // Advice
    ]
};


//
// API Calls
//

/**
 * @api {get} cdsworkproduct/inbox Retrieves 'inbox' for the authenticated user.
 * @apiName retrieveInbox
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription This method retrieves the 'inbox' for the user that is currently authenticated.
 *
 * @apiSuccess (Success 200) {json} json collection of objects containing the users inbox entries
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": {
 *      "items": [{
 *          "details": {
 *              "detail": "This is the Body",
 *              "provenance": "Test Data"
 *          },
 *          "doneDate": null,
 *          "dueDate": 1443989700000,
 *          "generatedBy": "GeneratedBYUnitTest",
 *          "id": null,
 *          "pid": "PatientId",
 *          "priority": 50,
 *          "provider": "ProviderId",
 *          "title": "A Test Result",
 *          "type": "advice",
 *          "patientName": "2299:2222:Junk"
 *      }]
 *  }
 * }
 *
 * @apiError (Error 404) Not Found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Bad Request
 * {
 *     "status": 404,
 *     "error": ""
 * }
 */
module.exports.retrieveInbox = function (req, res) {
    req.logger.debug('CDS Work Product GET retrieveInbox called');

    var userId = getKeyValue(req.session.user.duz);
    var query = {};
    query.assignments = {
        $elemMatch: {
            'user.id': userId
        }
    };
    var projection = {
        'workproduct': 1
    };

    var sts = rdk.httpstatus.ok;
    db.collection('work').find(query, projection).toArray(function (err, result) {
        if (nullchecker.isNotNullish(err)) {
            req.logger.debug('error: ' + err);
            sts = rdk.httpstatus.not_found;
            res.status(sts).send({status: sts, error: err});
        } else {
            req.logger.debug('results: ' + result);
            res.status(sts).send({status: sts, data: formatForRDK(result)});
        }
    });

};


/**
 * @apiIgnore This is not used externally.  This method is used by cdsAdviceList.
 *
 * @apiDescription Retrieves 'work products' for the given provider.  In the event of an error, an
 * empty result is returned.
 *
 * @apiSuccess (Success 200) {json} json workproducts for the given provider.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": {
 *      "items": [{
 *          "details": {
 *              "detail": "This is the Body",
 *              "provenance": "Test Data"
 *          },
 *          "doneDate": null,
 *          "dueDate": 1443989700000,
 *          "generatedBy": "GeneratedBYUnitTest",
 *          "id": null,
 *          "pid": "PatientId",
 *          "priority": 50,
 *          "provider": "ProviderId",
 *          "title": "A Test Result",
 *          "type": "advice",
 *           "patientName": "2299:2222:Junk"
 *      },
 *      {
 *          "details": {
 *              "detail": "This is the Body",
 *              "provenance": "Test Data"
 *          },
 *          "doneDate": null,
 *          "dueDate": 1443989700000,
 *          "generatedBy": "GeneratedBYUnitTest",
 *          "id": null,
 *          "pid": "PatientId",
 *          "priority": 50,
 *          "provider": "ProviderId",
 *          "title": "A Test Result",
 *          "type": "advice",
 *          "patientName": "2299:2222:Junk"
 *      }]
 *  }
 * }
 *
 */
module.exports.retrieveWorkProductsForProvider = function (provider, pid, readStatus, callback) {

    var workProductQuery = {};

    if (pid) {
        workProductQuery['workproduct.context.subject.id'] = pid;
    }

    var read = false;
    if (readStatus === 'true') {
        read = true;
    } else {
        read = false;
    }

    if (readStatus || provider) {
        workProductQuery.assignments = {
            $elemMatch: {}
        };
        if (readStatus) {
            workProductQuery.assignments.$elemMatch.readStatus = read;
        }
        if (provider) {
            workProductQuery.assignments.$elemMatch['user.id'] = provider;
        }
    }

    var projection = {
        'workproduct': 1
    };

    db.collection('work').find(workProductQuery, projection).sort({
        'workproduct.generationDate': -1
    }).limit(500).toArray(function(err, result) {
        //console.log(JSON.stringify(result));
        if(nullchecker.isNullish(err)) {
            //callback
            var formattedResults = formatForRDK(result);
            var items = []; // callback expects an array, ensure at the very least we send an empty one
            if (formattedResults && formattedResults.items instanceof Array) {
                items = formattedResults.items;
            }
            callback(null, items);
        } else {
            //in these errors, there is nothing we can do but return no messages...
            callback(null, []);
        }

    });
};


/**
 * @api {post} cdsworkproduct/workproduct Creates a work product.
 * @apiName createWorkProduct
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Creates a work product.
 *
 * @apiSuccess (Success 201) {json} json echo of the created workproduct
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *  "status": 201,
 *  "data": [
 *  {
 *      "categories": [
 *          419192003
 *      ],
 *      "context": {
 *          "location": {
 *              "codeSystem": "VA:Location",
 *              "entityType": "Location",
 *              "id": "2883",
 *              "name": "ClinicOne",
 *              "type": "ClinicName"
 *          },
 *          "specialty": {
 *              "codeSystem": "VA:Specialty",
 *              "entityType": "Specialty",
 *              "id": "FM",
 *              "name": "Family Medicine",
 *              "type": "Speciality"
 *          },
 *          "subject": {
 *              "codeSystem": "VA:UniversalId",
 *              "entityType": "Subject",
 *              "id": "2299:2222:Junk",
 *              "name": null,
 *              "type": "Patient"
 *          },
 *          "user": {
 *              "codeSystem": "VA:Provider",
 *              "entityType": "User",
 *              "id": "unitTestUserId",
 *              "name": "TESR,USER",
 *              "type": "Provider"
 *          }
 *      },
 *      "duplicateCheckKey": {
 *          "checkSum": "",
 *          "subject": {
 *              "codeSystem": "VA:UniversalId",
 *              "entityType": "Subject",
 *              "id": "2299:2222:Junk",
 *              "name": null,
 *              "type": "Patient"
 *          },
 *          "type": "advice"
 *      },
 *      "expirationDate": 1443989700000,
 *      "generationDate": 1443903300000,
 *      "id": "5550cd249e94e57917716f5e",
 *      "invocationInfo": {
 *          "callId": "UUID of CallId",
 *          "generatedBy": "UnitTestRulesEngine",
 *          "targetInfo": {
 *              "intentsSet": [
 *                  "InvocationIntentA"
 *              ],
 *              "mode": "Normal",
 *              "perceivedExecutionTime": null,
 *              "supplementalMappings": null,
 *              "type": "Background"
 *          }
 *      },
 *      "payload": [{
 *          "data": {
 *              "details": {
 *                  "detail": "This is the Body",
 *                  "provenance": "Test Data"
 *              },
 *              "doneDate": null,
 *              "dueDate": 1443989700000,
 *              "generatedBy": "GeneratedBYUnitTest",
 *              "id": null,
 *              "pid": "PatientId",
 *              "priority": 50,
 *              "provider": "ProviderId",
 *              "title": "A Test Result",
 *              "type": "advice"
 *          },
 *          "type": "advice"
 *      }],
 *      "priority": 0,
 *      "type": "advice"
 *  }]
 * }
 *
 * @apiError (Error 400) Bad Request.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": 400,
 *   "error": ""
 * }
 */
module.exports.createWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product POST createWorkProduct called');

    var product = req.body;

    //putting this into a wrapper object for easier access, etc.
    var wrapper = {};
    wrapper.workproduct = product;
    wrapper.assignments = [];

    var sts = rdk.httpstatus.created;

    db.collection('work').insert(wrapper, function (err, result) {
        //console.log('raw result: ' + JSON.stringify(result));
        sts = rdk.httpstatus.created;
        if (nullchecker.isNullish(err)) {
            res.status(sts).send({status: sts, data: workProductForClient(result)});
        } else {
            sts = rdk.httpstatus.bad_request;
            res.status(rdk.httpstatus.bad_request).send({status: sts, error: err});
        }
    });
};


/**
 * @api {get} cdsworkproduct/workproduct Retrieves a work product from the database.
 * @apiName retrieveWorkProduct
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Retrieves a work product from the database.
 *
 * @apiSuccess (Success 200) {json} json representation of the workproduct
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": [
 *  {
 *      "categories": [
 *          419192003
 *      ],
 *      "context": {
 *          "location": {
 *              "codeSystem": "VA:Location",
 *              "entityType": "Location",
 *              "id": "2883",
 *              "name": "ClinicOne",
 *              "type": "ClinicName"
 *          },
 *          "specialty": {
 *              "codeSystem": "VA:Specialty",
 *              "entityType": "Specialty",
 *              "id": "FM",
 *              "name": "Family Medicine",
 *              "type": "Speciality"
 *          },
 *          "subject": {
 *              "codeSystem": "VA:UniversalId",
 *              "entityType": "Subject",
 *              "id": "2299:2222:Junk",
 *              "name": null,
 *              "type": "Patient"
 *          },
 *          "user": {
 *              "codeSystem": "VA:Provider",
 *              "entityType": "User",
 *              "id": "unitTestUserId",
 *              "name": "TESR,USER",
 *              "type": "Provider"
 *          }
 *      },
 *      "duplicateCheckKey": {
 *          "checkSum": "",
 *          "subject": {
 *              "codeSystem": "VA:UniversalId",
 *              "entityType": "Subject",
 *              "id": "2299:2222:Junk",
 *              "name": null,
 *              "type": "Patient"
 *          },
 *          "type": "advice"
 *      },
 *      "expirationDate": 1443989700000,
 *      "generationDate": 1443903300000,
 *      "id": "5550cd249e94e57917716f5e",
 *      "invocationInfo": {
 *          "callId": "UUID of CallId",
 *          "generatedBy": "UnitTestRulesEngine",
 *          "targetInfo": {
 *              "intentsSet": [
 *                  "InvocationIntentA"
 *              ],
 *              "mode": "Normal",
 *              "perceivedExecutionTime": null,
 *              "supplementalMappings": null,
 *              "type": "Background"
 *          }
 *      },
 *      "payload": [{
 *          "data": {
 *              "details": {
 *                  "detail": "This is the Body",
 *                  "provenance": "Test Data"
 *              },
 *              "doneDate": null,
 *              "dueDate": 1443989700000,
 *              "generatedBy": "GeneratedBYUnitTest",
 *              "id": null,
 *              "pid": "PatientId",
 *              "priority": 50,
 *              "provider": "ProviderId",
 *              "title": "A Test Result",
 *              "type": "advice"
 *          },
 *          "type": "advice"
 *      }],
 *      "priority": 0,
 *      "type": "advice"
 *  }]
 * }
 *
 * @apiError (Error 404) Work Product not found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found Error
 * {
 *   "status": 404,
 *   "error": "Missing or invalid work product id."
 * }
 */
module.exports.retrieveWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product GET retrieveWorkProduct called');

    var sts = rdk.httpstatus.ok;

    var id = req.query.id;
    if (id && testId(id)) {
        sts = rdk.httpstatus.bad_request;
        res.status(sts).send({
            status: sts,
            error: 'Missing or invalid work product id.'
        });
        return;
    }

    db.collection('work').findOne({
        _id: new ObjectId(id)
    }, function (err, result) {
        sts = rdk.httpstatus.ok;
        if (nullchecker.isNullish(err)) {
            if (nullchecker.isNullish(result)) {
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({status: sts, error: 'Work Product with id \'' + id + '\' was not found.'});
            } else {
                //default sts is 'ok'
                res.status(sts).send({status: sts, data: workProductForClient(result)});
            }
        } else {
            sts = rdk.httpstatus.internal_server_error;
            res.status(sts).send({status: sts, error: err});
        }
    });
};


/**
 * @api {put} cdsworkproduct/workproduct Updates a work product in the database.
 * @apiName updateWorkProduct
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Updates a work product in the database.
 *
 * @apiSuccess (Success 200) {json} data with a '1' for successful match and update, or a '0' for no match and update.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": 1
 * }
 *
 * @apiError (Error 400) Work Product not found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *   "status": 400,
 *   "error": "Missing or invalid work product id."
 * }
 *
 * @apiError (Error 404) Work Product not found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found Error
 * {
 *   "status": 404,
 *   "error": "Work Product with id <id> was not found."
 * }
 */
module.exports.updateWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product PUT updateWorkProduct called');

    var sts = rdk.httpstatus.ok;

    var id = req.query.id;
    var product = req.body;

    if (id && testId(id)) {
        sts = rdk.httpstatus.bad_request;
        res.status(sts).send({
            status: sts,
            error: 'Missing or invalid work product id.'
        });
        return;
    }

    db.collection('work').update({
        _id: new ObjectId(id)
    }, {
        $set: {
            workproduct: product
        }
    }, function (err, numUpdated) {
        sts = rdk.httpstatus.ok;
        if (nullchecker.isNullish(err)) {
            if (numUpdated === 0) {
                // no records updated, id not found
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({status: sts, err: 'Work Product with id \'' + id + '\' was not found.'});
            } else {
                //sts default is 'ok'
                res.status(sts).send({status: sts, data: {updated: numUpdated}});
            }
        } else {
            sts = rdk.httpstatus.internal_server_error;
            res.status(sts).send({status: sts, error: err});
        }
    });
};


/**
 * @apiIgnore This is not used externally.  This method is used internally and not exposed via rest.
 *
 * @api {put} cdsworkproduct/workproduct Sets the 'read' status of an assigned work product in the database.
 * @apiName patchWorkProduct
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Sets the 'read' status of an assigned work product in the database.
 *
 * @apiSuccess {json} data Json object containing a one for successful match and update, zero if there was no record to update.
 *
 */
module.exports.setReadStatus = function setReadStatus(id, readStatus, provider, callback) {

    var read = false;
    if (readStatus === 'true') {
        read = true;
    } else {
        read = false;
    }

    db.collection('work').update({
        _id: new ObjectId(id),
        'assignments.user.id': provider
    }, {
        $set: {
            'assignments.$.readStatus': read
        }
    }, function (err, result) {
        if (err) {
            callback(null, err);
            return;
        }
        if (result) {
            callback(result, null);
            return;
        }
    });
};


/**
 * @api {delete} cdsworkproduct/workproduct Delete a work product in the database.
 * @apiName deleteWorkProduct
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Delete a work product in the database.
 *
 * @apiSuccess (Success 201) {json} data with a '1' for successful match and delete, or a '0' for no match and delete.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": 1
 * }
 *
 * @apiError (Error 404) Not Found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Internal Server Error
 * {
 *     "status": 404,
 *     "error": "Work Product with id <id> was not found."
 * }
 *
 * @apiError (Error 500) Internal Server Error.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "status": 500,
 *     "error": ""
 * }
 */
module.exports.deleteWorkProduct = function (req, res) {
    req.logger.debug('CDS Work Product DELETE deleteWorkProduct called');

    var sts = rdk.httpstatus.ok;

    var id = req.query.id;

    if (id && testId(id)) {
        sts = rdk.httpstatus.bad_request;
        res.status(sts).send({
            status: sts,
            error: 'Missing or invalid work product id.'
        });
        return;
    }

    db.collection('work').remove({
        _id: new ObjectId(id)
    }, function (err, numDeleted) {
        sts = rdk.httpstatus.ok;
        if (nullchecker.isNullish(err)) {
            if (numDeleted === 0) {
                // no record deleted, id not found
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({status: sts, err: 'Work Product with id \'' + id + '\' was not found.'});
            } else {
                res.status(sts).send({status: sts, data: {deleted: numDeleted}});
            }
        } else {
            sts = rdk.httpstatus.internal_server_error;
            res.status(sts).send({status: sts, error: err});
        }
    });
};


/**
 * @api {get} cdsworkproduct/subscriptions Retrieves user subscriptions for the authenticated user.
 * @apiName retrieveSubscriptions
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Retrieves user subscriptions for the authenticated user.
 *
 * Priority values: ALL (All priorities), URG (Urgent: high + critical priority), CRIT (Critical priority)
 *
 * Type values: A (advice), P (proposal)
 *
 * Specialty values (snomed codes):
 * Allergy 408439002
 * Critical Care 408478003
 * Dermatology 394582007
 * Endocrinology 394582007
 * Family Medicine 419772000
 * Gastroenterology 394584008
 * General Surgery 394294004
 * Hematology and Oncology 394916005
 * Internal Medicine 419192003
 * Neonatology 408445005
 * Neurology 56397003
 * Obstetrics and Gynecology 309367003
 * Ophthalmology 394813003
 * Rheumatology 394810000
 *
 * @apiSuccess {json} data A collection of string arrays containing the user's subscriptions.
 *
 * @apiSuccessExample Success-Response:
 * {
 *     "status": 200,
 *     "data": {
 *         "specialty": [
 *             408439002,
 *             408478003
 *         ],
 *         "priority": "ALL",
 *         "type": [
 *             "P",
 *             "A"
 *         ]
 *     }
 * }
 *
 * @apiError (Error 404) Not Found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Internal Server Error
 * {
 *     "status": 404,
 *     "error": ""
 * }
 */
module.exports.retrieveSubscriptions = function (req, res) {
    req.logger.debug('CDS Work Product GET retrieveSubscriptions called');

    var userId = getKeyValue(req.session.user.duz);
    db.collection('subscriptions').findOne({
        user: userId
    }, function (err, result) {

        req.logger.debug('error: ' + err);
        req.logger.debug('result: ' + result);

        var sts = rdk.httpstatus.ok;

        if (nullchecker.isNullish(result)) { // none found - use defaults.
            result = defaultSubscriptions;
        } else if (result && result.data) { // found some, just pass the part that matters.
            result = result.data;
        }

        if(nullchecker.isNullish(err)) {
            //default sts is 'ok'
            res.status(sts).send({status: sts, data: result});
        } else {
            //this should be unreachable in practice, since we default the response.
            sts = rdk.httpstatus.not_found;
            res.status(sts).send({status: sts, error: err});
        }
    });
};


/**
 * @api {put} cdsworkproduct/subscriptions Updates user subscriptions for the authenticated user.
 * @apiName updateSubscriptions
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Updates user subscriptions for the authenticated user.
 *
 * @apiParamExample {json} Request-Example:
 * {
 *     priority: "ALL",
 *     specialty: [ 408439002, 394582007], // specialty snomed codes
 *     type: [ "A", "P" ]
 * }
 *
 * @apiSuccess (Success 201) {json} data with a '1' for successful match and update, or a '0' for no match and update.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": 1
 * }
 *
 * @apiError (Error 500) Internal Server Error.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 500 Internal Server Error
 * {
 *     "status": 500,
 *     "error": ""
 * }
 */
module.exports.updateSubscriptions = function (req, res) {
    req.logger.debug('CDS Work Product PUT updateSubscriptions called');

    var product = req.body;
    var userId = getKeyValue(req.session.user.duz);
    product.user = userId;

    db.collection('subscriptions').update({
        user: userId
    }, product, {
        upsert: true
    }, function (err, numUpdated) {
        var sts = rdk.httpstatus.ok;
        if (nullchecker.isNullish(err)) {
            req.logger.debug('numUpdated: ' + numUpdated);
            //this is an 'upsert' to no need to check for number of records updated.  There will always be one.
            //sts default is 'ok'
            res.status(sts).send({status: sts, data: {updated: numUpdated}});
        } else {
            req.logger.debug('error: ' + err);
            sts = rdk.httpstatus.internal_server_error;
            res.status(sts).send({status: sts, error: err});
        }
    });

};


/**
 * @api {delete} cdsworkproduct/subscriptions Deletes user subscriptions for the authenticated user.
 * @apiName deleteSubscriptions
 * @apiGroup CDSWorkProduct
 *
 * @apiDescription Deletes user subscriptions for the authenticated user.
 *
 * @apiSuccess (Success 201) {json} data with a '1' for successful match and delete, or a '0' for no match and delete.
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *  "status": 200,
 *  "data": 1
 * }
 *
 * @apiError (Error 404) Not Found.
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *   "status": 404,
 *   "error": "Subscriptions for user <userId> was not found."
 * }
 *
 */
module.exports.deleteSubscriptions = function (req, res) {
    req.logger.debug('CDS Work Product DELETE deleteSubscriptions called');

    var userId = getKeyValue(req.session.user.duz);

    db.collection('subscriptions').remove({
        user: userId
    }, function (err, numDeleted) {
        var sts = rdk.httpstatus.ok;
        if (nullchecker.isNullish(err)) {
            if (numDeleted === 0) {
                // do we want to return this error in this case since they'd just get the defaults anyways?
                // no record deleted, id not found
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({status: sts, err: 'Subscriptions for user \'' + userId + '\' was not found.'});
            } else {
                res.status(sts).send({status: sts, data: {deleted: numDeleted}});
            }
        } else {
            sts = rdk.httpstatus.internal_server_error;
            res.status(sts).send({status: sts, error: err});
        }
    });

};

module.exports.apiDocs = apiDocs;


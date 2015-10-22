'use strict';

var rdk = require('../../core/rdk');

// set up the packages we need
var express = require('express');
var bodyParser = require('body-parser');
var request = require('request');
var Agenda = require('agenda');

// Config files
var config = require('./config');
var mdb = config.MongoDbListener;
var cfg = config.Scheduler;

// Database
var mongo = require('mongoskin');
var db = mongo.db('mongodb://' + mdb.host + ':' + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true', {safe: true});
var ObjectId = require('mongoskin').ObjectID;

//var app = express();
//app.use(bodyParser.json());

var agenda;
db.open(function(err) {
    if (!err) {
        console.log('Connected to \'' + cfg.dbname + '\' database');
        agenda = initAgenda();
    } else {
        console.log('ERROR connecting to \'' + cfg.dbname + '\' database');
    }
});


function ignoreErrors() {}

function initAgenda() {
try {
    var agenda = new Agenda()
        .name('CDS Jobs Queue')
        .database('mongodb://' + mdb.host + ':' + mdb.port + '/' + cfg.dbname + '?auto_reconnect=true')
        .processEvery('5 seconds');

    agenda._db.ensureIndex('nextRunAt', ignoreErrors)
        .ensureIndex('lockedAt', ignoreErrors)
        .ensureIndex('name', ignoreErrors)
        .ensureIndex('priority', ignoreErrors);

    // start non disabled, no failed jobs
    agenda.jobs({}, function(err, jobs) {
        if (!err && jobs) {
            for (var i = 0; i < jobs.length; i++) {
                var job = jobs[i];
            }
        }
    });

    agenda.start();

    agenda.define('sendRequest', function(job, done) {
        sendRequest(job, done);
    });

    return agenda;

} catch (e) {
    console.log('error initializing agenda: ' + e);
    return null;
}
}

/*
 *  This is to shutdown Agenda - without it we can get into a situation where
 *  RDK doesn't shut down when it's told to.
*/
function graceful() {
    if(agenda) {
        agenda.stop(function() {
            process.exit(0);
        });
    } else {
        process.exit(0);
    }
}
process.on('SIGTERM', graceful);
process.on('SIGINT', graceful);


function sendRequest(job, done) {

    var info = job.attrs.data;
    var url = 'http://' + info.url + '/' + info.cdsname;

    //console.log('In sendRequest: URL: ' + url + ' disabled: ' + job.attrs.disabled);

    if (job.attrs.disabled) {
        done(null);
    } else {

        request.post({
            url: url,
            timeout: 5000
        }, function(err, response, body) {
            var msg = (err === null) ? {
                message: body
            } : {
                error: err
            };
            if (response) {
                if (response.statusCode !== rdk.httpstatus.ok) {
                    msg.status = response.statusCode;
                }
                if (response.statusCode === rdk.httpstatus.ok) {
                    msg = null;
                }
            }
            done(msg); // logged in agenda job as "failReason"
        });
    }
}

function testId(id) {
    var msg = null;
    try {
        var oid = new ObjectId(id);
    } catch (err) {
        msg = err.message;
    }
    return msg;
}

// Schedule CDS Agenda Jobs
//app.get('/', function(req, res) {
//    res.send('Schedule listening...');
//});

var apiDocs = {};
apiDocs.get = {
    spec: {
        summary: 'Schedule resource',
        notes: 'Get scheduled job(s)',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'id of schedule job', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'jobname', // name
                'name of schedule job', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.post = {
    spec: {
        summary: 'Schedule resource',
        notes: 'Create a job schedule',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'jobname', // name
                'name of schedule job', // description
                'string', // type
                true // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'cdsname', // name
                'name of CDS Request', // description
                'string', // type
                true // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'when', // name
                'when to schedule the job to run', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'interval', // name
                'how often to run the job', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.put = {
    spec: {
        summary: 'Schedule resource',
        notes: 'Update a scheduled job',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'jobname', // name
                'name of schedule job', // description
                'string', // type
                true // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'when', // name
                'when to schedule the job to run', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'interval', // name
                'how often to run the job', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'enable', // name
                'enable job', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'disable', // name
                'disable job', // description
                'string', // type
                false // required
            )
        ]
    }
};
apiDocs.delete = {
    spec: {
        summary: 'Schedule resource',
        notes: 'Delete a sceduled job',
        parameters: [
            rdk.docs.swagger.paramTypes.query(
                'id', // name
                'id of schedule job', // description
                'string', // type
                false // required
            ),
            rdk.docs.swagger.paramTypes.query(
                'jobname', // name
                'name of schedule job', // description
                'string', // type
                false // required
            )
        ]
    }
};


///////////
//Job
///////////


/**
 * Retrieve a scheduled job
 *
 * @api {get} /resource/cds/schedule/job[?jobname=name] Request Job
 *
 * @apiName getJob
 * @apiGroup CDS Scheduler
 *
 * @apiParam {String} [jobname] Job name
 * @apiParam {String} . Return all jobs
 *
 * @apiSuccess (Success 200) {json[]} payload A Job array
 *
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *      "status": 200,
 *      "payload": [
 *          {
 *              "_id": "559cd12977cbe259a740c0c2",
 *              "name": "sendRequest",
 *              "data": {
 *                  "cdsname": "Timeout",
 *                  "url": "10.2.2.49:8080/cds-results-service/core/executeRulesJob"
 *              },
 *              "type": "normal",
 *              "priority": 0,
 *              "nextRunAt": "2015-07-10T16:08:49.203Z",
 *              "jobname": "job1",
 *              "disabled": true,
 *              "lastModifiedBy": "CDS Jobs Queue",
 *              "lockedAt": null,
 *              "lastRunAt": "2015-07-08T07:28:41.928Z",
 *              "lastFinishedAt": "2015-07-08T07:28:41.929Z"
 *          }
 *      ]
 *  }
 *
 * @apiError (Error 404) payload The id or name specified does not exist
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *    "status": 404,
 *    "payload": null
 * }
 *
 */
module.exports.getJob = function(req, res) {

    var sts = rdk.httpstatus.ok;
    var msg;
    var match = {};

    if (req.query.jobname) {
        match.jobname = req.query.jobname;
    }

    if(agenda) {
        agenda.jobs(match, function(err, jobs) {
            // Work with jobs
            if(err === null) {
                if(jobs.length === 0) {
                    sts = rdk.httpstatus.not_found;
                }
                /*
                 * This odd JSON parse logic to remove a circular reference that crashes one of
                 * the outcepters in RDK as of the time of this writing.
                 */
                res.status(sts).send({ status: sts, payload: JSON.parse(JSON.stringify(jobs)) });
            } else {
                sts = rdk.httpstatus.not_found;
                msg = { status: sts, error: err };
            }
        });

    } else {
        sts = rdk.httpstatus.service_unavailable;
        msg = { status: sts, error: 'Not connected to database.' };
    }
};


/**
 * Create a scheduled job
 *
 * @api {post} /resource/cds/schedule/job Create Job
 *
 * @apiName postJob
 * @apiGroup CDS Scheduler
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Job object
 *
 * @apiParam {String} jobname Job name
 * @apiParam {String} cdsname CDS Job name
 * @apiParam {String} when The time the CDS Job should run
 * @apiParam {String} interval The frequency of running the CDS Job
 *
 * @apiSuccess (Success 201) {json} payload Job JSON document
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 201 Created
 * {
 *    "status": 201,
 *    "message": "Send Request queued for JobName"
 * }
 *
 * @apiError (Error 404) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *     "status": 404,
 *     "error": "Missing required CDS job name"
 * }
 *
 */
module.exports.postJob = function(req, res) {

    var sts = rdk.httpstatus.created;
    var aj = {};
    var url = '';
    var match = {};
    var jobname = '';
    var cdsname = '';
    var when = '';
    var interval = '';

    if (req.query.jobname) {
        jobname = req.query.jobname;
        match.jobname = jobname;
    }
    if (!jobname) {
        sts = rdk.httpstatus.not_found;
        res.status(sts).send(
            {
                status: sts,
                error: 'Missing required schedule job name'
            }
        );
        return;
    }
    if (req.query.cdsname) {
        cdsname = req.query.cdsname;
    }
    if (!cdsname) {
        sts = rdk.httpstatus.not_found;
        res.status(sts).send(
            {
                status: sts,
                error: 'Missing required CDS job name'
            }
        );
        return;
    }
    if (req.query.url) {
        url = req.query.url;
    } else {
        url = cfg.CDSJobURL;
    }
    if (req.query.when) {
        when = req.query.when;
    }
    if (req.query.interval) {
        interval = req.query.interval;
    }

    if(agenda) {

        db.collection('cdsjobs').findOne({
            name: cdsname
        }, function(err, result) {
            if (!result) {
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({
                    status: sts,
                    error: 'CDS Job \'' + cdsname + '\' does not exist'
                });
                return;
            }

            agenda.jobs(match, function(err, result) {
                if (err) {
                    sts = rdk.httpstatus.bad_request;
                    res.status(sts).send({
                        status: sts,
                        error: err
                    });
                    return;
                } else if (result.length !== 0) {
                    sts = rdk.httpstatus.conflict;
                    res.status(sts).send({
                        status: sts,
                        message: 'Job \'' + jobname + '\' exists'
                    });
                    return;
                }
                aj = agenda.create('sendRequest', {
                    cdsname: cdsname,
                    url: url
                });
                aj.attrs.jobname = jobname;

                if (when) {
                    aj.schedule(req.query.when);
                }
                if (interval) {
                    aj.repeatEvery(req.query.interval);
                }
                if (!when) {
                    aj.disable();
                }
                aj.save();
                res.status(sts).send({
                    status: sts,
                    message: 'Send Request queued for ' + cdsname
                });
            });
        });

    } else {

        sts = rdk.httpstatus.service_unavailable;
        res.status(sts).send({ status: sts, error: 'Not connected to database.' });

    }


};


/**
 * Modify a scheduled job
 *
 * @api {put} /resource/cds/schedule/job Modify Job
 *
 * @apiName putJob
 * @apiGroup CDS Scheduler
 *
 * @apiHeader {application/json} Content-Type
 * @apiHeader {json} content Job object
 *
 * @apiParam {String} jobname Job name
 * @apiParam {String} when The time the job is scheduled to run
 * @apiParam {String} interval The frequency of running the job
 * @apiParam {String} enable Enable the job to be queued
 * @apiParam {String} disable Disable the job from being queued
 *
 * @apiSuccess (Success 200) {json} payload update flag
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 Success
 * {
 *     "status": 200,
 *     "payload": 1
 * }
 *
 * @apiError (Error 400) {json} error Missing or invalid field(s)
 * @apiErrorExample Error-Response:
 * HTTP/1.1 400 Bad Request
 * {
 *    "status": 400,
 *    "error": "Missing or invalid field(s)"
 * }
 *
 *
 */
module.exports.putJob = function(req, res) {

    var sts = rdk.httpstatus.ok;
    //var msg = '';
    //var aj = null;
    var disable = null;
    var jobname = '';
    var when = '';
    var interval = '';
    if (req.query.jobname) {
        jobname = req.query.jobname;
    } else {
        sts = rdk.httpstatus.bad_request;
        res.status(sts).send({
            status: sts,
            error: 'Missing required schedule job name'
        });
        return;
    }
    if (req.query.when) {
        when = req.query.when;
    }
    if (req.query.interval) {
        interval = req.query.interval;
    }
    if (req.query.hasOwnProperty('disable')) {
        disable = true;
    } else if (req.query.hasOwnProperty('enable')) {
        disable = false;
    }

    if(agenda) {

        agenda.jobs({
            jobname: jobname
        }, function(err, result) {
            if (result && result.length > 0) {
                var aj = result[0];
                if (disable === true) {
                    aj.disable();
                } else if (disable === false) {
                    aj.enable();
                }
                if (!when && !interval && disable === true) {
                    res.status(sts).send({
                        status: sts,
                        message: 'Job - ' + jobname + ' disabled = ' + disable
                    });
                } else {
                    if (when) {
                        aj.schedule(req.query.when);
                    }
                    if (interval) {
                        aj.repeatEvery(req.query.interval);
                    }
                    res.status(sts).send({
                        status: sts,
                        message: 'Job - ' + jobname + ' updated'
                    });
                }
                aj.save();
            } else {
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({
                    status: sts,
                    error: 'Job - ' + jobname + ' not found'
                });
            }
        });

    } else {

        sts = rdk.httpstatus.service_unavailable;
        res.status(sts).send({ status: sts, error: 'Not connected to database.' });

    }
};


/**
 * Delete a scheduled job
 *
 * @api {delete} /resource/cds/schedule/job?jobname=name Delete Job
 *
 * @apiName deleteJob
 * @apiGroup CDS Scheduler
 *
 * @apiDescription This call deletes a scheduled job.  Either a jobname, an id, or both are required.
 *
 * @apiParam {Number} jobname name of the job
 * @apiParam {Number} id 24 digit HEX number doc id
 *
 * @apiSuccess (Success 200) {Number} payload Delete count
 * @apiSuccessExample Success-Response:
 * HTTP/1.1 200 OK
 * {
 *     "status" 200,
 *     "payload": 1
 * }
 *
 * @apiError (Error 404) {Number} payload The specified job was not found
 * @apiErrorExample Error-Response:
 * HTTP/1.1 404 Not Found
 * {
 *     "error": 404,
 *     "error": "Job not found"
 * }
 *
 */
module.exports.deleteJob = function(req, res) {

    var sts = rdk.httpstatus.ok;
    var jobname = '';
    var match = {};

    if (req.query.jobname) {
        match.jobname = req.query.jobname;
    }
    if (req.query.id && !testId(req.query.id)) {
        match._id = new ObjectId(req.query.id);
    }

    if(!match.hasOwnProperty('jobname') && !match.hasOwnProperty('id')) {
        sts = rdk.httpstatus.bad_request;
        res.status(sts).send({
            status: sts,
            error: 'Missing or invalid required parameter.'
        });
        return;
    }

    if(agenda) {

        agenda.cancel(match, function(err, result) {
            if(err === null) {
                if(result === 0) {
                    sts = rdk.httpstatus.not_found;
                    res.status(sts).send({ status: sts, error: 'Job not found' });
                } else {
                    res.status(sts).send({ status: sts, payload: result });
                }
            } else {
                sts = rdk.httpstatus.not_found;
                res.status(sts).send({ status: sts, error: err });
            }
        });

    } else {

        sts = rdk.httpstatus.service_unavailable;
        res.status(sts).send({ status: sts, error: 'Not connected to database.' });

    }
};

module.exports.apiDocs = apiDocs;

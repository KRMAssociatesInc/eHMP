'use strict';

//----------------------------------------------------------------------------------
// This class handles the code that continuously polls VistA for data that needs
// to be processed.  The data may be a result of a subscription request or new data
// on patients that have already been subscribed.
//
// Author: Les Westberg
//----------------------------------------------------------------------------------

// ------------------ NOTE: ------------------
// The common logic and functionality in
// appointment-trigger-poller.js and
// vista-record-poller.js needs to be
// extracted into a library/utility
// ------------------ NOTE: ------------------

var async = require('async');
var _ = require('underscore');

var logUtil = require(global.VX_UTILS + 'log');
var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var VprUpdateOpData = require(global.VX_UTILS + 'VprUpdateOpData');
var mapUtil = require(global.VX_UTILS + 'map-utils');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');

//---------------------------------------------------------------------------------
// Constructor for this class - This class inherits from events.EventEmitter. (REMOVAL PENDING)
//
// log: The log to use when logging messages.
// vistaId: The site code for the site associated with this poller.
// config: The general configuration information.
// environment: Cross cutting environment handles, etc.
// start: if this coerces to 'true', then the poller will start automatically
//      when the Poller is instantiated.
//----------------------------------------------------------------------------------
var Poller = function(log, vistaId, config, environment, start) {
    this.vistaId = vistaId;
    this.environment = environment;
    this.config = config;
    this.log = logUtil.getAsChild('vistaRecordPoller-' + vistaId, log);
    this.paused = !start;
    this.pollDelayMillis = 1000;
    this.lastUpdateTime = '0';
    this.vprUpdateOpData = new VprUpdateOpData(this.log, vistaId, environment.jds);
    this.vistaProxy = new VistaClient(log, config);
};

//-----------------------------------------------------------------------------------
// This method starts the polling process.
//
// callback: The callback handler to call when the process is started.
//-----------------------------------------------------------------------------------
Poller.prototype.start = function(callback) {
    var self = this;
    self._getLastUpdateTimeFromJds(function(error, response) {
        // If we have an error here - we need to stop what we are doing - it is fatal.
        //-----------------------------------------------------------------------------
        if (error) {
            self.log.error('vista-record-poller.start: Failed to retrieve last update time from JDS.  error: %s; response: %s', error, response);
            return callback('vista-record-poller.start: Failed to retrieve last update time from JDS.  error: ' + error, response);
        }

        self.log.debug('vista-record-poller.start: Received infromation lastUpdateTime from jds.  response: %s', response);

        if (response) {
            self.lastUpdateTime = response;
        }

        // Now that we have primed our lastUpdateTime - we can now proceed to poll VistA
        //------------------------------------------------------------------------------

        self.log.trace('vista-record-poller.start: poller started');
        self.doNext();

        // TODO: Pick this value up from JDS
        //----------------------------------
        callback(null, 'success');
    });
};

//--------------------------------------------------------------------------------------
// This method pauses the polling process.
//--------------------------------------------------------------------------------------
Poller.prototype.pause = function() {
    this.log.debug('vista-record-poller.pause()');
    this.paused = true;
};

//--------------------------------------------------------------------------------------
// This method resumes the polling process.
//--------------------------------------------------------------------------------------
Poller.prototype.resume = function() {
    this.log.debug('vista-record-poller.resume()');
    this.paused = false;
};

//--------------------------------------------------------------------------------------
// This method resets the lastUpdatedTime to '0'.
//--------------------------------------------------------------------------------------
Poller.prototype.reset = function() {
    this.log.debug('vista-record-poller.reset()');
    this.lastUpdateTime = '0';
};


Poller.prototype.getStatus = function() {
    this.log.debug('vista-record-poller.getStatus()');

    return {
        vista: this.vistaId,
        status: this.paused ? 'paused' : 'running',
        lastUpdateTime: this.lastUpdateTime
    };
};


//--------------------------------------------------------------------------------------
// This method is run every time the 'next' event is fired.
//--------------------------------------------------------------------------------------
Poller.prototype.doNext = function() {
    if (this.paused) {
        this.log.debug('vista-record-poller.doNext: paused == true, SKIPPING Polling for new batch of data from vista [%s]', this.vistaId);
        return poll(this, this.pollDelayMillis);
        // return waitAndThenPoll(this);
    }

    this.log.debug('vista-record-poller.doNext: Polling for new batch of data from vista [%s]', this.vistaId);
    this.vistaProxy.fetchNextBatch(this.vistaId, this.lastUpdateTime, this._processResponse.bind(this));
};

//------------------------------------------------------------------------------------------------
// This method processes the response that was received from the VistA system.  This is
// method is called as a result of a callback on the Vista - fetchNextBatch method.
//
// error: The error that occured when fetching the data from VistA - or null if no error occurred.
// data: The data that was received from VistA.
//-------------------------------------------------------------------------------------------------
Poller.prototype._processResponse = function(error, data) {
    var self = this;

    if (error) {
        self.log.warn('vista-record-poller.processResponse: Failed to invoke vista [%s]', error);
        return poll(this, self.pollDelayMillis);
        // waitAndThenPoll(self);
    }

    self.log.debug('vista-record-poller.processResponse: Received batch of data.  Length: [%s];  data: [%j]', data.totalItems, data);
    if (data && data.items && data.items.length > 0) {
        self._processBatch(data, function(error, result) {
            self.log.debug('vista-record-poller.processResponse: Returned from calling _processBatch.  Error: %s; result: %s', error, result);
            if (!result) {
                result = error;
                error = undefined;
            }

            if (error) {
                self.log.warn('vista-record-poller.processResponse: Failed to process records [%s]', error);

                // hmmm, what should we do...?
                poll(self, this.pollDelayMillis);
            } else {
                self.log.debug('vista-record-poller.processResponse: Finished process batch of data');
                poll(self);
            }
        });
    } else {
        poll(self, this.pollDelayMillis);
    }
};

//-------------------------------------------------------------------------------------------
// When a vista response contains a batch of data to be processed, it will call this function
// to process the batch.  There are three kinds of messages to be processed.  The message
// type is contained in the 'collection' attribute of the item.  SyncStart
// messages signal the start of a sync, syncStatus messages signal the end of a sync, and
// all the rest are the actual data items.
//
// data: The data node of the response that was received from VistA.
// callback: The function to call when the batch has been processed.
//-------------------------------------------------------------------------------------------
Poller.prototype._processBatch = function(data, callback) {
    var self = this;
    self.log.debug('vista-record-poller._processBatch: processing batch of records');

    // Pull out the syncStart jobs
    //----------------------------
    var syncStartJobs = _.filter(data.items, function(item) {
        return (item.collection === 'syncStart');
    });
    if (syncStartJobs) {
        self.log.debug('vista-record-poller._processBatch: Have %d syncStartJobs.', syncStartJobs.length);
    }

    // Pull out the OPDsyncStart jobs
    //----------------------------
    var OPDsyncStartJobs = _.filter(data.items, function(item) {
        return (item.collection === 'OPDsyncStart');
    });
    if (OPDsyncStartJobs) {
        self.log.debug('vista-record-poller._processBatch: Have %d OPDsyncStartJobs.', OPDsyncStartJobs.length);
    }

    // Pull out the syncStatus (Sync Complete) jobs
    //---------------------------------------------
    var syncStatusJobs = _.filter(data.items, function(item) {
        return (item.collection === 'syncStatus');
    });
    if (syncStatusJobs) {
        self.log.debug('vista-record-poller._processBatch: Have %d syncStatusJobs.', syncStatusJobs.length);
    }

    // Pull out the jobs that represent vista data
    //-----------------------------------------------
    var vistaDataJobs = _.filter(data.items, function(item) {
        return ((item.collection !== 'syncStart') && (item.collection !== 'OPDsyncStart') && (item.collection !== 'syncStatus'));
    });
    if (vistaDataJobs) {
        self.log.debug('vista-record-poller._processBatch: Have %d vistaDataJobs.', vistaDataJobs.length);
    }

    var tasks = [
        self._processSyncStartJobs.bind(self, syncStartJobs),
        self._processOPDSyncStartJobs.bind(self, OPDsyncStartJobs),
        self._processVistaDataJobs.bind(self, vistaDataJobs),
        self._storeLastUpdateTime.bind(self, data)
    ];

    // Process all the jobs that we have received
    //--------------------------------------------
    async.series(tasks, function(error, response) {
        self.log.debug('vista-record-poller._processBatch: Completed processing all the jobs.  error: %s; response: %j', error, response);
        return callback(error, response);
    });
};

//-------------------------------------------------------------------------------------------------
// This method processes all of the syncStartJobs.
//
// syncStartJobs: The array of syncStartJobs
// callback: The handler to call when we are done processing the jobs.
//-------------------------------------------------------------------------------------------------
Poller.prototype._processSyncStartJobs = function(syncStartJobs, callback) {
    var self = this;

    if (syncStartJobs) {
        self.log.debug('vista-record-poller._processSyncStartJobs: Processing %d syncStartJobs.', syncStartJobs.length);

        var tasks = _.map(syncStartJobs, function(syncStartJob) {
            return self._processSyncStartJob.bind(self, syncStartJob);
        }, [null, undefined]);

        async.series(tasks, function(error, response) {
            self.log.debug('vista-record-poller._processSyncStartJobs: Completed processing all the syncStart jobs.  error: %s; response: %j', error, response);
            return callback(error, response);
        });
    } else {
        self.log.debug('vista-record-poller._processSyncStartJobs: There are no syncStart jobs to process.');
        return setTimeout(callback, 0, null, ''); // Not an error condition - just nothing to do.
    }

};

//-------------------------------------------------------------------------------------------------
// This method processes all of the OPDsyncStartJobs.
//
// syncStartJobs: The array of OPDsyncStartJobs
// callback: The handler to call when we are done processing the jobs.
//-------------------------------------------------------------------------------------------------
Poller.prototype._processOPDSyncStartJobs = function(OPDsyncStartJobs, callback) {
    var self = this;

    if (OPDsyncStartJobs) {
        self.log.debug('vista-record-poller._processOPDSyncStartJobs: Processing %d OPDsyncStartJobs.', OPDsyncStartJobs.length);

        var tasks = _.map(OPDsyncStartJobs, function(OPDsyncStartJob) {
            return self._processOPDSyncStartJob.bind(self, OPDsyncStartJob);
        }, [null, undefined]);

        async.series(tasks, function(error, response) {
            self.log.debug('vista-record-poller._processOPDSyncStartJobs: Completed processing all the OPDsyncStart jobs.  error: %s; response: %j', error, response);
            return callback(error, response);
        });
    } else {
        self.log.debug('vista-record-poller._processOPDSyncStartJobs: There are no OPDsyncStart jobs to process.');
        return setTimeout(callback, 0, null, ''); // Not an error condition - just nothing to do.
    }
};

//------------------------------------------------------------------------------------------
// This method processes a single syncStart job.
//
// self: A handle to the correct 'this' object.
// syncStartJob: A sync start job to process.
// callback: The handler to call when we are done processing the jobs.
//------------------------------------------------------------------------------------------
Poller.prototype._processSyncStartJob = function(syncStartJob, callback) {
    var self = this;
    self.log.debug('vista-record-poller._processSyncStartJob: Processing syncStartJob [%j].', syncStartJob);

    // Get the PID that we are dealing with.
    //--------------------------------------
    // console.log('syncStartJob: pid: %s syncStartJob: [%j]', syncStartJob.pid, syncStartJob);
    if (!syncStartJob.pid) {
        self.log.error('vista-record-poller._processSyncStartJob: Failed to process - syncStart did not contain a pid.');

        // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
        //--------------------------------------------------------------------------------------------------------------------------
        //return setTimeout(callback, 0, 'Failed to process syncStart - there was no pid in the message.');

        return setTimeout(callback, 0, null, 'FailedNoPid');
    }
    var patientIdentifier = idUtil.create('pid', syncStartJob.pid);

    var tasks = [];

    // If we received a meta-stamp then we need a task to store it.
    //-------------------------------------------------------------
    if (_.isObject(syncStartJob.metaStamp)) {
        tasks = tasks.concat(self._storeMetaStamp.bind(self, syncStartJob.metaStamp, patientIdentifier));
    } else {
        self.log.info('vista-record-poller._processSyncStartJob: Received a syncStart job that did not contain a metaStamp.  Means the patient has no data on this VistA site. pid: %s.', syncStartJob.pid);
    }

    //Store completed job only if the job isn't an unsolicted update
    //Unsolicited updates won't include rootJobId or jobId
    //---------------------------------------------------------------------------
    if (syncStartJob.rootJobId && syncStartJob.jobId) {
        self.log.trace('vista-record-poller._processSyncStartJob: syncStartJob contains rootJobId and jobId; is not an unsolicited update.  pid: %s', syncStartJob.pid);
        tasks.push(self._storeCompletedJob.bind(self, syncStartJob.rootJobId, syncStartJob.jobId, patientIdentifier));
    } else {
        self.log.trace('vista-record-poller._processSyncStartJob: syncStartJob was received as an unsolicited update. No job status to store. pid: %s', syncStartJob.pid);
    }

    // Process all the jobs that we have received
    //--------------------------------------------
    if (!_.isEmpty(tasks)) {
        async.series(tasks, function(error, response) {
            self.log.debug('vista-record-poller._processSyncStartJob: Completed processing syncStartJob. pid: %s; error: %s; response: %j', syncStartJob.pid, error, response);
            return callback(error, response);
        });
    } else {
        // We have nothing to do... We are good to go...
        //----------------------------------------------
        self.log.debug('vista-record-poller._processSyncStartJob: There was no metastamp to store or no job to complete. pid: %s', syncStartJob.pid);
        return setTimeout(callback, 0, null, null);
    }
};

//------------------------------------------------------------------------------------------
// This method processes a single OPDsyncStart job.
//
// self: A handle to the correct 'this' object.
// OPDsyncStartJob: A sync start job to process.
// callback: The handler to call when we are done processing the jobs.
//------------------------------------------------------------------------------------------

Poller.prototype._processOPDSyncStartJob = function(OPDsyncStartJob, callback) {
    var self = this;
    self.log.debug('vista-record-poller._processOPDSyncStartJob: Processing OPDsyncStartJob [%j].', OPDsyncStartJob);
    if (!OPDsyncStartJob.metaStamp) {
        self.log.error('vista-record-poller._processOPDSyncStartJob: Failed to process - OPDsyncStart did not contain a metaStamp for systemId: %s.', OPDsyncStartJob.systemId);

        // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
        //--------------------------------------------------------------------------------------------------------------------------
        // return setTimeout(callback, 0, util.format('Failed to process syncStart for pid: %s.  There was no metaStamp in the message.', syncStartJob.pid));

        return setTimeout(callback, 0, null, 'FailedNoMetaStamp');
    }

    var tasks = [
        self._storeOperationalMetaStamp.bind(self, OPDsyncStartJob.metaStamp, OPDsyncStartJob.systemId) //,

        // TODO:  Store completed job once rootJobId and jobId can be received in the operational data sync start message
        //--------------------------------------------------------------------------------------------------------------------------
        //self._storeCompletedJob.bind(self, OPDsyncStartJob.rootJobId, OPDsyncStartJob.jobId, OPDsyncStartJob.systemId)
    ];

    // Process all the jobs that we have received
    //--------------------------------------------
    async.series(tasks, function(error, response) {
        self.log.debug('vista-record-poller._processOPDSyncStartJob: Completed processing OPDsyncStartJob.  error: %s; response: %j', error, response);
        return callback(error, response);
    });
};

//------------------------------------------------------------------------------------------
// This method processes a single syncStart job.
//
// metaStamp: The meta stamp to be stored.
// patientIdentifier: The patient identifier associated with this job.
// callback: The handler to call when we are done processing the jobs.
//------------------------------------------------------------------------------------------
Poller.prototype._storeMetaStamp = function(metaStamp, patientIdentifier, callback) {
    var self = this;
    self.log.debug('vista-record-poller._storeMetaStamp: Storing metaStamp: %s; patientIdentifier: %j', metaStamp, patientIdentifier);

    // Store the metaStamp to JDS
    //----------------------------
    self.environment.jds.saveSyncStatus(metaStamp, patientIdentifier, function(error, response) {
        self.log.debug('vista-record-poller._storeMetaStamp: Returned from storing patient metaStamp for pid: %s.  Error: %s;  Response: %j', patientIdentifier.value, error, response);
        if (error) {
            self.log.error('vista-record-poller._storeMetaStamp:  Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', patientIdentifier.value, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            //return callback(util.format('Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsError');
        }

        if (!response) {
            self.log.error('vista-record-poller._storeMetaStamp:  Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', patientIdentifier.value, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsNoResponse');
        }

        if (response.statusCode !== 200) {
            self.log.error('vista-record-poller._storeMetaStamp:  Failed to store metaStamp for pid: %s - incorrect status code returned. Error: %s;  Response: %j; metaStamp:[%j]', patientIdentifier.value, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsWrongStatusCode');
        }

        return callback(null, 'success');
    });
};

//------------------------------------------------------------------------------------------
// This method stores an operational data metastamp via the jds client.
//
// metaStamp: The meta stamp to be stored.
// patientIdentifier: The patient identifier associated with this job.
// callback: The handler to call when we are done processing the jobs.
//------------------------------------------------------------------------------------------
Poller.prototype._storeOperationalMetaStamp = function(metaStamp, siteId, callback) {
    var self = this;
    self.log.debug('vista-record-poller._storeOperationalMetaStamp: Storing metaStamp: %s; siteId: %j', metaStamp, siteId);

    // Store the metaStamp to JDS
    //----------------------------
    self.environment.jds.saveOperationalSyncStatus(metaStamp, siteId, function(error, response) {
        self.log.debug('vista-record-poller._storeOperationalMetaStamp: Returned from storing patient metaStamp for pid: %s.  Error: %s;  Response: %j', siteId, error, response);
        if (error) {
            self.log.error('vista-record-poller._storeOpeationalMetaStamp:  Received error while attempting to store metaStamp for site: %s.  Error: %s;  Response: %j; metaStamp:[%j]', siteId, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            //return callback(util.format('Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsError');
        }

        if (!response) {
            self.log.error('vista-record-poller._storeOperationalMetaStamp:  Failed to store metaStamp for site: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', siteId, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsNoResponse');
        }

        if (response.statusCode !== 200) {
            self.log.error('vista-record-poller._storeOperationalMetaStamp:  Failed to store metaStamp for site: %s - incorrect status code returned. Error: %s;  Response: %j; metaStamp:[%j]', siteId, error, response, metaStamp);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsWrongStatusCode');
        }

        return callback(null, 'success');
    });
};

//------------------------------------------------------------------------------------------
// This method processes a single syncStart job.
//
// rootJobId: The Job Id of the job that started the sync for this patient.
// jobId: The job Id that represents this specific poller job.
// patientIdentifier: The patient identifier associated with this job.
// callback: The handler to call when we are done processing the jobs.
//------------------------------------------------------------------------------------------
Poller.prototype._storeCompletedJob = function(rootJobId, jobId, patientIdentifier, callback) {
    var self = this;
    self.log.debug('vista-record-poller._storeCompletedJob: Storing completed job.  rootJobId: %s; jobId: %s, patientIdentifier: %j', rootJobId, jobId, patientIdentifier);

    // First thing we need to do is to retrieve the JPID for this patient.  It is a requirement for the Job.
    //------------------------------------------------------------------------------------------------------
    self.environment.jds.getPatientIdentifierByPid(patientIdentifier.value, function(error, response, result) {
        self.log.debug('vista-record-poller._storeCompletedJob: Received response from getPatientIdentifierByPid.  error: %s; response: %j; result: %j', error, response, result);
        if (error) {
            self.log.error('vista-record-poller._storeCompletedJob:  Received error while retrieving patient identifiers for pid: %s; error: %s; response: %j', patientIdentifier.value, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            //return callback(util.format('Received error while attempting to store metaStamp for pid: %s.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsError');
        }

        if (!response) {
            self.log.error('vista-record-poller._storeCompletedJob:  Failed to retrieve patient identifiers for pid: %s; error: %s; response: %j', patientIdentifier.value, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - no response returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsNoResponse');
        }

        if (response.statusCode !== 200) {
            self.log.error('vista-record-poller._storeCompletedJob:  Failed to retrieve patient identifiers for pid: %s - incorrect status code returned. Error: %s;  Response: %j', patientIdentifier.value, error, response);

            // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
            //--------------------------------------------------------------------------------------------------------------------------
            // return callback(util.format('Failed to store metaStamp for pid: %s - incorrect status code returned.  Error: %s;  Response: %j; metaStamp:[%j]', syncStartJob.pid, error, response, syncStartJob.metaStamp), null);

            return callback(null, 'FailedJdsWrongStatusCode');
        }

        if ((!result) || (!result.jpid)) {
            self.log.error('vista-record-poller._storeCompletedJob:  Result for pid: %s did not contain jpid.  Result: %j', patientIdentifier.value, error, result);
            return callback(null, 'FailedNoJpidInResult');
        }

        // We have successful response...  Now store the completed job...
        //---------------------------------------------------------------
        var record = null;
        var eventUid = null;
        var meta = {
            rootJobId: rootJobId,
            jpid: result.jpid,
            jobId: jobId
        };

        self.log.debug('vista-record-poller._storeCompletedJob: before creating job.  meta: %j', meta);
        var pollerJob = jobUtil.createVistaPollerRequest(self.vistaId, patientIdentifier, record, eventUid, meta);
        self.log.debug('vista-record-poller._storeCompletedJob: preparing to write job: %j', pollerJob);
        self.environment.jobStatusUpdater.completeJobStatus(pollerJob, function(error, response, result) {
            self.log.debug('vista-record-poller._storeCompletedJob:  Response from JobStatusUpdater.completeJobStatus for pid: %s.  error: %s; response: %j; result: %j', patientIdentifier.value, error, response, result);
            // Note - right now JDS is returning an error 200 if things worked correctly.   So
            // we need to absorb that error.
            //--------------------------------------------------------------------------------
            if (error) {
                self.log.error('vista-record-poller._storeCompletedJob:  Received error while storing job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result);

                // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                //--------------------------------------------------------------------------------------------------------------------------
                //return callback(util.format('Received error while storing job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result), null);

                return callback(null, 'FailedJdsError');
            }

            if (!response) {
                self.log.error('vista-record-poller._storeCompletedJob:  Failed to store job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result);

                // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                //--------------------------------------------------------------------------------------------------------------------------
                // return callback(util.format('Failed to store job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result), null);

                return callback(null, 'FailedJdsNoResponse');
            }

            if (response.statusCode !== 200) {
                self.log.error('vista-record-poller._storeCompletedJob:  Failed to store job - incorrect status code.  job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result);

                // TODO:   Push this to an error message location.  We do not want to error out the entire set of messages for one problem.
                //--------------------------------------------------------------------------------------------------------------------------
                // return callback(util.format('Failed to store job - incorrect status code.  job: %j pid: %s; error: %s; response: %j; result: %j', pollerJob, patientIdentifier.value, error, response, result), null);

                return callback(null, 'FailedJdsWrongStatusCode');
            }

            return callback(null, 'success');
        });
    });
};

//-------------------------------------------------------------------------------------------
// This method processes the set of patient or operational Data Jobs.
//
// vistaDataJobs: An array of patient or operational data jobs to be processed.
// callback: The handler to call when we are done processing the jobs.
//-------------------------------------------------------------------------------------------
Poller.prototype._processVistaDataJobs = function(vistaDataJobs, callback) {
    var self = this;

    if (vistaDataJobs) {
        self.log.debug('vista-record-poller._processVistaDataJobs: Processing %d vistaDataJobs.', vistaDataJobs.length);

        var jobsToPublish = mapUtil.filteredMap(vistaDataJobs, function(vistaDataJob) {
            return self._buildVistaDataJob.bind(self, vistaDataJob).call();
        }, [undefined, null]);

        self.log.trace('vista-record-poller._processVistaDataJobs: publishing %s child jobs', jobsToPublish.length);
        // console.log('Environment: %j', self.environment);
        // console.log('JobsToPublish: %j', jobsToPublish);
        self.environment.publisherRouter.publish(jobsToPublish, function(error) {
            if (error) {
                self.log.error('vista-record-poller._processVistaDataJobs: An error occurred when publishing.  error: %s', error);
                return callback(null, 'success');
            }

            self.log.trace('vista-record-poller._processVistaDataJobs: published %s child jobs for processing.', jobsToPublish.length);
            return callback(null, 'success');
        });
    } else {
        self.log.debug('vista-record-poller._processVistaDataJobs: There are no patient data jobs to process.');
        return setTimeout(callback, 0, null, ''); // Not an error condition - just nothing to do.
    }
};

//---------------------------------------------------------------------------------------------
// This method creates a job for one patient or operational data record and places it in the
// appropriate tube.
//
// vistaDataJob: The patient or operational data job to be processed.
//---------------------------------------------------------------------------------------------
Poller.prototype._buildVistaDataJob = function(vistaDataJob) {
    var self = this;
    self.log.debug('vista-record-poller._buildVistaDataJob: Processing vistaDataJob [%j].', vistaDataJob);

    if (!vistaDataJob.object) {
        self.log.warn('vista-record-poller._buildVistaDataJob:  The object node did not exist.');
        return null;
    }

    if (!isOperationalData(vistaDataJob)) {
        self.log.debug('vista-record-poller._buildVistaDataJob: Job is patient data.');

        var patientIdentifier = {
            type: 'pid',
            value: vistaDataJob.pid
        };

        var vistaObjectNode = vistaDataJob.object;
        vistaObjectNode.pid = vistaDataJob.pid;

        return jobUtil.createVistaPrioritizationRequest(patientIdentifier, vistaDataJob.collection, vistaObjectNode, {});
    }

    if (vistaDataJob.error) {
        self.log.error('vista-record-poller._buildVistaDataJob: Error in VPR update data: ' + vistaDataJob.error);
        return null;
    }

    // } else if(vistaDataJob.deletes) {
    //     //TODO build delete job

    if (!vistaDataJob.deletes) {
        self.log.debug('vista-record-poller._buildVistaDataJob: Job is operational data.');
        return jobUtil.createOperationalDataStore(vistaDataJob.object);
    }
};

//----------------------------------------------------------------------------------------------------
// This method retrieves the last update time from JDS.
//
// callback: The callback handler to call when the data comes back from JDS.  On successful call
//           the response will contain a string which is the lastUpdateTime value.
//----------------------------------------------------------------------------------------------------
Poller.prototype._getLastUpdateTimeFromJds = function(callback) {
    var self = this;
    self.vprUpdateOpData.retrieveLastUpdateTime(function(error, response) {
        self.log.debug('vista-record-poller._getLastUpdateTimeFromJds: Received error: %s; response: %s', error, response);
        callback(error, response);
    });
};

//----------------------------------------------------------------------------------------------------
// This method stores the last update time to JDS for this site.
//
// lastUpdateTime: The last update time in VistA internal format to be stored.
// callback: The callback handler to call when the data comes back from JDS.
//----------------------------------------------------------------------------------------------------
Poller.prototype._storeLastUpdateTimeToJds = function(lastUpdateTime, callback) {
    var self = this;
    self.vprUpdateOpData.storeLastUpdateTime(lastUpdateTime, function(error, response) {
        self.log.debug('vista-record-poller._storeLastUpdateTimeToJds: Received error: %s; response: %s', error, response);
        callback(error, response);
    });
};

//---------------------------------------------------------------------------------------------
// This method stores the last update time that was received in the message to JDS.
//
// data: The data that was returned from Vista
// callback: The callback handler to call when we are done.
//---------------------------------------------------------------------------------------------
Poller.prototype._storeLastUpdateTime = function(data, callback) {
    var self = this;
    if ((data) && (data.lastUpdate)) {
        self.log.debug('vista-record-poller._storeLastUpdateTime: Storing new lastUpdateTime: %s', data.lastUpdate);
        self._storeLastUpdateTimeToJds(data.lastUpdate, function(error, response) {
            if (error) {
                return callback(error, response);
            }
            self.lastUpdateTime = data.lastUpdate;
            return callback(null, 'success');
        });
    } else {
        self.log.error('vista-record-poller._storeLastUpdateTime: The message from VistA did not contain lastUpdate so no new lastUpdateTime will be stored.');
        return setTimeout(callback, 0, null, 'success');
    }
};

//--------------------------------------------------------------------------------
// Checks to see if the record contains operational data.
//   (logic taken from eHMP VistaVprDataExtractEvent)
//
// vistaDataJob: The patient or operational data job to be processed.
//--------------------------------------------------------------------------------
function isOperationalData(vistaDataJob) {
    if (!vistaDataJob) {
        return false;
    }
    var domainName = vistaDataJob.collection || '';
    var pid = vistaDataJob.pid || null;
    return ((domainName.toLowerCase() === 'pt-select') || !pid);
}


function poll(instance, pollDelayMillis) {
    // setTimeout(instance.emit.bind(instance, 'next'), pollDelayMillis);
    setTimeout(instance.doNext.bind(instance), pollDelayMillis);
}


module.exports = Poller;
Poller._isOperationalData = isOperationalData;
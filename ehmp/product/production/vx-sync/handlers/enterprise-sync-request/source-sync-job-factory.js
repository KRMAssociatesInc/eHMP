'use strict';

var _ = require('underscore');

var inspect = require(global.VX_UTILS + 'inspect');

var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var jobUtil = require(global.VX_UTILS + 'job-utils');
var logUtil = require(global.VX_UTILS + 'log');
var SyncRulesEngine = require(global.VX_SYNCRULES + '/rules-engine');

var JobMiddleware = require(global.VX_UTILS + 'middleware/job-middleware');

//--------------------------------------------------------------------------
// Constructor for the SourceSyncJobFactory.
//
// log: The logger to be used.
// config: The configuration information.
// job: The job that triggered the handler using this object.
// environment: The environment information (cross cutting information)
//-------------------------------------------------------------------------
function SourceSyncJobFactory(log, config, job, environment) {
    if (!(this instanceof SourceSyncJobFactory)) {
        return new SourceSyncJobFactory(log, config, job, environment);
    }
    var jobMiddleware = new JobMiddleware(log, config, environment);
    this.primaryJobVerifier = jobMiddleware.jobVerification.bind(null, [], {}); // Any record exists we consider patient synced.
    this.secondaryJobVerifier = jobMiddleware.jobVerification.bind(null, ['completed'], {}); //  Allows for resync on secondary site - if the state is in completed state

    if ((environment) && (environment.jobStatusFunction)) {
        this.jobStatus = environment.jobStatusFunction;
    }
    else {
        this.jobStatus = jobMiddleware.getJobHistory.bind(null, {});
    }

    this.engine = new SyncRulesEngine(log, config, environment);
    this.log = logUtil.getAsChild('source-sync-job-factory', log);
    this.jobMiddleware = jobMiddleware;
    this.config = config;
    this.job = job;
}

//--------------------------------------------------------------------------------------------------------
// Using the given identifiers, this routine creates jobs to sync the systems associated by those
// identifiers.  If the system is already synced, being synced, or in the case of a secondary system,
// has been synced recent enough, it will not send a sync request for that system.
//
// patientIdentifiers:  This is an array of patientIdentifier objects
// callback: This is the callback handler that is called when it is done.
//--------------------------------------------------------------------------------------------------------
SourceSyncJobFactory.prototype.createVerifiedJobs = function(patientIdentifiers, callback) {
    var self = this;
    self.log.debug('source-sync-job-factory.createVerifiedJobs: SourceSyncJobFactory.createVerifiedJobs().  patientIdentifiers that we are starting with.  patientIdentifiers: %j', patientIdentifiers);

    self.engine.getSyncPatientIdentifiers(patientIdentifiers, self.job.forceSync, function(err, patientIdentifiers){
        self.log.debug('source-sync-job-factory.createVerifiedJobs: patientIdentifiers returned from rules engine.  patientIdentifiers: %j', patientIdentifiers);
        var jobsToPublish = createJobsToPublish(self, patientIdentifiers);
        callback(null, jobsToPublish);
    });
};

//---------------------------------------------------------------------------------------
// This method creates a sync job for the systems associated with each patientIdentifier
// and places it in the return array.
//
// self: A handle to the "this" pointer.
// patientIdentifiers:  This is an array of patientIdentifier objects
// returns: The array of sync jobs that was created.
//---------------------------------------------------------------------------------------
function createJobsToPublish(self, patientIdentifiers) {
    self.log.debug('source-sync-job-factory.createJobsToPublish: Entered method.  patientIdentifiers: %j', patientIdentifiers);

    var pidList = idUtil.extractIdsOfTypes(patientIdentifiers, 'pid');
    self.log.debug('source-sync-job-factory.createJobsToPublish: PID identifiers in the list: %j', pidList);

    var vistaPidList = removeNonPrimaryVistaSites(self, pidList);
    self.log.debug('source-sync-job-factory.createJobsToPublish: PID identifiers for primary VistA sites in the list: %j', vistaPidList);

    var icnList = idUtil.extractIdsOfTypes(patientIdentifiers, 'icn');
    self.log.debug('source-sync-job-factory.createJobsToPublish: ICN identifiers in the list: %j', icnList);

    var dodList = idUtil.extractPidBySite(patientIdentifiers, 'DOD');
    self.log.debug('source-sync-job-factory.createJobsToPublish: DOD identifiers in the list: %j', dodList);

    var hdrList = idUtil.extractPidBySite(patientIdentifiers, 'HDR');
    self.log.debug('source-sync-job-factory.createJobsToPublish: HDR identifiers in the list: %j', hdrList);

    var vlerList = idUtil.extractPidBySite(patientIdentifiers, 'VLER');
    self.log.debug('source-sync-job-factory.createJobsToPublish: VLER identifiers in the list: %j', vlerList);

    var pgdList = idUtil.extractPidBySite(patientIdentifiers, 'DAS');
    self.log.debug('source-sync-job-factory.createJobsToPublish: DAS (pgd) identifiers in the list: %j', pgdList);

    var jobs = [];

    // Create the jobs for the VistA sites
    //--------------------------------------
    if ((vistaPidList) && (vistaPidList.length >= 1)) {
        jobs = jobs.concat(createVistaJobs(self, vistaPidList));
    }

    // If we have an ICN then create the jobs for the secondary sites.
    //---------------------------------------------------------------
    if (icnList.length > 0) {
        if ((dodList) && (dodList.length >= 1)) {
            jobs = jobs.concat(createJmeadowsJob(self, _.first(dodList)));
        }

        if ((hdrList) && (hdrList.length >= 1)) {
             jobs = jobs.concat(createHdrJob(self, _.first(hdrList)));
        }

         if ((vlerList) && (vlerList.length >= 1)) {
             self.log.debug('source-sync-job-factory.createJobsToPublish: VLER identifiers in the list: %j', vlerList);
             jobs = jobs.concat(createVlerJob(self, _.first(vlerList)));
         }

        // if ((pgdList) && (pgdList.length >= 1)) {
        //     jobs = jobs.concat(createVlerJob(self, _.first(vlerList)));
        // }
    }


    self.log.debug('source-sync-job-factory.createJobsToPublish: Prepared sync jobs: %j', jobs);
    return jobs;
}

//---------------------------------------------------------------------------------------
// This method looks through the array of patientidentifiers and creates a list of only
// those patientIdentifier objects containing a pid that is for one of the primary
// VistA sites.
//
// self: A handle to the this pointer
// patientIdentifiers:  This is an array of patientIdentifier objects
// returns: The array of patientIdentifier objects that are for primary VistA sites.
//---------------------------------------------------------------------------------------
function removeNonPrimaryVistaSites(self, patientIdentifiers) {
    var primaryVistaSites = self.config.vistaSites;
    primaryVistaSites = _.isArray(primaryVistaSites) ? primaryVistaSites : _.keys(primaryVistaSites);
    self.log.debug('source-sync-job-factory.removeNonPrimaryVistaSites :',inspect(primaryVistaSites));
    return _.filter(patientIdentifiers, function(patientId) {
        return patientId.type === 'pid' && _.contains(primaryVistaSites, idUtil.extractSiteFromPid(patientId.value));
    });
}

//--------------------------------------------------------------------------------------------
// This method creates a sync job for each  VistA site in the given patientIdentifiers array.
//
// self: A handle to the this pointer.
// patientIdentifiers: This is an array of patientIdentifier objects for VistA sites.
// returns: An array of vista sync jobs that were created.
//--------------------------------------------------------------------------------------------
function createVistaJobs(self, patientIdentifiers) {
    return _.map(patientIdentifiers, function(patientId) {
        var meta;
        if (self.job) {
            meta = {
                jpid: self.job.jpid,
                rootJobId: self.job.rootJobId
            };
        }
        var newJob = jobUtil.createVistaSubscribeRequest(idUtil.extractSiteFromPid(patientId.value), patientId, meta);
        return newJob;
    });
}

//--------------------------------------------------------------------------------------------
// This method creates a VLER sync job for the patient in the patientIdentifier object.
//
// self: A handle to the this pointer.
// patientIdentifier: This is patientIdentifier containing the PID for VLER.
// returns: The VLER sync jobs that was created.
//--------------------------------------------------------------------------------------------
function createVlerJob(self, patientIdentifier) {
    var meta;
    if (self.job) {
        meta = {
            jpid: self.job.jpid,
            rootJobId: self.job.rootJobId
        };
    }
    var vler = jobUtil.createVlerSyncRequest(patientIdentifier, meta);
    self.log.debug('createVlerJob: sync request: %j with pid: %j', vler, patientIdentifier);
    return vler;
}

//--------------------------------------------------------------------------------------------
// This method creates a PGD sync job for the patient in the patientIdentifier object.
//
// self: A handle to the this pointer.
// patientIdentifier: This is patientIdentifier containing the PID for VLER.
// returns: The PGD sync jobs that was created.
//--------------------------------------------------------------------------------------------
function createPgdJob(self, patientIdentifier) {
    var meta;
    if (self.job) {
        meta = {
            jpid: self.job.jpid,
            rootJobId: self.job.rootJobId
        };
    }
    var pgd = jobUtil.createPgdSyncRequest(patientIdentifier, meta);
    return pgd;
}

//--------------------------------------------------------------------------------------------
// This method creates a HDR sync job for the patient in the patientIdentifier object.
//
// self: A handle to the this pointer.
// patientIdentifier: This is patientIdentifier containing the PID for HDR.
// returns: The HDR sync jobs that was created.
//--------------------------------------------------------------------------------------------
function createHdrJob(self, patientIdentifier) {
    var meta;
    if (self.job) {
        meta = {
            jpid: self.job.jpid,
            rootJobId: self.job.rootJobId
        };
    }
    var hdr = jobUtil.createHdrSyncRequest(patientIdentifier, meta);
    return hdr;
}

//--------------------------------------------------------------------------------------------
// This method creates a DOD (Jmeadows) sync job for the patient in the patientIdentifier object.
//
// self: A handle to the this pointer.
// patientIdentifier: This is patientIdentifier containing the PID for VLER.
// returns: The DOD sync jobs that was created.
//--------------------------------------------------------------------------------------------
function createJmeadowsJob(self, patientIdentifier) {
    var meta;
    if (self.job) {
        meta = {
            jpid: self.job.jpid,
            rootJobId: self.job.rootJobId
        };
    }
    var jMeadows = jobUtil.createJmeadowsSyncRequest(patientIdentifier, meta);
    return jMeadows;
}

//----------------------------------------------------------------------------------------
// This method returns true if the Patient Identifier represents an identifier at a
// secondary site.
//
// patientIdentifier: The patient identifier for a patient.
//----------------------------------------------------------------------------------------
function isSecondarySitePid(patientIdentifier) {
    if (!patientIdentifier) {
        return false;
    }

    if (patientIdentifier.type !== 'pid') {
        return false;
    }

    if (/^DOD;|^HDR;|^VLER;|^DAS;/.test(patientIdentifier.value)) {
        return true;
    }

    return false;
}

//----------------------------------------------------------------------------------------
// This method returns true if the Patient Identifier represents an identifier at a
// Vista site.
//
// patientIdentifier: The patient identifier for a patient.
//----------------------------------------------------------------------------------------
function isVistaSitePid(patientIdentifier) {
    if (!patientIdentifier) {
        return false;
    }

    if (patientIdentifier.type !== 'pid') {
        return false;
    }

    return (!isSecondarySitePid(patientIdentifier));
}

module.exports = SourceSyncJobFactory;
SourceSyncJobFactory._test = {
    '_steps': {
        '_createJobsToPublish': createJobsToPublish
    },
    '_createJobs': {
        '_removeNonPrimaryVistaSites': removeNonPrimaryVistaSites,
        '_createVistaJobs': createVistaJobs,
        '_createVlerJob': createVlerJob,
        '_createPgdJob': createPgdJob,
        '_createHdrJob': createHdrJob,
        '_createJmeadowsJob': createJmeadowsJob
    },
    '_utilityFunctions': {
        '_isSecondarySitePid': isSecondarySitePid,
        '_isVistaSitePid': isVistaSitePid
    }
};
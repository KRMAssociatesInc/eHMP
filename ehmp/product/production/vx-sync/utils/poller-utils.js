'use strict';

require('../env-setup');

var _ = require('underscore');
var _s = require('underscore.string');

var VistaClient = require(global.VX_SUBSYSTEMS + 'vista/vista-client');
var PublisherRouter = require(global.VX_JOBFRAMEWORK + 'publisherRouter');
var JobStatusUpdater = require(global.VX_JOBFRAMEWORK + 'JobStatusUpdater');
var ErrorPublisher = require(global.VX_JOBFRAMEWORK + 'error-publisher');
var JdsClient = require(global.VX_SUBSYSTEMS + 'jds/jds-client');
var SolrClient = require('solr-client');
var Metrics = require(global.VX_UTILS + 'metrics');
var TerminologyUtil = require(global.VX_SUBSYSTEMS + 'terminology/terminology-utils');
var MviClient = require(global.VX_SUBSYSTEMS + 'mvi/mvi-client');
var logUtil = require(global.VX_UTILS + 'log');
var yargs = require('yargs');

var notEmpty = _.negate(_.isEmpty);


function buildEnvironment(logger, config) {
    var metricsLog = new Metrics(config);
    var jds = new JdsClient(logger, metricsLog, config);
    var terminology = new TerminologyUtil(logger, metricsLog, config);
    var environment = {
        vistaClient: new VistaClient(logUtil.getAsChild('vista-client', logger), metricsLog, config, null),
        jobStatusUpdater: {},
        publisherRouter: {},
        errorPublisher: {},
        mvi: new MviClient(logUtil.getAsChild('mvi', logger), metricsLog, config, jds),
        jds: jds,
        metrics: metricsLog,
        terminologyUtils: terminology,
        solr: SolrClient.createClient(config.solrClient)
    };

    environment.jobStatusUpdater = new JobStatusUpdater(logUtil.getAsChild('JobStatusUpdater', logger), config, environment.jds);
    environment.publisherRouter = new PublisherRouter(logUtil.getAsChild('router', logger), config, metricsLog, environment.jobStatusUpdater);
    environment.errorPublisher = new ErrorPublisher(logger, config);
    environment.errorPublisher.connect();

    // Hack around solr-client a little so it runs correctly against our instance
    environment.solr.autoCommit = true;
    environment.solr.UPDATE_JSON_HANDLER = 'update';

    return environment;
}

/*
logger: a bunyan-style logger
config: the worker-config configuration
*/
function parseSubscriberOptions(logger, config) {
    var argv = yargs
        .usage('Usage: $0 [options...]')
        .example('$0 --profile main:3', 'Run 3 instances of the "main" profile.')
        .example('$0 --profile main --profile secondary', 'Run 1 instance each of the "main" and "secondary" profile.')
        .example('$0 --profile main --profile secondary:3', 'Run 1 instance of the "main" profile and 3 instances of the "secondary" profile.')
        .describe('autostart <true|false>', 'If true, automatically starts the poller. Defaults to true.')
        .describe('all-job-types', 'If present, then one process will be created per job type. Any profile parameters will be ignored and any job-type parameters will be additional processes.')
        .describe('profile <profile-name>[:<count>]', 'A handler profile name and number of processes. If this parameter is not used, a value of "default" will be used, unless one or more job-types are given.')
        .describe('job-type <job-type>[:<count>]', 'A job type and number of processes. Note that each job-type will be run in its own process. ' +
            'If it also appears as part of a profile, it will not be run as part of that profile and will run instead as the separate process.')
        .describe('ignore-invalid', 'If a non-existant or invalid profile or job-type is given, it should be ignored.')
        .describe('help', 'This help text.')
        .alias('a', 'autostart')
        .alias('i', 'ignore-invalid')
        .alias('h', 'help')
        .alias('?', 'help')
        .help('h')
        .argv;

    if (argv.help) {
        console.log(yargs.help());
        process.exit(0);
    }

    if (!argv['job-type'] && !argv.profile && !argv['all-job-types']) {
        console.log('You must provide one of more of the following options: "profile", "job-type", "all-job-types"');
        console.log(yargs.help());
        process.exit(1);
    }

    var ignoreInvalid = parseIgnoreInvalid(argv);
    var allJobTypes = parseAllJobTypes(argv);
    var profileMap = !allJobTypes ? parseParamList(argv.profile) : {};

    var allJobTypeList = allJobTypes ? _.keys(config.beanstalk.jobTypes) : [];
    var jobTypeMap = parseParamList(allJobTypeList.concat(argv['job-type'] || []));

    var autostart = parseAutostart(logger, argv);

    var profilesNotFound = findInvalidOptions(config.handlerProfiles.profileCollection, profileMap);
    var jobTypesNotFound = findInvalidOptions(config.beanstalk.jobTypes, jobTypeMap);

    if (checkInvalidOptions(ignoreInvalid, profilesNotFound, jobTypesNotFound)) {
        process.exit(1);
    }

    config = fillOutSpecialProfiles(config);

    stripRedundantJobTypesFromProfiles(config, profileMap, jobTypeMap);
    addJobTypeProfiles(config, profileMap, jobTypeMap);

    var processList = buildProcessList(config, profileMap);

    return {
        profile: argv.profile,
        processList: processList,
        autostart: autostart
    };
}

// Remove invalid profiles and build the processList
function buildProcessList(config, profiles) {
    var processList = _.map(profiles, function(count, profile) {
        return _.times(count, function() {
            return profile;
        });
    });

    return _.filter(_.flatten(processList), function(profile) {
        return notEmpty(config.handlerProfiles.profileCollection[profile]);
    });
}

// Add an entry to profileMap for each entry in jobTypeMap
function addJobTypeProfiles(config, profileMap, jobTypeMap) {
    _.each(jobTypeMap, function(count, jobType) {
        if (config.beanstalk.jobTypes[jobType]) {
            config.handlerProfiles.profileCollection[jobType] = [jobType];
            profileMap[jobType] = count;
        }
    });
}

// Remove jobTypes from profiles if those jobTypes are contained in the jobTypeMap
function stripRedundantJobTypesFromProfiles(config, profileMap, jobTypeMap) {
    _.each(profileMap, function(count, profile) {
        var strippedjobTypeMap = _.filter(config.handlerProfiles.profileCollection[profile], function(jobType) {
            return !_.contains(_.keys(jobTypeMap), jobType);
        });

        config.handlerProfiles.profileCollection[profile] = strippedjobTypeMap;
    });
}

// Fill out profiles that have the string "all" instead of a list of jobTypes
function fillOutSpecialProfiles(config) {
    _.each(config.handlerProfiles.profileCollection, function(value, profile) {
        if (value === 'all') {
            config.handlerProfiles.profileCollection[profile] = _.keys(config.beanstalk.jobTypes);
        }
    });

    return config;
}

// Find invalid profile or type-type option values (i.e. any that aren't defined in the config)
function findInvalidOptions(configList, optionList) {
    var optionsNotFound = [];
    _.each(optionList, function(count, name) {
        if (!_.has(configList, name)) {
            optionsNotFound.push(name);
        }
    });

    return optionsNotFound;
}

function checkInvalidOptions(ignoreInvalid, profilesNotFound, jobTypesNotFound) {
    if (ignoreInvalid) {
        return false;
    }

    var hasInvalid = notEmpty(profilesNotFound) || notEmpty(jobTypesNotFound);

    if (notEmpty(profilesNotFound)) {
        console.log('\nThe following profiles do not exist in the configuration file: ', profilesNotFound.join(', '));
    }

    if (notEmpty(jobTypesNotFound)) {
        console.log('\nThe following job-types do not exist in the configuration file: ', jobTypesNotFound.join(', '));
    }

    if (hasInvalid) {
        console.log();
        console.log('Either remove the invalid values from the options, or run subscriberHost with the --ignore-invalid option');
        console.log();
    }

    return hasInvalid;
}


/*
This is to parse a list of parameters e.g.
--profile primary --profile primary --profile jmeadows,vler --profile storage:2,enrichment

should end up being:
{
    primary: 2,
    jmeadows: 1,
    vler: 1,
    storage: 2,
    enrichment: 1
}
*/
function parseParamList(list) {
    if (_.isEmpty(list)) {
        return {};
    }

    list = !_.isArray(list) ? [list] : list;

    var paramCounts = _.reduce(list, function(memo, paramValue) {
        totals(memo, paramValue);
        return memo;
    }, {});

    return paramCounts;
}

function totals(obj, value) {
    var entries = _.without(_.map(value.split(','), function(item) {
        return item.trim();
    }), '');

    return _.reduce(entries, function(memo, item) {
        var entry = item.split(':');
        var name = entry[0];
        var num = entry[1];

        if (_.isEmpty(name)) {
            return memo;
        }

        var count = memo[name] || 1;
        if (num && Number(num) > 0) {
            count += Number(num);
        }

        memo[name] = count;

        return memo;
    }, obj);
}


function parsePollerOptions(logger) {
    var argv = yargs
        .usage('Usage: $0 [options...]')
        .demand(['site'])
        .describe('site <site>', 'The VistaId. This can appear multiple times and all values will be used. Can be a comma-delimited list.')
        .describe('autostart <true|false>', 'If true, automatically starts the poller. Defaults to true.')
        .alias('a', 'autostart')
        .alias('s', 'site')
        .alias('h', 'help')
        .alias('?', 'help')
        .help('h')
        .argv;

    var sites = parseSites(argv);

    logger.info('Create pollers for sites: %s', sites);

    return {
        sites: sites,
        autostart: parseAutostart(logger, argv)
    };
}


function parseAllJobTypes(argv) {
    return _s.toBoolean(argv['all-job-types']) || false;
}

function parseIgnoreInvalid(argv) {
    return _s.toBoolean(argv['ignore-invalid']) || false;
}

function parseSites(argv) {
    var sites = argv.site;
    if (!_.isArray(sites)) {
        sites = [sites];
    }

    sites = _.flatten(_.map(sites, function(site) {
        return _.without(_.isString(site) ? _.invoke(site.split(','), 'trim') : [''], '');
    }));

    return sites;
}

function parseAutostart(logger, argv) {
    var autostart = _s.toBoolean(argv.autostart || true);
    logger.info('autostart is %s', autostart ? 'ON' : 'OFF');

    return autostart;
}


module.exports.buildEnvironment = buildEnvironment;
module.exports.parsePollerOptions = parsePollerOptions;
module.exports.parseSubscriberOptions = parseSubscriberOptions;
module.exports.parseParamList = parseParamList;
module.exports.checkInvalidOptions = checkInvalidOptions;
module.exports.findInvalidOptions = findInvalidOptions;
module.exports.stripRedundantJobTypesFromProfiles = stripRedundantJobTypesFromProfiles;
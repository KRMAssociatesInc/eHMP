'use strict';

var _ = require('underscore');

var repoDefaults = {
    host: '127.0.0.1',
    port: 5000,
    tubename: 'vx-sync',
    tubePrefix: 'vxs-',
    jobTypeForTube: false,
};

var repoUniversal = {
    priority: 5,
    delay: 0,
    ttr: 0,
    timeout: 10,
    initMillis: 1000,
    maxMillis: 5000,
    incMillis: 1000
};

/*
beanstalkConfig - the beanstalk configuration object. It should have a
repo property which has the default repo values:

beanstalk: {
    repoUniversal = {
        priority: 5,
        delay: 0,
        ttr: 0,
        timeout: 10,
        initMillis: 1000,
        maxMillis: 5000,
        incMillis: 1000
    },
    repoDefaults: {
        host: '127.0.0.1',
        port: 5000
    },
    // These values are not used in this function
    jobTypes: {
        enterprise-sync-request: {},
        vista-operational-subscribe-request: {}
    }
}

The repo object will be filled in with the 'repoDefaults' object defined above and
the config object will be returned:

beanstalk: {
    repoUniversal: {
        priority: 5,
        delay: 0,
        ttr: 0,
        timeout: 10,
        initMillis: 1000,
        maxMillis: 5000,
        incMillis: 1000
    },
    repoDefaults: {
        host: '127.0.0.1',
        port: 5000,
        tubename: 'vx-sync',
        tubePrefix: 'vxs-',
        jobTypeForTube: false
    }
}
*/
function createDefaultBeanstalkConfig(beanstalkConfig) {
    var config;

    if (!beanstalkConfig || !beanstalkConfig.repoDefaults) {
        config = {
            repoDefaults: _.defaults({}, repoDefaults),
            repoUniversal: _.defaults({}, repoUniversal),
        };
    } else {
        config = {
            repoDefaults: _.defaults(beanstalkConfig.repoDefaults, repoDefaults),
            repoUniversal: _.defaults(beanstalkConfig.repoUniversal, repoUniversal)
        };
    }

    if (_.isString(config.repoDefaults.jobTypeForTube)) {
        var str = config.repoDefaults.jobTypeForTube.toLowerCase();
        config.repoDefaults.jobTypeForTube = str === 'true' || str === 'yes' || str === 'on';
    }

    return config;
}

/*
This function fills in all of the beanstalk properties for each job type
in the jobTypes part of the object.

Starting with this:
beanstalk = {
    repoUniversal: {
        priority: 5,
        delay: 0,
        ttr: 0,
        timeout: 10,
        initMillis: 1000,
        maxMillis: 5000,
        incMillis: 1000
    },
    repoDefaults: {
        host: '127.0.0.1',
        port: 5000,
        jobTypeForTube: true,
    },
    // These values are not used in this function
    jobTypes: {
        enterprise-sync-request: {
            tubename: 'enterprise'
        },
        vista-operational-subscribe-request: {}
    }
}

Would return this:
beanstalk = {
    repoUniversal: {
        priority: 5,
        delay: 0,
        ttr: 0,
        timeout: 10,
        initMillis: 1000,
        maxMillis: 5000,
        incMillis: 1000
    }
    repoDefaults: {
        host: '127.0.0.1',
        port: 5000,
        tubename: 'vx-sync',
        tubePrefix: 'vxs-',
        jobTypeForTube: true,
    },
    jobTypes: {
        enterprise-sync-request: {
            host: '127.0.0.1',
            port: 5000,
            tubename: 'vxs-enterprise',
            tubePrefix: 'vxs-',
            jobTypeForTube: true
        },
        vista-operational-subscribe-request: {
            host: '127.0.0.1',
            port: 5000,
            tubename: 'vxs-vista-operational-subscribe-request',
            tubePrefix: 'vxs-',
            jobTypeForTube: true
        }
    }
}
*/
function createFullBeanstalkConfig(beanstalkConfig) {
    // build the default config from the beanstalkConfig.repo and hardcoded defaults
    var fullConfig = createDefaultBeanstalkConfig(beanstalkConfig);
    fullConfig.jobTypes = {};

    if (!beanstalkConfig || !beanstalkConfig.jobTypes) {
        return fullConfig;
    }

    _.each(beanstalkConfig.jobTypes, function(jobConfig, jobType) {
        var jobTypeConfig = _.defaults(jobConfig, fullConfig.repo);
        jobTypeConfig = _.defaults(jobConfig, fullConfig.repoDefaults);

        if (jobTypeConfig.jobTypeForTube) {
            jobTypeConfig.tubename = jobTypeConfig.tubePrefix + jobType;
        }
        fullConfig.jobTypes[jobType] = _.defaults(jobTypeConfig, beanstalkConfig.repoUniversal);
    });

    return fullConfig;
}


function getConfigForJobType(beanstalkConfig, jobType) {
    return beanstalkConfig.jobTypes[jobType] || beanstalkConfig.repo;
}

module.exports.createDefaultBeanstalkConfig = createDefaultBeanstalkConfig;
module.exports.createFullBeanstalkConfig = createFullBeanstalkConfig;
module.exports.repoDefaults = repoDefaults;
module.exports.repoUniversal = repoUniversal;
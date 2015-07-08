'use strict';

require('../../../env-setup');

var queueConfig = require(global.VX_JOBFRAMEWORK + 'queue-config');

var beanstalkConfig = {
    repoUniversal: {
        priority: 5,
        delay: 0,
        ttr: 0,
        timeout: 10
    },
    repoDefaults: {
        host: '192.168.0.1',
        tubename: 'vx-sync-test',
        jobTypeForTube: true,
    },
    jobTypes: {
        'enterprise-sync-request': {
            host: '192.168.0.2',
            port: 6000
        },
        'jmeadows-sync-request': {
            jobTypeForTube: false,
            tubename: 'jmeadows'
        }
    }
};

var configWithDefaults = {
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
        host: '192.168.0.1',
        port: 5000,
        tubename: 'vx-sync-test',
        tubePrefix: 'vxs-',
        jobTypeForTube: true
    }
};

var fullConfig = {
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
        host: '192.168.0.1',
        port: 5000,
        tubename: 'vx-sync-test',
        tubePrefix: 'vxs-',
        jobTypeForTube: true,
    },
    jobTypes: {
        'enterprise-sync-request': {
            host: '192.168.0.2',
            port: 6000,
            tubename: 'vxs-enterprise-sync-request',
            tubePrefix: 'vxs-',
            jobTypeForTube: true,
            priority: 5,
            delay: 0,
            ttr: 0,
            timeout: 10,
            initMillis: 1000,
            maxMillis: 5000,
            incMillis: 1000
        },
        'jmeadows-sync-request': {
            host: '192.168.0.1',
            port: 5000,
            tubename: 'jmeadows',
            tubePrefix: 'vxs-',
            jobTypeForTube: false,
            priority: 5,
            delay: 0,
            ttr: 0,
            timeout: 10,
            initMillis: 1000,
            maxMillis: 5000,
            incMillis: 1000
        }
    }
};


describe('new-queue-config.js', function() {
    describe('createDefaultBeanstalkConfig()', function() {
        it('verify for null, undefined, and {}', function() {
            expect(queueConfig.createDefaultBeanstalkConfig()).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
            });
            expect(queueConfig.createDefaultBeanstalkConfig(null)).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
            });
            expect(queueConfig.createDefaultBeanstalkConfig({})).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
            });
            expect(queueConfig.createDefaultBeanstalkConfig({
                repo: null
            })).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
            });
            expect(queueConfig.createDefaultBeanstalkConfig({
                repo: {}
            })).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
            });
        });

        it('verify correct values inserted from hardcoded values', function() {
            expect(queueConfig.createDefaultBeanstalkConfig(beanstalkConfig)).toEqual(configWithDefaults);
        });
    });

    describe('createFullBeanstalkConfig()', function() {
        it('verify for null, undefined, and {}', function() {
            expect(queueConfig.createFullBeanstalkConfig()).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
                jobTypes: {}
            });
            expect(queueConfig.createFullBeanstalkConfig(null)).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
                jobTypes: {}
            });
            expect(queueConfig.createFullBeanstalkConfig({})).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
                jobTypes: {}
            });
            expect(queueConfig.createFullBeanstalkConfig({
                beanstalk: {}
            })).toEqual({
                repoUniversal: queueConfig.repoUniversal,
                repoDefaults: queueConfig.repoDefaults,
                jobTypes: {}
            });
        });

        it('verify with config job', function() {
            expect(queueConfig.createFullBeanstalkConfig(beanstalkConfig)).toEqual(fullConfig);
        });
    });
});
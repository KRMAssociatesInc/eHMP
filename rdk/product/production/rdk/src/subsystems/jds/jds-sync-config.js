/*jslint node: true */
'use strict';

var _ = require('lodash');
var S = require('string');
var nullchecker = require('../../utils/nullchecker');

module.exports.configureWithPidParam = configureWithPidParam;
module.exports.configureWithPidInPath = configureWithPidInPath;
module.exports.configure = configure;
module.exports.getSyncConfig = getSyncConfig;
module.exports.setupAudit = setupAudit;
module.exports.addForcedParam = addForcedParam;
module.exports.addSiteToPath = addSiteToPath;
module.exports.addPidParam = addPidParam;
module.exports.addParam = addParam;
module.exports.addPidToPath = addPidToPath;
module.exports.replacePidInPath = replacePidInPath;

var httpConfig = {
    loadPatient: {
        options: {
            path: '/sync/load',
            method: 'POST'
        },
        server: 'vxSyncServer'
    },
    clearPatient: {
        options: {
            path: '/sync/clearPatient',
            method: 'POST'
        },
        server: 'vxSyncServer'
    },
    getPatientStatus: {
        options: {
            path: '/sync/status',
            method: 'GET'
        },
        server: 'vxSyncServer'
    },
    getPatientStatusDetail: {
        options: {
            path: '/status',
            method: 'GET'
        },
        server: 'jdsServer'
    },
    syncPatientDemographics: {
        options: {
            path: '/sync/demographicSync',
            method: 'POST'
        },
        server: 'vxSyncServer'
    },
    getOperationalStatus: {
        options: {
            path: '/statusod/',
            method: 'GET'
        },
        server: 'jdsServer'
    },
    getPatientByIcn: {
        options: {
            path: '/data/index/pt-select-icn?range=',
            method: 'GET'
        },
        server: 'jdsServer'
    },
    getPatientByPid: {
        options: {
            path: '/data/index/pt-select-pid?range=',
            method: 'GET'
        },
        server: 'jdsServer'
    },
    getPatientByPidAllSites: {
        options: {
            path: '/vpr/mpid',
            method: 'GET'
        },
        server: 'jdsServer'
    },
    getJdsStatus: {
        options: {
            path: '/vpr/:pid/count/collection',
            method: 'GET'
        },
        server: 'jdsServer'
    }
};

function configureWithPidParam(configName, pid, req) {
    var config = configure(configName, pid, req);
    addPidParam(config, req, pid);
    return config;
}

function configureWithPidInPath(configName, pid, req) {
    var config = configure(configName, pid, req);
    addPidToPath(config, req, pid);
    return config;
}

function configure(configName, pid, req) {
    setupAudit(pid, req);
    return getSyncConfig(configName, req);
}

function getSyncConfig(configName, req) {
    var config = _.cloneDeep(httpConfig[configName]);
    config.logger = req.logger;
    config.timeoutMillis = req.app.config.jdsSync.settings.timeoutMillis;

    var serverConfig = req.app.config[config.server];
    config.options.host = serverConfig.host;
    config.options.port = serverConfig.port;
    delete config.server;

    return config;
}

function setupAudit(pid, req) {
    req.audit.logCategory = 'SYNC';
    if (pid) {
        req.audit.patientId = pid;
    }
}

function addForcedParam(config, req, forcedSite) {
    forcedSite = forcedSite || req.param('forcedSite') || '';
    if (_.isString(forcedSite)) {
        req.logger.debug(forcedSite);
        if (forcedSite === 'true') {
            config.options.path += '&forcedSync=true';
        } else {
            config.options.path += '&forcedSync=' + JSON.stringify(forcedSite.split(','));
        }
    }
}

function addSiteToPath(config, req, site) {
    var configPath = config.options.path;
    if (configPath.indexOf('/', configPath.length-1) !== -1) {
        if (nullchecker.isNullish(site)) {
            if (req.session && (req.session.user || {}).site) {
                req.logger.debug('adding primary site information');
                site = req.session.user.site;
            } else {
                req.logger.debug('adding the first site of the config');
                site = _.keys(req.app.config.vistaSites)[0];
            }
        }
        config.options.path = configPath + site;
    }
}

function addPidParam(config, req, pid) {
    if (nullchecker.isNullish(pid)) {
        pid = req.param('pid');
    }
    if (nullchecker.isNotNullish(pid)) {
        var param = S(pid).contains(';') ? 'pid' : 'icn';
        addParam(param, pid, config);
    }
}

function addParam(name, value, config) {
    if (config.options.path.indexOf('?', config.options.path.length-1) === -1) {
        config.options.path += '?';
    } else if (config.options.path.indexOf('&', config.options.path.length-1) === -1) {
        config.options.path += '&';
    }
    config.options.path += name + '=' + value;
}

function addPidToPath(config, req, pid) {
    if (nullchecker.isNotNullish(pid)) {
        if (!S(config.options.path).endsWith('/') && !S(config.options.path).endsWith(':') && !S(config.options.path).endsWith('=')) {
            config.options.path += '/';
        }
        config.options.path = config.options.path + pid;
    }
}

function replacePidInPath(config, req, pid) {
    config.options.path = config.options.path.replace(':pid', pid, 'gi');
}

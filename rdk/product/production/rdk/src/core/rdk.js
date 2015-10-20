'use strict';

module.exports.health = require('../utils/health');

module.exports.logging = require('./logger/logging-service');

module.exports.utils = {};
module.exports.utils.nullchecker = require('../utils/nullchecker');
module.exports.utils.uriBuilder = require('../utils/uri-builder');
module.exports.utils.commandlineparser = require('yargs').alias('c', 'config');
module.exports.utils.configLoader = require('./config-loader');
module.exports.utils.underscore = require('underscore');
module.exports.utils._ = exports.utils.underscore;
module.exports.utils.underscoreString = require('underscore.string');
module.exports.utils._s = exports.utils.underscore.string;
module.exports.utils.http = require('../utils/http');
module.exports.utils.VistaJS = require('../VistaJS/VistaJS');
module.exports.utils.rpc = require('../utils/rpc-config');
module.exports.utils.mongoStore = require('../utils/mongo-store');

module.exports.docs = require('../utils/api-docs-common');

module.exports.node = {};
module.exports.node.util = require('util');

module.exports.httpstatus = require('./httpstatus');

module.exports.rolesConfig = require('../../config/rolesConfig');

// TODO decide how to handle subsystem utilities (this code is temporary)
module.exports.utils.jds = {};
module.exports.utils.jds.getPatientDomainData = require('../subsystems/jds/jds-subsystem').getPatientDomainData;
module.exports.utils.jds.Domains = require('../subsystems/jds/jds-domains');

module.exports.utils.interceptor = require('../utils/interceptor-enabled');
// keep app-factory as last item in this list
// moving above causes some issues with loading of app-factory
// because it references RDK
module.exports.appfactory = require('./app-factory');

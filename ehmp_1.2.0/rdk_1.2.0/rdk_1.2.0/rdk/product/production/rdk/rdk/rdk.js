/*jslint node: true */
'use strict';

var _ = require('underscore');

//exports.healthcheck = require('../utils/healthcheck/healthcheck');

module.exports.health = require('../utils/healthcheck/health');

module.exports.logging = require('./logger/logging-service');

module.exports.utils = {};
module.exports.utils.file = require('../utils/fileUtil');
module.exports.utils.nullchecker = require('../utils/nullchecker/nullchecker');
module.exports.utils.uriBuilder = require('../utils/uribuilder/uriBuilder');
module.exports.utils.commandlineparser = require('yargs').alias('c', 'config');
module.exports.utils.configloader = require('./configloader');
module.exports.utils.underscore = require('underscore');
module.exports.utils._ = exports.utils.underscore;
module.exports.utils.underscoreString = require('underscore.string');
module.exports.utils._s = exports.utils.underscore.string;
module.exports.utils.http = require('../utils/http-wrapper/http');
module.exports.utils.jdsFilter = require('../utils/jdsFilter/jdsFilter');
module.exports.utils.VistaJS = require('../VistaJS/VistaJS');
module.exports.utils.rpc = require('../utils/rpc/rpcUtil');
module.exports.utils.dd = require('../utils/drilldown');

module.exports.docs = require('../utils/docsUtil');

module.exports.node = {};
module.exports.node.util = require('util');

module.exports.httpstatus = require('./httpstatus');

module.exports.permissionsConfig = require('../config/permissionsConfig');
module.exports.dataParseConfig = require('../config/dataParseConfig');

// TODO decide how to handle subsystem utilities (this code is temporary)
module.exports.utils.jds = {};
module.exports.utils.jds.getPatientDomainData = require('../subsystems/jds/jdsSubsystem').getPatientDomainData;
module.exports.utils.jds.Domains = require('../subsystems/jds/jdsDomains');

// keep app-factory as last item in this list
// moving above causes some issues with loading of app-factory
// because it references RDK
module.exports.appfactory = require('./app-factory');

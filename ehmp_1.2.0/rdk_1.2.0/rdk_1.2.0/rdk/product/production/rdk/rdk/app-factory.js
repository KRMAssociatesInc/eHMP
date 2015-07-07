/*jslint node: true */
'use strict';

var rdk = require('./rdk');
var _ = require('lodash');
var express = require('express');
var async = require('async');
var url = require('url');
var http = require('http');
var bodyParser = require('body-parser');
var uuid = require('node-uuid');
var morgan = require('morgan');
var session = require('express-session');
var helmet = require('helmet');
var JDSStore = require('../utils/jds/connect-jds')(session);
var metrics = require('../utils/metrics/metrics');
var httpUtil = rdk.utils.http;

function AppFactory() {
    if (!(this instanceof AppFactory)) {
        return new AppFactory();
    }

    var appfactory = this;
    var _argv;
    appfactory.argv = function(argv) {
        _argv = rdk.utils.commandlineparser.parse(argv);
        return appfactory;
    };

    var _config;
    appfactory.config = function(config) {
        _config = config;
        return appfactory;
    };

    var _defaultConfigFilename;
    appfactory.defaultConfigFilename = function(defaultConfigFilename) {
        _defaultConfigFilename = defaultConfigFilename;
        return appfactory;
    };

    appfactory.build = function() {
        console.log('build app');

        if (!_argv) {
            console.log('commandline not passed, extracting from main process');
            _argv = rdk.utils.commandlineparser.argv;
        }

        return buildApp(loadConfig(), _argv);
    };

    function loadConfig() {
        if (_config) {
            return _config;
        } else {
            return rdk.utils.configloader.loadConfigByCommandLine(_argv, _defaultConfigFilename);
        }
    }
}

module.exports = AppFactory;

var buildApp = function(config, argv) {
    var app = express();
    app.config = config;
    app.requestTraceActive = app.config.requestTrace.active;
    app.argv = argv;

    console.log('init app with config:');
    console.dir(config);

    //todo: move logging services to rdk or app
    // rdk for raw logging service
    // app for initialized already with configuration
    app.loggingservice = rdk.logging(config);
    app.logger = app.loggingservice.get('res-server');

    metrics.initialize(app);

    app.auditer = {};
    app.auditer.logger = app.loggingservice.get('audit');
    app.auditer.save = function(auditInfo) {
        // var serializedAuditInfo = JSON.stringify(auditinfo);
        // app.auditer.logger.info(serializedAuditInfo);
        var audit = {
            audit: auditInfo
        };
        app.auditer.logger.info(audit);
    };

    setupAppEdition(app);
    useStaticDocumentation(app);  // before middleware to prevent slow loading
    setupAppMiddleware(app);

    registerInterceptors(app);
    registerOuterceptors(app);
    createOuterceptorHandler(app);
    registerDefaultOuterceptors(app);

    //app.systemHealthCheck = rdk.healthcheck.createCompositeHealthCheck('application');

    app.swagger = rdk.docs.swagger.createNew(app);

    registerAppSubsystems(app);
    createResourceRegistry(app);
    registerResourceDirectory(app);
    registerPid(app);
    logCrashes(app);

    app.register('healthcheck', '/healthcheck', rdk.health.healthcheckresource());

    return app;
};

function useStaticDocumentation(app) {
    var swaggerUiPath = '/../utils/swagger-ui/dist';
    var docs_handler = express.static(__dirname  + swaggerUiPath);
    app.get(/^\/resource\/docs\/vx-api(\/.*)?$/, function(req, res, next) {  // serve swagger-ui at this static route
        var startPath = '/';  // express static barfs on root url w/o trailing slash
        //if (!req.session.user) {
        //    startPath = '/#!/authentication/authentication_authentication';  // redirect to authentication first if not logged in
        //}
        if (req.url === '/resource/docs/vx-api') {
            res.writeHead(302, { 'Location' : req.url + startPath });
            return res.end();
        }
        req.url = req.url.substr('/resource/docs/vx-api'.length);  // take off leading path so connect locates file correctly
        return docs_handler(req, res, next);
    });

    app.use('/resource/docs/', express.static(__dirname + '/../docs'));
}

function logCrashes(app) {
    process.on('uncaughtException', function(err) {
        console.error((new Date()).toUTCString() + 'uncaughtException: ' + err.message);
        console.error(err.stack);
        console.log((new Date()).toUTCString() + 'uncaughtException: ' + err.message);
        console.log(err.stack);
        app.logger.fatal(err);
        process.exit(1);
    });
}

function buildSwagger(app) {
    app.swagger.configureDeclaration('authentication', {
        description: 'Must login before consuming resources.'
        //authorizations : ["oauth2"],
        //protocols : ["http"],
        //consumes: ['application/json'],
        //produces: ['application/json']
    });
    app.swagger.configureDeclaration('patientrecord', {
        description: ''
    });
    app.swagger.configureDeclaration('locations', {
        description: 'Operations for wards or clinics.'
    });
    //app.swagger.setAuthorizations({
    //    apiKey: {
    //        type: "apiKey",
    //        passAs: "header"
    //    }
    //});
    app.swagger.setApiInfo({
        title: 'VX-API',
        description: 'The greatest API in the world!!',
        termsOfServiceUrl: '',
        contact: 'Team Mercury',
        license: '',
        licenseUrl: ''
    });

    app.swagger.configureSwaggerPaths('', '/resource/api-docs', '');  // json base url
    app.swagger.configure('/resource', '0.1');  // prefix on resource call
}

function createResourceRegistry(app) {
    var ResourceRegistry = require('../modules/resourcedirectory/resourceRegistry');
    app.oldResourceRegistry = new ResourceRegistry(false);  // TODO remove after 2015-01-25
    app.resourceRegistry = new ResourceRegistry(true);

    app.register = registerResourceFamily.bind(null, app);
}

function registerResourceDirectory(app) {
    var DirectoryResourceModule = require('../modules/resourcedirectory/directoryResource');
    var oldDirectoryResource = new DirectoryResourceModule(app.oldResourceRegistry);  // TODO remove after 2015-01-25
    var directoryResource = new DirectoryResourceModule(app.resourceRegistry);
    var resourceDirectoryInterceptors = {
        authentication: false,
        pep: false,
        operationalDataCheck: false
    };
    var resourceDirectoryConfig = [
        {
            isResourceDirectory: true,
            get: directoryResource,
            interceptors: resourceDirectoryInterceptors
        },
        {
            isOldResourceDirectory: true,  // TODO: remove after 2015-01-25
            get: oldDirectoryResource,
            interceptors: resourceDirectoryInterceptors
        }
    ];
    app.register('resource-directory', '/resourcedirectory', resourceDirectoryConfig);

    app.use('/resource/resourcedirectory/html', express.static(__dirname + '/../utils/html-documentation'));
    app.use('/resourcedirectory/html', express.static(__dirname + '/../utils/html-documentation'));  // TODO remove after 2015-01-25
}

function registerAppSubsystems(app) {
    app.subsystems = {};
    app.subsystems.register = registerSubsystem.bind(null, app);

    var authorizationSubsystem = require('../subsystems/authorization/authorizationSubsystem');
    var jdsSubsystem = require('../subsystems/jds/jdsSubsystem');
    var jdsSyncSubsystem = require('../subsystems/jdsSync/jdsSync').getInstance(app, app.config.jdsSync);
    var solrSubsystem = require('../subsystems/solr/solrSubsystem');
    var patientrecordSubsystem = require('../subsystems/patientrecord/patientrecordSubsystem');
    var mviSubsystem = require('../subsystems/mvi/mviSubsystem');
    var vxSyncSubSystem = require('../subsystems/vxSync/vxSyncSubsystem');
    var asuSubSystem= require('../subsystems/asu/asuSubSystem');

    app.subsystems.register('authorization', authorizationSubsystem);
    app.subsystems.register('jds', jdsSubsystem);
    app.subsystems.register('jdsSync', jdsSyncSubsystem);
    app.subsystems.register('solr', solrSubsystem);
    app.subsystems.register('patientrecord', patientrecordSubsystem);
    app.subsystems.register('mvi', mviSubsystem);
    app.subsystems.register('vxSync', vxSyncSubSystem);
    app.subsystems.register('asu', asuSubSystem);
}

function registerSubsystem(app, subsystemName, subsystem) {
    app.subsystems[subsystemName] = subsystem;
    rdk.health.registerSubsystem(subsystem.getSubsystemConfig(app), subsystemName, app.logger);
}

function setupAppEdition(app) {
    var edition;
    if(app.argv.edition !== null && app.argv.edition !== undefined) {
        edition = app.argv.edition;
    } else {
        edition = app.config.edition;
    }
    app.edition = edition;
    app.logger.info('app edition: %s', app.edition);
}

function setupAppMiddleware(app) {
    if(app.config.environment === 'development') {
        // enable CORS in development to reduce the number of VMs developers need deployed
        // CORS should not be used in production
        enableCors(app);
    }
    enableHelmet(app);
    addAppToRequest(app);
    addInterceptorRequestObject(app);
    addLoggerToRequest(app);
    setAppTimeout(app);
    enableMorgan(app);
    enableSession(app);
    enableBodyParser(app);
    addLoggerToHttpWrapper(app);
}

function enableBodyParser(app) {
    app.use(bodyParser.json({limit: '1mb'}));
}

function addLoggerToHttpWrapper(app) {
    httpUtil.initializeLogger(app.logger);
}

function enableHelmet(app) {
    app.use(helmet.hidePoweredBy());
    app.use(helmet.noCache());
    app.use(helmet.hsts());
    app.use(helmet.ieNoOpen());
    app.use(helmet.noCache());
    app.use(helmet.noSniff());
    app.use(helmet.frameguard());
    app.use(helmet.xssFilter());
}

function enableSession(app) {
    app.use(function(req, res, next) {
        session({
            store: new JDSStore({
                    jdsServer: {
                        host: app.config.jdsServer.host,
                        port: app.config.jdsServer.port
                    }
                }, req.logger
            ),
            secret: 'mysecuresecretpasscode',
            name: 'rdk.sid',
            cookie: {
                maxAge: 900000
            },
            resave: true,
            rolling: true, //this allows the session and token to refresh each time
            saveUninitialized: true
        })(req, res, next);
    });
}

function enableCors(app) {

    // todo: add configuration option for cors on/off
    var cors = require('cors');

    app.use(cors({

        credentials: true,

        // HACK
        // this is a temp fix to allow the ADK to contact the RDK without errors
        origin: function(origin, callback) {
            callback(null, true);
        }

    }));

}

function addAppToRequest(app) {
    app.use(function(req, res, next) {
        req.app = app;
        next();
    });
}

function addInterceptorRequestObject(app) {
    app.use(function(req, res, next) {
        req.interceptorResults = {};
        next();
    });
}

function addLoggerToRequest(app) {
    var requestIdParam = app.config.requestTrace.requestIdParam || 'requestId';
    var logIdParam = app.config.requestTrace.logIdParam || 'logId';

    app.use(function(req, res, next) {
        var requestTraceActive = String(req.param('requestTraceActive') !== undefined ? req.param('requestTraceActive') : app.requestTraceActive).toLowerCase() === 'true';
        app.logger.debug('requestTraceActive=%s', String(requestTraceActive));
        var logId;
        var requestId;
        var requestEntry;
        var idLogger;
        var idObject;

        if (requestTraceActive) {
            app.requestTraceActive = requestTraceActive;
            logId = req.param(logIdParam) || uuid.v4();
            requestId = req.param(requestIdParam) || uuid.v4();

            requestEntry = {};
            requestEntry[requestIdParam] = requestId;
            requestEntry[logIdParam] = logId;
            app.logger.info(requestEntry, 'New Request: %s %s', req.method, req.path);

            if (logId !== undefined && logId !== null) {
                app.logger.info('setting idLogger');
                idObject = {};
                idObject[logIdParam] = logId;
                idLogger = app.logger.child(idObject);
                req.logger = idLogger;
            } else {
                req.logger = app.logger;
            }
            res.set('logId', logId);
        }

        next();
    });
}

function addResourceConfigToRequest(app, configItem) {
    app.use(function(req, res, next) {
        req._resourceConfigItem = configItem;
        next();
    });
}

function setAppTimeout(app) {
    app.use(function(req, res, next) {
        var timeoutMillis = Number(app.config.responseTimeoutMillis || 300000);
        res.setTimeout(timeoutMillis);
        req.logger.info('response timeout=%s ms', timeoutMillis);
        next();
    });
}

function enableMorgan(app) {
    app.use(morganBunyanLogger);
}

function morganBunyanLogger(req, res, next) {
    var logger = req.logger || req.app.logger;
    var morganFormat = req.app.config.morganFormat || 'dev';
    var morganToBunyan = morgan({
        format: morganFormat,
        stream: {
            write: function(string) {
                logger.info(string);
            }
        }
    });
    return morganToBunyan (req, res, next);
}

function registerDefaultOuterceptors(app) {
    var defaultOuterceptors = ['linkifyUids', 'transformJdsApiVersion', 'facilityDisplay'];
    registerPathOuterceptors(app, {
        name: '_default',
        path: '_default',
        outerceptors: defaultOuterceptors
    });
}

function addApiDocs(app, configItem) {
    if (!configItem.apiDocs.spec.path) {
        configItem.apiDocs.spec.path = configItem.path.replace('/resource', '');
    }
    if (!configItem.apiDocs.spec.nickname) {
        configItem.apiDocs.spec.nickname = configItem.title;
    }
    if (!configItem.apiDocs.spec.method) {
        configItem.apiDocs.spec.method = _.find(['get', 'post', 'put', 'delete'], function(httpMethod) {
            return _.has(configItem, httpMethod);
        }).toUpperCase();
    }
    app.swagger.addModels(configItem.apiDocs);
    app.swagger['add'+configItem.apiDocs.spec.method](configItem.apiDocs);
}

function mount(app, resourceConfiguration) {
    var mountpoint = resourceConfiguration.path;
    var resourceName = resourceConfiguration.title;

    var httpMethods = _.pick(resourceConfiguration, 'get', 'post', 'put', 'delete');
    _.each(httpMethods, function(mountFunction, methodName) {
        app.logger.info('mounting resource [resourceName=%s][mountpoint=%s][action=%s]',resourceName, mountpoint, methodName);
        app[methodName](mountpoint, mountFunction);
    });
}

function registerResourceFamily(app, resourceFamilyName, mountpoint, resourceConfig) {
    app.logger.info('registering resource family [resourceFamilyName=%s][mountpoint=%s]', resourceFamilyName, mountpoint);
    var lastSwaggerSpec;
    _.each(resourceConfig, function(configItem) {
        //todo: handle if parts contain/don't contain slashes
        app.logger.info('registering resource [resourceFamilyName=%s][name=%s][mountpoint=%s][path=%s]',
            resourceFamilyName, configItem.name, mountpoint, configItem.path);

        processConfigItem(configItem, resourceFamilyName, mountpoint);

        logPepPermissions(app, configItem);

        addResourceConfigToRequest(app, configItem);
        registerPathInterceptors(app, configItem);
        registerPathOuterceptors(app, configItem);
        mount(app, configItem);

        var registryItem = _.pick(configItem, 'title', 'path', 'parameters', 'description');
        if(configItem.isOldResourceDirectory) {  // TODO: remove after 2015-01-25
            app.oldResourceRegistry.register(registryItem);
        } else if(configItem.isResourceDirectory) {  // TODO: remove after 2015-01-25
            app.resourceRegistry.register(registryItem);
        } else {
            app.resourceRegistry.register(registryItem);
            app.oldResourceRegistry.register(registryItem);
        }

        rdk.health.registerResource(configItem, configItem.name, app.logger);

        if (configItem.apiDocs) {
            if (lastSwaggerSpec === configItem.apiDocs.spec) {  // avoid redundant paths in swagger
                return;
            }
            addApiDocs(app, configItem);
            lastSwaggerSpec = configItem.apiDocs.spec;
        }
    });

    buildSwagger(app);
}

function logPepPermissions(app, configItem) {
    var isPepInterceptor = _.contains(configItem.interceptors, 'pep');
    if(configItem.permissions) {
        app.logger.info(configItem.title + ' permissions: [%s]', configItem.permissions);
    }
    if(isPepInterceptor && !configItem.permissions) {
        return app.logger.error(configItem.title + ' uses pep - requires permissions defined in resourceConfig');
    }
    if(!isPepInterceptor && configItem.permissions) {
        return app.logger.error(configItem.title + ' doesn\'t use pep - remove permissions from resourceConfig');
    }
}

function processConfigItem(configItem, resourceFamilyName, mountpoint) {
    if(configItem.isOldResourceDirectory) {  // TODO: remove after 2015-01-25
        configItem.title = calculateQualifiedResourceName(resourceFamilyName, configItem.name);
        configItem.path = rdk.utils.uriBuilder.fromUri(mountpoint).path(configItem.path).build();
        return;
    }
    mountpoint = '/resource' + mountpoint;  // TODO: remove after 2015-01-25

    configItem.title = calculateQualifiedResourceName(resourceFamilyName, configItem.name);
    configItem.path = rdk.utils.uriBuilder.fromUri(mountpoint).path(configItem.path).build();
    //configItem.parameters = configItem.parameters || null;
}

function createOuterceptorHandler(app) {
    var _send = app.response.send;
    app.response.send = function(body) {
        var self = this;
        //body = 'foo';
        if (arguments.length === 2) {
            // res.send(body, status) backwards compat
            if (typeof arguments[0] !== 'number' && typeof arguments[1] === 'number') {
                app.logger.warn('res.send(body, status): Use res.status(status).send(body) instead');
                self.statusCode = arguments[1];
            } else {
                app.logger.warn('res.send(status, body): Use res.status(status).send(body) instead');
                self.statusCode = arguments[0];
                body = arguments[1];
            }
        }
        // disambiguate res.send(status) and res.send(status, num)
        if (typeof body === 'number' && arguments.length === 1) {
            // res.send(status) will set status message as text string
            if (!self.get('Content-Type')) {
                self.type('txt');
            }
            app.logger.warn('res.send(status): Use res.status(status).end() instead');
            self.statusCode = body;
            body = http.STATUS_CODES[body];
        }

        var defaultOuterceptors = self.app.outerceptorPathRegistry._default || [];
        var pathOuterceptors = self.app.outerceptorPathRegistry[url.parse(self.req.originalUrl).pathname] || [];
        var bootstrapOuterceptor = [

            function(callback) {
                callback(null, self.req, body);
            }
        ];
        var outerceptors = bootstrapOuterceptor.concat(defaultOuterceptors).concat(pathOuterceptors);
        async.waterfall(outerceptors,
            function(err, req, body) {
                if (self._headerSent) {
                    return 'Response already sent';
                }
                if (err) {
                    return _send.call(self, err);
                }
                return _send.call(self, body);
            }
        );
    };
}

function registerPathOuterceptors(app, configItem) {
    app.outerceptorPathRegistry = app.outerceptorPathRegistry || {};
    _.each(configItem.outerceptors, function(outerceptorName) {
        if (!(outerceptorName in app.outerceptors)) {
            app.logger.warn('No interceptor named %s exists in the app object. Unable to register outerceptor for resource %s', outerceptorName, configItem.name);
            return;
        }
        app.outerceptorPathRegistry[configItem.path] = app.outerceptorPathRegistry[configItem.path] || [];
        app.outerceptorPathRegistry[configItem.path].push(app.outerceptors[outerceptorName]);
    });
}

function registerPathInterceptors(app, configItem) {
    var httpMethods = _.pick(configItem, 'get', 'post', 'put', 'delete');
    _.each(httpMethods, function(chaff, httpMethod) {
        var pathInterceptors = _.defaults((configItem.interceptors || {}), {
            authentication: true,
            pep: true,
            metrics: true,
            audit: true,
            operationalDataCheck: true
        });
        var pathInterceptorsWhitelisted = _.keys(_.pick(pathInterceptors, _.identity));
        var pathInterceptorsWhitelistedSorted = sortWhitelistedInterceptors(app, pathInterceptorsWhitelisted);
        warnIfInterceptorNotFound(app, configItem, pathInterceptorsWhitelisted);

        _.each(pathInterceptorsWhitelistedSorted, function(interceptorName) {
            registerPathInterceptor(app, configItem, httpMethod, interceptorName);
        });
    });
}

function warnIfInterceptorNotFound(app, configItem, interceptorNames) {
    var appInterceptorNames = _.flatten(_.map(app.interceptors, function(interceptorObject) {
        return _.keys(interceptorObject);
    }));
    var unknownInterceptors = _.difference(interceptorNames, appInterceptorNames);
    if(unknownInterceptors.length) {
        app.logger.warn({unknownInterceptors: unknownInterceptors}, 'Unknown interceptors configured in %s', configItem.name);
    }
}

/**
 * @param {object} app
 * @param {array} whitelistedInterceptors
 * @returns {array} of {interceptorName: function} in the order of app.interceptors
 */
function sortWhitelistedInterceptors(app, whitelistedInterceptors) {
    var pathInterceptorsWhitelistedSorted = _.filter(app.interceptors,
        function(orderedInterceptorObject) {
            var interceptorExists = _.any(orderedInterceptorObject, function(value, key) {
                return _.contains(whitelistedInterceptors, key);
            });
            return interceptorExists;
        }
    );
    return pathInterceptorsWhitelistedSorted;
}

function registerPathInterceptor(app, configItem, httpMethod, interceptorObject) {
    app.logger.info('registering interceptor %s for %s %s ( resource name: %s )',
        _.keys(interceptorObject)[0],
        httpMethod.toUpperCase(),
        configItem.path,
        configItem.name);
    app[httpMethod](configItem.path, _.values(interceptorObject)[0]);
}

function calculateQualifiedResourceName(resourceFamilyName, resourceName) {
    var qualifiedResourceName = resourceFamilyName;
    if (!rdk.utils.nullchecker.isNullish(resourceName) && resourceName.length > 0) {
        qualifiedResourceName = resourceFamilyName + '-' + resourceName;
    }
    return qualifiedResourceName;
}

function registerOuterceptors(app) {
    app.outerceptors = {
        linkifyUids: require('../outerceptors/linkifyUids'),
        facilityDisplay: require('../outerceptors/facilityDisplay/facilityDisplay'),
        transformJdsApiVersion: require('../outerceptors/transformJdsApiVersion'),
        emulateJdsResponse: require('../outerceptors/emulateJdsResponse'),
        asu: require('../outerceptors/asu')
    };
}

function registerInterceptors(app) {
    app.interceptors = [
        { audit: require('../interceptors/audit/audit') },
        { metrics: require('../interceptors/metrics') },
        { authentication: require('../interceptors/authentication/authentication') },
        { pep: require('../interceptors/pep') },
        { operationalDataCheck: require('../interceptors/operationalDataCheck') },
        { validateAgainstApiDocs: require('../interceptors/validateAgainstApiDocs') },
        { synchronize: require('../interceptors/synchronize') },
        { jdsFilter: require('../interceptors/jdsFilterInterceptor') },
        { convertPid: require('../interceptors/convertPid') }
    ];
}

function registerPid(app) {
    app.use(function(req, res, next) {
        if(req.param('pid')) {
            return next();
        }
        req.logger.debug('registerPid() ');
        var pid;

        if (_.has(req.query, 'subject.identifier')) {
            pid = req.param('subject.identifier');
        }

        if (pid === undefined) {
            var splitValues = req.originalUrl.split('/');
            if (splitValues.length > 3 && splitValues[splitValues.length - 3] === 'fhir' && splitValues[splitValues.length-1] !== undefined) {
                var uid = splitValues[splitValues.length-1];

                var regex = /[^:]+:[^:]+:[^:]+:([^:]+:[^:]+):[^:]*/;
                var match = uid.match(regex);

                if (match && match.length === 2) {
                    pid = match[1];
                } else {
                    if (uid.indexOf('?') >= 0) {
                        uid = uid.slice(0, uid.indexOf('?'));
                    }
                    pid = uid;
                }
            }
            else if(splitValues.length > 3 && splitValues[splitValues.length - 3] === 'vler' && splitValues[splitValues.length-1].indexOf('toc') !== -1) {
                pid = splitValues[splitValues.length-2];
            }
        }

        if (pid) {
            pid = pid.replace(/:/, ';');
            req.query.pid = pid;
        }
        next();
    });
}

// private exports
module.exports._sortWhitelistedInterceptors = sortWhitelistedInterceptors;
module.exports._warnIfInterceptorNotFound = warnIfInterceptorNotFound;

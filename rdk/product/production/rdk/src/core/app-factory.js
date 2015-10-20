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
var JDSStore = require('../utils/connect-jds')(session);
var metrics = require('../utils/metrics/metrics');
var pidValidator = require('../utils/pid-validator');
var httpUtil = rdk.utils.http;
var mongoStore = rdk.utils.mongoStore;
var dd = require('drilldown');
var Handlebars = require('handlebars');
var fs = require('fs');

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

        return buildApp(loadConfig(), _argv, _defaultConfigFilename);
    };

    function loadConfig() {
        if (_config) {
            return _config;
        } else {
            return rdk.utils.configLoader.loadConfigByCommandLine(_argv, _defaultConfigFilename);
        }
    }
}

module.exports = AppFactory;

var buildApp = function(config, argv, defaultConfigFilename) {
    var app = express();
    config = processAppConfig(config, argv);
    app.config = config;

    app.requestTraceActive = app.config.requestTrace.active;
    app.argv = argv;
    app.defaultConfigFilename = defaultConfigFilename;

    console.log('init app with config:');
    console.dir(config);

    //todo: move logging services to rdk or app
    // rdk for raw logging service
    // app for initialized already with configuration
    app.loggingservice = rdk.logging(config);
    app.logger = app.loggingservice.get('res-server');

    metrics.initialize(app);
    pidValidator.initialize(app);
    mongoStore.initialize(app);
    setHttpMaxSockets();

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

    app.appRouter = createRouter(app);

    swagger(app).initialize();

    setupAppEdition(app);
    setupTrustProxy(app);
    setupAppMiddleware(app);
    registerInterceptors(app);
    registerOuterceptors(app);
    createOuterceptorHandler(app);
    registerDefaultOuterceptors(app);

    //app.systemHealthCheck = rdk.healthcheck.createCompositeHealthCheck('application');

    registerAppSubsystems(app);
    createResourceRegistry(app);
    registerPid(app);
    logCrashes(app);
    reloadConfig(app);

    app.register('healthcheck', '/healthcheck', rdk.health.healthcheckresource());

    useStaticDocumentation(app);
    app.use(dd(app)('config')('rootPath').val, app.appRouter);

    return app;
};

/**
 * JDS seems to have connection issues if many requests are made at once.
 * Before removing this, verify that the swagger documentation loads.
 */
function setHttpMaxSockets() {
    http.globalAgent.maxSockets = Infinity;
}

function processAppConfig(config, argv) {
    if(!argv.port) {
        return config;
    }
    if(!parseInt(argv.port)) {
        return config;
    }
    var port = parseInt(argv.port);
    dd(config)('appServer')('port').set(port);
    return config;
}

function createRouter(app) {
    var rootPath = dd(app)('config')('rootPath').val;
    if(!_.isString(rootPath)) {
        app.logger.fatal('config.rootPath required');
        process.exit(1);
    }
    if(!/(?:^\/$|^\/.*[^\/]$)/.test(rootPath)) {
        app.logger.fatal('config.rootPath must begin with a / and not end with a /');
    }
    return express.Router();
}

function swagger(app) {
    return {
        initialize: function() {
            app.swagger = rdk.docs.swagger.createNew(app);
            //app.swagger.setAuthorizations({
            //    apiKey: {
            //        type: "apiKey",
            //        passAs: "header"
            //    }
            //});
            this.static();
        },
        static: function() {  // must go before enableSession of setupAppMiddleware to prevent slow loading
            var info = {
                title: 'VX-API',
                description: '',
                termsOfServiceUrl: '',
                contact: 'Team Mercury',
                license: '',
                licenseUrl: ''
            };
            var swaggerUiDir = __dirname + '/../utils/swagger-ui/dist';

            app.appRouter.use(/^\/docs\/vx-api$/, function(req, res) {
                // swagger-ui's relative paths in index.html require a trailing slash
                return res.redirect('./vx-api/');
            });
            /*
             We need to template index.html because the swagger spec path
             may be different on different servers
             */
            app.appRouter.use(/^\/docs\/vx-api(?:\/|\/index.html)?$/, function(req, res) {
                fs.readFile(swaggerUiDir + '/index.html', function(err, data) {
                    if(err) {
                        req.logger.error({appFactory: {err: err}}, 'Error reading swagger-ui\'s index.html');
                        res.status(500).rdkSend('Error reading swagger-ui\'s index.html');
                    }
                    var template = Handlebars.compile(data.toString());
                    var rootPath = dd(req)('app')('config')('rootPath').val;
                    var url = rootPath === '/' ? '/docs/vx-api/swagger' : rootPath + '/docs/vx-api/swagger';
                    var title = 'VX-API HTTP API Documentation';
                    var templateVariables = {
                        url: url,
                        title: title
                    };
                    var result = template(templateVariables);
                    dd(req)('_resourceConfigItem')('permitResponseFormat').set(true);
                    res.status(200).type('text/html; charset=utf-8').send(result);
                });
            });
            app.appRouter.use('/docs/vx-api', function(req, res, next) {
                info.rootPath = dd(req)('app')('config')('rootPath').val;
                if (req.hostname === 'localhost' || req.hostname === '10.4.4.105') {
                    info.host = 'local';
                } else {
                    info.host = 'remote';
                }
                app.swagger.setApiInfo(info);
                dd(req)('_resourceConfigItem')('permitResponseFormat').set(true);
                return express.static(swaggerUiDir)(req, res, next);
            });
        },
        addApiDocs: function(configItem) {  // runs during registerResourceFamily
            if (!configItem.apiDocs.spec.path) {
                configItem.apiDocs.spec.path = configItem.path;
            }
            if (!configItem.apiDocs.spec.nickname) {
                configItem.apiDocs.spec.nickname = configItem.title;
            }
            if (!configItem.apiDocs.spec.method) {
                configItem.apiDocs.spec.method = _.find(['get', 'post', 'put', 'delete'], function(httpMethod) {
                    return _.has(configItem, httpMethod);
                }).toUpperCase();
            }
            if (configItem.apiDocs.spec.method === 'GET') {
                if (!configItem.apiDocs.spec.parameters) {
                    configItem.apiDocs.spec.parameters = [];
                }
                configItem.apiDocs.spec.parameters.push(rdk.docs.commonParams.fields);
            }
            app.swagger.addModels(configItem.apiDocs);
            app.swagger['add'+configItem.apiDocs.spec.method](configItem.apiDocs);
        },
        build: function() {  // must go at the end of registerResourceFamily after all resources have been added
            //app.swagger.configureDeclaration('authentication', {
            //description: ''
            //authorizations : ["oauth2"],
            //protocols : ["http"],
            //consumes: ['application/json'],
            //produces: ['application/json']
            //});
            app.swagger.configureDeclaration('locations', {  // must go after app.swagger
                description: 'Operations for wards or clinics.'
            });
            var rootPath = dd(app)('config')('rootPath').val;
            var swaggerPath = rootPath === '/' ? '/docs/vx-api/swagger' : rootPath + '/docs/vx-api/swagger';
            app.swagger.configureSwaggerPaths('', swaggerPath, '');  // json base url
            app.swagger.configure(rootPath, '0.1');  // prefix on resource call
        }
    };
}

function useStaticDocumentation(app) {
    app.appRouter.use('/docs/', express.static(__dirname + '/../../docs'));
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

function reloadConfig(app) {
    process.on('SIGHUP', function() {
        app.logger.info('Reloading configuration.');
        var config = rdk.utils.configLoader.loadConfigByCommandLine(app.argv, app.defaultConfigFilename);

        if (_.isObject(config)) {
            app.config = config;
            setupAppEdition(app);
            metrics.initialize(app);
            pidValidator.initialize(app);
        }
    });
}

function createResourceRegistry(app) {
    var ResourceRegistry = require('./resource-directory/resource-registry');
    app.resourceRegistry = new ResourceRegistry();
    app.register = registerResourceFamily.bind(null, app);
    app.register('resource-directory', '/resourcedirectory', require('./resource-directory/resource-directory-resource').getResourceConfig(app));
}

function registerAppSubsystems(app) {
    app.subsystems = {};
    app.subsystems.register = registerSubsystem.bind(null, app);

    var authorizationSubsystem = require('../subsystems/authorization-subsystem');
    var jdsSubsystem = require('../subsystems/jds/jds-subsystem');
    var jdsSyncSubsystem = require('../subsystems/jds/jds-sync-subsystem');
    var solrSubsystem = require('../subsystems/solr-subsystem');
    var patientrecordSubsystem = require('../subsystems/patient-record-subsystem');
    var mviSubsystem = require('../subsystems/mvi-subsystem');
    var vxSyncSubsystem = require('../subsystems/vx-sync-subsystem');
    var asuSubsystem= require('../subsystems/asu/asu-subsystem');
    var jbpmSubsystem = require('../subsystems/jbpm-subsystem');

    app.subsystems.register('authorization', authorizationSubsystem);
    app.subsystems.register('jds', jdsSubsystem);
    app.subsystems.register('jdsSync', jdsSyncSubsystem);
    app.subsystems.register('solr', solrSubsystem);
    app.subsystems.register('patientrecord', patientrecordSubsystem);
    app.subsystems.register('mvi', mviSubsystem);
    app.subsystems.register('vxSync', vxSyncSubsystem);
    app.subsystems.register('asu', asuSubsystem);
    if(dd(app)('config')('jbpm').exists) {
        app.subsystems.register('jbpm', jbpmSubsystem);
    }
}

function registerSubsystem(app, subsystemName, subsystem) {
    app.subsystems[subsystemName] = subsystem;
    rdk.health.registerSubsystem(subsystem.getSubsystemConfig(app), subsystemName, app.logger);
}

function setupAppEdition(app) {
    app.edition = app.argv.edition !== null && app.argv.edition !== undefined ? app.argv.edition : app.config.edition;
    app.logger.info('app edition: %s', app.edition);
}

function setupTrustProxy(app) {
    app.use(function(req, res, next) {
        var clientIsBalancer = (req.headers['x-forwarded-host'] === '10.1.1.149');
        if (app.config.environment === 'development') {
            app[clientIsBalancer ? 'enable' : 'disable']('trust proxy');
        } else {
            app.enable('trust proxy');
        }
        app.logger.info('trust proxy [enabled=%s][%s]', app.enabled('trust proxy'), req.ips);
        next();
    });
}

function setupAppMiddleware(app) {
    setupCors(app);
    enableHelmet(app);
    addAppToRequest(app);
    addInterceptorRequestObject(app);
    addLoggerToRequest(app);
    setAppTimeout(app);
    enableMorgan(app);
    enableSession(app);
    enableBodyParser(app);
    addLoggerToHttpWrapper(app);
    addRdkSendToResponse(app);
}

function enableBodyParser(app) {
    app.use(bodyParser.json({limit: '1mb'}));
}

function addLoggerToHttpWrapper(app) {
    httpUtil.initializeLogger(app.logger);
}

function addRdkSendToResponse(app) {
    app.use(function(req, res, next) {
        res.rdkSend = function(body) {
            if (body === null || body === undefined) {
                body = {};
            } else if (_.isObject(body) || this.get('Content-Type') === 'application/json') {
                if (_.isString(body)) {
                    try {
                        body = JSON.parse(body);
                    } catch (e) {
                        body = {message: body};
                    }
                }
                if ((!_.has(body, 'data') || !_.isObject(body.data)) &&
                    !_.has(body, 'message') &&
                    (_.isArray(body) || !_.isEmpty(body))) {
                    body = {data: body};
                }
            } else {
                body = {message: String(body)};
            }
            if (res.statusCode) {
                body.status = res.statusCode;
            } else {
                body.status = 200;
            }
            return this.send(body);
        };
        next();
    });
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
                        host: req.app.config.jdsServer.host,
                        port: req.app.config.jdsServer.port
                    }
                }, req.logger, req.app
            ),
            secret: 'mysecuresecretpasscode',
            name: 'rdk.sid',
            cookie: {
                maxAge: 900000
            },
            unset: 'destroy',
            resave: true,
            rolling: true, //this allows the session and token to refresh each time
            saveUninitialized: true
        })(req, res, next);
    });
}

function setupCors(app) {
    //CORS not setup on reload of configuration since CORS is only used for development.
    var corsEnabled = dd(app)('config')('corsEnabled').val;
    var isDevelopmentEnvironment = dd(app)('config')('environment').val === 'development';
    if(!corsEnabled || !isDevelopmentEnvironment) {
        return;
    }
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

    app.use(function(req, res, next) {
        var requestIdParam = req.app.config.requestTrace.requestIdParam || 'requestId';
        var logIdParam = req.app.config.requestTrace.logIdParam || 'logId';
        var requestTraceActive = String(req.param('requestTraceActive') !== undefined ? req.param('requestTraceActive') : req.app.requestTraceActive).toLowerCase() === 'true';

        app.logger.debug('requestTraceActive=%s', String(requestTraceActive));
        var logId;
        var requestId;
        var requestEntry;
        var idLogger;
        var idObject;

        if (requestTraceActive) {
            //should this really be done???? a req can turn on for other req?
            req.app.requestTraceActive = requestTraceActive;
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
    app.appRouter.use(configItem.path, function(req, res, next) {
        configItem.interceptors = _.defaults((configItem.interceptors || {}), getDefaultInterceptors());
        req._resourceConfigItem = configItem;
        next();
    });
}

function getDefaultInterceptors() {
    return {
        authentication: true,
        pep: true,
        metrics: true,
        audit: true,
        operationalDataCheck: true,
        synchronize: true
    };
}

function setAppTimeout(app) {
    app.use(function(req, res, next) {
        var timeoutMillis = Number(req.app.config.responseTimeoutMillis || 300000);
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
    var defaultOuterceptors = ['linkifyUids', 'transformJdsApiVersion', 'facilityDisplay', 'whitelistJson', 'validateResponseFormat'];
    registerPathOuterceptors(app, {
        name: '_default',
        path: '_default',
        outerceptors: defaultOuterceptors
    });
}

function mount(app, resourceConfiguration) {
    var mountpoint = resourceConfiguration.path;
    var resourceName = resourceConfiguration.title;

    var httpMethods = _.pick(resourceConfiguration, 'get', 'post', 'put', 'delete');
    _.each(httpMethods, function(mountFunction, methodName) {
        app.logger.info('mounting resource [resourceName=%s][mountpoint=%s][action=%s]',resourceName, mountpoint, methodName);
        app.appRouter[methodName](mountpoint, mountFunction);
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

        var registryItem = _.pick(configItem, 'title', 'path', 'parameters', 'description', 'rel');
        app.resourceRegistry.register(registryItem);

        rdk.health.registerResource(configItem, configItem.name, app.logger);

        if (configItem.apiDocs) {
            if (lastSwaggerSpec === configItem.apiDocs.spec) {  // avoid redundant paths in swagger
                return;
            }
            swagger(app).addApiDocs(configItem);
            lastSwaggerSpec = configItem.apiDocs.spec;
        }
    });

    swagger(app).build();
}

function logPepPermissions(app, configItem) {
    var isPepInterceptor = _.contains(_.keys(configItem.interceptors), 'pep') && configItem.interceptors.pep;
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
    configItem.title = calculateQualifiedResourceName(resourceFamilyName, configItem.name);
    configItem.path = rdk.utils.uriBuilder.fromUri(mountpoint).path(configItem.path).build();
    //configItem.parameters = configItem.parameters || null;
    var crud = {
        post: 'vha.create',
        get: 'vha.read',
        put: 'vha.update',
        delete: 'vha.delete'
    };
    var method = _(configItem).pick(_.keys(crud)).keys().first();
    configItem.rel = crud[method];
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
                callback(null, self.req, self, body);
            }
        ];
        var outerceptors = bootstrapOuterceptor.concat(defaultOuterceptors).concat(pathOuterceptors);
        async.waterfall(outerceptors,
            function(err, req, res, body) {
                if (self._headerSent) {
                    return 'Response already sent';
                }
                if (err) {
                    if (_.isString(err)) {
                        err = {message: err};
                    }
                    err.status = 406;
                    self.status(406);
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
        var pathInterceptors = _.defaults((configItem.interceptors || {}), getDefaultInterceptors());
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
    var interceptorHandler = _.first(_.values(interceptorObject));
    interceptorHandler.isInterceptor = true;
    app.appRouter[httpMethod](configItem.path, interceptorHandler);
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
        linkifyUids: require('../outerceptors/linkify-uids'),
        facilityDisplay: require('../outerceptors/facility-display/facility-display'),
        transformJdsApiVersion: require('../outerceptors/transform-jds-api-version'),
        emulateJdsResponse: require('../outerceptors/emulate-jds-response'),
        asu: require('../outerceptors/asu'),
        whitelistJson: require('../outerceptors/whitelist-json'),
        validateResponseFormat: require('../outerceptors/validate-response-format')
    };
}

function registerInterceptors(app) {
    /* This is an array of objects with one value instead of one object
    with an array of values so that the order of the interceptors can
    be preserved.
    */
    app.interceptors = [
        { fhirPid: require('../interceptors/fhir-pid') },
        { audit: require('../interceptors/audit/audit') },
        { metrics: require('../interceptors/metrics') },
        { authentication: require('../interceptors/authentication/authentication') },
        { convertPid: require('../interceptors/convert-pid') },
        { pep: require('../interceptors/authorization/pep') },
        { operationalDataCheck: require('../interceptors/operational-data-check') },
        { validateAgainstApiDocs: require('../interceptors/validate-against-api-docs') },
        { synchronize: require('../interceptors/synchronize') },
        { jdsFilter: require('../interceptors/jds-filter-interceptor') }
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
module.exports._addRdkSendToResponse = addRdkSendToResponse;
module.exports._registerInterceptors = registerInterceptors;
module.exports._processConfigItem = processConfigItem;

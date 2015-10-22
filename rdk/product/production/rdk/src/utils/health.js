'use strict';

var _ = require('underscore');
var dd = require('drilldown');

var healthCheckRegistry = {};
var resultRegistry = {};

function registerItem(item, name, type, logger) {
    if(item.healthcheck) {
        var healthcheck = item.healthcheck;
        if(!healthcheck.dependencies && !healthcheck.check) {
            logger.warn('health check has no check function or dependencies: ' + name);
        }

        var registeredCheck = {
            name: name,
            type: type
        };

        if(healthcheck.check) {
            registeredCheck.check = healthcheck.check;
        }

        if(healthcheck.interval) {
            registeredCheck.interval = healthcheck.interval;
            //this bit starts up the regular background check of the healthcheck
            setInterval(updateResultRegistry, registeredCheck.interval, registeredCheck, logger, true);
        }

        if(healthcheck.dependencies) {
            registeredCheck.dependencies = healthcheck.dependencies;
        }

        var registeredCheckResult = {
            healthy: false,
            type: registeredCheck.type
        };

        if(registeredCheck.dependencies) {
            var dependencies = {};
            _.each(healthcheck.dependencies, function(dependency) {
                dependencies[dependency] = false;
            });
            registeredCheckResult.dependencies = dependencies;
        }

        if(healthcheck.check) {
            registeredCheckResult.check = false;
        }

        healthCheckRegistry[name] = registeredCheck;
        resultRegistry[name] = registeredCheckResult;
        if(healthcheck.interval) {
            updateResultRegistry(registeredCheck, logger, true);
        }
    }
    else {
        logger.warn('no healthcheck defined for ' + type + ' named ' + name);
    }
}

function registerResource(configItem, resourceName, logger) {
    registerItem(configItem, resourceName, 'resource', logger);
    logger.info('registered resource: ' + resourceName);
}

function registerSubsystem(subsytemConfig, subsystemName, logger) {
    registerItem(subsytemConfig, subsystemName, 'subsystem', logger);
    logger.info('registered subsystem: ' + subsystemName);
}

function executeAll(logger) {
    var isHealthy = true;
    _.each(healthCheckRegistry, function(registeredCheck) {
        if(!updateResultRegistry(registeredCheck, logger, false)) {
            isHealthy = false;
        }
    });
    return isHealthy;
}

function updateResult(registeredResult, isHealthy) {
    registeredResult.check = isHealthy;
}

function updateResultRegistry(registeredCheck, logger, fromInterval) {
    var healthy = true;

    if(!fromInterval) {
        logger.info('checking: ' + registeredCheck.name);
    }

    var regCheck = registeredCheck;
    var regResult = resultRegistry[registeredCheck.name];

    if(regCheck.check) {
        if(regCheck.interval && !fromInterval) {
            healthy = resultRegistry[regCheck.name].check;
        } else {
            registeredCheck.check(updateResult.bind(null, regResult));
            healthy = resultRegistry[regCheck.name].check;
        }
    }

    if(regCheck.dependencies) {
        var dependencieshealthy = true;
        _.each(registeredCheck.dependencies, function(dependency) {
            if(healthCheckRegistry[dependency]) {
                regResult.dependencies[dependency] = resultRegistry[dependency].healthy;
                if(!resultRegistry[dependency].healthy) {
                    dependencieshealthy = false;
                }
            } else {
                logger.warn('health check ' + regCheck.name + ' has unknown dependency ' + dependency);
            }
        });
        healthy = healthy && dependencieshealthy;
    }
    regResult.healthy = healthy;
    return regResult.healthy;
}

var healthcheckInterceptors = {
    authentication: false,
    pep: false,
    operationalDataCheck: false,
    synchronize: false
};

module.exports.healthcheckresource = function() {
    return [{
        name: 'healthy',
        path: 'healthy',
        interceptors: healthcheckInterceptors,
        permitResponseFormat: true,
        get: function(req, res) {
            var isHealthy = executeAll(req.logger);
            req.logger.info('received request for health check, value ' + isHealthy);

            if(req.param.e && isHealthy) {
                return res.status(500).rdkSend();
            } else if(req.param.e && !isHealthy) {
                return res.status(500).rdkSend();
            } else {
                return res.rdkSend(isHealthy);
            }
            return res.rdkSend(isHealthy);
        }
    }, {
        name: 'detail-html',
        path: 'detail/html',
        interceptors: healthcheckInterceptors,
        get: function(req, res) {
            var result = executeAll(req.logger);
            dd(req)('_resourceConfigItem')('permitResponseFormat').set(true);
            res.send(createHtmlViewOfHealthCheck(req.logger, result));
        }
    }, {
        name: 'checks',
        path: 'checks',
        interceptors: healthcheckInterceptors,
        get: function(req, res) {
            res.rdkSend(healthCheckRegistry);
        }
    }, {
        name: 'detail',
        path: 'detail',
        interceptors: healthcheckInterceptors,
        get: function(req, res) {
            resultRegistry.isHealthy = executeAll(req.logger);
            res.rdkSend(resultRegistry);
        }
    }, {
        name: 'noupdate',
        path: 'noupdate',
        interceptors: healthcheckInterceptors,
        get: function(req, res) {
            res.rdkSend(resultRegistry);
        }
    }];
};

function createHtmlViewOfHealthCheck(logger, result) {
    var redicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMCAY' +
        'AAABWdVznAAAAdUlEQVQoz2P4jwQuL5r1f1Os//9F1lpgDGKDxJABA4j4/OzJ/81xAf' +
        '/nGythxSA5kBq4BnyKkTWBNYCsJKQYhkFqGUDuRBY8VF/y//Pzp2AMYiPLgdQygDyHL' +
        'AhSCAMgNrIcSC3pGkh2EsmeJjlYyYo4UpIGAAlPckAzjFgSAAAAAElFTkSuQmCC';
    var greenicon = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAAMC' +
        'AYAAABWdVznAAAAU0lEQVQoz2NgQAIam01LgPgUEH+FYhC7hAEdAAXlgfgkEP/HgUFy' +
        '8sga8CmGa0J2xn8icQkD1J3EajjFAPUcsRq+kqWBZCeR5mmSg5WsiCMlaQAAmUvzxXV' +
        'dlqcAAAAASUVORK5CYII=';

    var output = '<html><body>';
    if(result) {
        output = output + 'healthy <img src="' + greenicon + '" /> ';
    } else {
        output = output + 'not healthy <img src="' + redicon + '" /> ';
    }
    output = output + '<table border="1"><tr><td>name</td><td>health</td><td>dependencies</td></tr>';

    _.each(healthCheckRegistry, function(registeredCheck) {
        output = output + '<tr><td>' + registeredCheck.name + '</td><td>';
        if(resultRegistry[registeredCheck.name].healthy) {
            output = output + '<img src="' + greenicon + '" alt="healthy" /> ';
        } else {
            output = output + '<img src="' + redicon + '" alt="unhealty" /> ';
        }
        output = output + '</td><td>';

        var dependencies = resultRegistry[registeredCheck.name].dependencies;

        if(dependencies) {
            _.each(dependencies, function(dependency, key) {
                if(dependency) {
                    output = output + key + '<img src="' + greenicon + '" alt="healthy" /> ';
                } else {
                    output = output + key + '<img src="' + redicon + '" alt="unhealty" /> ';
                }
            });
        }

        output = output + '</td></tr>';
    });

    output = output + ' </table></body></html>';
    return output;
}

module.exports.registerSubsystem = registerSubsystem;
module.exports.registerResource = registerResource;
module.exports.executeAll = executeAll;

'use strict';
var rdk = require('../../core/rdk');
var uriBuilder = rdk.utils.uriBuilder;
var httpUtil = rdk.utils.http;
var _ = require('underscore');
var jbpm = require('../../subsystems/jbpm-subsystem');
var parseString = require('xml2js').parseString;
var fs = require('fs');
var async = require('async');

function getGenericJbpmConfig(req) {
    var config = jbpm.getJBPMHttpConfig(req.app.config, req.logger);

    //TODO use value from req.session.user.username? eg 9E7A;pu1234
    // currently this uses the admin credentials from config for authentication
    config = jbpm.addAuthToConfig(req.app.config.jbpm.adminUser.username, req.app.config.jbpm.adminUser.password, config);
    return config;
}

// var parameterTemplateXml = '<item key="{Key}"><value xsi:type="xs:{Type}" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">{Value}</value></item>';

// var startProcessCommandTemplateXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
// '<command-request>' +
//   '<deployment-id>{DeploymentId}</deployment-id>' +
//   '<start-process processId="{ProcessId}">' +
//     '<parameter>' +
//     '{Parameters}' +
//     '</parameter>' +
//   '</start-process>' +
// '</command-request>';

function startProcess(req, res) {
    req.audit.dataDomain = 'Tasks';
    req.audit.logCategory = 'START_PROCESS';

    var deploymentId = req.body.deploymentId || null;

    var idError;
    if (!deploymentId) {
        idError = new Error('Missing deploymentId property/value in input JSON.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    // Map deploymentid to actual value
    if (!req.app.config.jbpm.deployments[deploymentId]) {
        idError = new Error('Invalid deploymentId property value.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }
    deploymentId = req.app.config.jbpm.deployments[deploymentId];

    var processDefId = req.body.processDefId || null;
    if (!processDefId) {
        idError = new Error('Missing processDefId property/value in input JSON.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    var config = getGenericJbpmConfig(req);

    var uri = uriBuilder.fromUri(config.options.path)
        .path('/execute')
        .build();

    config.options.path = uri;
    config.options.method = 'POST';
    if (!config.options.headers) {
        config.options.headers = {};
    }

    config.options.headers['Content-Type'] = 'application/xml';
    config.options.headers.Accept = 'application/xml';

    async.parallel([
            function(callback) {
                var startProcessCommandTemplateXml = fs.readFileSync(__dirname + '/start-process-command-template.xml', {
                    encoding: 'utf8',
                    flag: 'r'
                });
                var startProcessCommandXml = startProcessCommandTemplateXml.replace('{DeploymentId}', deploymentId).replace('{ProcessId}', processDefId);
                callback(null, startProcessCommandXml);
            },
            function(callback) {
                var parameterList = '';
                if (req.body.parameter) {
                    var parameterTemplateXml = fs.readFileSync(__dirname + '/parameter-template.xml', {
                        encoding: 'utf8',
                        flag: 'r'
                    });
                    _.each(req.body.parameter, function(value, key) {
                        var type = typeof value;
                        parameterList = parameterList + parameterTemplateXml.replace('{Key}', key).replace('{Type}', type).replace('{Value}', value);

                    });
                }
                callback(null, parameterList);
            }
        ],
        function(err, results) {
            if (err) {
                req.logger.error(err);
                return res.status(rdk.httpstatus.bad_request).rdkSend(err);
            }

            var startProcessCommandXml = results[0].replace('{Parameters}', results[1]);
            httpUtil.post(startProcessCommandXml, req.app.config, config, function(err, result) {
                if (err) {
                    req.logger.error(err);
                    return res.status(rdk.httpstatus.bad_request).rdkSend(err);
                }

                parseString(result, function(err, jsonResult) {
                    if (err) {
                        req.logger.error(result);
                        return res.status(rdk.httpstatus.internal_server_error).rdkSend('Invalid error XML received(' + err + ')');
                    }

                    if (jsonResult['command-response']) {
                        if (jsonResult['command-response'].exception) {
                            return res.status(rdk.httpstatus.bad_request).rdkSend(jsonResult['command-response'].exception[0].message[0]);
                        } else {
                            if (jsonResult['command-response']['process-instance']) {
                                return res.rdkSend({
                                    message: 'Success',
                                    data: {
                                        processInstanceId: jsonResult['command-response']['process-instance'][0].id[0]
                                    }
                                });
                            }

                            return res.rdkSend('Success');
                        }
                    }

                    return res.rdkSend(jsonResult);
                });

            });
        });

}

module.exports.startProcess = startProcess;

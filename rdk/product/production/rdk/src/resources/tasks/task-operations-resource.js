'use strict';

var rdk = require('../../core/rdk');
var uriBuilder = rdk.utils.uriBuilder;
var httpUtil = rdk.utils.http;
var _ = require('underscore');
var jbpm = require('../../subsystems/jbpm-subsystem');
var async = require('async');
var parseString = require('xml2js').parseString;
var fs = require('fs');

function getGenericJbpmConfig(req) {
    var config = jbpm.getJBPMHttpConfig(req.app.config, req.logger);

    //TODO use value from req.session.user.username? eg 9E7A;pu1234
    // currently this uses the admin credentials from config for authentication
    config = jbpm.addAuthToConfig(req.app.config.jbpm.nurseUser.username, req.app.config.jbpm.nurseUser.password, config);
    return config;
}

function getTasks(req, res) {
    req.audit.dataDomain = 'Tasks';
    req.audit.logCategory = 'GET_TASKS';

    // JBPM endpoint: /task/query
    // parameters:
    // potentialOwner
    // status
    // taskOwner
    // workItemId
    // taskId
    // businessAdministrator
    // processInstanceId
    // union
    // language

    var config = getGenericJbpmConfig(req);

    config.options.path = uriBuilder.fromUri(config.options.path)
        .path('/query/runtime/task')
        .query('all')
        .build();

    httpUtil.fetch(req.app.config, config, function(err, result) {
        if (err) {
            req.logger.error(err);
            return res.status(rdk.httpstatus.not_found).rdkSend(err);
        }
        var returnedData;
        try {
            returnedData = JSON.parse(result);
        } catch (ex) {
            req.logger.error(ex);
            return res.status(rdk.httpstatus.bad_request).rdkSend(ex.message);
        }

        var formattedResponse = {
            data: {
                items: []
            }
        };

        if (returnedData.hasOwnProperty('taskInfoList') && Array.isArray(returnedData.taskInfoList)) {
            _.each(returnedData.taskInfoList, function(taskInfo) {
                if (taskInfo.hasOwnProperty('taskSummaries') && Array.isArray(taskInfo.taskSummaries)) {
                    //no idea what it means if a task has more than 1 summary.. take the last summary
                    var localReturnObj = taskInfo.taskSummaries[taskInfo.taskSummaries.length - 1];
                    if (taskInfo.hasOwnProperty('variables')) {
                        localReturnObj.variables = taskInfo.variables;
                    }

                    //assign the parent's process instance id if it isn't included in the task summary
                    if (!localReturnObj.hasOwnProperty('processInstanceId') && taskInfo.hasOwnProperty('processInstanceId')) {
                        localReturnObj.processInstanceId = taskInfo.processInstanceId;
                    }
                    formattedResponse.data.items.push(localReturnObj);
                }
            });
        }

        return res.rdkSend(formattedResponse);
    });
}

function getTasksByPatient(req, res) {
    req.audit.dataDomain = 'Tasks';
    req.audit.logCategory = 'GET_TASKS_BY_PATIENT';

    var config = getGenericJbpmConfig(req);

    config.options.path = uriBuilder.fromUri(config.options.path)
        .path('/query/runtime/process')
        .query('var_patientid', req.param('patientid'))
        .build();

    httpUtil.fetch(req.app.config, config, function(err, result) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.not_found).rdkSend(err);
        }
        var returnedData;
        try {
            returnedData = JSON.parse(result);
        } catch (ex) {
            req.logger.error(ex);
            return res.status(rdk.httpstatus.bad_request).rdkSend(ex.message);
        }

        var formattedResponse = {
            data: {
                items: []
            }
        };

        if (returnedData.hasOwnProperty('processInstanceInfoList') && Array.isArray(returnedData.processInstanceInfoList)) {
            var taskObj = {};
            _.each(returnedData.processInstanceInfoList, function(process, index) {
                if (process.processInstance.hasOwnProperty('id')) {
                    taskObj['' + index] =

                        function(callback) {

                            var contentConfig = getGenericJbpmConfig(req);
                            contentConfig.options.path = uriBuilder.fromUri(contentConfig.options.path)
                                .path('/query/runtime/task')
                                .query('piid', process.processInstance.id)
                                .build();

                            //fetch the task content data
                            httpUtil.fetch(req.app.config, contentConfig, function(contentErr, contentResult) {
                                if (contentErr) {
                                    callback(contentErr);
                                }
                                var returnedContent;
                                try {
                                    returnedContent = JSON.parse(contentResult);
                                } catch (ex) {
                                    callback(ex);
                                }
                                callback(null, returnedContent);
                            });

                        };
                }
            });

            async.parallelLimit(taskObj, 5, function(err, returnedData) {
                if (!err) {
                    _.each(returnedData, function(data) {
                        if (data.hasOwnProperty('taskInfoList') && Array.isArray(data.taskInfoList)) {
                            _.each(data.taskInfoList, function(taskInfo) {
                                if (taskInfo.hasOwnProperty('taskSummaries') && Array.isArray(taskInfo.taskSummaries)) {
                                    //no idea what it means if a task has more than 1 summary.. take the last summary
                                    var localReturnObj = taskInfo.taskSummaries[taskInfo.taskSummaries.length - 1];
                                    if (taskInfo.hasOwnProperty('variables')) {
                                        localReturnObj.variables = taskInfo.variables;
                                    }

                                    //assign the parent's process instance id if it isn't included in the task summary
                                    if (!localReturnObj.hasOwnProperty('processInstanceId') && taskInfo.hasOwnProperty('processInstanceId')) {
                                        localReturnObj.processInstanceId = taskInfo.processInstanceId;
                                    }
                                    formattedResponse.data.items.push(localReturnObj);
                                }
                            });
                        }
                    });
                } else {
                    //return the list of tasks without content if the content queries errored
                    req.logger.error('Error while retrieving task content: ' + err);
                }
                return res.rdkSend(formattedResponse);
            });
        }
    });

}

function buildChangeTaskStateResponse(req, res, err, result) {
    if (err) {
        req.logger.error(err);
        res.status(rdk.httpstatus.bad_request).rdkSend(err);
    }

    var resultJson;
    try {
        resultJson = JSON.parse(result);
    } catch (e) {
        // ignore
    }

    if (resultJson) {
        return res.rdkSend('Success');
    }

    parseString(result, function(err, resultJson) {
        if (err) {
            req.logger.error(result);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend('Invalid error XML received(' + err + ')');
        }

        var exception;
        if (resultJson['command-response']) {
            if (resultJson['command-response'].exception) {
                exception = resultJson['command-response'].exception[0];
            }
        } else {
            exception = resultJson.exception;
        }

        if (exception) {
            return res.status(rdk.httpstatus.bad_request).rdkSend(exception.message[0]);
        }

        return res.rdkSend('Success');
    });
}

//var parameterTemplateXml = '<item key="{Key}"><value xsi:type="xs:{Type}" xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance">{Value}</value></item>';

// var completeTaskCommandTemplateXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?>' +
// '<command-request>' +
//   '<deployment-id>{DeploymentId}</deployment-id>' +
//   '<complete-task>' +
//     '<task-id>{TaskId}</task-id>' +
//     '<user-id>{User}</user-id>' +
//     '<data>' +
//     '{Parameters}' +
//     '</data>' +
//   '</complete-task>' +
// '</command-request>';

function handleComplete(req, res) {

    var deploymentId = req.body.deploymentid || null;

    var idError;
    if (!deploymentId) {
        idError = new Error('Missing deploymentid property in input JSON.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    // Map deploymentid to actual value
    if (!req.app.config.jbpm.deployments[deploymentId]) {
        idError = new Error('Invalid deploymentid property value.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }
    deploymentId = req.app.config.jbpm.deployments[deploymentId];

    var user = req.body.user || null;
    if (!user) {
        idError = new Error('Missing user property in input JSON.');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    var taskId = req.param('taskid');

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
            var completeTaskCommandXml;
            var completeTaskCommandTemplateXml = fs.readFileSync(__dirname + '/complete-task-command-template.xml', {
                encoding: 'utf8',
                flag: 'r'
            });

            completeTaskCommandXml = completeTaskCommandTemplateXml.replace('{DeploymentId}', deploymentId).replace('{TaskId}', taskId).replace('{User}', user);
            callback(null, completeTaskCommandXml);
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
    ], function(err, results) {

        if (err) {
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        var completeTaskCommandXml = results[0].replace('{Parameters}', results[1]);
        httpUtil.post(completeTaskCommandXml, req.app.config, config, function(err, result) {
            return buildChangeTaskStateResponse(req, res, err, result);
        });
    });
}

function changeTaskState(req, res) {
    req.audit.dataDomain = 'Tasks';
    req.audit.logCategory = 'CHANGE_TASK_STATE';

    // JBPM endpoint: /task/{taskID}/{state}
    //state:
    //  activate
    //  claim
    //  claimnextavailable
    //  complete
    //  delegate
    //  exit
    //  fail
    //  forward
    //  nominate
    //  release
    //  resume
    //  skip
    //  start
    //  stop
    //  suspend
    // parameters:
    //  parameters may be needed to complete task

    var taskId = req.param('taskid');
    var newState = req.param('state');

    var idError;

    if (!taskId) {
        idError = new Error('Unable to retrieve Task ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    if (!newState) {
        idError = new Error('Unable to retrieve Task New State parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).rdkSend(idError.message);
    }

    var config = getGenericJbpmConfig(req);

    if (newState.toLowerCase() === 'complete') {
        return handleComplete(req, res);
    }

    var builder = uriBuilder.fromUri(config.options.path)
        .path('/task/' + taskId + '/' + newState);

    var uri = builder.build();
    config.options.path = uri;
    config.options.method = 'POST';

    httpUtil.post({}, req.app.config, config, function(err, result) {
        return buildChangeTaskStateResponse(req, res, err, result);
    });
}

module.exports.getTasks = getTasks;
module.exports.getTasksByPatient = getTasksByPatient;
module.exports.changeTaskState = changeTaskState;

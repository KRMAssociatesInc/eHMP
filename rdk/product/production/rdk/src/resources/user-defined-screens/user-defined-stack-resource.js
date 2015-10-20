'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;
var fs = require('fs');
var uds = require('./user-defined-screens-resource');
var dd = require('drilldown');
var nullchecker = rdk.utils.nullchecker;

var USER_SCREENS_CONFIG = 'UserScreensConfig';

var apiDocs = {
    get: {
        spec: {
            summary: 'Retrieve stacked graphs for a workspace',
            notes: '',
            method: 'GET',
            parameters: [
                rdk.docs.swagger.paramTypes.query(
                    'id', // name
                    'workspace name', // description
                    'string', // type
                    true // required
                ),
                rdk.docs.swagger.paramTypes.query('predefined', 'predefined screen flag (true or false)', 'string', false)
            ],
            responseMessages: [{
                code: rdk.httpstatus.internal_server_error
            }]
        }
    },
    post: {
        spec: {
            summary: 'Create a new stacked graph in a particular applet in a particular workspace',
            notes: '',
            method: 'POST',
            parameters: [
                rdk.docs.swagger.paramTypes.query(
                    'id',
                    'workspace name',
                    'string',
                    true
                ), rdk.docs.swagger.paramTypes.query(
                    'graphType',
                    'stacked graph type',
                    'string',
                    true
                ), rdk.docs.swagger.paramTypes.query(
                    'typeName',
                    'stacked graph data type for the supplied type of graph',
                    'string',
                    true
                ), rdk.docs.swagger.paramTypes.query(
                    'instanceId',
                    'stacked graph applet instance id',
                    'string',
                    true
                )
            ],
            responseMessages: [{
                code: rdk.httpstatus.internal_server_error
            }]

        }
    },
    delete: {
        spec: {
            summary: 'Remove a stacked graph in a particular applet in a particular workspace',
            notes: '',
            method: 'DELETE',
            parameters: [
                rdk.docs.swagger.paramTypes.query(
                    'id', // name
                    'workspace name', // description
                    'string', // type
                    true // required
                ), rdk.docs.swagger.paramTypes.query(
                    'graphType',
                    'stacked graph type',
                    'string',
                    true
                ), rdk.docs.swagger.paramTypes.query(
                    'typeName',
                    'stacked graph data type for the supplied type of graph',
                    'string',
                    true
                ), rdk.docs.swagger.paramTypes.query(
                    'instanceId',
                    'stacked graph applet instance id',
                    'string',
                    true
                )
            ],
            responseMessages: [{
                code: rdk.httpstatus.internal_server_error
            }]
        }
    },
    deleteApplet: {
        spec: {
            summary: '',
            notes: '',
            method: 'DELETE',
            parameters: [
                rdk.docs.swagger.paramTypes.query('StackedGraph', '', 'user-stack-delete-all')
            ],
            responseMessages: []
        },
        models: {
            'user-stack-delete-all': {
                id: 'StackedGraph',
                required: ['id', 'instanceId'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'workspace name'
                    },
                    instanceId: {
                        type: 'string',
                        description: 'Applet instance ID of the stacked graph'
                    }
                }
            }
        }
    },
    put: {
        spec: {
            summary: 'Update a stacked graph\'s order in a particular applet in a particular workspace',
            notes: '',
            method: 'PUT',
            parameters: [
                rdk.docs.swagger.paramTypes.body(
                    'id',
                    'workspace name',
                    'string',
                    true
                ),
                rdk.docs.swagger.paramTypes.body(
                    'instanceId',
                    'stacked graph applet instance id'
                ),
                rdk.docs.swagger.paramTypes.body(
                    'graphs',
                    'stacked graphs',
                    'array',
                    true
                )
            ],
            responseMessages: [{
                code: rdk.httpstatus.internal_server_error
            }]
        }
    }
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: getStackedGraph,
        apiDocs: apiDocs.get,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        permissions: ['save-userdefined-screens']
    }, {
        name: '',
        path: '',
        post: createStackedGraph,
        apiDocs: apiDocs.post,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        permissions: ['save-userdefined-screens']
    }, {
        name: '',
        path: '',
        delete: removeStackedGraph,
        apiDocs: apiDocs.delete,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        permissions: ['save-userdefined-screens']
    }, {
        name: 'all',
        path: '/all',
        delete: removeStackedGraphApplet,
        apiDocs: apiDocs.deleteApplet,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        permissions: ['save-userdefined-screens']
    },
    {
        name: '',
        path: '',
        put: updateStackedGraph,
        apiDocs: apiDocs.put,
        interceptors: {
            operationalDataCheck: false,
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jdsSync']
        },
        permissions: ['save-userdefined-screens']
    }];
}

function getStackedGraph(req, res) {
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var stackedId = generateStackedId(req);
    if (!stackedId) {
        var stackedIdError = new Error('Unable to reconstruct stacked graph id from http params');
        req.logger.error(stackedIdError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(stackedIdError);
    }

    getStackedData('', stackedId, req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            res.status(rdk.httpstatus.ok).rdkSend(data);
        }
    });
}

function getPredefinedStackedGraphData(req, screenId, callback) {
    var cbwGraphs = [];
    var stackedData;
    var filename;

    filename = './resources/user-defined-screens/assets/' + screenId + '_stacked.json';
    stackedData = cbwGraphs.filter(function (el) {
        return (el._id.indexOf(screenId) >= 0);
    });
    if (stackedData.length === 0) {
        //just in case there were more matches than one, ignore it
        fs.exists(filename, function(exists) {
            if(exists) {
                fs.readFile(filename, 'utf8', function (err, result) {
                    if (err) {
                        req.logger.error(err.message);
                        callback(err);
                        return;
                    }
                    try {
                        result = JSON.parse(result);
                    } catch (ex) {
                        req.logger.error(ex);
                        callback(ex);
                        return;
                    }
                    cbwGraphs.push(result);

                    stackedData = dd(result)('userdefinedgraphs').val;

                    if(!_.isUndefined(stackedData)) {
                        stackedData.id = screenId;
                    }
                    callback(null, stackedData);
                });
            } else {
                callback(null, '');
            }
        });
    }
}

function getStackedData(predefinedScreensIdsArray, stackedId, req, callback) {
    var cbwGraphs = [];
    var predefinedFromRequest = req.query.predefined;
    var predefined = 'false';
    var screenName = req.param('id') || req.param('fromId');
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/get/' + stackedId
    });

    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger || {}
    };

    _.each(predefinedScreensIdsArray, function(pdsId) {
        if(screenName === pdsId) {
            req.logger.debug('Setting predefined to true for screenName222: ' + screenName + ' pdsId: ' + pdsId);
            predefined = 'true';
        }
    });

    if (((predefined === 'true') || (predefinedFromRequest === 'true')) && (screenName.indexOf('-cbw') !== -1)) {
        //Not all predefined screens have filters
        /*if (screenName.indexOf('-cbw') === -1) {
            callback(null, '');
            return;
        }*/
        var returnedData;
        var filename = __dirname + '/assets/' + screenName + '_stacked.json';
        returnedData = cbwGraphs.filter(function (el) {
            return (el._id.indexOf(screenName) >= 0);
        });
        if (returnedData.length > 0) {
            //just in case there were more matches than one, return the first one
            callback(null, returnedData[0]);
        } else {
            fs.exists(filename, function(exists) {
                if(exists) {
                    fs.readFile(filename, 'utf8', function (err, result) {
                        if (err) {
                            config.logger.error(err.message);
                            callback(err);
                            return;
                        }
                        try {
                            returnedData = JSON.parse(result);
                        } catch (ex) {
                            config.logger.error(ex);
                            callback(ex);
                            return;
                        }
                        cbwGraphs.push(returnedData);
                        callback(null, returnedData);
                    });
                } else {
                    callback(null, '');
                }
            });
        }

    } else {

        httpUtil.fetch(req.app.config, config, function(err, result) {
            if (err) {
                config.logger.error(err.message);
                callback(err);
                return;
            }

            var returnedData;

            try {
                returnedData = JSON.parse(result);
            } catch (ex) {
                config.logger.error(ex);
                callback(ex);
                return;
            }

            callback(null, returnedData);
        });
    }
}

function updateStackedGraph(req, res){
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    req.logger.info('req params', req);

    var instanceId = req.body.instanceId || null;
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var graphs = req.body.graphs || null;
    if (!graphs){
        var graphsError = new Error('Unable to find graphs parameter');
        req.logger.error(graphsError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(graphsError);
    }

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    uds.getScreenData(screenId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

       var userDefinedGraphData = [];
        var count;
        var stackedId = req.param('id');
        var stackedGraphData = {};

        userDefinedGraphData = dd(data)('userDefinedGraphs').val;

        for (count = 0; count < userDefinedGraphData.length; count++) {
            if (userDefinedGraphData[count].id === stackedId) {
                stackedGraphData = userDefinedGraphData[count];
                break;
            }
        }

        var matchedApplet = _.find(stackedGraphData.applets, function(applet){
            return applet.instanceId === instanceId;
        });

        if(matchedApplet){
            matchedApplet.graphs = graphs;

            postStackedData(data, req, function(err) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            });
        } else {
            var doesNotExistError = 'Unable to update stacked graph because graph does not exist already';
            req.logger.error(doesNotExistError);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(doesNotExistError);
        }
    });
}

function createStackedGraph(req, res) {
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var graphType = getGraphTypeParameter(req);
    if (!graphType) {
        var graphError = new Error('Unable to find graph type parameter');
        req.logger.error(graphError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(graphError);
    }

    var typeName = getTypeNameParameter(req);
    if (!typeName) {
        var typeError = new Error('Unable to find type name parameter');
        req.logger.error(typeError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(typeError);
    }

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    //Get UserScreensConfig and update with new or updated graphs
    uds.getScreenData(screenId, req, function(err, data) {
        req.logger.debug('getting data in createStackedGraph for screenID: ' + screenId + ' and data returned is this: ' + data);
        if (err) {
            req.logger.error('Unable to save custom filter due to error retrieving UserScreensConfig data');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {
            var udsData = {};
            var userDefinedGraphData = [];
            var count;
            var stackedId = req.param('id');
            var stackedGraphData = {};
            var found;

            userDefinedGraphData = dd(data)('userDefinedGraphs').val;

            if(nullchecker.isNotNullish(userDefinedGraphData)) {
                for (count = 0; count < userDefinedGraphData.length; count++) {
                    console.log('count 1: ' + count);
                    if (userDefinedGraphData[count].id === stackedId) {
                        stackedGraphData = userDefinedGraphData[count];
                        count = userDefinedGraphData.length;
                        found = true;
                        stackedGraphData = processDataForCreate(stackedId, instanceId, graphType, typeName, stackedGraphData);
                    }
                }

                if(!found) {
                    stackedGraphData = processDataForCreate(stackedId, instanceId, graphType, typeName, stackedGraphData);
                    var updatedGraphData = userDefinedGraphData.concat(stackedGraphData);
                    userDefinedGraphData = updatedGraphData;
                }
            } else {
                userDefinedGraphData = [];
                stackedGraphData = processDataForCreate(stackedId, instanceId, graphType, typeName, stackedGraphData);
                userDefinedGraphData.push(stackedGraphData);
            }

            data.userDefinedGraphs = userDefinedGraphData;

            udsData = data;

            //The UI is coded to expect strings, store it as such
            var content = JSON.stringify(udsData);

            req.logger.debug('Inside userDefinedFilters createFilter filter data before post: ' + JSON.stringify(content));

            postStackedData(data, req, function(err) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            });
        }
    });


    //check if stacked graph data for this workspace already exists
    /*getStackedData('', stackedId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to save stacked graph due to error retrieving existing stacked graph information');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {

            data = processDataForCreate(stackedId, instanceId, graphType, typeName, data);

            //update if it does, create if not
            postStackedData(data, req, function(err, finalData) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    //res.status(rdk.httpstatus.ok).rdkSend(finalData);
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            });
        }
    });*/
}

function processDataForCreate(stackedId, instanceId, graphType, typeName, data) {
    //look in data for graphs for this applet
    if (!data.hasOwnProperty('id')) {
        data.id = stackedId;
    }

    if (!data.hasOwnProperty(('applets'))) {
        data.applets = [];
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.applets, function(applet) {
        appletIndex++;
        if (applet && applet.hasOwnProperty('instanceId')) {
            if (applet.instanceId === instanceId) {
                return true;
            }
        }
        return false;
    });

    if (matchedApplet && matchedApplet.hasOwnProperty('graphs')) {
        if (!_.find(matchedApplet.graphs, function(graph) {
                if (_.isEqual(graph, {
                        graphType: graphType,
                        typeName: typeName
                    })) {
                    return true;
                }

                return false;
            })) {
            //stacked graph is not already in the list
            data.applets[appletIndex].graphs.push({
                graphType: graphType,
                typeName: typeName
            });
        } //else the graph already exists in the list and won't be added
    } else {
        //no matching applet id
        data.applets.push({
            graphs: [{
                graphType: graphType,
                typeName: typeName
            }],
            instanceId: instanceId
        });
    }

    return data;
}

function postStackedData(content, req, callback) {
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'POST',
        path: '/user/set/this'
    });

    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger || {}
    };

    httpUtil.post(content, req.app.config, config,
        function(err, data) {
            if (err) {
                config.logger.error('Unable to POST stacked graph data. Error: ' + err);
                if (callback) {
                    callback(err);
                }
            } else {
                if (callback) {
                    callback(null, data);
                }
            }
        },
        function responseProcessor(statusCode, data) {
            return data;
        }
    );
}

function duplicateStackedData(req, sourceStackedId, destinationStackId, callback) {
    //get the stacked graphs from the source workspace
    getStackedData('', sourceStackedId, req, function(err, data) {
        if (err) {
            callback(err);
        } else {
            //Post the same stacked graphs to the new workspace after updating the _id
            if (data && data.hasOwnProperty('_id')) {
                data._id = destinationStackId;
                postStackedData(data, req, callback);
            } else {
                callback(null, data);
            }
        }
    });
}

/*exported removeStackedGraph */
function removeStackedGraph(req, res) {
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';
    var userDefinedGraphData = [];

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var graphType = getGraphTypeParameter(req);
    if (!graphType) {
        var graphError = new Error('Unable to find graph type parameter');
        req.logger.error(graphError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(graphError);
    }

    var typeName = getTypeNameParameter(req);
    if (!typeName) {
        var typeError = new Error('Unable to find type name parameter');
        req.logger.error(typeError);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(typeError);
    }

    var stackedId = req.param('id');

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    //check if filter for this workspace already exists
    uds.getScreenData(screenId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }

        userDefinedGraphData = dd(data)('userDefinedGraphs').val;
        var stackedGraphData = {};
        var count = 0;

        for (count = 0; count < userDefinedGraphData.length; count++) {
            if (userDefinedGraphData[count].id === stackedId) {
                stackedGraphData = userDefinedGraphData[count];
                break;
            }
        }

        var appletIndex = -1;
        var matchedApplet = _.find(stackedGraphData.applets, function(applet) {
            appletIndex++;
            if (applet && applet.hasOwnProperty('instanceId')) {
                if (applet.instanceId === instanceId) {
                    return true;
                }
            }
            return false;
        });

        if (matchedApplet && matchedApplet.hasOwnProperty('graphs')) {
            stackedGraphData = removeStackedGraphData(graphType, typeName, appletIndex, stackedGraphData);

            //delete entire workspace sort definition if no applets remain
            if(userDefinedGraphData[count].applets.length === 0) {
                userDefinedGraphData.splice(count, 1);
            }

            postStackedData(data, req, function(err) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                } else {
                    res.status(rdk.httpstatus.ok).rdkSend(data);
                }
            });
        } else {
            //no matching applet id
            err = new Error('Unable to find stacked graph data with this instanceid');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        }
    });
}

function removeStackedGraphData(graphType, typeName, appletIndex, data) {
    //delete graph from array
    //var removeIndex = data.userdefinedgraphs.applets[appletIndex].graphs.indexOf({ graphType: graphType, typeName: typeName });
    var removeIndex = -1;
    for (var i = 0; i < data.applets[appletIndex].graphs.length; i++) {
        if (_.isEqual(data.applets[appletIndex].graphs[i], {
                graphType: graphType,
                typeName: typeName
            })) {
            removeIndex = i;
        }
    }

    if (removeIndex > -1) {
        data.applets[appletIndex].graphs.splice(removeIndex, 1);
    }

    //delete entire applet definition if no graphs remain
    if (data.applets[appletIndex].graphs.length === 0) {
        data.applets.splice(appletIndex, 1);
    }
    return data;
}

//delete entire graph set for a workspace
//this is only called when all graphs for all applets in a workspace have been removed
function deleteStackedData(stackedId, req, callback) {
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/destroy/' + stackedId
    });

    var config = {
        options: options,
        protocol: 'http',
        logger: req.logger || {}
    };

    httpUtil.fetch(req.app.config, config, function(err, result) {
        if (err) {
            config.logger.error(err.message);
            callback(err);
            return;
        }
        var returnedData;
        try {
            returnedData = JSON.parse(result);
            config.logger.debug(returnedData);
        } catch (ex) {
            config.logger.error(err.message);
            callback(err);
            return;
        }
        if (result === '{}') {
            callback(null, returnedData);
        } else {
            //malformed json
            err = new Error('Unexpected JSON format');
            callback(err);
            return;
        }

    });
}

/*exported removeStackedGraphApplet */
function removeStackedGraphApplet(req, res) {
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';
    var userDefinedGraphData = [];

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).rdkSend(idErr);
    }

    var stackedId = req.param('id');

    var screenId = createScreenIdFromRequest(req, USER_SCREENS_CONFIG);

    //check if filter for this workspace already exists
    uds.getScreenData(screenId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete stacked graph applet due to error retrieving existing graph information');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
        } else {

            if (!data.hasOwnProperty('userDefinedGraphs')) {
                err = new Error('No stacked graphs defined for this applet');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            }

            userDefinedGraphData = dd(data)('userDefinedGraphs').val;
            var stackedGraphData = {};
            var count = 0;

            for (count = 0; count < userDefinedGraphData.length; count++) {
                if (userDefinedGraphData[count].id === stackedId) {
                    stackedGraphData = userDefinedGraphData[count];
                    break;
                }
            }

            var appletIndex = -1;
            var matchedApplet = _.find(stackedGraphData.applets, function(applet) {
                appletIndex++;
                if (applet && applet.hasOwnProperty('instanceId')) {
                    if (applet.instanceId === instanceId) {
                        return true;
                    }
                }
                return false;
            });

            if (matchedApplet) {
                stackedGraphData.applets.splice(count, 1);

                postStackedData(data, req, function(err) {
                    if (err) {
                        req.logger.error(err);
                        res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
                    } else {
                        res.status(rdk.httpstatus.ok).rdkSend(data);
                    }
                });
            } else {
                //no matching applet id
                err = new Error('Unable to find stacked graph data with this instanceid');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).rdkSend(err);
            }

        }
    });
}

function generateStackedId(req) {
    var userSession = req.session.user || {};
    var id = req.param('id') || null;
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_stacked';
    } else {
        return null;
    }
}

function generateStackedIdFromString(req, id) {
    var userSession = req.session.user || {};
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_stacked';
    } else {
        return null;
    }
}

function getInstanceIdParameter(req) {
    return req.param('instanceId') || null;
}

function getGraphTypeParameter(req) {
    return req.param('graphType') || null;
}


function getTypeNameParameter(req) {
    return req.param('typeName') || null;
}

function createScreenIdFromRequest(req, screenType) {
    var uid;
    var userSession = req.session.user;
    var site = dd(userSession)('site').val;
    var ien = dd(userSession)('duz')(site).val;

    if(!_.isUndefined(site) && !_.isUndefined(ien)) {
        uid = site.concat(';').concat(ien);
        uid = uid.concat('_').concat(screenType);
    }

    return uid;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.generateStackedIdFromString = generateStackedIdFromString;
module.exports._generateStackedId = generateStackedId;
module.exports._processDataForCreate = processDataForCreate;
module.exports._removeStackedGraphData = removeStackedGraphData;
module.exports.deleteStackedData = deleteStackedData;
module.exports.duplicateStackedData = duplicateStackedData;
module.exports.getStackedData = getStackedData;
module.exports.getPredefinedStackedGraphData = getPredefinedStackedGraphData;

/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;
var fs = require('fs');

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
            pep: false
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
            pep: false
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
            pep: false
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
            pep: false
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
        return res.status(rdk.httpstatus.internal_server_error).send(stackedIdError);
    }

    getStackedData(stackedId, req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            res.status(rdk.httpstatus.ok).send(data);
        }
    });
}
var cbwGraphs = [];
function getStackedData(stackedId, req, callback) {
    var predefined = req.query.predefined;
    var screenName = req.param('id') || req.param('fromId');
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/get/' + stackedId
    });

    var config = {
        options: options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger || {}
    };

    if (predefined === 'true') {
        //Not all predefined screens have filters
        if (screenName.indexOf('-cbw') === -1) {
            callback(null, '');
            return;
        }
        var returnedData;
        var filename = './resources/userdefinedscreens/assets/' + screenName + '_stacked.json';
        returnedData = cbwGraphs.filter(function (el) {
            return (el._id.indexOf(screenName) >= 0);
        });
        if (returnedData.length > 0) {
            //just in case there were more matches than one, return the first one
            callback(null, returnedData[0]);
        } else {
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
        }

    } else {

        httpUtil.fetch(config, function(err, result) {
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

function createStackedGraph(req, res) {
    req.audit.dataDomain = 'Stacked';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var stackedId = generateStackedId(req);
    if (!stackedId) {
        var stackedIdError = new Error('Unable to reconstruct stacked graph id from http params');
        req.logger.error(stackedIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(stackedIdError);
    }

    var graphType = getGraphTypeParameter(req);
    if (!graphType) {
        var graphError = new Error('Unable to find graph type parameter');
        req.logger.error(graphError);
        return res.status(rdk.httpstatus.internal_server_error).send(graphError);
    }

    var typeName = getTypeNameParameter(req);
    if (!typeName) {
        var typeError = new Error('Unable to find type name parameter');
        req.logger.error(typeError);
        return res.status(rdk.httpstatus.internal_server_error).send(typeError);
    }

    //check if stacked graph data for this workspace already exists
    getStackedData(stackedId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to save stacked graph due to error retrieving existing stacked graph information');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {

            data = processDataForCreate(stackedId, instanceId, graphType, typeName, data);

            //update if it does, create if not
            postStackedData(data, req, function(err, finalData) {
                if (err) {
                    req.logger.error(err);
                    res.status(rdk.httpstatus.internal_server_error).send(err);
                } else {
                    //res.status(rdk.httpstatus.ok).send(finalData);
                    res.status(rdk.httpstatus.ok).send(data);
                }
            });
        }
    });
}

function processDataForCreate(stackedId, instanceId, graphType, typeName, data) {
    //look in data for graphs for this applet
    if (!data.hasOwnProperty('_id')) {
        data._id = stackedId;
    }

    if (!data.hasOwnProperty('userdefinedgraphs')) {
        data.userdefinedgraphs = {};
    }

    if (!data.userdefinedgraphs.hasOwnProperty(('applets'))) {
        data.userdefinedgraphs.applets = [];
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.userdefinedgraphs.applets, function(applet) {
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
            data.userdefinedgraphs.applets[appletIndex].graphs.push({
                graphType: graphType,
                typeName: typeName
            });
        } //else the graph already exists in the list and won't be added
    } else {
        //no matching applet id
        data.userdefinedgraphs.applets.push({
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
        timeoutMillis: 120000,
        logger: req.logger || {}
    };

    httpUtil.post(content, config,
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
    getStackedData(sourceStackedId, req, function(err, data) {
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

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var graphType = getGraphTypeParameter(req);
    if (!graphType) {
        var graphError = new Error('Unable to find graph type parameter');
        req.logger.error(graphError);
        return res.status(rdk.httpstatus.internal_server_error).send(graphError);
    }

    var typeName = getTypeNameParameter(req);
    if (!typeName) {
        var typeError = new Error('Unable to find type name parameter');
        req.logger.error(typeError);
        return res.status(rdk.httpstatus.internal_server_error).send(typeError);
    }

    var stackedId = generateStackedId(req);
    if (!stackedId) {
        var stackedIdError = new Error('Unable to find stacked graph ID parameter');
        req.logger.error(stackedIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(stackedIdError);
    }

    //check if stacked graph data for this workspace already exists
    getStackedData(stackedId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete stacked graph due to error retrieving existing graph information');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            if (!data.hasOwnProperty('_id')) {
                err = new Error('Unable to find stacked graph information with this id');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            if (!data.hasOwnProperty('userdefinedgraphs')) {
                err = new Error('No stacked graphs defined for this applet');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            if (!data.userdefinedgraphs.hasOwnProperty(('applets'))) {
                err = new Error('No stacked graphs found for this applet');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            var appletIndex = -1;
            var matchedApplet = _.find(data.userdefinedgraphs.applets, function(applet) {
                appletIndex++;
                if (applet && applet.hasOwnProperty('instanceId')) {
                    if (applet.instanceId === instanceId) {
                        return true;
                    }
                }
                return false;
            });

            if (matchedApplet && matchedApplet.hasOwnProperty('graphs')) {
                data = removeStackedGraphData(graphType, typeName, appletIndex, data);

                //delete entire workspace sort definition if no applets remain
                if (data.userdefinedgraphs.applets.length === 0) {
                    deleteStackedData(stackedId, req, function(err, finalData) {
                        if (err) {
                            req.logger.error(err);
                            res.status(rdk.httpstatus.internal_server_error).send(err);
                        } else {
                            res.status(rdk.httpstatus.ok).send(finalData);
                        }
                    });
                } else {
                    //otherwise save the updated sorted data
                    postStackedData(data, req, function(err, finalData) {
                        if (err) {
                            req.logger.error(err);
                            res.status(rdk.httpstatus.internal_server_error).send(err);
                        } else {
                            res.status(rdk.httpstatus.ok).send(data);
                        }
                    });
                }
            } else {
                //no matching applet id
                err = new Error('Unable to find stacked graph data with this instanceid');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

        }
    });
}

function removeStackedGraphData(graphType, typeName, appletIndex, data) {
    //delete graph from array
    //var removeIndex = data.userdefinedgraphs.applets[appletIndex].graphs.indexOf({ graphType: graphType, typeName: typeName });
    var removeIndex = -1;
    for (var i = 0; i < data.userdefinedgraphs.applets[appletIndex].graphs.length; i++) {
        if (_.isEqual(data.userdefinedgraphs.applets[appletIndex].graphs[i], {
                graphType: graphType,
                typeName: typeName
            })) {
            removeIndex = i;
        }
    }

    if (removeIndex > -1) {
        data.userdefinedgraphs.applets[appletIndex].graphs.splice(removeIndex, 1);
    }

    //delete entire applet definition if no graphs remain
    if (data.userdefinedgraphs.applets[appletIndex].graphs.length === 0) {
        data.userdefinedgraphs.applets.splice(appletIndex, 1);
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
        timeoutMillis: 120000,
        logger: req.logger || {}
    };

    httpUtil.fetch(config, function(err, result) {
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

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var stackedId = generateStackedId(req);
    if (!stackedId) {
        var stackedIdError = new Error('Unable to find stacked graph ID parameter');
        req.logger.error(stackedIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(stackedIdError);
    }

    //check if stacked graph data for this workspace already exists
    getStackedData(stackedId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete stacked graph applet due to error retrieving existing graph information');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            if (!data.hasOwnProperty('_id')) {
                err = new Error('Unable to find stacked graph information with this id');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            if (!data.hasOwnProperty('userdefinedgraphs')) {
                err = new Error('No stacked graphs defined for this applet');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            if (!data.userdefinedgraphs.hasOwnProperty(('applets'))) {
                err = new Error('No stacked graphs found for this applet');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            }

            var appletIndex = -1;
            var matchedApplet = _.find(data.userdefinedgraphs.applets, function(applet) {
                appletIndex++;
                if (applet && applet.hasOwnProperty('instanceId')) {
                    if (applet.instanceId === instanceId) {
                        return true;
                    }
                }
                return false;
            });

            if (matchedApplet) {
                data.userdefinedgraphs.applets.splice(appletIndex, 1);

                //delete entire workspace sort definition if no applets remain
                if (data.userdefinedgraphs.applets.length === 0) {
                    deleteStackedData(stackedId, req, function(err, finalData) {
                        if (err) {
                            req.logger.error(err);
                            res.status(rdk.httpstatus.internal_server_error).send(err);
                        } else {
                            res.status(rdk.httpstatus.ok).send(finalData);
                        }
                    });
                } else {
                    //otherwise save the updated sorted data
                    postStackedData(data, req, function(err, finalData) {
                        if (err) {
                            req.logger.error(err);
                            res.status(rdk.httpstatus.internal_server_error).send(err);
                        } else {
                            res.status(rdk.httpstatus.ok).send(data);
                        }
                    });
                }
            } else {
                //no matching applet id
                err = new Error('Unable to find stacked graph data with this instanceid');
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
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

module.exports.getResourceConfig = getResourceConfig;
module.exports.generateStackedIdFromString = generateStackedIdFromString;
module.exports._generateStackedId = generateStackedId;
module.exports._processDataForCreate = processDataForCreate;
module.exports._removeStackedGraphData = removeStackedGraphData;
module.exports.deleteStackedData = deleteStackedData;
module.exports.duplicateStackedData = duplicateStackedData;

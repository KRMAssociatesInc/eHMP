'use strict';

var rdk = require('../../rdk/rdk');
var _ = rdk.utils.underscore;
var httpUtil = rdk.utils.http;
var async = require('async');
var udaf = require('./userdefinedfilterResource');
var sort = require('./userdefinedsortResource');
var graph = require('./userdefinedstackResource');
var uds = require('./userdefinedscreensResource');

var apiDocs = {
    post: {
        spec: {
            summary: 'User defined screens JDS writeback resource',
            notes: 'Posting an empty object will cause a delete operation',
            method: 'POST',
            parameters: [
                rdk.docs.swagger.paramTypes.body(
                    'param', // name
                    'free form JSON body of user-defined screen, empty object will cause delete', // description
                    'userDefinedScreen', // type
                    undefined, // default value
                    true // required
                )
            ],
            responseMessages: [{ code: rdk.httpstatus.internal_server_error},
            { code: rdk.httpstatus.bad_request }]
        },
        models: {
            'userDefinedScreen': {
                required: ['screenType', 'param'],
                properties: {
                    screenType: {
                        type: 'string'
                    },
                    param: {
                        type: 'object'
                    }
                }
            }
        }
    },
    copy: {
        spec: {
            summary: 'User defined screens JDS writeback resource',
            notes: 'Copy from one workspace to another',
            method: 'POST',
            parameters: [
                rdk.docs.swagger.paramTypes.query('fromId', 'source workspace name', 'string', true),
                rdk.docs.swagger.paramTypes.query('toId', 'destination workspace name', 'string', true),
                rdk.docs.swagger.paramTypes.query('predefined', 'destination workspace name', 'string', false)
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
        post: saveUserDefinedScreens,
        apiDocs: apiDocs.post,
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        permissions: ['save-userdefined-screens']
    }, {
        name: 'copy',
        path: '/copy',
        post: copyWorkspace,
        apiDocs: apiDocs.copy,
        interceptors: {
            operationalDataCheck: false,
            pep: false
        },
        permissions: ['save-userdefined-screens']
    }];
}

function saveUserDefinedScreens(req, res) {
    req.logger.debug('In Save user defined screens');

    var userSession;
    var uid;

    try {
        req.logger.debug('Inside try...');
        userSession = req.session.user;

        var site = userSession.site;
        req.logger.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$ site: ' + site);
        var ien = userSession.duz[site];
        req.logger.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$ ien: ' + ien);
        uid = site.concat(';').concat(ien);
        req.logger.debug('$$$$$$$$$$$$$$$$$$$$$$$$$$ uid: ' + uid);
    } catch (e) {
        res.send(rdk.httpstatus.internal_server_error, '***Required authentication data is not present in request.');
        return;
    }

    var input = '';
    var screenType = '';
    input = req.body.param;
    req.logger.debug('Inside saveUserDefinedScreens writeuserdefinedscreens input: ' + JSON.stringify(input));
    screenType = req.body.screenType;
    req.logger.debug('Inside saveUserDefinedScreens writeuserdefinedscreens screenType: ' + screenType);

    uid = uid.concat('_').concat(screenType);

    if (input !== '' && _.keys(input).length === 0) {
        //content is an empty obj, this is actually a delete!
        //req.logger.debug('Found delete uds operation');
        req.logger.debug('Found delete uds operation for workspace ' + screenType + ' with uid ' + uid);

        async.parallel({
                //delete the workspace object
                workspace: function(callback) {
                    deleteWorkspace(uid, req, function(err, finalData) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, finalData);
                        }
                    });
                },
                filters: function(callback) {
                    //delete associated filters
                    var filterId = udaf.createFilterIdFromString(req, screenType);
                    if (!filterId) {
                        callback(new Error('Unable to generate Filter ID parameter'));
                    }
                    udaf.deleteFilterData(filterId, req, function(err, finalData) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, finalData);
                        }
                    });
                },
                sorts: function(callback) {
                    //delete associated sorts
                    var sortId = sort.createSortIdFromString(req, screenType);
                    if (!sortId) {
                        callback(new Error('Unable to generate Sort ID parameter'));
                    }
                    sort.deleteSortData(sortId, req, function(err, finalData) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, finalData);
                        }
                    });
                },
                graphs: function(callback) {
                    //delete associated stacked graphs
                    var graphId = graph.generateStackedIdFromString(req, screenType);
                    if (!graphId) {
                        callback(new Error('Unable to generate Stacked Graph ID parameter'));
                    }
                    graph.deleteStackedData(graphId, req, function(err, finalData) {
                        if (err) {
                            callback(err);
                        } else {
                            callback(null, finalData);
                        }
                    });
                }
            },
            function(err, results) {
                if (err) {
                    req.logger.error(err);
                    return res.status(rdk.httpstatus.internal_server_error).send(err);
                } else {
                    return res.status(rdk.httpstatus.ok).send(results);
                }
            });

    } else {
        var udsData = {
            _id: uid,
            userdefinedscreens: input
        };

        //The UI is coded to expect strings, store it as such
        var content = JSON.stringify(udsData);

        postScreenData(content, req, function(err, finalData) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).send(err);
            } else {
                res.status(rdk.httpstatus.ok).send(content);
            }
        });
    }
}

function copyWorkspace(req, res) {
    req.audit.dataDomain = 'Workspace';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var idError;
    var fromId = req.query.fromId;
    var toId = req.query.toId;

    //workspace params -- 400 bad_request if not found
    var sourceWorkspaceId = uds.createScreenIdFromRequest(req, fromId);
    if (!fromId || !sourceWorkspaceId) {
        idError = new Error('Unable to retrieve source workspace ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).send(idError);
    }

    var destinationWorkSpaceId = uds.createScreenIdFromRequest(req, toId);
    if (!toId || !destinationWorkSpaceId) {
        idError = new Error('Unable to retrieve destination workspace ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.bad_request).send(idError);
    }

    //filter params
    var sourceFilterId = udaf.createFilterIdFromString(req, fromId);
    if (!sourceFilterId) {
        idError = new Error('Unable to generate Filter ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    var destinationFilterId = udaf.createFilterIdFromString(req, toId);
    if (!destinationFilterId) {
        idError = new Error('Unable to generate Filter ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    //sort graph params
    var sourceSortId = sort.createSortIdFromString(req, fromId);
    if (!sourceSortId) {
        idError = new Error('Unable to generate Sort ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    var destinationSortId = sort.createSortIdFromString(req, toId);
    if (!destinationSortId) {
        idError = new Error('Unable to generate Sort ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    //stacked graph params
    var sourceGraphId = graph.generateStackedIdFromString(req, fromId);
    if (!sourceGraphId) {
        idError = new Error('Unable to generate Stacked Graph ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    var destinationGraphId = graph.generateStackedIdFromString(req, toId);
    if (!destinationGraphId) {
        idError = new Error('Unable to generate Stacked Graph ID parameter');
        req.logger.error(idError);
        return res.status(rdk.httpstatus.internal_server_error).send(idError);
    }

    async.parallel({
        //TODO refactor such that workspace copy is first, and if successful calls rest of copies
        //TODO UserScreensConfig may need to be updated to remove reference to this workspace if it is deleted
            workspace: function(callback) {
                //copy the workspace object
                copyWorkspaceData(sourceWorkspaceId, destinationWorkSpaceId, toId, req, function(err, finalData) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, finalData);
                    }
                });
            },
            filters: function(callback) {
                //copy over filters to new workspace
                udaf.duplicateFilterData(req, sourceFilterId, destinationFilterId, function(err, finalData) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, finalData);
                    }
                });
            },
            sorts: function(callback) {
                //copy over sorts to new workspace
                sort.duplicateSortData(req, sourceSortId, destinationSortId, function(err, finalData) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, finalData);
                    }
                });
            },
            graphs: function(callback) {
                //copy over graphs to new workspace
                graph.duplicateStackedData(req, sourceGraphId, destinationGraphId, function(err, finalData) {
                    if (err) {
                        callback(err);
                    } else {
                        callback(null, finalData);
                    }
                });
            }
        },
        function(err, results) {
            //ISSUE if one of these fails, the resource will return 500 error but any # of the copies could have happened..
            if (err) {
                req.logger.error(err);
                return res.status(rdk.httpstatus.internal_server_error).send(err);
            } else {
                return res.status(rdk.httpstatus.ok).send(results);
            }
        });
}

function copyWorkspaceData(sourceWorkspaceId, destinationWorkSpaceId, toId, req, callback) {
    //lookup existing workspace
    //create copy + change name
    //lookup existing workspaces master list
    //update with new workspace info
    //save new workspace
    //save new master list
    uds.getScreenData(sourceWorkspaceId, req, function(err, data) {
        if (err) {
            callback(err);
        } else {
            //Post the uds to the new workspace after updating the id
            if (data && data.hasOwnProperty('_id')) {
                data._id = destinationWorkSpaceId;

                if (data.userdefinedscreens && data.userdefinedscreens.hasOwnProperty('id')) {
                    data.userdefinedscreens.id = toId;
                }
                postScreenData(data, req, callback);
            } else {
                var dataError = new Error('Unable to retrieve workspace data to copy');
                req.logger.error(dataError);
                callback(dataError);
            }
        }
    });
}

function postScreenData (content, req, callback) {
    var jdsResource = '/user/set/this'; //The correct endpoint from the JDS for SET which is part of VPRJSES global

    var conf_options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'POST',
        path: jdsResource
    });

    var config = {
        options: conf_options,
        protocol: 'http',
        timeoutMillis: 120000,
        logger: req.logger
    };

    httpUtil.post(content, config,
        function(err, data) {
            if (err) {
                config.logger.error('Unable to POST UDS data. Error: ' + err);
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

function deleteWorkspace(workspace, req, callback) {
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/destroy/' + workspace
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
            config.logger.error(ex);
            callback(ex);
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

exports.getResourceConfig = getResourceConfig;

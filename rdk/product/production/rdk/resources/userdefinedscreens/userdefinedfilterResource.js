/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var _ = require('underscore');
var httpUtil = rdk.utils.http;
var fs = require('fs');

var apiDocs = {
    get: {
        spec: {
            summary: '',
            notes: '',
            method: 'GET',
            parameters: [
                rdk.docs.swagger.paramTypes.query('id', 'workspace name', 'string', true),
                rdk.docs.swagger.paramTypes.query('predefined', 'predefined screen flag (true or false)', 'string', false)
            ],
            responseMessages: []
        }
    },
    post: {
        spec: {
            summary: '',
            notes: '',
            method: 'POST',
            parameters: [
                rdk.docs.swagger.paramTypes.body('Filter', '', 'user-filter')
            ],
            responseMessages: []
        },
        models: {
            'user-filter': {
                id: 'Filter',
                required: ['id', 'filter', 'instance-id'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'workspace name'
                    },
                    filter: {
                        type: 'string',
                        description: 'string value of filter'
                    },
                    'instance-id': {
                        type: 'string',
                        description: 'Applet instance ID for which the filter applies'
                    }
                }
            }
        }
    },
    delete: {
        spec: {
            summary: '',
            notes: '',
            method: 'DELETE',
            parameters: [
                rdk.docs.swagger.paramTypes.body('Filter', '', 'user-filter')

            ],
            responseMessages: []
        }
    },
    put: {
        spec: {
            summary: '',
            notes: '',
            method: 'PUT',
            parameters: [
                rdk.docs.swagger.paramTypes.body('Filter', '', 'user-filter-put')
            ],
            responseMessages: []
        },
        models: {
            'user-filter-put': {
                id: 'Filter',
                required: ['fromId', 'toId'],
                properties: {
                    fromId: {
                        type: 'string',
                        description: 'source workspace name'
                    },
                    toId: {
                        type: 'string',
                        description: 'destination workspace name'
                    },
                    predefined: {
                        type: 'string',
                        description: 'predefined screen flag (true or false)'
                    }
                }
            }
        }
    },
    deleteAll: {
        spec: {
            summary: '',
            notes: '',
            method: 'DELETE',
            parameters: [
                rdk.docs.swagger.paramTypes.body('Filter', '', 'user-filter-delete-all')
            ],
            responseMessages: []
        },
        models: {
            'user-filter-delete-all': {
                id: 'Filter',
                required: ['id', 'instanceId'],
                properties: {
                    id: {
                        type: 'string',
                        description: 'workspace name'
                    },
                    instanceId: {
                        type: 'string',
                        description: 'Applet instance ID for which the filter applies'
                    }
                }
            }
        }
    }
};
var interceptors = {
    pep: false,
    operationalDataCheck: false
};
var permissions = ['save-userdefined-screens'];
var healthcheck = {
    dependencies: ['jdsSync']
};

function getResourceConfig() {
    return [{
        name: '',
        path: '',
        get: getFilter,
        parameters: {
            get: {
                id: {
                    required: true,
                    description: 'workspace name'
                },
                predefined: {
                    required: false,
                    description: 'predefined screen flag (true or false)'
                }
            }
        },
        apiDocs: apiDocs.get,
        interceptors: interceptors,
        healthcheck: healthcheck,
        permissions: permissions
    }, {
        name: '',
        path: '',
        post: createFilter,
        parameters: {
            post: {
                id: {
                    required: true,
                    description: 'workspace name'
                },
                filter: {
                    required: true,
                    description: 'individual filter value to remove'
                },
                instanceId: {
                    required: true,
                    description: 'Applet instance ID for which the filter applies'
                }
            }
        },
        apiDocs: apiDocs.post,
        interceptors: interceptors,
        healthcheck: healthcheck,
        permissions: permissions
    }, {
        name: '',
        path: '',
        delete: removeFilter,
        parameters: {
            delete: {
                id: {
                    required: true,
                    description: 'workspace name'
                },
                filter: {
                    required: true,
                    description: 'individual filter value to remove'
                },
                instanceId: {
                    required: true,
                    description: 'Applet instance ID for which the filter applies'
                }
            }
        },
        apiDocs: apiDocs.delete,
        interceptors: interceptors,
        healthcheck: healthcheck,
        permissions: permissions
    }, {
        name: '',
        path: '',
        put: duplicateFilters,
        parameters: {
            put: {
                fromId: {
                    required: true,
                    description: 'source workspace name'
                },
                toId: {
                    required: true,
                    description: 'destination workspace name'
                },
                predefined: {
                    required: false,
                    description: 'predefined screen flag (true or false)'
                }
            }
        },
        apiDocs: apiDocs.put,
        interceptors: interceptors,
        healthcheck: healthcheck,
        permissions: permissions
    }, {
        name: 'all',
        path: '/all',
        'delete': removeAllFilters,
        parameters: {
            'delete': {
                id: {
                    required: true,
                    description: 'workspace name'
                },
                instanceId: {
                    required: true,
                    description: 'Applet instance ID for which the filter applies'
                }
            }
        },
        apiDocs: apiDocs.deleteAll,
        interceptors: interceptors,
        healthcheck: healthcheck,
        permissions: permissions
    }];
}

function getFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    getFilterData(filterId, req, function(err, data) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            res.status(rdk.httpstatus.ok).send(data);
        }
    });
}

function createFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var filterName = getFilterParameter(req);
    if (!filterName) {
        var filterError = new Error('Unable to find filter name parameter');
        req.logger.error(filterError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterError);
    }

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    //check if filter for this workspace already exists
    getFilterData(filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to save custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {

            data = processDataForCreate(filterId, instanceId, filterName, data);

            //update if it does, create if not
            postFilterData(data, req, function(err, finalData) {
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

function processDataForCreate(filterId, instanceId, filterName, data) {
    //look in data for filters for this applet
    if (!data.hasOwnProperty('_id')) {
        data._id = filterId;
    }

    if (!data.hasOwnProperty('userdefinedfilters')) {
        data.userdefinedfilters = {};
    }

    if (!data.userdefinedfilters.hasOwnProperty(('applets'))) {
        data.userdefinedfilters.applets = [];
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.userdefinedfilters.applets, function(applet) {
        appletIndex++;
        if (applet && applet.hasOwnProperty('instanceId')) {
            if (applet.instanceId === instanceId) {
                return true;
            }
        }
        return false;
    });

    if (matchedApplet && matchedApplet.hasOwnProperty('filters')) {
        if (!_.find(matchedApplet.filters, function(filter) {
                if (filter === filterName) {
                    return true;
                }
                return false;
            })) {
            //filter is not already in the list
            data.userdefinedfilters.applets[appletIndex].filters.push(filterName);
        } //else the filter already exists in the list and won't be added
    } else {
        //no matching applet id
        data.userdefinedfilters.applets.push({
            instanceId: instanceId,
            filters: [filterName]
        });
    }

    return data;
}

function findApplet(data, instanceId, req) {
    var err;

    if (!data.hasOwnProperty('_id')) {
        err = new Error('Unable to find filter with this id');
        req.logger.error(err);
    } else {
        if (!data.hasOwnProperty('userdefinedfilters')) {
            err = new Error('No filters defined for this applet');
            req.logger.error(err);
        } else {
            if (!data.userdefinedfilters.hasOwnProperty(('applets'))) {
                err = new Error('No filter found for this applet');
                req.logger.error(err);
            }
        }
    }

    if (err) {
        return {
            err: err
        };
    }

    var appletIndex = -1;
    var matchedApplet = _.find(data.userdefinedfilters.applets, function(applet) {
        appletIndex++;
        if (applet && applet.hasOwnProperty('instanceId')) {
            if (applet.instanceId === instanceId) {
                return true;
            }
        }
        return false;
    });

    if (matchedApplet === undefined) {
        err = new Error('Unable to find applet id with this id');
        req.logger.error(err);
        return {
            err: err
        };
    }

    if (!matchedApplet.hasOwnProperty('filters')) {
        req.logger.warn('applet was missing filters, so added an empty list');
        matchedApplet.filters = [];
    }

    return {
        matchedApplet: matchedApplet,
        appletIndex: appletIndex
    };
}

function duplicateFilters(req, res) {
    var sourceWorkspaceId = req.query.fromId;
    var destinationWorkSpaceId = req.query.toId;
    var filterIdError;
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var sourceFilterId = createFilterIdFromString(req, sourceWorkspaceId);
    if (!sourceFilterId) {
        filterIdError = new Error('Unable to find source Workspace ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    var destinationFilterId = createFilterIdFromString(req, destinationWorkSpaceId);
    if (!destinationFilterId) {
        filterIdError = new Error('Unable to find destination Workspace ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    duplicateFilterData(req, sourceFilterId, destinationFilterId, function(err, finalData) {
        if (err) {
            req.logger.error(err);
            res.status(rdk.httpstatus.internal_server_error).send(err);
        } else {
            res.status(rdk.httpstatus.ok).send(finalData);
        }
    });
}

function duplicateFilterData(req, sourceFilterId, destinationFilterId, callback) {
    //get the filters from the source workspace
    getFilterData(sourceFilterId, req, function(err, data) {
        if (err) {
            callback(err);
        } else {
            //Post the same filters to the new workspace after updating the _id
            if (data && data.hasOwnProperty('_id')) {
                data._id = destinationFilterId;
                postFilterData(data, req, callback);
            } else {
                callback(null, data);
            }
        }
    });
}

/*exported removeAllFilters */
function removeAllFilters(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    req.logger.debug('Request to delete all user defined filters for: ' + filterId);

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj

    //check if filter for this workspace already exists
    getFilterData(filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        }

        var appletResult = findApplet(data, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).send(appletResult.err);
        }

        data = removeDataFilters(appletResult.appletIndex, data);
        req.logger.debug('About to overwrite data with: ' + JSON.stringify(data));

        updateOrDeleteApplet(data, filterId, req, res);
    });

}

function removeDataFilters(appletIndex, data) {
    data.userdefinedfilters.applets.splice(appletIndex, 1);
    return data;
}

function getInstanceIdParameter(req) {
    return req.param('instanceId') || null;
}

//keep the below comment, as JSHint incorrectly believe this function is never used
// due to 'delete' being a reserved word in JS but also an HTTP verb
/*exported removeFilter */
function removeFilter(req, res) {
    req.audit.dataDomain = 'Filter';
    req.audit.logCategory = 'UDS';
    req.audit.authuser = '-';

    //fail fast for missing params
    var instanceId = getInstanceIdParameter(req);
    if (!instanceId) {
        var idErr = new Error('Unable to find instance ID parameter');
        req.logger.error(idErr);
        return res.status(rdk.httpstatus.internal_server_error).send(idErr);
    }

    var filterName = getFilterParameter(req);
    if (!filterName) {
        var filterError = new Error('Unable to find filter name parameter');
        req.logger.error(filterError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterError);
    }

    var filterId = createFilterId(req);
    if (!filterId) {
        var filterIdError = new Error('Unable to find filter ID parameter');
        req.logger.error(filterIdError);
        return res.status(rdk.httpstatus.internal_server_error).send(filterIdError);
    }

    //get data for this filter
    //if more than 1 filter, try to remove 1 and update it
    //if 1 or less filters, delete entire filter obj

    //check if filter for this workspace already exists
    getFilterData(filterId, req, function(err, data) {
        if (err) {
            req.logger.error('Unable to delete custom filter due to error retrieving existing filters');
            req.logger.error(err);
            return res.status(rdk.httpstatus.internal_server_error).send(err);
        }

        var appletResult = findApplet(data, instanceId, req);
        if (appletResult.err) {
            return res.status(rdk.httpstatus.internal_server_error).send(appletResult.err);
        }

        data = removeDataFilter(filterName, appletResult.appletIndex, data);

        updateOrDeleteApplet(data, filterId, req, res);

    });

}

function updateOrDeleteApplet(data, filterId, req, res) {
    //delete entire filter definition if no applets remain
    if (data.userdefinedfilters.applets.length === 0) {
        deleteFilterData(filterId, req, function(err, finalData) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).send(err);
            } else {
                res.status(rdk.httpstatus.ok).send(finalData);
            }
        });
    } else {
        //otherwise save the updated filters
        postFilterData(data, req, function(err, finalData) {
            if (err) {
                req.logger.error(err);
                res.status(rdk.httpstatus.internal_server_error).send(err);
            } else {
                //res.status(rdk.httpstatus.ok).send(finalData);
                res.status(rdk.httpstatus.ok).send(data);
            }
        });
    }
}

function removeDataFilter(filterName, appletIndex, data) {
    //delete filter from array
    var removeIndex = data.userdefinedfilters.applets[appletIndex].filters.indexOf(filterName);
    if (removeIndex > -1) {
        data.userdefinedfilters.applets[appletIndex].filters.splice(removeIndex, 1);
    }

    //delete entire applet definition if no filters remain
    if (data.userdefinedfilters.applets[appletIndex].filters.length === 0) {
        data.userdefinedfilters.applets.splice(appletIndex, 1);
    }
    return data;
}
var cbwFilters = [];
function getFilterData(filterId, req, callback) {
    var predefined = req.query.predefined;
    var screenName = req.param('id') || req.param('fromId');
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/get/' + filterId
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
        var filename = './resources/userdefinedscreens/assets/' + screenName + '_filter.json';
        returnedData = cbwFilters.filter(function (el) {
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
                cbwFilters.push(returnedData);
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

function postFilterData(content, req, callback) {

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
                config.logger.error('Unable to POST filter data. Error: ' + err);
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

//delete entire filter set for a workspace
//this is only called when all filters for all applets in a workspace have been removed
function deleteFilterData(filterId, req, callback) {
    var options = _.extend({}, req.app.config.generalPurposeJdsServer, {
        method: 'GET',
        path: '/user/destroy/' + filterId
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

function createFilterId(req) {
    var userSession = req.session.user || {};
    var id = req.param('id') || null;
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_filter';
    } else {
        return null;
    }
}

function createFilterIdFromString(req, id) {
    var userSession = req.session.user || {};
    var site = userSession.site || null;
    var ien = userSession.duz[site] || null;

    if (ien && site && id) {
        return site + ';' + ien + '_' + id + '_filter';
    } else {
        return null;
    }
}

function getInstanceIdParameter(req) {
    return req.param('instanceId') || null;
}

function getFilterParameter(req) {
    return req.param('filter') || null;
}

module.exports.getResourceConfig = getResourceConfig;
module.exports.createFilterId = createFilterId;
module.exports.deleteFilterData = deleteFilterData;
module.exports.getFilterData = getFilterData;
module.exports.postFilterData = postFilterData;
module.exports.findApplet = findApplet;
module.exports.updateOrDeleteApplet = updateOrDeleteApplet;
module.exports.createFilterIdFromString = createFilterIdFromString;
module.exports._processDataForCreate = processDataForCreate;
module.exports._removeDataFilter = removeDataFilter;
module.exports._duplicateFilters = duplicateFilters;
module.exports.duplicateFilterData = duplicateFilterData;

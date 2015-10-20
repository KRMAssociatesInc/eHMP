'use strict';

var rdk = require('../../core/rdk');
var _ = require('underscore');
var querystring = require('querystring');
var nullchecker = rdk.utils.nullchecker;
var httpUtil = rdk.utils.http;
var async = require('async');
var jdsFilter = require('jds-filter');

OrdersError.prototype = Error.prototype;
LabsError.prototype = Error.prototype;

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        },
        filter: {
            required: false,
            regex: /eq("[^"]*","[^"]*")/,
            description: 'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Get lab orders for a panel',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.filter
        ],
        responseMessages: []
    }
};


function buildLabPanels(req, res, next) {
    req.audit.dataDomain = 'laboratory';
    req.audit.logCategory = 'RETRIEVE';

    var pid = req.param('pid');

    if (nullchecker.isNullish(pid)) {
        return next(); // require pid
    }

    var jdsServer = req.app.config.jdsServer;

    async.parallel(
        [
            //retrieve lab results for patient
            function(callback) {
                var start = req.param('start') || 0;
                var limit = req.param('limit');

                var jdsFilters = req.interceptorResults.jdsFilter.filter || [];

                req.logger.info('Lab Panels called with pid=%s filter=%s', pid, jdsFilters);

                var jdsQuery = {};
                if (start && start >= 0) { //ensure start exists and is non-negative integer
                    jdsQuery.start = start;
                }
                if (limit && limit > 0) { //ensure limit exists and is positive integer
                    jdsQuery.limit = limit;
                }

                var jdsFilterQuery = jdsFilter.build(jdsFilters);
                if (jdsFilterQuery) {
                    jdsQuery.filter = jdsFilterQuery;
                }
                jdsQuery.order = 'displayOrder asc';

                var jdsResource = '/vpr/' + pid + '/find/lab';
                var jdsQueryString = querystring.stringify(jdsQuery);
                var jdsPath = jdsResource + '?' + jdsQueryString;
                var options = _.extend({}, jdsServer, {
                    method: 'GET',
                    path: jdsPath
                });
                var config = {
                    options: options,
                    protocol: 'http',
                    logger: req.logger
                };
                httpUtil.fetch(req.app.config, config,
                    function(err, data) {
                        if (!nullchecker.isNullish(err)) {
                            return callback(new LabsError('Error retrieving labs for panels', err));
                        }

                        return callback(null, data);
                    },
                    function responseProcessor(statusCode, data) {
                        try {
                            data = JSON.parse(data) || {};
                        } catch (e) {
                            req.logger.error('Error parsing lab results JSON: ' + e.toString());
                            data = {};
                        }

                        data.jdsApiVersion = data.apiVersion || null;
                        delete data.apiVersion;

                        return data;
                    }
                );
            },
            //asynchronously retrieve lab orders in parallel
            function(callback) {
                //todo refactor using jds filter builder
                var jdsQuery = 'filter=eq("kind","Laboratory"),exists("summary"),like("results[].uid","urn:va:lab:%25")';
		        var jdsResource = '/vpr/' + pid + '/index/order';
                var jdsPath = jdsResource + '?' + jdsQuery;

                var options = _.extend({}, jdsServer, {
                    method: 'GET',
                    path: jdsPath
                });
                var config = {
                    options: options,
                    protocol: 'http',
                    logger: req.logger
                };

                httpUtil.fetch(req.app.config, config,
                    function(err, data) {
                        if (!nullchecker.isNullish(err)) {
                            return callback(new OrdersError('Error retrieving orders for panels', err));
                        }
                        return callback(null, data);
                    },
                    function responseProcessor(statusCode, data) {
                        try {
                            data = JSON.parse(data) || {};
                        } catch (e) {
                            req.logger.error('Error parsing orders JSON: ' + e.toString());
                            data = {};
                        }

                        data.jdsApiVersion = data.apiVersion || null;
                        delete data.apiVersion;

                        return data;
                    }
                );
            }
        ],
        //process Async Responses
        function(err, resultArray) {
            if (err) {
                if (err instanceof OrdersError) {
                    req.logger.error('Lab panel unable to lookup orders ' + err.error.toString());
                    // all we really need is Labs to complete -- if orders fails allow Labs to finish
                } else {
                    return res.status(rdk.httpstatus.internal_server_error).rdkSend(err.message);
                }
            }

            // process lab panel titles to substitute in order summary
            var labOrders = null;
            var orderDetails = null;
            //will be undefined if labs was not able to finish before orders lookup failed
            var panelsData = resultArray[0];
            if (resultArray.length === 2) {
                labOrders = resultArray[1] || {};
            }

            if (labOrders && labOrders.data && labOrders.data.items) {
                orderDetails = labOrders.data.items;
            }

            if (!orderDetails) {
                //if we weren't able to parse out the order details, don't try to assign names or groups to our panels
                if (panelsData) {
                    //our labs call made it back before orders had an error
                    return res.rdkSend(panelsData);
                } else {
                    //orders errored and labs never finished, return an error
                    return res.status(rdk.httpstatus.internal_server_error).rdkSend('Lab panels resource unable to lookup lab orders.');
                }

            }

            if (panelsData && panelsData.data && panelsData.data.items) {
                //we only want to move into lab groups if we have orders to use for panel groups
                var labs = panelsData.data.items;

                if (labs) {
		            delete panelsData.data.items;
                    var sorted = _.groupBy(labs, 'groupUid');
                    //it is possible that the groupUid is undefined and thereby not related to a panel but still a lab that was done. We will save them for later.
                    var nonPanelLabs = sorted.undefined || [];
                    delete sorted.undefined;
		            sorted = _.map(sorted, function(v, k) {
                        if (v.length && v.length === 1) {
                            //move 1-lab panels into list of individual labs
                            nonPanelLabs.push(v[0]);
                            return;
                        } else {
                            //true lab panel with more than 1 lab result
                            //create object with group Uid as key and array of labs as value
                            var ret = {};
                            ret[k] = v;
                            return ret;
                        }
                        //filter out null objects that were moved to non-panel lab list
                    }).filter(function(obj) {
                        return obj && Object.keys(obj).length !== 0;
                    });

                    nonPanelLabs = nonPanelLabs.concat(sorted);
                    panelsData.data.items = nonPanelLabs;
                }

                var newLabPanels = [];
                var namedLabPanels = _.map(panelsData.data.items, function(labPanel) {
                    var nameChanged = false;
                    //check to see if we have a panel
                    //panel will have exactly 1 key -- the name of the panel
                    var panelKeys = _.keys(labPanel);
                    if (panelKeys.length === 1) {
                        //grab first key of the object -- currently accession number to be replaced
                        var panelUid = panelKeys[0] || null;
                        var internalAdditions = {};

                        //find order corresponding to this lab panel uid
                        //start by looping through all labs in the panel
                        var panelLength = labPanel[panelUid].length;
                        for (var i = 0; i < panelLength; i++) {

                            //for each lab in panel, loop through all orders
                            var orderLength = orderDetails.length;
                            for (var o = 0; o < orderLength; o++) {

                                if (orderDetails[o].results) {
                                    //loop through all results of order
                                    var orderDetailsLength = orderDetails[o].results.length;
                                    for (var r = 0; r < orderDetailsLength; r++) {

                                        //if the uid of a result in an order matches that of this test within our panel
                                        //then change the key to use the order summary
                                        if (orderDetails[o].results[r].uid === labPanel[panelUid][i].uid) {
                                            var labSummary = orderDetails[o].summary;
                                            if (labSummary) {
                                                labSummary = labSummary.replace(/\r\n/g, ''); //trim newlines
                                                //check if this pretty lab name has already been added to new panel
                                                if (internalAdditions[labSummary] === undefined) {
                                                    internalAdditions[labSummary] = [];
                                                    nameChanged = true;
                                                }
                                                //already lined up a new panel, place this result in it
                                                internalAdditions[labSummary].push(labPanel[panelUid][i]);
                                            }

                                        }
                                    }
                                } // end order results check
                            } // end order loop
                        } // end lab panel loop

                        if (nameChanged && panelUid) {
                            delete labPanel[panelUid];
                            for (var key in internalAdditions) {
                                if (internalAdditions.hasOwnProperty(key)) {
                                    if (internalAdditions[key].length === 1) {
                                        newLabPanels.push(internalAdditions[key][0]);
                                    } else {
                                        var newPanel = {};
                                        newPanel[key] = internalAdditions[key];
                                        newLabPanels.push(newPanel);
                                    }

                                }
                            }
                        } else {
                            if (!nameChanged) {
                                //unable to find the name, pull out of panel
                                var unnamedPanelLength = labPanel[panelUid].length;
                                for (var z = 0; z < unnamedPanelLength; z++) {
                                    newLabPanels.push(labPanel[panelUid][z]);
                                }
                                delete labPanel[panelUid];

                                return null;
                            }
                        }
                        return labPanel;
                    } else {
                        //this is a single lab -- do nothing
                        return labPanel;
                    }
                }).filter(function(obj) {
                    return obj && Object.keys(obj).length !== 0;
                });
                namedLabPanels = namedLabPanels.concat(newLabPanels);

                delete panelsData.data.items;
                panelsData.data.items = namedLabPanels;
                return res.rdkSend(panelsData);
            } else {
                //cant navigate json - abort! - send whatever we got from lab results
                return res.rdkSend(resultArray[0]);
            }
        }
    );
}

function OrdersError(message, error) {
    this.name = 'OrdersError';
    this.error = error;
    this.message = message;
}

function LabsError(message, error) {
    this.name = 'LabsError';
    this.error = error;
    this.message = message;
}

module.exports = buildLabPanels;
module.exports.parameters = parameters;
module.exports.apiDocs = apiDocs;

'use strict';

var solrSimpleClient = require('./solr-simple-client');
var querystring = require('querystring');
var rdk = require('../../../core/rdk');
var async = require('async');
var _ = require('underscore');
var _s = require('underscore.string');
var nullchecker = rdk.utils.nullchecker;
var loincSearch = require('./loinc-search');
var labPanelSearch = require('./lab-panel-search');
var labGroupSearch = require('./lab-group-search');
var ontologyClient = require('./ontology-client');

module.exports = suggestSearch;
module.exports.description = {
    get: 'Get text search suggestions'
};
module.exports.parameters = {
    get: {
        pid: {
            required: true
        },
        query: {
            required: true,
            regex: /.{3,}/
        }
    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Get text search suggestions',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid, {
                paramType: 'query',
                name: 'query',
                description: 'text to search',
                type: 'string',
                required: true,
                pattern: '.{3,}'
            }
        ],
        responseMessages: []
    }
};

function suggestSearch(req, res, next) {
        var reqQuery = req.query;

        req.logger.info('performing solr Suggest search using query [%s]', reqQuery.query);
        if (nullchecker.isNullish(reqQuery.pid)) {
            // require searchText and pid
            return next();
        }
        if (nullchecker.isNullish(reqQuery.query) || reqQuery.query.length < 3) {
            return next();
        }

        var escapedQuery = solrSimpleClient.escapeQueryChars(reqQuery.query);
        var solrQueryObjects = [

            //wholeDomainSearchFrame in HMP
            {
                method: 'terms',
                query: {
                    qt: '/terms',
                    'terms.fl': 'kind',
                    'terms.sort': 'count',
                    'terms.regex': '.*' + escapedQuery + '.*',
                    'terms.regex.flag': 'case_insensitive',
                    wt: 'json'
                }
            },
            // MedsSearchFrame.java in HMP
            {
                method: 'terms',
                query: {
                    qt: '/terms',
                    'terms.fl': 'med_drug_class_name',
                    'terms.sort': 'count',
                    'terms.regex': '.*' + escapedQuery + '.*',
                    'terms.regex.flag': 'case_insensitive',
                    wt: 'json'
                }
            }, {
                method: 'suggest',
                query: {
                    q: escapedQuery,
                    //                fq: [
                    //                        'pid:' + reqQuery.pid
                    //                ],
                    wt: 'json'
                }
            }, {
                method: 'select',
                query: {
                    fl: [ // select these fields
                        'qualified_name',
                        'med_drug_class_name'
                    ],
                    fq: [ // filter queries
                        'domain:' + 'med'
                    ],
                    q: '*' + escapedQuery + '*',
                    rows: 0,
                    wt: 'json',
                    facet: 'true',
                    'facet.pivot': 'med_drug_class_name,qualified_name',
                    synonyms: 'true',
                    defType: 'synonym_edismax'
                }
            }
        ];

        var solrQueryStringObjects = solrQueryObjects.map(function(solrQueryObject) {
            var compiledQueryParameters = solrSimpleClient.compileQueryParameters(solrQueryObject.query);

            var solrQueryStringObject = {
                type: 'solr',
                method: solrQueryObject.method,
                query: querystring.stringify(compiledQueryParameters)

            };
            return solrQueryStringObject;
        });

        var tasks = [];
        //add the solr tasks
        _.extend(tasks, solrQueryStringObjects);
        //add the ontology search task
        tasks.push({
            type: 'ontology',
            query: reqQuery.query

        });
        async.map(tasks,
            function(task, callback) {
                if (task.type === 'solr') {
                    solrSimpleClient.executeSolrQuery(task.query, task.method, req, function(err, result) {
                        callback(err, result);
                    });

                } else {
                    ontologyClient.executeTermQuery(task.query, req, function(err, results) {
                        callback(err, results);
                    });
                }
            },
            function(err, results) {
                if (err) {
                    res.status(500).rdkSend('The search could not be completed\n' + err.stack);
                    return;
                }

                var hmpEmulatedSuggestResponseObject = buildSuggestResponseObjectSkeleton(reqQuery);
                hmpEmulatedSuggestResponseObject = transformSuggestSolrToHmp(results, hmpEmulatedSuggestResponseObject, reqQuery);
                hmpEmulatedSuggestResponseObject = transformSuggestLOINCToHmp(hmpEmulatedSuggestResponseObject, reqQuery);
                hmpEmulatedSuggestResponseObject = transformSuggestLabPanelsToHmp(hmpEmulatedSuggestResponseObject, reqQuery);
                hmpEmulatedSuggestResponseObject = transformSuggestLabGroupsToHmp(hmpEmulatedSuggestResponseObject, reqQuery);
                hmpEmulatedSuggestResponseObject = transformSuggestOntologyToHmp(results, hmpEmulatedSuggestResponseObject, reqQuery);
                res.rdkSend(hmpEmulatedSuggestResponseObject);

            }
        );
    }
    //Add SnomedCT ontology search result
function transformSuggestOntologyToHmp(results, hmpEmulatedSuggestResponseObject, reqQuery) {
    var nextResponseItems = [];
    var nextResponseItem = {};
    var totalFound = 0;
    _.each(results, function(resultset) {
        if (resultset.hasOwnProperty('matches')) {
            totalFound += resultset.details.total;
            _.each(resultset.matches, function(item) {
                nextResponseItem = buildSuggestResponseObjectItemSkeleton(item.term, reqQuery);
                nextResponseItem.category = 'Snomed Terminology';
                nextResponseItems = nextResponseItems.concat(nextResponseItem);
            });
        }
    });
    hmpEmulatedSuggestResponseObject.data.currentItemCount += totalFound;
    hmpEmulatedSuggestResponseObject.data.itemsPerPage += totalFound;
    hmpEmulatedSuggestResponseObject.data.totalItems += totalFound;
    hmpEmulatedSuggestResponseObject.data.items = hmpEmulatedSuggestResponseObject.data.items.concat(nextResponseItems);

    return hmpEmulatedSuggestResponseObject;
}

// Add Logical Observation Identifiers Names and Codes (LOINC) Items
function transformSuggestLOINCToHmp(hmpEmulatedSuggestResponseObject, reqQuery) {
        var loincArray = loincSearch(reqQuery.query);
        var nextResponseItems = [];
        var nextResponseItem = {};
        var totalFound = loincArray.length;
        _.each(loincArray, function(loincItem) {
            nextResponseItem = buildSuggestResponseObjectItemSkeleton(loincItem, reqQuery);
            nextResponseItem.category = 'loincSearch';
            nextResponseItems = nextResponseItems.concat(nextResponseItem);


        });

        hmpEmulatedSuggestResponseObject.data.currentItemCount += totalFound;
        hmpEmulatedSuggestResponseObject.data.itemsPerPage += totalFound;
        hmpEmulatedSuggestResponseObject.data.totalItems += totalFound;
        hmpEmulatedSuggestResponseObject.data.items = hmpEmulatedSuggestResponseObject.data.items.concat(nextResponseItems);

        return hmpEmulatedSuggestResponseObject;
    }
    //Add Lab Panel Items
function transformSuggestLabPanelsToHmp(hmpEmulatedSuggestResponseObject, reqQuery) {
        var labPanels = labPanelSearch(reqQuery.query);
        var nextResponseItems = [];
        var nextResponseItem = {};
        var totalFound = labPanels.length;
        _.each(labPanels, function(labPanel) {
            nextResponseItem = buildSuggestResponseObjectItemSkeleton(labPanel, reqQuery);
            nextResponseItem.category = 'Lab Panel';
            nextResponseItems = nextResponseItems.concat(nextResponseItem);


        });

        hmpEmulatedSuggestResponseObject.data.currentItemCount += totalFound;
        hmpEmulatedSuggestResponseObject.data.itemsPerPage += totalFound;
        hmpEmulatedSuggestResponseObject.data.totalItems += totalFound;
        hmpEmulatedSuggestResponseObject.data.items = hmpEmulatedSuggestResponseObject.data.items.concat(nextResponseItems);

        return hmpEmulatedSuggestResponseObject;
    }
    //Add Lab Group Items
function transformSuggestLabGroupsToHmp(hmpEmulatedSuggestResponseObject, reqQuery) {
    var labGroups = labGroupSearch(reqQuery.query);
    var nextResponseItems = [];
    var nextResponseItem = {};
    var totalFound = labGroups.length;
    _.each(labGroups, function(labGroup) {
        nextResponseItem = buildSuggestResponseObjectItemSkeleton(labGroup, reqQuery);
        nextResponseItem.category = 'Lab Group';
        nextResponseItems = nextResponseItems.concat(nextResponseItem);


    });

    hmpEmulatedSuggestResponseObject.data.currentItemCount += totalFound;
    hmpEmulatedSuggestResponseObject.data.itemsPerPage += totalFound;
    hmpEmulatedSuggestResponseObject.data.totalItems += totalFound;
    hmpEmulatedSuggestResponseObject.data.items = hmpEmulatedSuggestResponseObject.data.items.concat(nextResponseItems);

    return hmpEmulatedSuggestResponseObject;
}

//Add Solr Items
function transformSuggestSolrToHmp(solrResponseObjects, hmpEmulatedSuggestResponseObject, reqQuery) {
    var escapedQuery = solrSimpleClient.escapeQueryChars(reqQuery.query);
    _.each(solrResponseObjects, function(solrResponseObject) {

        var nextResponseItems = [];
        var nextResponseItem = {};
        var totalFound = 0;

        if (solrResponseObject.hasOwnProperty('suggest')) {
            totalFound += solrResponseObject.suggest.phrase_suggester[escapedQuery].numFound;
            _.each(solrResponseObject.suggest.phrase_suggester[escapedQuery].suggestions, function(item) {
                nextResponseItem = buildSuggestResponseObjectItemSkeleton(item.term, reqQuery);
                nextResponseItem.category = 'Suggestion';
                nextResponseItems = nextResponseItems.concat(nextResponseItem);
            });

            totalFound += solrResponseObject.suggest.freetext_suggester[escapedQuery].numFound;
            _.each(solrResponseObject.suggest.freetext_suggester[escapedQuery].suggestions, function(item) {
                nextResponseItem = buildSuggestResponseObjectItemSkeleton(item.term, reqQuery, true);
                nextResponseItem.category = 'Suggestion';
                if (hasItem(nextResponseItems, nextResponseItem)) {
                    totalFound -= 1; //remove from total count
                } else {
                    nextResponseItems = nextResponseItems.concat(nextResponseItem);
                }
            });
            // get suggestions from spellcheck if suggest has no items to return
            // see GoldSearchFrame.java (line 171-180)
            if (solrResponseObject.hasOwnProperty('spellcheck') &&
                solrResponseObject.suggest.phrase_suggester[escapedQuery].numFound === 0 &&
                solrResponseObject.suggest.freetext_suggester[escapedQuery].numFound === 0) {

                if (solrResponseObject.spellcheck.hasOwnProperty('suggestions')) {

                    if (solrResponseObject.spellcheck.suggestions[0] === reqQuery.query) {

                        totalFound += solrResponseObject.spellcheck.suggestions[1].numFound;
                        _.each(solrResponseObject.spellcheck.suggestions[1].suggestion, function(item) {
                            nextResponseItem = buildSuggestResponseObjectItemSkeleton(item.word !== undefined ? item.word : item, reqQuery, true);
                            nextResponseItem.category = 'Spelling Suggestion';
                            nextResponseItems = nextResponseItems.concat(nextResponseItem);
                        });
                    }
                }
            }
        }


        //search SOLR termonology
        if (solrResponseObject.hasOwnProperty('terms')) {

            //search general termonology
            if (solrResponseObject.terms.hasOwnProperty('kind')) {
                totalFound += (solrResponseObject.terms.kind.length) / 2; // kind is a array of suggestions followed by a number like [text1,222, text2, 12, ...]
                _.each(solrResponseObject.terms.kind, function(item) {

                    if (typeof(item) === 'string') { // gets the string suggestions not the numbers
                        nextResponseItem = buildSuggestResponseObjectItemSkeleton(item, reqQuery);
                        nextResponseItem.category = 'Domain';
                        nextResponseItems = nextResponseItems.concat(nextResponseItem);
                    }
                });
            }
            //search med_drug_class termonology
            if (solrResponseObject.terms.hasOwnProperty('med_drug_class_name')) {
                totalFound += (solrResponseObject.terms.med_drug_class_name.length) / 2; // Therapeutic Drug Class is a array of suggestions followed by a number like [text1,222, text2, 12, ...]
                _.each(solrResponseObject.terms.med_drug_class_name, function(item) {

                    if (typeof(item) === 'string') { // gets the string suggestions not the numbers
                        nextResponseItem = buildSuggestResponseObjectItemSkeleton(item, reqQuery);
                        nextResponseItem.category = 'Therapeutic Drug Class';
                        nextResponseItems = nextResponseItems.concat(nextResponseItem);
                    }
                });
            }
        }

        //search in meds to get the distinct drug classes
        if (solrResponseObject.hasOwnProperty('facet_counts')) {
            if (solrResponseObject.facet_counts.hasOwnProperty('facet_pivot')) {
                if (solrResponseObject.facet_counts.facet_pivot.hasOwnProperty('med_drug_class_name,qualified_name')) {
                    _.each(solrResponseObject.facet_counts.facet_pivot['med_drug_class_name,qualified_name'], function(item) {
                        totalFound += item.count;
                        nextResponseItem = buildSuggestResponseObjectItemSkeleton(item.value, reqQuery);
                        nextResponseItem.category = 'Inferred Drug Class';
                        nextResponseItems = nextResponseItems.concat(nextResponseItem);
                    });
                }
            }
        }

        hmpEmulatedSuggestResponseObject.data.currentItemCount += totalFound;
        hmpEmulatedSuggestResponseObject.data.itemsPerPage += totalFound;
        hmpEmulatedSuggestResponseObject.data.totalItems += totalFound;
        hmpEmulatedSuggestResponseObject.data.items = hmpEmulatedSuggestResponseObject.data.items.concat(nextResponseItems);

    });

    return hmpEmulatedSuggestResponseObject;
}

function buildSuggestResponseObjectSkeleton(reqQuery) {
    var responseObject = {};

    var data = {};
    data.currentItemCount = 1;
    data.itemsPerPage = 1;
    data.startIndex = 0;
    data.totalItems = 1;
    data.items = [{
        query: reqQuery.query,
        display: 'Search for: "' + reqQuery.query + '"',
        textSearchTerm: reqQuery.query
    }];

    responseObject.id = _s.lpad(Math.floor(Math.random() * 10000000000), 9, '0'); // TODO: verify that this is what HMP actually does
    responseObject.data = data;
    responseObject.success = true;

    return responseObject;
}

function hasItem(itemArray, item) {
    var result = false;
    _.each(itemArray, function(nextItem) {
        if (nextItem.query === item.query) {
            result = true;
        }
    });
    return result;
}

function buildSuggestResponseObjectItemSkeleton(searchTerm, reqQuery, isSpelling) {
    var itemObject = {};
    itemObject.query = _s.stripTags(searchTerm).toLowerCase();
    itemObject.query = itemObject.query.replace('\u001e', ' ');

    //var splitDisplay = itemObject.query.split(reqQuery.query.toLowerCase());
    if (isSpelling) {
        itemObject.display = _s.stripTags(searchTerm).toLowerCase();
    } else {
        itemObject.display = itemObject.query;
    }
    itemObject.category = '';
    itemObject.textSearchTerm = _s.stripTags(itemObject.display); //text used in a text search. Replaces HMP's frameID key. Useful when building the applet.


    return itemObject;
}

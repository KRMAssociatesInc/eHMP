'use strict';

// TODO: rename to text.js or searchText.js? Makes sense in directory context, but not by filename alone

var rdk = require('../../../core/rdk');
var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var async = require('async');
var hmpSolrResponseTransformer = require('./hmp-solr-response-transformer');
var nullchecker = rdk.utils.nullchecker;
var solrSimpleClient = require('./solr-simple-client');
var auditUtil = require('../../../utils/audit');
//var Domains = require('../../resources/patientrecord/Domains');

module.exports = performTextSearch;
module.exports.parameters = {
    get: {
        pid: {
            required: true
        },
        query: {
            required: true,
            description: 'The text being searched for'
        },
        types: {
            required: false,
            description: 'The domains to search on solr'
        },
        start: {
            required: false,
            description: 'First index of results'
        },
        limit: {
            required: false,
            description: 'Number of results to show'
        }
    }
};
module.exports.description = {
    get: 'Perform a text search on records for one patient'
};

module.exports.apiDocs = {
    spec: {
        summary: 'Perform a text search on records for a patient',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('query', 'text to search', 'string', true),
            rdk.docs.swagger.paramTypes.query('types', 'domains to search', 'string', true),
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit
        ],
        responseMessages: []
    }
};

// below: _ exports for unit testing only
module.exports._buildSolrQuery = buildSolrQuery;
module.exports._buildSpecializedSolrQuery = buildSpecializedSolrQuery;

/**
 * /vpr/v{apiVersion}/search
 * Request parameters:
 * String pid     required
 * String query   required
 * String[] types optional
 * String range   optional
 *
 * @param req
 * @param res
 * @param next
 * @returns {*}
 */
function performTextSearch(req, res, next) {
    // Parse the URL

    // expected query params:
    //    _dc       // "search identifier", currently timestamp, can by anything though
    //    format    // only accepts json
    //    domains   // solr "fq=domain:type" --- there can be multiple 'types' parameters
    //    range     // always blank? TODO
    //    query     // solr "q=*query*"
    //    pid       // solr "fq=pid:(11111)"
    //    page      // unused
    //    start     // solr "start"
    //    limit     // solr "rows"

    var reqQuery = req.query;
    var specializedSolrQueryStrings = [];
    var facetMap = solrSimpleClient.generateFacetMap();
    var domains;
    async.series({
            currentPatient: function(cb) {
                req.app.subsystems.jdsSync.getPatientAllSites(reqQuery.pid, req, function(error, result) {
                    cb(error, result);
                });
            }
        },
        function(error, response) {
            if (error) {
                console.log(error);
                return;
            }

            try {
                response = JSON.parse(response);
            } catch (e) {
                // do nothing - not valid JSON
            }
            //console.dir(response.currentPatient.data.data.items);
            var patientJsonData = response.currentPatient.data.data.items;

            var patientPIDList = [];
            _.each(patientJsonData, function(patient) {

                patientPIDList.push(patient.pid);
            });

            var allPids = patientPIDList.join(' OR ');
            reqQuery.pidJoinedList = allPids;
            if (allPids.indexOf('OR') !== -1) {
                reqQuery.pidJoinedList = '(' + reqQuery.pidJoinedList + ')';
            }
            //console.log('reqQuery.pidJoinedList: ' + reqQuery.pidJoinedList);
            //return allPids;
            //     }
            // );

            // TODO: make this more elegant
            req.audit.patientId = reqQuery.pid;
            req.audit.patientPidList = reqQuery.pidJoinedList;
            req.audit.logCategory = 'SEARCH';
            auditUtil.addAdditionalMessage(req, 'searchCriteriaQuery', util.format('query=%s', reqQuery.query));
            auditUtil.addAdditionalMessage(req, 'searchCriteriaDomain', util.format(util.format('domains=%s', reqQuery.domains)));

            if (nullchecker.isNullish(reqQuery.pid)) {
                // require searchText and pid
                return next();
            }
            if (nullchecker.isNullish(reqQuery.query)) {
                return next();
            }

            req.logger.info('performing search using query [%s] on domain [%s]', reqQuery.query, reqQuery.domains);



            if (nullchecker.isNullish(reqQuery.types)) {
                // manually set all the domains to search because HMP needs specialized queries
                domains = [
                    'accession',
                    'allergy',
                    'treatment',
                    'consult',
                    'procedure',
                    'obs',
                    'image',
                    'surgery',
                    'mh',
                    'immunization',
                    'pov',
                    'skin',
                    'exam',
                    'cpt',
                    'education',
                    'factor',
                    'appointment',
                    'visit',
                    'rad',
                    'ptf',

                    // TODO: incorporate these as default
                    //            cpt obs encounter procedure allergy immunization mh roadtrip auxiliary pov skin diagnosis ptf exam education treatment

                    'med',
                    'order',
                    'document',
                    'vital',
                    'lab',
                    'problem'
                ];
            } else {
                domains = [].concat(reqQuery.types);
            }


            // var facetMap = solrSimpleClient.generateFacetMap();
            //var specializedSolrQueryStrings = [];
            _.each(domains, function(domain) {
                var specializedSolrQuery = buildSpecializedSolrQuery(reqQuery, facetMap, domain);
                specializedSolrQueryStrings.push(specializedSolrQuery);
            });
            executeAndTransformSolrQuerys(specializedSolrQueryStrings, res, req, reqQuery, facetMap, domains);
        }
    );
    // async.map(specializedSolrQueryStrings,
    //     function(item, callback) {
    //         console.log('solr--------- : ' + item);
    //         solrSimpleClient.executeSolrQuery(item, 'select', req, function(err, result) {
    //             callback(err, result);
    //         });
    //     },
    //     function(err, results) {
    //         if (err) {
    //             res.status(500).rdkSend('The search could not be completed\n' + err.stack);
    //             return;
    //         }
    //         var hmpEmulatedResponseObject = hmpSolrResponseTransformer.addSpecializedResultsToResponse(results, reqQuery, facetMap, domains);
    //         hmpEmulatedResponseObject.params = reqQuery;
    //         hmpEmulatedResponseObject.method = req.route.stack[0].method.toUpperCase() + ' ' + req.route.path;

    //         res.rdkSend(hmpEmulatedResponseObject);
    //     }
    // );
}

function executeAndTransformSolrQuerys(specializedSolrQueryStrings, res, req, reqQuery, facetMap, domains) {
    async.map(specializedSolrQueryStrings,
        function(item, callback) {
            solrSimpleClient.executeSolrQuery(item, 'select', req, function(err, result) {
                return callback(err, result);
            });
        },
        function(err, results) {
            if (err) {
                res.status(500).rdkSend('The search could not be completed\n' + err.stack);
                return;
            }
            var hmpEmulatedResponseObject = hmpSolrResponseTransformer.addSpecializedResultsToResponse(results, reqQuery, facetMap, domains);
            hmpEmulatedResponseObject.params = reqQuery;
            hmpEmulatedResponseObject.method = req.route.stack[0].method.toUpperCase() + ' ' + req.route.path;

            res.rdkSend(hmpEmulatedResponseObject);
        }
    );
}

/**
 *
 * @param reqQuery
 * @param facetMap
 * @param domain
 * @param queryParameters
 * @returns {*}
 */
function buildSolrQuery(reqQuery, facetMap, domain, queryParameters) {
    if (!reqQuery || !reqQuery.pid) {
        return new Error('pid must be specified');
    }
    if (!facetMap) {
        return new Error('facetMap must be provided');
    }
    queryParameters = queryParameters || {};
    domain = domain || '*:*';
    var start = reqQuery.start || 0;
    var limit = reqQuery.limit || 101;
    var defaultQueryParameters = {
        fl: [ // select these fields
            'uid',
            'datetime',
            'summary',
            'url',
            'kind',
            'facility_name'
        ],
        fq: [ // filter queries
            ('pid:' + reqQuery.pidJoinedList), ('domain:' + domain),
            'domain:(NOT patient)'
        ],
        q: '"' + reqQuery.query + '"',
        start: start,
        rows: limit,
        wt: 'json',
        facet: 'true',
        'facet.query': Object.keys(facetMap),
        'facet.mincount': '1',
        'facet.field': '{!ex=domain}domain',
        synonyms: 'true',
        defType: 'synonym_edismax',
    };

    _.each(Object.keys(defaultQueryParameters), function(queryParameterType) {
        if (queryParameters.hasOwnProperty(queryParameterType)) {
            // if there are conflicting elements, resolve the merge below
            if (Array.isArray(defaultQueryParameters[queryParameterType])) {
                queryParameters[queryParameterType] = queryParameters[queryParameterType].concat(
                    defaultQueryParameters[queryParameterType]
                );
            }
            //            if (typeof defaultQueryParameters === 'string') {
            //                // do nothing for now, just keep the overridden query parameters
            //            }
            if (typeof defaultQueryParameters === 'object') {
                queryParameters[queryParameterType] = _.extend(
                    defaultQueryParameters[queryParameterType],
                    queryParameters[queryParameterType]
                );
            }
        } else {
            queryParameters[queryParameterType] = defaultQueryParameters[queryParameterType];
        }
    });

    //    if (reqQuery.indexOf('range') >= 0) {
    //
    //    }  // FIXME

    var compiledQueryParameters = solrSimpleClient.compileQueryParameters(queryParameters);
    var solrQueryString = querystring.stringify(compiledQueryParameters);
    return solrQueryString;
}

/**
 * Perform domain-specific solr queries
 *
 * @param reqQuery
 * @param facetMap
 * @param domain
 * @returns {*}
 */
function buildSpecializedSolrQuery(reqQuery, facetMap, domain) {
    var buildSpecializedSolrQueryDispatch = {
        accession: buildDefaultQuery,
        allergy: buildDefaultQuery,
        treatment: buildDefaultQuery,
        consult: buildDefaultQuery,
        procedure: buildDefaultQuery,
        obs: buildDefaultQuery,
        image: buildDefaultQuery,
        surgery: buildDefaultQuery,
        mh: buildDefaultQuery,
        immunization: buildDefaultQuery,
        pov: buildDefaultQuery,
        skin: buildDefaultQuery,
        exam: buildDefaultQuery,
        cpt: buildDefaultQuery,
        education: buildDefaultQuery,
        factor: buildDefaultQuery,
        appointment: buildDefaultQuery,
        visit: buildDefaultQuery,
        rad: buildDefaultQuery,
        ptf: buildDefaultQuery,

        med: buildMedQuery,
        order: buildOrderQuery,
        document: buildDocumentQuery,
        vital: buildVitalQuery,
        result: buildLabQuery,
        lab: buildLabQuery,
        problem: buildProblemQuery,

        //suggest: buildSuggestQuery,
        //tasks: buildTasksQuery,
        //generic: buildGenericQuery,
        //wholeDomain: buildWholeDomainQuery,
        //labPanel: buildLabPanelQuery,
        //labGroup: buildLabGroupQuery,
        //infobuttonSearch: buildInfobuttonQuery  // HMP uses Infobutton as one word
        default: buildDefaultQuery
    };

    domain = domain.toLowerCase();
    var specializedSolrQuery = buildSpecializedSolrQueryDispatch[domain](reqQuery, facetMap, domain);
    return specializedSolrQuery;
}

function buildDefaultQuery(reqQuery, facetMap, domain) {
    var queryString = buildSolrQuery(reqQuery, facetMap, domain);
    return queryString;
}

function buildMedQuery(reqQuery, facetMap, domain) {
    var queryParameters = {
        sort: 'overall_stop desc',
        fl: [
            'qualified_name',
            'va_type',
            'last_filled',
            'last_give',
            'med_drug_class_name'
        ],
        group: 'true',
        'group.field': 'qualified_name',
        hl: 'true',
        'hl.fl': [
            'administration_comment',
            'prn_reason'
        ],
        'hl.fragsize': 72,
        'hl.snippets': 5,
        'q.op': 'AND'
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

function buildOrderQuery(reqQuery, facetMap, domain) {
    var queryParameters = {
        fq: [
            'service:(LR OR GMRC OR RA OR FH OR UBEC OR "OR")',
            '-status_name:(COMPLETE OR "DISCONTINUED/EDIT" OR DISCONTINUED OR EXPIRED OR LAPSED)'
        ],
        fl: [
            'service',
            'status_name'
        ],
        hl: 'true',
        'hl.fl': [
            'content'
        ],
        'hl.fragsize': 45,
        'hl.snippets': 5
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

function buildDocumentQuery(reqQuery, facetMap, domain) {
    var queryParameters = {
        fl: [
            'local_title',
            'phrase'
        ],
        group: 'true',
        'group.field': 'local_title',
        sort: 'reference_date_time desc',
        hl: 'true',
        'hl.fl': [
            'body',
            'subject'
        ],
        'hl.fragsize': 45,
        'hl.snippets': 5
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

function buildVitalQuery(reqQuery, facetMap, domain) {
    var queryParameters = {
        sort: 'observed desc',
        group: 'true',
        'group.field': 'qualified_name'
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

function buildLabQuery(reqQuery, facetMap, domain) {
    domain = 'result';
    var queryParameters = {
        fl: [
            'lnccodes',
            'type_code',
            'group_name',
            'observed',
            'interpretationName',
            'units'
        ],
        sort: 'observed desc',
        group: 'true',
        'group.field': 'qualified_name_units',
        hl: 'true',
        'hl.fl': [
            'comment'
        ],
        'hl.fragsize': 45,
        'hl.snippets': 5
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

function buildProblemQuery(reqQuery, facetMap, domain) {
    var queryParameters = {
        fq: ['-removed:true'],
        fl: [
            'comment',
            'icd_code',
            'icd_name',
            'icd_group',
            'problem_status',
            'acuity_name'
        ],
        sort: 'problem_status asc',
        group: 'true',
        'group.field': 'icd_code'
    };
    var solrQueryString = buildSolrQuery(reqQuery, facetMap, domain, queryParameters);
    return solrQueryString;
}

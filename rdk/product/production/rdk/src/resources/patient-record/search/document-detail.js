'use strict';

var util = require('util');
var querystring = require('querystring');
var _ = require('underscore');
var async = require('async');
var solrSimpleClient = require('./solr-simple-client');
var rdk = require('../../../core/rdk');

module.exports = getDocumentDetail;
module.exports.description = {
    get: 'Get text search result detail where the items in a group are text documents'
};
module.exports.parameters = {
    get: {
        pid: {
            required: true
        },
        query: {
            required: true,
            description: 'The original search query'
        },
        group_value: {
            required: true,
            description: 'The Value that solr grouped on'
        },
        group_field: {
            required: true,
            description: 'The field that solr grouped on'
        }

    }
};

module.exports.apiDocs = {
    spec: {
        summary: 'Get text search result detail where the items in a group are text documents',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.swagger.paramTypes.query('query', 'text to search', 'string', true),
            rdk.docs.swagger.paramTypes.query('group.field', '', 'string', true),
            rdk.docs.swagger.paramTypes.query('group.value', '', 'string', true)
        ],
        responseMessages: []
    }
};

function getDocumentDetail(req, res, next) {

    if (!_.every(['pid', 'query', 'group.value', 'group.field'], _.has.bind(null, req.query))) {
        return next();
    }

    //var domain = req.query.domain;
    var pid = req.query.pid;
    var query = req.query.query;
    //var domain = req.query.domain;
    var group_value = req.query['group.value'];
    var group_field = req.query['group.field'];


    /*
     /solr/select?
     q=pid:+<pid>&
     rows=1000&
     fq={!tag=dt}datetime:[<hl7date> TO *]  // if date range included
     fq=domain:encounter&                   // required
     fq=<query>&                            // if query included
     fq=stop_code_name:"<location>"&        // if location included
     sort=visit_date_time+desc&
     */

    async.waterfall(
        [
            req.app.subsystems.jdsSync.getPatientAllSites.bind(null, pid, req),
            function(jdsResponse, status, callback) {
                var pids = _.pluck(jdsResponse.data.data.items, 'pid');
                var grouping = util.format('%s:"%s"', group_field, group_value);

                var fq = [
                    'pid:(' + pids.join(' OR ') + ')',
                    grouping
                ];
                if (group_field === 'local_title') {
                    fq.push('domain: document');
                }

                var queryParameters = {
                    q: util.format('"%s"', query),
                    sort: 'datetime desc,reference_date_time desc',
                    fq: fq,
                    //fl: [
                    //    'uid'
                    //],
                    hl: true,
                    'hl.fragsize': 60,
                    'hl.snippets': 10,
                    'hl.fl': [
                        'body',
                        'subject'
                    ],
                    defType: 'synonym_edismax',
                    synonyms: true,
                    qs: 4,
                    qf: 'all',
                    wt: 'json',
                    rows: 1000
                };
                //
                //if(req.query.range) {
                //    // TODO
                //}
                //if(req.query.stop_code_name) {
                //
                //}
                return solrSimpleClient.executeSolrQuery(querystring.stringify(queryParameters), 'select', req, callback);
            }
        ],
        function(err, response) {
            if (err) {
                return res.status(500).rdkSend(err.message);
            }
            var formattedResponse = {
                data: {
                    items: {
                        results: response.response.docs,
                        highlights: response.highlighting
                    }
                }
            };
            res.status(200).rdkSend(formattedResponse);
        }
    );
}

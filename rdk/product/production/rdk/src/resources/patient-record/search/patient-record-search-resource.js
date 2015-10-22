'use strict';
var textSearch = require('./text-search');
var suggestSearch = require('./suggest-search');
var trendDetail = require('./trend-detail');
var documentDetail = require('./document-detail');
var rdk = require('../../../core/rdk');

module.exports.getResourceConfig = function () {
    return [
        {
            name: 'text',
            path: '/text',
            get: textSearch,
            parameters: textSearch.parameters,
            apiDocs: textSearch.apiDocs,
            description: textSearch.description,
            healthcheck: {
                dependencies: ['authorization','jds','solr','jdsSync']
            },
            permissions: []
        },
        {
            name: 'suggest',
            path: '/suggest',
            get: suggestSearch,
            parameters: suggestSearch.parameters,
            apiDocs: suggestSearch.apiDocs,
            description: suggestSearch.description,
            healthcheck: {
                dependencies: ['authorization','jds','solr','jdsSync']
            },
            permissions: []
        },
        {
            name: 'detail-trend',
            path: '/detail/trend',
            get: trendDetail,
            parameters: trendDetail.parameters,
            apiDocs: trendDetail.apiDocs,
            description: trendDetail.description,
            healthcheck: {
                dependencies: ['authorization','jds','solr','jdsSync']
            },
            permissions: []
        },
        {
            name: 'detail-document',
            path: '/detail/document',
            get: documentDetail,
            parameters: documentDetail.parameters,
            apiDocs: documentDetail.apiDocs,
            description: documentDetail.description,
            healthcheck: {
                dependencies: ['authorization','jds','solr','jdsSync']
            },
            permissions: []
        }
    ];
};

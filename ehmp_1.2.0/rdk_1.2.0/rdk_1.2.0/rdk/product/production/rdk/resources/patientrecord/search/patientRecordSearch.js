/*jslint node: true */
'use strict';
var textSearch = require('./textSearch');
var suggestSearch = require('./suggestSearch');
var trendDetail = require('./trendDetail');
var documentDetail = require('./documentDetail');
var rdk = require('../../../rdk/rdk');

module.exports.getResourceConfig = function () {
    return [
        {
            name: 'text',
            path: '/text',
            get: textSearch,
            parameters: textSearch.parameters,
            apiDocs: textSearch.apiDocs,
            description: textSearch.description,
            interceptors: {
                synchronize: true
            },
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
            interceptors: {
                synchronize: true
            },
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
            interceptors: {
                synchronize: true
            },
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
            interceptors: {
                synchronize: true
            },
            healthcheck: {
                dependencies: ['authorization','jds','solr','jdsSync']
            },
            permissions: []
        }
    ];
};

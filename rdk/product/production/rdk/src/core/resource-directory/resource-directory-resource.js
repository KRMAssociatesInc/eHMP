'use strict';

var _ = require('lodash');
var dd = require('drilldown');
var path = require('path');

var htmlViewerStaticPath = path.resolve(__dirname + '/../../utils/html-documentation');

var resourceDirectoryInterceptors = {
    authentication: false,
    pep: false,
    operationalDataCheck: false,
    synchronize: false
};

module.exports.getResourceConfig = function(app) {
    return _.flatten(_.map(['', 'cors'], function(path) {
        return [
            {
                name: path,
                path: path,
                get: getResourceDirectory.bind(null, path),
                interceptors: resourceDirectoryInterceptors
            },
            {
                name: (path ? path + '-html' : 'html'),
                path: path + '/html',
                //get: require('express').static(htmlViewerStaticPath),
                get: getResourceDirectoryHtml,
                interceptors: resourceDirectoryInterceptors
            }
        ];
    }));
};

function getResourceDirectory(path, req, res) {
    req.audit.logCategory = 'RESOURCEDIRECTORY';

    var baseUrl = null;
    if(path === 'cors') {
        baseUrl = (dd(req.app)('config')('externalProtocol').val || req.protocol) + '://' + req.get('Host');
    }

    var serializedResources = JSON.stringify(
        req.app.resourceRegistry.getDirectory(baseUrl, dd(req.app)('config')('rootPath').val),
        function replacer(key, value) {
            if (value instanceof RegExp) {
                return value.toString();
            }
            return value;
        }
    );
    res.type('application/json').rdkSend(serializedResources);
}

function getResourceDirectoryHtml(req, res, next) {
    req.url = req.url.match(/.*?\/html(.*)/)[1];
    return require('express').static(htmlViewerStaticPath)(req, res, next);
}

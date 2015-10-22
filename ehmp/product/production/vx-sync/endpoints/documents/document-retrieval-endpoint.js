'use strict';

var docUtil = require(global.VX_UTILS + 'doc-utils');
var path = require('path');

function registerDocAPI(log, config, environment, app) {
    app.get('/documents', getDocument.bind(null, log));

    function getDocument(log, request, response) {
        var dir = request.param('dir');
        var file = request.param('file');
        if (!dir || !/[a-fA-F0-9]+/.test(dir)) {
            return response.status(400).send('Invalid directory parameter');
        }
        if (!file || !/[a-zA-Z0-9-]+\.[a-z]{3,4}/.test(file)) {
            return response.status(400).send('Invalid file parameter');
        }
        var rootPath = docUtil.getDocOutPath('', config); // specify the root dir
        var filePath = path.join(dir, file);

        response.sendFile(filePath, {
            dotfiles: 'deny',
            root: rootPath
        }, function(err) {
            if (err) {
                log.error(err);
                response.status(err.status).end();
            } else {
                log.info('document-retrieval-endpoint.getDocument : Sent:' + filePath);
            }
        });
    }
}

module.exports = registerDocAPI;
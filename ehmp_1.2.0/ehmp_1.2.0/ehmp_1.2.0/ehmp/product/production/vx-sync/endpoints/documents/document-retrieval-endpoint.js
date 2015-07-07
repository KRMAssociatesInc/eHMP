'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --port <port>')
    .demand(['port'])
    .argv;

require('../../env-setup');

var express = require('express');

var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);
var log = logUtil.get('doc-endpoint');


var app = express();
var port = argv.port;

app.get('/documents', getDocument.bind(null, log));


app.get('/ping', function(req, res) {
    res.send('ACK');
});

function getDocument(log, request, response) {
    var dir = request.param('dir');
    var file = request.param('file');
    if (!dir || !/[a-fA-F0-9]+/.test(dir)) {
        return response.status(400).send('Invalid directory parameter');
    }
    if (!file || !/[a-zA-Z0-9-]+\.[a-z]{3,4}/.test(file)) {
        return response.status(400).send('Invalid file parameter');
    }
    var filePath = config.documentStorage.publish.path + '/' + dir + '/' + file;
    response.sendFile(filePath, {
        dotfiles: 'deny'
    }, function(err) {
        if (err) {
            log.error(err);
            response.status(err.status).end();
        } else {
            log.info('document-retrieval-endpoint.getDocument : Sent:' + filePath);
        }
    });
}
app.listen(port);
log.info('document-retrieval endpoint listening on port %s', port);
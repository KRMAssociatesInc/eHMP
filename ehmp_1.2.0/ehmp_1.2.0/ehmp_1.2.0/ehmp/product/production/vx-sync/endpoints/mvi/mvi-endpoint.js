'use strict';

var argv = require('yargs')
    .usage('Usage: $0 --connector <path-to-connector> --port <port>')
    .demand(['connector', 'port'])
    .argv;

require('../../env-setup');
var _ = require('underscore');
var express = require('express');
var lookup = require(argv.connector);
var config = require(global.VX_ROOT + 'worker-config');
var logUtil = require(global.VX_UTILS + 'log');
logUtil.initialize(config.loggers);
var log = logUtil.get('mvi-endpoint', 'host');
var idUtil = require(global.VX_UTILS + 'patient-identifier-utils');

var port = argv.port;

var app = express();

app.get('/mvi', function(req, res) {
    var id = req.param('id');
    var type = req.param('type');

    log.debug('mvi-endpoints.get(/mvi) id: %s, type: %s', id, type);

    if(!id) {
        return res.status(400).send('No value for id');
    }

    if(!type) {
        return res.status(400).send('No value for type');
    }

    lookup(idUtil.create(type, id), function(error, result) {
        if(error) {
            return res.status(500).send(error);
        }

        if(_.isEmpty(result)) {
            return res.status(404).send('No patient found');
        }

        res.status(200).send(result);
    });
});


app.get('/ping', function(req, res) {
    res.send('ACK');
});

app.listen(port);
log.warn('mvi endpoint listening on port %s', port);

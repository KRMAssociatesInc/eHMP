#!/usr/bin/env node
'use strict';

var rdk = require('../src/core/rdk');

var app = rdk.appfactory().defaultConfigFilename('../../config/rdk-pick-list-server-config.json').argv(process.argv).build();

app.register('write-pick-list', '/', require('../src/write/pick-list/pick-list-resources').getResourceConfig(app));

require('../src/write/pick-list/pick-list-resources').loadLargePickLists(app);

var port = app.config.appServer.port;
var server = app.listen(port, function() {
    var address = server.address();
    app.logger.info('Writeback Pick List Service listening at http://%s:%s', address.host, address.port);
});

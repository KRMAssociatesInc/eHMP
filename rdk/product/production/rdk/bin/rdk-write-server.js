#!/usr/bin/env node
'use strict';

var rdk = require('../src/core/rdk');

var app = rdk.appfactory().defaultConfigFilename('../../config/rdk-write-server-config.json').argv(process.argv).build();

//notes
//med-orders
//lab-orders
//problems
//allergies
//immunizations
//vitals

app.register('allergies', '/patient/:pid/allergies', require('../src/write/allergies/allergies-resources').getResourceConfig(app));

app.register('encounters', '/patient/:pid/encounters', require('../src/write/encounters/encounters-resources').getResourceConfig(app));

app.register('immunizations', '/patient/:pid/immunizations', require('../src/write/immunizations/immunizations-resources').getResourceConfig(app));

app.register('orders-print', '/patient/:pid/orders-print', require('../src/write/orders-print/orders-print-resources').getResourceConfig(app));

app.register('orders', '/patient/:pid/orders', require('../src/write/orders/orders-resources').getResourceConfig(app));

app.register('write-back-sign-order', '/writeback/orders', require('../src/write/orders/signorderResource').getResourceConfig(app));

app.register('notes', '/patient/:pid/notes', require('../src/write/notes/notes-resources').getResourceConfig(app));

app.register('write-back-sign-note', '/writeback/notes', require('../src/write/notes/signnoteResource').getResourceConfig(app));

app.register('problems', '/patient/:pid/problems', require('../src/write/problems/problems-resources').getResourceConfig(app));

app.register('vitals', '/patient/:pid/vitals', require('../src/write/vitals/vitals-resources').getResourceConfig(app));

app.register('lab-support-data', '/labSupportData', require('../src/write/orders/lab/support-data/lab-support-data-resources').getResourceConfig(app));

var port = app.config.appServer.port;
var server = app.listen(port, function() {
    var address = server.address();
    app.logger.info('Writeback Data Service listening at http://%s:%s', address.host, address.port);
});

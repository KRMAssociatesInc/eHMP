'use strict';

var rdk = require('../rdk/rdk');

var app = rdk.appfactory().defaultConfigFilename('../write/config/write-health-data-service-config.json').argv(process.argv).build();

//notes
//med-orders
//lab-orders
//problems
//allergies
//immunizations
//vitals

app.register('allergies', '/write-health-data/patient/:pid/allergies', require('./allergies/allergies-resources').getResourceConfig(app));

app.register('immunizations', '/write-health-data/patient/:pid/immunizations', require('./immunizations/immunizations-resources').getResourceConfig(app));

app.register('lab-orders', '/write-health-data/patient/:pid/lab-orders', require('./lab-orders/lab-orders-resources').getResourceConfig(app));

app.register('med-orders', '/write-health-data/patient/:pid/med-orders', require('./med-orders/med-orders-resources').getResourceConfig(app));

app.register('notes', '/write-health-data/patient/:pid/notes', require('./notes/notes-resources').getResourceConfig(app));

app.register('problems', '/write-health-data/patient/:pid/problems', require('./problems/problems-resources').getResourceConfig(app));

app.register('vitals', '/write-health-data/patient/:pid/vitals', require('./vitals/vitals-resources').getResourceConfig(app));

var port = app.config.appServer.port;
var server = app.listen(port, function() {
    var address = server.address();
    app.logger.info('Writeback Data Service listening at http://%s:%s', address.host, address.port);
});

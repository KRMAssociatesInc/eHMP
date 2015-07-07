/*jslint node: true */
'use strict';

var rdk = require('../../rdk/rdk');
var app = rdk.appfactory().defaultConfigFilename('../write/config/write-pick-list-service-config.json').argv(process.argv).build();
var dbFunctions = require('./db/db-functions').dbFunctions;

app.register('write-pick-list', '/write-pick-list', require('./pick-list-resources').getResourceConfig(app));
dbFunctions.initiateDB();
module.exports.dbFunctions = dbFunctions;
var port = app.config.appServer.port;
var server = app.listen(port, function() {
    var address = server.address();
    app.logger.info('Writeback Pick List Service listening at http://%s:%s', address.host, address.port);
});

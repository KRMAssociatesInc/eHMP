'use strict';

var handler = require('./operational-sync-endpoint-handler');

function registerOPDAPI(log, config, environment, app) {

    app.post('/data/load', handler.doLoad.bind(null, log, environment));
    app.get('/data/doLoad', handler.doLoad.bind(null, log, environment));

}
module.exports = registerOPDAPI;
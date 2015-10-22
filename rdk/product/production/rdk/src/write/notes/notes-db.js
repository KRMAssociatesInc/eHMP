'use strict';

var Datastore = require('nedb');
var db = new Datastore();

module.exports = db;
module.exports.initialize = function initialize(app) {
    app.logger.info('Initializing pick list in-memory database');
    // TODO initialize db if necessary
};

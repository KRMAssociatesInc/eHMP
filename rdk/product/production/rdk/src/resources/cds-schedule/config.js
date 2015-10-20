/*jslint node: true */
'use strict';

module.exports = {
    MongoDbListener: {
        host: '10.2.2.125',
        port: '27017',
    },
    Scheduler: {
        dbname: 'schedule',
        collection: 'agendajobs',
        CDSJobURL: '10.2.2.49:8080/cds-results-service/core/executeRulesJob'
    },
    ExecuteRequest: {
        dbname: 'schedule',
        collection: 'cdsjobs'
    }
};

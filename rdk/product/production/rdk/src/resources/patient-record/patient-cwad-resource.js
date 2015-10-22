/**
 * Created by alexluong on 10/21/14.
 */

'use strict';

var rdk = require('../../core/rdk');
var _ = rdk.utils.underscore;
var nullchecker = rdk.utils.nullchecker;

var querystring = require('querystring');

var parameters = {
    get: {
        pid: {
            required: true,
            description: 'patient id'
        },
        start: {
            required: false,
            regex: /\d+/,
            description: 'start showing results from this 0-based index'
        },
        limit: {
            required: false,
            regex: /\d+/,
            description: 'show this many results'
        },
        filter: {
            required: false,
            regex: /eq("[^"]*","[^"]*")/,
            description: 'see the wiki for full documentation: https://wiki.vistacore.us/display/VACORE/JDS+Parameters+and+Filters'
        },
        order: {
            required: false,
            regex: /\w+ (asc|desc)/,
            description: 'Field to sort by and order'
        }
    }
};

var apiDocs = {
    spec: {
        summary: 'Get crisis, warnings, allergies, and directives for a patient',
        notes: '',
        parameters: [
            rdk.docs.commonParams.pid,
            rdk.docs.commonParams.jds.start,
            rdk.docs.commonParams.jds.limit,
            rdk.docs.commonParams.jds.filter,
            rdk.docs.commonParams.jds.order
        ],
        responseMessages: []
    }
};

module.exports.getResourceConfig = function() {
    return [{
        name: '',
        path: '',
        get: getPatientCwad,
        parameters: parameters,
        apiDocs: apiDocs,
        interceptors: {
            validateAgainstApiDocs: true,
            jdsFilter: true
        },
        healthcheck: {
                dependencies: ['patientrecord','jds','solr','jdsSync','authorization']
        },
        permissions: []
    }];
};

function getPatientCwad(req, res, next) {
    var pid = req.query.pid;

    if(nullchecker.isNullish(pid)) {
        return next();
    }

    var jdsResource = '/vpr/' + pid + '/index/cwad';
    var jdsQuery = _.pick(req.query, 'start', 'limit', 'filter', 'order');
    var jdsPath = jdsResource + '?' + querystring.stringify(jdsQuery);

    var options = _.extend({}, req.app.config.jdsServer, {
        method: 'GET',
        path: jdsPath
    });

    var httpConfig = {
        options: options,
        protocol: 'http',
        logger: req.logger
    };

    rdk.utils.http.fetch(req.app.config, httpConfig,
        function(err, data) {
            if(err) {
                res.rdkSend(err);
            }
            res.rdkSend(data);
        },
        function(statusCode, data) {
            try {
                data = JSON.parse(data);
            } catch(e) {
                // do nothing, wasn't valid JSON
            }
            return data;
        }
    );

}





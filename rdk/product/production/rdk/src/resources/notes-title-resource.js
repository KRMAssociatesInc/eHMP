/*jslint node: true */
'use strict';

var _ = require('underscore');
var rdk = require('../core/rdk');
var jdsFilter = require('jds-filter');
var querystring = require('querystring');
var jds = rdk.utils.jds;

module.exports.getResourceConfig = function() {
    return [{
        name: 'getUserRecentTitles',
        path: '',
        get: getUserLastTitle,
        apiDocs: {
            spec: {
                summary: 'Returns the three most recent note titles the user has saved',
                notes: '',
                parameters: [],
                responseMessages: []
            }
        },
        description: {
            get: 'Returns the three most recent note titles the user has saved'
        },
        interceptors: {
            pep: false,
            synchronize: false
        },
        healthcheck: {
            dependencies: ['jds','jdsSync','authorization']
        }
    }];
};

function getUserLastTitle(req, res) {
    req.logger.debug('user = ' + JSON.stringify(req.session.user));
    var user = req.session.user;
    var userUid = 'urn:va:user:' + user.site + ':' + user.duz[user.site];
    req.logger.debug('looking for recent titles for user: ' + userUid);
    var jdsResource = '/vpr/all/find/document';
    var jdsQuery = {
        order: 'lastUpdateTime desc',
        filter: jdsFilter.build([
            ['eq', 'authorUid', userUid],
            ['eq', 'documentClass', 'PROGRESS NOTES']
        ])
    };
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
            if (err) {
                res.rdkSend(err);
            }
            try {
                data = JSON.parse(data);

                var recentTitles = [];
                if (data.data.items) {
                    for (var i = 0; i < data.data.items.length && recentTitles.length < 3; i++) {
                        var item = data.data.items[i];
                        var title = item.localTitle;
                        var duplicate = _.find(recentTitles, function(recentTitle) {
                            return recentTitle.localTitle === item.localTitle;
                        });
                        if (!duplicate) {
                            recentTitles.push({
                                localTitle: item.localTitle,
                                documentDefUid: item.documentDefUid
                            });
                        }
                    };
                }

                res.rdkSend({
                    data: {
                        items: recentTitles
                    }
                });
            } catch(e) {
                // do nothing, wasn't valid JSON
            }
            res.rdkSend(data);
        }
    );
}

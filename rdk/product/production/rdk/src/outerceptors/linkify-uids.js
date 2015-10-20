'use strict';

var _ = require('underscore');
var querystring = require('querystring');

module.exports = linkifyUids;
function linkifyUids(req, res, body, callback) {
    // bail early for now if there is no pid // TODO determine whether to accept no pid
    if(!req.param('pid')) {
        return callback(null, req, res, body);
    }
    var bodyIsObject = _.isObject(body);
    var responseObject;
    if(bodyIsObject) {
        responseObject = body;
    } else {
        try {
            responseObject = JSON.parse(body);
        } catch(err) {
            return callback(null, req, res, body);
        }
    }
    walkResponseTree(responseObject, req);
    if(bodyIsObject) {
        body = responseObject;
    } else {
        body = JSON.stringify(responseObject);
    }
    return callback(null, req, res, body);
}

function walkResponseTree(responseObject, req) {
    _.each(responseObject, function(value, key, context) {
        if(_.isObject(value)) {
            walkResponseTree(value, req);
        } else if(key === 'uid' && typeof value === 'string') {
            var pid = context.pid || req.param('pid') || 'BADPID';
            var uidHref = uidToLink(pid, value, req);
            if(uidHref) {
                context.uidHref = uidHref;
            }
        }
    });
}

var uidToLink = (function() {
    var uidsWithPids = [
        'accession', 'allergy', 'treatment', 'consult', 'procedure', 'obs', 'image', 'surgery', 'mh', 'immunization',
        'pov', 'skin', 'exam', 'cpt', 'education', 'factor', 'appointment', 'visit', 'rad', 'ptf', 'med', 'order',
        'document', 'vital', 'lab', 'problem', 'cpt', 'obs', 'encounter', 'procedure', 'allergy', 'immunization', 'mh',
        'roadtrip', 'auxiliary', 'pov', 'skin', 'diagnosis', 'ptf', 'exam', 'education', 'treatment'
    ];
    uidsWithPids = new RegExp('^urn:(?:\\w+:)*(?:' + uidsWithPids.join('|') + '):');
    return function(pid, uid, req) {
        var resources = req.app.resourceRegistry.getResources();
        var baseUrl = (req.app.config.externalProtocol || req.protocol) + '://' + req.get('Host');

        var uidHasPid = uidsWithPids.test(uid);
        if(uidHasPid) {
            return makeUidWithPidLink(pid, uid, resources, baseUrl, req.app.config.rootPath);
        } else {
            return null;
            // return makeUidWithoutPidLink(uid, resources, baseUrl);  // TODO decide how to handle uids without pids
        }
    };
})();

function makeUidWithPidLink(pid, uid, resources, baseUrl, rootPath) {
    // TODO add resource for optional pid, update uid resource title
    var path = _.findWhere(resources, {title: 'uid'}).path;
    var query = {};
    query.pid = pid;
    query.uid = uid;
    query = querystring.stringify(query);
    var link = baseUrl + rootPath + path + '?' + query;
    return link;
}

function makeUidWithoutPidLink(uid, resources, baseUrl) {
    var path = _.findWhere(resources, {title: 'uid'}).path;  // TODO verify uid-only resource title
    var query = {};
    query.uid = uid;
    var link = baseUrl + path + '?' + query;
    return link;
}

module.exports._uidToLink = uidToLink;
module.exports._makeUidWithPidLink = makeUidWithPidLink;
module.exports._makeUidWithoutPidLink = makeUidWithoutPidLink;
module.exports._walkResponseTree = walkResponseTree;

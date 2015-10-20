'use strict';

var vhaSites = require('./vha-sites.json').vhaSites;
var _ = require('underscore');

module.exports = addFacilityDisplay;
function addFacilityDisplay(req, res, body, callback) {
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
            return walkResponseTree(value, req);
        }
        if(key === 'facilityCode' && typeof value === 'string') {
            var facility;
            if(value === '500' && context.facilityName) {
                /*
                Our data got messed up and this is if block is a last-resort, temporary workaround if it doesn't get fixed soon.
                TODO: check if this is safe to remove after 2014-11-23
                 */
                facility = _.find(vhaSites, function(vhaSite) {
                    return vhaSite.name.toLowerCase() === context.facilityName.toLowerCase();
                });
                req.logger.warn('facilityDisplay: SITE CODE WORKAROUND CODE USED');
            } else {
                // Don't remove this else statement when removing the connected if block, of course
                facility = _.findWhere(vhaSites, {siteCode: value}) || _.findWhere(vhaSites, {moniker: value});
            }
            if(facility) {
                context.facilityDisplay = facility.name;
                context.facilityMoniker = facility.moniker;
            } else {
                context.facilityMoniker = value;
            }
        }
    });
}

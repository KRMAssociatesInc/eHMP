'use strict';

var _ = require('lodash');

module.exports.maskPtSelectSsn = maskPtSelectSsn;
module.exports.maskSsn = maskSsn;

function maskPtSelectSsn(jdsResponse) {
    var items = ((jdsResponse || {}).data || {}).items || [];
    _.each(items, function(item) {
        if(!item.ssn || typeof item.ssn !== 'string') {
            return;
        }
        var maskedSsn = maskSsn(item.ssn);
        item.ssn = maskedSsn;
    });
    return jdsResponse;
}

function maskSsn(ssn) {
    var last4 = /(.*)(.{4})/;
    var validSsn = ssn.match(last4);
    if(!validSsn) {
        return;
    }
    var maskedSsn = validSsn[1].replace(/[^-]/g, '*') + validSsn[2];
    return maskedSsn;
}

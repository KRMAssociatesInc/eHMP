'use strict';

require('../env-setup');

var uidUtil = require(global.VX_UTILS + 'uid-utils');
var pidUtil = require(global.VX_UTILS + 'patient-identifier-utils');
var timeUtil = require(global.VX_UTILS + 'time-utils');

var _ = require('underscore');


function metastampDomain(record, timestamp, icn) {
    var retValue;
    if (timeStampInvalid(timestamp)) {
        retValue = {
            error: 'Timestamp in incorrect format. Should be YYYYMMDDHHmmss'
        };

        return retValue;
    }

    if (!record || !record.data || !record.data.items) {
        retValue = {
            error: 'Could not find expected JSON structure .data.items[]'
        };

        return retValue;
    }

    var metastamp = timestamp || timeUtil.createStampTime();
    var stamp = getBlankMetastampRecord();
    stamp.icn = icn || null;
    stamp.stampTime = metastamp;

    _.each(record.data.items, function(recordItem) {
        var siteInfo;

        if (!recordItem.pid) {
            // console.log('Error: no PID found in domain record');
            return;
        }

        siteInfo = pidUtil.extractPiecesFromPid(recordItem.pid, ';');
        var domain = uidUtil.extractDomainFromUID(recordItem.uid);
        if (!stamp.sourceMetaStamp[siteInfo.site]) {
            stamp.sourceMetaStamp[siteInfo.site] = {
                pid: recordItem.pid,
                localId: siteInfo.dfn,
                stampTime: metastamp,
                domainMetaStamp: {}
            };

            if (!stamp.icn) {
                if (siteInfo.site === 'HDR' ||
                    siteInfo.site === 'VLER' ||
                    siteInfo.site === 'PGD') { //These sites use ICN as their pid
                    stamp.icn = stamp.icn || siteInfo.dfn;
                }
            }
        }

        var site = stamp.sourceMetaStamp[siteInfo.site];
        if (!site.domainMetaStamp[domain]) {
            // console.log('Adding domain '+ domain);
            site.domainMetaStamp[domain] = {
                domain: domain,
                stampTime: metastamp,
                eventMetaStamp: {}
            };
        }

        site.domainMetaStamp[domain].eventMetaStamp[recordItem.uid] = {
            'stampTime': metastamp
        };
    });

    //future functionality could add the ability to retrieve the ICN if none was provided or found
    return stamp;
}

function metastampOperational(record, timestamp, source) {
    if (timeStampInvalid(timestamp)) {
        return {
            error: 'Timestamp in incorrect format. Should be YYYYMMDDHHmmss.SSS'
        };
    }

    if (!record || !record.data || !record.data.items) {
        return {
            error: 'Could not find expected JSON structure .data.items[]'
        };
    }

    if (!timestamp && record.data.updated && record.data.updated.length === 14) { //timestamp doesn't include milliseconds
        timestamp = record.data.updated + '.000';
    }

    var metastamp = timestamp || timeUtil.createStampTime();
    var stamp = getBlankMetastampRecord();

    stamp.stampTime = metastamp;
    stamp.sourceMetaStamp[source] = {
        stampTime: metastamp
    };

    return stamp;
}


function timeStampInvalid(timestamp) {
    return timestamp && !/^\d{14}/.test(timestamp);
}

function getBlankMetastampRecord() {
    return {
        'stampTime': null,
        'sourceMetaStamp': {}
    };
}

module.exports.metastampDomain = metastampDomain;
module.exports.metastampOperational = metastampOperational;
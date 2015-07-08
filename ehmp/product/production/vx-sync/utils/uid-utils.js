'use strict';
var _ = require('underscore');
var domains = require('./domain');

var domainToUidTemplates = {};

//Generate domain uid templates from domain list
_.each(domains.getDomainList(), function(domainName){
    return (domainToUidTemplates[domainName] = 'urn:va:' + domainName + ':');
});

function getUidForDomain(domain, systemId, localPatientId, localId){
    if(_.isUndefined(domainToUidTemplates[domain])) {return null;}
    return domainToUidTemplates[domain] + systemId + ':' + localPatientId + ':' + localId;
}

function extractPiecesFromUID(uid, delimiter) {
    delimiter = delimiter || ':';
    var parts = uid.split(delimiter);
    var info = {};
    switch(parts.length) {
        case 6:
            info.localId = parts[5];
            /* falls through */
        case 5:
            info.patient = parts[4];
            /* falls through */
        case 4:
            info.site = parts[3];
            /* falls through */
        case 3:
            info.domain = parts[2];
            /* falls through */
        case 2:
            info.organization = parts[1];
            /* falls through */
        case 1:
            info.prefix = parts[0];
    }
    return info;
}

function extractDomainFromUID(uid, delimiter) {
    return extractPiecesFromUID(uid,delimiter).domain;
}

function extractSiteFromUID(uid, delimiter) {
    return extractPiecesFromUID(uid,delimiter).site;
}

function extractLocalIdFromUID(uid, delimiter) {
    return extractPiecesFromUID(uid,delimiter).localId;
}

function extractSiteHash(uid, delimiter) {
    delimiter = delimiter || ':';
    var parts = uid.split(':');
    var info = '';
    if (_.isArray(parts) && parts.length >= 4) {
        info = parts[3];
    }

    return info;
}

module.exports.getUidForDomain = getUidForDomain;
module.exports.extractPiecesFromUID = extractPiecesFromUID;
module.exports.extractDomainFromUID = extractDomainFromUID;
module.exports.extractSiteFromUID = extractSiteFromUID;
module.exports.extractLocalIdFromUID = extractLocalIdFromUID;
module.exports.extractSiteHash = extractSiteHash;
'use strict';

var VPR_UID_REGEX = /urn:va:.*:.*:.*:[0-9]*/;

var checkUid = function(uid) {
    if (!VPR_UID_REGEX.test(uid)) {
        throw new Error(uid + ' does not match the regular expression ' + VPR_UID_REGEX);
    }
};

/**
 *  Returns the domain of a VPR UID.
 *  @param uid A string in the format urn:va:<domain>:<siteUid>:<pid>:<ien>
 */
function getDomain(uid) {
    checkUid(uid);
    return uid.split(':')[2];
}

/**
 *  Returns the site UID of a VPR UID.
 *  See site uid description and documentation at https://wiki.vistacore.us/display/VACORE/VistA+Site+Identifier
 *  @param uid A string in the format urn:va:<domain>:<siteHash>:<pid>:<ien>
 */
function getSiteUid(uid) {
    checkUid(uid);
    return uid.split(':')[3];
}


/**
 *  Returns true if the uid contains the siteUid in the appopriate format.
 *  See site uid description and documentation at https://wiki.vistacore.us/display/VACORE/VistA+Site+Identifier
 *  @param uid A string in the format urn:va:<domain>:<siteHash>:<pid>:<ien>
 *  @param siteuid A string of the siteUid
 */
function fromSite(uid, siteUid) {
    return (siteUid === getSiteUid(uid));
}

module.exports.getDomain = getDomain;
module.exports.getSiteUid = getSiteUid;
module.exports.fromSite = fromSite;

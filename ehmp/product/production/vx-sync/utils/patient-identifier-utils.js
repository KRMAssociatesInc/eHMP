'use strict';

var _ = require('underscore');

var validators = {
    icn: isIcn,
    dfn: isPid,
    pid: isPid,
    dod: isDod,
    hdr: isHdr,
    das: isDas,
    vler: isVler
};

var validFormats = ['icn', 'dfn', 'pid', 'dod', 'das', 'vler', 'hdr'];

function create(type, value) {
    return {
        type: type,
        value: value
    };
}

function isIdFormatValid(types, value) {
    if(_.isEmpty(types)) {
        types = [];
    }

    if (!_.isArray(types)) {
        types = [types];
    }

    if (_.isEmpty(value)) {
        return false;
    }

    return _.some(types, function(type) {
        return _.contains(validFormats, type) && validators[type](value);
    });
}

function isIcn(id) {
    return !_.isEmpty(id) && /^[0-9a-zA-Z]+$/.test(id);
}

function isPid(id) {
    return !_.isEmpty(id) && /^[0-9a-fA-F]{4};[0-9]+$/.test(id);
}

function isDod(id) {
    return !_.isEmpty(id) && /^DOD;[0-9a-zA-Z]+$/.test(id);
}

function isHdr(id) {
    return !_.isEmpty(id) && /^HDR;[0-9a-zA-Z]+$/.test(id);
}

function isDas(id) {
    return !_.isEmpty(id) && /^DAS;[0-9a-zA-Z]+$/.test(id);
}

function isVler(id) {
    return !_.isEmpty(id) && /^VLER;[0-9a-zA-Z]+$/.test(id);
}

function isSecondarySite(id) {
    return (isDod(id) || (isHdr(id)) || (isDas(id)) || (isVler(id)));
}

function extractIdsOfTypes(patientIdentifiers, types) {
    if(_.isEmpty(types)) {
        types = [];
    }

    if (!_.isArray(types)) {
        types = [types];
    }

    return _.filter(patientIdentifiers, function(id) {
        return _.contains(types, id.type);
    });
}

function hasIdsOfTypes(patientIdentifiers, types) {
    if(_.isEmpty(types)) {
        types = [];
    }

    if (!_.isArray(types)) {
        types = [types];
    }

    return _.some(patientIdentifiers, function(id) {
        return _.contains(types, id.type);
    });
}

//------------------------------------------------------------------------------
// Return an array of patient identifiers where the pid is for the given site.
//------------------------------------------------------------------------------
function extractPidBySite(patientIdentifiers, site) {
    return  _.filter(patientIdentifiers, function(patientIdentifier) {
        if ((patientIdentifier) &&
            (patientIdentifier.type === 'pid') &&
            (new RegExp('^' + site).test(patientIdentifier.value))) {
            return true;
        }
        else {
            return false;
        }
    });
}

function extractPiecesFromPid(pid) {
    if(_.isEmpty(pid)) {
        return {
            site: null,
            dfn: null
        };
    }

    var delimiter = ';';

    if(!_.contains(pid, delimiter)) {
        return {
            site: null,
            dfn: pid
        };
    }

    var pieces = pid.split(delimiter);

    return {
        site: _.isEmpty(pieces[0]) ? null : pieces[0],
        dfn: _.isEmpty(pieces[1]) ? null : pieces[1],
    };
}

function extractDfnFromPid(pid) {
    return extractPiecesFromPid(pid).dfn;
}

function extractIcnFromPid(pid) {
    return extractPiecesFromPid(pid).dfn;
}

function extractSiteFromPid(pid) {
    return extractPiecesFromPid(pid).site;
}

function extractPidFromJob(job) {
    var pid = '';
    if ((job) &&
        (job.patientIdentifier) &&
        (job.patientIdentifier.type === 'pid') &&
        (job.patientIdentifier.value)) {
            pid = job.patientIdentifier.value;
    }
    return pid;
}

//----------------------------------------------------------------------------------------
// This method returns true if the Patient Identifier represents an identifier at a
// secondary site.
//
// patientIdentifier: The patient identifier for a patient.
//----------------------------------------------------------------------------------------
function isSecondarySitePid(patientIdentifier) {
    if (!patientIdentifier) {
        return false;
    }

    if (patientIdentifier.type !== 'pid') {
        return false;
    }

    if (/^DOD;|^HDR;|^VLER;|^DAS;/.test(patientIdentifier.value)) {
        return true;
    }

    return false;
}

//----------------------------------------------------------------------------------------
// This method returns true if the Patient Identifier represents an identifier at a
// Vista site.
//
// patientIdentifier: The patient identifier for a patient.
//----------------------------------------------------------------------------------------
function isVistaSitePid(patientIdentifier) {
    if (!patientIdentifier) {
        return false;
    }

    if (patientIdentifier.type !== 'pid') {
        return false;
    }

    return (!isSecondarySitePid(patientIdentifier));
}

module.exports.create = create;
module.exports.isIdFormatValid = isIdFormatValid;
module.exports.isIcn = isIcn;
module.exports.isPid = isPid;
module.exports.isDod = isDod;
module.exports.isHdr = isHdr;
module.exports.isDas = isDas;
module.exports.isVler = isVler;
module.exports.isSecondarySite = isSecondarySite;
module.exports.extractIdsOfTypes = extractIdsOfTypes;
module.exports.hasIdsOfTypes = hasIdsOfTypes;
module.exports.extractPiecesFromPid = extractPiecesFromPid;
module.exports.extractSiteFromPid = extractSiteFromPid;
module.exports.extractDfnFromPid = extractDfnFromPid;
module.exports.extractIcnFromPid = extractIcnFromPid;
module.exports.extractPidFromJob = extractPidFromJob;
module.exports.extractPidBySite = extractPidBySite;
module.exports.isSecondarySitePid = isSecondarySitePid;
module.exports.isVistaSitePid = isVistaSitePid;
module.exports.validFormats = _.clone(validFormats);

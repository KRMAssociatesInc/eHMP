'use strict';

/*
    TODO: might not need this if RPC wrapper returns the status name
    All status names are from CPRS source codes except default
 */
function getStatusName(status) {
    switch (status) {
        case 0:
            return 'ERROR';
        case 1:
            return 'DISCONTINUED';
        case 2:
            return 'COMPLETE';
        case 3:
            return 'HOLD';
        case 4:
            return 'FLAGGED';
        case 5:
            return 'PENDING';
        case 6:
            return 'ACTIVE';
        case 7:
            return 'EXPIRED';
        case 8:
            return 'SCHEDULED';
        case 9:
            return 'PARTIAL RESULTS';
        case 10:
            return 'DELAYED';
        case 11:
            return 'UNRELEASED';
        case 12:
            return 'DC/EDIT';
        case 13:
            return 'CANCELLED';
        case 14:
            return 'LAPSED';
        case 15:
            return 'RENEWED';
        case 97:
            return '';
        case 98:
            return 'NEW';
        case 99:
            return 'NO STATUS';
        default:
            return 'UNDEFINED';
    }
}

/**
 * Returns a formatted date/time string given a FileMan date/time string
 *
 * @param fileManDate FileMan date/time string
 * @return The formatted date/time corresponding to fileManDate
 */
function convertFileManDateToString(fileManDate) {
    var year = Math.floor(fileManDate/1e4)+1700,
        month = ('0' + Math.floor((fileManDate%1e4)/1e2)).slice(-2),
        day = ('0' + Math.floor((fileManDate%1e2))).slice(-2),
        hour = ('0' + Math.floor((fileManDate*1e2)%1e2)).slice(-2),
        min = ('0' + Math.floor((fileManDate*1e4)%1e2)).slice(-2);
    return '' + month + '/' + day + '/' + year + ' ' + hour + ':' + min;
}

module.exports.getStatusName = getStatusName;
module.exports.convertFileManDateToString = convertFileManDateToString;

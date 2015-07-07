'use strict';

/**
 * Class for parsing and formatting VA FileMan Dates and Date/Times. <p/> FileMan stores dates and date/times of the
 * form "YYYMMDD.HHMMSS", where: <ul> <li>YYY is number of years since 1700 (hence always 3 digits)</li> <li>MM is month
 * number (00-12)</li> <li>DD is day number (00-31)</li> <li>HH is hour number (00-23)</li> <li>MM is minute number
 * (01-59)</li> <li>SS is the seconds number (01-59)</li> </ul> <p>This format allows for representation of imprecise
 * dates like JULY '78 or 1978 (which would be equivalent to 2780700 and 2780000, respectively). Dates are always
 * returned as a canonic number (no trailing zeroes after the decimal).  This implies that if there are any digits after
 * the decimal we are dealing with an implicitly precise date/time with millisecond precision.</p>
 */

var YEARS_PER_CENTURY = 100;
var BASE_CENTURY = 17;

/**
 * Returns a VPR formated date/time string given a FileMan date/time string
 *
 * @param fmDate FileMan date/time string
 * @return The VPR formatted date/time corresponding to fmDate
 */
function getVprDateTime(fmDate) {
    var fmYear = Math.floor(fmDate/1e4)+1700,
        fmMonth = ('0' + Math.floor((fmDate%1e4)/1e2)).slice(-2),
        fmDay = ('0' + Math.floor((fmDate%1e2))).slice(-2),
        fmHour = ('0' + Math.floor((fmDate*1e2)%1e2)).slice(-2),
        fmMin = ('0' + Math.floor((fmDate*1e4)%1e2)).slice(-2),
        fmSec = ('0' + Math.floor((fmDate*1e6)%1e2)).slice(-2);

        return '' + fmYear + fmMonth + fmDay + fmHour + fmMin + fmSec;
}

/**
 *  Returns the three digit year as a number given a numerical date
 *
 *  @param year Numerical representation of a year
 *  @return The three digit year as a number
 */
function getThreeDigitYear(year) {
    if (isNaN(year)) {
        return -1;
    }

    if (year < 0) {
        year = year * -1;
    }

    var century = Math.floor(year / YEARS_PER_CENTURY);
    century -= BASE_CENTURY;
    century *= YEARS_PER_CENTURY;
    return century + (year % YEARS_PER_CENTURY);
}

/**
 *  Returns a string date and time in fileman format given a date object
 *
 *  @param date A date object to be converted to a fileman formatted date and time
 *  @return A string representation of a date and time in fileman format
 */
function getFilemanDateTime(date) {
    var filemanDate = getFilemanDate(date);

    if (filemanDate === -1) {
        return -1;
    }

    return filemanDate + '.' + ('0' + date.getHours()).slice(-2) + ('0' + date.getMinutes()).slice(-2);
}

/**
 *  Returns a string date in fileman format given a date object
 *
 *  @param date A date object to be converted to a fileman formatted date
 *  @return A string representation of a date in fileman format
 */
function getFilemanDate(date) {
    var threeDigitYear = getThreeDigitYear(date.getFullYear());

    if (threeDigitYear === -1) {
        return -1;
    }

    return threeDigitYear.toString() + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2);
}

/**
 *  Returns a string date in fileman format given a date string in the format of YYYYMMDD
 *
 *  @param dateAsString A string date in the format of YYYYMMDD
 *  @return A string representation of a date in fileman format
 */
function getFilemanDateWithArgAsStr(dateAsString) {
    var year = dateAsString.toString().slice(0, 4);
    var monthDate = dateAsString.toString().slice(4, 8);
    var threeDigitYear = getThreeDigitYear(parseInt(year));

    if (threeDigitYear === -1) {
        return -1;
    }

    return threeDigitYear.toString() + monthDate;
}

module.exports.getThreeDigitYear = getThreeDigitYear;
module.exports.getFilemanDateTime = getFilemanDateTime;
module.exports.getFilemanDate = getFilemanDate;
module.exports.getFilemanDateWithArgAsStr = getFilemanDateWithArgAsStr;
module.exports.getVprDateTime = getVprDateTime;

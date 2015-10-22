'use strict';
/*global describe, it, before, beforeEach, after, afterEach, spyOn, expect, runs, waitsFor */


require('../../../env-setup');
var log = require(global.OSYNC_UTILS + 'dummy-logger');
var filemanDateUtil = require(global.OSYNC_UTILS + 'filemanDateUtil');
var moment = require('moment');
var _ = require('lodash');

/**
 * logs an error and then throws the Exception using the errorMsg provided<br/>
 * This was created so there was a central point where I could enable/disable logging to the console quickly.
 *
 * @param errorMsg The message you want to have logged and the contents of the exception thrown.
 */
function throwError(errorMsg) {
    console.log("ERROR: " + errorMsg); //Since logger won't print to console, do it here
    log.error("ERROR: " + errorMsg);
    throw errorMsg;
}

/**
 * to convert external to fm subtract 17,000,000<br/><br/>
 * Example, if your date = 20130101<br/>
 * X = 20130101 - 17000000<br/>
 * X = 3130101
 *
 * @param date A String containing the date to convert to fileman format.
 */
function toFilemanFromString(date) {
    if (!_.isString(date))
        throwError("The function toFileman requires a date to be in String format");
    if (date.match(/[0-9][0-9][0-9][0-9][0-9][0-9][0-9][0-9]/) === null)
        throwError("The function toFileman requires the String to be in the format yyyyMMdd");
    return (Number(date) - 17000000).toString();
}

/**
 * to convert external to fm subtract 17,000,000<br/><br/>
 * Example, if your date = 20130101<br/>
 * X = 20130101 - 17000000<br/>
 * X = 3130101
 *
 * @param date A String containing the date to convert to fileman format.
 */
function toFilemanFromDate(date) {
    if (!moment(date).isValid())
        throwError("The function toFilemanFromDate requires a valid date");

    var datestr = moment(date).format("YYYYMMDD");
    var retvalue = toFilemanFromString(datestr);
    return retvalue;
}

/**
 * to convert fm to external add 17,000,000<br/><br/>
 * Example, if your fileman date = 3130101, and you want to convert that to a normal date of 20130101<br/>
 * X = 3130101 + 17000000<br/>
 * X = 20130101
 *
 * @param filemanDate
 */
function fromFilemanFromString(filemanDate) {
    if (!_.isString(filemanDate))
        throwError("The function fromFileman requires a date to be in String format");
    if (filemanDate.match(/^(\d+)$/) === null)
        throwError("The function fromFileman requires the String be in fileman format");
    return (Number(filemanDate) + 17000000).toString();
}


describe('unit test to validate filemanTime works correctly', function() {
    beforeEach(function() {
    });

    //it("should throw an error when bad data is passed in.", function () {
    //    runs(function () {
    //        verifyGetFilemanDate(null, "The function toFileman requires a date to be in String format");
    //        verifyGetFilemanDate("ABCDEFGH", "The function toFileman requires the String to be in the format yyyyMMdd");
    //    });
    //});

    it("should succeed when good data is passed in.", function () {
        runs(function () {
            var dt = moment('20130101', 'YYYYMMDD');
            var expected = toFilemanFromDate(dt);
            dt = filemanDateUtil.getFilemanDate(dt.toDate());
            expect(dt).toBe('3130101');

            expect(dt).toBe(expected);

            //NOTE: The algorithms above are for converting to and from fileman format and are much simpler than what
            //filemanDateUtil is doing.  They are included here in case we need to switch to them later.
            //They were also in a file called filemanTime (which should have been called filemanDate).
        });
    });
});


/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';


/*
 **  Helper to format phone numbers consistently across the app
 **  uses libphonenumber: https://github.com/googlei18n/libphonenumber
 **
 **  @number - phone number to transform
 **  @defaultVal - string to return when @number isn't defined.
 **
 **  @return - number in format of (555) 555-5555{ ext. 5555} ||
                returns the number given if it couldn't format it
 */
define(['handlebars', 'libphonenumber'], function(Handlebars, libphone) {
    function formatPhone(number, defaultVal) {
        if (!number) {
            return defaultVal instanceof Object ? '' : defaultVal;
        }

        var phoneUtil = libphone.PhoneNumberUtil.getInstance(),
        retval = number,
        libNumber;

        try {
            libNumber = phoneUtil.parseAndKeepRawInput(number, 'us')
            retval = phoneUtil.formatInOriginalFormat(libNumber, 'us');
        } catch(e) {
            // Couldn't format, return the input.
        }
        return retval;
    }

    Handlebars.registerHelper('formatPhone', formatPhone);
    return formatPhone;
});
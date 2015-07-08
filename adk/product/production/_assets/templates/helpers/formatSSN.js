/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function formatSSN(SSN, mask) {

        if($.isPlainObject(mask))
        {
            mask = true;
        }

        if (SSN) {
            var returnSSN = SSN;
            if(SSN.length == 9 || SSN.length == 11)
            {
                returnSSN = SSN.replace('-', '');
                if(mask) {
                    returnSSN = '***-**-'.concat(returnSSN.substring(5));
                }
                else
                {
                    returnSSN = returnSSN.substring(0, 3).concat('-').concat(returnSSN.substring(3,5)).concat('-').concat(returnSSN.substring(5));
                }
            }
            return returnSSN;
        } else {
            return '';
        }

    };

    Handlebars.registerHelper('formatSSN', formatSSN);
    return formatSSN;
});
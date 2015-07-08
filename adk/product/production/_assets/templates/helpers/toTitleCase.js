/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';


/*
 **  helper to capitalize only the first letter and
 **  the first letter after a comma (if applicable)
 **
 **  @nameString - string to transform
 **  @addSpace   - boolean; if true, will make sure there is a
 **                 single space between a comma and next char.
 **  @defaultVal - string to return when @nameString isn't defined.
 */
define(['handlebars'], function(Handlebars) {
    function toTitleCase(nameString, addSpace, defaultVal) {
        if (!nameString) {
            return defaultVal || '';
        }

        var retVal = '',
            nameArr = [];
        nameString = nameString.toLowerCase();
        nameArr = nameString.split(' ');

        _.each(nameArr, function(str, index, list) {
            str = transform(str, addSpace);
            if (index > 0) {
                retVal += ' ' + str;
            } else {
                retVal = str;
            }
        });
        return retVal;
    }

    function transform(str, addSpace) {
        var commaIndex = str.indexOf(',');
        str = str.charAt(0).toUpperCase() + str.substr(1);
        if (addSpace && commaIndex != -1 && str.length > (commaIndex + 1) && str.charAt(commaIndex + 1) != ' ') {
            str = str.replace(',', ', ');
            if (str.length > (commaIndex + 2)) {
                var str2 = str.substr(commaIndex + 2);
                return str.substring(0, commaIndex + 2) + transform(str2, addSpace);
            }
        }
        return str;
    }

    Handlebars.registerHelper('toTitleCase', toTitleCase);
    return toTitleCase;
});
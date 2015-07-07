/*jslint node: true, nomen: true, unparam: true */
/*global moment, jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars', 'moment'], function(Handlebars, moment) {
    function formatName(nameString, character, replaceCharacter) {

        if (nameString && character) {
            if (replaceCharacter){
                return nameString.replace(character, replaceCharacter);
            }
            return nameString.replace(character, character+' ');
        } else {
            return '';
        }

    };

    Handlebars.registerHelper('formatName', formatName);
    return formatName;
});
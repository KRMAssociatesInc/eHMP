'use strict';

define(['handlebars'], function(Handlebars) {
    function ifnull(value, defaultValue) {

        if (value) {
            return value;
        } else {
            return defaultValue;
        }
    }

    Handlebars.registerHelper('ifnull', ifnull);
    return ifnull;
});
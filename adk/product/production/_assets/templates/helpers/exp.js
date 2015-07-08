/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

define(['handlebars'], function (Handlebars) {
    function exp(v1, operator, v2, options) {
        /* jslint validthis: true */
        // Assume it's a string for simplicity.
        switch (operator) {
            case '+':
                return (v1 + v2);
            case '-':
                return (v1 - v2);
            case '/':
                return (v1 / v2);
            case '*':
                return (v1 * v2);
            default:
                return 'UNKNOWN OPERATOR!';
        }
    }

    Handlebars.registerHelper('exp', exp);
    return exp;
});

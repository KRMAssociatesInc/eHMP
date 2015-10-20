define([
    'backbone',
    'marionette',
    'underscore'
], function(Backbone, Marionette, _) {
    "use strict";

    var Util = {};

    Util.getProblemText = function(response) {
        if (response.problem) {
            response.problemText = response.problem;
            if (response.icd) {
                response.problemText += " (ICD-10-CM " + response.icd + ")";
            }

        }
        return response;
    };

    Util.getProblem = function(response) {

        if (response === 'No data') {
            response = {
                problem: 'Invalid'
            };
        } else if (!response.problem) {
            response.problem = 'Invalid';

            /* uncomment for testing
            if (response.snomed) {
                response.problem += " (" + response.snomed + ")";
            }
            */

        }
        return response;
    };

    return Util;
});

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
            if (response.icd9) {
                response.problemText += " (ICD-9-CM " + response.icd9 + ")";
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

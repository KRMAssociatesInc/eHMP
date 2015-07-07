define([
    'underscore',
    'backbone',
], function(_, Backbone) {
    'use strict';

    var MAX_PROBLEM_DISPLAY_LENGTH = 45;

    var ProblemUtil = {
        addProblemAssociation: function(collection, problemModel) {
            if (problemModel) {
                console.log('adding problem ' + problemModel.get('problem'));
                collection.add(problemModel);
            }
        },
        removeProblemAssociation: function(collection, problemModel) {
            if (problemModel) {
                console.log('removing problem ' + problemModel.get('problem'));
                collection.remove(problemModel);
            }
        },
        findProblemBySnomedCt: function(collection, snomed) {
            console.log("looking for match for snomed '" + snomed + "' in collection with " + collection.models.length + " models");
            var matches = collection.where({ snomed: snomed });
            return matches.length > 0 ? matches[0] : null;
        },
        queryGlobalProblems: function(queryString, onSuccess, onError) {
            ADK.ResourceService.fetchCollection({
                cache: true,
                pageable: false,
                resourceTitle: 'problems-getProblems',
                criteria: {
                    searchfor: queryString
                },
                collectionConfig: {
                    collectionParse: function(collection) {
                        console.log("parsing collection");
                        var models = collection.models;
                        if (collection.size() === 1) {
                            // When there are no results, the endpoint returns "No data" instead of an empty result set
                            // That results in a collection containing a single model with the attributes: { 0: 'N', 1: 'o', 2: 'D', 3: 'a', 4: 't', 5: 'a' }
                            // We want to return an empty collection instead of that
                            var model = collection.models[0];
                            if (model.get('0') === 'N' && model.get('1') === 'o') {
                                models = [];
                            }
                        }
                        return models;
                    }
                },
                onSuccess: onSuccess,
                onError: onError
            });
        }
    };

    return ProblemUtil;
});

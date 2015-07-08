define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    var dischargeUtils = {
        // return true if the activityGroup or any activity properties contain the docId value
        hasDocIdRecord: function (activityGroup, docId) {
            var isDocIdRecord = false;
            if(activityGroup && docId) {
                _.each(activityGroup, function(activity) {
                    var vals = _.values(activity);
                    if(_.contains(vals, docId)) {
                        isDocIdRecord = true;
                        return isDocIdRecord;
                    }
                });
                return isDocIdRecord;
            }
            return isDocIdRecord;
        },

        getViewModel: function(filterDocId) {
            var viewModel = {
                parse: function(response) {
                    if(!response.activity || !hasDocIdRecord(response.activity, filterDocId)) {
                        return;
                    }
                    consultModel.set(response);
                    return response;
                }
            };
            return viewModel;
        },

        getSummaryModelText: function(summaryModel) {
            var obj = summaryModel.get('text');
            var text = obj && _.pluck(obj, 'content');
            return text && text.length && text[0];
        }
    };

    return dischargeUtils;


});

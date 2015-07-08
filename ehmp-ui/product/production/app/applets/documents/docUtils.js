define([
    "backbone",
    "marionette",
    "underscore"
], function(Backbone, Marionette, _) {

    function synced() {
        if (this.callback)
            this.callback(this.allDocs);
    }

    var docUtils = {
        // return true if the arrayGroup or any properties contain the docId value
        hasDocIdRecord: function(aGroup, docId) {
            var isDocIdRecord = false;
            if (aGroup && docId) {
                _.each(aGroup, function(item) {
                    var vals = _.values(item);
                    if (_.contains(vals, docId)) {
                        isDocIdRecord = true;
                        return isDocIdRecord;
                    }
                });
                return isDocIdRecord;
            }
            return isDocIdRecord;
        },

        getSummaryModelText: function(summaryModel) {
            var obj = summaryModel.get('text');
            var text = obj && _.pluck(obj, 'content');
            return text && text.length && text[0];
        },

        getDocModelFromUid: function(uid, callback) {
            var model = new Backbone.Model();
            if (!uid || !callback || !_.isFunction(callback)) {
                return model;
            }
            this.callback = callback;
            var fetchOptions = {};
            fetchOptions.pid = ADK.PatientRecordService.getCurrentPatient();
            fetchOptions.uid = uid;
            fetchOptions.criteria = {
                uid: uid
            };
            fetchOptions.resourceTitle = 'uid';
            this.allDocs = ADK.PatientRecordService.fetchCollection(fetchOptions);
            this.allDocs.on('sync', synced, this);
        }
    };

    return docUtils;
});

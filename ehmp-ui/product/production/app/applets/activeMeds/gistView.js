define([
    "app/applets/activeMeds/gistConfig",
    "app/applets/activeMeds/medicationCollectionHandler",
], function(GistConfig, CollectionHandler) {

    var GistView = ADK.AppletViews.InterventionsGistView.extend({
        initialize: function(options) {
            var self = this;
            this._super = ADK.AppletViews.InterventionsGistView.prototype;
            var patientType= ADK.PatientRecordService.getCurrentPatient().attributes.patientStatusClass;

            GistConfig.fetchOptions.onSuccess = function() {
                self.appletOptions.collection.reset(self.appletOptions.collection.models);
            };
            this.appletOptions = {
                filterFields: GistConfig.filterFields,
                gistModel: GistConfig.gistModel,
                collection: CollectionHandler.fetchMedsCollection(GistConfig.fetchOptions, patientType, 'gist'),
                collectionParser: GistConfig.transformCollection,
                gistHeaders: GistConfig.gistHeaders,
                onClickRow: function(model, event) {
                    var uid = model.get('uid');
                    var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    ADK.Messaging.getChannel("activeMeds").trigger('detailView', {
                        uid: uid,
                        patient: {
                            icn: currentPatient.attributes.icn,
                            pid: currentPatient.attributes.pid
                        }
                    });
                }
            };
            this._super.initialize.apply(this, arguments);
        }
    });

    return GistView;
});

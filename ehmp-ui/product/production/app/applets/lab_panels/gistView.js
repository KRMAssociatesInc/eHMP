define([
    "app/applets/lab_panels/gistConfig"
], function(GistConfig) {

    var GistView = ADK.AppletViews.PanelsGistView.extend({
        initialize: function(options) {
            var self = this;
            this._super = ADK.AppletViews.PanelsGistView.prototype;
            this.appletOptions = {
                filterFields: GistConfig.filterFields,
                gistModel: GistConfig.gistModel,
                collection: ADK.PatientRecordService.fetchCollection(GistConfig.fetchOptions),
                collectionParser: GistConfig.transformCollection,
                gistHeaders: GistConfig.gistHeaders,
                onClickRow: function(model, event) {
                    var uid = model.get('uid');
                    var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                    ADK.Messaging.getChannel("lab_panels").trigger('detailView', {
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

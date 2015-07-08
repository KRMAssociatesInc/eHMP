define([
        "app/applets/vitals/gistConfig",
        "app/applets/vitals/vitalsCollectionHandler",
    ],
    function(GistConfig, CollectionHandler) {

        var GistView = ADK.AppletViews.ObservationsGistView.extend({
            initialize: function(options) {
                var self = this;
                this._super = ADK.AppletViews.ObservationsGistView.prototype;
                var patientType = ADK.PatientRecordService.getCurrentPatient().attributes.patientStatusClass;

                GistConfig.fetchOptions.onSuccess = function() {
                    self.appletOptions.collection.reset(self.appletOptions.collection.models);
                };
                this.appletOptions = {
                    filterFields: GistConfig.filterFields,
                    gistModel: GistConfig.gistModel,
                    collection: CollectionHandler.fetchVitalsCollection(GistConfig.fetchOptions, patientType, 'gist'),
                    collectionParser: GistConfig.transformCollection,
                    gistHeaders: GistConfig.gistHeaders,
                    onClickRow: function(model, event) {
                        var uid = model.get('uid');
                        var currentPatient = ADK.PatientRecordService.getCurrentPatient();
                        ADK.Messaging.getChannel("vitals").trigger('getDetailView', {
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
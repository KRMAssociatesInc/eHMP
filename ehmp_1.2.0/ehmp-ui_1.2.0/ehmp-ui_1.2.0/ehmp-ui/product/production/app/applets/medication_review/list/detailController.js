define([
    "backbone",
    "marionette",
    "app/applets/medication_review/list/medicationView",
    "app/applets/medication_review/medicationCollectionHandler",
    "hbs!app/applets/medication_review/list/detailTemplate",
    "app/applets/medication_review/appletHelper"
], function(Backbone, Marionette, MedicationView, MedicationCollectionHandler, detailTemplate, AppletHelper) {

    var ExternalDetailView = MedicationView.extend({
        template: detailTemplate
    });

    var medicationViewModel = {
        defaults: {
            "fillsAllowed": "Unk"
        },
        parse: function(response) {
            return AppletHelper.parseMedResponse(response);
        }
    };

    function getMatchingMeds(params, medModel) {
        // get 'groupby' field
        var groupbyData = AppletHelper.getMedicationGroupbyData(medModel),
            filter = 'eq(' + groupbyData.groupbyField + ',"' + groupbyData.groupbyValue + '")',
            deferredResponse = $.Deferred();

        if (groupbyData.groupbyField === 'name') {
            filter = 'ilike(name,"' + groupbyData.groupbyValue + '%")';
        }
        console.log("groupby filter = " + filter);

        // Request other med records that match groupby field
        // This is so we can display the order history in the detail view
        var fetchOptions = {
            cache: true,
            criteria: {
                filter: filter
            },
            resourceTitle: 'patient-record-med',
            viewModel: medicationViewModel
        };

        fetchOptions.onSuccess = function(collection, resp) {
            deferredResponse.resolve(collection);
        };

        ADK.PatientRecordService.fetchCollection(fetchOptions);

        return deferredResponse.promise();
    }

    var detailController = {

        // expose detail view through messaging
        initialize: function(appletId) {
            var channel = ADK.Messaging.getChannel(appletId);

            channel.reply('detailView', function(params) {

                var deferredResponse = $.Deferred();

                // Get the model for the requested medication
                var fetchOptions = {
                    cache: true,
                    criteria: {
                        "uid": params.uid
                    },
                    resourceTitle: 'patient-record-med',
                    viewModel: medicationViewModel,
                };

                // Once we have the model for this med, get all others that match it
                fetchOptions.onSuccess = function(collection, resp) {
                    var matchingMedsDeferredResponse = getMatchingMeds(params, collection.models[0]);

                    matchingMedsDeferredResponse.done(function(matchingMedsCollection) {

                        // Now that we have the set of meds for the detail, generate the view
                        var detailView = new ExternalDetailView({
                            model: new Backbone.Model({
                                meds: matchingMedsCollection
                            })
                        });
                        deferredResponse.resolve({
                            view: detailView,
                            title: "Medication - " + collection.first().get("name")
                        });
                    });
                };

                ADK.PatientRecordService.fetchCollection(fetchOptions);

                return deferredResponse.promise();
            });
        }
    };

    return detailController;
});

define([
    "backbone",
    "marionette",
    "app/applets/medication_review_v2/views/medicationDetailView",
    "app/applets/medication_review_v2/medicationCollectionHandler",
    "hbs!app/applets/medication_review_v2/templates/detailTemplate",
    "app/applets/medication_review_v2/appletHelper",
    "app/applets/medication_review_v2/medicationCollectionFormatHelper"
], function(Backbone, Marionette, MedicationView, MedicationCollectionHandler, detailTemplate, AppletHelper, MedicationCollectionFormatHelper) {

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
            resourceTitle: 'patient-record-med',
            viewModel: medicationViewModel
        };

        fetchOptions.onSuccess = function(collection, resp) {
            var filteredItems = _.filter(collection.models, function(model) {
                return medModel.get('groupbyValue') === model.get('groupbyValue');
            });
            collection.reset(filteredItems);
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
                        var groupedCollection = matchingMedsCollection.clone();
                        groupedCollection.reset(MedicationCollectionFormatHelper.removeDuplicateMedsIfPresent(groupedCollection.models));
                        var hasOverlappingMeds = MedicationCollectionFormatHelper.hasOverLappingMeds(groupedCollection.models);
                        var groupedModels = MedicationCollectionFormatHelper.groupByFacility(groupedCollection, hasOverlappingMeds);

                        groupedCollection.reset(groupedModels);
                        console.log(groupedModels);
                        var detailView = new ExternalDetailView({
                            model: new Backbone.Model({
                                meds: matchingMedsCollection
                            })
                        });
                        deferredResponse.resolve({
                            view: detailView,
                            title: "Medication - " + collection.first().get("name"),
                            groupedMeds: groupedCollection
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
define([
    "backbone",
    "underscore",
    "app/applets/newsfeed/newsfeedUtils",
    "app/applets/newsfeed/eventHandlers"

], function(Backbone, _, newsfeedUtils, EventHandlers) {

    function resetCollection(collection) {
        var filteredModels = _.filter(collection.fullCollection.models, function (model) {
            return EventHandlers.isValidDate(model.toJSON());
        }, this);

        var newFilteredModels = _.sortBy(filteredModels, function (model) {
            return model.get('activityDateTime').slice(0, 8) * -1;
        }, this);

        collection.fullCollection.reset(newFilteredModels);
    }

    var CollectionHandler = {
        queryCollection: function(context, dateModel, existingCollection) {

            var options = {};
            if (dateModel !== undefined) {
                options.isOverrideGlobalDate = true;
                options.fromDate = dateModel.from;
                options.toDate = dateModel.to;
            }

           // console.log("NF queryCollection call--------->>");
            var fetchOptions = {
                cache: false,
                criteria: {
                    filter: 'or('+context.buildJdsDateFilter('dateTime', options)+','+context.buildJdsDateFilter('administeredDateTime', options)+','+context.buildJdsDateFilter('observed', options)+')',
                    order: 'activityDateTime DESC'
                },
                onSuccess: resetCollection,
                pageable: true,
                resourceTitle : 'patient-record-timeline',
                viewModel :  {
                    parse: function(response) {
                        response.primaryProviderDisplay = newsfeedUtils.getPrimaryProviderDisplay(response);
                        response.displayType = newsfeedUtils.getDisplayType(response);

                        //exists to assist with filtering
                        var activityDateTimeMoment = moment(response.activityDateTime, "YYYYMMDDHHmmss");
                        response.activityDateTimeByIso = activityDateTimeMoment.format("YYYY-MM-DD HH:mm");
                        response.activityDateTimeByIsoWithSlashes = activityDateTimeMoment.format("YYYY/MM/DD HH:mm");

                        response.isFuture = activityDateTimeMoment.isAfter(moment());

                        if (response.kind.toLowerCase() === 'procedure') {
                            response.displayName = response.name || response.typeName || response.summary || "Unknown";
                        }
                        return response;
                    }
                }
            };
            ADK.PatientRecordService.fetchCollection(fetchOptions, existingCollection);
        }
    };

    _.extend(CollectionHandler, Backbone.Events);

    return CollectionHandler;
});

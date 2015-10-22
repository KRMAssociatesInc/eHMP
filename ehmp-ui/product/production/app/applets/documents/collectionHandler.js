define([
    "backbone",
    "underscore",
    "app/applets/documents/appletHelper"
], function(Backbone, _, AppletHelper) {

    function processCollection(collection) {
        //this should get stripped out when server sorting works. To do that
        //we need a common date field across every record (referenceDateTime is created after the data is loaded
        //into the applet.
        collection.fullCollection.comparator = function(left, right) {
            var l=left.get('referenceDateTime'), r=right.get('referenceDateTime');
            if(l === r) {
                return 0;
            }
            else if(l < r) return 1;
            else return -1;
        };
        collection.fullCollection.sort();

        this.trigger("resetCollection", collection);
    }

    var CollectionHandler = {
        queryCollection: function(context, existingCollection) {
            console.log('documents queryCollection');
            var self = this;
            var fetchOptions = {
                cache: false,
                pageable: true,
                collectionConfig: {},
                resourceTitle: 'patient-record-document-view',
                viewModel: {
                    parse: function(response) {
                        return AppletHelper.parseDocResponse(response);
                    }
                },
                criteria:{
                    filter: 'or(' + context.buildJdsDateFilter('referenceDateTime') + ',' + context.buildJdsDateFilter('dateTime') + '),' +
                        'not(and(in(kind,["Consult","Imaging","Procedure"]),ne(statusName,"COMPLETE")))' //fill out incomplete consults, images and procedures.

                },
                onSuccess: _.bind(processCollection, this)
            };

            ADK.PatientRecordService.fetchCollection(fetchOptions, existingCollection);
        }
    };

    _.extend(CollectionHandler, Backbone.Events);

    return CollectionHandler;
});

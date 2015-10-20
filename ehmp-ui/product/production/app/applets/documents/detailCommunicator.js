define([
    'app/applets/documents/appletHelper',
    'app/applets/documents/docDetailsDisplayer',
    'app/applets/documents/debugFlag'
], function(AppletHelper, DocDetailsDisplayer, DEBUG) {

    var detailCommunicator = {

        initialize: function(appletId) {

            // expose detail view through messaging
            var channel = ADK.Messaging.getChannel(appletId);
            channel.reply('detailView', function(params) {

                var pid = params.patient.icn || params.patient.pid;
                var response = $.Deferred();

                var fetchOptions = {
                    criteria: {
                        filter: 'or(eq("uid","' + params.uid + '"),eq("results[].uid","' + params.uid + '"))'
                    },
                    patient: new Backbone.Model({
                        icn: params.patient.icn,
                        pid: params.patient.pid
                    }),
                    resourceTitle: 'patient-record-document-view',
                    viewModel: {
                        parse: AppletHelper.parseDocResponse
                    },
                    cache: true
                };

                var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
                data.on('sync', function() {
                    var detailModel = data.first();
                    if (detailModel) {
                        var docType = detailModel.get('kind');
                        var resultDocCollection = AppletHelper.getResultsFromUid(detailModel);
                        var childDocCollection = AppletHelper.getChildDocs(detailModel);
                        var deferredViewResponse = DocDetailsDisplayer.getView(detailModel, docType, resultDocCollection, childDocCollection);

                        deferredViewResponse.done(function(results) {
                            results.title = results.title || DocDetailsDisplayer.getTitle(detailModel, docType);
                            response.resolve(results);
                        });
                        deferredViewResponse.fail(function(results) {
                            response.reject(results);
                        });
                    } else {
                        if (DEBUG) console.log('document "' + params.uid + '" not found in documents-view, checking in uid resource');

                        // we didn't find the document in document-view, so check in the uid resource
                        var uidFetchOptions = {
                            criteria: {
                                uid: params.uid
                            },
                            patient: new Backbone.Model({
                                icn: params.patient.icn,
                                pid: params.patient.pid
                            }),
                            resourceTitle: 'uid',
                            viewModel: {
                                parse: AppletHelper.parseDocResponse
                            },
                            cache: true
                        };
                        uidFetchOptions.onSuccess = function(uidData) {
                            var uidDetailModel = uidData.first();

                            // console.log("got uid model: " + JSON.stringify(uidDetailModel.attributes));
                            var docType = uidDetailModel.get('kind');
                            var resultDocCollection = AppletHelper.getResultsFromUid(uidDetailModel);
                            var childDocCollection = AppletHelper.getChildDocs(uidDetailModel);
                            var deferredViewResponse = DocDetailsDisplayer.getView(uidDetailModel, docType, resultDocCollection, childDocCollection);

                            deferredViewResponse.done(function(results) {
                                results.title = results.title || DocDetailsDisplayer.getTitle(uidDetailModel, docType);
                                response.resolve(results);
                            });
                            deferredViewResponse.fail(function(results) {
                                response.reject(results);
                            });
                        };
                        uidFetchOptions.onError = function(collection, error) {
                            response.reject('Unable to fetch document with uid "' + params.uid + '": ' + error.statusText);
                        };
                        ADK.PatientRecordService.fetchCollection(uidFetchOptions);
                    }
                }, this);

                return response.promise();
            });
        }
    };

    return detailCommunicator;
});

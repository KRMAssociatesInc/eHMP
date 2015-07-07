define([
    'app/applets/orders/util',
    'app/applets/orders/modalView/modalContentView'
], function(Util, ModalContentView) {

    var detailCommunicator = {

        initialize: function(appletId, resourceTitle) {

            // expose detail view through messaging
            var channel = ADK.Messaging.getChannel(appletId);
            channel.reply('detailView', function(params) {

                var fetchOptions = {
                    criteria: {
                        'uid': params.uid
                    },
                    patient: new Backbone.Model({
                        icn: params.patient.icn,
                        pid: params.patient.pid
                    }),
                    resourceTitle: resourceTitle,
                    viewModel: {
                        parse: Util.parseOrderResponse
                    },
                    cache: true,
                };

                var response = $.Deferred();

                var data = ADK.PatientRecordService.fetchCollection(fetchOptions);
                data.on('sync', function() {
                    var detailModel = data.first();

                    response.resolve({
                        view: new ModalContentView({
                            model: new Backbone.Model(detailModel.attributes)
                        }),
                        title: detailModel.get('summary')
                    });
                }, this);

                return response.promise();
            });
        }
    };

    return detailCommunicator;
});

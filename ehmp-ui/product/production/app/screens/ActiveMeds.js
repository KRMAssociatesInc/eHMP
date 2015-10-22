define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    // temporary default detail view. remove once all detail view have been implemented
    var DefaultDetailView = Backbone.Marionette.ItemView.extend({
        template: _.template('<div>A detail view for this domain is not yet implemented.</div>')
    });

    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review_v2"
    };

    function onResultClicked(clickedResult) {
        var domain = clickedResult.uid.split(":")[2],
            channelName = detailAppletChannels[domain];

        if (channelName) {
            // display spinner in modal while detail view is loading
            var modal = new ADK.UI.Modal({
                view: ADK.Views.Loading.create(),
                options: {
                    size: "large",
                    title: "Loading..."
                }
            });
            modal.show();

            // request detail view from whatever applet is listening for this domain
            var channel = ADK.Messaging.getChannel(channelName),
                deferredResponse = channel.request('detailView', clickedResult);

            deferredResponse.done(function(response) {
                var modal = new ADK.UI.Modal({
                    view: response.view,
                    options: {
                        size: "large",
                        title: response.title
                    }
                });
                modal.show();
            });
        } else {
            // no detail view available; use the default placeholder view
            var modalView = new ADK.UI.Modal({
                view: new DefaultDetailView(),
                options: {
                    size: "large",
                    title: "Detail - Placeholder"
                }
            });
            modalView.show();
        }
    }

    var screenConfig = {
        id: "activeMeds",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "activeMeds",
            title: "Active Medication",
            region: "center"
        }],
        patientRequired: true,
        onStart: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('displayMedDetail', onResultClicked);
            ADK.SessionStorage.setAppletStorageModel('activeMeds', 'viewMode', 'summary');
        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('displayMedDetail', onResultClicked);
        },
    };
    return screenConfig;
});

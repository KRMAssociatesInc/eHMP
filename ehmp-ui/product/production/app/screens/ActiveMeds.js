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
            ADK.showModal(ADK.Views.Loading.create(), {
                size: "large",
                title: "Loading..."
            });

            // request detail view from whatever applet is listening for this domain
            var channel = ADK.Messaging.getChannel(channelName),
                deferredResponse = channel.request('detailView', clickedResult);

            deferredResponse.done(function(response) {
                ADK.showModal(response.view, {
                    size: "large",
                    title: response.title
                });
            });
        } else {
            // no detail view available; use the default placeholder view
            ADK.showModal(new DefaultDetailView(), {
                size: "large",
                title: "Detail - Placeholder"
            });
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

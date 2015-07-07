define([
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull'
], function(AllergyGridFull, VitalsFull) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review_v2"
    };
    var config = {
        id: 'cover-sheet-gridster',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        userDefinedScreen: true,
        applets: [],

        onResultClicked: function(clickedResult) {
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
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('resultClicked', this.onResultClicked);
        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('resultClicked', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
});

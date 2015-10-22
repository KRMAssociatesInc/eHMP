define([
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull',
    'app/screens/ImmunizationsFull'
], function(AllergyGridFull, VitalsFull, ImmunizationsFull) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review_v2"
    };
    var config = {
        id: 'new-screen',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: false,
        applets: [],

        onResultClicked: function(clickedResult) {
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
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('resultClicked', this.onResultClicked);
            ImmunizationsFull.setUpEvents();
        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('resultClicked', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
});
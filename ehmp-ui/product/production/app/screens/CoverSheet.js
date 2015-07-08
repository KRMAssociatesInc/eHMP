define([
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull',
    'app/screens/ImmunizationsFull',
    'app/screens/OrdersFull',
    "main/ADK"
], function(AllergyGridFull, VitalsFull, ImmunizationsFull, OrdersFull, ADK) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "med": "medication_review_v2",
        "document": "documents"
    };

    var config = {
        id: 'cover-sheet',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Conditions",
            "maximizeScreen": "problems-full",
            "region": "bc2652653929",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "vitals",
            "title": "Vitals",
            "maximizeScreen": "vitals-full",
            "region": "dc49ad17e67c",
            "dataRow": "1",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "allergy_grid",
            "title": "Allergies",
            "maximizeScreen": "allergy-grid-full",
            "region": "e543e81ca31a",
            "dataRow": "1",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "maximizeScreen": "appointments-full",
            "region": "c7c6294343c0",
            "dataRow": "5",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "immunizations",
            "title": "Immunizations",
            "maximizeScreen": "immunizations-full",
            "region": "a7dace4f6e1f",
            "dataRow": "9",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "activeMeds",
            "title": "Medications",
            "region": "041456e4af17",
            "dataRow": "9",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "lab_results_grid",
            "title": "Lab Results",
            "maximizeScreen": "lab-results-grid-full",
            "region": "9dc9f289d846",
            "dataRow": "8",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "orders",
            "title": "Orders",
            "maximizeScreen": "orders-full",
            "region": "54cdb996d9c8",
            "dataRow": "9",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }, {
            "id": "ccd_grid",
            "title": "Community Health Summaries",
            "maximizeScreen": "ccd-list-full",
            "region": "76fed10ec8c0",
            "dataRow": "8",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "summary"
        }],
        onResultClicked: function(clickedResult) {

            var domain = clickedResult.uid.split(":")[2],
                channelName = detailAppletChannels[domain],
                modalView = null,
                deferredResponse = $.Deferred();

            if (channelName) {
                if (!clickedResult.suppressModal) {
                    // display spinner in modal while detail view is loading
                    ADK.showModal(ADK.Views.Loading.create(), {
                        size: "large",
                        title: "Loading..."
                    });
                }

                // request detail view from whatever applet is listening for this domain
                var channel = ADK.Messaging.getChannel(channelName),
                    deferredDetailResponse = channel.request('detailView', clickedResult);

                deferredDetailResponse.done(function(response) {
                    if (!clickedResult.suppressModal) {
                        ADK.showModal(response.view, {
                            size: "large",
                            title: response.title
                        });
                        deferredResponse.resolve();
                    } else {
                        deferredResponse.resolve({
                            view: response.view
                        });
                    }
                });
                deferredDetailResponse.fail(function(response) {
                    deferredResponse.reject(response);
                });
            } else {
                // no detail view available; use the default placeholder view
                var detailView = new DefaultDetailView();

                if (!clickedResult.suppressModal) {
                    ADK.showModal(detailView, {
                        size: "large",
                        title: "Detail - Placeholder"
                    });
                    deferredResponse.resolve();
                } else {
                    deferredResponse.resolve({
                        view: detailView
                    });
                }
            }

            return deferredResponse.promise();
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();
            ImmunizationsFull.setUpEvents();
            OrdersFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);
        },
        // afterStart: function() {
        //     ADK.Messaging.trigger('appletsCreated');
        // },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('getDetailView', this.onResultClicked);
            OrdersFull.turnOffEvents();
        },
        patientRequired: true
    };
    ADK.Messaging.getChannel("lab_results_grid").reply('extDetailView', config.onResultClicked);
    return config;
});

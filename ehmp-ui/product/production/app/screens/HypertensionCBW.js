define([
    'app/screens/VitalsFull'
], function(VitalsFull) {
    'use strict';
    var detailAppletChannels = {
        "med": "medication_review_v2",
        "document": "documents"
    };
    var config = {
        id: 'hypertension-cbw',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Conditions",
            "instanceId": "htcbw-problems-1",
            "region": "htcbw-problems-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "maximizeScreen": "problems-full",
            "filterName": "Filtered Hypertension",
            "viewType": "gist"
        }, {
            "id": "newsfeed",
            "title": "Timeline",
            "instanceId": "htcbw-newsfeed-1",
            "region": "htcbw-newsfeed-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Hypertension",
            "viewType": "summary"
        }, {
            "id": "vitals",
            "title": "Vitals",
            "instanceId": "htcbw-vitals-1",
            "region": "htcbw-vitals-1",
            "dataCol": "5",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Hypertension",
            "maximizeScreen": "vitals-full",
            "viewType": "gist"
        }, {
            "id": "lab_results_grid",
            "title": "Lab Results",
            "instanceId": "htcbw-lab_results_grid-1",
            "region": "htcbw-lab_results_grid-1",
            "dataCol": "9",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Hypertension",
            "maximizeScreen": "lab-results-grid-full",
            "viewType": "gist"
        }, {
            "id": "cds_advice",
            "title": "Clinical Reminders",
            "instanceId": "htcbw-cds_advice-1",
            "region": "htcbw-cds_advice-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Hypertension",
            "maximizeScreen": "cds-advice-full",
            "viewType": "summary"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "instanceId": "htcbw-appointments-1",
            "region": "htcbw-appointments-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Hypertension",
            "maximizeScreen": "appointments-full",
            "viewType": "summary"
        }, {
            "id": "documents",
            "title": "Documents",
            "instanceId": "htcbw-documents-1",
            "region": "htcbw-documents-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Hypertension",
            "viewType": "summary"
        }, {
            "id": "medication_review_v2",
            "title": "Medications Review",
            "instanceId": "htcbw-medication_review_v2-1",
            "region": "htcbw-medication_review_v2-1",
            "dataCol": "5",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Hypertension",
            "viewType": "expanded"
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

            VitalsFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);

        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('detailView', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
});

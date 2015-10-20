define([
    'app/screens/OrdersFull'
], function(OrdersFull) {
    'use strict';
    var detailAppletChannels = {
        "med": "medication_review_v2",
        "document": "documents"
    };
    var config = {
        id: 'depression-cbw',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "problems",
            "title": "Conditions",
            "instanceId": "dpcbw-problems-1",
            "region": "dpcbw-problems-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "maximizeScreen": "problems-full",
            "viewType": "gist"
        }, {
            "id": "newsfeed",
            "title": "Timeline",
            "instanceId": "dpcbw-newfeed-1",
            "region": "dpcbw-newfeed-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "viewType": "summary"
        }, {
            "id": "documents",
            "title": "Documents",
            "instanceId": "dpcbw-documents-1",
            "region": "dpcbw-documents-1",
            "dataCol": "5",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "viewType": "summary"
        }, {
            "id": "orders",
            "title": "Orders",
            "instanceId": "dpcbw-orders-1",
            "region": "dpcbw-orders-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "maximizeScreen": "orders-full",
            "viewType": "summary"
        }, {
            "id": "lab_results_grid",
            "title": "Lab Results",
            "instanceId": "dpcbw-lab_results_grid-1",
            "region": "dpcbw-lab_results_grid-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "maximizeScreen": "lab-results-grid-full",
            "viewType": "gist"
        }, {
            "id": "appointments",
            "title": "Appointments & Visits",
            "instanceId": "dpcbw-appointments-1",
            "region": "dpcbw-appointments-1",
            "dataCol": "17",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "maximizeScreen": "appointments-full",
            "viewType": "summary"
        }, {
            "id": "cds_advice",
            "title": "Clinical Reminders",
            "instanceId": "dpcbw-cds_advice-1",
            "region": "dpcbw-cds_advice-1",
            "dataCol": "17",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
            "maximizeScreen": "cds-advice-full",
            "viewType": "summary"
        }, {
            "id": "medication_review_v2",
            "title": "Medications Review",
            "instanceId": "dpcbw-medication_review_v2-1",
            "region": "dpcbw-medication_review_v2-1",
            "dataCol": "5",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Depression",
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

                    var modal = new ADK.UI.Modal({
                        view: ADK.Views.Loading.create(),
                        options: {
                            size: "large",
                            title: "Loading..."
                        }
                    });
                    modal.show();
                }

                // request detail view from whatever applet is listening for this domain
                var channel = ADK.Messaging.getChannel(channelName),
                    deferredDetailResponse = channel.request('detailView', clickedResult);

                deferredDetailResponse.done(function(response) {
                    if (!clickedResult.suppressModal) {

                        var modal = new ADK.UI.Modal({
                            view: response.view,
                            options: {
                                size: "large",
                                title: response.title
                            }
                        });
                        modal.show();
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

                    var modalView2 = new ADK.UI.Modal({
                        view: detailView,
                        options: {
                            size: "large",
                            title: "Detail - Placeholder"
                        }
                    });
                    modalView2.show();
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

            OrdersFull.setUpEvents();
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);

        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('detailView', this.onResultClicked);
            OrdersFull.turnOffEvents();
        },
        patientRequired: true
    };

    return config;
});
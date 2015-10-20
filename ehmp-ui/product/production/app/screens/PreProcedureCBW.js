define([
    'app/screens/OrdersFull',
    'app/screens/AllergyGridFull'
], function(OrdersFull,AllergyGridFull) {
    'use strict';
    var detailAppletChannels = {
        "med": "medication_review_v2",
        "document": "documents"
    };
    var config = {
        id: 'pre-procedure-cbw',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "allergy_grid",
            "title": "Allergies",
            "instanceId": "ppcbw-allergy_grid-1",
            "region": "ppcbw-allergy_grid-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "allergy-grid-full",
            "viewType": "gist"
        },
        {
            "id": "appointments",
            "title": "Appointments & Visits",
            "instanceId": "ppcbw-appointments-1",
            "region": "ppcbw-appointments-1",
            "dataCol": "21",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "appointments-full",
            "viewType": "summary"
        },
        {
            "id": "documents",
            "title": "Documents",
            "instanceId": "ppcbw-documents-1",
            "region": "ppcbw-documents-1",
            "dataCol": "13",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
            "viewType": "expanded"
        },
        {
            "id": "lab_results_grid",
            "title": "Lab Results",
            "instanceId": "ppcbw-lab_results_grid-1",
            "region": "ppcbw-lab_results_grid-1",
            "dataCol": "9",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "lab-results-grid-full",
            "viewType": "gist"
        },
        {
            "id": "problems",
            "title": "Conditions",
            "instanceId": "ppcbw-problems-1",
            "region": "ppcbw-problems-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "problems-full",
            "viewType": "gist"
        },
        {
            "id": "newsfeed",
            "title": "Timeline",
            "instanceId": "ppcbw-newsfeed-1",
            "region": "ppcbw-newsfeed-1",
            "dataCol": "1",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "filterName": "Filtered Preprocedure",
            "viewType": "summary"
        },
        {
            "id": "vitals",
            "title": "Vitals",
            "instanceId": "ppcbw-vitals-1",
            "region": "ppcbw-vitals-1",
            "dataCol": "5",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "4",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "vitals-full",
            "viewType": "gist"
        },
        {
            "id": "orders",
            "title": "Orders",
            "instanceId": "ppcbw-orders-1",
            "region": "ppcbw-orders-1",
            "dataCol": "13",
            "dataMaxSizeX": 8,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 4,
            "dataMinSizeY": 4,
            "dataRow": "1",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
            "maximizeScreen": "orders-full",
            "viewType": "summary"
        },
        {
            "id": "medication_review_v2",
            "title": "Medications Review",
            "instanceId": "ppcbw-medication_review_v2-1",
            "region": "ppcbw-medication_review_v2-1",
            "dataCol": "5",
            "dataMaxSizeX": 12,
            "dataMaxSizeY": 12,
            "dataMinSizeX": 8,
            "dataMinSizeY": 4,
            "dataRow": "7",
            "dataSizeX": "8",
            "dataSizeY": "6",
            "filterName": "Filtered Preprocedure",
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
                        view: new DefaultDetailView(),
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
            AllergyGridFull.setUpEvents();
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

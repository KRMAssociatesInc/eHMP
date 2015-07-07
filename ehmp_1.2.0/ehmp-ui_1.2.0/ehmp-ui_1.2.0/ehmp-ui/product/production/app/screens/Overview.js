define([
    'app/screens/AllergyGridFull',
    'app/screens/VitalsFull'
], function(AllergyGridFull, VitalsFull) {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
        "immunization": "immunizations",
        "med": "medication_review_v2"
    };
    var config = {
        id: 'overview',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "cds_advice",
            "title": "Clinical Reminders",
            "maximizeScreen": "cds-advice-full",
            "region": "8afd050c9965",
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
            "id": "problems",
            "title": "Conditions",
            "maximizeScreen": "problems-full",
            "region": "88c9e691ddef",
            "dataRow": "5",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "immunizations",
            "title": "Immunizations",
            "maximizeScreen": "immunizations-full",
            "region": "f620bece943a",
            "dataRow": "9",
            "dataCol": "1",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "encounters",
            "title": "Encounters",
            "region": "c16a40538ae0",
            "dataRow": "1",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist",
            "maximizeScreen": "news-feed"
        }, {
            "id": "activeMeds",
            "title": "Medications",
            "region": "fdf270309a7d",
            "dataRow": "5",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "gist",
            "maximizeScreen": 'medication-review'
        }, {
            "id": "allergy_grid",
            "title": "Allergies",
            "maximizeScreen": "allergy-grid-full",
            "region": "ae935faac713",
            "dataRow": "9",
            "dataCol": "5",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "reports",
            "title": "Reports",
            "maximizeScreen": "reports-full",
            "region": "d67b019e20e6",
            "dataRow": "1",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "summary"
        }, {
            "id": "vitals",
            "title": "Vitals",
            "maximizeScreen": "vitals-full",
            "region": "07464d212c2e",
            "dataRow": "5",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }, {
            "id": "lab_results_grid",
            "title": "Lab Results",
            "maximizeScreen": "lab-results-grid-full",
            "region": "a4fcd86f8715",
            "dataRow": "9",
            "dataCol": "9",
            "dataSizeX": "4",
            "dataSizeY": "4",
            "dataMinSizeX": "2",
            "dataMinSizeY": "1",
            "dataMaxSizeX": "4",
            "dataMaxSizeY": "4",
            "viewType": "gist"
        }],
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
                var channel = ADK.Messaging.getChannel(channelName);
                var deferredResponse = channel.request('detailView', clickedResult);

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
            $('#mainModal').modal('show');
        },
        onStart: function() {
            AllergyGridFull.setUpEvents();
            VitalsFull.setUpEvents();

            var immunizationsAppletChannel = ADK.Messaging.getChannel("igv_applet"); //igv_applet
            immunizationsAppletChannel.on('getDetailView', this.onResultClicked);

            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.on('detailView', this.onResultClicked);

            // var problemsAppletChannel = ADK.Messaging.getChannel("problems");
            // problemsAppletChannel.on('problemGistDetailView', this.onResultClicked);

        },
        onStop: function() {
            var searchAppletChannel = ADK.Messaging.getChannel("activeMeds");
            searchAppletChannel.off('detailView', this.onResultClicked);
        },
        patientRequired: true
    };

    return config;
});

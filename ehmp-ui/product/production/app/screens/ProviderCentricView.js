define([], function() {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
    };
    var config = {
        id: 'provider-centric-view',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appHeader: 'nav',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [
        {
            "id": "task_list",
            "title": "Task List",
            "region": "bc2652653929",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "8",
            "dataSizeY": "8",
            "dataMinSizeX": "4",
            "dataMinSizeY": "4",
            "dataMaxSizeX": "6",
            "dataMaxSizeY": "12",
            "viewType": "expanded"
        }],
        onStart: function() {},
        onStop: function() {},
        patientRequired: false,
        nonPatientCentricView: true,
        hasPermission: function() {
            return true;
        }
    };

    return config;
});
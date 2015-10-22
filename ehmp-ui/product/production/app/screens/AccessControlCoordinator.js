define([], function() {
    'use strict';
    var detailAppletChannels = {
        // mapping of domain --> appletId
    };
    var config = {
        id: 'access-control-coordinator',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appHeader: 'nav',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [],
        onStart: function() {},
        onStop: function() {},
        patientRequired: false,
        nonPatientCentricView: true,
        hasPermission: function() {
            if(ADK.UserService.hasPermission('read-acc-screen')){
                return true;
            }
            return false;
        },
        addNavigationTab: true
    };

    return config;
});
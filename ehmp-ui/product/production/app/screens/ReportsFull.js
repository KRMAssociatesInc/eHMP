define([
    "backbone",
    "marionette",
], function(Backbone, Marionette) {
    'use strict';

    var screenConfig = {
        id: 'reports-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [
        {
            id: 'reports',
            title: 'Reports',
            region: 'center',
            fullScreen: true
        }],
        patientRequired: true
    };
    return screenConfig;
});

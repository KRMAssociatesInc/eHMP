define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';

    var screenConfig = {
        id: "ui-components-demo",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "ui_components_demo",
            title: "ADK Forms Test Page",
            region: "center"
        }]
    };
    return screenConfig;
});

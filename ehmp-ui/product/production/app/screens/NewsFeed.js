//----------------------------------------
// Name:        News Feed ADK Screen
// Applets:     News Feed Applet, Time Line Applet
// Screen:      NewsFeed.js
// Version:     1.1
// Modified:    2014-10-20
// Team:        Jupiter
// Description: Provides screen layout for Applets and inter applets communication 
//----------------------------------------
define([
    "backbone",
    "marionette"
], function(Backbone, Marionette) {
    'use strict';
    var DEBUG = false;
    if (DEBUG) console.log("---------------->> News Feed Screen Started");

    var screenConfig = {
        id: 'news-feed',
        contentRegionLayout: 'gridster',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        predefined: true,
        freezeApplets: true, //if true, applets won't be draggable and resizable by gridster
        applets: [{
            "id": "newsfeed",
            "title": "Timeline",
            "region": "8afd050c9965",
            "dataRow": "1",
            "dataCol": "1",
            "dataSizeX": "12",
            "dataSizeY": "12",
            "dataMinSizeX": "4",
            "dataMinSizeY": "2",
            "dataMaxSizeX": "12",
            "dataMaxSizeY": "12",
            "viewType": "summary",
            "fullScreen": true
        }],
        started: false,
        onStart: function() {
            this.started = true;
        },
        patientRequired: true
    };
    return screenConfig;
});

define([
], function() {
    'use strict';

var DEBUG = {
    // Switch ON/OFF debug info
        flag: false,
    // Switch Chart Mode (hide chart div container/ remove data series from chart )
        no_data_hide_div: false,
    // Switch filtering behavior (News feed master - Time Line slave/Time Line master -  News feed slave)
        filtering_mode: "tl_master", //"nf_master/tl_master"
    // Switch on/off graph representation by event types
        eventsByType: false
    };
  return DEBUG;
});

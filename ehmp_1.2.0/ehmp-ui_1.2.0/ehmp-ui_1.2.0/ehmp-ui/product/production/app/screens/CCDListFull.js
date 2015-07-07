define(function() {
    'use strict';
    var screenConfig = {
        id: 'ccd-list-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'ccd_grid',
            title: 'Community Health Summaries',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true,
        globalDatepicker: false
    };

    return screenConfig;
});

define(function() {
    'use strict';
    var screenConfig = {
        id: 'problems-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'problems',
            title: 'Conditions',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true,
        globalDatepicker: false
    };

    return screenConfig;
});

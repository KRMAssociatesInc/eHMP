define(function() {
    'use strict';
    var screenConfig = {
        id: 'appointments-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'appointments',
            title: 'Appointments & Visits',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true,
        globalDatepicker: false
    };

    return screenConfig;
});

define(function () {
    'use strict';
    var screenConfig = {
        id: 'cds-advice-full',
        contentRegionLayout: 'gridOne',
        appletHeader: 'navigation',
        appLeft: 'patientInfo',
        applets: [{
            id: 'cds_advice',
            title: 'Clinical Reminders',
            region: 'center',
            fullScreen: true,
            viewType: 'expanded'
        }],
        patientRequired: true
    };

    return screenConfig;
});

define([], function() {
    var model = {
        patientInfo: {
            serviceConnected: true, //may not be needed
            scPercent: 10,
            // disabilities: [],
            disabilities: [{
                name: "DISABILTY1",
                scPercent: 20,
                serviceConnected: true
            }, {
                name: "DISABILTY2",
                scPercent: 30,
                serviceConnected: false
            }],
            outpatient_med_related_to: {
                SC: true,
                CV: true
            }
        },
        totalItems: 6,
        totalGroups: 3,
        groups: {
            'Medication, Outpatient': [{
                selected: true,
                description: '1Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300 Refill: 0',
                SC: true,
                CV: false
            }, {
                selected: true,
                description: '2Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300 Refill: 0',
                CV: true
            }],
            'Labs': [{
                selected: true,
                description: '3Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300 Refill: 0',
            }, {
                selected: true,
                description: '4Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300 Refill: 0',
            }],
            'Documents': [{
                selected: true,
                description: '5Note title',
                date: '09/09/2015 03:30'
            }, {
                selected: false,
                description: '6Note title',
                date: '09/09/2015 03:31'
            }]
        }
    };
    return model;
});
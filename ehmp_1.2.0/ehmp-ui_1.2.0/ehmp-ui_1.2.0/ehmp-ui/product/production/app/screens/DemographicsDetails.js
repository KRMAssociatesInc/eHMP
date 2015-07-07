define(function() {
    return {
        id: "demographics-details",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "demographics_details",
            title: "DemographicsDetails",
            region: "center"
        }],
        patientRequired: true
    };
});

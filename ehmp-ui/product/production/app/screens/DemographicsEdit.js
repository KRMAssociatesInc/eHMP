define(function() {
    return {
        id: "demographics-edit",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "demographics_edit",
            title: "DemographicsEdit",
            region: "center"
        }],
        patientRequired: true
    };
});

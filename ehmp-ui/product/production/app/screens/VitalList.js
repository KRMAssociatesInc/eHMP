define(function() {
    return {
        id: "vital-list",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "vitals",
            title: "Vitals",
            region: "center"
        }],
        patientRequired: true
    };
});

define(function() {
    return {
        id: "visit-select",
        contentRegionLayout: "gridTwo",
        appletHeader: "patient",
        applets: [
        {
            id: "visit",
            region: "right"
        },
        {
            id: "visit_selection",
            title: "Visit Selection",
            region: "left"
        }],
        patientRequired: true
    };
});

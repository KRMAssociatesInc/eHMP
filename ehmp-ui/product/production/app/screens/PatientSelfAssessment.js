define(function() {
    return {
        id: "psa",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "patient_self_assessment",
            title: "Patient Self Assessment",
            region: "center"
        }],
        patientRequired: true
    };
});

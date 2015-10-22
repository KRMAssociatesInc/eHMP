define(function() {
    return {
        id: "peg",
        contentRegionLayout: "gridOne",
        appletHeader: "patient",
        applets: [{
            id: "patient_entered_goals",
            title: "Patient Entered Goals",
            region: "center"
        }],
        patientRequired: true
    };
});

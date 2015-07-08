define(function() {
    var logonScreenConfig = {
        contentRegionLayout: "fullOne",
        id: "logon-screen",
        appHeader: "none",
        applets: [{
            id: "logon",
            title: "Sign In",
            region: "center"
        }],
        patientRequired: false,
        appFooter: "none"
    };

    return logonScreenConfig;
});

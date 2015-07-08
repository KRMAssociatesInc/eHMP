define(function () {
    var ssoLogonScreenConfig = {
        contentRegionLayout: "gridOne",
        appCenterLayout: 'fullScreenAppletCenterLayout',
        id: "sso",
        appHeader: "none",
        applets: [{
            id: "ssoLogon",
            title: "Auto Signing In",
            region: "center"
        }]
    };
    return ssoLogonScreenConfig;
});

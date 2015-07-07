define([], function() {
    // - "supported" is the minimum version of browser accepted/supported
    // - "minimumAllowed" is the minimum version of browser that will receive the warning yet still be allowed
    // - Specifying "NA" for "minimumAllowed" attribute will ensure that the browser is denied access
    return {
        "browsers": [{
            "name": "msie",
            "displayName": "Internet Explorer",
            "supported": "11"
        }, {
            "name": "chrome",
            "displayName": "Chrome",
            "supported": "40",
            "minimumAllowed": "40"

        }, {
            "name": "firefox",
            "displayName": "Firefox",
            "supported": "31",      // Testers use Firefox 31 for automated tests
            "minimumAllowed": "31"

        }, {
            "name": "phantom",
            "supported": "1.9"
        }, {
            "name": "safari",
            "displayName": "Safari",
            "minimumAllowed": "7"
        }, {
            "name": "opera",
            "displayName": "Opera",
            "minimumAllowed": "NA"
        }, {
            "name": "ios",
            "displayName": "iOS",
            "minimumAllowed": "8"
        }, {
            "name": "android",
            "displayName": "Android",
            "minimumAllowed": "37"
        }]
    };
});

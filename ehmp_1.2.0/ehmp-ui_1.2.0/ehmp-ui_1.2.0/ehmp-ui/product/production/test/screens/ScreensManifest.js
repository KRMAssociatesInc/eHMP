'use strict';
define(function() {
    var screensManifest = {
        defaultScreen: 'full',
        logonScreen: 'logon-screen',
        testEnvironmentFlag: true
    };

    var screens = [];

    screens.push({
        routeName: 'half',
        fileName: 'ColumnsTwoTestScreen'
    });
    screens.push({
        routeName: 'quarter',
        fileName: 'GridFourTestScreen'
    });
    screens.push({
        routeName: 'full',
        fileName: 'SingleAppletTestScreen'
    });

    screensManifest.screens = screens;

    return screensManifest;
});
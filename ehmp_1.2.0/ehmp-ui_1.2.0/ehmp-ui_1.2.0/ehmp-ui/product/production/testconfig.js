/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $ */

'use strict';

require.config({
    // 3rd party script alias names (Easier to type "jquery" than "libs/jquery, etc")
    // probably a good idea to keep version numbers in the file names for updates checking
    paths: {
        // Core Libraries
        "jquery": "node_modules/jquery/jquery",
        "underscore": "node_modules/lodash/lodash", // 2.4.1 / 1.3.1
        "backbone": "node_modules/backbone/backbone", // previousFragment
        "marionette": "node_modules/backbone.marionette/lib/backbone.marionette", // 1.6.2 // 1.4.0 // 1.1.0
        "json2": "node_modules/backbone.marionette/node_modules/backbone.babysitter/public/javascripts/json2",
        "jasmine": "node_modules/grunt-contrib-jasmine/vendor/jasmine-1.3.1/jasmine",
        "jasmine-html": "node_modules/grunt-contrib-jasmine/vendor/jasmine-1.3.1/jasmine-html",
        "moment": "moment/moment-2.7.0.min",

        // Plugins
        "jasminejquery": "node_modules/jasmine-jquery/lib/jasmine-jquery",
        "testUtil" : "test/testUtil"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    shim: {
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },
        "marionette": {
            "deps": ["underscore", "backbone", "jquery"],
            "exports": "Marionette"
        },
        "jasmine": {
            "exports": "jasmine"
        },
        "jasmine-html": {
            "deps": ["jasmine"],
            "exports": "jasmine"
        },
    },
});
require(['Init']);

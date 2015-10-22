/*jslint node: true, nomen: true, unparam: true */
/*global jquery, _, $, ADK, Backbone, Backbone.Radio */

'use strict';

require.config({
    /**
     * Manage dependencies using Bower.
     * _assets/libs/custom includes our custom and non-Bower libraries.
     **/
    waitSeconds: "30",
    paths: {
        "async":                                "_assets/libs/bower/async/async",
        "backbone":                             "_assets/libs/bower/backbone/backbone",
        "backbone.paginator":                   "_assets/libs/bower/backbone/backbone.paginator/backbone.paginator",
        "backbone.radio":                       "_assets/libs/bower/backbone/backbone.radio/backbone.radio",
        "sessionstorage":                       "_assets/libs/bower/backbone/backbone-sessionStorage/backbone.sessionStorage",
        "backbone-sorted-collection":           "_assets/libs/bower/backbone/backbone-sorted-collection/backbone-sorted-collection",
        "backgrid-moment-cell":                 "_assets/libs/bower/backgrid/backgrid-moment-cell/backgrid-moment-cell.min",
        "backgrid.filter":                      "_assets/libs/bower/backgrid/backgrid-filter/backgrid-filter.min",
        "bootstrap-datepicker":                 "_assets/libs/bower/bootstrap/bootstrap-datepicker/bootstrap-datepicker",
        "backbone.component":                   "_assets/libs/bower/backbone/backbone_component/backbone-component.min",
        "crossfilter":                          "_assets/libs/bower/crossfilter/crossfilter.min",
        "fastclick":                            "_assets/libs/bower/fastclick/fastclick",
        "highcharts":                           "_assets/libs/bower/highstock-release/highstock.src",
        "highcharts-more":                      "_assets/libs/bower/highstock-release/highcharts-more.src",
        "pattern-fill":                         "_assets/libs/bower/pattern-fill/pattern-fill",
        "grouped_categories":                   "_assets/libs/bower/grouped_categories/grouped-categories",
        "jasmine":                              "_assets/libs/bower/jasmine/jasmine",
        "jasmine-html":                         "_assets/libs/bower/jasmine/jasmine-html",
        "jquery":                               "_assets/libs/bower/jquery/jquery.min",
        "moment":                               "_assets/libs/bower/moment/moment.min",
        "placeholders":                         "_assets/libs/bower/placeholders/utils",
        "underscore":                           "_assets/libs/bower/lodash/lodash.underscore.min",  // code requires lodash instead of backbone's underscore
        "libphonenumber":                       "_assets/libs/bower/libphonenumberjs/libphonenumber",
        "puppetForm":                           "_assets/libs/custom/puppetForm/puppetForm",

        // involve vendor.scss changes
        "backgrid":                             "_assets/libs/bower/backgrid/backgrid.min",
        "bootstrap":                            "_assets/libs/bower/bootstrap/bootstrap.min",
        "bootstrap-timepicker":                 "_assets/libs/bower/bootstrap/bootstrap-timepicker/bootstrap-timepicker",
        "gridster":                             "_assets/libs/bower/gridster/jquery.gridster.min",
        "nouislider":                           "_assets/libs/bower/nouislider/jquery.nouislider.all.min",
        "bootstrap-notify":                     "_assets/libs/bower/bootstrap/remarkable-bootstrap-notify/bootstrap-notify",

        "jds-filter":                           "_assets/libs/bower/jds-filter/jds-filter.min",
        "queryString":                          "_assets/libs/bower/query-string/query-string",

        // custom libraries (avoid doing this if possible)
        "hbs":                                  "_assets/libs/custom/handlebars/hbs-0.4.0-custom",
        "handlebars":                           "_assets/libs/custom/handlebars/handlebars.min",
        "i18nprecompile":                       "_assets/libs/custom/handlebars/i18nprecompile",
        "json2":                                "_assets/libs/custom/handlebars/json2",

        "backbone.fetch-cache":                 "_assets/libs/custom/backbone-fetch-cache/backbone.fetch-cache.custom",
        "backbone-marionette-accessibility":    "_assets/libs/custom/backbone-marionette/accessibility/backbone-marionette-accessibility",
        "backgrid.paginator":                   "_assets/libs/custom/backgrid/backgrid-paginator-master/backgrid-paginator-custom",  // custom pagination
        "bootstrap-accessibility":              "_assets/libs/custom/bootstrap/accessibility/bootstrap-accessibility-custom.min",
        "modernizr":                            "_assets/libs/custom/modernizr/modernizr-2.6.2.min",  // actually using custom in index.html
        "jquery.inputmask":                     "_assets/libs/custom/jquery.inputmask/dist/jquery.inputmask.bundle-custom",
        "ie-console-fix":                       "_assets/libs/custom/ie-console/ie-console-fix",

        // Theming

        // Utilities
        "parser": "core/utilities/parser",

        // Plugins
        "typeahead":                            "_assets/libs/bower/typeahead.js/typeahead.bundle.min",

        "select2":                              "_assets/libs/custom/select2/select2.full",

        "text":                                 "_assets/libs/custom/require/plugins/text",
        "jasminejquery":                        "_assets/libs/bower/jasmine-jquery/jasmine-jquery",
        "jquery.form":                          "_assets/libs/custom/jquery/plugins/jquery.form.min-20130616",
        "jquery.formparams":                    "_assets/libs/custom/jquery/plugins/jquery.formparams",
        "jquery-datatable":                     "_assets/libs/custom/jquery/jquery-datatable/jquery.dataTables.min",
        "jquery-scroll":                        "_assets/libs/custom/jquery/jquery-scroll/jquery.scrollstart.scrollstop",

        "marionette":                           "_assets/libs/custom/marionette/backbone.marionette-2.4.1-custom.min",

        // Browser detection
        "bowser": "_assets/libs/bower/bowser/bowser.min",

        "Init": "main/Init",
        "ADKApp": "main/ADKApp",
        "ADK": "main/ADK",
        "ResourceDirectory": "main/ResourceDirectory",
        "Utils": "main/Utils",

        // Test directory
        "test": "test"
    },
    // Sets the configuration for your third party scripts that are not AMD compatible
    "shim": {
        "jquery-datatable": {
            "deps": ["jquery"]
        },
        "typeahead": {
            "deps": ["jquery"]
        },
        "jquery-scroll": {
            "deps": ["jquery"]
        },
        "highcharts": {
            "deps": ["jquery"],
            "exports": "Highcharts"
        },
        "highcharts-more": {
            "deps": ["jquery", "highcharts"],
            "exports": "HighchartsMore"
        },
        "pattern-fill": {
            "deps": ["jquery", "highcharts"]
        },
        "grouped_categories": {
            "deps": ["jquery", "highcharts"]
        },
        "backbone": {
            "deps": ["underscore", "jquery"],
            "exports": "Backbone"
        },
        "backbone.paginator": {
            "deps": ["backgrid"]
        },
        "backbone.radio": {
            "deps": ["underscore", "jquery", "backbone"],
            "exports": "Backbone.Radio"
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
        "jasminejquery": {
            "deps": ["jasmine"],
            "exports": "jasminejquery"
        },
        "modernizr": {
            "exports": "modernizr"
        },
        "sessionstorage": {
            "deps": ["backbone", "underscore"]
        },
        "backgrid": {
            "deps": ['backbone', 'jquery', 'underscore'],
            "exports": "Backgrid"
        },
        "backgrid.filter": {
            "deps": ['backgrid']
        },
        "backgrid.paginator": {
            "deps": ['backgrid']
        },
        "backgrid-moment-cell": {
            "deps": ['backgrid']
        },
        "jquery.inputmask": {
            "deps": ["jquery"]
        },
        "bootstrap": {
            "deps": ["jquery"]
        },
        "bootstrap-accessibility": {
            "deps": ["jquery", "bootstrap"]
        },
        "backbone-marionette-accessibility": {
            "deps": ["jquery", "bootstrap", "bootstrap-accessibility", "backbone", "marionette"]
        },
        "bootstrap-datepicker": {
            "deps": ["jquery"]
        },
        "bootstrap-timepicker": {
            "deps": ["jquery"]
        },
        "placeholders": {
            "deps": ["jquery"]
        },
        "gridster": {
            "deps": ["jquery"]
        },
        "puppetForm": {
            "deps": ["marionette", "bootstrap"],
            "exports": "PuppetForm"
        },
        "crossfilter": {
            "deps": [],
            "exports": "crossfilter"
        },
        "libphonenumber": {
            "exports": "i18n.phonenumbers"
        }
    },
    // hbs config - must duplicate in Gruntfile.js Require build
    "hbs": {
        "templateExtension": "html",
        "disableHelpers": false,
        "disableI18n": true,
        "compileOptions": {
            "il8nDirectory": "_assets/templates/i18n/",
            "helperDirectory": "_assets/templates/helpers/"
        }
    }
});

require([
    'main/Init',
    'ie-console-fix',
    'bootstrap',
    'bootstrap-accessibility',
    'backbone-marionette-accessibility',
    'bootstrap-datepicker',
    'bootstrap-timepicker',
    'placeholders',
    'gridster'
],  function(Init){
    Init.beforeStart();
});

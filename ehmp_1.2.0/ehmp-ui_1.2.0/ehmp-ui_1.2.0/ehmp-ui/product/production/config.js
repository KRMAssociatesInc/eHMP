require.config({
    paths: {
        // custom libraries (don't do this)
        'hbs': '_assets/libs/custom/handlebars/hbs-0.4.0-custom',
        'handlebars': '_assets/libs/custom/handlebars/handlebars.min',
        'i18nprecompile': '_assets/libs/custom/handlebars/i18nprecompile',
        'json2': '_assets/libs/custom/handlebars/json2',
        'underscore': 'node_modules/lodash/dist/lodash.underscore.min',
        'jquery': 'empty:',
        'jquery.inputmask': 'empty:',
        'async': 'empty:',
        'backbone': 'empty:',
        'marionette': 'empty:',
        'moment': 'empty:',
        'gridster': 'empty:',
        'crossfilter': 'empty:',
        'highcharts': 'empty:',
        'highcharts-more': 'empty:',
        'bootstrap-datepicker': 'empty:',
        'pattern-fill': 'empty:',
        'grouped_categories': 'empty:',
        'backgrid': 'empty:',
        'typeahead': 'empty:',

        // Add the handlebars helpers as stubs to fix the requirement of having them in ADK
        // TODO: find a way to allow these to be wrapped completely and used via handlbars 
        // instead of requireing them in the ADK helper file
        '_assets/templates/helpers/hasPermission': 'empty:',
        '_assets/templates/helpers/helpIconLink': 'empty:',

        'text': '_assets/libs/custom/require/plugins/text'
    },
    // hbs config - must duplicate in Gruntfile.js Require build
    'hbs': {
        'templateExtension': 'html',
        'disableHelpers': false,
        'disableI18n': true,
        'compileOptions': {
            'il8nDirectory': '_assets/templates/i18n/',
            'helperDirectory': '_assets/templates/helpers/'
        }
    }
});
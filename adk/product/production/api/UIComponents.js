define([
    'backbone',
    'marionette',
    'jquery',
    'underscore',
    'handlebars',
    'puppetForm',
    'main/ui_components/forms/templateHelpers',
    'main/ui_components/templateHelpers'
], function(Backbone, Marionette, $, _, Handlebars, PuppetForm, FormHelpers, UiHelpers) {
    'use strict';

    // Used to toggle Handlebar Helpers vs. Marionette TemplateHelpers
    var HANDLEBARS_HELPERS_ENABLED = true;

    var UI_SUBSTRING = 'ui-';
    var FORM_SUBSTRING = UI_SUBSTRING + 'form-';

    //Handlebars.helpers.UI_Button.apply(this, ["", buttonOptions])
    var UIComponents = {
        Form_Helpers: FormHelpers,
        Template_Helpers: UiHelpers,
        View_Components: {},
    };

    if (HANDLEBARS_HELPERS_ENABLED) {
        _.each(UIComponents.Template_Helpers, function(helper, key) {
            Handlebars.registerHelper(UI_SUBSTRING + key, helper);
        });
        _.each(UIComponents.Form_Helpers, function(helper, key) {
            Handlebars.registerHelper(FORM_SUBSTRING + key, helper);
        });
    } else {
        _.extend(Marionette.View.prototype, {
            mixinTemplateHelpers: function(target) {
                target = target || {};
                var templateHelpers = this.getOption('templateHelpers');
                templateHelpers = Marionette._getValue(templateHelpers, this);

                // Adding appropriate string to begining of all helper methods/components
                var Template_Helpers = _.reduce(UIComponents.Template_Helpers, function(object, value, key) {
                    object[UI_SUBSTRING + key] = value;
                    return object;
                }, {});
                var Form_Helpers = _.reduce(UIComponents.Form_Helpers, function(object, value, key) {
                    object[FORM_SUBSTRING + key + key] = value;
                    return object;
                }, {});

                templateHelpers = _.extend(Template_Helpers, templateHelpers);
                templateHelpers = _.extend(Form_Helpers, templateHelpers);
                return _.extend(target, templateHelpers);
            }
        });
    }

    return UIComponents;
});
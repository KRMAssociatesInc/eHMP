define([
    'puppetForm',
    'handlebars'
], function(PuppetForm, Handlebars) {
    'use strict';

    var SearchbarControl = PuppetForm.SearchbarControl = PuppetForm.Control.extend({
        _super: PuppetForm.Control.prototype,
        defaults: {
            type: "text",
            label: "",
            maxlength: 255,
            extraClasses: [],
            helpMessage: ''
        },
        template: Handlebars.compile('{{ui-form-searchbar placeholder size=size value=value classes=extraClasses title=title}}'),
        events: {
            "change input": "onChange",
            "focus input": "clearInvalid"
        },
        getValueFromDOM: function() {
            return this.formatter.toRaw(this.$el.find("input").val(), this.model);
        }
    });

    return SearchbarControl;
});
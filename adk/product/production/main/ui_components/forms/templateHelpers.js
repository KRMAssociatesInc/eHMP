define([
    'puppetForm',
    'handlebars'
], function(PuppetForm, Handlebars) {
    'use strict';

    // Needed to allow PuppetForm Controls to access attributes of PuppetForm
    Handlebars.registerHelper("PuppetForm", function(methodString) {
        return PuppetForm[methodString];
    });

    Handlebars.registerHelper("has-puppetForm-prop", function(methodString) {
        var prop = PuppetForm[methodString] || "";
        return (prop !== "" ? true : false);
    });

    Handlebars.registerHelper("formatter-from-raw", function(formatter, value) {
        return formatter.fromRaw(value);
    });
    Handlebars.registerHelper("clean-for-id", function replaceSpaces(string) {
        string = string || "";
        return string.replace(/[^A-Z0-9]+/ig, "-");
    });
    Handlebars.registerHelper("add-required-indicator", function appendIndicator(string, required) {
        if (required){
            return string + ' *';
        }
        return string;
    });
    Handlebars.registerHelper("is-sr-only-label", function srOnlyLabel(bool) {
        return (bool ? 'sr-only' : '');
    });
    Handlebars.registerHelper("not", function not(bool) {
        return (_.isUndefined(bool) ? undefined : !bool);
    });

    var UI_Form_Helpers = {
        label: function(labelText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var forID, extraClasses, content;
            forID = options.forID || "";
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            content = options.content || "";

            var htmlString = [
                '<label for="' + forID + '" ' +
                'class="'+
                (extraClasses ? extraClasses : '') +
                PuppetForm.controlLabelClassName +
                '"'+
                '>',
                (content ? content +'\n' : '') +
                labelText,
                '</label>'
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        },
        checkbox: function(labelText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var id, title, extraClasses, checked, name, disabled;
            labelText = hbEscape(labelText || "");
            id = hbEscape(options.id || "checkbox-" + labelText.replace(/[^A-Z0-9]+/ig, "-"));
            title = hbEscape(options.title || labelText + " checkbox");
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            checked = (!_.isUndefined(options.checked) && _.isBoolean(options.checked) ? options.checked : false);
            disabled = (_.isBoolean(options.disabled) ? options.disabled : false);
            name = hbEscape(options.name || "checkBox");


            var labelOptions = {
                hash: {
                    forID: id,
                    content: [
                        '<input type="checkbox"' +
                        ' id="' + id + '" name="' + name + '" title="' + title + '"' +
                        (checked ? ' checked="checked"' : '') +
                        (disabled ? ' disabled' : '') +
                        ' />'
                    ].join("\n")
                }
            };

            var htmlString = [
                '<div class="checkbox' +
                (extraClasses ? ' ' + extraClasses + '"' : '"') +
                '>',
                Handlebars.helpers['ui-form-label'].apply(this, [labelText, labelOptions]),
                '</div>'
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        },
        searchbar: function(placeholderText, options) {
            // placeholder
            // size (bootstrap col width, default: 12)
            // standAloneForm (default false)
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var title, value, size, id, extraClasses, standAloneForm, required, disabled;
            placeholderText = hbEscape(placeholderText || "");
            title = hbEscape(options.title || placeholderText);
            value = options.value || "";
            size = hbEscape(parseInt(options.size) || 12);
            id = hbEscape(options.id || "default-responsive-search-bar");
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            standAloneForm = options.standAloneForm || false;
            required = (_.isBoolean(options.required) ? options.required : false);
            disabled = (_.isBoolean(options.disabled) ? options.disabled : false);

            var labelOptions = {
                hash: {
                    forID: id,
                    classes: ["sr-only"]
                }
            };

            var htmlString = [
                (standAloneForm ? '<form action="#" method="post">' : ''),
                '<div class="row"><div class="col-xs-' + size + ' ' + extraClasses + '">',
                '<div class="input-group">',
                Handlebars.helpers['ui-form-label'].apply(this, [(placeholderText.length > 0 ? placeholderText : title.length > 0 ? title : 'default searchbar'), labelOptions]),
                '<input type="text" class="form-control" placeholder="' + placeholderText + '" title="' + title + '" ' +
                (disabled ? ' disabled' : '') +
                (required ? ' required' : '') +
                ' id="' + id + '" value="' + value + '" />',
                '<span class="input-group-btn">',
                '<button type="button" class="text-search-accessible btn btn-default"' +
                (disabled ? ' disabled' : '') +
                (required ? ' required' : '') +
                ' title="Please select the button to submit your search">',
                '<i class="fa fa-search" title="Submit Search"></i><span class="sr-only">Submit Search</span>',
                '</button>',
                '</span>',
                '</div>',
                '</div>',
                '</div>', (standAloneForm ? '</form>' : '')
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        }
    };

    return UI_Form_Helpers;
});
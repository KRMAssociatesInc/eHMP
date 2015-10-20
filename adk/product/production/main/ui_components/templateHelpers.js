define([
    'handlebars',
    'underscore'
], function(Handlebars, _) {
    'use strict';

    var UI_Template_Helpers = {
        button: function(displayText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var type, title, extraClasses, extraAttributes, id, icon, state, disabled, size, status;
            displayText = hbEscape(displayText || "");
            type = hbEscape(options.type || "button");
            title = hbEscape(options.title || displayText);
            extraClasses = (_.isArray(options.classes) ? hbEscape(options.classes.toString().replace(/,/g, ' ')) : hbEscape(options.classes || ""));
            extraAttributes = hbEscape(options.attributes || "");
            id = hbEscape(options.id);
            icon = hbEscape(options.icon);
            state = hbEscape(options.state || "");
            state = (options.disabled ? "disabled" : state);
            disabled = (options.disabled ? true : false);
            size = hbEscape(options.size || "");
            status = hbEscape(options.status || "");

            var htmlString = [
                '<button type="' + type + '" class="btn' +
                (extraClasses ? ' ' + extraClasses : '') +
                (status ? ' btn-' + status : '') +
                (size === 'xs' || size === 'sm' || size === 'lg' ? ' btn-'+ size : '') +
                '" title="' + title + '" ' +
                (disabled ? 'disabled="disabled" ': '') +
                (id ? 'id="' + id + '"' : '') +
                (extraAttributes ? _.map(options.attributes, function(value, key) { return key+'="'+value+'"'; }).join('') : '') +
                '>' +
                (icon ? '<i class="fa ' + icon + '" ></i> ' : "") +
                displayText +
                ((options.split === 'false' && _.isEmpty(icon)) || (options.split === 'true') ? ' <span class="caret"></span><span class="sr-only">Press enter to toggle dropdown</span>' : '' ) +
                '</button>'
            ].join("\n");

            return new Handlebars.SafeString(htmlString);
        },
        dropdown: function(displayText, options) {
            options = options.hash || {};
            var hbEscape = Handlebars.Utils.escapeExpression;

            var split = hbEscape(options.split || false);

            var htmlString = '<div class="btn-group">';

            var mainButtonClasses = ['btn-primary', 'btn-sm'];
            var mainButton = Handlebars.helpers['ui-button'].apply(this, [displayText, { hash: {
                classes: options.split ? mainButtonClasses.concat('btn-divider') : mainButtonClasses,
                id: options.id,
                icon: options.icon,
                type: options.type,
                title: options.title
            }}]);

            var dropdownToggleClasses = ['dropdown-toggle', 'btn-sm'];
            var dropdownToggle = Handlebars.helpers['ui-button'].apply(this, [options.split ? '' : displayText, { hash: {
                classes: options.icon && _.isEmpty(displayText) ? dropdownToggleClasses.concat('icon-btn') : (options.split ? dropdownToggleClasses.concat('btn-primary') : dropdownToggleClasses.concat(['btn-primary', 'btn-caret'])),
                attributes: {
                    'data-toggle': "dropdown"
                },
                icon: options.split ? '' : options.icon,
                split: split
            }}]);

            if (options.split === false) {
                htmlString = htmlString + dropdownToggle;
            } else {
                htmlString = htmlString + mainButton + dropdownToggle;
            }

            var dropdownList = '<ul class="dropdown-menu">';
            _.each(options.items, function(item) {
                dropdownList += '<li id="'+options.id+'-'+item.id+'" class="'+item.extraClasses.join(' ')+'">'+'<a href="#">'+item.label+'</a></li>';
            });
            dropdownList += '</ul></div>';

            htmlString += dropdownList;

            return new Handlebars.SafeString(htmlString);
        }
    };

    return UI_Template_Helpers;
});
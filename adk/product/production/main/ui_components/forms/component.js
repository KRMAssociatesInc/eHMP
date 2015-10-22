define([
    'puppetForm',
    'handlebars',
    'backbone',
    'underscore',
    // Make sure to require all NEW PuppetForm Controls!!
    'main/ui_components/forms/controls/toggleOptionsChecklist',
    'main/ui_components/forms/controls/collapsibleContainer',
    'main/ui_components/forms/controls/popover',
    'main/ui_components/forms/controls/input',
    'main/ui_components/forms/controls/checklist',
    'main/ui_components/forms/controls/drilldownChecklist',
    'main/ui_components/forms/controls/searchbar',
    'main/ui_components/forms/controls/fieldset',
    'main/ui_components/forms/controls/container',
    'main/ui_components/forms/controls/multiselectSideBySide',
    'main/ui_components/forms/controls/yesNoChecklist',
    'main/ui_components/forms/controls/typeahead',
    'main/ui_components/forms/controls/datepicker',
    'main/ui_components/forms/controls/timepicker',
    'main/ui_components/forms/controls/commentBox',
    'main/ui_components/forms/controls/nestedCommentBox',
    'main/ui_components/forms/controls/alertBanner',
    'main/ui_components/forms/controls/rangeSlider',
    'main/ui_components/forms/controls/selectableTable',
    'main/ui_components/forms/controls/tabs',
    'main/ui_components/forms/controls/select',
    'main/ui_components/forms/controls/dropdown'
], function(PuppetForm, Handlebars, Backbone, _) {
    'use strict';

    PuppetForm.SpacerControl = Backbone.View.extend({
        tagName: 'hr'
    });

    PuppetForm.ButtonControl = PuppetForm.DefaultButtonControl.extend({
        template: Handlebars.compile([
            '{{ui-button label type=type icon=icon disabled=disabled title=title classes=extraClasses id=(clean-for-id id) size=size}}',
            '{{#compare type "submit"}}',
            '{{#if value}}{{#if value.status}}',
            '<span class="status pull-right{{#compare value.status "error"}} {{PuppetForm "buttonStatusErrorClassName"}}{{/compare}}{{#compare value.status "success"}} {{PuppetForm "buttonStatusSuccessClassname"}}{{/compare}}"> {{value.message}}</span>',
            '{{/if}}{{/if}}',
            '{{/compare}}'
        ].join("\n")),
        keyPathAccessor: function(obj, path) {
            var res = obj;
            path = path.split('.');
            for (var i = 0; i < path.length; i++) {
                if (_.isNull(res)) return null;
                if (_.isEmpty(path[i])) continue;
                if (!_.isUndefined(res[path[i]])) res = res[path[i]];
            }
            return res;
        },
        events: _.defaults({
            //Events to be Triggered By User
            "control:disabled": function(event, booleanValue) {
                this.setBooleanFieldOption("disabled", booleanValue, event);
            },
            "control:label": function(event, stringValue) {
                this.setStringFieldOption("label", stringValue, event);
            },
            "control:icon": function(event, stringValue) {
                this.setStringFieldOption("icon", stringValue, event);
            },
            "control:title": function(event, stringValue) {
                this.setStringFieldOption("title", stringValue, event);
            }
        }, PuppetForm.DefaultButtonControl.prototype.events),
        className: function() {
            return "control visible-inline";
        },
        onRender: function() {
            this.$el.addClass(this.field.get('controlName') + '-control ' + this.field.get('name').split('.').shift());
            this.updateInvalid();
        }
    });

    PuppetForm.CheckboxControl = PuppetForm.BooleanControl = PuppetForm.DefaultBooleanControl.extend({
        template: Handlebars.compile([
            '{{ui-form-checkbox label id=(clean-for-id name) name=name title=title checked=value disabled=disabled }}'
        ].join("\n")),
        events: _.defaults({
            //Events to be Triggered By User
            "control:disabled": function(event, booleanValue) {
                this.setBooleanFieldOption("disabled", booleanValue, event);
            },
            "control:label": function(event, stringValue) {
                this.setStringFieldOption("label", stringValue, event);
            },
            "control:title": function(event, stringValue) {
                this.setStringFieldOption("title", stringValue, event);
            }
        }, PuppetForm.DefaultBooleanControl.prototype.events)
    });

    PuppetForm.RadioControl = PuppetForm.DefaultRadioControl.extend({
        template: Handlebars.compile([
            '<p class="faux-label {{is-sr-only-label srOnlyLabel}}">{{add-required-indicator label required}}</p>',
            '<div id="{{clean-for-id name}}" class="{{PuppetForm "radioControlsClassName"}}{{#if (has-puppetForm-prop "controlsClassName")}} {{PuppetForm "controlsClassName"}}{{/if}}"{{#if title}} title="{{title}}"{{/if}}>',
            '{{#each options}}',
            Handlebars.helpers['ui-form-label'].apply(this, ["{{label}}", {
                hash: {
                    forID: "{{../name}}-{{clean-for-id value}}",
                    classes: PuppetForm.radioLabelClassName,
                    content: '<input type="{{../type}}" id="{{../name}}-{{clean-for-id value}}" name="{{../name}}" {{#if title}}title="{{title}}"{{else}}title="Press enter to select, to view next option use arrow keys"{{/if}} value="{{formatter-from-raw ../formatter value}}" {{#compare value ../rawValue}}checked="checked"{{/compare}}{{#if disabled}} disabled{{else}}{{#if ../../disabled}} disabled{{/if}}{{/if}}{{#if ../required}} required{{/if}}/>'
                }
            }]),
            '{{/each}}',
            '{{#if helpMessage}} <span {{#if (has-puppetForm-prop "helpMessageClassName")}}class="{{PuppetForm "helpMessageClassName"}}"{{/if}}>{{helpMessage}}</span>{{/if}}',
            '</div>'
        ].join("\n")),
        events: _.defaults({
            //Events to be Triggered By User
            "control:disabled": function(event, booleanValue) {
                this.setBooleanFieldOption("disabled", booleanValue, event);
            },
            "control:required": function(event, booleanValue) {
                this.setBooleanFieldOption("required", booleanValue, event);
            },
            "control:label": function(event, stringValue) {
                this.setStringFieldOption("label", stringValue, event);
            },
            "control:helpMessage": function(event, stringValue) {
                this.setStringFieldOption("helpMessage", stringValue, event);
            }
        }, PuppetForm.DefaultRadioControl.prototype.events)
    });

    PuppetForm.TextareaControl = PuppetForm.DefaultTextareaControl.extend({
        template: Handlebars.compile([
            '{{ui-form-label (add-required-indicator label required) forID=(clean-for-id name) classes=(is-sr-only-label srOnlyLabel)}}',
            '<textarea class="{{PuppetForm "controlClassName"}}"{{#if placeholder}} placeholder="{{placeholder}}"{{/if}}{{#if maxlength}} maxlength="{{maxlength}}"{{/if}}{{#if cols}} cols="{{cols}}"{{/if}}{{#if rows}} rows="{{rows}}"{{/if}} name="{{name}}"{{#if title}} title="{{title}}"{{/if}} id={{clean-for-id name}}{{#if disabled}} disabled{{/if}}{{#if required}} required{{/if}}>' +
            '{{value}}' +
            '</textarea>',
            '{{#if helpMessage}} <span {{#if (has-puppetForm-prop "helpMessageClassName")}}class="{{PuppetForm "helpMessageClassName"}}"{{/if}}>{{helpMessage}}</span>{{/if}}'
        ].join("\n")),
        events: _.defaults({
            "control:required": function(event, booleanValue) {
                this.setBooleanFieldOption("required", booleanValue, event);
            },
            "control:disabled": function(event, booleanValue) {
                this.setBooleanFieldOption("disabled", booleanValue, event);
            },
            "control:cols": function(event, intValue) {
                this.setIntegerFieldOption("cols", intValue, event);
            },
            "control:rows": function(event, intValue) {
                this.setIntegerFieldOption("rows", intValue, event);
            },
            "control:title": function(event, stringValue) {
                this.setStringFieldOption("title", stringValue, event);
            },
            "control:placeholder": function(event, stringValue) {
                this.setStringFieldOption("placeholder", stringValue, event);
            },
            "control:helpMessage": function(event, stringValue) {
                this.setStringFieldOption("helpMessage", stringValue, event);
            },
            "control:maxlength": function(event, intValue) {
                this.setIntegerFieldOption("maxlength", intValue, event);
            }
        }, PuppetForm.DefaultTextareaControl.prototype.events)
    });

    return PuppetForm;
});

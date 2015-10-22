define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/forms/component'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var ChildView = Backbone.Marionette.ItemView.extend({
        initialize: function(options){
            this.attributeMapping = options.attributeMapping;
        },
        template: Handlebars.compile([
            '<div class="col-md-6 col-xs-6">',
            '<p class="faux-label">{{label}}</p>',
            '</div>',
            '<div class="col-md-6 col-xs-6">',
            Handlebars.helpers['ui-form-label'].apply(this, ["N/A", {
                hash: {
                    forID: "{{name}}-undefined",
                    classes: PuppetForm.radioLabelClassName,
                    content: '<input type="radio" id="{{clean-for-id name}}-undefined" name="{{name}}" value="" {{#compare undefined value}}checked="checked"{{/compare}}{{#if disabled}} disabled{{else}}{{#if ../../disabled}} disabled{{/if}}{{/if}}{{#if ../required}} required{{/if}}{{#if title}} title="{{title}}"{{else}} title="Press enter to select, to view next option use arrow keys"{{/if}}/>'
                }
            }]),
            Handlebars.helpers['ui-form-label'].apply(this, ["Yes", {
                hash: {
                    forID: "{{name}}-yes",
                    classes: PuppetForm.radioLabelClassName,
                    content: '<input type="radio" id="{{clean-for-id name}}-yes" name="{{name}}" value=true {{#compare true value}}checked="checked"{{/compare}}{{#if disabled}} disabled{{else}}{{#if ../../disabled}} disabled{{/if}}{{/if}}{{#if ../required}} required{{/if}}{{#if title}} title="{{title}}"{{else}} title="Press enter to select, to view next option use arrow keys"{{/if}}/>'
                }
            }]),
            Handlebars.helpers['ui-form-label'].apply(this, ["No", {
                hash: {
                    forID: "{{name}}-no",
                    classes: PuppetForm.radioLabelClassName,
                    content: '<input type="radio" id="{{clean-for-id name}}-no" name="{{name}}" value=false {{#compare false value}}checked="checked"{{/compare}}{{#if disabled}} disabled{{else}}{{#if ../../disabled}} disabled{{/if}}{{/if}}{{#if ../required}} required{{/if}}{{#if title}} title="{{title}}"{{else}} title="Press enter to select, to view next option use arrow keys"{{/if}}/>'
                }
            }]),
            '</div>'
        ].join("\n")),
        className: "row",
        modelEvents: {
            'optionUpdated': 'render'
        },
        events: _.defaults({
            "change input": "onChange"
        }, PuppetForm.ChecklistControl.events),
        getValueFromDOM: function() {
            var value = this.$el.find("input:checked").val();
            if (value){
                return JSON.parse(value);
            }
            return value;
        },
        onChange: function(e) {
            e.preventDefault();
            var INPUT = this.$(e.target),
                value = this.getValueFromDOM(INPUT);
            this.model.set(this.attributeMapping.value, value);
            this.trigger('checklist-value-change');
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    name: attributes[this.attributeMapping.unique],
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label],
                    disabled: attributes[this.attributeMapping.disabled]
                };
            return data;
        }
    });

    var YesNoChecklist = PuppetForm.YesNoChecklistControl = PuppetForm.ChecklistControl.extend({
        childView: ChildView
    });

    return YesNoChecklist;
});

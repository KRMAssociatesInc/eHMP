define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var ChildView = Backbone.Marionette.ItemView.extend({
        initialize: function(options) {
            this.attributeMapping = options.attributeMapping;
        },
        template: Handlebars.compile([
            '{{ui-form-checkbox label name=name checked=value disabled=disabled classes="border-bottom" title="Press tab to view options. Press spacebar to select."}}'
        ].join("\n")),
        events: {
            "change input": "onChange"
        },
        modelEvents: {
            'optionUpdated': 'render'
        },
        getValueFromDOM: function(INPUT) {
            return (INPUT.is(":checked") ? true : false);
        },
        className: PuppetForm.CommonPrototype.className,
        onChange: function(e) {
            e.preventDefault();
            var INPUT = this.$(e.target),
                value = this.getValueFromDOM(INPUT);
            this.stopListening(this.model, "change", this.render);
            this.model.set(this.attributeMapping.value, value);
            this.listenTo(this.model, "change", this.render);
            this.trigger('checklist-value-change');
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    name: attributes[this.attributeMapping.unique],
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label],
                    disabled: attributes[this.attributeMapping.disabled] || false
                };
            return data;
        }
    });

    var ChecklistPrototype = {
        defaults: {
            name: "",
            label: "",
            collection: [],
            extraClasses: []
        },
        tagName: 'fieldset',
        attributeMappingDefaults: {
            unique: 'name',
            value: 'value',
            label: 'label',
            disabled: 'disabled'
        },
        template: Handlebars.compile([
            '<legend>{{label}}</legend>',
            '<div class="childView-container{{#if (has-puppetForm-prop "controlsClassName")}} {{PuppetForm "controlsClassName"}}{{/if}}">' +
            '</div>',
        ].join("\n")),
        ui: {
            'ChildViewContainer': '.childView-container'
        },
        childView: ChildView,
        childViewContainer: '@ui.ChildViewContainer',
        childViewOptions: function(model, index) {
            return {
                filter: this.filter,
                attributeMapping: this.attributeMapping
            };
        },
        addChild: function(child, ChildView, index) {
            if (child.get(this.attributeMapping.label) && _.isString(child.get(this.attributeMapping.label))) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
        initialize: function(options) {
            this.initOptions(options);
            this.setAttributeMapping();
            this.setFormatter();
            this.listenToFieldName();
            this.listenToFieldOptions();
            this.setExtraClasses();
            this.modelName = this.getComponentInstanceName();
            this.initCollection('collection');

            var self = this;
            this.listenTo(this.collection, 'change', function() {
                self.model.trigger('change');
            });

            this.stopListening(this.model, "change:" + this.modelName, this.render);
            this.model.set(this.modelName, this.collection);
            this.listenTo(this.model, "change:" + this.modelName, this.render);
        },
        childEvents: {
            'checklist-value-change': 'childValueChange'
        },
        childValueChange: function(){
            var model = this.model,
                attrArr = this.field.get("name").split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.');
            if (this.model.errorModel instanceof Backbone.Model) {
                if (_.isEmpty(path)) {
                    this.model.errorModel.unset(name);
                } else {
                    var nestedError = this.model.errorModel.get(name);
                    if (nestedError) {
                        this.keyPathSetter(nestedError, path, null);
                        this.model.errorModel.set(name, nestedError);
                    }
                }
            }
        },
        events: _.defaults({
            //Events to be Triggered By User
            "control:item:disabled": function(event, options) {
                var itemName = options.itemName,
                    booleanValue = options.booleanValue;
                if (_.isBoolean(booleanValue)) {
                    var collectionOfItems = this.collection;
                    var self = this;
                    var itemToChange = _.find(collectionOfItems.models, function(model){
                        if (model.get(self.attributeMapping.unique) === itemName){
                            return true;
                        }
                        return false;
                    });
                    if (!_.isUndefined(itemToChange)){
                        this.children.findByModel(itemToChange).model.set(this.attributeMapping.disabled, booleanValue).trigger('optionUpdated');
                    }
                    event.stopPropagation();
                }
            }
        }, PuppetForm.CommonPrototype.events)
    };

    var Checklist = PuppetForm.ChecklistControl = Backbone.Marionette.CompositeView.extend(
        _.defaults(ChecklistPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );

    return Checklist;
});
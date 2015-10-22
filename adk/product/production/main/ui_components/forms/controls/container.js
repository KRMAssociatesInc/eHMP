define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var ContainerPrototype = {
        defaults: {
            items: [],
            extraClasses: []
        },
        template: Handlebars.compile(''),
        initialize: function(options) {
            this.collection = new Backbone.Collection();
            this.initOptions(options);
            this.formModel = options.model;
            this.tagName = this.field.get('tagName') || "div";
            this.$el[0] = this.el = document.createElement(this.tagName);
            this.containerTemplate = this.field.get('template') || null;
            if (this.containerTemplate) {
                this.template = (_.isFunction(this.containerTemplate) ? this.containerTemplate : Handlebars.compile(this.containerTemplate));
            }
            this.setExtraClasses();
            var items = this.field.get("items") || this.defaults.items;
            if (!(items instanceof Backbone.Collection))
                items = new PuppetForm.Fields(items);
            this.items = items;
            this.collection = this.items;

            this.collection.bind('remove', this.render);

            this.modelListeners = this.field.get('modelListeners') || null;

            if (this.modelListeners && _.isArray(this.modelListeners) && this.modelListeners.length > 0) {
                var listenerString = "";
                _.each(this.modelListeners, function(listener) {
                    if (_.isString(listener)) {
                        listenerString += ' change:' + listener;
                    }
                }, this);
                this.listenTo(this.formModel, listenerString, function() {
                    this.render();
                }, this);
            }
            this.listenToFieldOptions();
        },
        onRender: function() {
            this.$el.addClass(this.extraClasses);
        },
        getChildView: function(item) {
            return (item.get('control'));
        },
        childViewOptions: function(model, index) {
            return {
                field: model,
                model: this.model,
                componentList: this.componentList
            };
        },
        onChildviewGetWorkflowParentContainer: function(childView, args) {
            this.triggerMethod('get:workflow:parent:container', args);
        },
        events: _.defaults({
            //Events to be Triggered By User
            "control:items": function(event, arrayValue) {
                var items = arrayValue || this.defaults.items;
                if (!(items instanceof Backbone.Collection))
                    items = new PuppetForm.Fields(items);
                this.items = items;
                this.collection.set(this.items.models);
                event.stopPropagation();
            }
        }, PuppetForm.CommonPrototype.events, PuppetForm.CommonContainerEvents.events)
    };
    var CommonPrototype = {
        setExtraClasses: PuppetForm.CommonPrototype.setExtraClasses,
        listenToFieldOptions: PuppetForm.CommonPrototype.listenToFieldOptions,
        initOptions: PuppetForm.CommonPrototype.initOptions
    };
    var ContainerControl = PuppetForm.ContainerControl = Backbone.Marionette.CompositeView.extend(
        _.defaults(ContainerPrototype, _.defaults(CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
    );

    return ContainerControl;
});

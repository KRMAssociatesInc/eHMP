define([
    'backbone',
    'puppetForm',
    'handlebars',
    'underscore'
], function(Backbone, PuppetForm, Handlebars, _) {
    'use strict';
    
    var FieldsetPrototype = {
        defaults: {
            items: [],
            extraClasses: [],
            legend: undefined
        },
        tagName: "fieldset",
        template: Handlebars.compile('{{#if legend}}<legend>{{legend}}</legend>{{/if}}'),
        initialize: function(options) {
            this.collection = new Backbone.Collection();
            this.initOptions(options);
            this.field = options.field;
            this.componentList = options.componentList;
            this.setExtraClasses();
            this.legend = this.field.get("legend") || this.defaults.legend;
            this.template = Handlebars.compile((_.isString(this.legend) ? "<legend>" + this.legend + "</legend>" : ""));
            var items = this.field.get("items") || this.defaults.items;
            if (!(items instanceof Backbone.Collection))
                items = new PuppetForm.Fields(items);
            this.items = items;
            this.collection = this.items;

            this.collection.bind('remove', this.render);
        },
        onRender: function(){
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
        events: _.defaults({}, PuppetForm.CommonPrototype.events, PuppetForm.CommonContainerEvents.events)
    };

    var CommonPrototype = {
      setExtraClasses: PuppetForm.CommonPrototype.setExtraClasses,
      initOptions: PuppetForm.CommonPrototype.initOptions
    };
    var Fieldset = PuppetForm.FieldsetControl = Backbone.Marionette.CompositeView.extend(
      _.defaults(FieldsetPrototype, _.defaults(CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
    );
    return Fieldset;
});

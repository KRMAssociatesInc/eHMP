define([
  'backbone',
  'puppetForm',
  'handlebars',
  'underscore'
], function(Backbone, PuppetForm, Handlebars, _) {
  'use strict';

  //Collection view for the content in the actual popover
  var PopoverViewPrototype = {
    formatter: PuppetForm.CommonPrototype.formatter,
    className: 'hidden',
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
    initialize: function(options) {
      this.model = options.model;
      this.field = options.field || undefined;
      this.componentList = {};
      this.containerTemplate = this.field.get('template') || undefined;
      this.containerTemplate = this.template || undefined;
      if (this.containerTemplate) {
        this.template = (_.isFunction(this.containerTemplate) ? this.containerTemplate : Handlebars.compile(this.containerTemplate));
      }

      this.items = this.field.get("items") || this.defaults.items;
      if (!(this.items instanceof Backbone.Collection))
        this.items = new PuppetForm.Fields(this.items);
      this.collection = this.items;

      this.collection.bind('remove', this.render);
    },
    onShow: function() {
      var customOptions = this.field.get('options') || {};
      this.parentButtonView = this._parentLayoutView().popoverButton;
      var self = this;
      self.popover = self.parentButtonView.$el.find('button').first()
      .popover({
        html: true,
        content: function() {
          //Returns all of the content contained in the hidden div
          return self.$('>');
        },
        placement: customOptions.placement,
        trigger: customOptions.trigger,
        delay: customOptions.delay,
        container: self.popover
      });
      self.popover.on("hide.bs.popover", function(vent) {
        var popover = self.parentButtonView.$el.find('.popover');
        popover.hide();
        self.$el.append(popover.find('.popover-content >'));
      });
      self.parentButtonView.$el.find('button').first().attr('data-original-title', this.field.get('header'));
    },
    events: _.defaults({}, PuppetForm.CommonContainerEvents.events)
  };
  //Define Popover Control Prototype
  var PopoverControlPrototype = {
    regions: {
      popoverButton: "#popoverButtonRegion",
      popoverContent: "#popoverContentRegion"
    },
    defaults: {
      options: {
        trigger: "click",
        label: 'popover',
        type: 'button',
        header: "",
        content: "",
        placement: "right",
        delay: 0
      },
      items: [],
      extraClasses: [],
      title: ""
    },
    template: Handlebars.compile([
      '<div id="popoverButtonRegion"></div>',
      '<div id="popoverContentRegion"></div>'
    ].join('\n')),
    initialize: function(options) {
      this.initOptions(options);
      this.setFormatter();
      this.listenToFieldName();
      this.setExtraClasses();
      this.field = options.field;
      this.model = options.model;
      //this.registerToComponentList(this);
      //Override the popover button type to just be a button
      this.field.attributes.type = 'button';
      this.buttonView = new PuppetForm.ButtonControl(options);
      this.popoverContentView = new PuppetForm.PopoverView({
        field: this.field,
        model: this.model
      });
    },
    onRender: function() {
      // Don't pass this.region to this function. Marionette does it for you
      // under the covers. 
      this.showChildView("popoverButton", this.buttonView);
      this.showChildView("popoverContent", this.popoverContentView);
      this.updateInvalid();
    },
    events: _.defaults({
      "control:popover:hidden": function(event, booleanValue) {
        if(_.isBoolean(booleanValue)) {
          var hideOrShowString = booleanValue ? 'hide' : 'show';
          this.popoverButton.$el.find('button').first().popover(hideOrShowString);
        }
      }
    }, PuppetForm.CommonPrototype.events)
  };

  var PopoverView = PuppetForm.PopoverView = Backbone.Marionette.CollectionView.extend(
    _.defaults(PopoverViewPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
  ); 

  var PopoverControl = PuppetForm.PopoverControl = Backbone.Marionette.LayoutView.extend(
    _.defaults(PopoverControlPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
  );
  return PopoverControl;
});

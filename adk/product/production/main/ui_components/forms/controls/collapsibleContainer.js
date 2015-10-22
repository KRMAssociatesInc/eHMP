define([
    'backbone',
    'puppetForm',
    'handlebars',
    'main/ui_components/collapsible_container/component'
], function(Backbone, PuppetForm, Handlebars, CollapsibleContainer) {
    'use strict';

    var CollapsibleContainerPrototype = {
      template: Handlebars.compile(
        '<div class="form-collapsible-container-region"/>'
      ),
      ui: {
        'FormCollapsibleContainerRegion': '.form-collapsible-container-region'
      },
      regions: {
        'FormCollapsibleContainerRegion': '@ui.FormCollapsibleContainerRegion'
      },
      defaults: {
        name: '',
        extraClasses: [],
        headerItems: [],
        collapseItems: []
      },
      buildCollections: function(headerItems, collapseItems) {
        if(!(headerItems instanceof Backbone.Collection)) {
          this.headerItems = new PuppetForm.Fields(headerItems);
        } else {
          this.headerItems = headerItems;
        }

        if(!(collapseItems instanceof Backbone.Collection)) {
          this.collapseItems = new PuppetForm.Fields(collapseItems);
        } else {
          this.collapseItems = collapseItems;
        }

        var headerObj = {
          items: _.flatten(_.reduce(this.headerItems.models, function(arr, model) {
            arr.push(model.attributes); 
            return arr;
          }, [], this)),
          name: 'headerItemsList'
        };
        var collapseObj = {
          items: _.flatten(_.reduce(this.collapseItems.models, function(arr, model) {
            arr.push(model.attributes);
            return arr;
          }, [], this)),
          name: 'collapseItemsList'
        };

        var self = this;
        _.each([headerObj, collapseObj], function(obj) {
          this[obj.name] = {
            label: obj.name,
            view: function() {
              var containerField = new PuppetForm.Field({
                control: 'container',
                items: obj.items
              });

              return new PuppetForm.ContainerControl({
                field: containerField,
                model: self.model,
                componentList: self.componentList
              });
            }()
          };
        }, this);

      },
      initialize: function(options) {
        this.collection = new Backbone.Collection();
        this.initOptions(options);
        this.setFormatter();
        this.listenToFieldName();
        this.setExtraClasses();
        this.options = options;
        var header = options.field.get('headerItems') || [];
        var collapse = options.field.get('collapseItems') || [];
        this.buildCollections(header, collapse);
        this.headerItems.on('change reset add remove', function() {
          this.buildCollections(this.headerItems, this.collapseItems);
          this.render();
        }, this);
        this.collapseItems.on('change reset add remove', function() {
          this.buildCollections(this.headerItems, this.collapseItems);
          this.render();
        }, this);
      },
      commonOnRender: PuppetForm.CommonPrototype.onRender,
      onRender: function() {
        this.commonOnRender();
        this.showChildView('FormCollapsibleContainerRegion', new CollapsibleContainer({
          name: this.field.get('name'),
          headerItems: {
            name: this.headerItemsList.label,
            view: this.headerItemsList.view
          },
          collapseItems: {
            name: this.collapseItemsList.label,
            view: this.collapseItemsList.view
          }
        }));
      },
      events: _.defaults({
        'control:collapsed': function(event, booleanValue) {
          console.log('handling');
          if(_.isBoolean(booleanValue)) {
            var showOrHideString = booleanValue ? 'hide' : 'show';
            if(booleanValue) {
              this.$el.find('button[data-toggle=collapse]').addClass('collapsed');
            } else {
              this.$el.find('button[data-toggle=collapse]').removeClass('collapsed');
            }

            this.$el.find('.collapsibleContainerCollapseRegion').collapse(showOrHideString);
          }
        },
        'control:headerItems:add': function(event, model) {
          this.addModel('headerItems', model, event);
        },
        'control:headerItems:remove': function(event, model) {
          this.removeModel('headerItems', model, event);
        },
        'control:headerItems:update': function(event, model) {
          this.updateCollection('headerItems', model, event);
        },
        'control:collapseItems:add': function(event, model) {
          this.addModel('collapseItems', model, event);
        },
        'control:collapseItems:remove': function(event, model) {
          this.removeModel('collapseItems', model, event);
        },
        'control:collapseItems:update': function(event, model) {
          this.updateCollection('collapseItems', model, event);
        } 
      }, PuppetForm.CommonPrototype.events, PuppetForm.CommonContainerEvents.events)
    };

    var CollapsibleContainerControl = PuppetForm.CollapsibleContainerControl = Backbone.Marionette.LayoutView.extend(
      _.defaults(CollapsibleContainerPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
    );

    return CollapsibleContainerControl;
});


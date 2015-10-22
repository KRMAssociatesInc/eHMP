define([
    'backbone',
    'puppetForm',
    'handlebars'
], function(Backbone, PuppetForm, Handlebars) {
    'use strict';

    var NoChildrenView = Backbone.Marionette.ItemView.extend({
      availableTemplate: Handlebars.compile('<div class="row"><div class="col-xs-12"><p>No {{keyword}} found</p></div></div>'),
      selectedTemplate: Handlebars.compile('<p>No {{keyword}} found</p>{{#each selectedItems}}<div/>{{/each}}'),
      getTemplate: function() {
        if(!(this.model.get('filter'))) {
          return this.availableTemplate;
        } else {
          return this.selectedTemplate;
        }
      },
      initialize: function(options) {
        this.model = options.model;
      },
      className: function() {
        if(!(this.model.get('filter'))) {
          return "list-group-item"; 
        }
        return 'table-row';
      },
      tagName: function() {
        if(!(this.model.get('filter'))) {
          return 'li';
        } 
        return 'div';
      }
    });
    var SelectedColumnView = Backbone.Marionette.LayoutView.extend({
      template: Handlebars.compile('<div/>'),
      ui: {
        'ColumnContainer': 'div'
      },
      regions: {
        'ColumnContainerRegion': '@ui.ColumnContainer'
      },
      initialize: function() {
        this.View = this.model.get('view');
        if(!_.isFunction(this.View.initialize)){
          this.View = new this.View();
        }
      },
      onRender: function() {
        this.showChildView('ColumnContainerRegion', this.View);
      }
    });
    var SelectedChildView = Backbone.Marionette.CompositeView.extend({
      template: Handlebars.compile([
        '<div>{{label}}</div>',
        '<div class="additionalColumns-container"/>',
        '<div>',
          '<button type="button" class="btn icon-btn icon-btn-mini pull-right checked-{{value}}" title="Press enter to {{#if value}}remove{{else}}add{{/if}} {{label}}."><i class="right-pad-sm left-pad-sm fa {{#if value}}fa-times-circle{{else}}fa-plus{{/if}}"></i></button>',
        '</div>'

      ].join('\n')),
      ui: {
        'AdditionalColumns': '.additionalColumns-container'
      },
      childViewContainer:  '@ui.AdditionalColumns',
      initialize: function(options) {
        this.attributeMapping = options.attributeMapping;
        var selectedItemsJSON = options.selectedItems;
        this.collection = new Backbone.Collection();

        if(!(selectedItemsJSON instanceof Backbone.Collection)) {
          this.selectedItemsCollection = new Backbone.Collection(selectedItemsJSON);
        } else {
          this.selectedItemsCollection = new Backbone.Collection();
        }

        this.selectedItemsCollectionContainer = this.selectedItemsCollection;

        this.listenTo(this.model, 'change', function(e) {
          this.collection = _.map(this.selectedItemsCollectionContainer.models, function(model) {
            var self = this;
            return {
              label: self.model.get(self.attributeMapping.unique),
              view: function() {
                var containerField = new PuppetForm.Field({
                  control: 'container',
                  items: [model.toJSON()]
                });

                return new PuppetForm.ContainerControl({
                  field: containerField,
                  model: self.model
                });
              }
            };
          }, this);
        }, this);

        this.collection = _.map(this.selectedItemsCollectionContainer.models, function(model) {
          var self = this;
          var obj = model.toJSON();
          obj.name = self.model.get(self.attributeMapping.unique)+'-'+model.get('name');
          return {
            label: self.model.get(self.attributeMapping.unique),
            view: function() {
              var containerField = new PuppetForm.Field({
                control: 'container',
                items: [obj]
              });

              return new PuppetForm.ContainerControl({
                field: containerField,
                model: self.model
              });
            }
          };
        }, this);
      },
      className: 'table-row',
      childView: SelectedColumnView,
      serializeModel: function(model) {
        var attributes = model.toJSON(),
          data = {
            name: attributes[this.attributeMapping.unique],
            value: attributes[this.attributeMapping.value],
            label: attributes[this.attributeMapping.label]
          };
        return data;
      },
      events: {
        'click button': 'onChange'
      },
      getValueFromDOM: function(e) {
        var booleanValue = ($(e.currentTarget).hasClass("checked-true") ? false : true);
        return booleanValue;
      },
      onChange: function(e) {
        var value = this.getValueFromDOM(e);
        this.model.set(this.attributeMapping.value, value);
      },
      onBeforeRender: function() {
        if(!(this.collection instanceof Backbone.Collection)) {
          this.collection = new Backbone.Collection(this.collection);
        }
      }
    });
    var AvailableChildView = Backbone.Marionette.ItemView.extend({
        initialize: function(options) {
            this.field = options.model.attributes;
            this.attributeMapping = options.attributeMapping;
        },
        //template: Handlebars.compile('{{ui-form-checkbox label name=name checked=value}}'),
        template: Handlebars.compile([
            '<div class="row">',
                '<div class="col-xs-10">{{label}}</div>',
                '<div class="col-xs-2">',
                    '<button type="button" class="btn icon-btn icon-btn-mini pull-right checked-{{value}}" title="Press enter to {{#if value}}remove{{else}}add{{/if}} {{label}}."><i class="right-pad-sm left-pad-sm fa {{#if value}}fa-times-circle{{else}}fa-plus{{/if}}"></i></button>',
                '</div>',
            '</div>'
        ].join("\n")),
        modelEvents: {
            'change': 'render'
        },
        tagName: 'li',
        className: 'list-group-item',
        events: {
            "click button": "onChange"
        },
        getValueFromDOM: function(e) {
            var booleanValue = ($(e.currentTarget).hasClass("checked-true") ? false : true);
            return booleanValue;
        },
        onChange: function(e) {
            var value = this.getValueFromDOM(e);
            this.model.set(this.attributeMapping.value, value);
        },
        serializeModel: function(model) {
            var attributes = model.toJSON(),
                data = {
                    name: attributes[this.attributeMapping.unique],
                    value: attributes[this.attributeMapping.value],
                    label: attributes[this.attributeMapping.label]
                };
            return data;
        }
    });
    var MultiselectSideBySideCompositePrototype = {
        defaults: {
            type: "checkbox",
            label: "",
            controlLabel: ' ',
            class: []
        },
        //formatter: PuppetForm.ControlFormatter,
        className: function() {
            return "";
        },
        getChildView: function() {
          if(!this.filter) {
            return AvailableChildView;
          } else {
            return SelectedChildView;
          }
        },
        getTemplate: function() {
          if(!this.filter) {
            return this.availableTemplate;
          } else {
            return this.selectedTemplate;
          }
        },
        selectedTemplate: Handlebars.compile([
          '<div class="faux-table {{#each extraClasses}}{{this}}{{/each}}">',
            '<div class="sr-only"> This table represents stuff</div>',
            '<div class="header">',
              '<div class="table-row">',
                  '<div>Selected</div>',
                '{{#each selectedItems}}'+
                  '<div>{{this.headerName}}</div>'+
                '{{/each}}',
                  '<div/>',
              '</div>',
            '</div>',
            '<div class="body childView-container">',
            '</div>'
        ].join('\n')),
        availableTemplate: Handlebars.compile([
            '<div class="{{#each extraClasses}}{{this}} {{/each}}panel panel-default panel-w-list-group">',
                '{{#if smallSize}}',
                '<div class="panel-heading panel-heading-small">',
                    '<div class="row">',
                        '<div class="mssbs-header mssbs-header-sm col-xs-12">',
                            '<h6>{{#if filter}}Selected {{else}}Available {{/if}}{{label}}</h6>',
                        '</div>',
                    '</div>',
                '</div>',
                '<div class="row left-pad-xs right-pad-xs">',
                    '<div class="mssbs-input mssbs-input-sm col-xs-12">',
                        '{{#if notFilter}}',
                        '<div class="control form-group bottom-margin-none">',
                            '<label for="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-modifiers-filter-results" class="sr-only">Filter</label>',
                            '<input id="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-modifiers-filter-results" type="text" class="form-control input-sm filter" name="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-filter" title="Enter text to filter the {{#if filter}}Selected{{else}}Available{{/if}} {{label}} results" placeholder="Filter Results"/>',
                        '</div>',
                        '{{/if}}',
                    '</div>',
                '</div>',
                '{{else}}',
                '<div class="panel-heading">',
                    '<div class="row">',
                        '<div class="mssbs-header col-xs-6">',
                            '<h6>{{#if filter}}Selected {{else}}Available {{/if}}{{label}}</h6>',
                        '</div>',
                        '<div class="mssbs-input col-xs-6">',
                            '{{#if notFilter}}',
                            '<div class="control form-group pull-right">',
                                '<label for="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-modifiers-filter-results" class="sr-only">Filter</label>',
                                '<input id="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-modifiers-filter-results" type="text" class="form-control input-sm filter" name="{{#if filter}}selected{{else}}available{{/if}}-{{clean-for-id label}}-filter" title="Enter text to filter the {{#if filter}}Selected{{else}}Available{{/if}} {{label}} results" placeholder="Filter Results"/>',
                            '</div>',
                            '{{/if}}',
                        '</div>',
                    '</div>',
                '</div>',
                '{{/if}}',

                //'<div class="panel-body">',
                '<ul class="list-group{{#if smallSize}} list-group-small{{/if}} childView-container{{#if (has-puppetForm-prop "controlsClassName")}} {{PuppetForm "controlsClassName"}}{{/if}}"></ul>',
                //'</div>',
            '</div>'
        ].join("\n")),
        ui: {
            'ChildViewContainer': '.childView-container'
        },
        emptyView: NoChildrenView,
        emptyViewOptions: function() {
            return {
                model: new Backbone.Model({
                    keyword: this.field.get('label'),
                    filter: this.filter,
                    selectedItems: this.selectedItems || []
                })
            };
        },
        childViewContainer: '@ui.ChildViewContainer',
        childViewOptions: function(model, index) {
            if(this.filter) {
              return {
                attributeMapping: this.attributeMapping,
                selectedItems: this.selectedItems
              };
            }
            return {
                attributeMapping: this.attributeMapping
            };
        },
        addChild: function(child, ChildView, index) {
            if (!this.filter && !child.get(this.attributeMapping.value) && _.isBoolean(child.get(this.attributeMapping.value))) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            } else if (this.filter && child.get(this.attributeMapping.value) && _.isBoolean(child.get(this.attributeMapping.value))) {
                Marionette.CollectionView.prototype.addChild.apply(this, arguments);
            }
        },
        initialize: function(options) {
            this.initOptions(options);
            this.filter = options.filter;
            this.attributeMapping = options.attributeMapping;
            this.selectedItems = options.field.get('selectedItems') || [];
            this.setFormatter();
            this.listenToFieldName();
            if (!this.filter){
                this.listenTo(this.collection, 'filterStringUpdated', this.filterCollection);
                this.listenTo(this.collection, 'change:'+this.attributeMapping.value, function(e) {
                this.filterCollection();
                });
            }

            _.each(this.selectedItems, function(item) {
              this.stopListening(this.collection, 'change:'+item.name); 
            }, this);
        },
        onRender: function() {
            this.$el.addClass(this.field.get('name'));
            this.updateInvalid();
        },
        events: {
            "keyup input.filter": "triggerFilter"
        },
        triggerFilter: function() {
            this.collection.reset(this.collection.originalModels, {
                silent: true
            });
            this.collection.trigger('filterStringUpdated');
        },
        filterCollection: function() {
            var filterString = this.$('input.filter')[0].value.toLowerCase();
            var matcher = _.bind(this.makeMatcher(filterString), this);
            this.collection.reset(this.collection.filter(matcher), {
                reindex: false
            });
        },
        makeMatcher: function(query) {
            var filterBoolean = this.filter;
            var regexp = this.makeRegExp(query);
            return function(model) {
                if (model.get(this.attributeMapping.value) === filterBoolean) {
                    var keys = this.fields || model.keys();
                    for (var i = 0, l = keys.length; i < l; i++) {
                        if (regexp.test(model.get(keys[i]) + "")) return true;
                    }
                    return false;
                }
                return true;
            };
        },
        makeRegExp: function(query) {
            return new RegExp(query.trim().split(/\s+/).join("|"), "i");
        },
        serializeModel: function(model) {
            var field = _.defaults(this.field.toJSON(), this.defaults),
                attributes = model.toJSON(),
                attrArr = field.name.split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.'),
                rawValue = this.keyPathAccessor(attributes[name], path),
                data = _.extend(field, {
                    notFilter: !this.filter,
                    filter: this.filter,
                    rawValue: rawValue,
                    value: this.formatter.fromRaw(rawValue, model),
                    attributes: attributes,
                    formatter: this.formatter,
                    smallSize: ((field.size || "normal") === "small")
                });
            return data;
        },
        clearInvalid: function() {
            this.$el.removeClass(PuppetForm.errorClassName)
                .find("." + PuppetForm.helpClassName + ".error").remove();
            return this;
        },
        updateInvalid: function() {
            var errorModel = this.model.errorModel;
            if (!(errorModel instanceof Backbone.Model)) return this;

            this.clearInvalid();

            var attrArr = this.field.get('name').split('.'),
                name = attrArr.shift(),
                path = attrArr.join('.'),
                error = errorModel.get(name);

            if (_.isEmpty(error)) return;
            if (_.isObject(error)) error = this.keyPathAccessor(error, path);
            if (_.isEmpty(error)) return;

            this.$el.addClass(PuppetForm.errorClassName);
            this.$el.append('<span class="' + PuppetForm.helpClassName + ' error">' + (_.isArray(error) ? error.join(", ") : error) + '</span>');

            return this;
        },
        keyPathAccessor: function(obj, path) {
            var res = obj;
            path = path.split('.');
            for (var i = 0; i < path.length; i++) {
                if (_.isNull(res)) return null;
                if (_.isEmpty(path[i])) continue;
                if (!_.isUndefined(res[path[i]])) res = res[path[i]];
            }
            return _.isObject(res) && !_.isArray(res) ? null : res;
        }
    };
    var MultiselectSideBySideComposite = Backbone.Marionette.CompositeView.extend(
        _.defaults(MultiselectSideBySideCompositePrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );
    var MultiselectSideBySidePrototype = {
        ui: {
            'AvailableModifiersRegion': '.available-region',
            'SelectedModifiersRegion': '.selected-region'
        },
        regions: {
            'AvailableModifiersRegion': '@ui.AvailableModifiersRegion',
            'SelectedModifiersRegion': '@ui.SelectedModifiersRegion'
        },
        className: "row control",
        attributeMappingDefaults: {
            unique: 'name',
            value: 'value',
            label: 'label'
        },
        template: Handlebars.compile([
            '<div class="mssbs">',
                '<div class="available-region col-md-6"></div><div class="selected-region col-md-6"></div>',
            '</div>'
        ].join("\n")),
        initialize: function(options) {
            this.initOptions(options);
            this.setAttributeMapping();
            this.setExtraClasses();
            this.initCollection('collection');

            // Set any undefined/nonBoolean values to false
            var undefinedValueModels = _.find(this.collection.models, function(model) {
                if (_.isBoolean(model.get(this.attributeMapping.value), this)) {
                    return false;
                }
                return true;
            }, this);
            if (undefinedValueModels) {
                undefinedValueModels.set(this.attributeMapping.value, false);
            }

            this.collection.originalModels = this.collection.models;
            this.model.set(name, this.collection);
            var self = this;
            this.listenTo(this.collection, 'change', function() {
                var currentModels = self.collection.models;
                self.collection.reset(self.collection.originalModels, {
                    silent: true
                });
                self.model.trigger('change:'+self.field.get(self.attributeMapping.unique));
                self.collection.reset(currentModels, {
                    silent: true
                });
            });

            _.each(options.field.get('selectedItems'), function(item) {
              this.stopListening(this.model, 'change:'+item.name); 
            }, this);

            this.availableModifiersView = new MultiselectSideBySideComposite({
                field: this.field,
                model: this.model,
                collection: this.collection,
                attributeMapping: this.attributeMapping,
                filter: false,
            });
            this.selectedModifiersView = new MultiselectSideBySideComposite({
                field: this.field,
                model: this.model,
                collection: this.collection,
                attributeMapping: this.attributeMapping,
                filter: true
            });

        },
        onRender: function() {
            PuppetForm.Control.prototype.onRender.apply(this, arguments);
            this.showChildView('AvailableModifiersRegion', this.availableModifiersView);
            this.showChildView('SelectedModifiersRegion', this.selectedModifiersView);
        },
        serializeModel: function(model, moreOptions) {
            var field = _.defaults(this.field.toJSON(), this.defaults);
            return field;
        }
    };

    var MultiselectSideBySide = PuppetForm.MultiselectSideBySideControl = Backbone.Marionette.LayoutView.extend(
        _.defaults(MultiselectSideBySidePrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions))
    );
    return MultiselectSideBySide;
});

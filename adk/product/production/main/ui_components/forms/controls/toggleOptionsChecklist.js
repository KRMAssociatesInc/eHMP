define([
  'backbone',
  'puppetForm',
  'handlebars',
  'underscore'
], function(Backbone, PuppetForm, Handlebars) {
  'use strict';

    
  var RowTitleView = Backbone.Marionette.ItemView.extend({
    defaults: {
      name: '',
      value: false,
      disabled: false
    },
    //Our checkbox template is wonky
    template: Handlebars.compile([
      '<label class="sr-only", for={{clean-for-id label}}/>',
      '<div class="checkbox">',
        '<input type="checkbox" name={{name}}',
          'id="checkbox-{{clean-for-id label}}"',
          'checked={{checked}}',
        '/>',
      '</div>'
    ].join('\n')),
    initialize: function(options) {
      this.field = options.field;
      this.model = options.model;
    },
    serializeModel: function() {
      var data = _.defaults(this.model.toJSON(), this.defaults); 
      data.checked = (data.value) ? 'checked' : '';
      return data;
    },
    className: 'control form-group',
  });

  var Radio = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
      '<label for={{identifier}}>',
        '<input type="radio" name={{name}} id={{identifier}} value={{value}} title="Press spacebar to select {{value}}">{{value}}',
      '</label>'
    ].join('\n'))
  });

  var RadioView = Backbone.Marionette.LayoutView.extend({
    className: 'control form-group',
    ui: {
      'YesRegion': '.radioYesRegionContainer',
      'NoRegion': '.radionNoContainer',
      'NdRegion': '.radioNdContainer'
    },
    regions: {
      'YesRegion': '@ui.YesRegion',
      'NoRegion': '@ui.NoRegion',
      'NdRegion': '@ui.NdRegion'
    },
    template: Handlebars.compile([
      '<p class="faux-label sr-only">{{description}}</p>',
      '<div class="radio">',
        '<div class="radioYesRegionContainer"/>',
        '<div class="radioNoRegionContainer"/>',
        '<div class="radioNdRegionContainer"/>',
      '</div>'
    ].join('\n')),
    buildIdentifier: function(name, value) {
      var str = name+'-'+value;
      return str;
    },
    initialize: function(options) {
      console.log(options); 
      this.name = options.model.get('name') || ''; 
      this.yesView = new Radio({
        identifier: this.buildIdentifier(this.name, 'yes'),
        name: this.name,
        value: 'yes'
      });
      this.noView = new Radio({
        identifier: this.buildIdentifier(this.name, 'no'),
        name: this.name,
        value: 'no'
      });
      this.ndView = new Radio({
        identifier: this.buildIdentifier(this.name, 'nd'),
        name: this.name,
        value: 'nd'
      });
    }
  });
  
  var RowRadiosView = Backbone.Marionette.CollectionView.extend({
    childView: RadioView,
    initialize: function(options) {
      this.collection = options.columns;
      if(!(this.collection instanceof Backbone.Collection)) {
        this.collection = new Backbone.Collection(this.collection);
      }
    }
  });

  var RowView = Backbone.Marionette.LayoutView.extend({
    legend: Handlebars.compile('<legend>{{description}}</legend>'),
    template: Handlebars.compile([
      '<fieldset>',
        '<div class="related-conditions-title"/>',
        '<div class="related-conditions-radios"/>',
      '</fieldset>'
    ].join('\n')),
    className: function() {
      var className = "related-conditions-row";
      if(this.model.get('disabled')) {
        className += ' row-disabled'; 
      } 
      return className;
    },
    ui: {
      'RelatedConditionsTitle': '.related-conditions-title',
      'RelatedConditionsRadios': '.related-conditions-radios'
    },
    regions: {
      'RelatedConditionsTitleRegion': '@ui.RelatedConditionsTitle',
      'RelatedConditionsRadiosRegion': '@ui.RelatedConditionsRadios'
    },
    initialize: function(options) {
      this.field = options.model.attributes;
      this.model = options.model;
      this.description = this.field.description || "";
      this.disabled = this.field.disabled || false; 
      this.columns = options.columns;

      this.titleView = new RowTitleView({
        field: this.field,
        model: this.model
      });
      this.radiosView = new RowRadiosView({
        field: this.field,
        model: this.model,
        columns: this.columns
      });
    },
    onRender: function() {
      this.showChildView('RelatedConditionsTitleRegion', this.titleView);
      this.showChildView('RelatedConditionsRadiosRegion', this.radiosView);
      $(this.RelatedConditionsTitleRegion.el).append(this.legend({
        description: this.description
      }));
    }
  });

  var ToggleOptionsChecklistRowsView = Backbone.Marionette.CollectionView.extend({
    childView: RowView,
    initialize: function(options) {
      this.collection = options.model;
      this.columns = options.field.get('columnHeaders');
      if(!(this.collection instanceof Backbone.Collection)) {
        this.collection = new Backbone.Collection(options.model);
      }
    },
    childViewOptions: function() {
      return {
        columns: this.columns
      };
    }
  });

  var HeaderChildView = Backbone.Marionette.ItemView.extend({
    template: Handlebars.compile([
        '<button type="button" class="btn btn-primary btn-sm center-block" aria-hidden="true">{{name}}</button>',
    ].join('\n')), 
    className: 'radios-header'
  });

  var ToggleOptionsChecklistHeaderView = Backbone.Marionette.CompositeView.extend({
    template: Handlebars.compile(
      '<div class="related-conditions-header"></div>'
    ),
    childView: HeaderChildView,
    ui: {
      'childViewContainer': 'div.related-conditions-header'
    },
    childViewContainer: '@ui.childViewContainer',
    initialize: function(options) {
      this.collection = options.collection || [];
      if(!(this.collection instanceof Backbone.Collection)) {
        this.collection = new Backbone.Collection(this.collection);
      }
    }
  });

  var ToggleOptionsChecklistPrototype = {
    template: Handlebars.compile([
      '<div class="row">',
        '<div class="col-xs-12">',
          '<p>description</p>',
        '</div>',
      '</div>',
      '<div class="row">',
        '<div class="related-conditions-container">',
          '<div class="related-conditions-header-container"/>',
          '<div class="related-conditions-rows-container"/>',
        '</div>',
      '</div>'
    ].join('\n')),
    ui: {
      'ToggleOptionsHeaderRegion': '.related-conditions-header-container',
      'ToggleOptionsRowsRegion': '.related-conditions-rows-container'
    },
    regions: {
      'ToggleOptionsHeaderRegion': '@ui.ToggleOptionsHeaderRegion',
      'ToggleOptionsRowsRegion': '@ui.ToggleOptionsRowsRegion'
    },
    defaults: {
      label: '',
      description: '',
      columnHeaders: []
    },
    initialize: function(options) {
      this.initOptions(options);
      this.setFormatter();
      this.listenToFieldName();
      this.listenToFieldOptions();
      this.setExtraClasses();
      this.modelName = this.getComponentInstanceName();
      this.initCollection('collection');

      this.columnHeaders = options.field.get('columnHeaders') || [];

      var self = this;
      this.listenTo(this.collection, 'change', function() {
        self.model.trigger('change');
      });

      this.stopListening(this.model, 'change:'+this.modelName, this.render);
      this.model.set(this.modelName, this.collection);
      this.listenTo(this.model, 'change:'+this.modelName, this.render);
    },
    onRender: function() {
      this.headerView = new ToggleOptionsChecklistHeaderView({
        collection: this.columnHeaders
      });
      this.rowView = new ToggleOptionsChecklistRowsView({
        field: this.field,
        model: this.model.get(this.modelName) || [],
      });
      this.showChildView('ToggleOptionsHeaderRegion', this.headerView);
      this.showChildView('ToggleOptionsRowsRegion', this.rowView);
    },
  };

  var ToggleOptionsChecklistControl = PuppetForm.ToggleOptionsChecklistControl = Backbone.Marionette.LayoutView.extend(
    _.defaults(ToggleOptionsChecklistPrototype, _.defaults(PuppetForm.CommonPrototype, PuppetForm.CommonEventsFunctions, PuppetForm.CommonContainerEventsFunctions))
  );

  return ToggleOptionsChecklistControl;
});

define([
  'jquery',
  'backbone',
  'marionette',
  'main/ui_components/components',
  'api/UIComponents',
  'jasminejquery'
], function($, Backbone, Marionette, UI) {
  'use strict';

  var listCollection = new Backbone.Collection([{
    name: 'first-thing',
    label: 'First Thing',
    value: false
  }, {
    name: 'second-thing',
    label: 'Second Thing',
    value: undefined
  }, {
    name: 'third-thing',
    label: 'Third Thing',
    value: true
  }, {
    name: 'fourth-thing',
    label: 'Fourth Thing',
    value: "really?"
  }]);


  var yesNoChecklistDefinition = {
    name: 'yesNoChecklist',
    label: 'List of Things',
    control: 'yesNoChecklist',
    extraClasses: ["class1", "class2"],
    collection: listCollection
  };
  var formModel = new Backbone.Model();

  describe('A yesNoChecklistControl', function() {
    describe('Basic', function() {
      beforeEach(function() {
        this.formModel = new Backbone.Model();

        var self = this;
        this.form = new UI.Form({
          model: self.formModel,
          fields: [yesNoChecklistDefinition]
        });

        this.$form = this.form.render().$el;
        $('body').append(this.$form);
      });
      it('contains the correct wrapper', function() {
        expect(this.$form.find('.control, .form-group').length).toBe(1);
      });
      it('contains the correct number of fields', function() {
        expect(this.$form.find('.childView-container > .row').length).toBe(4);
      });
      it('contains the correct extra classes', function() {
        expect(this.$form).toContainElement('fieldset.class1');
        expect(this.$form).toContainElement('fieldset.class2');
      });
    });

    describe('radio unit test', function() {
      var parent = {
        state: undefined
      };
      beforeEach(function() {
        this.formModel = new Backbone.Model();

        var self = this;
        var listCollection = new Backbone.Collection([{
          name: "Checklist Name",
          label: "Checklist Label",
          value: parent.state
        }]);

        yesNoChecklistDefinition.collection = listCollection;
        this.form = new UI.Form({
          model: self.formModel,
          fields: [yesNoChecklistDefinition]
        });

        this.$form = this.form.render().$el;
        $('body').append(this.$form);
      });
      it('should contain the correct label for the grouping', function() {
        expect(this.$form.find('p')).toHaveText("Checklist Label");
        expect(this.$form.find('p')).toHaveClass('faux-label');
      });
      it('should contain the correct option labels', function() {
        var labels = this.$form.find('label');
        expect(labels.length).toBe(3);
        var options = ['undefined', 'yes', 'no'];

        _.each(options, function(label) {
          expect(this.$form.find('label[for="Checklist Name-' + label + '"]')).toBeInDOM();
        }, this);

      });
      it('should contain the correct values for each option', function() {
        var optionIds = ['undefined', 'yes', 'no'];
        var optionValues = [undefined, 'true', 'false'];
        _.chain(_.zip(optionIds, optionValues))
          .each(function(inputSet, index) {
            expect(this.$form.find("#Checklist-Name-" + inputSet[0]))
              .toHaveProp('value', inputSet[1]);
          }, this);
      });
      describe('radio default functionality testing', function() {
        afterEach(function() {
          parent.state = (parent === undefined) ? true : (parent.state === true) ? false : true;
        });
        it('should contain the correct default value for undefined', function() {
          expect(this.$form.find('#Checklist-Name-undefined')).toBeChecked();
        });
        it('should contain the correct default value for yes', function() {
          expect(this.$form.find('#Checklist-Name-yes')).toBeChecked();
        });
        it('should contain the correct default value for no', function() {
          expect(this.$form.find('#Checklist-Name-no')).toBeChecked();
        });
      });
    });
    describe('With error', function() {
      beforeEach(function() {
        this.formModel = new Backbone.Model();

        yesNoChecklistDefinition.collection = listCollection;

        var self = this;
        this.form = new UI.Form({
          model: self.formModel,
          fields: [yesNoChecklistDefinition]
        });

        this.$form = this.form.render().$el;
        $('body').append(this.$form);

        
      });
      
      it('contains the error', function() {
        this.form.model.errorModel.set('yesNoChecklist', 'Example error');
        expect(this.$form.find('span.error')).toExist();
        expect(this.$form.find('span.error')).toHaveText('Example error');
      });
      
      it("error is removed", function() {
        this.form.model.errorModel.set('yesNoChecklist', 'Example error');
        expect(this.$form.find('span.error')).toHaveText('Example error');
        this.$form.find('#first-thing-yes').focus().click();
        expect(this.$form.find('span.error')).not.toExist();
      });
    });
  });
});
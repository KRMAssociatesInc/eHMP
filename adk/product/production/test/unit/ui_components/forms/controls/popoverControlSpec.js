define(['jquery',
       'backbone',
       'marionette',
       'main/ui_components/components',
       'api/UIComponents',
       'jasminejquery'
], function($, Backbone, Marionette, UI) {
  'use strict';

  var $form, form;

  var options = {
    placement: 'right'
  };
  var itemsArray = [{
    control: "input",
    name: "popinput",
    placeholder: "Enter text..."
  }];

  var popoverControlDefinition = {
    control: 'popover',
    type: 'button',
    name: "popover1",
    options: options,
    extraClasses: ["btn-lg"],
    items: itemsArray
  };

  var formModel = new Backbone.Model();

  describe('A popover control', function() {
    afterEach(function() {
      form.remove();
    });

    describe('Basic', function() {
      beforeEach(function() {
        form = new UI.Form({
          model: formModel,
          fields: [popoverControlDefinition]
        });

        $form = form.render().$el;

        $('body').append($form);
      });

      it('contains correct wrapper', function() {
        expect($form.find('#popoverContentRegion > .popover1').length).toBe(1);
      });

      it('contains popover trigger', function() {
        //The popover content can have buttons in it
        expect($form.children().first('button').length).toBe(1);
      });

      it('contains hidden popover content container', function() {
        expect($form.find("#popoverContentRegion").length).toBe(1);
        //Using BS hidden class doesn't register as hidden with jasmine.
        expect($form.find("#popoverContentRegion > div")).toHaveClass("hidden");
      });

      it('renders popover content in hidden container div', function() {
        expect($form.find("#popoverContentRegion")).toContainElement($('input'));
      });

      it('renders popover on show', function() {
        $form.find('button').popover('show'); 

        expect($form).toContainElement('.popover');
      });

      it('moves popover content from popover content to hidden div on hide', function() {
        $form.find("#popover1-popover-trigger-container > button").popover('show');
        $form.find('#popover1-popover-trigger-container > button').popover('hide');

        //  This is a Jasmine bug. You cannot say:
        //  expect($form.find('.popover')).not.toExist. 
        //  The above will incorrectly fail. Instead we
        //  have to query to entire document to see if the popover
        //  is a child element of the document. -_-
        expect($('document')).not.toContain('.popover');

        //Expect my popover content container to have what goes in the popover on next show
        expect($form.find('#popoverContentRegion')).toContainElement($('input'));
      });

      it('hides and shows popover when popover control events are triggered', function() {
        $('#popoverButtonRegion').trigger('control:popover:hidden', false);
        expect($form).toContainElement('.popover');

        $('#popoverButtonRegion').trigger('control:popover:hidden', true);
        expect($('document')).not.toContain('.popover');
      });
    });
    describe('popover event testing', function() {
      beforeEach(function() {
        form = new UI.Form({
          model: formModel,
          fields: [popoverControlDefinition]
        });
        this.model = {
          control: 'button',
          name: 'test'
        };
        $form = form.render().$el;
        $('body').append($form);
      });
      it('should correctly add a new control the popover collection', function() {
        expect($form.find('#popoverContentRegion button').length).toBe(0);
        $('#popoverContentRegion > ').trigger('control:items:add', this.model);
        expect($form.find('#popoverContentRegion button').length).toBe(1);
      });
      it('should correct remove a control from the popover collection', function() {
        expect($form.find('#popoverContentRegion button').length).toBe(0);
        $('#popoverContentRegion > ').trigger('control:items:add', this.model);
        expect($form.find('#popoverContentRegion button').length).toBe(1);
        $('#popoverContentRegion > ').trigger('control:items:remove', this.model);
        expect($form.find('#popoverContentRegion button').length).toBe(0);
      });
      it('should correctly reset the popover collection', function() {
        expect($form.find('#popoverContentRegion input').length).toBe(1);
        $('#popoverContentRegion > ').trigger('control:items:update', this.model);
        expect($form.find('#popoverContentRegion input').length).toBe(0);
        expect($form.find('#popoverContentRegion button').length).toBe(1);
      });
    });
  });
});

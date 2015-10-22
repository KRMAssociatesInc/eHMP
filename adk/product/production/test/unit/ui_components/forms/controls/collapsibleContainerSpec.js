define(['jquery',
       'backbone',
       'marionette',
       'main/ui_components/components',
       'api/UIComponents',
       'jasminejquery'
], function($, Backbone, Marionette, UI) {
  'use strict';


  var $form, form;

  var collapsibleContainerDefinition = {
    control: 'collapsibleContainer',
    name: 'uniqueName',
    extraClasses: ['extraClass'],
    headerItems: {
      control: 'button'       
    },
    collapseItems: {
      control: 'button'
    }
  };

  describe('A collapsible container control', function() {
    afterEach(function() {
      form.remove();
    });

    describe('basic', function() {
      beforeEach(function() {
        var formModel = new Backbone.Model();
        form = new UI.Form({
          model: formModel,
          fields: [collapsibleContainerDefinition]
        });

        $form = form.render().$el;
        $('body').append($form);
      });
      it('contains the correct wrapper', function() {
        expect($form.find('form > .control, .form-group').length).toBe(1); 
      });
      it('contains the correct header content', function() {
        expect($form.find('.collapsibleContainerHeaderRegion')).toContainElement('button'); 
      });
      it('contains the correct extra classes', function() {
        expect($form.find('form > .control, .form-group')).toHaveClass('extraClass');
      });
      it('contains the correct header content', function() {
        expect($form.find('.collapsibleContainerHeaderRegion')).toContainElement('button');
      });
      it('contains the correct container content', function() {
        expect($form.find('.collapsibleContainerCollapseRegion')).toContainElement('button'); 
      });

      it('contains the collapse button', function() {
        expect($form.find('button[data-toggle=collapse]').length).toBe(1); 
      });
      it('should toggle collapse on button click', function() {
        expect($form.find('.collapsibleContainerCollapseRegion')).not.toHaveClass('in');
        $('button[data-toggle=collapse]').click();
        expect($form.find('.collapsibleContainerCollapseRegion').css('display')).toBe('block');
      });
      it('should toggle collapse on custom control toggle event', function() {
        expect($form.find('.collapsibleContainerCollapseRegion')).not.toHaveClass('in');
        $('.collapsibleContainerContainerRegion').trigger('control:hidden', false); 
        expect($form.find('.collapsibleContainerCollapseRegion').css('display')).toBe('block');
        $('#collapsibleContainerContainerRegion').trigger('control:hidden', true); 
        expect($form.find('.collapsibleContainerCollapseRegion')).not.toHaveClass('in');
      });
    });
    describe('collapsibleContainer event testing', function() {
      beforeEach(function() {
        var formModel = new Backbone.Model();
        form = new UI.Form({
          model: formModel,
          fields: [collapsibleContainerDefinition]
        });
        this.model = {
          control: 'button',
          name: 'testbutton'
        };
        $form = form.render().$el;
        $('body').append($form);
      });
      it('should correctly add a new control to the header collection', function() {
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(1);
        $('.uniqueName').trigger('control:headerItems:add', this.model);
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(2);
      });
      it('should correctly remove a control from the header collection', function() {
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(1);
        $('.uniqueName').trigger('control:headerItems:add', this.model);
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(2);
        $('.uniqueName').trigger('control:headerItems:remove', this.model);
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(1);
      });
      it('should correctly update the header collection', function() {
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(1);
        $('.uniqueName').trigger('control:headerItems:add', this.model);
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(2);
        $('.uniqueName').trigger('control:headerItems:update', this.model);
        expect($form.find('.collapsibleContainerHeaderRegion button').length).toBe(1);
      });
    });
  });
});

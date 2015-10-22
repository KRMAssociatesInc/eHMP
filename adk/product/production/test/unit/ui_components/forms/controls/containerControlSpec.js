/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'puppetForm', 'api/UIComponents', 'jasminejquery'],
       function($, Handlebars, Backbone, Marionette, UI, PuppetForm) {

         var $form, form;

         var containerControlDefinition_1 = {
           control: 'container',
           items: [{
             control: 'button'
           }, {
             control: 'button'
           }]
         },
         containerControlDefinition_2 = {
           control: 'container',
           template: '<b>example template text</b>',
           items: [{
             control: 'input',
             label: 'Text Input Label'
           }]
         },
         containerControlDefinition_3 = {
           control: 'container',
           template: Handlebars.compile('<b>{{value1}}</b>'),
         },
         containerControlDefinition_4 = {
           control: 'container',
           tagName: 'span'
         },
         containerControlDefinition_5 = {
           control: 'container',
           extraClasses: ['special-class-1', 'special-class-2'],
         },
         formModel_1 = new Backbone.Model(),
           formModel_2 = new Backbone.Model({
           value1: 'Some value!'
         });

         describe('A container control', function() {
           afterEach(function() {
             form.remove();
           });

           describe('basic', function() {
             beforeEach(function() {
               form = new UI.Form({
                 model: formModel_1,
                 fields: [containerControlDefinition_1]
               });
               $form = form.render().$el;
               $('body').append($form);
             });

             it('contains correct number of controls', function() {
               expect($form.find('.control').length).toBe(2);
             });
             it('contains correct controls', function() {
               expect($form.find('button:submit').length).toBe(2);
             });
           });

           describe('with custom template', function() {
             beforeEach(function() {
               form = new UI.Form({
                 model: formModel_1,
                 fields: [containerControlDefinition_2]
               });
               $form = form.render().$el;
               $('body').append($form);
             });

             it('contains correct number of controls', function() {
               expect($form.find('.control').length).toBe(1);
             });
             it('contains custom template html', function() {
               expect($form).toContainHtml('<b>example template text</b>');
             });
             it('control has correct label', function() {
               expect($form.find('.control').length).toBe(1);
               expect($form.find('label')).toHaveText('Text Input Label');
             });
           });

           describe('displaying model values in template', function() {
             beforeEach(function() {
               form = new UI.Form({
                 model: formModel_2,
                 fields: [containerControlDefinition_3]
               });
               $form = form.render().$el;
               $('body').append($form);
             });

             it('contains correct number of controls', function() {
               expect($form.find('.control').length).toBe(0);
             });
             it('displays correct model value', function() {
               expect($form).toContainHtml('<b>Some value!</b>');
             });
           });

           describe('with specified tag name', function() {
             beforeEach(function() {
               form = new UI.Form({
                 model: formModel_1,
                 fields: [containerControlDefinition_4]
               });
               $form = form.render().$el;
               $('body').append($form);
             });

             it('contains correct number of controls', function() {
               expect($form.find('.controls').length).toBe(0);
             });
             it('displays correct tag name', function() {
               expect($form).toContainHtml('<span>');
             });
           });

           describe('with extra classes', function() {
             beforeEach(function() {
               form = new UI.Form({
                 model: formModel_1,
                 fields: [containerControlDefinition_5]
               });
               $form = form.render().$el;
               $('body').append($form);
             });

             it('contains correct number of controls', function() {
               expect($form.find('.controls').length).toBe(0);
             });
             it('has correct classes', function() {
               expect($form.find('div')).toHaveClass('special-class-1');
               expect($form.find('div')).toHaveClass('special-class-2');
             });
           });
           describe('container event testing', function() {
            beforeEach(function() {
              var formModel = new Backbone.Model();
              form = new UI.Form({
                model: formModel_1,
                fields: [containerControlDefinition_1]
              });
              this.model = {
                control: 'button',
                name: 'test'
              };
              $form = form.render().$el;
              $('body').append($form);
            });
            it('should correctly add a new control to the container collection', function() {
              expect($form.find('button').length).toBe(2); 
              $('form > div').trigger('control:items:add', this.model);
              expect($form.find('button').length).toBe(3); 
            });
            it('should correctly remove a control from the containers collection', function() {
              expect($form.find('button').length).toBe(2); 
              $('form > div').trigger('control:items:add', this.model);
              expect($form.find('button').length).toBe(3); 
              $('form > div').trigger('control:items:remove', this.model);
              expect($form.find('button').length).toBe(2); 
            });
            it('should correctly update a containers collection', function() {
              expect($form.find('button').length).toBe(2); 
              $('form > div').trigger('control:items:update', this.model);
              expect($form.find('button').length).toBe(1); 
            });
           });
         });
       });

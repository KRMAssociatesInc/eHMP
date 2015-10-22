/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
       function($, Handlebars, Backbone, Marionette, UI) {

         var $collapsibleContainerTestPage,
         collapsibleContainerTestPage;

         var collapsibleContainerConfig = {
           name: 'collapsible container',
           headerItems: {
             label: 'header name',
             view: Backbone.Marionette.ItemView.extend({
               template: Handlebars.compile('header content')
             })
           },

           collapseItems: {
             label: 'container name',
             view: Backbone.Marionette.ItemView.extend({
               template: Handlebars.compile('container content')
             })
           }
         };

         var collapsibleContainer = new UI.CollapsibleContainer(collapsibleContainerConfig);

         var TestView = Backbone.Marionette.LayoutView.extend({
           template: Handlebars.compile([
             '<div class="test-region"></div>'
           ].join('\n')),
           ui: {
             'TestRegion': '.test-region'
           },
           regions: {
             'TestRegion': '@ui.TestRegion'
           },
           initialize: function(options) {
             this.ViewToTest = options.view;
             if (!_.isFunction(this.ViewToTest.initialize)) {
               this.ViewToTest = new this.ViewToTest();
             }
           },
           onRender: function() {
             this.showChildView('TestRegion', this.ViewToTest);
           }
         });

         describe('A collapsible container component', function() {
           afterEach(function() {
             collapsibleContainerTestPage.remove();
           });

           describe('basic', function() {
             beforeEach(function() {
               collapsibleContainerTestPage = new TestView({
                 view: collapsibleContainer
               });
               collapsibleContainerTestPage = collapsibleContainerTestPage.render();
               $collapsibleContainerTestPage = collapsibleContainerTestPage.$el;
               $('body').append($collapsibleContainerTestPage);
             });

             it('contains the correct regions', function() {
              expect($collapsibleContainerTestPage.find('.collapsibleContainerHeaderRegion').length).toBe(1);
              expect($collapsibleContainerTestPage.find('.collapsibleContainerCollapseRegion').length).toBe(1);
             });
             it('contains the correct collapse id', function () {
              expect($collapsibleContainerTestPage.find('#collapsibleContainerCollapseRegion-collapsible-container').length).toBe(1);
             });
             it('contains the a collapse region', function() {
              expect($collapsibleContainerTestPage.find('.collapse').length).toBe(1);
             });
             it('collapse region is initially not visible', function() {
              expect($collapsibleContainerTestPage.find('.collapsibleContainerCollapseRegion')).not.toHaveClass('in');
             });
             it('contains a button for toggling the collapse', function() {
              expect($collapsibleContainerTestPage.find('button[data-toggle="collapse"]').length).toBe(1);
              expect($collapsibleContainerTestPage.find('button[data-target="#collapsibleContainerCollapseRegion-collapsible-container"]'));
             });
             it('contains the correct header content', function() {
              expect($collapsibleContainerTestPage.find('.collapsibleContainerHeaderRegion')).toHaveText('header content');
             });
             it('contains the correct collapse content', function() {
              expect($collapsibleContainerTestPage.find('.collapsibleContainerCollapseRegion')).toHaveText('container content');
             });
             it('has a visible collapse region after collapse is toggled', function() {
              expect($collapsibleContainerTestPage.find('.collapsibleContainerCollapseRegion')).not.toHaveClass('in');
              $('button[data-toggle="collapse"]').click();
              expect($collapsibleContainerTestPage.find('.collapsibleContainerCollapseRegion')).toBeVisible();
             });
           });
         });
       });



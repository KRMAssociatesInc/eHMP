/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, afterEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'puppetForm', 'api/UIComponents', 'jasminejquery'],
    function($, Handlebars, Backbone, Marionette, UI, PuppetForm) {

        var $form, form;

        var tabsControlDefinition = {
            control: "tabs",
            extraClasses: ["special-class-1", "special-class-2"],
            tabs: [{
                title: "Example Tab 1",
                items: [{
                    control: "checkbox",
                    name: "checkbox1",
                    label: "checkbox",
                    title: "Example checkbox."
                }, {
                    control: "textarea",
                    name: "textarea1",
                    label: "textarea",
                    placeholder: "Enter text..."
                }]
            }, {
                title: "Example Tab 2",
                items: [{
                    control: "radio",
                    name: "radio4",
                    title: "To select an option, use the arrow keys.",
                    label: "radio (one option disabled)",
                    options: [{
                        label: "Option 1",
                        value: "opt1",
                        title: "Option 1"
                    }, {
                        label: "Option 2",
                        value: "opt2",
                        title: "Option 2",
                        disabled: true
                    }, {
                        label: "Option 3",
                        value: "opt3",
                        title: "Option 3"
                    }]
                }]
            }, {
                title: "Example Tab 3",
                items: [{
                    control: "input",
                    name: "input5",
                    label: "Text-input-5",
                    placeholder: "Enter text...",
                    title: "Please enter a string value into input 5."
                }, {
                    control: "input",
                    name: "input6",
                    label: "Text-input-6",
                    placeholder: "Enter text...",
                    title: "Please enter a string value into input 6."
                }]
            }]
        };

        var formModel = new Backbone.Model({
            radio4: "opt1"
        });

        describe('A tabs control', function() {
            afterEach(function() {
                form.remove();
            });

            describe('basic', function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [tabsControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });

                it('contains correct number of tabs', function() {
                    expect($form.find('.tab-list-container li')).toHaveLength(3);
                });
                it('contains correct title on tabs', function() {
                    expect($form.find('li [href="#Example-Tab-1-tab-panel"]')).toHaveLength(1);
                    expect($form.find('li [href="#Example-Tab-1-tab-panel"]').text()).toContain(tabsControlDefinition.tabs[0].title);
                    expect($form.find('li [href="#Example-Tab-2-tab-panel"]')).toHaveLength(1);
                    expect($form.find('li [href="#Example-Tab-2-tab-panel"]').text()).toContain(tabsControlDefinition.tabs[1].title);
                    expect($form.find('li [href="#Example-Tab-3-tab-panel"]')).toHaveLength(1);
                    expect($form.find('li [href="#Example-Tab-3-tab-panel"]').text()).toContain(tabsControlDefinition.tabs[2].title);
                });
                it('contains correct number of controls per tab', function() {
                    expect($form.find('.tab-content-container #Example-Tab-1-tab-panel .control')).toHaveLength(2);
                    expect($form.find('.tab-content-container #Example-Tab-2-tab-panel .control')).toHaveLength(1);
                    expect($form.find('.tab-content-container #Example-Tab-3-tab-panel .control')).toHaveLength(2);
                });
                it('displays tab content when tab is clicked', function() {
                    // ie. add class active to both tab and content
                    expect($form.find('.tab-list-container .active')).toHaveLength(1);
                    expect($form.find('.tab-content-container .active')).toHaveLength(1);
                    expect($form.find('.tab-content-container #Example-Tab-1-tab-panel')).toHaveClass('active');
                    // click tab
                    $form.find('li [href="#Example-Tab-2-tab-panel"]').trigger('click');
                    expect($form.find('.tab-list-container .active')).toHaveLength(1);
                    expect($form.find('.tab-content-container .active')).toHaveLength(1);
                    expect($form.find('.tab-list-container li [href="#Example-Tab-2-tab-panel"]').closest('li')).toHaveClass('active');
                    expect($form.find('.tab-content-container #Example-Tab-2-tab-panel')).toHaveClass('active');
                });
                it('displayed controls change model as expected', function() {
                    expect($form.find('.tab-content-container #Example-Tab-2-tab-panel .control')).toHaveLength(1);
                    $form.find('li [href="#Example-Tab-2-tab-panel"]').trigger('click');
                    expect($form.find('.tab-list-container .active')).toHaveLength(1);
                    expect($form.find('.tab-content-container .active')).toHaveLength(1);
                    expect($form.find('.tab-list-container li [href="#Example-Tab-2-tab-panel"]').closest('li')).toHaveClass('active');
                    expect($form.find('.tab-content-container #Example-Tab-2-tab-panel')).toHaveClass('active');
                    $form.find('.tab-content-container .active #radio4-opt3').trigger('click');
                    expect($form.find('.tab-content-container .active #radio4-opt3')).toHaveProp('checked');
                    expect(form.model.get(tabsControlDefinition.tabs[1].items[0].name)).toBe(tabsControlDefinition.tabs[1].items[0].options[2].value);

                });
            });

            describe('with extra classes', function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [tabsControlDefinition]
                    });
                    $form = form.render().$el;
                    $('body').append($form);
                });

                it('has correct classes', function() {
                    expect($form.find('.special-class-1')).toHaveClass('special-class-1');
                    expect($form.find('.special-class-1')).toHaveLength(1);
                    expect($form.find('.special-class-2')).toHaveClass('special-class-2');
                    expect($form.find('.special-class-2')).toHaveLength(1);
                });
            });
            describe("using trigger to dynamically change attributes", function() {
                beforeEach(function() {
                    form = new UI.Form({
                        model: formModel,
                        fields: [tabsControlDefinition]
                    });
                    $form = form.render().$el;
                    $("body").append($form);
                });
                it("hidden", function() {
                    $form.find('.special-class-1').trigger("control:hidden", true);
                    expect($form.find('.special-class-1')).toHaveClass('hidden');
                    $form.find('.special-class-1').trigger("control:hidden", false);
                    expect($form.find('.special-class-1')).not.toHaveClass('hidden');
                });
            });
            describe('container event testing', function() {
              beforeEach(function() {
                form = new UI.Form({
                  model: formModel,
                  fields: [tabsControlDefinition]
                });
                this.model = {
                  title: 'Test tab',
                  items: [{
                    control: 'button',
                    name: 'test'
                  }]
                };
                $form = form.render().$el;
                $('body').append($form);
              });
              it('should correctly add a new control to the container collection', function() {
                expect($form.find('.tab-list-container li')).toHaveLength(3);
                $('.tabs-control').trigger('control:items:add', this.model);
                expect($form.find('.tab-list-container li')).toHaveLength(4);
              });
              it('should correctly remove a control from the containers collection', function() {
                expect($form.find('.tab-list-container li')).toHaveLength(3);
                $('.tabs-control').trigger('control:items:add', this.model);
                expect($form.find('.tab-list-container li')).toHaveLength(4);
                $('.tabs-control').trigger('control:items:remove', this.model);
                expect($form.find('.tab-list-container li')).toHaveLength(3);
              });
              it('should correctly update a containers collection', function() {
                expect($form.find('.tab-list-container li')).toHaveLength(3);
                $('.tabs-control').trigger('control:items:update', this.model);
                expect($form.find('.tab-list-container li')).toHaveLength(1);
              });
            });

        });

    });

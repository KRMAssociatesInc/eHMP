/**
 * Created by alexluong on 6/17/15.
 */

/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function($, Handlebars, Backbone, Marionette, UI) {
        var $workflowTestPage,
            workflowTestPage;

        var formView1 = UI.Form.extend({
            fields: [{
                control: 'input',
                name: 'input1'
            }, {
                control: 'button',
                type: 'button',
                id: 'form1-previous'
            }, {
                control: 'button',
                type: 'button',
                id: 'form1-next'
            }, {
                control: 'button',
                type: 'button',
                id: 'form1-goToIndex1'
            }],
            events: {
                'click #form1-next': function(e) {
                    this.workflow.goToNext();
                },
                'click #form1-goToIndex1': function(e) {
                    this.workflow.goToIndex(1);
                }
            }
        });
        var formView2 = UI.Form.extend({
            fields: [{
                control: 'input',
                name: 'input2'
            }, {
                control: 'button',
                type: 'button',
                id: 'form2-previous'
            }, {
                control: 'button',
                type: 'button',
                id: 'form2-next'
            }],
            events: {
                'click #form2-previous': function(e) {
                    this.workflow.goToPrevious();
                }
            }
        });
        var formModel = new Backbone.Model({
            input1: ''
        });
        var workflowOptions = {
            title: 'Workflow Title',
            showProgress: true,
            steps: [{
                view: formView1,
                viewModel: formModel,
                stepTitle: 'Step 1'
            }, {
                view: formView2,
                viewModel: formModel,
                stepTitle: 'Step 2'
            }]
        };
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

        describe('A workflow component', function() {
            var $form1, $form2, testWorkflow;

            afterEach(function() {
                workflowTestPage.remove();
                testWorkflow = null;
            });
            describe('basic', function() {
                beforeEach(function() {
                    testWorkflow = new UI.Workflow(workflowOptions);
                    testWorkflow.show();

                    workflowTestPage = new TestView({
                        view: testWorkflow
                    });
                    workflowTestPage = workflowTestPage.render();
                    $workflowTestPage = workflowTestPage.$el;
                    $('body').append($workflowTestPage);

                    $form1 = $workflowTestPage.find('.workflow-controller form')[0];
                    $form2 = $workflowTestPage.find('.workflow-controller form')[1];
                });

                it('header exists', function() {
                    expect($workflowTestPage.find('.workflow-header')).toBeInDOM();
                });
                it('header contains correct title', function() {
                    expect($('#main-workflow-label')).toContainText(workflowOptions.title);
                });

                it('progress indicator exists', function() {
                    expect($workflowTestPage.find('.progress-indicator')).toBeInDOM();
                });
                it('progress indicator contains correct number of indicators', function() {
                    expect($workflowTestPage.find('.progress-indicator li').length).toBe(workflowOptions.steps.length);
                });
                it('progress indicator adjusts on step navigation', function() {
                    expect($workflowTestPage.find('.progress-indicator li div')[0]).toHaveClass('completed');
                    expect($workflowTestPage.find('.progress-indicator li div')[1]).not.toHaveClass('completed');
                    $('#form1-next').click();
                    expect($workflowTestPage.find('.progress-indicator li div')[0]).toHaveClass('completed');
                    expect($workflowTestPage.find('.progress-indicator li div')[1]).toHaveClass('completed');
                    $('#form2-previous').click();
                });

                it('controller exists', function() {
                    expect($workflowTestPage.find('.workflow-controller')).toBeInDOM();
                });
                it('controller contains correct number of step forms', function() {
                    expect($workflowTestPage.find('.workflow-controller form').length).toBe(workflowOptions.steps.length);
                });

                it('navigates between steps', function() {
                    expect($form1).not.toHaveClass('hidden');
                    expect($form2).toHaveClass('hidden');

                    $('#form1-next').click();
                    expect($form1).toHaveClass('hidden');
                    expect($form2).not.toHaveClass('hidden');

                    $('#form2-previous').click();
                    expect($form1).not.toHaveClass('hidden');
                    expect($form2).toHaveClass('hidden');

                    $('#form1-goToIndex1').click();
                    expect($form1).toHaveClass('hidden');
                    expect($form2).not.toHaveClass('hidden');

                    $('#form1-goToIndex1').click();
                    expect($form1).toHaveClass('hidden');
                    expect($form2).not.toHaveClass('hidden');
                });

                it('persists data between steps', function() {
                    var $input1 = $('#input1');
                    $input1.attr('value', 'new input1 value');
                    expect($input1).toHaveAttr('value', 'new input1 value');
                    $('#form1-next').click();
                    expect($input1).toHaveAttr('value', 'new input1 value');
                    $('#form2-previous').click();
                    expect($input1).toHaveAttr('value', 'new input1 value');
                });

                it('getFormView returns correct form view', function() {
                    testWorkflow.getFormView(0).render();
                    var $testFormView = testWorkflow.getFormView(0).$el;

                    expect($testFormView).toEqual($form1);
                    expect($testFormView).not.toEqual($form2);
                });
            });

            describe('with action items', function() {
                var mockClick = null;
                beforeEach(function() {
                    mockClick = jasmine.createSpy('mockClick');
                    testWorkflow = new UI.Workflow({
                        title: 'Workflow Title',
                        showProgress: true,
                        steps: [{
                            view: formView1,
                            viewModel: formModel,
                            stepTitle: 'Step 1'
                        }],
                        headerOptions: {
                            actionItems: [{
                                label: 'Close',
                                onClick: mockClick
                            }]
                        }
                    });
                    testWorkflow.show();

                    workflowTestPage = new TestView({
                        view: testWorkflow
                    });
                    workflowTestPage = workflowTestPage.render();
                    $workflowTestPage = workflowTestPage.$el;
                    $('body').append($workflowTestPage);
                    $form1 = $workflowTestPage.find('.workflow-controller form')[0];
                });

                it('action item dropdown icon exists', function() {
                    expect($workflowTestPage.find('.modal-header .header-btns .dropdown')).toBeInDOM();
                    expect($workflowTestPage.find('.modal-header button.btn.icon-btn.dropdown-toggle')).toBeInDOM();
                    expect($workflowTestPage.find('.modal-header button.btn.icon-btn.dropdown-toggle')).toHaveId('action-items-dropdown');
                    expect($workflowTestPage.find('.modal-header i.fa.fa-gear')).toBeInDOM();
                    expect($workflowTestPage.find('.modal-header ul.dropdown-menu.dropdown-menu-right')).toBeInDOM();
                    expect($workflowTestPage.find('.modal-header ul.dropdown-menu.dropdown-menu-right')).toHaveAttr('aria-labelledby', 'action-items-dropdown');
                    expect($workflowTestPage.find('.modal-header ul.dropdown-menu.dropdown-menu-right')).toHaveAttr('role', 'menu');
                });
                it('correct action items appear in dropdown', function() {
                    expect($workflowTestPage.find('.modal-header ul li').length).toBe(1);
                    expect($workflowTestPage.find('.modal-header ul li')).toHaveAttr('role', 'presentation');
                    expect($workflowTestPage.find('.modal-header ul li a')).toHaveAttr('role', 'menuitem');
                    expect($workflowTestPage.find('.modal-header ul li a')).toHaveAttr('href', '#');
                    expect($workflowTestPage.find('.modal-header ul li a')).toContainText('Close');
                });
                it('correct event gets fired when clicking an action item', function() {
                    expect(mockClick).not.toHaveBeenCalled();
                    $workflowTestPage.find('.modal-header ul li a').click();
                    expect(mockClick).toHaveBeenCalled();
                    expect(mockClick.calls.count()).toEqual(1);
                });
            });
        });
    });
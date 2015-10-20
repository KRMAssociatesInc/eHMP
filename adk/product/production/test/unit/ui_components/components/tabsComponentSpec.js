/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $tabsTestPage,
            tabsTestPage;

        var tabsConfig = [{
            label: 'Tab 1',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 1 content')
            })
        }, {
            label: 'Tab 2',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 2 content')
            })
        }, {
            label: 'Tab 3',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 3 content')
            })
        }, {
            label: 'Tab 4',
            view: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('tab 4 content')
            })
        }];

        var testTabs = new UI.Tabs({tabs: tabsConfig});
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

        describe('A tabs component', function() {

            afterEach(function() {
                tabsTestPage.remove();
            });

            describe('basic', function() {
                beforeEach(function() {
                    tabsTestPage = new TestView({
                        view: testTabs
                    });
                    tabsTestPage = tabsTestPage.render();
                    $tabsTestPage = tabsTestPage.$el;
                    $('body').append($tabsTestPage);
                });

                it('contains correct number of tab containers', function() {
                    expect($tabsTestPage.find('.tab-list-container li').length).toBe(4);
                    expect($tabsTestPage.find('.tab-content-container .tab-pane').length).toBe(4);
                });
                it('contains correct title on tabs', function() {
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-1-tab-panel"]')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-1-tab-panel"]').text()).toContain(tabsConfig[0].label);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-2-tab-panel"]')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-2-tab-panel"]').text()).toContain(tabsConfig[1].label);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-3-tab-panel"]')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-3-tab-panel"]').text()).toContain(tabsConfig[2].label);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-4-tab-panel"]')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-4-tab-panel"]').text()).toContain(tabsConfig[3].label);
                });
                it('contains correct content per tab', function() {
                    expect($tabsTestPage.find('.tab-content-container #Tab-1-tab-panel')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container #Tab-1-tab-panel div div')).toHaveText('tab 1 content');
                    expect($tabsTestPage.find('.tab-content-container #Tab-2-tab-panel')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container #Tab-2-tab-panel div div')).toHaveText('tab 2 content');
                    expect($tabsTestPage.find('.tab-content-container #Tab-3-tab-panel')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container #Tab-3-tab-panel div div')).toHaveText('tab 3 content');
                    expect($tabsTestPage.find('.tab-content-container #Tab-4-tab-panel')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container #Tab-4-tab-panel div div')).toHaveText('tab 4 content');
                });
                it('displays tab content when tab is clicked', function() {
                    // ie. add class active to both tab and content
                    expect($tabsTestPage.find('.tab-list-container .active')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container .active')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container #Tab-1-tab-panel')).toHaveClass('active');
                    // click tab
                    $tabsTestPage.find('li [href="#Tab-2-tab-panel"]').trigger('click');
                    expect($tabsTestPage.find('.tab-list-container .active')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-content-container .active')).toHaveLength(1);
                    expect($tabsTestPage.find('.tab-list-container li [href="#Tab-2-tab-panel"]').closest('li')).toHaveClass('active');
                    expect($tabsTestPage.find('.tab-content-container #Tab-2-tab-panel')).toHaveClass('active');
                });
            });

        });

    });

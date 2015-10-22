/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function($, Handlebars, Backbone, Marionette, UI) {

        var $alertTestPage,
            alertTestPage;

        var alertConfig = {
            title: "Example Alert",
            icon: "fa-info",
            messageView: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile(['<p>Example Message Text</p>'].join('\n'))
            }),
            footerView: Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile([
                    '<button class="cancel-button" type="button">Cancel</button>',
                    '{{ui-button "Continue" classes="continue-button" type="button"}}'
                ].join('\n')),
                events: {
                    'click .cancel-button': function(e) {
                        UI.Alert.hide();
                    },
                    'click .continue-button': function(e) {
                        UI.Alert.hide();
                    }
                }
            })
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
                // this.ViewToTest.show();
            }
        });

        describe('An alert component', function() {

            afterEach(function() {
                alertTestPage.remove();
            });

            describe('basic', function() {
                beforeEach(function() {
                    var alertTestView = new UI.Alert(alertConfig);
                    alertTestPage = new TestView({
                        view: alertTestView
                    });
                    alertTestPage = alertTestPage.render();
                    $alertTestPage = alertTestPage.$el;
                    $('body').append($alertTestPage);
                });

                it('contains correct alert-related classes', function() {
                    expect($alertTestPage.find('.modal .alert-container.modal-dialog .modal-content')).toHaveLength(1);
                });
                it('header contains correct title from config', function() {
                    expect($alertTestPage.find('.alert-container h4.modal-title')).toHaveLength(1);
                    expect($alertTestPage.find('.alert-container h4.modal-title')).toContainText(alertConfig.title);
                });
                it('header contains correct icon from config', function() {
                    expect($alertTestPage.find('.alert-container h4.modal-title i')).toHaveLength(1);
                    expect($alertTestPage.find('.alert-container h4.modal-title i')).toHaveClass(alertConfig.icon);
                });
                xit('calling hide removes the alert from view', function() {
                    expect($alertTestPage.find('.alert-container')).toHaveLength(1);
                    UI.Alert.hide();
                    expect($('body')).toBeEmpty();

                });
            });

        });

    });

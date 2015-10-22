/*jslint node: true, nomen: true, unparam: true */
/*global jquery, $, _, define, Marionette, describe, it, expect, beforeEach, spyOn */

'use strict';

// Jasmine Unit Testing Suite
define(['hbs!index', 'jquery', 'handlebars', 'backbone', 'marionette', 'main/ui_components/components', 'api/UIComponents', 'jasminejquery'],
    function(IndexTemplate, $, Handlebars, Backbone, Marionette, UI) {

        var $notificationTestPage,
            notificationTestPage;

        var notificationConfig = {
            title: "Example Notification",
            icon: "fa-info",
            message: "Example notification message",
            type: "basic"
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
            },
            onRender: function() {
                // this.showChildView('TestRegion', this.ViewToTest);
                this.ViewToTest.show();
            }
        });

        // var fixture = setFixtures(IndexTemplate);
        describe('A notification component', function() {

            afterEach(function() {
                $('.growl-alert').remove();
                // UI.Notification.hide();
                notificationTestPage.remove();
            });

            describe('basic', function() {
                beforeEach(function() {
                    var notificationTestView = new UI.Notification(notificationConfig);
                    notificationTestPage = new TestView({
                        view: notificationTestView
                    });
                    notificationTestPage = notificationTestPage.render();
                    $notificationTestPage = notificationTestPage.$el;
                    // fixture.find('.center-region').append($notificationTestPage);
                    $('body').append($notificationTestPage);
                });

                it('contains correct notification-related classes', function() {
                    expect($('.growl-alert .alert-content .notify-message')).toHaveLength(1);
                });
                it('contains correct title from config', function() {
                    // if there is more than one notification, ensure that the hide functionality is stinll working
                    expect($('.growl-alert .alert-content .notify-message [data-notify="title"]')).toHaveLength(1);
                    expect($('.growl-alert .alert-content .notify-message [data-notify="title"]')).toHaveText(notificationConfig.title);
                });
                it('contains correct icon from config', function() {
                    expect($('.growl-alert .alert-content span[data-notify="icon"]')).toHaveLength(1);
                    expect($('.growl-alert .alert-content span[data-notify="icon"]')).toHaveClass(notificationConfig.icon);
                });
                it('contains correct message from config', function() {
                    expect($('.growl-alert .alert-content .notify-message [data-notify="message"]')).toHaveLength(1);
                    expect($('.growl-alert .alert-content .notify-message [data-notify="message"]').text()).toBe(notificationConfig.message);
                });
                it('contains correct type from config', function() {
                    expect($('.growl-alert')).toHaveLength(1);
                    expect($('.growl-alert')).toHaveClass(notificationConfig.type);
                });
                it('contains dismiss button', function() {
                    expect($('.growl-alert .alert-content button[data-notify="dismiss"]')).toHaveLength(1);
                    // $('.growl-alert .alert-content button[data-notify="dismiss"]').click();
                    // expect($('.growl-alert')).toHaveLength(0);
                });
            });

        });

    });

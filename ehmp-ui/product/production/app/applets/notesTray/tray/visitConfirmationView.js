define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/notesTray/tray/visitConfirmationTemplate',
    'hbs!app/applets/notesTray/tray/visitConfirmationFooterTemplate'
], function(Backbone, Marionette, _, confTemplate, footerTemplate) {
    'use strict';
    var channel = ADK.Messaging.getChannel('notesTray');

    var FooterView = Backbone.Marionette.ItemView.extend({
        template: footerTemplate,
        events: {
         'click #btn-notes-visit-conf-yes': 'selectVisit',
         'click #btn-notes-visit-conf-no': 'cancelVisit',
        },
        selectVisit: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            ADK.UI.Alert.hide();
            channel.trigger('notestray:selectvisit');
            //var visitChannel = ADK.Messaging.getChannel('visit');
            //visitChannel.command('openVisitSelector', 'note_add_edit');
            //visitChannel.on('set-visit-success:note_add_edit', function() {
            //    ADK.UI.Alert.hide();channel.trigger('notestray:visitselect');
            //});
        },
        cancelVisit: function(event) {
            event.preventDefault();
            event.stopImmediatePropagation();
            ADK.UI.Alert.hide();
            channel.trigger('notestray:visitcancel');
        }
    });

    var BodyView = Backbone.Marionette.LayoutView.extend({
        template: confTemplate,
        className: 'no-scroll'
    });

    return function() {
        this.showModal = function(event) {
            var visitAlertView = new ADK.UI.Alert({
                title: 'Missing encounter information',
                icon: 'fa-exclamation-triangle',
                messageView: BodyView,
                footerView: FooterView
            });
            visitAlertView.show();
        };
    };

});

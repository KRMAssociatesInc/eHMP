define([
    'backbone',
    'marionette',
    'handlebars',
    'hbs!app/applets/notesTray/writeback/saveErrorFooterTemplate',
], function(Backbone, Marionette, Handlebars, saveErrorFooterTemplate) {

    var channel = ADK.Messaging.getChannel('notesTray');

    var BodyView = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('Failed to save note. Review log.'),

    });

    var FooterView = Backbone.Marionette.ItemView.extend({
        template: saveErrorFooterTemplate,
        events: {
            'click .ok-button': function(event) {
                if (this.triggerSave) {
                    channel.trigger('note:saved');
                }
            }
        }
    });

    return {
        showModal: function(fClose) {
            var errorAlertView = new ADK.UI.Alert({
                title: 'Error',
                icon: 'fa-exclamation-triangle',
                messageView: BodyView,
                footerView: FooterView.extend({
                    triggerSave: fClose
                })
            });
            errorAlertView.show();
        }
    };
});

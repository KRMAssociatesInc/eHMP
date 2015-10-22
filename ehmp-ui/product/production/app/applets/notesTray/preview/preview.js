define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/notesTray/preview/notePreviewTemplate'
], function(Backbone, Marionette, _, previewTemplate) {
    'use strict';

    var previewView = Backbone.Marionette.ItemView.extend({
        template: previewTemplate,
        events: {
            'click #preview-close-btn': 'triggerClose',
            'keyup': function(e) {
                if (e.keyCode === 27) {
                    this.triggerClose(e);
                }
            }
        },
        initialize: function(options) {
            var encounterName = options.model.get('encounterName');
            var encounterDisplayName = null;
            var encounterInfo = null;
            var encounterDate = null;
            var encounterDateStr = null;
            if (encounterName) {
                if (encounterName.length > 16) {
                    // handle encounterName in format "General Medicine05/27/2005 10:00"
                    encounterDateStr = encounterName.substring(encounterName.length - 16);
                    if (encounterDateStr.split('/').length === 3) {
                        encounterInfo = encounterName.substring(0, encounterName.length - 16);
                        encounterDate = moment(encounterDateStr, 'MM/DD/YYYY HH:mm').format('MM/DD/YYYY');
                        encounterDisplayName = encounterInfo.trim() + ': ' + encounterDate;
                    }
                }
                if (!encounterDisplayName && encounterName.length > 12) {
                    // handle encounterName in format "General Medicine May 27, 2005"
                    encounterInfo = encounterName.substring(0, encounterName.length - 12);
                    encounterDateStr = encounterName.substring(encounterName.length - 12);
                    encounterDate = moment(encounterDateStr, 'MMM DD, YYYY').format('MM/DD/YYYY');
                    encounterDisplayName = encounterInfo.trim() + ': ' + encounterDate;
                }
            }
            if (!encounterDisplayName) {
                encounterDisplayName = encounterName;
            }
            options.model.set('encounterDisplayName', encounterDisplayName);
        },
        triggerClose: function(e) {
            e.preventDefault();
            ADK.Messaging.getChannel('notesTray').trigger('close:preview', this.model);
            this.trigger('close');
        }
    });

    return previewView;
});
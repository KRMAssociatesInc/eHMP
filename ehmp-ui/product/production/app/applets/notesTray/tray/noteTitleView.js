define([
    'backbone',
    'marionette',
    'underscore',
    "api/Messaging",
    "hbs!app/applets/notesTray/tray/noteTitleTemplate",
    'app/applets/notesTray/tray/notesCollectionHandler'
], function(Backbone, Marionette, _, Messaging, TitleTemplate, modelUtil) { //, form
    'use strict';

    var noteTitleView = Backbone.Marionette.ItemView.extend({
        template: TitleTemplate,
        tagName: "li",
        //className: 'note-group-item-container',

        events: {
            "keyup": "selectNote",
            'mousedown': 'selectNoteChangeFocus',
            "mouseup": "selectNote"
        },

        initialize: function(){
          this.$el.attr('data-uid', this.model.get("uid"));
          var id = this.model.get('statusDisplayName') +'-note-list-item-'+ this.model.get('uid');
          $(this.el).attr('id',id);
        },
        templateHelpers: function(value) {
            var model = this.model;
            return {
                editable: function() {
                    return model.get('status') === 'UNSIGNED' && model.get('app') === 'ehmp';
                },
                formattedReferenceDate: function() {
                    var isDate = moment(model.get('referenceDateTime'), 'YYYYMMDDHHmmssSSS').isValid();
                    if(isDate) {
                        return moment(model.get('referenceDateTime'), 'YYYYMMDDHHmmssSSS').format('MM/DD/YYYY - HH:mm');
                    }
                    //return '&nbsp;';
                    return'';
                }
            };
        },
        selectNoteChangeFocus: function(event) {
            event.preventDefault();
            /*if ($(event.target).is('.edit-btn')  || $(event.target).is('.edit-note-btn')) {
                $('#patientDemographic-notes').focus();
            }*/
        },
        selectNote: function(event) {
            event.preventDefault();
            /*if ($(event.target).is('.edit-btn') || $(event.target).is('.edit-note-btn')) {
                ADK.Messaging.getChannel('patient-notes').trigger('editNote-btn', this.model);
            }*/

        }
    });

    return noteTitleView;
});
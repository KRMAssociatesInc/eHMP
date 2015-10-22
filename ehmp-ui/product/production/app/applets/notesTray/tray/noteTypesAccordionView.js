define([
    'backbone',
    'marionette',
    'underscore',
    "app/applets/notesTray/tray/noteTypeView",
    "app/applets/notesTray/tray/notesCollectionHandler"
], function(Backbone, Marionette, _, TypeView, modelUtil) {
    'use strict';
    var Title = Backbone.Model.extend({});
    var channel = ADK.Messaging.getChannel('notesTray');

    var Titles = Backbone.Collection.extend({
        model: Title
    });

    var Type = Backbone.Model.extend({});

    var Types = Backbone.Collection.extend({
        model: Type
    });
    var savedNoteUid = '';

    var notesAccordionView = Backbone.Marionette.CollectionView.extend({
        id: 'notes-accordion',
        className: 'accordion-container panel-group small',
        childView: TypeView,
        initialize: function() {
            modelUtil.initNotes();
            var self = this;
            this.collection = modelUtil.getModel();
            this.listenTo(channel, 'notestray:opening', function() {
                modelUtil.initNotes();
            });
            this.listenTo(channel, 'notestray:select', function(uid) {
                savedNoteUid = uid;
            });
            channel.on('notes:retrieved', function(count) {
                if (savedNoteUid) {
                    self.doSelect(savedNoteUid);
                }
            });
        },
        events: {
            'click li' : 'selectNote',
            'keyup li' : 'selectNote'
        },
        selectNote: function(event) {
            event.preventDefault();
            var newNote = $(event.currentTarget);
            var newNoteUid = newNote.data('uid');
            this.doSelect(newNoteUid);
        },
        doSelect: function(uid) {
            savedNoteUid = uid;
            var prevNote = $('.list-item-selected');
            if (prevNote.size() > 0) {
                var prevNoteUid = prevNote.data('uid');
                var prevNoteModel = modelUtil.getModelByUid(prevNoteUid);
                prevNote.removeClass('list-item-selected');
                ADK.Messaging.getChannel('notesTray').trigger('notes:deselected', prevNoteModel);
            }
            var newNote = $("ul").find("[data-uid='" + uid + "']");

            var newNoteModel = modelUtil.getModelByUid(uid);
            if (newNoteModel) {
                newNote.addClass('list-item-selected');
                ADK.Messaging.getChannel('notesTray').trigger('notes:selected', newNoteModel);
            }

        }
    });
    return notesAccordionView;
});
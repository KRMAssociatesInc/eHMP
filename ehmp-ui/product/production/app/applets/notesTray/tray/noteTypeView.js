define([
    'backbone',
    'marionette',
    'underscore',
    "hbs!app/applets/notesTray/tray/noteTypeTemplate",
    "app/applets/notesTray/tray/noteTitleView",
], function(Backbone, Marionette, _, NoteGroupTemplate, TitleView, modelUtil) {
    'use strict';

    var noteTypeView = Backbone.Marionette.CompositeView.extend({
        template: NoteGroupTemplate,
        className: 'panel panel-default',
        childView: TitleView,

        childViewContainer: function() {
            return "#" + this.model.get('id') + "-notes-container";
        },

        initialize: function() {
            this.collection = this.model.get('notes');
            this.collection.bind("reset", this.reset, this);
            this.collection.bind("change", this.render, this);
        },

    });
    return noteTypeView;
});
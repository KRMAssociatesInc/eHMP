define([
    'backbone',
    'marionette',
    'underscore',
    'handlebars',
    "api/Messaging",
    //"hbs!main/components/patient/notes/noteTitlesListTemplate",
    //"main/components/patient/notes/noteTitlesSublistView",
], function(Backbone, Marionette, _,handlebars, Messaging) {
    'use strict';
    var DEBUG = true;
    var notesOperationView = Backbone.Marionette.LayoutView.extend({
        tagName: 'div',
        className: 'operations-tray',
        template: handlebars.compile("<div id='notes-operations-container'></div>"),
        regions: {
            noteOperationsRegion: '#notes-operations-container'
        },
        //attributes: {
        //    'id': 'note-operations-tray',
        //},
        initialize: function() {
            if(DEBUG) console.log("ProxyView---->>initialize");
            Messaging.getChannel("notes-add-edit").on('note:Operations', this.eventHandler, this);
        },
        eventHandler: function(obj) {
            if(DEBUG) console.log("ProxyView---->>eventHandler "+obj.command);
            switch(obj.command) {
                case "NewNote":
                case "EditNote":
                    //this.getRegion('noteOperationsRegion').show(obj.view);
                    //this.showChildView('noteOperationsRegion', obj.view);
                    this.noteOperationsRegion.show(obj.view);
                    this.showFormTray();
                    break;
                case "CloseNoteForm":
                    this.hideFormTray();
                    break;                    
                default:
                console.log("ProxyView---->>eventHandler -> unknown command");
            } 
        },
        showFormTray: function(){
            if(DEBUG) console.log("ProxyView---->>showFormTray");
            if($("#notes-modify-container")){
                $("#notes-modify-container").addClass('show-notes-form');
            }
        },
        hideFormTray: function(){
            if(DEBUG) console.log("ProxyView---->>showFormTray");
            if($("#notes-modify-container")){
                $("#notes-modify-container").removeClass('show-notes-form');
            }            
        },
        onRender: function() {
            if(DEBUG) console.log("ProxyView---->>onRender");
         },
        onDestroy: function() {
            if(DEBUG) console.log("ProxyView---->>onDestroy");
         }
    });
    return notesOperationView;
});
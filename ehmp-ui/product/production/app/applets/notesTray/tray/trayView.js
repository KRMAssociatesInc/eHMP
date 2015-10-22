define([
    'backbone',
    'marionette',
    'underscore',
    'hbs!app/applets/notesTray/tray/trayTemplate',
    "app/applets/notesTray/tray/noteTypesAccordionView",
    "app/applets/notesTray/tray/visitConfirmationView"
], function(Backbone, Marionette, _, TrayTemplate, Accordion, VisitConfView) { //, form
    'use strict';
    var DEBUG = false;
    var channel = ADK.Messaging.getChannel('notesTray');

    var btnViewMatrix = { //btn oreder: Delete, Edit, Sign, View
            unsign_ehmp:  [2,1,1,1], // 1- show; 0- hide; 2- for future use
            unsign_vista: [0,0,0,1],
            sign:         [0,0,0,1],
            btn:    ["delete","edit","sign","preview"]
        };
    var notesTrayView = Backbone.Marionette.LayoutView.extend({
        id: 'notes-tray-outer',
        template: TrayTemplate,
        className: 'notes-sidebar-wrapper',
        regions: {
            accordionRegion: '#notes-list-container'
        },
        events: {
            'mousedown .btn': 'resetFocus',
            //'mouseup #add-note-btn': 'addNote',
            'click #add-note-btn': 'addNote',
            'mouseup #tray-delete-note-btn': 'deleteNote',
            'mouseup #tray-edit-note-btn': 'editNote',
            'mouseup #tray-sign-note-btn': 'signNote',
            'mouseup #tray-preview-note-btn': 'showPreview'
        },
        initialize: function() {
            this.selectedNotes = [];
            this.savedNoteUid = null;
            var self = this;
            channel.on('notes:selected', function(model) {
                self.selectedNotes = [];
                self.selectedNotes.push(model);
                self.setButtonVisibility();
            });
            channel.on('notes:retrieved', function(count) {
                if (count === 0) {
                    self.showNoNotesMessage();
                } else {
                    self.hideNoNotesMessage();
                }
            });
            channel.on('notes:refresh-tray-btn', function() {
              self.setButtonVisibility();
              if(self.selectedNotes.length > 0){ // show selected note
                if(!_.isUndefined(self.selectedNotes[0].id)){
                    $("div[data-uid='"+ self.selectedNotes[0].id +"']").addClass("list-item-selected");
                   }
              }
            });
            channel.on('notes:deselected', function(model) {
                 // probably we have to return to it in case of batch operations
                /*self.selectedNotes = _.reject(self.selectedNotes, function(note) {
                    return note.get('uid') === model.get('uid');
                });*/
              self.btnHideAll();
            });
        },
        resetFocus: function(event) {
            event.preventDefault();
            $('#notes-tray').focus();
        },
        addNote: function(event) {
            event.preventDefault();
            if (event.which === 13 || event.which === 32 || event.which === 1) {
                channel.trigger('addNewNote-btn',true);
            }
        },
        setButtonVisibility: function() {
            var indMatrix;
            if (this.selectedNotes.length === 1) {
                var noteStatus = this.selectedNotes[0].get("status");

                if(noteStatus.toLowerCase() === "completed"){
                    indMatrix = "sign";
                }else{
                    indMatrix = "unsign_"+this.selectedNotes[0].get("app");
                }
                for(var btnInd=0; btnInd < btnViewMatrix.btn.length; btnInd++ ){
                    if(btnViewMatrix[indMatrix][btnInd] === 1){ //show btn
                        this.$("#tray-"+btnViewMatrix.btn[btnInd]+"-note-btn").removeClass("hide");
                        if(btnViewMatrix.btn[btnInd] === "sign"){
                          if(this.isSignReady(this.selectedNotes[0])){
                            this.$("#tray-"+btnViewMatrix.btn[btnInd]+"-note-btn").removeClass("disabled");
                          }else{
                            this.$("#tray-"+btnViewMatrix.btn[btnInd]+"-note-btn").addClass("disabled");
                          }
                        }
                    }
                }
            }else{
                this.btnHideAll();
            }
        },
        btnHideAll: function(){
            for(var btnHideInd=0; btnHideInd < btnViewMatrix.btn.length; btnHideInd++ ){
                 this.$("#tray-"+btnViewMatrix.btn[btnHideInd]+"-note-btn").addClass("hide");
            }
        },
        deleteNote: function(event) {
            console.log("delete note");
        },
        editNote: function(event) {
          if (this.selectedNotes.length > 0) {
            var model = this.selectedNotes[0].clone();
            channel.trigger('editNote-btn', model);
          }
        },
        signNote: function(event) {
          if (this.selectedNotes.length > 0) {
            var model = this.selectedNotes[0].clone();
            channel.trigger('notes:sign', model);
          }
        },
        showPreview: function() {
            if (this.selectedNotes.length > 0) {
                var model = this.selectedNotes[0].clone();
                model.attributes.previewSource = 'tray';
                channel.trigger('show:preview', model);
            }
        },
        onRender: function() {
            var accordionView = new Accordion();
            this.accordionRegion.show(accordionView);
        },
        onShow: function() {
            this.hideNoNotesMessage();
        },
        showNoNotesMessage: function() {
            if (this.$('.no-notes-indicator').length === 0) {
                this.$('#signed-notes-header').after($('<div class="no-notes-indicator">No Notes</div>'));
            }
            this.$('.no-notes-indicator').removeClass('hide');
        },
        hideNoNotesMessage: function() {
            this.$('.no-notes-indicator').addClass('hide');
        },
        isSignReady: function(model){
          if(!_.isUndefined(model)){
            var isText = false;
            var isDateTime = false;
            if(!_.isUndefined(model.get("referenceDateTime"))){
              var datetime = model.get("derivReferenceTime");
                if((datetime !== "Invalid date") && (datetime !== null) && (datetime !== ""))
                  isDateTime = true;
              }
              if(!_.isUndefined(model.get("text"))) {
                var text = "";
                var arrText = model.get("text");
                _.each(arrText, function(item) {
                    if (!_.isUndefined(item.content)) text = text + item.content;
                });
                if(text.length > 0) {isText = true;}
              }
            if(isDateTime && isText){
              return true;
            }
          }
        return false;
      }
    });
    return notesTrayView;
});
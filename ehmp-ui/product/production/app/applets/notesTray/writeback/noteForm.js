define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'app/applets/notesTray/tray/notesCollectionHandler',
    'app/applets/notesTray/writeback/model',
    'app/applets/notesTray/writeback/formFields',
    'app/applets/notesTray/writeback/modelUtil',
    'app/applets/notesTray/writeback/saveErrorView',
    'hbs!app/applets/notesTray/writeback/saveErrorFooterTemplate',
    'hbs!app/applets/notesTray/writeback/formTemplate',
], function(Backbone, Marionette, $, Handlebars, collectionHandler, Model, fields, util, saveErrorView, saveErrorFooterTemplate, formTemplate) {
    var DEBUG = false;
    var AUTOSAVE_INTERVAL = 300000; // 5 min
    var channel = ADK.Messaging.getChannel('notesTray');
    var hasLastSelectedTitle = false;

    var notesFormView = Backbone.Marionette.LayoutView.extend({
        id: 'notes-form-container',
        getTemplate: function() {
            if (!_.isUndefined(this.model.id)) { // edit
                this.model.set("deriv_isEditForm", true);
                return formTemplate;
            } else { // new
                return formTemplate;
            }
        },
        regions: {
            formRegion: '#notes-form-container'
        },
        events: {
            'mouseup #close-form-btn': 'resetFocus',
            'mousedown #actions-note-form-btn': 'resetFocus',
            'mouseup #actions-note-form-btn': 'toggleDropdown',
            'click #actions-note-form-btn': 'onClickActionButton',
            'click li:not(.disabled) #preview-note-action-btn': 'showPreview',
            'click .dropdown .dropdown-menu li': 'toggleDropdown',
            'change #documentDefUidUnique': 'addTitle',
            'click li:not(.disabled) #save-note-action-btn': 'onClickActionButton_Save',
            'click li:not(.disabled) #close-note-action-btn': 'onClickActionButton_Close'
        },
        initialize: function(options) {
            if (DEBUG) console.log("initialize ----->> notesFormView");
            if (_.isUndefined(this.model)) {
                this.model = new Model({
                    derivReferenceDate: moment().format('MM/DD/YYYY'),
                    derivReferenceTime: moment().format('HH:mm')
                });
            }
            this.startAutosave();
        },
        resetFocus: function(event) {
            event.preventDefault();
            $('#notes-tray').focus();
        },
        toggleDropdown: function(event) {
            event.preventDefault();
            event.stopPropagation();
            this.$('.dropdown').toggleClass('open');
        },
        addTitle: function() {
            console.log('addTitle');
            var documentDefUidUnique = this.$('#documentDefUidUnique').val();
            console.log('  documentDefUidUnique: ' +documentDefUidUnique);
            var documentDefUid = documentDefUidUnique.substring(0, documentDefUidUnique.indexOf('_'));
            console.log('  documentDefUid: ' +documentDefUid);
            this.model.set('documentDefUid', documentDefUid);
            this.model.set('localTitle', this.$('#documentDefUidUnique').find(':selected').text());
            this.enableText();
        },
        onClickActionButton: function(event) {
            event.preventDefault();
            event.stopPropagation();
        },
        onClickActionButton_Close: function(event) {
            if (DEBUG) console.log("form action button ----->> close");
            var fClose = true;
            this.onCloseForm(event, this, fClose);
        },
        onClickActionButton_Save: function(event) {
            if (DEBUG) console.log("form action button ----->> save");
            var fClose = false;
            this.onCloseForm(event, this, fClose);
        },
        showPreview: function() {
            if (DEBUG) console.log("showPreview ----->> notesFormView");
            var model = this.model.clone();
            var documentDefUidUnique = this.$('#documentDefUidUnique').find(':selected').val();
            var documentDefUid = documentDefUidUnique.substring(0, documentDefUidUnique.indexOf('_'));
            model.set('localTitle', this.$('#documentDefUidUnique').find(':selected').text());
            model.set('documentDefUid', documentDefUid);
            model.set('previewSource', 'form');
            util.formatTextContent(model);
            var referenceDateTime = null;
            if (model.get('derivReferenceDate')) {
                var referenceDateTimeString = model.get('derivReferenceDate') + ' ' + model.get('derivReferenceTime');
                referenceDateTime = moment(referenceDateTimeString, 'MM/DD/YYYY HH:mm').format('YYYYMMDDHHmmss');
            }
            model.set('referenceDateTime', referenceDateTime);
            channel.trigger('show:preview', model);
        },
        onRender: function() {
            if (DEBUG) console.log("onRender ----->> notesFormView");
            var formView;
            if (_.isUndefined(this.model.id)) {
                this.model.set('lastSavedDisplayTime', null);
                formView = this.noteNewForm();
            } else {
                this.model.set('lastSavedDisplayTime', this.model.get('lastSavedTime') || this.model.get('lastUpdateTime'));
                formView = this.noteEditForm();
            }
            this.formRegion.show(formView);
            this.showTitlesLoading();
        },
        onShow: function() {
            if (!_.isUndefined(this.model.id)) {
                var value = this.model.get('documentDefUidUnique');
                this.$el.find("#documentDefUidUnique").val(value);
            }
            this.enableText();
        },
        enableText: function() {
            if (this.model.get('localTitle')) {
                this.$el.find('#text-0-content').trigger('control:disabled', false);
            } else {
                this.$el.find('#text-0-content').trigger('control:disabled', true);
            }
        },
        parseModel: function(model) {
            if (DEBUG) console.log("parseModel ----->> notesFormView");
            if (!_.isUndefined(model.get("referenceDateTime"))) {
                model.set("derivReferenceDate", moment(model.get("referenceDateTime"), 'YYYYMMDDHHmmssSSS').format('MM/DD/YYYY'));
                model.set("derivReferenceTime", moment(model.get("referenceDateTime"), 'YYYYMMDDHHmmssSSS').format('HH:mm'));
            }
            if (!_.isUndefined(model.get("text"))) {
                var text = "";
                var arrText = model.get("text");
                _.each(arrText, function(item) {
                    if (!_.isUndefined(item.content)) text = text + item.content;
                });
                model.set("derivBody", text);
            }
            this.model = model = new Model(model.toJSON());
            return model;
        },
        checkModelSignReady: function(model){
          if(!_.isUndefined(model)){
              this.signValidator.validateDateTime(model.get("derivReferenceTime"));
              this.signValidator.validateTitle(model.get("documentDefUidUnique"));
              if(!_.isUndefined(model.get("text"))) {
                var text = "";
                var arrText = model.get("text");
                _.each(arrText, function(item) {
                    if (!_.isUndefined(item.content)) text = text + item.content;
                });

                this.signValidator.validateText(text);
              }
            return this.signValidator.validateForm();
          }

          return false;
        },
        setSignStatus: function(flag){
           if(flag){
              this.$('#sign-form-btn').removeClass('disabled');
           }else{
              this.$('#sign-form-btn').addClass('disabled');
           }
        },
        signValidator: {
                isTimeValid: false,
                isDateValid: false,
                isTextValid: false,
                isTitleValid: false,
                reset: function(){
                  this.isTimeValid = false;
                  this.isDateValid = false;
                  this.isTextValid = false;
                  this.isTitleValid = false;
                },
                newNotePreset: function(){
                  this.isTimeValid = true;
                  this.isDateValid = true;
                  this.isTextValid = false;
                  this.isTitleValid = true;
                },
                validateText: function(val){
                  this.isTextValid = false;
                  if(!_.isUndefined(val)){
                    if(val.length > 1){
                      this.isTextValid = true;
                    }
                  }
                },
                validateTitle: function(val){
                  this.isTitleValid = false;
                  if(!_.isUndefined(val)){
                    if(val.length > 1){
                      this.isTitleValid = true;
                    }
                  }
                },
                validateDate: function(val){
                  this.isDateValid = false;
                  if(!_.isUndefined(val)){
                    if(val.length === 10){
                      this.isDateValid = true;
                    }
                  }
                },
                validateTime: function(val){
                  this.isTimeValid = false;
                  if(!_.isUndefined(val)){
                    console.log(val);
                    if(val.length === 5){
                      this.isTimeValid = true;
                    }
                  }
                },
                validateDateTime: function(val){
                  this.isDateValid = false;
                  this.isTimeValid = true;
                  if(!_.isUndefined(val)){
                    if((val !== "Invalid date") && (val !== null) && (val !== "")){
                      this.isDateValid = true;
                      this.isTimeValid = true;
                    }
                  }
                },
                validateForm: function(){
                  return (this.isTimeValid && this.isDateValid && this.isTextValid && this.isTitleValid);
                }
        },
        noteEditForm: function(obj) {
            var self = this;
            var editNoteView = ADK.UI.Form.extend({
                isModelSignReady: this.checkModelSignReady(this.model),
                fields: fields.form,
                model: this.parseModel(this.model),
                events: {
                    "submit": function(e) {
                        e.preventDefault();
                        if (DEBUG) console.log("NOTES--->> sign Note");
                        self.onSaveSignForm(e, this);
                    },
                    "click #close-form-btn": function(e) {
                        e.preventDefault();
                        if (DEBUG) console.log("NOTES--->> close Note");
                        self.onCloseForm(e, this, true);
                    },

                    "keydown #text-0-content": function(e){ 
                      self.signValidator.validateText(this.$el.find('#text-0-content').val());
                      self.setSignStatus(self.signValidator.validateForm());
                    },
                    "mouseover  #text-0-content": function(e){ 
                      self.signValidator.validateText(this.$el.find('#text-0-content').val());
                      self.setSignStatus(self.signValidator.validateForm());                      
                    },                  
                    "change #documentDefUidUnique": function(e){
                        self.signValidator.validateTitle(this.$el.find("#documentDefUidUnique").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    },
                    "change #derivReferenceDate": function(e){
                        self.signValidator.validateDate(this.$el.find("#derivReferenceDate").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    },
                    "change #derivReferenceTime": function(e){
                        self.signValidator.validateTime(this.$el.find("#derivReferenceTime").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    }
                },
                onRender: function() {
                    self.showTitlesLoading();
                    util.fetchTitles(this, _.bind(self.updateForm, self), _.bind(self.hideTitlesLoading, self));
                },
                onShow: function(){
                    self.setSignStatus(this.isModelSignReady);
                },
                onDestroy: function(){
                    self.signValidator.reset();
                },
            });
            return new editNoteView();
        },
        noteNewForm: function() {
            var self = this;
            var newNoteView = ADK.UI.Form.extend({
                //isSignReady: false,
                fields: fields.form,
                model: this.model,
                events: {
                    "submit": function(e) {
                        e.preventDefault();
                        if (DEBUG) console.log("NOTES--->> sign New Note");
                        self.onSaveSignForm(e, this);
                    },
                    "blur #derivReferenceTime": function() {
                        util.validateTime(this.model);
                    },

                    "click #close-form-btn": function(e) {
                        e.preventDefault();
                        if (DEBUG) console.log("NOTES--->> close New Note");
                        //var isValid = this.model.isValid({validationType: 'close'});
                        self.onCloseForm(e, this, true);
                    },

                    "keydown #text-0-content": function(e){ 
                      self.signValidator.validateText(this.$el.find('#text-0-content').val());
                      self.setSignStatus(self.signValidator.validateForm());
                    },
                    "change #documentDefUidUnique": function(e){
                        self.signValidator.validateTitle(this.$el.find("#documentDefUidUnique").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    },
                    "change #derivReferenceDate": function(e){
                        self.signValidator.validateDate(this.$el.find("#derivReferenceDate").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    },
                    "change #derivReferenceTime": function(e){
                        self.signValidator.validateTime(this.$el.find("#derivReferenceTime").val());
                        self.setSignStatus(self.signValidator.validateForm());
                    }

                },
                onRender: function() {
                    self.showTitlesLoading();
                    util.fetchTitles(this, _.bind(self.updateForm, self), _.bind(self.hideTitlesLoading, self));
                },
                onShow: function(){
                    self.signValidator.newNotePreset();
                    self.setSignStatus(false);
                },

                onDestroy: function(){
                    self.signValidator.reset();
                },

            });
            return new newNoteView();
        },
        updateForm: function(form, options) {
            console.log('updateForm with options %o', options);
            $('#documentDefUidUnique').trigger('control:picklist:set', [options]);
            this.showTitlesLoading();
            var value = this.model.get('documentDefUidUnique');
            if (value !== null && value !== undefined && value !== '') {
                this.$el.find("#documentDefUidUnique").val(value);
                hasLastSelectedTitle = true;
            } else {
                this.$('#documentDefUidUnique').trigger('change');
            }
        },
        showTitlesLoading: function() {
            if (this.$('.titles-loading-indicator').length === 0) {
                this.$('.form-group.documentDefUidUnique label').after($('<span class="title-loading-indicator"><i class="fa fa-spinner fa-spin"></i></span>'));
            }
            this.$('.titles-loading-indicator').removeClass('hide');
        },
        hideTitlesLoading: function() {
            this.$('.title-loading-indicator').addClass('hide');
        },
        validateSignForm: function(form) {
            form.model.errorModel.clear();
            return util.validateRequiredDate(form.model) && util.validateRequiredTime(form.model);
        },
        validateCloseForm: function(form) {
            form.model.errorModel.clear();
            return util.validateTitle(form.model) && util.validateDate(form.model) && util.validateTime(form.model);
        },
        saveNote: function(fSign, fClose, fAuto) {
            this.$('#close-form-btn').addClass('disabled');
            this.$('#sign-form-btn').addClass('disabled');
            this.$('#close-note-action-btn').closest('li').addClass('disabled');
            this.$('#save-note-action-btn').closest('li').addClass('disabled');
            var self = this;
            // TODO: Revert this hardcoded url when the writeback server is available
            var ien = this.model.get('localId') ? '/' + this.model.get('localId').replace('\n', '') : '';
            this.model.url = '/resource/write-health-data/patient/' + this.model.get('pid') + '/notes' + ien;
            this.model.set('lastSavedTime', moment().format('YYYYMMDDHHmmss'));
            this.model.save(null, {
                error: function(model, resp) {
                    saveErrorView.showModal(fClose && !fAuto);
                    if (!fClose) {
                        self.$('#close-form-btn').removeClass('disabled');
                        self.$('#sign-form-btn').removeClass('disabled');
                        self.$('#close-note-action-btn').closest('li').removeClass('disabled');
                        self.$('#save-note-action-btn').closest('li').removeClass('disabled');
                    }
                },
                success: function(model, resp) {
                    if (model.isNew()) {
                        model.set(resp.data.notes);
                        var localId = model.get('localId');
                        model.set({
                            id: localId,
                            uid: localId
                        });
                    }
                    model.set('lastSavedDisplayTime', model.get('lastSavedTime'));
                    if (fClose) {
                        setTimeout(function() {
                            channel.trigger('note:saved', model.get('uid'));
                        }, 1000);
                    } else {
                        self.$('#close-form-btn').removeClass('disabled');
                        self.$('#sign-form-btn').removeClass('disabled');
                        self.$('#close-note-action-btn').closest('li').removeClass('disabled');
                        self.$('#save-note-action-btn').closest('li').removeClass('disabled');
                    }
                    if (DEBUG) console.log('Successfully saved note.');
                    channel.trigger('notes:refresh-tray-btn');
                    if (!fAuto) {
                        var saveAlertView = new ADK.UI.Notification({
                            title: 'Success!',
                            message: 'Saved Successfully.',
                            type: 'success'
                        });
                        saveAlertView.show();
                    }
                    if (fSign) {
                        if (DEBUG) console.log("NOTES--->> sign note after save");
                        channel.trigger('notes:sign', model);
                    }
                }
            });
        },
        autosaveNote: function() {
            var self = this;
            if (!this.model.get('documentDefUid')) {
                var errorAlertView = new ADK.UI.Alert({
                    title: 'Error',
                    icon: 'fa-exclamation-triangle',
                    messageView: Backbone.Marionette.ItemView.extend({
                        template: Handlebars.compile('The auto-save will not occur until the title is set.')
                    }),
                    footerView: Backbone.Marionette.ItemView.extend({
                        template: saveErrorFooterTemplate,
                        events: {
                            'click .ok-button': function(event) {
                                self.startAutosave();
                            }
                        }
                    })
                });
                this.stopAutosave(); // pause autosave until dialog is dismissed to prevent a stack of dialogs if the user steps away
                errorAlertView.show();
            } else {
                var body = this.$('#text-0-content').val();
                var text = this.model.get('text');
                text[0].content = body;
                this.model.set('text', text);
                var fSign = false;
                var fClose = false;
                var fSilent = true;
                this.saveNote(fSign, fClose, fSilent);
            }
        },
        startAutosave: function() {
            this.autosaveTimer = setInterval(_.bind(this.autosaveNote, this), AUTOSAVE_INTERVAL);
        },
        stopAutosave: function() {
            clearInterval(this.autosaveTimer);
        },
        onCloseForm: function(e, form, closeForm) {
            if (DEBUG) console.log("NOTES--->> onCloseForm");
            var isCloseValid = this.model.isValid({
                validationType: 'close'
            });
            var formIsValid = this.validateCloseForm(form);
            var keys = Object.keys(form.model.errorModel.attributes);
            if (keys.length) {
                var sel = '#' + keys[0];
                $(sel).focus();
            } else {
                this.saveNote(false, closeForm);
            }
            return false;
        },
        onSaveSignForm: function(e, form) {
            if (DEBUG) console.log("NOTES--->> onSaveSignForm test");
            var isSubmitValid = form.model.isValid({
                validationType: 'sign'
            });
            var formIsValid = this.validateSignForm(form);
            var keys = Object.keys(form.model.errorModel.attributes);
            if (keys.length) {
                var sel = '#' + keys[0];
                $(sel).focus();
            } else {
                var fCloseForm = true;
                var fSignNote  = true;
                this.saveNote(fSignNote, fCloseForm);
            }
            return false;
        },
        onDestroy: function() {
            this.stopAutosave();
        }
    });
    return notesFormView;
});

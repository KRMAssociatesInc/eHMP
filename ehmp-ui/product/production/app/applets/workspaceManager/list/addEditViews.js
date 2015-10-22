// define([
//     'underscore',
//     'backbone',
//     'marionette',
//     'jquery',
//     'hbs!app/applets/workspaceManager/list/editorFormTemplate',
//     'hbs!app/applets/workspaceManager/list/addScreenTemplate',
//     'hbs!app/applets/workspaceManager/list/deleteActiveTemplate',
//     'app/applets/workspaceManager/list/screenSelectionSlider',
//     'app/applets/workspaceManager/list/problems/problemAssociationView',
//     'gridster',
//     'main/ScreenBuilder',
//     'api/UserDefinedScreens'
// ], function(_, Backbone, Marionette, $, EditorFormTemplate, addScreenTemplate, deleteActiveTemplate, ScreenSelectionSlider, ProblemAssociationView, gridster, ScreenBuilder, UserDefinedScreens) {
//     'use strict';

//     //----- Shared functions for Add Screen form and Edit Screen form -----//

//     var validator = function(self, screenTitle, screenDescription, associatedProblems) {
//         //validator checks if title input is blank or if there is more text than allowed
//         var hasError = false;

//         screenTitle.value = screenTitle.value.replace(/<div>|<\/div>|<script>|<\/script>/g, '');

//         if (screenTitle.value === "") {
//             $(screenTitle).closest('.form-group').addClass('has-error');
//             $('.errMsg').text('Please ensure all fields have been entered');
//             hasError = true;
//         }
//         if (screenTitle.value.length > 30) {
//             $(screenTitle).closest('.form-group').addClass('has-error');
//             hasError = true;
//         }
//         if (screenDescription.value.length > 140) {
//             $(screenDescription).closest('.form-group').addClass('has-error');
//             hasError = true;
//         }

//         return hasError;
//     };

//     var screenTitleExists = function(self, screenTitle) {
//         var doesExist;
//         var promise = UserDefinedScreens.getScreensConfig();
//         promise.done(function(screensConfig) {
//             var existingScreen = _.find(screensConfig.screens, function(screen) {
//                 return screen.title === screenTitle;
//             });
//             if (_.isUndefined(existingScreen)) {
//                 doesExist = false;
//             } else {
//                 titleInUseError(self);
//                 doesExist = true;
//             }
//         });
//         return doesExist;
//     };

//     var titleInUseError = function(self) {
//         var errMsg = $(self.$el.find('.errMsg'));
//         if(errMsg.hasClass('saveMsg')){
//             errMsg.removeClass('saveMsg');
//         }
//         errMsg.addClass('has-error');
//         errMsg.text('Please pick a new title. This one is already in use');
//     };

//     var generateScreenId = function(screensConfig) {
//         var maxIdNum = 0;
//         var max = _.max(screensConfig.screens, function(screen) {
//             if (screen.id.indexOf('workspace') !== -1) {
//                 maxIdNum = Number(screen.id.slice(9));
//                 return maxIdNum;
//             }
//         });
//         if (max === -Infinity) {
//             return "workspace1";
//         } else {
//             return "workspace" + (maxIdNum + 1);
//         }
//     };

//     var toggleDefaultHtml = function(e, defaultButtonHTML) {
//         var E;
//         if (_.isUndefined(e)) {
//             E = defaultButtonHTML;
//         } else {
//             E = e.currentTarget;
//         }
//         var starIcon = $(E).find('i');
//         var starText = $(E).find('span');
//         if (starIcon.hasClass('fa-star-o')) {
//             starIcon.removeClass('fa-star-o');
//             starIcon.addClass('fa-star');
//             starText.text('This screen set to default');
//             $(E).addClass('madeDefault');
//         } else {
//             starIcon.removeClass('fa-star');
//             starIcon.addClass('fa-star-o');
//             starText.text('Click to make default');
//             $(E).removeClass('madeDefault');
//         }
//     };

//     var checkForEmptyInputs = function(self, actionButtonClass) {
//         var titleLength = self.$el.find('form #screen-title')[0].value.length;
//         var descriptionLength = self.$el.find('form #screen-description')[0].value.length;
//         if (titleLength !== 0 && descriptionLength !== 0) {
//             $(actionButtonClass).prop('disabled', false);
//         } else {
//             $(actionButtonClass).prop('disabled', true);
//         }
//     };

//     var updateTitleCountdown = function(self) {
//         if ($(self.$el.find('.form-group')[0]).hasClass('has-error')) {
//             $(self.$el.find('.form-group')[0]).removeClass('has-error');
//         }
//         //if($(self.$el.find('.errMsg')).hasClass('has-error')){
//         //    $(self.$el.find('.errMsg')).text('');
//         //    $(self.$el.find('.errMsg')).removeClass('has-error');
//         //}
//         var maxLength = self.$el.find('form #screen-title').attr('maxLength');
//         var remainingChars = maxLength - self.$el.find('form #screen-title')[0].value.length;
//         self.$el.find('.title-countdown').text(remainingChars + ' characters remaining');
//     };

//     var updateDescriptionCountdown = function(self) {
//         if ($(self.$el.find('.form-group')[1]).hasClass('has-error')) {
//             $(self.$el.find('.form-group')[1]).removeClass('has-error');
//         }
//         var maxLength = self.$el.find('form #screen-description').attr('maxLength');
//         var remainingChars = maxLength - self.$el.find('form #screen-description')[0].value.length;
//         self.$el.find('.description-countdown').text(remainingChars + ' characters remaining');
//     };

//     //----- View for Add Screen form and for Edit Screen form -----//
//     var AddEditViews = {

//         EditorFormView: Backbone.Marionette.LayoutView.extend({
//             template: EditorFormTemplate,
//             regions: {
//                 problemsRegion: '#edit-screen-problems-region'
//             },
//             initialize: function(options) {
//                 var self = this;
//                 this.managerScreenTile = options.screenTile;
//                 this.origScreenOptions = {
//                     title: options.screenTitle,
//                 };
//                 var promise = UserDefinedScreens.getScreensConfig();
//                 promise.done(function(screensConfig) {
//                     var origScreen = _.find(screensConfig.screens, function(screen) {
//                         return screen.title === self.origScreenOptions.title;
//                     });
//                     if (_.isUndefined(origScreen)) {
//                         console.log("Error: this screen does not exist");
//                         return;
//                     } else {
//                         self.applets = [];
//                         if (origScreen.predefined) {
//                             self.applets = ADK.ADKApp[origScreen.id].applets;
//                         } else {
//                             var screenConfigPromise = UserDefinedScreens.getGridsterConfig(origScreen.id);
//                             screenConfigPromise.done(function(gridsterScreenConfig) {
//                                 if (gridsterScreenConfig && !_.isUndefined(gridsterScreenConfig.get('applets')) && !_.isNull(gridsterScreenConfig.get('applets'))) {
//                                     self.applets = gridsterScreenConfig.get('applets');
//                                 }
//                             });
//                         }
//                         self.origScreenOptions.id = origScreen.id;
//                         self.origScreenOptions.routeName = origScreen.routeName;
//                         self.origScreenOptions.description = origScreen.description;
//                         self.origScreenOptions.defaultScreen = origScreen.defaultScreen;
//                         self.origScreenOptions.predefined = origScreen.predefined;
//                         self.origScreenOptions.associatedProblems = origScreen.associatedProblems;
//                     }
//                 });
//                 this.newScreenOptions = $.extend({}, this.origScreenOptions);
//             },
//             onRender: function() {
//                 if (!this.newScreenOptions.predefined) {
//                     var problemsView = new ProblemAssociationView({
//                         associatedProblems: this.newScreenOptions.associatedProblems || []
//                     });
//                     this.problemsRegion.show(problemsView);
//                 }

//                 if (this.applets) {
//                     var applets = this.applets.sort(function(a, b) {
//                         if (a.title < b.title) return -1;
//                         if (a.title > b.title) return 1;
//                         return 0;
//                     });

//                     var appletList = this.$el.find("ul#screen-applets-list").empty();
//                     $.each(applets, function(index) {
//                         if (!applets[index].hiddenFromAppletsList) {
//                             var li = $('<li>').text(applets[index].title).appendTo(appletList);
//                         }
//                     });
//                 }

//                 this.$el.find('form #screen-title')[0].value = this.origScreenOptions.title;
//                 if (!_.isUndefined(this.origScreenOptions.description)) {
//                     this.$el.find('form #screen-description')[0].value = this.origScreenOptions.description;
//                 }
//                 if (this.origScreenOptions.predefined === true) {
//                     this.$el.find('.deleteScreen').hide();
//                     this.$el.find('form #screen-title').prop('readonly', true);
//                     this.$el.find('form #screen-description').prop('readonly', true);
//                 } else {
//                     this.$el.find('.deleteScreen').show();
//                 }
//                 if (this.origScreenOptions.defaultScreen) {
//                     var defaultButtonHTML = this.$el.find('p');
//                     toggleDefaultHtml(undefined, defaultButtonHTML);
//                 }
//                 updateTitleCountdown(this);
//                 updateDescriptionCountdown(this);
//             },
//             events: {
//                 'click .loadButton': 'validateSaveLoad',
//                 'click .saveButton': 'saveInput',
//                 'click p': 'toggleDefault',
//                 'change #screen-title': 'screenTitleChange',
//                 'keyup #screen-title': 'screenTitleChange',
//                 'change #screen-description': 'descriptionChange',
//                 'keyup #screen-description': 'descriptionChange',
//                 'click .cloneButton' : 'cloneScreen',
//                 'keydown input': function(e) {
//                     if (e.which === 13) {
//                         e.preventDefault();
//                         this.validateSaveLoad();
//                     }
//                 }
//             },
//             validateSaveLoad: function() {
//                 if (this.validateAndSave()) {
//                     ADK.Navigation.navigate(this.newScreenOptions.routeName);
//                 }
//             },
//             saveInput: function() {
//                 if (this.validateAndSave()) {
//                     $(this.$el.find('.errMsg')).addClass('saveMsg');
//                     $(this.$el.find('.errMsg')).text('Your changes have been saved');
//                     $(this.$el.find('.cancelAddEdit')).text('Close');

//                     var currentThumbnail = $(this.managerScreenTile.currentTarget);
//                     if (this.origScreenOptions.title !== this.newScreenOptions.title) {
//                         $(currentThumbnail).find('p').text(this.newScreenOptions.title);
//                         this.origScreenOptions.title = this.newScreenOptions.title;
//                     }
//                     if(this.newScreenOptions.defaultScreen !== this.origScreenOptions.defaultScreen){
//                         this.origScreenOptions.defaultScreen = this.newScreenOptions.defaultScreen;

//                         if(this.newScreenOptions.defaultScreen){
//                             $(currentThumbnail).parent().find('.defaultScreenTitle').removeClass('defaultScreenTitle');
//                             $(currentThumbnail).parent().find('.fa-star').remove();
//                             $(currentThumbnail).find('p').addClass('defaultScreenTitle');
//                             $(currentThumbnail).prepend('<i class="fa fa-star">');

//                         } else {
//                             var overviewThumbnail = $(currentThumbnail).parent().find('[data-screen-id="overview"]');
//                             $(currentThumbnail).find('p').removeClass('defaultScreenTitle');
//                             $(currentThumbnail).find('i').remove();
//                             $(overviewThumbnail).find('p').addClass('defaultScreenTitle');
//                             $(overviewThumbnail).prepend('<i class="fa fa-star">');
//                         }
//                     }
//                 }
//             },
//             validateAndSave: function() {
//                 var self = this;
//                 var newScreenTitle = self.$el.find('form #screen-title')[0];
//                 var newScreenDescription = self.$el.find('form #screen-description')[0];
//                 var associatedProblems = this.problemsRegion.currentView.getAssociatedProblems();
//                 var hasError = validator(self, newScreenTitle, newScreenDescription, associatedProblems);
//                 var editsMade = false;

//                 if (hasError) {
//                     return false;
//                 } else if (this.newScreenOptions.predefined === true) {
//                     //check for default screen option
//                     if (this.origScreenOptions.defaultScreen && !$('p').hasClass('madeDefault')) {
//                         this.newScreenOptions.defaultScreen = false;
//                         ScreenBuilder.setScreensManifestDefualtScreenToDefault();
//                         editsMade = true;
//                     } else if ($('p').hasClass('madeDefault')) {
//                         this.newScreenOptions.defaultScreen = true;
//                         editsMade = true;
//                     }
//                     if (editsMade) {
//                         if (this.newScreenOptions.defaultScreen === true) {
//                             ScreenBuilder.resetDefaultScreen();
//                             ScreenBuilder.setDefaultScreen(this.newScreenOptions);
//                         }
//                         ScreenBuilder.editScreen(this.newScreenOptions);
//                     }
//                     return true;
//                 } else {
//                     if (self.origScreenOptions.title !== newScreenTitle.value) {
//                         if(!screenTitleExists(self, newScreenTitle.value)){
//                             self.newScreenOptions.title = newScreenTitle.value;
//                             editsMade = true;
//                         } else {
//                             return false;
//                         }
//                     }
//                     if (self.origScreenOptions.description !== newScreenDescription) {
//                         self.newScreenOptions.description = newScreenDescription.value;
//                         editsMade = true;
//                     }
//                     //check for default screen option
//                     if (self.origScreenOptions.defaultScreen && !$('p').hasClass('madeDefault')) {
//                         self.newScreenOptions.defaultScreen = false;
//                         ScreenBuilder.setScreensManifestDefualtScreenToDefault();
//                         editsMade = true;
//                         console.log('This screen no longer default');
//                     } else if ($('p').hasClass('madeDefault')) {
//                         self.newScreenOptions.defaultScreen = true;
//                         editsMade = true;
//                     }
//                     //check for changes to associated problems
//                     self.newScreenOptions.associatedProblems = associatedProblems;
//                     if (!editsMade) {
//                         if (self.origScreenOptions.associatedProblems) {
//                             if (self.origScreenOptions.associatedProblems.length !== associatedProblems.length) {
//                                 editsMade = true;
//                             } else {
//                                 // compare the arrays
//                                 for (var i = 0; i < associatedProblems.length; i++) {
//                                     var existingProblem = self.origScreenOptions.associatedProblems[i];
//                                     var newProblem = associatedProblems[i];
//                                     if (newProblem.snomed !== existingProblem.snomed) {
//                                         editsMade = true;
//                                     }
//                                 }
//                             }
//                         } else if (associatedProblems.length > 0) {
//                             editsMade = true;
//                         }
//                     }

//                     if (editsMade) {
//                         if (self.newScreenOptions.defaultScreen) {
//                             ScreenBuilder.resetDefaultScreen();
//                             ScreenBuilder.setDefaultScreen(self.newScreenOptions);
//                         }
//                         ScreenBuilder.editScreen(self.newScreenOptions);
//                     }
//                     return true;
//                 }
//             },
//             displaySaveButtons: function(origText, newText){
//                 if($('.loadButton').text()==='Load'){
//                     if(_.isUndefined(origText)){
//                         //if only the Default Screen selection has been changed
//                         $('.loadButton').text('Save and Load');
//                         $('.saveButton').removeClass('hide');
//                         return;
//                     } else if(origText !== newText){
//                         $('.loadButton').text('Save and Load');
//                         $('.saveButton').removeClass('hide');
//                     }
//                 }
//             },
//             screenTitleChange: function() {
//                 updateTitleCountdown(this);
//                 checkForEmptyInputs(this, '.loadButton');
//                 checkForEmptyInputs(this, '.saveButton');
//                 this.displaySaveButtons(this.origScreenOptions.title, this.$el.find('form #screen-title')[0].value);
//             },
//             descriptionChange: function() {
//                 updateDescriptionCountdown(this);
//                 checkForEmptyInputs(this, '.loadButton');
//                 checkForEmptyInputs(this, '.saveButton');
//                 this.displaySaveButtons(this.origScreenOptions.description, this.$el.find('form #screen-description')[0].value);
//             },
//             toggleDefault: function(e) {
//                 toggleDefaultHtml(e);
//                 this.displaySaveButtons();
//             },
//             getCloneTitle: function(origTitle){
//                 var cloneTitle;
//                 var promise = UserDefinedScreens.getScreensConfig();
//                 promise.done(function(screensConfig) {
//                     var previouslyCloned = _.filter(screensConfig.screens, function(screen){
//                         if(screen.title.indexOf(origTitle + ' Copy')!== -1){
//                             return screen;
//                         }
//                     });
//                     if(previouslyCloned.length !== 0){
//                         cloneTitle = origTitle + ' Copy ' + (previouslyCloned.length + 1);
//                     } else {
//                         cloneTitle = origTitle + ' Copy';
//                     }
//                 });
//                 return cloneTitle;
//             },
//             cloneScreen: function() {
//                 //create cloned screen
//                 var newId;
//                 var promise = UserDefinedScreens.getScreensConfig();
//                 promise.done(function(screensConfig) {
//                     newId = generateScreenId(screensConfig);
//                 });

//                 var clonedScreenOptions = {
//                     id: newId,
//                     routeName: newId,
//                     title: this.getCloneTitle(this.origScreenOptions.title),
//                     description: this.origScreenOptions.description,
//                     predefined: false,
//                     associatedProblems: [] // do not clone associated problems since a problem can only be associated with one screen
//                 };

//                 ScreenBuilder.addNewScreen(clonedScreenOptions, ADK.ADKApp);
//                 UserDefinedScreens.cloneGridsterConfig(this.origScreenOptions.id, clonedScreenOptions.id);

//                 ADK.Navigation.navigate(clonedScreenOptions.routeName);
//                 var channel = ADK.Messaging.getChannel('addAppletsChannel');
//                 channel.trigger('addApplets');
//             }
//         }),


//         DeleteActiveView: Backbone.Marionette.ItemView.extend({
//             template: deleteActiveTemplate,
//             initialize: function() {
//                 var self = this;
//                 var screenId = this.screenOptions.id;
//                 var promise = UserDefinedScreens.getScreensConfig();
//                 promise.done(function(screensConfig) {
//                     var screenCheck = _.find(screensConfig.screens, function(screen) {
//                     return screen.title === screenId;
//                 });
//                 if (Backbone.history.fragment === screenId){
//                     $('.editScreenForm').hide();
//                 }else{
//                     ScreenBuilder.deleteUserScreen(screenId);
//                     ADK.UI.FullScreenOverlay.hide();
//                     var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
//                     channel.trigger('workspaceManager', function() {
//                         var view = ADK.UI.FullScreenOverlay.show(new AppletLayoutView(), {
//                             'callShow': true
//                         });
//                     });
//                 }
//             });
//             },
//             onRender: function() {},
//             events: {
//                 'click .cancelButton': 'cancelAction',
//                 'click .deleteActiveScreen': 'deleteActive'
//             },
//             deleteActive: function(){
//                 var self = this;
//                 var screenTitle = $.find('.editScreenForm form #screen-title')[0].value;
//                 ScreenBuilder.deleteUserScreen(screenTitle);
//                 ADK.UI.FullScreenOverlay.hide();
//                 var channel = ADK.Messaging.getChannel('workspaceManagerChannel');
//                 channel.trigger('workspaceManager', function() {
//                     var view = ADK.UI.FullScreenOverlay.show(new AppletLayoutView(), {
//                         'callShow': true
//                     });
//                 });
//            },
//             cancelAction: function(){
//                 $('.editScreenForm').show();
//                 $('.deleteActiveScreenForm').hide();
//             }
//         }),


//         AddScreenView: Backbone.Marionette.LayoutView.extend({
//             template: addScreenTemplate,
//             regions: {
//                 problemsRegion: '#add-screen-problems-region'
//             },
//             initialize: function() {},
//             onRender: function() {
//                 updateTitleCountdown(this);
//                 updateDescriptionCountdown(this);
//                 this.problemsRegion.show(new ProblemAssociationView());
//             },
//             events: {
//                 'click .addLoadButton': 'validateInput',
//                 'change #screen-title': 'screenTitleChange',
//                 'keyup #screen-title': 'screenTitleChange',
//                 'change #screen-description': 'descriptionChange',
//                 'keyup #screen-description': 'descriptionChange',
//                 'click p': 'toggleDefault',
//                 'keydown input': function(e) {
//                     if (e.which === 13) {
//                         e.preventDefault();
//                         if (!$('.addLoadButton').is(':disabled')) {
//                             this.validateInput();
//                         }
//                     }
//                 }
//             },
//             validateInput: function() {
//                 var self = this;
//                 var screenTitle = self.$el.find('form #screen-title')[0];
//                 var screenDescription = self.$el.find('form #screen-description')[0];
//                 var associatedProblems = this.problemsRegion.currentView.getAssociatedProblems();
//                 var screenId;
//                 var hasError = validator(self, screenTitle, screenDescription, associatedProblems);

//                 if (!hasError) {
//                     if(!screenTitleExists(self, screenTitle.value)){
//                         var promise = UserDefinedScreens.getScreensConfig();
//                         promise.done(function(screensConfig) {
//                             screenId = generateScreenId(screensConfig);
//                             self.addAndLoadScreen(screenId, screenDescription.value, screenTitle.value, associatedProblems);
//                         });
//                     }
//                 }
//             },
//             addAndLoadScreen: function(screenId, screenDescription, screenTitle, associatedProblems) {
//                 var screenOptions = {
//                     id: screenId,
//                     routeName: screenId,
//                     title: screenTitle,
//                     description: screenDescription,
//                     predefined: false,
//                     associatedProblems: associatedProblems
//                 };

//                 //check if set to default screen
//                 if ($('p').hasClass('madeDefault')) {
//                     //reset original defaultScreen
//                     ScreenBuilder.resetDefaultScreen();
//                     screenOptions.defaultScreen = true;
//                     ScreenBuilder.setDefaultScreen(screenOptions);
//                 } else {
//                     screenOptions.defaultScreen = false;
//                 }

//                 ScreenBuilder.addNewScreen(screenOptions, ADK.ADKApp);

//                 ADK.Navigation.navigate(screenOptions.routeName);
//                 var channel = ADK.Messaging.getChannel('addAppletsChannel');
//                 channel.trigger('addApplets');
//             },
//             screenTitleChange: function() {
//                 updateTitleCountdown(this);
//                 checkForEmptyInputs(this, '.addLoadButton');
//             },
//             descriptionChange: function() {
//                 updateDescriptionCountdown(this);
//                 checkForEmptyInputs(this, '.addLoadButton');
//             },
//             toggleDefault: function(e) {
//                 toggleDefaultHtml(e);
//             }
//         })
//     };
//     return AddEditViews;
// });

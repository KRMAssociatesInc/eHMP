define([
    'underscore',
    'backbone',
    'marionette',
    'hbs!app/applets/workspaceManager/list/addScreenTemplate',
    'gridster',
    'main/ScreenBuilder'
], function(_, Backbone, Marionette, addScreenTemplate, gridster, ScreenBuilder) {

    'use strict';
    // var AddScreenView = Backbone.Marionette.ItemView.extend({
    //     template: addScreenTemplate,
    //     initialize: function() {
    //     },
    //     onRender: function(){
    //         this.updateTitleCountdown();
    //         this.updateDescriptionCountdown();
    //     },
    //     events: {
    //         'click .addLoadButton': 'validateInput',
    //         'change #screen-title': 'updateTitleCountdown',
    //         'keyup #screen-title': 'updateTitleCountdown',
    //         'change #screen-description': 'updateDescriptionCountdown',
    //         'keyup #screen-description': 'updateDescriptionCountdown',
    //         'keydown input': function(e) {
    //             if (e.which === 13) {
    //                 e.preventDefault();
    //                 this.validateInput();
    //             }
    //         }
    //     },
    //     validateInput: function() {

    //         var screenTitle = this.$el.find('form #screen-title')[0];
    //         var screenDescription = this.$el.find('form #screen-description')[0];
    //         var screenId;
    //         var hasError = false;
    //         if(screenTitle.value === ""){
    //             $(screenTitle).closest('.form-group').addClass('has-error');
    //             hasError = true;
    //         } else {
    //             //remove all symbols (except numbers), put to lowercase, replace spaces with dashes
    //             screenId = screenTitle.value.replace(/[^a-zA-Z0-9 ]/g, '').toLowerCase().replace(/\s+/g, '-');
    //             var currentScreens = ScreenBuilder.getScreenRouteList();
    //             if(_.indexOf(currentScreens, screenId) !== -1){
    //                 hasError = true;
    //                 $(this.$el.find('.errMsg')).addClass('has-error');
    //                 $(this.$el.find('.errMsg')).text('Please pick a new title. This one is already in use');
    //             }
    //         }
    //         if (screenTitle.value.length > 30){
    //             $(screenTitle).closest('.form-group').addClass('has-error');
    //             hasError = true;
    //         }
    //         if (screenDescription.value.length >140) {
    //             $(screenDescription).closest('.form-group').addClass('has-error');
    //             hasError = true;
    //         }
    //         if(!hasError){
    //             this.addAndLoadScreen(screenId, screenDescription.value, screenTitle.value);
    //         }
    //     },
    //     addAndLoadScreen: function(screenId, screenDescription, screenTitle){
    //         ScreenBuilder.addNewScreen({
    //             id: screenId,
    //             routeName: screenId,
    //             title: screenTitle,
    //             description: screenDescription,
    //             predefined: false
    //         }, ADK.ADKApp);

    //         ADK.Navigation.navigate(screenId);
    //         var channel = ADK.Messaging.getChannel('addAppletsChannel');
    //         channel.trigger('addApplets');
    //     },
    //     updateTitleCountdown: function(){
    //         if($(this.$el.find('.form-group')[0]).hasClass('has-error')){
    //             $(this.$el.find('.form-group')[0]).removeClass('has-error');
    //         }
    //         // if($(this.$el.find('.errMsg')).hasClass('has-error')){
    //         //     $(this.$el.find('.errMsg')).text('');
    //         //     $(this.$el.find('.errMsg')).removeClass('has-error');
    //         // }
    //         var remainingChars = 30 - this.$el.find('form #screen-title')[0].value.length;
    //         this.$el.find('.title-countdown').text(remainingChars + ' characters remaining');
    //     },
    //     updateDescriptionCountdown: function(){
    //         if($(this.$el.find('.form-group')[1]).hasClass('has-error')){
    //             $(this.$el.find('.form-group')[1]).removeClass('has-error');
    //         }
    //         var remainingChars = 140 - this.$el.find('form #screen-description')[0].value.length;
    //         this.$el.find('.description-countdown').text(remainingChars + ' characters remaining');
    //     }
    // });
    // return AddScreenView;
});

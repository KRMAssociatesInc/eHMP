define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'api/Messaging',
    'bootstrap-notify'
], function(Backbone, Marionette, $, Handlebars, Messaging, BootstrapNotify) {
    'use strict';

    var NotificationAlert = function(options) {
        var alertOptions = options || {};
        this.show = function() {
            var notify = $.notify;
            notify({
                // options go here
                icon: this.icon || null,
                title: this.title || null,
                message: this.message || ''
            }, {
                // settings go here
                delay: '10000',
                type: (this.type ? 'custom ' + this.type : 'custom basic'),
                placement: {
                    from: 'top',
                    align: 'right'
                },
                animate: {
                    enter: 'animated bounceIn',
                    exit: 'animated bounceOut'
                },
                z_index: 1060,
                template: '<div data-notify="container" class="growl-alert growl-alert-user col-xs-11 col-sm-3 alert alert-{0}" role="alert">' +
                '   <div class="alert-content">' +
                '       <span data-notify="icon"></span>' +
                '       <span class="notify-message">'+
                '           <span data-notify="title">{1}</span>' +
                '           <span data-notify="message">{2}</span>'+
                '       </span>' +
                '       <button type="button" class="close" data-notify="dismiss" title="Press enter to close the alert, or wait ten seconds for autodismissal"><i class="fa fa-times"></i></button>' +
                '       <div class="progress" data-notify="progressbar">' +
                '           <div class="progress-bar progress-bar-{0}" role="progressbar" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100" style="width: 0%;"></div>' +
                '       </div>' +
                '       <a href="{3}" target="{4}" data-notify="url"></a>' +
                '   </div>' +
                '</div>',
                onShown: function() {
                        // focus growl alert so screen reader reads it.
                        $(this).focus();
                    }
                    // onClosed: function() {
                    //     // focus wherever you'd like to focus within this function
                    //     $(this).focus();
                    // }
            });
            return true;
        };
        this.message = alertOptions.message || alertOptions.notificationText || '';
        this.type = alertOptions.type || alertOptions.notificationType || null;
        this.title = alertOptions.title || '';
        this.icon = (alertOptions.icon ? 'fa ' + alertOptions.icon : undefined);
    };

    NotificationAlert.hide = function() {
        $.notifyClose();
    };
    return NotificationAlert;


});
define([
    "backbone",
    "jquery",
    "marionette",
    "underscore",
    'api/Messaging',
    "hbs!main/components/views/popupTemplate"
], function(Backbone, $, Marionette, _, Messaging, PopupTemplate) {

    var defaultPopup = {
        title: '',
        header: '',
        body: '',
        footer: '',
        buttons: true
    };
    var model = new Backbone.Model(defaultPopup);

    var clearsession = false;

    /**
     * PopupView pop up rendering using bootstrap.
     * based on application usage. After 12 min of inactivity a popup
     */
    var PopupView = Backbone.Marionette.ItemView.extend({
        tag: 'div',
        attributes: {
            'role': 'dialog',
            'tabindex': '-1'
        },
        id: 'base-modal',
        className: 'modal fade',
        template: PopupTemplate,
        regions: {
            dialog: '#autologoff-alert-dialog'
        },
        events: {
            "shown.bs.modal": "focus",
            "click #ContBtn": "continue",
            "click #LgtBtn": "logoff",
            'show.bs.modal': function() {
                this.isVisible = true;
            },
            'hide.bs.modal': function() {
                this.isVisible = false;
                this.triggerContinue();
            }
        },

        modelEvents: {
            'change': 'fieldsChanged'
        },

        fieldsChanged: function() {
            this.show();
        },

        initialize: function() {
            _(this).bindAll();
            this.render();
        },

        continue: function(e) {
            e.preventDefault();
            //reset the model
            this.resetModel();
            //hide it
            this.hide();
        },

        resetModel: function() {
            this.setModel(defaultPopup, true);
        },

        show: function() {
            clearsession = false;
            this.render();
            this.$el.modal('show');
            $(this.dialog).show();
        },

        hide: function() {
            this.$el.modal('hide');
        },

        dialogReset: function() {
            $(this.dialog).blur();
            this.dialog.reset();
        },

        triggerContinue: function() {
            if (clearsession === false) {
                //only allow the refresh to happen when we click continue
                Messaging.trigger('autologoff:continue');
                //reset the model
                this.setModel(defaultPopup, true);
            }
        },

        focus: function() {
            $(this.dialog).focus();
        },

        logoff: function(e) {
            //be sure to logoff
            clearsession = true;
            this.hide();
            this.setModel(defaultPopup, true);
            Messaging.trigger('app:logout');
        },

        logout: function(popup) {
            this.setModel(popup, true);
            if (this.isVisible) {
                this.render();
            } else {
                this.show();
            }
            clearsession = true;
            // be sure logoff gets called
            Messaging.trigger('app:logout');
            this.resetModel();
        },

        setModel: function(popup, silent) {
            if (!_.isBoolean(silent)) {
                silent = false;
            }
            this.model.set(popup, {
                'silent': silent
            });
        },

        getDefaultModel: function() {
            return _.clone(defaultPopup);
        }


    });

    var popup = new PopupView({
        model: model
    });

    return popup;
});
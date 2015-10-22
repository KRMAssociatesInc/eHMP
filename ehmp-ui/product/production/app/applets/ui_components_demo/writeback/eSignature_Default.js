define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    var FIELDS = {
        control: "container",
        extraClasses: ["modal-body"],
        items: [{
            control: "container",
            template: Handlebars.compile('{{noteTitle}}'),
            modelListeners: ["currTime"]
        }, {
            control: "input",
            type: "password",
            name: "eSignature",
            label: "Enter Electronic Signature Code"
        }]
    };

    var modalFooter = {
        control: "container",
        extraClasses: ["modal-footer"],
        items: [{
            control: "container",
            extraClasses: ["row"],
            items: [{
                control: "button",
                id: 'form-cancel-btn',
                extraClasses: ["btn-sm"],
                type: "button",
                label: "Cancel"
            }, {
                control: "button",
                extraClasses: ["btn-primary", "btn-sm"],
                label: "Sign",
                name: "signBtn",
                id: "form-sign-btn",
                disabled: true
            }]
        }]
    };

    var F568Fields = [FIELDS, modalFooter];

    var cancelButton = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{ui-button "Cancel" title="Click button to cancel your action!"}}'),
        events: {
            'click': function() {
                ADK.UI.Alert.hide();
            }
        }
    });
    var continueButton = Backbone.Marionette.ItemView.extend({
        template: Handlebars.compile('{{ui-button "Continue" classes="btn-success" title="Click button to continue your action!"}}'),
        events: {
            'click': function() {
                ADK.UI.Alert.hide();
                ADK.UI.Workflow.hide();
            }
        }
    });
    var eSignatureForm = ADK.UI.Form.extend({
        ui: {
            "signBtn": ".signBtn"
        },
        fields: F568Fields,
        events: {
            "click #form-cancel-btn": function(e) {
                e.preventDefault();
                var cancelAlertView = new ADK.UI.Alert({
                    title: 'Special Alert',
                    icon: 'fa-bell-o',
                    message: 'You will lose progress if you cancel this lab order. Would you like to proceed?',
                    buttons: [cancelButton, continueButton]
                });
                cancelAlertView.show();
            },
            "submit": function(e) {
                e.preventDefault();
                if (!this.model.isValid())
                    this.model.set("formStatus", {
                        status: "error",
                        message: self.model.validationError
                    });
                else {
                    this.model.unset("formStatus");
                    this.workflow.goToNext();
                }
                return false;
            }
        },
        modelEvents: {
            'change:eSignature': function(model) {
                var signature = model.get('eSignature');
                if (signature) {
                    this.$(this.ui.signBtn).find('button').attr('disabled', false).removeClass('disabled');
                } else {
                    this.$(this.ui.signBtn).find('button').attr('disabled', true).addClass('disabled');
                }
            }
        }
    });

    return eSignatureForm;
});

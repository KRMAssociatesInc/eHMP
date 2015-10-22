define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars'
], function(Backbone, Marionette, $, Handlebars) {

    var F568 = {

        createForm: function() {

            var pickList1 = new Backbone.Collection([{
                name: '001',
                label: 'SC',
                value: true
            }, {
                name: '002',
                label: 'CV',
                value: false
            }, {
                name: '003',
                label: 'AO',
                value: undefined
            }]);


            var topContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        tagName: "p",
                        template: Handlebars.compile('<strong>Please indicate if the order is related to the following treatment factors.<br>All Orders Except Controlled Substance Orders.</strong>')
                    }]
                }]
            }

            var toggleOptionsChecklist = {
                control: "container",
                extraClasses: ["esign-order-box"],
                items: [{
                    control: "container",
                    // extraClasses: ["col-xs-12", "header", "blank"],
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        // extraClasses: ["col-esign-lg", "blank"]
                        extraClasses: ["col-md-6"]
                            // items: [{
                            //
                            // }]
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2"],
                        items: [{
                            control: "button",
                            type: "button",
                            label: "SC",
                            extraClasses: ["btn-primary", "btn-sm"]
                        }]
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2"],
                        items: [{
                            control: "button",
                            type: "button",
                            label: "CV",
                            extraClasses: ["btn-primary", "btn-sm"]
                        }]
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2"],
                        items: [{
                            control: "button",
                            type: "button",
                            label: "AO",
                            extraClasses: ["btn-primary", "btn-sm"]
                        }]
                    }]
                }, {
                    control: "container",
                    extraClasses: ["col-xs-12", "row", "form-group"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-md-6"],
                        template: "Sodium Chloride Tab 1gm Take two tablets by mouth 5XD Quantity: 300  Refill: 0"
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2", "faux-center"],
                        items: [{
                            control: "fieldset",
                            // legend: "Basic fieldset",
                            items: [{
                                control: "container",
                                extraClasses: ["radio"],
                                items: [{
                                    control: "radio",
                                    name: "radioValue",
                                    // label: "radio label",
                                    options: [{
                                        label: "Yes",
                                        value: "yes",
                                        // title: "Option 1"
                                    }, {
                                        label: "No",
                                        value: "no",
                                        // title: "Option 2"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2", "faux-center"],
                        items: [{
                            control: "fieldset",
                            // legend: "Basic fieldset",
                            items: [{
                                control: "container",
                                extraClasses: ["radio"],
                                items: [{
                                    control: "radio",
                                    name: "radioValue",
                                    // label: "radio label",
                                    options: [{
                                        label: "Yes",
                                        value: "yes",
                                        // title: "Option 1"
                                    }, {
                                        label: "No",
                                        value: "no",
                                        // title: "Option 2"
                                    }]
                                }]
                            }]
                        }]
                    }, {
                        control: "container",
                        // extraClasses: ["col-esign-sm", "center"],
                        extraClasses: ["col-md-2", "faux-center"],
                        items: [{
                            control: "fieldset",
                            // legend: "Basic fieldset",
                            items: [{
                                control: "container",
                                extraClasses: ["radio"],
                                items: [{
                                    control: "radio",
                                    name: "radioValue",
                                    // label: "radio label",
                                    options: [{
                                        label: "Yes",
                                        value: "yes",
                                        // title: "Option 1"
                                    }, {
                                        label: "No",
                                        value: "no",
                                        // title: "Option 2"
                                    }]
                                }]
                            }]
                        }]
                    }]
                }]

            }


            var toggleOptionsChecklistContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [toggleOptionsChecklist]
                }]
            }

            var eSignatureContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "spacer"
                    }, {
                        control: "container",
                        extraClasses: ["form-group"],
                        items: [{
                            control: "input",
                            name: "eSignatureInputValue",
                            label: "Enter Electronic Signature Code",
                            title: "Please sign"
                        }]
                    }]
                }]
            }

            var bottomContainer = {
                control: "container",
                extraClasses: ["row"],
                items: [{
                    control: "container",
                    extraClasses: ["col-xs-12"],
                    items: [{
                        control: "container",
                        extraClasses: ["order-preview"],
                        template: Handlebars.compile('<p>Service Connection &amp; Rated Disabilities</p><p>Service Connected: 10%</p><p>Rated Disabilities: None Stated</p>')
                    }]
                }]
            }



            var FIELDS = {
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [topContainer, toggleOptionsChecklistContainer, eSignatureContainer, bottomContainer]
                }]
            };

            // var FIELDS2 = {
            //     control: "container",
            //     extraClasses: ["modal-body"],
            //     items: [{
            //         control: "container",
            //         template: Handlebars.compile('{{noteTitle}}'),
            //         modelListeners: ["currTime"]
            //     }, {
            //         control: "input",
            //         type: "password",
            //         name: "eSignature",
            //         label: "Enter Electronic Signature Code"
            //     }]
            // };

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

            var FormModel = Backbone.Model.extend({
                defaults: {
                    noteTitle: "Note Title - 09/09/2015 03:30",
                    eSignature: "",
                    substanceChecklist: undefined,
                    connectPercent: "10%",
                    disabilityStated: "None Stated"
                }
            });

            var DeleteMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you delete this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var CloseMessageView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('You will lose all work in progress if you close this task. Would you like to proceed?'),
                tagName: 'p'
            });
            var FooterView = Backbone.Marionette.ItemView.extend({
                template: Handlebars.compile('{{ui-button "Cancel" classes="btn-default" title="Click button to cancel your action!"}}{{ui-button "Continue" classes="btn-primary" title="Click button to continue your action!"}}'),
                events: {
                    'click .btn-primary': function() {
                        ADK.UI.Alert.hide();
                        ADK.UI.Workflow.hide();
                    },
                    'click .btn-default': function() {
                        ADK.UI.Alert.hide();
                    }
                },
                tagName: 'span'
            });

            var eSignatureForm = ADK.UI.Form.extend({
                ui: {
                    "signBtn": ".signBtn"
                },
                fields: F568Fields,
                events: {
                    "click #form-cancel-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-warning',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        closeAlertView.show();
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
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Form Signed',
                                icon: 'fa-check',
                                message: 'Form successfully signed with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
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

            var formModel = new FormModel();

            var workflowOptions = {
                title: "Sign",
                showProgress: false,
                headerOptions:{
                    actionItems: [{
                        label: 'Close',
                        onClick: function(){ 
                            ADK.UI.Workflow.hide();
                        } 
                    }] 
                },
                steps: [{
                    view: eSignatureForm,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F568;
});

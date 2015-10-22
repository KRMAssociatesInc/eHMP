define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
    'hbs!demo_files/feature_forms/supporting_templates/F433_summaryTemplate'
], function(Backbone, Marionette, $, Handlebars, SummaryTemplate) {

    var F360 = {
        createForm: function() {
            var F360Fields = [{
                //*************************** Modal Body START ***************************
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row", "row-subheader"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "alertBanner", //Patient is taking other drug that may react with this one
                                name: "alertMessage1",
                                type: "warning",
                                dismissible: true,
                                title: "Warning Title",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Drug allergy
                                name: "alertMessage2",
                                type: "warning",
                                dismissible: true,
                                title: "Warning Title",
                                icon: "fa-warning"
                            }, {
                                control: "alertBanner", //Duplicate order - Dummy text
                                name: "alertMessage3",
                                type: "warning",
                                dismissible: true,
                                title: "Warning Title",
                                icon: "fa-warning"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row", "section-divider"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('<p class="required-note">* indicates a required field.</class></p>'),
                            items: [{
                                control: "select",
                                name: "outpatientMed",
                                label: "Select an Outpatient Med",
                                required: true,
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }, {
                                    value: "opt4",
                                    label: "Option 4"
                                }, {
                                    value: "opt5",
                                    label: "Option 5"
                                }]
                            }]
                        }]
                    }]
                }]

            }, { //*************************** Modal Footer START ***************************
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-3"]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-9"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            type: 'button'
                        }, {
                            control: "button",
                            extraClasses: ["btn-default", "btn-sm"],
                            label: "Next",
                            id: "continue-btn"
                        }]
                    }]
                }]
            }];

            var F360Fields2 = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["scroll-enter-form"],
                    items: [{
                        control: "container",
                        extraClasses: ["row row-subheader"],
                        items: [{ 
                            control: "alertBanner", //Patient is taking other drug that may react with this one
                            name: "alertMessage1",
                            type: "warning",
                            dismissible: true,
                            title: "Warning Title",
                            icon: "fa-warning"
                        }, {
                            control: "alertBanner", //Drug allergy
                            name: "alertMessage2",
                            type: "warning",
                            dismissible: true,
                            title: "Warning Title",
                            icon: "fa-warning"
                        }, {
                            control: "alertBanner", //Duplicate order - Dummy text
                            name: "alertMessage3",
                            type: "warning",
                            dismissible: true,
                            title: "Warning Title",
                            icon: "fa-warning"
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('<h5>{{outpatientMed}}</h5><hr>'),
                            modelListeners: ["outpatientMed"]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "dosage",
                                label: "Dosage",
                                required: true,
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "route",
                                label: "Route",
                                required: true,
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "select",
                                name: "schedule",
                                label: "Schedule",
                                required: true,
                                pickList: [{
                                    value: "opt1",
                                    label: "Option 1"
                                }, {
                                    value: "opt2",
                                    label: "Option 2"
                                }, {
                                    value: "opt3",
                                    label: "Option 3"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "checkbox",
                                name: "prn",
                                label: "PRN"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "input",
                                name: "daySupply",
                                label: "Day Supply",
                                type: "number",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-md-6"],
                            items: [{
                                control: "input",
                                name: "quantity",
                                label: "Quantity",
                                type: "number",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "input",
                                name: "refill",
                                label: "Refills",
                                type: "number"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "radio",
                                name: "pickUp",
                                label: "Pick Up",
                                options: [{
                                    value: "clinic",
                                    label: "Clinic"
                                }, {
                                    value: "mail",
                                    label: "Mail"
                                }, {
                                    value: "window",
                                    label: "Window"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "radio",
                                name: "priority",
                                label: "Priority",
                                options: [{
                                    value: "asap",
                                    label: "ASAP"
                                }, {
                                    value: "done",
                                    label: "Done"
                                }, {
                                    value: "routine",
                                    label: "Routine"
                                }, {
                                    value: "stat",
                                    label: "Stat"
                                }]
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "textarea",
                                label: "Comment",
                                name: "comment",
                                rows: 3
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["order-preview"],
                        template: SummaryTemplate,
                        modelListeners: ["outpatientMed", "dosage", "route", "schedule", "quantity",
                            "refill", "pickUp", "priority", "comment"
                        ]
                    }]
                }]
            }, {
                control: "container",
                extraClasses: ["modal-footer"],
                items: [{
                    control: "container",
                    extraClasses: ["row"],
                    items: [{
                        control: "container",
                        extraClasses: ["col-xs-3"]
                    }, {
                        control: "container",
                        extraClasses: ["col-xs-9"],
                        items: [{
                            control: "button",
                            id: "delete-btn",
                            extraClasses: ["icon-btn"],
                            label: "",
                            icon: "fa-trash-o fa-lg",
                            type: 'button'
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Close",
                            id: "close-btn"
                        }, {
                            control: "button",
                            type: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            label: "Back",
                            id: "back-btn"
                        }, {
                            control: 'dropdown',
                            split: false,
                            label: 'Single button dropdown',
                            id: 'dropdown-b',
                            extraClasses: ['ping', 'pong'],
                            items: [
                                { label: 'Sub Item 1', id: 'item-1', extraClasses: ['extra-class-a', 'extra-class-b'] },
                                { label: 'Sub Item 2', id: 'item-2', extraClasses: ['extra-class-c', 'extra-class-d'] }
                            ]
                        }
                        // , {
                        //     control: 'dropdown',
                        //     split: true,
                        //     label: 'Accept',
                        //     id: 'acceptDropdown',
                        //     type: 'submit',
                        //     items: [{
                        //         label: 'Accept',
                        //         id: 'accept',
                        //     }, { 
                        //         label: 'Accept & Add Another', 
                        //         id: 'acceptAdd', 
                        //     },{ 
                        //         label: 'Accept & Sign', 
                        //         id: 'acceptSign',
                        //     }]
                        // }
                        ]
                    }]
                }]
            }];

            var FormModel = Backbone.Model.extend({
                defaults: {
                    outpatientMed: "opt1",
                    alertMessage1: "",
                    alertMessage2: "",
                    alertMessage3: ""
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

            var formView1 = ADK.UI.Form.extend({
                ui: {},
                fields: F360Fields,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
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
                    }
                },
                modelEvents: {
                    'change:outpatientMed': function(model) {
                        var med = model.get('outpatientMed');

                        if (med === 'opt1') {
                            this.model.unset('alertMessage1');
                            this.model.unset('alertMessage2');
                            this.model.unset('alertMessage3');
                        } else if (med === 'opt2') {
                            this.model.set('alertMessage1', 'Patient is currently prescribed Comadin. Using Sodium Bicarbonate and Coumadin together may cause exessive bleeding');
                            this.model.unset('alertMessage2');
                            this.model.unset('alertMessage3');
                        } else if (med === 'opt3') {
                            this.model.set('alertMessage2', 'Patient has known allergy to Sodium Bicarbonate');
                            this.model.unset('alertMessage1');
                            this.model.unset('alertMessage3');
                        } else if (med === 'opt4') {
                            this.model.set('alertMessage3', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry');
                            this.model.unset('alertMessage2');
                            this.model.unset('alertMessage1');
                        } else if (med === 'opt5') {
                            this.model.set('alertMessage1', 'Patient is currently prescribed Comadin. Using Sodium Bicarbonate and Coumadin together may cause exessive bleeding');
                            this.model.set('alertMessage2', 'Patient has known allergy to Sodium Bicarbonate');
                            this.model.set('alertMessage3', 'Lorem Ipsum is simply dummy text of the printing and typesetting industry');
                        }
                    }
                }
            });

            var formView2 = ADK.UI.Form.extend({
                ui: {
                    "daySupply": ".daySupply",
                    "quantity": ".quantity"
                },
                fields: F360Fields2,
                events: {
                    "click #delete-btn": function(e) {
                        e.preventDefault();
                        var deleteAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to delete?',
                            icon: 'fa-warning',
                            messageView: DeleteMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
                    },
                    "click #back-btn": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            this.workflow.goToPrevious();
                        }
                    },
                    "click #close-btn": function(e) {
                        e.preventDefault();
                        var closeAlertView = new ADK.UI.Alert({
                            title: 'Are you sure you want to close this form?',
                            icon: 'fa-warning',
                            messageView: CloseMessageView,
                            footerView: FooterView
                        });
                        deleteAlertView.show();
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
                                title: 'Outpatient Medication Order Submitted',
                                icon: "fa-check",
                                message: 'Outpatient medication order successfully submitted with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }

                        return false;
                    }
                },
                modelEvents: {
                    // none
                }
            });

            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "Enter Task",
                showProgress: true,
                keyboard: true,
                headerOptions:{
                    actionItems: [{
                        label: 'Close',
                        onClick: function(){ 
                            ADK.UI.Workflow.hide();
                        } 
                    }] 
                },
                steps: [{
                    view: formView1,
                    viewModel: formModel,
                    stepTitle: 'Select a Task'
                }, {
                    view: formView2,
                    viewModel: formModel,
                    stepTitle: 'Enter Order Info'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
        }
    };
    return F360;
});
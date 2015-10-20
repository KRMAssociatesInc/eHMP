define([
    'backbone',
    'marionette',
    'jquery',
    'handlebars',
], function(Backbone, Marionette, $, Handlebars) {

    //=============================================================================================================
    // PLEASE DO NOT COPY AND PASTE THIS FULL FILE. PLEASE JUST USE AS A REFERENCE AND COPY PARTS THAT ARE NEEDED
    // for more information on how to layout this form for your applet please checkout the following link:
    // http://10.1.1.150/documentation/#/adk/conventions#Writeback
    //=============================================================================================================

    var F226 = {
        // DO NOT USE CREATE FORM FUNCTION --- THIS IS FOR DEMO PURPOSES ONLY!!!
        createForm: function() {
            // *********************************************** STATIC ARRAY *****************************************
            // NOTE: PICKLIST IS ONLY FOR THIS DEMO EXAMPLE
            var timeZonesArray = [{
                group: 'Group 1',
                pickList: [{
                    value: 'opt1',
                    label: 'Option 1'
                }, {
                    value: 'opt2',
                    label: 'Option 2'
                }]
            }, {
                group: 'Group 2',
                pickList: [{
                    value: 'opt3',
                    label: 'Option 3'
                }, {
                    value: 'opt4',
                    label: 'Option 4'
                }, {
                    value: 'opt5',
                    label: 'Option 5'
                }, {
                    value: 'opt6',
                    label: 'Option 6'
                }]
            }, {
                group: 'Group 3',
                pickList: [{
                    value: 'opt7',
                    label: 'Option 7'
                }, {
                    value: 'opt8',
                    label: 'Option 8'
                }, {
                    value: 'opt9',
                    label: 'Option 9'
                }]
            }];
            // *********************************************** END OF STATIC ARRAY **********************************

            // *********************************************** FIELDS ***************************************************
            // Okay to copy and paste
            var F226Fields = [{
                control: "container",
                extraClasses: ["modal-body"],
                items: [{
                    control: "container",
                    extraClasses: ["container-fluid"],
                    items: [{
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            template: Handlebars.compile('<p class="required-note">* indicates a required field.</class></p>'),
                            items: [{
                                control: "select",
                                name: "title",
                                label: "Title",
                                title: "Press enter to browse through select options",
                                pickList: timeZonesArray,
                                showFilter: true,
                                groupEnabled: true,
                                required: true
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "datepicker",
                                name: "notesCalendar",
                                title: "Please enter in a date in the following format, MM/DD/YYYY",
                                label: "Date",
                                required: true
                            }]
                        }, {
                            control: "container",
                            extraClasses: ["col-xs-6"],
                            items: [{
                                control: "timepicker",
                                name: "notesTime",
                                title: "Please enter in a time in the following format, HH:MM",
                                label: "Time",
                                required: true,
                                placeholder: "HH:MM"
                            }]
                        }]
                    }, {
                        control: "container",
                        extraClasses: ["row"],
                        items: [{
                            control: "container",
                            extraClasses: ["col-xs-12"],
                            items: [{
                                control: "textarea",
                                name: "moreInfo",
                                title: "Please enter in note details",
                                label: "Note",
                                rows: 9,
                                required: true
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
                            id: "form-close-btn",
                            extraClasses: ["btn-primary", "btn-sm"],
                            title: "Press enter to save and close note",
                            label: "Close",
                            type: 'button'
                        }, {
                            control: "button",
                            extraClasses: ["btn-primary", "btn-sm"],
                            title: "Press enter to sign note",
                            label: "Sign",
                            id: "form-sign-btn"
                        }]
                    }]
                }]
            }];
            // *********************************************** END OF FIELDS ********************************************

            // *********************************************** MODEL ****************************************************
            // Okay to copy and paste - Please Add additional items to prepopulate the fields
            var FormModel = Backbone.Model.extend({
                defaults: {
                    name: ""
                }
            });
            // *********************************************** END OF MODEL *********************************************

            // *********************************************** VIEWS **********************************************
            // Okay to copy and paste - WITH 1 EXCEPTION (see below)
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

            var formView = ADK.UI.Form.extend({
                ui: {},
                fields: F226Fields,
                events: {
                    "click #form-close-btn": function(e) {
                        if (!this.model.isValid())
                            this.model.set("formStatus", {
                                status: "error",
                                message: self.model.validationError
                            });
                        else {
                            this.model.unset("formStatus");
                            var saveAlertView = new ADK.UI.Notification({
                                title: 'Note Submitted',
                                icon: 'fa-check',
                                message: 'Note successfully saved with no errors.',
                                type: "success"
                            });
                            saveAlertView.show();
                            ADK.UI.Workflow.hide();
                        }
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

                            // ********************* Go to signature form here *********************

                            ADK.UI.Workflow.hide();
                        }
                        return false;
                    }
                },
                modelEvents: {
                    // none
                }
            });
            // *********************************************** END OF FORM VIEW *****************************************

            // *********************************************** MODEL AND WORKFLOW INSTANCE ******************************
            // Okay to copy and paste
            var formModel = new FormModel();

            var workflowOptions = {
                size: "large",
                title: "New Note",
                showProgress: false,
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
                    view: formView,
                    viewModel: formModel,
                    stepTitle: 'Step 1'
                }]
            };
            var workflow = new ADK.UI.Workflow(workflowOptions);
            workflow.show();
            // *********************************************** END OF MODEL AND WORKFLOW INSTANCE ***********************
        }
    };
    return F226;
});